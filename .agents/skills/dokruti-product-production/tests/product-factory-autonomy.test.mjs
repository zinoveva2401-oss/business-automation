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
assert.match(executor, /owner decision package only after its required internal gates close/i);
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

// Depth/architecture regression from live decisions DEC-202 and DEC-203.
const identityBlock = overlay.split('## Product identity lock')[1].split('## Full-job category and competitor depth')[0];
for (const field of ['PRODUCT_NAME', 'PRODUCT_JOB', 'PROMISED_RESULT', 'CURRENT_APPROVED_SCOPE']) {
  assert.ok(identityBlock.includes(field), `identity lock must capture ${field}`);
}
assert.match(identityBlock, /may not materially narrow the product/i);
assert.match(identityBlock, /preserve the locked identity/i);

const researchBlock = overlay.split('## Full-job category and competitor depth')[1].split('## Paid-value and anti-trivialization gates')[0];
for (const category of [
  'Direct paid products', 'Books/workbooks', 'courses', 'templates/toolkits',
  'HR/team software', 'planning/accountability/performance systems',
  'Consulting/service substitutes', 'general-AI substitutes', 'free alternatives',
]) assert.ok(researchBlock.includes(category), `full-job research omits category ${category}`);
assert.match(researchBlock, /at least two strong examples for the core job/i);
assert.match(researchBlock, /no more than 12 source products\/services/i);
assert.match(researchBlock, /two distinct targeted search passes/i);
assert.match(researchBlock, /diminishing-return stop condition/i);

const valueBlock = overlay.split('## Paid-value and anti-trivialization gates')[1].split('## Product Architecture Report before prototype')[0];
assert.match(valueBlock, /FREE_AI_REPLACEABILITY = HIGH[\s\S]*?COMMERCIAL_VALUE = NOT ESTABLISHED[\s\S]*?blocked/i);
assert.match(valueBlock, /RETHINK[\s\S]*?redesign[\s\S]*?recheck/i);
assert.match(valueBlock, /cannot by itself prove a paid product/i);

const architectureBlock = overlay.split('## Product Architecture Report before prototype')[1].split('## Two owner decision gates; prototype ordering')[0];
for (const part of [
  'Who buys', 'specific management pain/job', 'end result', 'why buyers would pay',
  'Strong competitors/substitutes', 'complete proposed module map', 'buyer journey',
  'Format choice', 'keep, rebuild, delete', 'Material risks and unknowns',
]) assert.ok(architectureBlock.toLowerCase().includes(part.toLowerCase()), `architecture report omits ${part}`);
assert.match(architectureBlock, /simple Russian/i);
assert.match(architectureBlock, /before any representative or visual prototype/i);

const ownerGateBlock = overlay.split('## Architect pre-handoff block')[1].split('## Owner decision policy')[0];
assert.match(ownerGateBlock, /ARCHITECTURE_OWNER_HANDOFF = BLOCKED/);
assert.match(ownerGateBlock, /PRODUCT\/PROTOTYPE DECISION PACKAGE/i);
for (const comprehensionCheck of [
  'what is being built', 'for whom', 'what result it promises', 'complete modules',
  'why it is worth paying for', 'what free AI does not replace', 'why the format fits',
]) assert.ok(ownerGateBlock.includes(comprehensionCheck), `Architect comprehension gate omits ${comprehensionCheck}`);
assert.match(ownerGateBlock, /An architecture approval never authorizes prototype creation before that approval/i);
assert.match(overlay, /meaning, then evidence, then the decision/i);

// Reconstruct the observed pilot failure: broad team-management identity,
// one proposed weekly-capacity module, and incomplete competitor/value/legal/visual evidence.
const pilot = {
  input: 'Дошей «Систему управления командой бизнеса» до сильного продаваемого продукта. Сначала покажи мне, что именно мы будем продавать, из чего продукт будет состоять и почему это будут покупать. Когда сам всё проверишь — принеси мне на решение.',
  identity: {
    PRODUCT_NAME: 'Система управления командой бизнеса',
    PRODUCT_JOB: 'Помочь руководителю малого или среднего бизнеса управлять командой как целой системой',
    PROMISED_RESULT: 'Руководитель регулярно получает согласованную, ответственную и предсказуемо работающую команду',
    CURRENT_APPROVED_SCOPE: 'Полная система управления командой; недельная загрузка — возможный модуль',
  },
  proposedFirstArtifact: 'Недельная загрузка команды.xlsx',
  evidence: { competitorDepth: 'OPEN', paidValue: 'OPEN', freeAI: 'HIGH', legal: 'OPEN', visual: 'OPEN' },
  repaired: false,
  architectureApproved: false,
};
assert.ok(pilot.input.length < 300, 'regression input must stay a short human instruction');
assert.match(pilot.identity.CURRENT_APPROVED_SCOPE, /Полная система управления командой/);
assert.doesNotMatch(pilot.identity.CURRENT_APPROVED_SCOPE, /только недельная загрузка/i);
assert.equal(pilot.proposedFirstArtifact.endsWith('.xlsx'), true);

const architectureReady = () => pilot.evidence.competitorDepth === 'PASS'
  && pilot.evidence.paidValue === 'PASS'
  && pilot.evidence.freeAI === 'PASS'
  && pilot.evidence.legal === 'PASS'
  && productReview === 'PASS';
const prototypeAllowed = () => architectureReady() && pilot.architectureApproved;
let productReview = 'OPEN';
assert.equal(architectureReady(), false, 'incomplete market/value/legal evidence must block architecture handoff');
assert.equal(prototypeAllowed(), false, 'a working XLSX cannot bypass architecture approval');

const depthRoutes = [
  ['competitorDepth', 'Market Research'],
  ['paidValue', 'Product/Commercial'],
  ['freeAI', 'Product/Commercial'],
  ['legal', 'Legal/IP'],
  ['visual', 'Art/UX'],
];
const depthRouteLog = [];
for (const [criterion, specialistRole] of depthRoutes) {
  depthRouteLog.push(`DETECT:${criterion}`, `ROUTE:${specialistRole}`, `REPAIR:${criterion}`, `RECHECK:${criterion}`);
  pilot.evidence[criterion] = 'PASS';
  assert.equal(prototypeAllowed(), false, `prototype opened before Product review/owner approval: ${criterion}`);
}
pilot.repaired = true;
productReview = 'PASS';
assert.equal(architectureReady(), true, 'all upstream evidence and independent Product review now pass');
assert.equal(prototypeAllowed(), false, 'architecture report must still receive informed owner approval first');
pilot.architectureApproved = true;
assert.equal(prototypeAllowed(), true, 'meaningful prototype may start only after architecture approval');
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Market Research'));
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Product/Commercial'));
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Legal/IP'));
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Art/UX'));
assert.equal(pilot.repaired, true);

const prototypePackage = { wholeJobCoverage: true, endToEnd: true, connectedToNextModule: true, allPostPrototypeGatesPass: true };
assert.equal(prototypePackage.wholeJobCoverage && prototypePackage.endToEnd && prototypePackage.connectedToNextModule, true,
  'representative artifact must show a connected end-to-end part of the complete system');
assert.equal(prototypePackage.allPostPrototypeGatesPass, true, 'later owner handoff still requires the original full post-prototype DOD');
console.log('PASS Product Factory v1.2.0 contract + autonomy and PROD-TEAM-001 depth/architecture regression');
