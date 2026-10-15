#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyGate } from './verify-completion-gate.mjs';

const EXPECTED_CRITERION = { product: 'product_release_readiness', site: 'site_release_readiness' };

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function verifyDomainRelease({ domain, matrix, verifier }) {
  if (!Object.hasOwn(EXPECTED_CRITERION, domain)) throw new Error(`unsupported domain: ${domain}`);

  if (matrix.domain_lane !== domain) throw new Error(`acceptance matrix lane must be ${domain}`);
  if (matrix.task_class !== 'RELEASE' || matrix.delivery_required !== true
      || matrix.visual_required !== true || matrix.independent_review_required !== true) {
    throw new Error('release matrix must require RELEASE, delivery, visual QA, and independent review');
  }
  const requiredCriterion = EXPECTED_CRITERION[domain];
  if (!Array.isArray(matrix.criteria) || !matrix.criteria.some((criterion) => (
    criterion.id === requiredCriterion && criterion.lane === (domain === 'product' ? 'product' : 'technical')
  ))) {
    throw new Error(`release matrix is missing ${requiredCriterion} in the required lane`);
  }

  const completion = verifyGate(matrix, verifier);
  if (completion !== 'READY_FOR_INDEPENDENT_QA') {
    throw new Error(`Completion Gate returned unexpected status: ${completion}`);
  }
  return completion;
}

const isDirectExecution = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  const [, , domain, matrixPath, verifierPath] = process.argv;
  if (!domain || !matrixPath || !verifierPath) {
    console.error('Usage: node scripts/verify-domain-release.mjs <product|site> <acceptance.json> <verifier.json>');
    process.exitCode = 2;
  } else {
    try {
      const status = verifyDomainRelease({
        domain,
        matrix: loadJson(path.resolve(matrixPath)),
        verifier: loadJson(path.resolve(verifierPath)),
      });
      console.log(status);
    } catch (error) {
      console.error(`BLOCKED: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
