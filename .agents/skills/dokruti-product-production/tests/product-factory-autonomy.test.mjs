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
// Reader-experience contract and focused evidence/behavior regressions for v1.4.1.
assert.match(overlay, /overlay v1\.4\.1/);
assert.match(executor, /overlay v1\.4\.1/);
assert.match(overlay, /DEC-209 is the PROD-TEAM-001 prototype production standard and failure context/i);
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
assert.match(readerGateBlock, /Executable text heuristics may flag known structural risks only/i);

// Machine checks detect known structural risks; editorial quality still requires independent artifact review.
const assessKnownStructuralRisk = (text) => ({
  commandOnly: /^(?:(?:Выберите|Назовите|Проверьте|Назначьте|Запишите|Уточните|Зафиксируйте|Разделите|Спросите)(?=\s|[.!?])[^.!?]*[.!?]\s*){3,}$/i.test(text.trim()),
  editorialStatus: 'REQUIRES_INDEPENDENT_ARTIFACT_REVIEW',
});

// A — Exact short excerpt supplied from the actual DEC-209 prototype, delegation section.
// Provenance evidence: the v1.4.1 owner task brief quotes this exact sequence and names the delegation section;
// no line range or standalone file locator was supplied in the brief. Do not attribute it to BOOK_SOURCE_FINAL.md.
const observedNegative = 'Назовите результат и срок. Назовите критерий качества.';
const observedNegativeProvenance = {
  label: 'actual DEC-209 prototype excerpt',
  source: 'Owner attachment ef162d95-3cda-4787-8cf2-73006ace6fc1, heading "1. FIX NEGATIVE FIXTURE PROVENANCE", quoted excerpt under "delegation section"',
  section: 'delegation section',
  exactExcerpt: 'Назовите результат и срок. Назовите критерий качества.',
};
const hasTraceablePrototypeProvenance = (fixture) => Boolean(
  /actual .*prototype excerpt/i.test(fixture.label || '') && fixture.source?.trim() && fixture.section?.trim()
  && fixture.exactExcerpt?.trim() && fixture.text?.includes(fixture.exactExcerpt),
);
assert.equal(hasTraceablePrototypeProvenance({ ...observedNegativeProvenance, text: observedNegative }), true);
assert.equal(hasTraceablePrototypeProvenance({ label: 'actual prototype excerpt', text: observedNegative }), false,
  'an actual-prototype label without source/section/exact quoted match is rejected');
assert.equal(assessKnownStructuralRisk(observedNegative).editorialStatus, 'REQUIRES_INDEPENDENT_ARTIFACT_REVIEW');
assert.equal(assessKnownStructuralRisk('Когда срок срывается, назовите результат, потому что поставка задержана.').editorialStatus, 'REQUIRES_INDEPENDENT_ARTIFACT_REVIEW',
  'context and causal markers never auto-pass editorial quality');

// B — Semantic value: duplication fails; a reference with a new application/limit passes.
const compareSectionValue = (first, second) => ['method', 'example', 'limit', 'application'].some((key) =>
  second.contributions[key] && second.contributions[key] !== first.contributions[key]) ? 'PASS' : 'FAIL';
const ruleA = { rule: 'Поручение считается ясным, если назван результат и срок.', contributions: { method: '', example: '', limit: '', application: '' } };
const ruleBRestated = { rule: 'В задаче должны быть понятны ожидаемый итог и дата.', contributions: { method: '', example: '', limit: '', application: '' } };
assert.equal(compareSectionValue(ruleA, ruleBRestated), 'FAIL', 'same semantic decision rule and no new contribution is duplication');
const ruleBExtended = { rule: 'Срок из первого раздела кратко напомнили.', contributions: { method: '', example: '', limit: 'Для аварийной работы срок фиксируют диапазоном с условием пересмотра.', application: 'В сезонном пике дату пересматривают после подтверждения поставки.' } };
assert.equal(compareSectionValue(ruleA, ruleBExtended), 'PASS', 'new application and limit make reinforcement useful');

// C — Example realism: substance can be expressed in varied prose, without a fixed template.
const assessExample = (example) => {
  const unsupportedPersonalClaim = /личный опыт Светланы|в моей практике Светланы/i.test(example.claim || '') && !example.authorizedEvidence;
  const requiredSubstance = ['actors', 'situation', 'constraint', 'decision', 'weakAction', 'consequence', 'strongerAction', 'whyStronger'];
  return unsupportedPersonalClaim || requiredSubstance.some((key) => !example[key]?.trim()) ? 'FAIL' : 'PASS';
};
assert.equal(assessExample({ label: 'Пример', situation: 'В магазине задержали заказ.' }), 'FAIL', 'decorative example lacks decision, constraint, consequence and action');
assert.equal(assessExample({ claim: 'Личный опыт Светланы', actors: 'руководитель', situation: 'x', constraint: 'x', decision: 'x', weakAction: 'x', consequence: 'x', strongerAction: 'x', whyStronger: 'x' }), 'FAIL', 'unsupported personal experience fails');
assert.equal(assessExample({ label: 'Учебный составной пример', actors: 'владелец мастерской и диспетчер', situation: 'два заказа на одну смену', constraint: 'один мастер и нет подтверждения материала', decision: 'уточнить поставку до обещания срока', weakAction: 'обещать обе даты сразу', consequence: 'оба клиента получают срыв без предупреждения', strongerAction: 'сверить ресурс и сообщить подтверждённый срок', whyStronger: 'решение учитывает реальную мощность и снижает риск ложного обещания' }), 'PASS');

// D — Whole-product sequence checks semantic dependencies without forcing transition paragraphs.
const assessTransition = (next) => next.unexplainedPrerequisite || next.onlyRepeatsPrior ? 'FAIL'
  : next.buildsOnExplainedConcept || next.justifiedTaskChange || next.independentLookup ? 'PASS' : 'FAIL';
assert.equal(assessTransition({ genericBridge: 'Теперь перейдём к следующей главе' }), 'FAIL');
assert.equal(assessTransition({ unexplainedPrerequisite: true }), 'FAIL');
assert.equal(assessTransition({ onlyRepeatsPrior: true }), 'FAIL');
assert.equal(assessTransition({ buildsOnExplainedConcept: true }), 'PASS');
assert.equal(assessTransition({ justifiedTaskChange: true, reason: 'переход от планирования к обучению сотрудника' }), 'PASS');
assert.equal(assessTransition({ independentLookup: true, navigation: 'отдельная справочная таблица с индексом' }), 'PASS');

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
  dataSource: 'the input field', result: 'the number shown', decision: 'decide', omissions: 'other factors', nonUseBoundary: 'not for unusual cases', completeExample: 'example', firstSession: 'open file',
} };
const hasToolMeaning = (a) => Boolean(
  /from|source|journal|calendar|CRM|table/i.test(a.dataSource)
  && /means|shows|result|difference|remaining|exceed/i.test(a.result)
  && /choose|decide|postpone|assign|compare|change|move|arrange/i.test(a.decision)
  && /not|exclude|does not|outside/i.test(a.nonUseBoundary)
  && /use|enter|open|record|start|begin/i.test(a.firstSession)
  && requiredToolAnswers.every((key) => typeof a[key] === 'string' && a[key].trim().length > 0),
);
const toolComprehension = hasToolMeaning(toolFixture.answers) ? 'PASS' : 'FAIL';
assert.equal(toolFixture.formulasCorrect, true);
assert.equal(toolComprehension, 'FAIL', 'correct formulas and non-empty vague answers do not explain data source, result, decision or non-use');
const completeToolFixture = { purpose: 'Plan capacity for next week', situation: 'Before confirming overlapping client deadlines', inputs: 'Orders, due dates and available staff hours', dataSource: 'take orders from the order log and capacity from the shift calendar', result: 'remaining hours below zero means the plan exceeds available capacity', decision: 'move a lower-priority deadline or arrange extra capacity before promising dates', omissions: 'does not account for unrecorded absence or supplier delay', nonUseBoundary: 'not for emergency scheduling or when hours are unknown', completeExample: 'three orders require 18 hours; calendar has 14, so four hours are uncovered', firstSession: 'open the current order log and calendar, enter this week’s open orders and compare remaining hours' };
assert.equal(hasToolMeaning(completeToolFixture), true, 'positive fixture demonstrates situation → source → input → interpretation → decision → limit → first session');

// Cold-reader report requires artifact/version, reviewer isolation and substantive located observations.
const coldReaderFields = ['whatItTeaches', 'whatWasLearned', 'clearOrConfusingPassage', 'mechanicalFlowObservation', 'logicAndRepetition',
  'exampleComprehension', 'toolComprehension', 'actionNowPossible', 'remainingGuesswork', 'attentionFatigue', 'voluntaryContinue'];
const isPlaceholder = (s) => /^(?:PASS|everything is clear|independent reader report: confusion|confusion|clear|n\/a)$/i.test((s || '').trim());
const coldReaderGate = (review) => /^sha256:[a-f0-9]{64}$/i.test(review.artifactHash || '') && review.version && review.targetReader && review.buyerJob
  && review.reviewer !== review.producer && review.reviewContextId !== review.producerContextId
  && review.isolationEvidence && review.packetOnlyArtifactAudienceJob === true
  && coldReaderFields.every((field) => typeof review[field] === 'string' && review[field].trim().length > 12 && !isPlaceholder(review[field]));
const producerReview = Object.fromEntries(coldReaderFields.map((field) => [field, 'Подробное наблюдение производителя о разделе и выводе читателя.']));
Object.assign(producerReview, { artifactHash: `sha256:${'a'.repeat(64)}`, version: 'prototype v1', targetReader: 'owner with team', buyerJob: 'manage work handoffs', reviewer: 'producer', producer: 'producer', reviewContextId: 'same-context', producerContextId: 'same-context', isolationEvidence: 'same producer wrote and reviewed', packetOnlyArtifactAudienceJob: false });
assert.equal(coldReaderGate(producerReview), false);
const independentReaderReview = {
  artifactHash: `sha256:${'b'.repeat(64)}`, version: 'prototype r3', targetReader: 'owner of a 12-person service business', buyerJob: 'delegate work without losing control of timing and quality', reviewer: 'routed-reader-17', producer: 'author-02', reviewContextId: 'cold-reader-context-17', producerContextId: 'author-context-02', isolationEvidence: 'separate reviewer context; no shared author chat or rationale', packetOnlyArtifactAudienceJob: true,
  whatItTeaches: 'The section teaches how to make a delegated task checkable before work starts.',
  whatWasLearned: 'I should name the result, quality bar, authority boundary, dependencies and review date.',
  clearOrConfusingPassage: 'Delegation section, paragraph 2: the quality criterion example made the expected finish concrete.',
  mechanicalFlowObservation: 'The six imperative sentences in the opening list felt like a checklist before the reason was explained.',
  logicAndRepetition: 'No repeated rule found in this excerpt; the sequence moves from outcome to agreement.',
  exampleComprehension: 'The example is about a real handoff; I understood who may change the deadline.',
  toolComprehension: 'No working tool appears in this reviewed excerpt; not applicable because the inspected section contains no tool.',
  actionNowPossible: 'Before my next handoff I can state the quality criterion and review date.',
  remainingGuesswork: 'I still need an example of how much authority to grant a junior employee.',
  attentionFatigue: 'Attention dipped at the fourth command because the list had no short explanation between steps.',
  voluntaryContinue: 'Yes; I want the later section on authority levels because it would help with that unresolved question.',
};
assert.equal(coldReaderGate(independentReaderReview), true);
assert.equal(coldReaderGate({ ...independentReaderReview, artifactHash: 'sha256:dec209sample' }), false, 'artifact hash must be a concrete SHA-256 value');
assert.equal(coldReaderGate({ ...independentReaderReview, clearOrConfusingPassage: 'PASS' }), false, 'placeholders cannot close cold-reader QA');
assert.equal(coldReaderGate({ ...independentReaderReview, reviewer: 'new-reader-label', reviewContextId: 'author-context-02', isolationEvidence: 'relabelled producer review' }), false, 'a relabelled same-context view does not establish independence');

// D — Simple Russian command fragments remain a reader-flow failure under the same criteria.
const simpleCommandSequence = 'Назовите. Проверьте. Зафиксируйте. Уточните. Назначьте.';
const simpleAssessment = assessKnownStructuralRisk(simpleCommandSequence);
assert.equal(simpleAssessment.commandOnly, true);
assert.equal(simpleAssessment.editorialStatus, 'REQUIRES_INDEPENDENT_ARTIFACT_REVIEW');

for (const specialistRole of ['Product Strategy', 'Instructional Design', 'Editorial/Reader Experience', 'QA Red-Team']) {
  assert.ok(overlay.includes(specialistRole), `applicable independent QA role missing: ${specialistRole}`);
}
assert.match(executor, /independent cold-reader QA/i);
assert.match(executor, /Formula\/function correctness alone does not pass/i);
console.log('PASS Product Factory v1.4.1 autonomy, provenance, semantic value, realistic examples, transitions, tool comprehension, cold-reader evidence, editorial boundary and product-type regressions');
