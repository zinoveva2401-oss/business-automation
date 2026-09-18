#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = path.join(root, 'tests', 'fixtures', 'second-brain');
const packet = path.join(fixtures, 'repair-acceptance-matrix.json');
const expectedPacketSha = '7B0EC449DF82AD8AD4F52C9D6D1532AA4498B0D838A96572338312F6FB02B22F';
function runNode(script, args = []) { return execFileSync(process.execPath, [path.join(root, script), ...args], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 8 * 1024 * 1024 }).trim(); }
function jsonOutput(output) { const start = output.lastIndexOf('\n{'); return JSON.parse(start >= 0 ? output.slice(start + 1) : output); }
function result(id, status, evidence) { return { id, status, evidence }; }
function pass(id, evidence) { return result(id, 'EXECUTABLE PASS', evidence); }
function review(id, evidence) { return result(id, 'INDEPENDENT REVIEW REQUIRED', evidence); }
function fail(id, evidence) { return result(id, 'FAIL', evidence); }
function runGate() { return pass('completion-gate-preflight', runNode('scripts/verify-completion-gate.mjs', ['--self-test'])); }
function runSpec() {
  const packetSha = createHash('sha256').update(fs.readFileSync(packet)).digest('hex').toUpperCase();
  const evidenceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dokruti-harness-'));
  const evidencePath = path.join(evidenceDir, 'preflight.json');
  const preflight = jsonOutput(runNode('scripts/run-spec-lint-preflight.mjs', [packet, evidencePath]));
  return packetSha === expectedPacketSha && preflight.packet_sha256 === expectedPacketSha && preflight.spec_lint?.status === 'PASS'
    ? pass('spec-lint-preflight', { evidencePath, packetSha, preflight })
    : fail('spec-lint-preflight', { evidencePath, packetSha, preflight });
}
function runConflict() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dokruti-spec-conflict-'));
  const contradictory = path.join(dir, 'contradictory.json');
  fs.writeFileSync(contradictory, JSON.stringify({ task_class: 'SYSTEM', required_paths: ['docs/ai'], forbidden_paths: ['docs/ai/CODEX_RUNTIME.md'], source_of_truth: ['owner'], acceptance: [{ id: 'x', evidence: 'artifact=x' }], production_changes_allowed: false, production_roots: ['src'], installation_allowed: false, dependencies: [], delivery_required: false }));
  const check = spawnSync(process.execPath, [path.join(root, 'scripts/spec-lint-v2.mjs'), contradictory], { cwd: root, encoding: 'utf8' });
  const output = `${check.stdout}\n${check.stderr}`;
  return check.status !== 0 && output.includes('path_scope_conflict') ? pass('spec-lint-conflict-negative', output.trim()) : fail('spec-lint-conflict-negative', output.trim());
}
function runGolden() { return jsonOutput(runNode('scripts/second-brain-executable-golden.mjs', ['--run'])); }
function goldenSuite(golden, id) { const item = golden.results.find((entry) => entry.id === id); return item ? item : fail(id, 'golden result missing'); }
function runBrowserRecord() {
  const evidence = JSON.parse(fs.readFileSync(path.join(fixtures, 'visual', 'browser-evidence.json'), 'utf8'));
  const screenshotArtifacts = evidence.material_screenshot_artifacts.map((artifact) => ({ path: artifact, exists: fs.existsSync(path.join(root, artifact)), bytes: fs.existsSync(path.join(root, artifact)) ? fs.statSync(path.join(root, artifact)).size : 0 }));
  const valid = evidence.captured_by.includes('CUA browser')
    && evidence.material_evidence.includes('screenshots emitted in Codex chat')
    && screenshotArtifacts.every((artifact) => artifact.exists && artifact.bytes > 0)
    && evidence.desktop.viewport.innerWidth === 1280
    && evidence.mobile.viewport.innerWidth === 390
    && evidence.mobile.viewport.innerWidth <= 430
    && evidence.mobile.document.horizontal_overflow === false
    && evidence.desktop.motion_time_sample_changed_transform === true
    && evidence.product_smoke.computed_conversion === '8.00%'
    && evidence.product_smoke.computed_return_rate === '9.4%';
  return valid ? review('browser-desktop-mobile-evidence', { ...evidence, screenshot_artifacts: screenshotArtifacts }) : fail('browser-desktop-mobile-evidence', { ...evidence, screenshot_artifacts: screenshotArtifacts });
}
function runVisualContract() {
  const html = fs.readFileSync(path.join(fixtures, 'visual', 'index.html'), 'utf8');
  const valid = html.includes('data-brand-version="8.2"') && html.includes('#D9562F') && html.includes('#2F80ED') && !html.includes('#d9ff63') && !html.includes('data-viewport');
  return valid ? review('visual-brand-contract', { brand_source: '02_Бренд-система', version: '8.2', reason: 'independent visual/art review remains required' }) : fail('visual-brand-contract', 'current Brand SOT contract mismatch');
}
function runSecurity() { return pass('security-baseline', runNode('scripts/security-baseline-scan.mjs', ['--self-test'])); }
function runMarkers() { const scan = spawnSync('git', ['grep', '-nE', '^(<<<<<<< |>>>>>>> |=======)$', '--', 'AGENTS.md', 'docs', 'scripts', 'tests'], { cwd: root, encoding: 'utf8' }); return scan.status === 1 ? pass('conflict-marker-scan', '0 markers in scoped runtime/test paths') : fail('conflict-marker-scan', `${scan.stdout}\n${scan.stderr}`.trim()); }
function runPolicy() { const files = ['AGENTS.md', 'docs/ai/CODEX_RUNTIME.md', 'docs/ai/COMPLETION_GATE.md', 'docs/ai/HANDOFF_PROTOCOL.md']; const text = files.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n'); const valid = text.includes('READ-ONLY') && text.includes('remote readback') && text.includes('PUSH !=') && text.includes('tracked-file delta'); return valid ? pass('cross-document-git-policy', 'four contract documents include default tracked-delta delivery and PUSH != MERGE') : fail('cross-document-git-policy', 'required policy terms missing'); }
function main() {
  const golden = runGolden();
  const results = [runGate(), runSpec(), runConflict(), goldenSuite(golden, 'product-real-flow'), goldenSuite(golden, 'dashboard-real-flow'), goldenSuite(golden, 'media-real-production'), goldenSuite(golden, 'video-real-exam'), goldenSuite(golden, 'automation-retry-idempotency'), goldenSuite(golden, 'performance-real-transformation'), goldenSuite(golden, 'slow-network-measurement'), goldenSuite(golden, 'weak-input-quality-challenge'), goldenSuite(golden, 'asset-intelligence'), goldenSuite(golden, 'second-brain-end-to-end-proof'), goldenSuite(golden, 'novel-multi-domain-reasoning'), goldenSuite(golden, 'motion-implementation'), runBrowserRecord(), runVisualContract(), runSecurity(), runMarkers(), runPolicy()];
  const failed = results.filter((item) => item.status === 'FAIL');
  const blocked = results.filter((item) => item.status === 'BLOCKED CAPABILITY');
  const reviews = results.filter((item) => item.status === 'INDEPENDENT REVIEW REQUIRED');
  const output = { status: failed.length ? 'FAIL' : blocked.length ? 'BLOCKED_CAPABILITY' : reviews.length ? 'PASS_WITH_INDEPENDENT_REVIEW' : 'PASS', total: results.length, executable_passed: results.filter((item) => item.status === 'EXECUTABLE PASS').length, independent_review_required: reviews.length, blocked_capabilities: blocked.map((item) => item.id), failed: failed.map((item) => item.id), results };
  console.log(JSON.stringify(output, null, 2));
  if (failed.length || blocked.length) process.exitCode = 1;
}
main();
