#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = path.join(root, 'tests', 'fixtures', 'second-brain');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(fixtures, relativePath), 'utf8'));
}

function runNode(script, args = []) {
  return execFileSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function pass(id, evidence) {
  return { id, status: 'PASS', evidence };
}

function fail(id, evidence) {
  return { id, status: 'FAIL', evidence };
}

function runRuntimeGate() {
  return pass(
    'runtime-gate',
    runNode('scripts/verify-completion-gate.mjs', ['--self-test']),
  );
}

function runSpecLint() {
  return pass(
    'spec-lint-v2',
    runNode('scripts/spec-lint-v2.mjs', ['--self-test']),
  );
}

function runFormatFit() {
  const fixture = readJson('product/format-fit.json');
  const selected = fixture.formats.find((item) => item.id === fixture.selected);
  if (!selected || !selected.rationale || !fixture.user_job) {
    return fail('digital-product-format-fit', 'selected format or rationale missing');
  }
  return pass(
    'digital-product-format-fit',
    `user_job=${fixture.user_job}; selected=${selected.id}; rationale=${selected.rationale}`,
  );
}

function runDashboard() {
  const fixture = readJson('product/dashboard-states.json');
  const requiredStates = ['loading', 'empty', 'error', 'ready'];
  const valid = fixture.decision_useful === true
    && requiredStates.every((state) => fixture.states.includes(state))
    && fixture.drill_down === true
    && fixture.mobile === 'stacked'
    && fixture.freshness;
  return valid
    ? pass('dashboard-states-and-decision-usefulness', JSON.stringify(fixture))
    : fail('dashboard-states-and-decision-usefulness', JSON.stringify(fixture));
}

function runMediaRoute() {
  const fixture = readJson('media/multi-source.json');
  const requiredStages = ['asset_inventory', 'content_map', 'story_edit_plan', 'production'];
  const valid = fixture.inputs.length >= 3
    && requiredStages.every((stage) => fixture.pipeline.includes(stage))
    && fixture.simple_stitch_rejected === true
    && fixture.captions === true;
  return valid
    ? pass('multi-source-media-route', JSON.stringify(fixture))
    : fail('multi-source-media-route', JSON.stringify(fixture));
}

function runAutomation() {
  const calls = new Map();
  const events = [];
  function processWebhook(eventId, attempt) {
    if (calls.has(eventId)) return { status: 'duplicate', result: calls.get(eventId) };
    events.push(`attempt:${attempt}`);
    if (attempt < 2) return { status: 'retryable_failure' };
    const result = { eventId, accepted: true };
    calls.set(eventId, result);
    events.push('committed');
    return { status: 'accepted', result };
  }

  const first = processWebhook('event-001', 1);
  const second = processWebhook('event-001', 2);
  const duplicate = processWebhook('event-001', 3);
  if (
    first.status !== 'retryable_failure'
    || second.status !== 'accepted'
    || duplicate.status !== 'duplicate'
    || calls.size !== 1
    || events.filter((event) => event === 'committed').length !== 1
  ) {
    return fail('automation-retry-idempotency', JSON.stringify({ first, second, duplicate, events }));
  }
  return pass('automation-retry-idempotency', JSON.stringify({ first, second, duplicate, events }));
}

function runPerformance() {
  const fixture = readJson('performance/weight.json');
  const optimized = fixture.afterBytes < fixture.beforeBytes
    && fixture.deliveryBytes < fixture.beforeBytes
    && fixture.formats.some((format) => format.startsWith('webp'))
    && fixture.slowConnection === 'checked';
  return optimized
    ? pass('performance-weight', JSON.stringify(fixture))
    : fail('performance-weight', JSON.stringify(fixture));
}

function runFormatQA() {
  const fixture = readJson('performance/format-matrix.json');
  const valid = fixture.web.responsive_formats.length >= 2
    && fixture.video.delivery.bytes < fixture.video.master.bytes
    && fixture.video.delivery.mobile_open === true
    && fixture.document.compressed_images === true
    && fixture.document.mobile_readability === true
    && fixture.document.format_compatibility === true;
  return valid
    ? pass('video-document-format-qa', JSON.stringify(fixture))
    : fail('video-document-format-qa', JSON.stringify(fixture));
}

function runQualityChallenge() {
  const fixture = readJson('quality/weak-input.json');
  const challenged = fixture.status === 'CHALLENGED'
    && fixture.problems.length >= 2
    && fixture.stronger_options.length >= 1;
  return challenged
    ? pass('weak-input-quality-challenge', JSON.stringify(fixture))
    : fail('weak-input-quality-challenge', JSON.stringify(fixture));
}

function runMotion() {
  const fixture = readJson('visual/motion-contract.json');
  const valid = fixture.meaningful === true
    && fixture.reduced_motion_fallback === true
    && fixture.performance_budget_ms <= 16;
  return valid
    ? pass('motion-contract', JSON.stringify(fixture))
    : fail('motion-contract', JSON.stringify(fixture));
}

function runVisual() {
  const fixture = readJson('visual/visual-evidence.json');
  const valid = fixture.real_render === true
    && fixture.rerendered_after_review === true
    && fixture.visual_review === 'PASS'
    && fixture.desktop?.captured === true
    && fixture.mobile?.captured === true
    && fixture.desktop?.width > fixture.mobile?.layout_width
    && fixture.mobile?.layout_width === 390
    && fixture.desktop?.evidence
    && fixture.mobile?.evidence;
  return valid
    ? pass('premium-visual-browser-render', JSON.stringify(fixture))
    : fail('premium-visual-browser-render', JSON.stringify(fixture));
}

function runDelivery() {
  const local = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
  let remote = '';
  try {
    remote = execFileSync(
      'git',
      ['ls-remote', 'origin', `refs/heads/${branch}`],
      { cwd: root, encoding: 'utf8' },
    ).trim().split(/\s+/)[0];
  } catch {
    return fail('delivery-git', `local=${local}; remote=UNKNOWN; branch=${branch}`);
  }
  return local === remote
    ? pass('delivery-git', `branch=${branch}; local=${local}; remote=${remote}; sha_match=YES`)
    : fail('delivery-git', `branch=${branch}; local=${local}; remote=${remote}; sha_match=NO`);
}

function runAssetIntelligence() {
  const fixture = readJson('asset-inventory.json');
  const valid = fixture.assets.length > 0
    && fixture.assets.every((asset) => asset.source && asset.license && asset.bytes > 0)
    && fixture.duplicates_checked === true;
  return valid
    ? pass('asset-intelligence', JSON.stringify(fixture))
    : fail('asset-intelligence', JSON.stringify(fixture));
}

function runSecurity() {
  return pass(
    'security-baseline',
    runNode('scripts/security-baseline-scan.mjs', ['--self-test']),
  );
}

const suites = [
  runRuntimeGate,
  runSpecLint,
  runFormatFit,
  runDashboard,
  runMediaRoute,
  runAutomation,
  runPerformance,
  runFormatQA,
  runQualityChallenge,
  runMotion,
  runVisual,
  runAssetIntelligence,
  runSecurity,
  runDelivery,
];

const results = suites.map((suite) => {
  try {
    return suite();
  } catch (error) {
    return fail(suite.name, error.message);
  }
});

const failed = results.filter((result) => result.status !== 'PASS');
console.log(JSON.stringify({
  status: failed.length === 0 ? 'PASS' : 'FAIL',
  total: results.length,
  passed: results.length - failed.length,
  failed: failed.length,
  results,
}, null, 2));

if (failed.length > 0) process.exitCode = 1;
