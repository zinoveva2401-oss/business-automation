#!/usr/bin/env python3
from pathlib import Path
import re, sys

root = Path(__file__).resolve().parents[1]
errors=[]
warnings=[]

required=[
    'SKILL.md','MANIFEST.md','UPGRADE_v2.0.10.md','QA_v2.0.11_CORE_NORMALIZATION.md','agents/openai.yaml','assets/icon.svg',
    'references/INDEX.md','references/architect-supervisor-gate.md','references/client-work-boundary.md','references/product-factory.md','references/LEGACY_CORE_MAP.md','references/content-owner-transaction.md','references/owner-context-diagnostic.md','references/owner-workspace-architecture.md','references/capability-expansion-radar.md','references/founder-future-self-lab.md','references/live-portfolio-proof.md','references/knowledge-capital-product-mining.md','references/platform-intelligence-operations.md','references/site-studio-grade-standard.md','references/model-economics-routing.md','references/director-brain-foresight.md','references/quick-command-palette.md','references/product-value-integrity.md','references/russian-language-gate.md','references/executive-control-layer.md','references/creative-content-production.md','references/channel-experience-packaging.md','references/learning-promotion-loop.md','references/production-dispatcher-runtime.md','references/strategic-intelligence-opportunity.md','references/growth-distribution.md','references/task-specification-delegation.md','references/work-production-controller.md','references/editorial-reader-experience.md','references/universal-output-design.md','references/publication-design-ebook.md','references/media-production-quality.md','references/design-thinking-visual-system.md','references/product-experience-artifact-architecture.md','references/sales-crm-attribution.md','references/operations-delivery.md','references/ai-capability-benchmark.md','references/reliability-security-local-it.md','references/multi-agent-orchestration.md','references/skill-governance-versioning.md','references/strategy-portfolio.md','references/internal-business-analyst.md','references/web-digital-asset.md','references/people-hr-learning.md','templates/execution-packet.md','tests/acceptance-tests.md','tests/regression-tests.md','tests/test_v209_contracts.py','tests/test_v210_contracts.py','tests/test_v211_core_gates.py','tests/test_entity_resolver.py','tests/test_dispatcher_state_machine.py','tests/test_runtime_watchdog.py','tests/v208_preservation_manifest.json','tests/bsys003_contract_matrix.json','scripts/entity_resolver.py','scripts/context_gap_resolver.py','scripts/russian_language_gate.py','scripts/quick_command_router.py','scripts/product_value_gate.py','tests/test_v210_r2_contracts.py','tests/test_russian_language_gate.py','tests/test_quick_command_router.py','tests/test_product_value_gate.py','tests/test_product_council.py','tests/test_50_angle_r2.py','tests/test_r3_founder_portfolio.py','tests/test_r3_quick_command_bank.py','tests/test_r3_site_platform_model.py','tests/test_75_angle_r3.py','tests/test_r4_owner_context_workspace.py','tests/test_r4_capability_model.py','tests/test_100_angle_r4.py','QA_v2.0.10_r3.md','QA_v2.0.10_r4.md','QA_v2.0.10_r8.md','QA_v2.0.10_r9.md','QA_v2.0.10_r9_FINAL.md','references/global-creative-product-intelligence.md','references/growth-execution-operating-system.md','references/artifact-outcome-executor-graduation.md','references/automation-observability-external-capabilities.md','tests/test_r8_unified_content_transaction.py','tests/test_r8_50_angle_content.py','tests/test_r9_global_creative_product_intelligence.py','tests/test_r9_final_growth_execution.py'
]
for r in required:
    if not (root/r).exists(): errors.append('missing '+r)

# Validate local markdown links across runtime/docs/tests.
for md in root.rglob('*.md'):
    text=md.read_text('utf-8',errors='ignore')
    for target in re.findall(r'\]\(([^)]+)\)', text):
        if re.match(r'^[a-z]+://', target) or target.startswith('#') or target.startswith('mailto:'):
            continue
        clean=target.split('#',1)[0]
        if not clean:
            continue
        dest=(md.parent/clean).resolve()
        try:
            dest.relative_to(root.resolve())
        except ValueError:
            errors.append(f'link escapes package {md.relative_to(root)} -> {target}')
            continue
        if not dest.exists():
            errors.append(f'broken ref {md.relative_to(root)} -> {target}')

# Only active runtime/docs are scanned for stale architecture. Tests may name forbidden legacy terms deliberately.
runtime_files=[root/'SKILL.md', root/'MANIFEST.md']
runtime_files += [p for p in sorted((root/'references').glob('*.md')) if p.name != 'LEGACY_CORE_MAP.md']
runtime_files += sorted((root/'templates').glob('*.md'))
runtime_text='\n'.join(p.read_text('utf-8',errors='ignore') for p in runtime_files if p.exists())

for bad in ['Airtable','MASTER-REFERENCE 01 — Editorial Retail Investigation']:
    if bad in runtime_text: errors.append('stale hard dependency '+bad)
if 'Розница в цифрах' in runtime_text:
    errors.append('old master brand leak in active runtime')

# Architecture invariants.
skill=(root/'SKILL.md').read_text('utf-8',errors='ignore') if (root/'SKILL.md').exists() else ''
# SKILL.md frontmatter
if skill.startswith('---\n'):
    parts=skill.split('---\n',2)
    if len(parts) < 3:
        errors.append('invalid SKILL.md frontmatter delimiters')
    else:
        fm=parts[1]
        if not re.search(r'^name:\s*ai-business-os\s*$', fm, re.M): errors.append('SKILL.md name mismatch')
        if not re.search(r'^description:\s*.+$', fm, re.M): errors.append('SKILL.md missing description')
else:
    errors.append('SKILL.md missing YAML frontmatter')
required_phrases=[
    'DOKRUTI | BUSINESS OS v2.0.11 RELEASE (r9-derived)',
    'PENDING WRITE-BACK',
    'Marketing Matrix',
    'Founder OS',
    'Product Factory',
    'Revenue Portfolio',
    'subagents/parallel agents',
    'RELEASE CANDIDATE — INDEPENDENTLY VERIFIED',
    'CRM',
    'reliability/local IT/security',
    'Skill governance',
    'INTENT LOCK',
    'PRESERVATION CONTRACT',
    'Runtime self-identity',
    'Conditional Runtime Architect / Execution Supervisor entry',
    'architect-supervisor-gate.md',
    'СЕЙЧАС',
    'WORK PRODUCTION CONTROLLER',
    'OWNER QUESTION CONTRACT',
    'TASK SPECIFICATION COMPILER',
    'QUALITY CONTRACT INJECTION',
    'SELF-EXECUTION PARITY',
    'UNIVERSAL OUTPUT DESIGN / FORMAT-NATIVE PRESENTATION',
    'editorial-reader-experience.md',
    'universal-output-design.md',
    'publication-design-ebook.md',
    'media-production-quality.md',
    'design-thinking-visual-system.md',
    'product-experience-artifact-architecture.md',
    'RELEASE CANDIDATE — INDEPENDENTLY VERIFIED',
]
for phrase in required_phrases:
    if phrase not in skill: errors.append('missing architecture invariant: '+phrase)

for phrase in ['PRODUCTION DISPATCHER v2.0.10','STRATEGIC INTELLIGENCE / OPPORTUNITY GATE','CANDIDATE ≠ RELEASE ≠ RUNTIME VERIFIED','production-dispatcher-runtime.md','strategic-intelligence-opportunity.md','growth-distribution.md']:
    if phrase not in skill: errors.append('missing v2.0.9 invariant: '+phrase)

for phrase in ['ENTITY RESOLUTION / UPDATE-IN-PLACE','CREATIVE SECOND BRAIN','CREATIVE CONTENT PRODUCTION / SECOND CREATIVE BRAIN','SHOOT CARD','learning-promotion-loop.md','channel-experience-packaging.md','creative-content-production.md']:
    if phrase not in skill: errors.append('missing v2.0.10 invariant: '+phrase)


for phrase in ['OWNER CONTEXT / NO-INVENTION','OWNER WORKSPACE ARCHITECT','CAPABILITY EXPANSION RADAR','MODEL/REASONING ECONOMICS BY EVIDENCE','ARCHITECTURE COMPLETENESS / WHAT IS MISSING','MARKET WHITESPACE / DO-NOT-GO']:
    if phrase not in skill: errors.append('missing v2.0.10 r4 invariant: '+phrase)

for phrase in ['GLOBAL CREATIVE & PRODUCT INTELLIGENCE','GLOBAL TRACTION → RU GAP → TRANSFER FIT → TESTABILITY','PRODUCT / OFFER / CONTENT / FORMAT / HOOK / BUSINESS MODEL / DISTRIBUTION','global-creative-product-intelligence.md']:
    if phrase not in skill: errors.append('missing v2.0.10 r9 intelligence invariant: '+phrase)

for phrase in ['ARTIFACT OUTCOME EVALS / EXECUTOR GRADUATION','GROWTH PROGRAMMING / WINNER-LOSER LOOP','FOUNDER VOICE CORPUS / VOICE DRIFT','AUTOMATION OBSERVABILITY','EXTERNAL CAPABILITY INTEGRATION','growth-execution-operating-system.md','artifact-outcome-executor-graduation.md','automation-observability-external-capabilities.md']:
    if phrase not in skill: errors.append('missing v2.0.10 r9 FINAL execution invariant: '+phrase)

# v2.0.9 forbids the old hardcoded future workbook migration in active runtime docs.
for bad in ['12_ПРОДУКТЫ','13_КОНТЕНТ','14_КАНАЛЫ_И_ВОРОНКИ','20_МЕТРИКИ']:
    if bad in runtime_text: errors.append('hardcoded future Business System migration leak '+bad)
if re.search(r'после утвержд[её]нной миграции.*13_КОНТЕНТ', runtime_text, re.I|re.S):
    errors.append('automatic Content System migration leak')


if 'PACKAGE VERSION: v2.0.11 RELEASE' not in skill or 'PACKAGE VERSION = v2.0.11 RELEASE' not in skill:
    errors.append('runtime self-identity does not match v2.0.11 RELEASE')
if 'PACKAGE BUILD:** `2026-10-02 core-normalization-v2.0.11-release`' not in skill:
    errors.append('runtime self-identity missing exact candidate build')

# Core normalization and Product Factory owner gates.
product=(root/'references/product-factory.md').read_text('utf-8',errors='ignore')
architect=(root/'references/architect-supervisor-gate.md').read_text('utf-8',errors='ignore')
client=(root/'references/client-work-boundary.md').read_text('utf-8',errors='ignore')
for phrase in ['P10.75', 'representative prototype', 'owner', 'format-neutral', 'temporary launch price']:
    if phrase.casefold() not in product.casefold(): errors.append('Product Factory missing v2.0.11 gate: '+phrase)
for phrase in ['NO ADDITIONAL TOOL REQUIRED','two materially identical failed repair attempts','actual final artifact','PENDING WRITE-BACK']:
    if phrase not in architect: errors.append('Architect/Supervisor gate missing: '+phrase)
for phrase in ['DOKRUTI_INTERNAL','CLIENT_WORK','data','files','access']:
    if phrase not in client: errors.append('client isolation boundary missing: '+phrase)

# Pre-release contradiction guards.
for bad in ['Content Factory делает SITE MASTER', 'OWNER APPROVED FOR TEST', 'RELEASE CANDIDATE — OWNER REVIEW']:
    if bad in skill: errors.append('stale front-door contract: '+bad)
if 'references/executive-control-layer.md' not in skill:
    errors.append('Executive Control Layer not routed from SKILL.md')

# Keep package light: no unexpected large legacy assets.
for p in root.rglob('*'):
    if p.is_file() and p.stat().st_size > 1_500_000:
        errors.append(f'oversized bundled file {p.relative_to(root)} = {p.stat().st_size} bytes')

# Basic YAML contract checks without depending on a YAML library.
yaml=(root/'agents/openai.yaml').read_text('utf-8',errors='ignore') if (root/'agents/openai.yaml').exists() else ''
for token in ['display_name:', 'default_prompt:', '- CHAT', 'allow_implicit_invocation: true']:
    if token not in yaml: errors.append('openai.yaml missing '+token)
for forbidden in ['- codex', '- api', '- atlas', '- chatgpt']:
    if forbidden in yaml.lower(): errors.append('openai.yaml forbidden product '+forbidden)

# Optional PyYAML syntax check if installed.
try:
    import yaml as pyyaml
    pyyaml.safe_load(yaml)
except ImportError:
    warnings.append('PyYAML unavailable; syntax checked structurally only')
except Exception as exc:
    errors.append('openai.yaml parse error: '+str(exc))

if errors:
    print('FAIL')
    for e in errors: print('-',e)
    if warnings:
        print('WARNINGS')
        for w in warnings: print('-',w)
    sys.exit(1)

print('PASS')
print('files',len([p for p in root.rglob('*') if p.is_file()]),'md',len(list(root.rglob('*.md'))))
print('bytes',sum(p.stat().st_size for p in root.rglob('*') if p.is_file()))
if warnings:
    print('WARNINGS')
    for w in warnings: print('-',w)
