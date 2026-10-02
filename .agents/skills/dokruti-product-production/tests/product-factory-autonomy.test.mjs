import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const overlay = await readFile(path.resolve(skillDir, '../../../products/AGENTS.md'), 'utf8');
const executor = await readFile(path.resolve(skillDir, 'SKILL.md'), 'utf8');

const expectedGates = [
  'Recovery audit',
  'Current buyer/problem evidence',
  'Current market, competitor and substitute research',
  'Free-AI replaceability check',
  'Commercial and value logic',
  'Evidence-based format decision',
  'Legal, IP and claims check',
  'Representative prototype',
  'Technical QA',
  'Visual and UX QA',
  'Independent Product, Market, Editorial, Commercial, Legal/IP, UX, Technical and Red-Team reviews',
  'One consolidated repair',
  'regression review after repair',
];

const dodBlock = overlay.split('## Preproduction definition of done')[1].split('## Self-heal and routing')[0];
const gates = [...dodBlock.matchAll(/^\d+\. (.+)$/gm)].map((match) => match[1]);
assert.equal(gates.length, expectedGates.length, 'overlay must declare every required preproduction gate');
for (const expected of expectedGates) {
  assert.ok(gates.some((gate) => gate.toLowerCase().includes(expected.toLowerCase())), `overlay omits required gate: ${expected}`);
}
assert.match(overlay, /NOT APPLICABLE.*specific reason/s);
assert.match(overlay, /DETECT → ROUTE TO THE RESPONSIBLE SPECIALIST → REPAIR → RECHECK → CONTINUE/);
assert.match(overlay, /ARE ALL REQUIRED INTERNAL GATES CLOSED\?/);
assert.match(overlay, /prototype by itself never authorizes owner handoff/i);
assert.match(overlay, /normal research, review or repair should continue/i);
assert.match(overlay, /diminishing-return stop condition/i);
assert.match(overlay, /EXTERNAL_PREREQUISITE_REQUEST/);
assert.match(executor, /never stop merely to ask whether normal research or repair should proceed/i);
assert.match(executor, /only after internal gates close/i);
assert.doesNotMatch(executor, /If that proof is missing, stop and return the precise missing gate/);

// Regression: derive the required ledger and reviewer list from the contract.
// The PROD-TEAM-001 failure state had a real prototype but open
// competitor/value/legal/visual evidence and incomplete independent reviews.
const gateLedger = new Map(gates.map((gate) => [gate, { status: 'PASS', reason: '' }]));
const openGate = (pattern) => {
  const gate = gates.find((item) => pattern.test(item));
  assert.ok(gate, `missing gate matching ${pattern}`);
  gateLedger.get(gate).status = 'OPEN';
  return gate;
};
const marketGate = openGate(/market, competitor and substitute/i);
const valueGate = openGate(/commercial and value/i);
const legalGate = openGate(/legal, ip and claims/i);
const visualGate = openGate(/visual and ux/i);
const reviewGate = gates.find((item) => /independent product, market, editorial/i.test(item));
assert.ok(reviewGate, 'independent review gate must be present');
const reviewerList = reviewGate.match(/Independent (.+) reviews/)[1]
  .replace(/ and /, ', ')
  .split(', ');
assert.deepEqual(reviewerList, ['Product', 'Market', 'Editorial', 'Commercial', 'Legal/IP', 'UX', 'Technical', 'Red-Team']);
const reviewerStatus = new Map(reviewerList.map((role) => [role, 'OPEN']));
for (const gate of gates.filter((item) => /consolidated repair|regression review/i.test(item))) {
  gateLedger.get(gate).status = 'OPEN';
}

const routeTable = overlay.split('Route correctable gaps as follows:')[1].split('Do not ask Светлану')[0];
const routes = [...routeTable.matchAll(/^\| (.+) \| (.+) \|$/gm)]
  .filter((match) => match[1] !== 'Gap')
  .map(([, gap, role]) => ({ gap, role }));
const specialist = new Map([
  [marketGate, routes.find((entry) => /Market, competitor or substitute/.test(entry.gap))?.role],
  [valueGate, routes.find((entry) => /Buyer value/.test(entry.gap))?.role],
  [legalGate, routes.find((entry) => /Rights, IP/.test(entry.gap))?.role],
  [visualGate, routes.find((entry) => /Visual hierarchy/.test(entry.gap))?.role],
]);
assert.deepEqual([...specialist.values()], ['Market Research', 'Product/Commercial', 'Legal/IP', 'Art/UX']);
const routeLog = [];
const gateClosed = ({ status, reason }) => status === 'PASS' || (status === 'NOT_APPLICABLE' && reason.trim().length > 0);
const ownerHandoffAllowed = () => [...gateLedger.values()].every(gateClosed)
  && [...reviewerStatus.values()].every((status) => status === 'PASS');

assert.equal(ownerHandoffAllowed(), false, 'prototype must not bypass incomplete evidence');
assert.deepEqual([...specialist.values()], ['Market Research', 'Product/Commercial', 'Legal/IP', 'Art/UX']);

const naGate = gateLedger.get(gates[1]);
naGate.status = 'NOT_APPLICABLE';
assert.equal(gateClosed(naGate), false, 'N/A without a reason is not closed');
naGate.reason = 'This product has no user data collection';
assert.equal(gateClosed(naGate), true, 'N/A with a recorded reason is closed');
naGate.status = 'PASS';
naGate.reason = '';

for (const [gate, role] of specialist) {
  routeLog.push(`DETECT:${gate}`, `ROUTE:${role}`, `REPAIR:${gate}`, `RECHECK:${gate}`);
  gateLedger.get(gate).status = 'PASS';
  assert.equal(ownerHandoffAllowed(), false, `handoff opened before all internal reviews: ${gate}`);
}
for (const role of reviewerList) {
  routeLog.push(`INDEPENDENT_REVIEW:${role}`);
  reviewerStatus.set(role, 'PASS');
  assert.equal(ownerHandoffAllowed(), false, `handoff opened before all reviewers completed: ${role}`);
}
for (const gate of gates.filter((item) => /consolidated repair|regression review/i.test(item))) {
  routeLog.push(gate);
  gateLedger.get(gate).status = 'PASS';
}

assert.equal(ownerHandoffAllowed(), true, 'all gates closed; owner decision may now be packaged if needed');
assert.ok(routeLog.indexOf(`ROUTE:${specialist.get(legalGate)}`) < routeLog.indexOf('INDEPENDENT_REVIEW:Product'));
assert.ok(routeLog.findIndex((event) => /regression review/i.test(event)) > routeLog.findIndex((event) => /consolidated repair/i.test(event)));
console.log('PASS product factory autonomy contract + PROD-TEAM-001 incomplete-evidence self-heal regression');
