#!/usr/bin/env node

import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const TASK_CLASSES = new Set(['PATCH', 'INTEGRATION', 'DEVELOPMENT', 'SYSTEM', 'RELEASE']);
const PRODUCTION_TASK_CLASSES = new Set(['DEVELOPMENT', 'SYSTEM', 'RELEASE']);
const REQUIRED_METADATA = [
  'task_class',
  'delivery_required',
  'visual_required',
  'independent_review_required',
];

function fail(message) {
  throw new Error(message);
}

function validateMetadata(matrix) {
  for (const field of REQUIRED_METADATA) {
    if (!(field in matrix)) fail(`Acceptance metadata is missing ${field}`);
  }

  if (typeof matrix.task_class !== 'string' || !TASK_CLASSES.has(matrix.task_class)) {
    fail(`Unsupported task_class: ${matrix.task_class || 'missing'}`);
  }

  for (const field of REQUIRED_METADATA.slice(1)) {
    if (typeof matrix[field] !== 'boolean') {
      fail(`Acceptance metadata ${field} must be boolean`);
    }
  }
}

function mandatoryCriterionIds(matrix) {
  const required = PRODUCTION_TASK_CLASSES.has(matrix.task_class)
    ? ['source_restore', 'scope_integrity', 'profile_checks', 'spec_lint_preflight', 'independent_review']
    : [];

  if (matrix.delivery_required) {
    required.push('git_diff_review', 'commit', 'push', 'remote_readback');
  }
  if (matrix.visual_required) {
    required.push('browser_render', 'desktop_evidence', 'mobile_evidence', 'visual_review');
  }
  if (matrix.independent_review_required) {
    required.push('independent_auditor');
  }

  return required;
}

function validateCriteria(matrix) {
  if (!Array.isArray(matrix.criteria) || matrix.criteria.length === 0) {
    fail('Acceptance matrix is missing or empty');
  }

  const ids = new Set();
  for (const [index, criterion] of matrix.criteria.entries()) {
    for (const field of ['id', 'criterion', 'expected', 'how_to_verify', 'status']) {
      if (typeof criterion?.[field] !== 'string' || criterion[field].trim() === '') {
        fail(`Criterion ${index + 1} is missing ${field}`);
      }
    }
    const evidence = criterion?.evidence;
    if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) {
      fail(`Criterion ${index + 1} requires a material evidence object`);
    }
    const evidenceText = Object.entries(evidence).filter(([, value]) => typeof value === 'string').map(([key, value]) => `${key}=${value}`).join('; ');
    const artifactPath = typeof evidence.artifact_path === 'string' ? evidence.artifact_path.trim() : '';
    const artifactSha256 = typeof evidence.artifact_sha256 === 'string' ? evidence.artifact_sha256.trim().toLowerCase() : '';
    if (!artifactPath || !/^[a-f0-9]{64}$/.test(artifactSha256) || !/(measurement|measured|inspection|screenshot|readback|hash|command|output)/i.test(evidenceText)) {
      fail(`Criterion ${index + 1} lacks material artifact/measurement evidence`);
    }
    const resolvedArtifact = path.isAbsolute(artifactPath) ? artifactPath : path.resolve(process.cwd(), artifactPath);
    try {
      const stat = fs.statSync(resolvedArtifact);
      if (!stat.isFile() || stat.size === 0) fail(`Criterion ${index + 1} artifact is missing or empty: ${artifactPath}`);
      const actualSha256 = createHash('sha256').update(fs.readFileSync(resolvedArtifact)).digest('hex');
      if (actualSha256 !== artifactSha256) fail(`Criterion ${index + 1} artifact hash mismatch: ${artifactPath}`);
    } catch {
      fail(`Criterion ${index + 1} artifact is unreadable: ${artifactPath}`);
    }
    if (!/^[a-z0-9_]+$/.test(criterion.id)) {
      fail(`Criterion ${index + 1} has invalid id ${criterion.id}`);
    }
    if (ids.has(criterion.id)) fail(`Duplicate criterion id: ${criterion.id}`);
    ids.add(criterion.id);
    if (criterion.status !== 'PASS') {
      fail(`Criterion ${criterion.id} is ${criterion.status}; VERIFIED is forbidden`);
    }
  }

  for (const id of mandatoryCriterionIds(matrix)) {
    if (!ids.has(id)) fail(`Mandatory criterion is missing: ${id}`);
  }
}

function validateVerifier(verifier) {
  if (!verifier || verifier.independent !== true) {
    fail('Independent completion auditor evidence is missing');
  }
  if (
    typeof verifier.reviewer !== 'string'
    || verifier.reviewer.trim() === ''
    || verifier.reviewer === 'executor'
  ) {
    fail('Reviewer identity is not independent');
  }
  if (
    verifier.acceptance_received_directly !== true
    || verifier.original_request_received_directly !== true
  ) {
    fail('Auditor did not receive original request and acceptance directly');
  }
  if (verifier.verdict !== 'PASS') {
    fail(`Auditor verdict is ${verifier.verdict || 'missing'}; VERIFIED is forbidden`);
  }
}

export function verifyGate(matrix, verifier) {
  if (!matrix || typeof matrix !== 'object') fail('Acceptance matrix is missing');
  validateMetadata(matrix);
  validateCriteria(matrix);
  validateVerifier(verifier);
  return 'VERIFIED';
}

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function validFixture() {
  const ids = [
    'source_restore',
    'scope_integrity',
    'profile_checks',
    'spec_lint_preflight',
    'independent_review',
    'git_diff_review',
    'commit',
    'push',
    'remote_readback',
    'independent_auditor',
  ];
  return {
    task_class: 'SYSTEM',
    delivery_required: true,
    visual_required: false,
    independent_review_required: true,
    criteria: ids.map((id) => ({
      id,
      criterion: id,
      expected: 'PASS evidence',
      how_to_verify: 'read actual fixture evidence',
      evidence: { artifact_path: 'tests/fixtures/second-brain/repair-acceptance-matrix.json', artifact_sha256: createHash('sha256').update(fs.readFileSync('tests/fixtures/second-brain/repair-acceptance-matrix.json')).digest('hex'), measurement: 'verified output', inspection: `independent check for ${id}` },
      status: 'PASS',
    })),
  };
}

function validVerifier() {
  return {
    independent: true,
    reviewer: 'DOKRUTI Completion Auditor',
    acceptance_received_directly: true,
    original_request_received_directly: true,
    verdict: 'PASS',
  };
}

function expectBlocked(label, matrix, verifier = validVerifier()) {
  let blocked = false;
  try {
    verifyGate(matrix, verifier);
  } catch {
    blocked = true;
  }
  if (!blocked) fail(`Negative test failed: ${label}`);
}

function selfTest() {
  const valid = validFixture();
  verifyGate(valid, validVerifier());

  expectBlocked(
    'UNKNOWN criterion',
    {
      ...valid,
      criteria: valid.criteria.map((criterion) => (
        criterion.id === 'push' ? { ...criterion, status: 'UNKNOWN' } : criterion
      )),
    },
  );

  expectBlocked(
    'self-report evidence',
    { ...valid, criteria: valid.criteria.map((criterion) => ({ ...criterion, evidence: { artifact_path: 'tests/fixtures/second-brain/repair-acceptance-matrix.json', artifact_sha256: '0'.repeat(64), measurement: 'looks good' } })) },
  );

  expectBlocked(
    'missing mandatory push',
    { ...valid, criteria: valid.criteria.filter((criterion) => criterion.id !== 'push') },
  );

  expectBlocked(
    'missing SPEC-LINT preflight',
    { ...valid, criteria: valid.criteria.filter((criterion) => criterion.id !== 'spec_lint_preflight') },
  );

  expectBlocked(
    'missing remote_readback',
    { ...valid, criteria: valid.criteria.filter((criterion) => criterion.id !== 'remote_readback') },
  );

  expectBlocked(
    'visual evidence missing browser/mobile',
    { ...valid, visual_required: true },
  );

  expectBlocked(
    'independent reviewer missing',
    valid,
    { ...validVerifier(), independent: false },
  );

  verifyGate(valid, validVerifier());
  return 'SELF_TEST_PASS: mandatory completion gates and negative tests enforced';
}

if (process.argv[2] === '--self-test') {
  try {
    console.log(selfTest());
  } catch (error) {
    console.error(`SELF_TEST_FAIL: ${error.message}`);
    process.exitCode = 1;
  }
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
