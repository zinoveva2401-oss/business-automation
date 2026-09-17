#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function run(packetPath, evidencePath) {
  const packet = fs.readFileSync(packetPath);
  const lint = spawnSync(process.execPath, [
    path.join(root, 'scripts', 'spec-lint-v2.mjs'),
    packetPath,
  ], { cwd: root, encoding: 'utf8' });
  const evidence = {
    schema_version: 1,
    packet_path: path.relative(root, packetPath).replaceAll('\\', '/'),
    packet_sha256: createHash('sha256').update(packet).digest('hex').toUpperCase(),
    starting_head: git(['rev-parse', 'HEAD']),
    branch: git(['branch', '--show-current']),
    pre_work_status: git(['status', '--short', '--branch']),
    spec_lint: {
      status: lint.status === 0 ? 'PASS' : 'FAIL',
      exit_code: lint.status,
      stdout: lint.stdout.trim(),
      stderr: lint.stderr.trim(),
    },
  };
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
  if (lint.status !== 0) process.exitCode = 1;
  return evidence;
}

function selfTest() {
  const packetPath = path.join(root, 'tests', 'fixtures', 'second-brain', 'repair-acceptance-matrix.json');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dokruti-spec-lint-'));
  const evidencePath = path.join(tempDir, 'preflight.json');
  const evidence = run(packetPath, evidencePath);
  if (evidence.spec_lint.status !== 'PASS'
    || evidence.packet_sha256.length !== 64
    || !evidence.starting_head
    || !evidence.branch
    || !evidence.pre_work_status) {
    throw new Error('SPEC_LINT_PREFLIGHT_SELF_TEST_FAIL');
  }
  console.log(JSON.stringify({ status: 'PASS', evidence_path: evidencePath, evidence }, null, 2));
}

if (process.argv[2] === '--self-test') {
  try { selfTest(); } catch (error) { console.error(error.message); process.exitCode = 1; }
} else {
  const packetPath = path.resolve(root, process.argv[2] || '');
  const evidencePath = path.resolve(root, process.argv[3] || path.join(os.tmpdir(), 'dokruti-spec-lint-preflight.json'));
  if (!process.argv[2]) {
    console.error('Usage: node scripts/run-spec-lint-preflight.mjs <task-packet.json> [evidence.json] | --self-test');
    process.exitCode = 2;
  } else {
    try { console.log(JSON.stringify(run(packetPath, evidencePath), null, 2)); } catch (error) { console.error(`SPEC_LINT_PREFLIGHT_ERROR: ${error.message}`); process.exitCode = 1; }
  }
}
