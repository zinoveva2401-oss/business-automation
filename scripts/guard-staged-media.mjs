#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA_EXTENSIONS = new Set(['.mp4', '.mov', '.wav', '.m4a', '.avi', '.webm', '.jpg', '.jpeg', '.png', '.gif']);
const ALLOWED_MEDIA_PREFIXES = ['public/', 'tests/fixtures/second-brain/visual/evidence/', 'tests/fixtures/second-brain/video/evidence/'];
const PRIVATE_MARKERS = /(?:private|secret|drive|google|ernest|second-brain-golden|task-media|codex-task-media|temp|tmp|appdata|users[\\/])/i;
const MAX_UNLISTED_MEDIA_BYTES = 5 * 1024 * 1024;

function stagedPaths() {
  const output = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=AM', '-z'], { cwd: root });
  return output.toString('utf8').split('\0').filter(Boolean);
}

function checkPath(relative, size = 0) {
  const normalized = relative.replaceAll('\\', '/');
  const extension = path.extname(normalized).toLowerCase();
  const media = MEDIA_EXTENSIONS.has(extension);
  const allowed = ALLOWED_MEDIA_PREFIXES.some((prefix) => normalized.startsWith(prefix));
  const findings = [];
  if (PRIVATE_MARKERS.test(normalized)) findings.push('private-or-task-local-path-marker');
  if (media && !allowed) findings.push('media-outside-allowlist');
  if (media && !allowed && size > MAX_UNLISTED_MEDIA_BYTES) findings.push('unlisted-media-over-5mb');
  return { path: normalized, media, allowed, bytes: size, findings };
}

function selfTest() {
  const cases = [
    [checkPath('public/brand.png', 100), false],
    [checkPath('tests/fixtures/second-brain/video/evidence/contact.png', 100), false],
    [checkPath(['C:', 'Users', 'user', 'private', 'voice.wav'].join('/'), 100), true],
    [checkPath('notes/raw-footage.mp4', 6 * 1024 * 1024), true],
  ];
  const passed = cases.every(([result, shouldFail]) => (result.findings.length > 0) === shouldFail);
  return { status: passed ? 'PASS' : 'FAIL', cases: cases.map(([result, shouldFail]) => ({ ...result, expected_fail: shouldFail })) };
}

if (process.argv.includes('--self-test')) {
  const result = selfTest();
  console.log(JSON.stringify(result, null, 2));
  if (result.status !== 'PASS') process.exitCode = 1;
} else {
  const paths = stagedPaths();
  const checks = paths.map((relative) => {
    let size = 0;
    try { size = Number(execFileSync('git', ['cat-file', '-s', `:${relative}`], { cwd: root, encoding: 'utf8' }).trim()); } catch { /* absent index object is still reported by status */ }
    return checkPath(relative, size);
  });
  const findings = checks.flatMap((check) => check.findings.map((rule) => ({ path: check.path, rule })));
  const result = { status: findings.length === 0 ? 'PASS' : 'FAIL', staged_count: checks.length, checks, findings, policy: 'private/task-local media stays outside the repository; intentional public/evidence media is narrowly allowlisted' };
  console.log(JSON.stringify(result, null, 2));
  if (findings.length > 0) process.exitCode = 1;
}
