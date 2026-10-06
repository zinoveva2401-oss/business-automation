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
  'Independent Product Strategy, Market, Instructional Design, Editorial/Reader Experience, Commercial, Legal/IP, UX, Technical and QA Red-Team review',
  'Applicable reader-experience gates',
  'Tool comprehension',
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
const reviewGate = gates.find((item) => /independent product strategy, market, instructional design/i.test(item));
assert.ok(reviewGate, 'independent review gate must be present');
const reviewerList = reviewGate.match(/Independent (.+) reviews/)[1]
  .replace(/ and /, ', ')
  .split(', ');
for (const role of ['Product Strategy', 'Market', 'Instructional Design', 'Editorial/Reader Experience', 'Commercial', 'Legal/IP', 'UX', 'Technical', 'QA Red-Team']) {
  assert.ok(reviewerList.includes(role), `independent review omits ${role}`);
}
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
assert.ok(routeLog.indexOf(`ROUTE:${specialist.get(legalGate)}`) < routeLog.indexOf('INDEPENDENT_REVIEW:Product Strategy'));
assert.ok(routeLog.findIndex((event) => /regression review/i.test(event)) > routeLog.findIndex((event) => /consolidated repair/i.test(event)));

// Promise guard: no owner-approved promise in the current pilot source means TO_DEFINE.
const identityBlock = overlay.split('## Product identity lock and promise guard')[1].split('## Full-job category and competitor depth')[0];
for (const field of ['PRODUCT_NAME', 'PRODUCT_JOB', 'PROMISED_RESULT', 'CURRENT_APPROVED_SCOPE']) {
  assert.ok(identityBlock.includes(field), `identity lock must capture ${field}`);
}
assert.match(identityBlock, /PROMISED_RESULT = TO_DEFINE/);
assert.match(identityBlock, /do not infer one from a broad job/i);
assert.match(identityBlock, /may propose a recommended promise/i);
assert.match(identityBlock, /may not materially narrow the product/i);
assert.match(identityBlock, /preserve the locked identity/i);

const typeBlock = overlay.split('## Generic product-type classifier and approved PROD-TEAM-001 identity')[1].split('## Product identity lock and promise guard')[0];
const productTypes = [
  'KNOWLEDGE_PRODUCT', 'OPERATIONAL_TOOLKIT', 'WORKBOOK', 'DIAGNOSTIC_DECISION_PRODUCT',
  'CALCULATOR', 'COURSE_TRAINING', 'REFERENCE_LIBRARY', 'APPLICATION_SOFTWARE', 'HYBRID_PRODUCT',
];
for (const type of productTypes) {
  assert.ok(typeBlock.includes(`\`${type}\``), `generic classifier omits ${type}`);
}
const classifierRows = typeBlock.split('\n').filter((line) => /^\| `/.test(line));
assert.equal(classifierRows.length, 9, 'classifier must define every required product type');
for (const row of classifierRows) {
  const columns = row.split('|').slice(1, -1).map((column) => column.trim());
  assert.equal(columns.length, 7, 'every classifier type must define all six decision dimensions');
  assert.ok(columns.slice(1).every((column) => column.length > 0), 'classifier dimension must not be blank');
}
for (const classifierDimension of [
  'Primary buyer value', 'Research logic', 'Direct competitor set', 'Architecture logic',
  'Representative prototype', 'Quality / QA standard',
]) assert.ok(typeBlock.includes(classifierDimension), `classifier omits ${classifierDimension}`);
const classifierExamples = [
  { job: 'learn a management discipline and apply methods', primary: 'KNOWLEDGE_PRODUCT', supporting: [] },
  { job: 'calculate a margin from numeric inputs', primary: 'CALCULATOR', supporting: [] },
  { job: 'assess signals and choose an evidence-based next step', primary: 'DIAGNOSTIC_DECISION_PRODUCT', supporting: [] },
  { job: 'complete a recurring workflow in software', primary: 'APPLICATION_SOFTWARE', supporting: [] },
  { job: 'learn a discipline using a guide and repeat-use workbook', primary: 'KNOWLEDGE_PRODUCT', supporting: ['WORKBOOK', 'OPERATIONAL_TOOLKIT'] },
];
for (const example of classifierExamples) {
  assert.ok(productTypes.includes(example.primary), `invalid primary type for ${example.job}`);
  assert.ok(example.supporting.every((type) => productTypes.includes(type)), `invalid supporting type for ${example.job}`);
}
assert.notEqual(classifierExamples[0].primary, classifierExamples[1].primary);
assert.notEqual(classifierExamples[1].primary, classifierExamples[2].primary);
assert.notEqual(classifierExamples[2].primary, classifierExamples[3].primary);
assert.equal(classifierExamples[4].primary, 'KNOWLEDGE_PRODUCT');
assert.deepEqual(classifierExamples[4].supporting, ['WORKBOOK', 'OPERATIONAL_TOOLKIT']);
assert.match(typeBlock, /`PRIMARY_TYPE = KNOWLEDGE_PRODUCT`; `SUPPORTING_TYPES = WORKBOOK \+ OPERATIONAL_TOOLKIT`/);
assert.match(typeBlock, /e-book is the knowledge carrier; the XLSX is a supporting working instrument/i);
assert.match(typeBlock, /not a situational consultant route/i);

// Workbook/tool value gate: all six questions need useful answers and at least one practical gain; chapter/tab mapping alone fails.
const workbookGateBlock = overlay.split('## Workbook/tool component value gate')[1].split('## Architecture value logic, buyer/WTP validation and anti-trivialization')[0];
for (const criterion of [
  'What management or business decision', 'How often is the buyer realistically likely to use it',
  'Why is a working tool better here than reading', 'trivially available for free',
  'What additional value', 'Does it save time, reduce errors, improve consistency',
]) assert.ok(workbookGateBlock.includes(criterion), `workbook gate omits ${criterion}`);
assert.match(workbookGateBlock, /one chapter = one spreadsheet tab.*never passes/i);
assert.match(workbookGateBlock, /architecture report lists only components that pass/i);
const workbookComponentPasses = (answers) => [
  'decision', 'frequency', 'betterThanReading', 'freeAlternative', 'addedValue',
].every((key) => typeof answers[key] === 'string' && answers[key].trim().length > 0)
  && typeof answers.practicalGain === 'object'
  && ['savesTime', 'reducesErrors', 'improvesConsistency', 'supportsRepeatUse']
    .some((key) => answers.practicalGain[key] === true)
  && answers.addedValue !== 'none';
const usefulWorkbookTool = {
  decision: 'Choose which staffing gap to address first',
  frequency: 'Revisit quarterly and after a team change',
  betterThanReading: 'Combines comparable inputs into one decision view',
  freeAlternative: 'A blank template exists, but it does not normalize examples or flag missing inputs',
  addedValue: 'Filled-in examples, common scales and missing-data warnings',
  practicalGain: { savesTime: true, reducesErrors: true, improvesConsistency: true, supportsRepeatUse: true },
};
const chapterEqualsTab = {
  decision: '', frequency: '', betterThanReading: '',
  freeAlternative: '', addedValue: 'none',
  practicalGain: { savesTime: false, reducesErrors: false, improvesConsistency: false, supportsRepeatUse: false },
};
assert.equal(workbookComponentPasses(usefulWorkbookTool), true);
assert.equal(workbookComponentPasses(chapterEqualsTab), false, 'one chapter = one spreadsheet tab must not pass automatically');
const trivialFreeDuplicate = { ...usefulWorkbookTool, addedValue: 'none' };
assert.equal(workbookComponentPasses(trivialFreeDuplicate), false, 'an ordinary free duplicate with no added value must fail');

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

assert.match(typeBlock, /small- and medium-business managers/i);

const valueBlock = overlay.split('## Architecture value logic, buyer\/WTP validation and anti-trivialization')[1].split('## Product Architecture Report before prototype')[0];
assert.match(valueBlock, /ARCHITECTURE_VALUE_LOGIC/);
assert.match(valueBlock, /REAL_BUYER_WTP/);
assert.match(valueBlock, /REAL_BUYER_WTP = UNKNOWN.*does not block showing the complete architecture report/i);
assert.match(valueBlock, /blocks `FULL_PRODUCTION` and `RELEASE`/i);
assert.match(valueBlock, /Это проверенная по рынку архитектурная гипотеза\. Готовность конкретных покупателей платить ещё проверяется\./);
assert.match(valueBlock, /FREE_AI_REPLACEABILITY = HIGH[\s\S]*?blocks the architecture handoff/i);
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
  'Who buys', 'complete job and specific problem', 'PROMISED_RESULT = TO_DEFINE', 'ARCHITECTURE_VALUE_LOGIC', 'REAL_BUYER_WTP',
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
assert.match(ownerGateBlock, /REAL_BUYER_WTP = UNKNOWN.*does not block this package/i);
assert.match(ownerGateBlock, /`FULL_PRODUCTION`.*`RELEASE` blocked/i);
for (const comprehensionCheck of [
  'what is being built', 'for whom', 'whether the promise is approved or `TO_DEFINE`', 'complete modules',
  'what the buyer will learn and be able to use', 'why it could be worth paying for',
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
    PROMISED_RESULT: 'TO_DEFINE',
    CURRENT_APPROVED_SCOPE: 'Глубокий самостоятельный образовательный продукт: книга передаёт знания; XLSX даёт готовые рабочие инструменты; недельная загрузка — возможный модуль',
  },
  proposedFirstArtifact: 'Недельная загрузка команды.xlsx',
  evidence: { identityLock: 'PASS', buyerProblem: 'OPEN', disciplineLandscape: 'OPEN', directProducts: 'OPEN', actualPackages: 'OPEN', knowledgeDepth: 'OPEN', portfolioChoice: 'OPEN', formatFit: 'OPEN', architectureValueLogic: 'OPEN', realBuyerWtp: 'UNKNOWN', freeAI: 'HIGH', legal: 'OPEN' },
  architectureReport: { parts: Array(11).fill(false), simpleRussian: false },
  ownerComprehension: Array(11).fill(false),
  needsTranslator: true,
  repaired: false,
  architectureApproved: false,
  prototypeCreated: false,
};
assert.ok(pilot.input.length < 300, 'regression input must stay a short human instruction');
assert.match(pilot.identity.CURRENT_APPROVED_SCOPE, /Глубокий самостоятельный образовательный продукт/);
assert.doesNotMatch(pilot.identity.CURRENT_APPROVED_SCOPE, /только недельная загрузка/i);
assert.equal(pilot.proposedFirstArtifact.endsWith('.xlsx'), true);
assert.equal(pilot.identity.PRODUCT_TYPE, 'KNOWLEDGE_PRODUCT');
assert.equal(pilot.identity.PROMISED_RESULT, 'TO_DEFINE', 'an unapproved result must not be invented');
assert.doesNotMatch(pilot.identity.PROMISED_RESULT, /предсказуемо работающую команду/i);
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
  && pilot.evidence.architectureValueLogic === 'PASS'
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
  && pilot.ownerComprehension.every(Boolean)
  && !pilot.needsTranslator;
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
  ['architectureValueLogic', 'Product/Commercial'],
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
assert.equal(architectureOwnerPackageAllowed(), false, 'the owner must not need another AI/chat to translate');
pilot.needsTranslator = false;
pilot.evidence.architectureValueLogic = 'PASS';
pilot.evidence.realBuyerWtp = 'UNKNOWN';
assert.equal(architectureOwnerPackageAllowed(), true, 'only a complete understandable report can be handed over for architecture approval');
assert.equal(pilot.evidence.realBuyerWtp, 'UNKNOWN', 'the architecture package must preserve the actual buyer/WTP uncertainty');
assert.equal(prototypeAllowed(), false, 'architecture report must still receive informed owner approval first');
pilot.architectureApproved = true;
pilot.prototypeCreated = true;
assert.equal(prototypeAllowed(), true, 'meaningful prototype may start only after architecture approval');
const fullProductionAllowed = () => pilot.architectureApproved && pilot.evidence.realBuyerWtp === 'PASS';
assert.equal(fullProductionAllowed(), false, 'architecture approval and prototype validation do not prove actual buyer willingness to pay');
pilot.evidence.realBuyerWtp = 'PASS';
assert.equal(fullProductionAllowed(), true, 'full production may proceed only after buyer/WTP validation passes');
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
// Reader-experience contract and focused adaptive regressions for the actual DEC-209 failure.
assert.match(overlay, /overlay v1\.4\.0/);
const readerGateBlock = overlay.split('## Adaptive teaching and reader-experience gates')[1].split('## Product size and portfolio decision')[0];
for (const gate of [
  'ADAPTIVE_CONTENT_STRUCTURE_GATE', 'HUMAN_LANGUAGE_ALL_COMPONENTS', 'READER_FLOW_QA',
  'INSTRUCTIONAL_DEPTH_QA', 'DISTINCT_VALUE_PER_SECTION_GATE', 'EXAMPLE_REALISM_GUARD',
  'TOOL_COMPREHENSION_QA', 'COLD_READER_QA', 'WHOLE_PRODUCT_TRANSITION_QA',
]) assert.ok(readerGateBlock.includes(gate), `missing reader-experience gate: ${gate}`);
for (const element of [
  'diagrams', 'field names', 'warnings', 'table headings', 'workbook onboarding/status',
  'calculations', 'next steps', 'errors and limitations',
]) assert.ok(readerGateBlock.includes(element), `human language omits buyer-facing component: ${element}`);
assert.match(overlay, /Do not make every chapter follow one fixed progression/i);
assert.match(readerGateBlock, /if removing bullets\/checklists leaves no meaningful explanation, fail/i);
assert.match(readerGateBlock, /Never invent Svetlana's experience/i);
assert.match(readerGateBlock, /only the buyer-facing artifact, target audience and buyer job—not architecture rationale, research notes, author explanations or leading QA answers/i);
assert.match(readerGateBlock, /no forced bridge paragraphs/i);

// Fixture assessor applies explicit contract criteria; it is a focused regression rubric,
// not a replacement for independent human editorial/reader review of a real product.
const imperative = /^(?:Выберите|Назовите|Проверьте|Назначьте|Запишите|Уточните|Зафиксируйте|Разделите|Спросите)(?=\s|$)/i;
const causalMarker = /потому что|поэтому|в результате|тогда станет|это помогает|иначе|из-за/i;
const assessTeachingFixture = (text) => {
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const imperativeCount = sentences.filter((sentence) => imperative.test(sentence)).length;
  const hasContext = /когда|представьте|в ситуации|при этом|заказ|команд/i.test(text);
  const explainsCause = causalMarker.test(text);
  const mechanicalCadence = sentences.length >= 4 && imperativeCount >= 3 && !explainsCause;
  const plainWords = !/\b(?:операционализация|интерпретируемость|эскалационный|декомпозиция)\b/i.test(text)
    ? 'PASS' : 'FAIL';
  const readerFlow = hasContext && explainsCause && !mechanicalCadence ? 'PASS' : 'FAIL';
  const instructionalDepth = explainsCause && !mechanicalCadence ? 'PASS' : 'FAIL';
  return { sentenceCount: sentences.length, imperativeCount, hasContext, explainsCause, mechanicalCadence, plainWords, readerFlow, instructionalDepth };
};

// A — Authentic short excerpt from the DEC-209 prototype.
// Source: live Drive / BOOK_SOURCE_FINAL.md, section "Первый цикл на семь дней", line 837:
// https://drive.google.com/file/d/1963mYK-1rvZS_hfk335u8XjCRT3befEj/view
// The fixture is intentionally short; the full buyer artifact is not copied into this test.
const observedNegative = 'Выберите одну возвращающуюся работу. Назовите результат и владельца. Проверьте ресурс и границу решения. Назначьте дату факта.';
assert.match(observedNegative, /Выберите одну возвращающуюся работу.*Назовите результат и владельца.*Проверьте ресурс.*Назначьте дату факта/);
const negativeAssessment = assessTeachingFixture(observedNegative);
assert.equal(negativeAssessment.plainWords, 'PASS');
assert.equal(negativeAssessment.readerFlow, 'FAIL', 'short imperatives without orientation or causal explanation fail reader flow');
assert.equal(negativeAssessment.instructionalDepth, 'FAIL', 'steps without causal explanation do not teach the method');
assert.equal(negativeAssessment.imperativeCount, 4);

// Small synthetic teaching example, not the only style permitted by the contract.
const positiveFixture = 'Учебный пример: в мастерской один заказ каждую неделю возвращается на переделку. Пока руководитель не называет готовый результат и владельца, никто не может понять, хватает ли материала и кто вправе изменить срок. Поэтому выберите эту повторяющуюся работу, назовите результат и владельца, проверьте ресурс и границу решения. Назначьте дату проверки: так станет видно, изменилось ли выполнение или стало яснее, где работа застревает.';
const positiveAssessment = assessTeachingFixture(positiveFixture);
assert.equal(positiveAssessment.plainWords, 'PASS');
assert.equal(positiveAssessment.readerFlow, 'PASS');
assert.equal(positiveAssessment.instructionalDepth, 'PASS');
assert.ok(positiveAssessment.hasContext && positiveAssessment.explainsCause);
for (const sameMethodElement of [
  'повторяющуюся работу', 'результат и владельца', 'ресурс и границу решения', 'дату проверки',
]) assert.ok(positiveFixture.includes(sameMethodElement), `positive fixture changes the DEC-209 method: ${sameMethodElement}`);
assert.ok(negativeAssessment.readerFlow !== positiveAssessment.readerFlow, 'the same rubric must distinguish the dry and causal samples');

// B — Infer a procedural/decision structure from the home-textile buyer job; research remains a prerequisite to scope.
const textileInput = 'Хочу создать практический цифровой продукт для человека, который хочет открыть в России свой бренд постельного белья / домашнего текстиля и продавать на маркетплейсах, через интернет-магазин или розницу. Не про создание швейного производства.';
const inferTaskShape = (input) => ({
  excludedSewingFactory: /не про создание швейного производства/i.test(input),
  launchSequence: /открыть .*бренд/i.test(input) && /продавать на маркетплейсах|интернет-магазин|розниц/i.test(input),
  decisionDependencies: /открыть .*бренд/i.test(input) && /продавать/i.test(input),
});
const selectAdaptiveStructure = (shape) => shape.launchSequence && shape.decisionDependencies
  ? { structure: 'decision-and-sequence', rationale: 'the buyer must choose a business model and make dependent launch decisions' }
  : { structure: 'unresolved-needs-task-analysis', rationale: 'insufficient task-shape evidence' };
const textileShape = inferTaskShape(textileInput);
const textileStructure = selectAdaptiveStructure(textileShape);
const freezeTextileScope = ({ researchComplete, ownerApproved }) => researchComplete && ownerApproved;
assert.ok(textileShape.excludedSewingFactory && textileShape.launchSequence && textileShape.decisionDependencies);
assert.equal(textileStructure.structure, 'decision-and-sequence');
assert.match(textileStructure.rationale, /dependent launch decisions/);
assert.equal(freezeTextileScope({ researchComplete: false, ownerApproved: false }), false);
assert.match(readerGateBlock, /These examples never freeze another product's scope or module map/);
assert.doesNotMatch(readerGateBlock, /Home textile launch product must include every listed topic/);

// C — Derive tool comprehension from the ten required unaided-reader answers.
const requiredToolAnswers = ['purpose', 'situation', 'inputs', 'dataSource', 'result', 'decision', 'omissions', 'nonUseBoundary', 'completeExample', 'firstSession'];
const toolFixture = { formulasCorrect: true, answers: {
  purpose: 'Plan the next staffing decision', situation: 'When two deadlines compete', inputs: 'Tasks and available hours',
  dataSource: '', result: '', decision: '', omissions: '', nonUseBoundary: '', completeExample: '', firstSession: '',
} };
const toolComprehension = requiredToolAnswers.every((key) => typeof toolFixture.answers[key] === 'string' && toolFixture.answers[key].trim().length > 0)
  ? 'PASS' : 'FAIL';
assert.equal(toolFixture.formulasCorrect, true);
assert.equal(toolComprehension, 'FAIL', 'correct formulas do not compensate for missing cold-reader answers');
const completeToolFixture = Object.fromEntries(requiredToolAnswers.map((key) => [key, `clear buyer answer for ${key}`]));
assert.equal(requiredToolAnswers.every((key) => completeToolFixture[key].trim().length > 0), true);

// Cold-reader review closes only with an independent reviewer and the full report, never producer self-certification.
const coldReaderFields = ['whatItTeaches', 'whatWasLearned', 'confusion', 'mechanicalPassages', 'logicJumps', 'repetition',
  'exampleClarity', 'toolComprehension', 'actionNowPossible', 'remainingGuesswork'];
const coldReaderGate = (review) => review.reviewer !== 'producer'
  && coldReaderFields.every((field) => typeof review[field] === 'string' && review[field].trim().length > 0);
const producerReview = Object.fromEntries(coldReaderFields.map((field) => [field, 'producer says it is clear']));
producerReview.reviewer = 'producer';
assert.equal(coldReaderGate(producerReview), false);
const independentReaderReview = Object.fromEntries(coldReaderFields.map((field) => [field, `independent reader report: ${field}`]));
independentReaderReview.reviewer = 'cold-reader';
assert.equal(coldReaderGate(independentReaderReview), true);

// D — Simple Russian command fragments remain a reader-flow failure under the same criteria.
const simpleCommandSequence = 'Назовите. Проверьте. Зафиксируйте. Уточните. Назначьте.';
const simpleAssessment = assessTeachingFixture(simpleCommandSequence);
assert.equal(simpleAssessment.plainWords, 'PASS');
assert.equal(simpleAssessment.readerFlow, 'FAIL');
assert.equal(simpleAssessment.instructionalDepth, 'FAIL');

for (const specialistRole of ['Product Strategy', 'Instructional Design', 'Editorial/Reader Experience', 'QA Red-Team']) {
  assert.ok(overlay.includes(specialistRole), `applicable independent QA role missing: ${specialistRole}`);
}
assert.match(executor, /independent cold-reader QA/i);
assert.match(executor, /Formula\/function correctness alone does not pass/i);
console.log('PASS Product Factory v1.4.0 autonomy, adaptive teaching, human language, reader flow, instructional depth, examples, tool comprehension, cold-reader, transitions and product-type regressions');
