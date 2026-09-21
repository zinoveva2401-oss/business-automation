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
const ACCEPTANCE_LANES = new Set(['technical', 'visual', 'product', 'media', 'content']);
const READY_FOR_INDEPENDENT_QA = 'READY_FOR_INDEPENDENT_QA';

function completionIntegrityFail(message) {
  throw new Error(`COMPLETION_INTEGRITY_FAIL + STOPPED_INCOMPLETE: ${message}`);
}

function normalizeArtifactIdentity(artifactPath, artifactSha256) {
  const resolved = path.isAbsolute(artifactPath) ? artifactPath : path.resolve(process.cwd(), artifactPath);
  return `${path.normalize(resolved).toLowerCase()}|${artifactSha256.toLowerCase()}`;
}

function verifyMaterialArtifact(artifactPath, artifactSha256, label) {
  if (typeof artifactPath !== 'string' || artifactPath.trim() === '' || !/^[a-f0-9]{64}$/i.test(artifactSha256 || '')) {
    completionIntegrityFail(`${label} requires a path and SHA256`);
  }

  const normalizedPath = artifactPath.trim();
  const normalizedSha = artifactSha256.trim().toLowerCase();
  const resolvedArtifact = path.isAbsolute(normalizedPath) ? normalizedPath : path.resolve(process.cwd(), normalizedPath);
  try {
    const stat = fs.statSync(resolvedArtifact);
    if (!stat.isFile() || stat.size === 0) completionIntegrityFail(`${label} artifact is missing or empty: ${normalizedPath}`);
    const actualSha256 = createHash('sha256').update(fs.readFileSync(resolvedArtifact)).digest('hex');
    if (actualSha256 !== normalizedSha) completionIntegrityFail(`${label} artifact hash mismatch: ${normalizedPath}`);
  } catch (error) {
    if (error.message.includes(`${label} `)) throw error;
    completionIntegrityFail(`${label} artifact is unreadable: ${normalizedPath}`);
  }

  return normalizeArtifactIdentity(normalizedPath, normalizedSha);
}

function requireNonEmptyEvidenceFields(evidence, fields, criterionId) {
  for (const field of fields) {
    if (typeof evidence[field] !== 'string' || evidence[field].trim() === '') {
      completionIntegrityFail(`Criterion ${criterionId} evidence is missing ${field}`);
    }
  }
}

function validateArtifactTruthEvidence(evidence, criterionId, genericIdentity) {
  requireNonEmptyEvidenceFields(evidence, [
    'expected_observable_delta',
    'actual_final_location',
    'final_artifact_path',
    'final_artifact_sha256',
    'reviewed_artifact_path',
    'reviewed_artifact_sha256',
    'actual_inspection',
  ], criterionId);

  const finalIdentity = verifyMaterialArtifact(evidence.final_artifact_path, evidence.final_artifact_sha256, `${criterionId} final`);
  const reviewedIdentity = verifyMaterialArtifact(evidence.reviewed_artifact_path, evidence.reviewed_artifact_sha256, `${criterionId} reviewed`);
  if (finalIdentity !== reviewedIdentity) {
    completionIntegrityFail(`Criterion ${criterionId} reviewed artifact is not the final artifact`);
  }
  if (genericIdentity !== finalIdentity) {
    completionIntegrityFail(`Criterion ${criterionId} generic evidence artifact is not the final artifact`);
  }
}

function validateReferenceFidelityEvidence(evidence, criterionId, genericIdentity) {
  requireNonEmptyEvidenceFields(evidence, [
    'before_artifact_path',
    'before_artifact_sha256',
    'reference_artifact_path',
    'reference_artifact_sha256',
    'after_artifact_path',
    'after_artifact_sha256',
    'final_artifact_path',
    'final_artifact_sha256',
    'actual_inspection',
  ], criterionId);

  const identities = [
    verifyMaterialArtifact(evidence.before_artifact_path, evidence.before_artifact_sha256, `${criterionId} before`),
    verifyMaterialArtifact(evidence.reference_artifact_path, evidence.reference_artifact_sha256, `${criterionId} reference`),
    verifyMaterialArtifact(evidence.after_artifact_path, evidence.after_artifact_sha256, `${criterionId} after`),
  ];
  if (new Set(identities).size !== identities.length) {
    completionIntegrityFail(`Criterion ${criterionId} before/reference/after artifacts must be distinct`);
  }

  const finalIdentity = verifyMaterialArtifact(evidence.final_artifact_path, evidence.final_artifact_sha256, `${criterionId} final`);
  if (finalIdentity !== identities[2]) {
    completionIntegrityFail(`Criterion ${criterionId} final artifact is not the reviewed after artifact`);
  }
  if (genericIdentity !== finalIdentity) {
    completionIntegrityFail(`Criterion ${criterionId} generic evidence artifact is not the final after artifact`);
  }
}

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
    ? ['source_restore', 'scope_integrity', 'profile_checks', 'spec_lint_preflight', 'internal_review_board', 'artifact_truth']
    : [];

  if (matrix.delivery_required) {
    required.push('git_diff_review', 'commit', 'push', 'remote_readback');
  }
  if (matrix.visual_required) {
    required.push('browser_render', 'desktop_evidence', 'mobile_evidence', 'visual_review', 'reference_fidelity');
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
  const observedLanes = new Set();
  for (const [index, criterion] of matrix.criteria.entries()) {
    for (const field of ['id', 'criterion', 'expected', 'how_to_verify', 'status']) {
      if (typeof criterion?.[field] !== 'string' || criterion[field].trim() === '') {
        fail(`Criterion ${index + 1} is missing ${field}`);
      }
    }
    if (criterion.lane !== undefined) {
      if (typeof criterion.lane !== 'string' || !ACCEPTANCE_LANES.has(criterion.lane)) {
        fail(`Criterion ${index + 1} has invalid lane ${criterion.lane || 'missing'}`);
      }
      observedLanes.add(criterion.lane);
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
    if (criterion.id === 'artifact_truth') {
      validateArtifactTruthEvidence(evidence, criterion.id, artifactIdentity);
    }
    if (criterion.id === 'reference_fidelity') {
      validateReferenceFidelityEvidence(evidence, criterion.id, artifactIdentity);
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

  if (matrix.mixed_customer_facing_artifact === true) {
    const requiredLanes = Array.isArray(matrix.required_lanes) && matrix.required_lanes.length > 0
      ? matrix.required_lanes
      : [...ACCEPTANCE_LANES];
    for (const lane of requiredLanes) {
      if (!ACCEPTANCE_LANES.has(lane)) fail(`Unsupported required lane: ${lane}`);
      if (!observedLanes.has(lane)) fail(`Mixed artifact lane is missing: ${lane}`);
    }
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
    'artifact_truth',
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
    artifact_truth: '.codex/config.toml',
    independent_review: 'docs/ai/SECOND_BRAIN_GOLDEN_TESTS_2026-09-17.md',
    git_diff_review: 'scripts/verify-completion-gate.mjs',
    commit: 'scripts/skill-regression-harness.mjs',
    push: 'scripts/security-baseline-scan.mjs',
    remote_readback: 'tests/fixtures/second-brain/product/brief.json',
    independent_auditor: 'tests/fixtures/second-brain/proof/human-task.json',
  };
  const laneById = {
    source_restore: 'technical',
    scope_integrity: 'visual',
    profile_checks: 'content',
    spec_lint_preflight: 'media',
    internal_review_board: 'product',
    artifact_truth: 'technical',
    independent_review: 'product',
    git_diff_review: 'technical',
    commit: 'technical',
    push: 'technical',
    remote_readback: 'technical',
    independent_auditor: 'content',
  };
  return {
    task_class: 'SYSTEM',
    delivery_required: true,
    visual_required: false,
    independent_review_required: true,
    mixed_customer_facing_artifact: true,
    required_lanes: ['technical', 'visual', 'product', 'media', 'content'],
    criteria: ids.map((id) => {
      const artifactPath = artifactByCriterion[id];
      const artifactSha256 = createHash('sha256').update(fs.readFileSync(artifactPath)).digest('hex');
      const evidence = {
        criterion_id: id,
        artifact_path: artifactPath,
        artifact_sha256: artifactSha256,
        claim: `criterion-specific evidence for ${id}`,
        measurement: `verified output for ${id}`,
        inspection: `independent check for ${id}`,
      };
      if (id === 'artifact_truth') {
        Object.assign(evidence, {
          expected_observable_delta: 'runtime gate contains material final-artifact truth checks',
          actual_final_location: '.codex/config.toml',
          final_artifact_path: artifactPath,
          final_artifact_sha256: artifactSha256,
          reviewed_artifact_path: artifactPath,
          reviewed_artifact_sha256: artifactSha256,
          actual_inspection: 'hash and content inspection for artifact_truth',
        });
      }
      return {
        id,
        lane: laneById[id],
        criterion: id,
        expected: 'PASS evidence',
        how_to_verify: 'read actual fixture evidence',
        evidence,
        status: 'PASS',
      };
    }),
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

function materialCriterion(id, lane, artifactPath, evidenceOverrides = {}) {
  const artifactSha256 = createHash('sha256').update(fs.readFileSync(artifactPath)).digest('hex');
  return {
    id,
    lane,
    criterion: id,
    expected: 'PASS evidence',
    how_to_verify: 'read actual fixture evidence',
    evidence: {
      criterion_id: id,
      artifact_path: artifactPath,
      artifact_sha256: artifactSha256,
      claim: `criterion-specific evidence for ${id}`,
      measurement: `verified output for ${id}`,
      inspection: `independent check for ${id}`,
      ...evidenceOverrides,
    },
    status: 'PASS',
  };
}

function visualFixture() {
  const matrix = validFixture();
  const beforePath = 'tests/fixtures/second-brain/visual/index.html';
  const referencePath = 'tests/fixtures/second-brain/asset-inventory.json';
  const afterPath = 'tests/fixtures/second-brain/visual/browser-evidence.json';
  const beforeSha = createHash('sha256').update(fs.readFileSync(beforePath)).digest('hex');
  const referenceSha = createHash('sha256').update(fs.readFileSync(referencePath)).digest('hex');
  const afterSha = createHash('sha256').update(fs.readFileSync(afterPath)).digest('hex');
  matrix.visual_required = true;
  matrix.criteria.push(
    materialCriterion('browser_render', 'visual', 'tests/fixtures/second-brain/visual/evidence/desktop-1280.png'),
    materialCriterion('desktop_evidence', 'visual', 'tests/fixtures/second-brain/visual/evidence/mobile-390.png'),
    materialCriterion('mobile_evidence', 'visual', 'tests/fixtures/second-brain/visual/evidence/network-baseline.png'),
    materialCriterion('visual_review', 'visual', 'tests/fixtures/second-brain/visual/visual-evidence.json'),
    materialCriterion('reference_fidelity', 'visual', afterPath, {
      before_artifact_path: beforePath,
      before_artifact_sha256: beforeSha,
      reference_artifact_path: referencePath,
      reference_artifact_sha256: referenceSha,
      after_artifact_path: afterPath,
      after_artifact_sha256: afterSha,
      final_artifact_path: afterPath,
      final_artifact_sha256: afterSha,
      actual_inspection: 'before/reference/after identity and final hash inspection for reference_fidelity',
    }),
  );
  return matrix;
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

function expectIntegrityBlocked(label, matrix) {
  try {
    verifyGate(matrix, executorCreatedVerifierFixture());
  } catch (error) {
    if (!error.message.includes('COMPLETION_INTEGRITY_FAIL + STOPPED_INCOMPLETE')) {
      fail(`Integrity status missing: ${label}`);
    }
    return;
  }
  fail(`Negative integrity test failed: ${label}`);
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
    'producer PASS report without artifact_truth',
    { ...valid, criteria: valid.criteria.filter((criterion) => criterion.id !== 'artifact_truth') },
  );

  const visual = visualFixture();
  expectStatus(
    'valid visual artifact/reference evidence reaches only READY_FOR_INDEPENDENT_QA',
    verifyGate(visual, executorCreatedVerifier),
    READY_FOR_INDEPENDENT_QA,
  );

  expectBlocked(
    'visual task missing reference_fidelity',
    { ...visual, criteria: visual.criteria.filter((criterion) => criterion.id !== 'reference_fidelity') },
  );

  expectBlocked(
    'before and after are the same artifact/hash',
    {
      ...visual,
      criteria: visual.criteria.map((criterion) => {
        if (criterion.id !== 'reference_fidelity') return criterion;
        return {
          ...criterion,
          evidence: {
            ...criterion.evidence,
            after_artifact_path: criterion.evidence.before_artifact_path,
            after_artifact_sha256: criterion.evidence['before_artifact_sha256'],
            final_artifact_path: criterion.evidence.before_artifact_path,
            final_artifact_sha256: criterion.evidence['before_artifact_sha256'],
            artifact_path: criterion.evidence.before_artifact_path,
            artifact_sha256: criterion.evidence['before_artifact_sha256'],
          },
        };
      }),
    },
  );

  expectIntegrityBlocked(
    'final artifact path/hash does not match evidence',
    {
      ...valid,
      criteria: valid.criteria.map((criterion) => (
        criterion.id === 'artifact_truth'
          ? { ...criterion, evidence: { ...criterion.evidence, final_artifact_sha256: '0'.repeat(64) } }
          : criterion
      )),
    },
  );

  expectBlocked(
    'self-authored build/commit-only evidence',
    {
      ...valid,
      criteria: valid.criteria.map((criterion) => (
        criterion.id === 'artifact_truth'
          ? { ...criterion, evidence: { criterion_id: 'artifact_truth', artifact_path: 'scripts/skill-regression-harness.mjs', artifact_sha256: createHash('sha256').update(fs.readFileSync('scripts/skill-regression-harness.mjs')).digest('hex'), claim: 'build PASS and commit PASS', measurement: 'build log says PASS', inspection: 'commit log says PASS' } }
          : criterion
      )),
    },
  );

  expectBlocked(
    'reviewed candidate is not the final artifact',
    {
      ...valid,
      criteria: valid.criteria.map((criterion) => (
        criterion.id === 'artifact_truth'
          ? { ...criterion, evidence: { ...criterion.evidence, reviewed_artifact_path: 'AGENTS.md', reviewed_artifact_sha256: createHash('sha256').update(fs.readFileSync('AGENTS.md')).digest('hex') } }
          : criterion
      )),
    },
  );

  expectBlocked(
    'technical lane PASS cannot override visual fidelity FAIL',
    {
      ...visual,
      criteria: visual.criteria.map((criterion) => (
        criterion.id === 'reference_fidelity' ? { ...criterion, status: 'FAIL' } : criterion
      )),
    },
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
    'visual lane failure cannot be overridden by technical PASS',
    {
      ...valid,
      criteria: valid.criteria.map((criterion) => (
        criterion.id === 'scope_integrity' ? { ...criterion, status: 'FAIL' } : criterion
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
