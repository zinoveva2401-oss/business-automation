#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.resolve(root, process.argv[2] || '');
const APPROVED_MANIFEST_BLOB = '867d325f6aec123393575be9bc4736a7f096e167';

function fail(message) {
  throw new Error(`CORE_MANIFEST_FAIL: ${message}`);
}

function git(args) {
  return execFileSync('git', ['-c', `safe.directory=${root}`, ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function verify(manifest) {
  const shaPattern = /^[0-9a-f]{40}$/i;
  if (manifest?.schema_version !== 1
    || manifest.repository !== 'zinoveva2401-oss/business-automation'
    || manifest.core_root !== '.agents/skills/ai-business-os'
    || !shaPattern.test(manifest.base_sha || '')
    || !shaPattern.test(manifest.reviewed_head_sha || '')
    || !Array.isArray(manifest.expected_core_changes)) {
    fail('manifest identity or schema is invalid');
  }

  for (const commit of [manifest.base_sha, manifest.reviewed_head_sha, 'HEAD']) {
    try { git(['cat-file', '-e', `${commit}^{commit}`]); }
    catch { fail(`required commit is unavailable: ${commit}`); }
  }
  try { git(['merge-base', '--is-ancestor', manifest.base_sha, manifest.reviewed_head_sha]); }
  catch { fail('reviewed Core SHA does not descend from the explicit base SHA'); }
  try { git(['merge-base', '--is-ancestor', manifest.reviewed_head_sha, 'HEAD']); }
  catch { fail('checked-out revision does not contain the explicitly reviewed Core SHA'); }

  const changes = manifest.expected_core_changes;
  const paths = changes.map((item) => item?.path);
  if (paths.some((item) => typeof item !== 'string' || !item.startsWith(`${manifest.core_root}/`))
    || new Set(paths).size !== paths.length
    || changes.some((item) => !shaPattern.test(item?.blob_sha || ''))) {
    fail('allowlist contains an invalid path or blob SHA');
  }

  const expectedPaths = [...paths].sort();
  const reviewedPaths = git(['diff', '--name-only', `${manifest.base_sha}...${manifest.reviewed_head_sha}`, '--', manifest.core_root])
    .split(/\r?\n/).filter(Boolean).sort();
  if (reviewedPaths.join('\n') !== expectedPaths.join('\n')) {
    fail(`reviewed Core path set changed; expected ${expectedPaths.join(', ')}, got ${reviewedPaths.join(', ')}`);
  }

  const postReviewPaths = git(['diff', '--name-only', `${manifest.reviewed_head_sha}..HEAD`, '--', manifest.core_root])
    .split(/\r?\n/).filter(Boolean);
  if (postReviewPaths.length) fail(`Core files changed after the reviewed SHA: ${postReviewPaths.join(', ')}`);

  for (const item of changes) {
    const reviewedBlob = git(['rev-parse', `${manifest.reviewed_head_sha}:${item.path}`]).toLowerCase();
    const checkoutBlob = git(['rev-parse', `HEAD:${item.path}`]).toLowerCase();
    const worktreeBlob = git(['hash-object', item.path]).toLowerCase();
    const expectedBlob = item.blob_sha.toLowerCase();
    if (reviewedBlob !== expectedBlob || checkoutBlob !== expectedBlob || worktreeBlob !== expectedBlob) {
      fail(`Core blob differs from the explicit reviewed SHA: ${item.path}`);
    }
  }

  const untracked = git(['ls-files', '--others', '--exclude-standard', '--', manifest.core_root]);
  if (untracked) fail(`untracked files exist inside shared Core: ${untracked}`);

  return `CORE_MANIFEST_PASS: ${changes.length} explicit Core paths match ${manifest.reviewed_head_sha}`;
}

try {
  if (!process.argv[2]) fail('manifest path is required');
  if (git(['hash-object', manifestPath]).toLowerCase() !== APPROVED_MANIFEST_BLOB) {
    fail('manifest bytes differ from the explicitly reviewed allowlist; update the pinned manifest SHA only with review');
  }
  const result = verify(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
  console.log(result);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
