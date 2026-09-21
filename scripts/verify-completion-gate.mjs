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
const READY_FOR_INDEPENDENT_QA = 'READY_FOR_INDEPENDENT_QA';

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
    ? ['source_restore', 'scope_integrity', 'profile_checks', 'spec_lint_preflight', 'internal_review_board']
    : [];

  if (matrix.delivery_required) {
    required.push('git_diff_review', 'commit', 'push', 'remote_readback');
  }
  if (matrix.visual_required) {
    required.push('browser_render', 'desktop_evidence', 'mobile_evidence', 'visual_review');
  }
  if (matrix.independent_review_required) {
    required.push('independent_review', 'independent_auditor');
  }

  return required;
}

function validateCriteria(matrix) {
  if (!Array.isArray(matrix.criteria) || matrix.criteria.length === 0) {
    fail('Acceptance matrix is missing or empty');
  }

  const ids = new Set();
  const artifactIdentities = new Set();
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
    const evidenceCriterionId = typeof evidence.criterion_id === 'string' ? evidence.criterion_id.trim() : '';
    const evidenceClaim = typeof evidence.claim === 'string' ? evidence.claim.trim() : '';
    if (evidenceCriterionId !== criterion.id || !evidenceClaim) {
      fail(`Criterion ${index + 1} evidence is not criterion-specific`);
    }
    const evidenceText = Object.entries(evidence).filter(([, value]) => typeof value === 'string').map(([key, value]) => `${key}=${value}`).join('; ');
    const artifactPath = typeof evidence.artifact_path === 'string' ? evidence.artifact_path.trim() : '';
    const artifactSha256 = typeof evidence.artifact_sha256 === 'string' ? evidence.artifact_sha256.trim().toLowerCase() : '';
    const relevanceText = `${evidenceClaim} ${evidence.measurement || ''} ${evidence.inspection || ''}`;
    if (!artifactPath || !/^[a-f0-9]{64}$/.test(artifactSha256) || !relevanceText.toLowerCase().includes(criterion.id.toLowerCase()) || !/(measurement|measured|inspection|screenshot|readback|hash|command|output)/i.test(evidenceText)) {
      fail(`Criterion ${index + 1} lacks material artifact/measurement evidence`);
    }
    const resolvedArtifact = path.isAbsolute(artifactPath) ? artifactPath : path.resolve(process.cwd(), artifactPath);
    const artifactIdentity = `${path.normalize(resolvedArtifact).toLowerCase()}|${artifactSha256}`;
    if (artifactIdentities.has(artifactIdentity)) {
      fail(`Criterion ${criterion.id} reuses artifact identity/hash from another criterion`);
    }
    artifactIdentities.add(artifactIdentity);
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

export function verifyGate(matrix) {
  if (!matrix || typeof matrix !== 'object') fail('Acceptance matrix is missing');
  validateMetadata(matrix);
  validateCriteria(matrix);

  // A verifier.json supplied to this process is executor-owned input. Its
  // fields cannot establish provenance for an independent review. Material
  // gates therefore stop at an explicit handoff status whenever external QA
  // is required; only an external Business OS process can later promote it.
  if (matrix.independent_review_required === true) {
    return READY_FOR_INDEPENDENT_QA;
  }

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
    'internal_review_board',
    'independent_review',
    'git_diff_review',
    'commit',
    'push',
    'remote_readback',
    'independent_auditor',
  ];
  const artifactByCriterion = {
    source_restore: 'AGENTS.md',
    scope_integrity: 'docs/ai/CODEX_RUNTIME.md',
    profile_checks: 'docs/ai/COMPLETION_GATE.md',
    spec_lint_preflight: 'docs/ai/SPEC_LINT_V2.md',
    internal_review_board: 'docs/ai/SECOND_BRAIN_REVIEW_BOARD.md',
    independent_review: 'docs/ai/SECOND_BRAIN_GOLDEN_TESTS_2026-09-17.md',
    git_diff_review: 'scripts/verify-completion-gate.mjs',
    commit: 'scripts/skill-regression-harness.mjs',
    push: 'scripts/security-baseline-scan.mjs',
    remote_readback: 'tests/fixtures/second-brain/product/brief.json',
    independent_auditor: 'tests/fixtures/second-brain/proof/human-task.json',
  };
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
      evidence: { criterion_id: id, artifact_path: artifactByCriterion[id], artifact_sha256: createHash('sha256').update(fs.readFileSync(artifactByCriterion[id])).digest('hex'), claim: `criterion-specific evidence for ${id}`, measurement: `verified output for ${id}`, inspection: `independent check for ${id}` },
      status: 'PASS',
    })),
  };
}

function executorCreatedVerifierFixture() {
  return {
    independent: true,
    reviewer: 'DOKRUTI Completion Auditor',
    acceptance_received_directly: true,
    original_request_received_directly: true,
    verdict: 'PASS',
  };
}

function expectBlocked(label, matrix, verifier = executorCreatedVerifierFixture()) {
  let blocked = false;
  try {
    verifyGate(matrix, verifier);
  } catch {
    blocked = true;
  }
  if (!blocked) fail(`Negative test failed: ${label}`);
}

function expectStatus(label, actual, expected) {
  if (actual !== expected) {
    fail(`Status test failed: ${label}; expected ${expected}, received ${actual}`);
  }
}

function selfTest() {
  const valid = validFixture();
  const executorCreatedVerifier = executorCreatedVerifierFixture();
  const localResult = verifyGate(valid, executorCreatedVerifier);
  expectStatus(
    'executor-created verifier cannot produce VERIFIED',
    localResult,
    READY_FOR_INDEPENDENT_QA,
  );
  expectStatus(
    'independent review required has READY_FOR_INDEPENDENT_QA as its maximum local status',
    verifyGate(valid, {
      independent: true,
      reviewer: 'another local label',
      acceptance_received_directly: true,
      original_request_received_directly: true,
      verdict: 'PASS',
    }),
    READY_FOR_INDEPENDENT_QA,
  );

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
    'same arbitrary evidence reused across independent criteria',
    { ...valid, criteria: valid.criteria.map((criterion) => ({ ...criterion, evidence: valid.criteria[0].evidence })) },
  );

  expectBlocked(
    'same artifact with relabeled criterion evidence',
    { ...valid, criteria: valid.criteria.map((criterion) => (criterion.id === 'push'
      ? { ...criterion, evidence: { ...valid.criteria[0].evidence, criterion_id: 'push', claim: 'criterion-specific evidence for push', measurement: 'verified output for push', inspection: 'independent check for push' } }
      : criterion)) },
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
    'missing internal Review Board',
    { ...valid, criteria: valid.criteria.filter((criterion) => criterion.id !== 'internal_review_board') },
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
    'invalid material independent-auditor gate',
    { ...valid, criteria: valid.criteria.map((criterion) => (
      criterion.id === 'independent_auditor' ? { ...criterion, status: 'UNKNOWN' } : criterion
    )) },
    executorCreatedVerifier,
  );

  return 'SELF_TEST_PASS: material gates enforced; executor-created verifier is limited to READY_FOR_INDEPENDENT_QA';
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
