#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  'scripts/spec-lint-v2.mjs',
  'scripts/skill-regression-harness.mjs',
  'scripts/audit-codex-capabilities.mjs',
  'scripts/security-baseline-scan.mjs',
  'tests/fixtures/second-brain/visual/index.html',
  'tests/fixtures/second-brain/visual/visual-evidence.json',
  'tests/fixtures/second-brain/visual/motion-contract.json',
  'tests/fixtures/second-brain/product/format-fit.json',
  'tests/fixtures/second-brain/product/dashboard-states.json',
  'tests/fixtures/second-brain/performance/weight.json',
  'tests/fixtures/second-brain/performance/format-matrix.json',
  'tests/fixtures/second-brain/quality/weak-input.json',
  'tests/fixtures/second-brain/media/multi-source.json',
  'tests/fixtures/second-brain/asset-inventory.json',
  'tests/fixtures/second-brain/spec/valid-task-packet.json',
  'tests/fixtures/second-brain/spec/contradictory-task-packet.json',
  'tests/golden/README.md',
  'docs/ai/CODEX_CAPABILITY_AUDIT_2026-09-17.md',
  'docs/ai/SECOND_BRAIN_GOLDEN_TESTS_2026-09-17.md',
  'docs/ai/SPEC_LINT_V2.md',
  'docs/ai/SKILL_REGRESSION_HARNESS.md',
  'docs/ai/SECURITY_BASELINE_2026-09-17.md',
  'docs/ai/HANDOFF_PROTOCOL.md',
];

const patterns = [
  { id: 'hardcoded-secret', regex: /(?:api[_-]?key|secret|password|access[_-]?token)\s*[:=]\s*['"][^'"]{8,}/i },
  { id: 'code-evaluation', regex: /\b(?:eval|Function)\s*\(/ },
  { id: 'unsafe-html-sink', regex: /(?:innerHTML|insertAdjacentHTML|document\.write)\s*=/ },
  { id: 'wildcard-postmessage', regex: /postMessage\([^\n]*['"]\*['"]/ },
];

function scan() {
  const findings = [];
  for (const relative of targets) {
    const file = path.join(root, relative);
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const pattern of patterns) {
        if (pattern.regex.test(line)) {
          findings.push({ file: relative, line: index + 1, rule: pattern.id });
        }
      }
    });
  }
  return findings;
}

const findings = scan();
const result = {
  status: findings.length === 0 ? 'PASS' : 'FAIL',
  scope: targets,
  rules: patterns.map((pattern) => pattern.id),
  findings,
  note: 'Static baseline for newly added runtime/test files; existing production findings are documented separately and are not silently changed in this SYSTEM run.',
};
console.log(JSON.stringify(result, null, 2));
if (findings.length > 0) process.exitCode = 1;
