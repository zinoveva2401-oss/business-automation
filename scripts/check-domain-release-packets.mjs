#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { verifyDomainRelease } from './verify-domain-release.mjs';

const ROOT = process.cwd();
const base = process.env.GITHUB_BASE_REF || 'main';
const changed = execFileSync('git', ['diff', '--name-only', `origin/${base}...HEAD`], {
  cwd: ROOT,
  encoding: 'utf8',
}).trim().split(/\r?\n/).filter(Boolean);

const productIds = new Set();
let siteChanged = false;
for (const file of changed) {
  const product = file.match(/^products\/([^/]+)\//);
  if (product && product[1] !== 'AGENTS.md') {
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(product[1])) throw new Error(`BLOCKED: invalid Product path segment: ${product[1]}`);
    productIds.add(product[1]);
  }
  if (/^(src|public)\//.test(file)) siteChanged = true;
}

const scopes = [
  ...[...productIds].sort().map((id) => ({
    domain: 'product',
    matrix: `products/${id}/.release/acceptance.json`,
    verifier: `products/${id}/.release/verifier.json`,
  })),
  ...(siteChanged ? [{
    domain: 'site',
    matrix: '.github/release-evidence/site-acceptance.json',
    verifier: '.github/release-evidence/site-verifier.json',
  }] : []),
];

if (scopes.length === 0) {
  console.log('DOMAIN_RELEASE_GATE_SKIP: no Product deliverable or Site source changed');
  process.exit(0);
}

const stageStatePath = process.env.DOKRUTI_STAGE_STATE_FILE;
if (!stageStatePath || !fs.existsSync(stageStatePath)) {
  console.error('BLOCKED: Product/Site release requires DOKRUTI_STAGE_STATE_FILE from the canonical Business System adapter');
  process.exit(1);
}

for (const scope of scopes) {
  for (const file of [scope.matrix, scope.verifier]) {
    if (!changed.includes(file) || !fs.existsSync(path.join(ROOT, file))) {
      throw new Error(`BLOCKED: fresh ${scope.domain} evidence file must exist in this PR: ${file}`);
    }
  }
  const status = verifyDomainRelease({
    domain: scope.domain,
    matrix: JSON.parse(fs.readFileSync(path.join(ROOT, scope.matrix), 'utf8')),
    verifier: JSON.parse(fs.readFileSync(path.join(ROOT, scope.verifier), 'utf8')),
    stageStatePath,
  });
  console.log(`${scope.domain.toUpperCase()}: ${status}`);
}
