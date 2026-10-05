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

const researchBlock = overlay.split('## Full-job category and competitor depth')[1].split('## Knowledge-product depth and practical value')[0];
for (const category of [
  'Direct comparable self-serve digital products', 'creator or independent-expert products',
  'courses/schools', 'consulting', 'enterprise-heavy systems/software',
]) assert.ok(researchBlock.includes(category), `full-job research omits category ${category}`);
assert.match(researchBlock, /Do not set an arbitrary ceiling of 10–15 candidates/i);
assert.match(researchBlock, /50–100\+ candidates/i);
assert.match(researchBlock, /Saturation means two consecutive distinct search waves/i);
assert.match(researchBlock, /if the budget is reached before saturation, change route or record the unresolved gap/i);
assert.match(researchBlock, /actual delivery\/package/i);
assert.match(researchBlock, /Never bypass paid access, copy protected content/i);
assert.match(researchBlock, /do not let them replace the direct digital-product comparison/i);

const typeBlock = overlay.split('## Product type and approved PROD-TEAM-001 identity')[1].split('## Full-job category and competitor depth')[0];
assert.match(typeBlock, /KNOWLEDGE_PRODUCT/);
assert.match(typeBlock, /e-book is the knowledge carrier; the XLSX is a supporting working instrument/i);
assert.match(typeBlock, /not a situational consultant route/i);
assert.match(typeBlock, /small- and medium-business managers/i);

const valueBlock = overlay.split('## Paid-value and anti-trivialization gates')[1].split('## Product Architecture Report before prototype')[0];
assert.match(valueBlock, /FREE_AI_REPLACEABILITY = HIGH[\s\S]*?COMMERCIAL_VALUE = NOT ESTABLISHED[\s\S]*?blocked/i);
assert.match(valueBlock, /RETHINK[\s\S]*?redesign[\s\S]*?recheck/i);
assert.match(valueBlock, /cannot by itself prove a paid product/i);

const learningBlock = overlay.split('## Knowledge-product depth and practical value')[1].split('## Product size and portfolio decision')[0];
for (const requirement of [
  'why it works', 'when it helps', 'when it fails', 'real examples from different business types',
  'common mistakes', 'step-by-step application', 'ready working tables/templates/calculations/matrices',
  'filled-in example', 'how to adapt', 'Give exercises the worked support',
]) assert.ok(learningBlock.includes(requirement), `knowledge-product standard omits ${requirement}`);
assert.match(learningBlock, /Do not impose a page ceiling/i);
assert.match(learningBlock, /Do not replace this with superficial theory/i);
assert.match(learningBlock, /dry textbook writing/i);
assert.match(learningBlock, /another AI\/chat to translate[\s\S]*OWNER_COMMUNICATION_QA = FAIL/i);

const portfolioBlock = overlay.split('## Product size and portfolio decision')[1].split('## Paid-value and anti-trivialization gates')[0];
for (const option of ['one deep master product', 'two or three logically connected paid products', 'a core product plus advanced products']) {
  assert.ok(portfolioBlock.includes(option), `portfolio decision omits ${option}`);
}
for (const criterion of ['learning depth', 'practical usefulness', 'usability and finishability', 'buyer motivation', 'price/value', 'commercial logic']) {
  assert.ok(portfolioBlock.includes(criterion), `portfolio decision omits criterion ${criterion}`);
}
assert.match(portfolioBlock, /Do not split merely to create more SKUs/i);
assert.match(portfolioBlock, /do not flatten or omit valuable knowledge/i);

const architectureBlock = overlay.split('## Product Architecture Report before prototype')[1].split('## Two owner decision gates; prototype ordering')[0];
for (const part of [
  'Who buys', 'complete job and specific problem', 'result promised to the buyer', 'why buyers would pay',
  'discipline map', 'genuinely needs to know', 'Direct comparable self-serve digital products', 'complete proposed module map', 'buyer journey',
  'Product-portfolio recommendation', 'Format choice', 'From Svetlana', 'keep, add, rebuild, exclude/remove', 'Material risks and unknowns',
]) assert.ok(architectureBlock.toLowerCase().includes(part.toLowerCase()), `architecture report omits ${part}`);
assert.match(architectureBlock, /simple Russian/i);
assert.match(architectureBlock, /before any representative or visual prototype/i);
assert.match(architectureBlock, /eleven parts/i);
assert.match(architectureBlock, /filled example/i);

const ownerGateBlock = overlay.split('## Architect pre-handoff block')[1].split('## Owner decision policy')[0];
assert.match(ownerGateBlock, /ARCHITECTURE_OWNER_HANDOFF = BLOCKED/);
assert.match(ownerGateBlock, /PRODUCT\/PROTOTYPE DECISION PACKAGE/i);
for (const comprehensionCheck of [
  'what is being built', 'for whom', 'what result it promises', 'complete modules',
  'what the buyer will learn and be able to use', 'why it is worth paying for',
  'what free AI does not replace', 'one product or a series', 'why the format fits',
  'which precise direction decision is needed',
]) assert.ok(ownerGateBlock.includes(comprehensionCheck), `Architect comprehension gate omits ${comprehensionCheck}`);
assert.match(ownerGateBlock, /whether Svetlana would need another AI\/chat to translate/i);
assert.match(ownerGateBlock, /An architecture approval never authorizes prototype creation before that approval/i);
assert.match(overlay, /meaning, then evidence, then the decision/i);
assert.match(overlay, /without asking another AI\/chat to translate/i);

// Reconstruct the observed pilot failure: broad team-management identity,
// one proposed weekly-capacity module, and incomplete competitor/value/legal/visual evidence.
const pilot = {
  input: 'Дошей «Систему управления командой бизнеса» до сильного продаваемого продукта. Сначала покажи мне, что именно мы будем продавать, из чего продукт будет состоять и почему это будут покупать. Когда сам всё проверишь — принеси мне на решение.',
  identity: {
    PRODUCT_TYPE: 'KNOWLEDGE_PRODUCT',
    PRODUCT_NAME: 'Система управления командой бизнеса',
    PRODUCT_JOB: 'Научить руководителя малого или среднего бизнеса управлять командой как целой профессиональной дисциплиной',
    PROMISED_RESULT: 'Руководитель регулярно получает согласованную, ответственную и предсказуемо работающую команду',
    CURRENT_APPROVED_SCOPE: 'Глубокий самостоятельный образовательный продукт: книга передаёт знания; XLSX даёт готовые рабочие инструменты; недельная загрузка — возможный модуль',
  },
  proposedFirstArtifact: 'Недельная загрузка команды.xlsx',
  evidence: { identityLock: 'PASS', buyerProblem: 'OPEN', disciplineLandscape: 'OPEN', directProducts: 'OPEN', actualPackages: 'OPEN', knowledgeDepth: 'OPEN', portfolioChoice: 'OPEN', formatFit: 'OPEN', paidValue: 'OPEN', freeAI: 'HIGH', legal: 'OPEN' },
  architectureReport: { parts: Array(11).fill(false), simpleRussian: false },
  ownerComprehension: Array(11).fill(false),
  repaired: false,
  architectureApproved: false,
  prototypeCreated: false,
};
assert.ok(pilot.input.length < 300, 'regression input must stay a short human instruction');
assert.match(pilot.identity.CURRENT_APPROVED_SCOPE, /Глубокий самостоятельный образовательный продукт/);
assert.doesNotMatch(pilot.identity.CURRENT_APPROVED_SCOPE, /только недельная загрузка/i);
assert.equal(pilot.proposedFirstArtifact.endsWith('.xlsx'), true);
assert.equal(pilot.identity.PRODUCT_TYPE, 'KNOWLEDGE_PRODUCT');
assert.match(pilot.identity.PRODUCT_JOB, /профессиональной дисциплиной/);
assert.doesNotMatch(pilot.identity.PRODUCT_JOB, /ситуац|диагностир|маршрут действий/i);

// Broad discovery is allowed to exceed the old small-list cap and stops by saturation.
const discoveryWaves = [
  { candidates: 22, novel: 11 },
  { candidates: 26, novel: 9 },
  { candidates: 18, novel: 3 },
  { candidates: 15, novel: 0 },
  { candidates: 12, novel: 0 },
];
let consecutiveSaturatedWaves = 0;
let candidatesMapped = 0;
let wavesUsed = 0;
for (const wave of discoveryWaves) {
  candidatesMapped += wave.candidates;
  wavesUsed += 1;
  consecutiveSaturatedWaves = wave.novel === 0 ? consecutiveSaturatedWaves + 1 : 0;
  if (consecutiveSaturatedWaves === 2) break;
}
assert.equal(candidatesMapped, 93, 'market discovery must not stop at an arbitrary small candidate count');
assert.equal(wavesUsed, 5, 'research stops after two consecutive saturated waves');

const architectureReady = () => pilot.evidence.disciplineLandscape === 'PASS'
  && pilot.evidence.identityLock === 'PASS'
  && pilot.evidence.buyerProblem === 'PASS'
  && pilot.evidence.directProducts === 'PASS'
  && pilot.evidence.actualPackages === 'PASS'
  && pilot.evidence.knowledgeDepth === 'PASS'
  && pilot.evidence.portfolioChoice === 'PASS'
  && pilot.evidence.formatFit === 'PASS'
  && pilot.evidence.paidValue === 'PASS'
  && pilot.evidence.freeAI === 'PASS'
  && pilot.evidence.legal === 'PASS'
  && productReview === 'PASS'
  && marketReview === 'PASS'
  && editorialReview === 'PASS'
  && commercialReview === 'PASS';
const architectureReportReady = () => pilot.architectureReport.parts.length === 11
  && pilot.architectureReport.parts.every(Boolean)
  && pilot.architectureReport.simpleRussian;
const ownerUnderstandsArchitecture = () => pilot.ownerComprehension.length === 11
  && pilot.ownerComprehension.every(Boolean);
const architectureOwnerPackageAllowed = () => architectureReady()
  && architectureReportReady()
  && ownerUnderstandsArchitecture();
const prototypeAllowed = () => architectureOwnerPackageAllowed() && pilot.architectureApproved;
let productReview = 'OPEN';
let marketReview = 'OPEN';
let editorialReview = 'OPEN';
let commercialReview = 'OPEN';
assert.equal(architectureReady(), false, 'incomplete market/value/legal evidence must block architecture handoff');
assert.equal(architectureOwnerPackageAllowed(), false, 'an incomplete architecture report or owner-comprehension check must block handoff');
assert.equal(prototypeAllowed(), false, 'a working XLSX cannot bypass architecture approval');

const depthRoutes = [
  ['buyerProblem', 'Customer Research / Customer Voice'],
  ['disciplineLandscape', 'Market Research'],
  ['directProducts', 'Market Research'],
  ['actualPackages', 'Market Research (lawful preview/sample inspection)'],
  ['knowledgeDepth', 'Editorial/Instructional Design'],
  ['portfolioChoice', 'Product/Commercial'],
  ['formatFit', 'Product/Commercial'],
  ['paidValue', 'Product/Commercial'],
  ['freeAI', 'Product/Commercial'],
  ['legal', 'Legal/IP'],
  ['visual', 'Art/UX'],
];
const depthRouteLog = [];
for (const [criterion, specialistRole] of depthRoutes) {
  depthRouteLog.push(`DETECT:${criterion}`, `ROUTE:${specialistRole}`, `REPAIR:${criterion}`, `RECHECK:${criterion}`);
  if (criterion === 'freeAI') depthRouteLog.push('RETHINK:paid-value', 'REDESIGN:mechanism/offer', 'RECHECK:free-AI distinction');
  pilot.evidence[criterion] = 'PASS';
  assert.equal(prototypeAllowed(), false, `prototype opened before Product review/owner approval: ${criterion}`);
}
pilot.repaired = true;
productReview = 'PASS';
marketReview = 'PASS';
editorialReview = 'PASS';
commercialReview = 'PASS';
assert.equal(architectureReady(), true, 'all upstream evidence and independent Product review now pass');
assert.equal(architectureOwnerPackageAllowed(), false, 'research passing is not enough: report and owner comprehension are still missing');

// The report contains the eleven required parts, is owner-readable, and passes comprehension.
pilot.architectureReport.parts.fill(true);
assert.equal(architectureOwnerPackageAllowed(), false, 'plain-language requirement is still open');
pilot.architectureReport.simpleRussian = true;
assert.equal(architectureOwnerPackageAllowed(), false, 'owner-comprehension questions remain open');
pilot.ownerComprehension.fill(true);
assert.equal(architectureOwnerPackageAllowed(), true, 'only a complete understandable report can be handed over for architecture approval');
assert.equal(prototypeAllowed(), false, 'architecture report must still receive informed owner approval first');
pilot.architectureApproved = true;
pilot.prototypeCreated = true;
assert.equal(prototypeAllowed(), true, 'meaningful prototype may start only after architecture approval');
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Market Research'));
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Product/Commercial'));
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Editorial/Instructional Design'));
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Legal/IP'));
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Art/UX'));
assert.ok(depthRouteLog.includes('RETHINK:paid-value') && depthRouteLog.includes('REDESIGN:mechanism/offer'));
assert.ok(depthRouteLog.some((event) => event === 'ROUTE:Customer Research / Customer Voice'));
assert.equal(pilot.repaired, true);

const prototypePackage = { wholeJobCoverage: true, endToEnd: true, connectedToNextModule: true };
assert.equal(prototypePackage.wholeJobCoverage && prototypePackage.endToEnd && prototypePackage.connectedToNextModule, true,
  'representative artifact must show a connected end-to-end part of the complete system');
const postPrototypeGates = new Map([
  ['representative prototype rendered/used', 'OPEN'],
  ['legal/IP/claims', 'OPEN'],
  ['technical QA', 'OPEN'],
  ['visual/UX QA', 'OPEN'],
  ['independent artifact review', 'OPEN'],
  ['consolidated repair', 'OPEN'],
  ['regression review after repair', 'OPEN'],
]);
const finalOwnerHandoffAllowed = () => pilot.prototypeCreated
  && [...postPrototypeGates.values()].every((status) => status === 'PASS');
assert.equal(finalOwnerHandoffAllowed(), false, 'prototype presence cannot bypass open post-prototype QA and repair gates');
const postPrototypeRouteLog = [];
for (const [gate, status] of postPrototypeGates) {
  postPrototypeRouteLog.push(`DETECT:${gate}`, `ROUTE:${gate}`, `REPAIR:${gate}`, `RECHECK:${gate}`);
  postPrototypeGates.set(gate, 'PASS');
  if (gate !== 'regression review after repair') {
    assert.equal(finalOwnerHandoffAllowed(), false, `final handoff opened before ${gate} and regression review closed`);
  }
}
assert.equal(finalOwnerHandoffAllowed(), true, 'final owner decision package is allowed only after all post-prototype gates pass');
assert.ok(postPrototypeRouteLog.findIndex((event) => event === 'REPAIR:consolidated repair') < postPrototypeRouteLog.findIndex((event) => event === 'DETECT:regression review after repair'));
console.log('PASS Product Factory v1.3.0 contract + autonomy, knowledge-depth and PROD-TEAM-001 regression');
