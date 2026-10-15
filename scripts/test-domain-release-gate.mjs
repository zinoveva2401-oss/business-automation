#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { verifyDomainRelease } from './verify-domain-release.mjs';

const required = [
  'source_restore', 'scope_integrity', 'profile_checks', 'spec_lint_preflight', 'internal_review_board',
  'artifact_truth', 'git_diff_review', 'commit', 'push', 'remote_readback',
  'browser_render', 'desktop_evidence', 'mobile_evidence', 'visual_review', 'reference_fidelity',
  'independent_review', 'independent_auditor',
];

function putProof(dir, name, content = `measured evidence for ${name}`) {
  const file = path.join(dir, `${name}.txt`);
  fs.writeFileSync(file, content);
  return { path: file, sha: createHash('sha256').update(fs.readFileSync(file)).digest('hex') };
}

function matrixFor(domain, dir) {
  const criteria = required.map((id) => {
    let proof = putProof(dir, id);
    const evidence = {
      criterion_id: id,
      claim: `measured ${id} result`,
      artifact_path: proof.path,
      artifact_sha256: proof.sha,
      measurement: `measured ${id} output`,
      inspection: `inspected ${id} artifact`,
    };
    if (id === 'artifact_truth') {
      evidence.expected_observable_delta = 'release candidate contains reviewed deliverable';
      evidence.actual_final_location = proof.path;
      evidence.final_artifact_path = proof.path;
      evidence.final_artifact_sha256 = proof.sha;
      evidence.reviewed_artifact_path = proof.path;
      evidence.reviewed_artifact_sha256 = proof.sha;
      evidence.actual_inspection = 'read final file and compare exact SHA-256';
    }
    if (id === 'reference_fidelity') {
      const before = putProof(dir, `${domain}-before`);
      const reference = putProof(dir, `${domain}-reference`);
      const after = putProof(dir, `${domain}-after`);
      proof = after;
      Object.assign(evidence, {
        artifact_path: after.path,
        artifact_sha256: after.sha,
        before_artifact_path: before.path,
        before_artifact_sha256: before.sha,
        reference_artifact_path: reference.path,
        reference_artifact_sha256: reference.sha,
        after_artifact_path: after.path,
        after_artifact_sha256: after.sha,
        final_artifact_path: after.path,
        final_artifact_sha256: after.sha,
        actual_inspection: 'compare the distinct before, reference, after, and final artifact hashes',
      });
    }
    return {
      id,
      criterion: `${id} release criterion`,
      expected: `observable ${id} result`,
      how_to_verify: `inspect ${id} evidence`,
      status: 'PASS',
      ...(id === 'reference_fidelity' || id.includes('visual') || id.includes('browser') || id === 'desktop_evidence' || id === 'mobile_evidence'
        ? { lane: 'visual' }
        : {}),
      evidence,
    };
  });
  const domainId = domain === 'product' ? 'product_release_readiness' : 'site_release_readiness';
  const domainProof = putProof(dir, domainId);
  criteria.push({
    id: domainId,
    criterion: `${domain} release readiness`,
    expected: `${domain} release evidence is material and verified`,
    how_to_verify: 'inspect exact release artifact and measured route',
    status: 'PASS',
    lane: domain === 'product' ? 'product' : 'technical',
    evidence: {
      criterion_id: domainId,
      claim: `measured ${domainId} result`,
      artifact_path: domainProof.path,
      artifact_sha256: domainProof.sha,
      measurement: `measured ${domainId} output`,
    },
  });
  return {
    task_class: 'RELEASE',
    delivery_required: true,
    visual_required: true,
    independent_review_required: true,
    domain_lane: domain,
    criteria,
  };
}

function assertBlocked(fn, pattern) {
  assert.throws(fn, (error) => error.message.includes(pattern), pattern);
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'dokruti-domain-release-'));
try {
  const stageStatePath = path.join(temp, 'dec220-state.json');
  fs.writeFileSync(stageStatePath, JSON.stringify({
    main: 'CORE-STAGE-GATE-001', run_id: 'RUN-TEST', stage_id: 'E2E', status: 'ПРОВЕРЕНО',
    state_version: 9, last_event_id: 'E2E-VERIFIED', last_evidence: 'a'.repeat(64), updated_at: '2026-10-15T00:00:00Z',
  }));

  for (const domain of ['product', 'site']) {
    const dir = path.join(temp, domain);
    fs.mkdirSync(dir);
    const matrix = matrixFor(domain, dir);
    const verifier = { status: 'VERIFIED', reviewer: 'executor-assertion-is-not-authority' };
    assert.equal(verifyDomainRelease({ domain, matrix, verifier, stageStatePath }), 'READY_FOR_INDEPENDENT_QA');
    assertBlocked(() => verifyDomainRelease({ domain: domain === 'product' ? 'site' : 'product', matrix, verifier, stageStatePath }), 'lane');

    const missing = structuredClone(matrix);
    missing.criteria = missing.criteria.filter((criterion) => criterion.id !== 'independent_auditor');
    assertBlocked(() => verifyDomainRelease({ domain, matrix: missing, verifier, stageStatePath }), 'Mandatory criterion is missing');

    const failed = structuredClone(matrix);
    failed.criteria[0].status = 'BLOCKED';
    assertBlocked(() => verifyDomainRelease({ domain, matrix: failed, verifier, stageStatePath }), 'BLOCKED');
  }

  const heldPath = path.join(temp, 'held-state.json');
  fs.writeFileSync(heldPath, JSON.stringify({
    main: 'CORE-STAGE-GATE-001', run_id: 'RUN-TEST', stage_id: 'PRESERVE', status: 'ЗАБЛОКИРОВАНО',
    state_version: 1, last_event_id: 'HOLD', last_evidence: 'a'.repeat(64), updated_at: '2026-10-15T00:00:00Z',
  }));
  const blockedMatrixDir = path.join(temp, 'blocked');
  fs.mkdirSync(blockedMatrixDir);
  const blockedMatrix = matrixFor('product', blockedMatrixDir);
  assertBlocked(() => verifyDomainRelease({ domain: 'product', matrix: blockedMatrix, verifier: {}, stageStatePath: heldPath }), 'DEC-220 Stage Gate blocked');

  const tamperedPath = path.join(temp, 'tampered-state.json');
  fs.writeFileSync(tamperedPath, '{"status":"ПРОВЕРЕНО"}');
  assertBlocked(() => verifyDomainRelease({ domain: 'product', matrix: blockedMatrix, verifier: {}, stageStatePath: tamperedPath }), 'DEC-220 Stage Gate blocked');

  console.log('PASS: Product and Site positive route reaches only READY_FOR_INDEPENDENT_QA; wrong lane, missing evidence, FAIL/BLOCKED, held DEC-220 state, and malformed state are rejected.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
