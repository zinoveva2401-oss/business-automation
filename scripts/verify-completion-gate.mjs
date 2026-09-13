#!/usr/bin/env node

import fs from 'node:fs';

function fail(message) {
  throw new Error(message);
}

export function verifyGate(matrix, verifier) {
  if (!matrix || !Array.isArray(matrix.criteria) || matrix.criteria.length === 0) {
    fail('Acceptance matrix is missing or empty');
  }

  for (const [index, criterion] of matrix.criteria.entries()) {
    for (const field of ['criterion', 'expected', 'how_to_verify', 'evidence', 'status']) {
      if (typeof criterion[field] !== 'string' || criterion[field].trim() === '') {
        fail(`Criterion ${index + 1} is missing ${field}`);
      }
    }
    if (criterion.status !== 'PASS') {
      fail(`Criterion ${index + 1} is ${criterion.status}; VERIFIED is forbidden`);
    }
  }

  if (!verifier || verifier.independent !== true) {
    fail('Independent completion auditor evidence is missing');
  }
  if (typeof verifier.reviewer !== 'string' || verifier.reviewer.trim() === '' || verifier.reviewer === 'executor') {
    fail('Reviewer identity is not independent');
  }
  if (verifier.acceptance_received_directly !== true || verifier.original_request_received_directly !== true) {
    fail('Auditor did not receive original request and acceptance directly');
  }
  if (verifier.verdict !== 'PASS') {
    fail(`Auditor verdict is ${verifier.verdict || 'missing'}; VERIFIED is forbidden`);
  }

  return 'VERIFIED';
}

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function selfTest() {
  const criterion = {
    criterion: 'controlled criterion',
    expected: 'PASS evidence',
    how_to_verify: 'read actual object',
    evidence: 'verified object: test-fixture',
    status: 'PASS',
  };
  const verifier = {
    independent: true,
    reviewer: 'DOKRUTI Completion Auditor',
    acceptance_received_directly: true,
    original_request_received_directly: true,
    verdict: 'PASS',
  };
  verifyGate({ criteria: [criterion] }, verifier);
  let blocked = false;
  try {
    verifyGate({ criteria: [{ ...criterion, status: 'UNKNOWN' }] }, verifier);
  } catch {
    blocked = true;
  }
  if (!blocked) fail('False-pass regression failed: UNKNOWN was accepted');
  return 'SELF_TEST_PASS: incomplete acceptance is blocked';
}

if (process.argv[2] === '--self-test') {
  console.log(selfTest());
} else {
  const [, , matrixPath, verifierPath] = process.argv;
  if (!matrixPath || !verifierPath) {
    console.error('Usage: node scripts/verify-completion-gate.mjs <acceptance.json> <verifier.json>');
    process.exitCode = 2;
  } else {
    try {
      console.log(verifyGate(loadJson(matrixPath), loadJson(verifierPath)));
    } catch (error) {
      console.error(`BLOCKED: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
