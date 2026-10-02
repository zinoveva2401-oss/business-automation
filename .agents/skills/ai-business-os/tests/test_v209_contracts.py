#!/usr/bin/env python3
from pathlib import Path
import re, sys, hashlib, json

root=Path(__file__).resolve().parents[1]
preservation_manifest=root/'tests/v208_preservation_manifest.json'
errors=[]

def text(rel): return (root/rel).read_text('utf-8', errors='ignore')

def need(rel, *phrases):
    s=text(rel)
    for p in phrases:
        if p not in s: errors.append(f'{rel}: missing {p}')

def forbid(rel, *phrases):
    s=text(rel)
    for p in phrases:
        if p in s: errors.append(f'{rel}: forbidden {p}')

# Release identity and candidate/release distinction.
need('SKILL.md', '# DOKRUTI | BUSINESS OS v2.0.11 RELEASE (r9-derived)', 'PACKAGE VERSION: v2.0.11 RELEASE', 'PACKAGE BUILD:** `2026-10-02 core-normalization-v2.0.11-release`', 'CANDIDATE ≠ RELEASE ≠ RUNTIME VERIFIED')
need('MANIFEST.md', 'Status: RELEASE', 'exact locally verified v2.0.10 r9 archive', 'Release promotion r1')

# Dispatcher/state contracts.
need('references/production-dispatcher-runtime.md',
     'RUN-ID', 'STAGE-ID', 'EVENT-ID', 'SPEC FAIL → delegation prohibited',
     'Stage PASS + no true owner gate/blocker → automatically continue',
     'WRITE-BACK INCOMPLETE', 'duplicate event → NO-OP', 'EXPECTED STATE VERSION', 'circuit breaker')
need('references/business-system-state-contract.md',
     'no hardcoded future migration', 'Separate Content System',
     'RUN-ID/STAGE-ID/EVENT-ID', 'State-transition commit')
forbid('references/business-system-state-contract.md',
       '12_ПРОДУКТЫ', '13_КОНТЕНТ', '14_КАНАЛЫ_И_ВОРОНКИ', '20_МЕТРИКИ')

# Handoff templates must carry state identity/snapshot and safe-side-effect fields.
for rel in ['templates/execution-packet.md','templates/work-task.md','templates/codex-task.md']:
    need(rel, 'RUN-ID', 'STAGE-ID', 'EXPECTED STATE VERSION', 'SOURCE SNAPSHOT / VERSION / REVISION', 'ROLLBACK / RECOVERY')

# Strategic gate / framework diversity.
need('references/strategic-intelligence-opportunity.md',
     'Opportunity Card', 'disconfirming evidence', 'Priority Engine',
     'Awareness/Hunt ladder is a routing model', 'Format-fit gate')

# Product blueprint ordering and no Codex reinvention.
p=text('references/product-factory.md')
need('references/product-factory.md', 'P10.5 PRODUCT CONTENT BLUEPRINT', 'Only then may Codex/technical production implement the frozen content')
order=['P10 Frozen FULL PRODUCT MATRIX','P10.5 PRODUCT CONTENT BLUEPRINT','P11 Production dependency graph','P12 Whole-artifact production']
pos=[p.find(x) for x in order]
if any(i < 0 for i in pos) or pos != sorted(pos): errors.append('product-factory.md: stage ordering invalid')

# Content must not force site-first and must close publish/data loop.
c=text('references/marketing-content-engine.md')
need('references/marketing-content-engine.md', 'A SITE MASTER is required only when', 'PUBLISHED ≠ PUBLISHED VERIFIED', 'actual URL/object/version/access', 'SCALE / FIX / REUSE / REPURPOSE / HOLD / KILL / ARCHIVE')
if re.search(r'workflow\s*\n\n`[^`]*SITE MASTER[^`]*`', c, re.I):
    errors.append('marketing-content-engine.md: SITE MASTER still hardcoded in workflow')

# Growth loop.
need('references/growth-distribution.md', 'Channel job and baseline', 'Fresh platform intelligence', 'Growth hypothesis', 'Series, not one lucky post', 'Funnel handoff', 'SCALE / FIX / ADAPT / HOLD / KILL / AUTOMATE')

# Sales/money safety.
need('references/sales-crm-attribution.md', 'READY-TO-SELL gate', 'PUBLIC SALE BLOCKED', 'PAYMENT SUCCESS + DELIVERY FAIL = Critical incident', 'Activation / first value', 'Money write-back')

# Automation loop safety.
need('references/technology-automation.md', 'idempotency/dedupe', 'one-writer lock/lease', 'dead-letter/BLOCKED', 'circuit breaker', 'must not retrigger itself forever', 'Portable runtime watchdog core', 'Shared transport / job envelope', 'GitHub → Codex subscription transport', '@codex <task>', 'self-contained', 'must not be the only place', 'ordinary ChatGPT with an authorized GitHub connector', 'openai/codex-action')
need('scripts/runtime_watchdog.py', 'duplicate event', 'self-generated commit/event', 'RE-SPEC / REROUTE', 'max retry reached', 'FileLease', 'run_id mismatch', 'stage_id mismatch without stage_started', 'stale state version', 'stage already started', 'checkpoint cannot assign status', 'stage_verified requires НА ПРОВЕРКЕ state', 'owner_gate requires a permitted owner_gate_class', 'owner_decision_resolved requires evidence', 'no active owner decision to resolve', 'stage_blocked requires explicit blocker')

# Old strong contracts still present in Skill.
for phrase in ['TASK SPECIFICATION COMPILER','WORK PRODUCTION CONTROLLER','QUALITY CONTRACT INJECTION','SELF-EXECUTION PARITY','UNIVERSAL OUTPUT DESIGN / FORMAT-NATIVE PRESENTATION','PRESERVATION CONTRACT','OWNER QUESTION CONTRACT']:
    if phrase not in text('SKILL.md'): errors.append('preservation missing in SKILL: '+phrase)

# Preservation is self-contained: no external /tmp baseline dependency.
if not preservation_manifest.exists():
    errors.append('missing embedded v2.0.8 preservation manifest')
else:
    pm=json.loads(preservation_manifest.read_text('utf-8'))
    for rel in pm.get('required_present', []):
        if not (root/rel).exists(): errors.append('deleted v2.0.8 file: '+rel)
    for rel, expected in pm.get('byte_identical_files', {}).items():
        f=root/rel
        if f.exists() and hashlib.sha256(f.read_bytes()).hexdigest()!=expected:
            errors.append('unexpected modified preserved file: '+rel)

# Cross-contract contradictions caught in pre-release audit.
forbid('SKILL.md', 'Content Factory делает SITE MASTER', 'OWNER APPROVED FOR TEST', 'RELEASE CANDIDATE — OWNER REVIEW')
need('SKILL.md', 'v2.0.11 RELEASE', 'Директорский слой управления / Executive Control Layer')
need('references/product-factory.md', 'RELEASE CANDIDATE — INDEPENDENTLY VERIFIED')
need('references/experiments-analytics.md', 'approval_basis = POLICY / OWNER')
need('references/global-intelligence-radar.md', 'signal alone must not create owner micromanagement')
need('references/executive-control-layer.md', 'Derived, not duplicated', 'UNKNOWN / STALE / DATA NOT AVAILABLE')

# Previously verified runtime-hardening contracts must be executable, not only backlog text.
need('references/task-specification-delegation.md', 'Architecture / taxonomy lock', 'Canonical artifact placement', 'one product has one canonical root')
need('references/reliability-security-local-it.md', 'Safe-change guardrail', 'PowerShell / copy-paste preflight', 'Version / UI evidence lock', 'Large-file inspection safety')
need('references/execution-memory.md', 'Audit ≠ repair', 'State reuse / no-repeat')
need('references/product-factory.md', 'Canonical product root', 'Release package path / permission integrity', 'Unicode/escaped-name corruption', 'anyone=writer')
need('references/qa-redteam-release.md', 'Requirement traceability / independent release architect', 'Brand source / artifact lint')
need('templates/release-checklist.md', 'clean-unzip path integrity PASS', 'delivery permissions/ownership PASS')
need('SKILL.md', 'SINGLE FRONT DOOR')
need('references/strategy-portfolio.md', 'Commercial architecture master', 'PARTIAL / IN WORK', 'segment / buyer-user-payer')


# Canonical BSYS-003 backlog coverage: all 35 contracts map to executable package text.
mx_path=root/'tests/bsys003_contract_matrix.json'
if not mx_path.exists():
    errors.append('missing BSYS-003 contract matrix')
else:
    mx=json.loads(mx_path.read_text('utf-8'))
    if set(mx.keys()) != {str(i) for i in range(1,36)}:
        errors.append('BSYS-003 matrix must cover exactly contracts 1..35')
    for cid, spec in mx.items():
        for rel, phrase in spec.get('checks', []):
            f=root/rel
            if not f.exists():
                errors.append(f'BSYS-003 #{cid}: missing file {rel}')
            elif phrase not in f.read_text('utf-8', errors='ignore'):
                errors.append(f'BSYS-003 #{cid}: missing contract phrase {phrase} in {rel}')

# Tests document the new gates.
need('tests/acceptance-tests.md','AD03 Parent run','AD11 Watchdog safety','AD15 Product Content Blueprint','AD20 Money loop')
need('tests/regression-tests.md','R85 v2.0.9 remains additive','R94 Candidate/release/runtime distinction')


need('references/tool-router.md', 'Observed executor reliability', 'owner manual minutes-hours', 'a simpler ChatGPT route may outrank Work/Codex')
need('references/web-digital-asset.md', 'Reference-fidelity / browser screenshot loop', 'side-by-side/visual-diff review', 'CSS/token/build PASS cannot override material screenshot mismatch')
need('references/skill-governance-versioning.md', 'Installed Skill vs Project source / browser update contract', 'does not replace updating the installed Skill', 'Do not add the full Project runtime-source by default', 'rollback copy')
need('templates/codex-task.md', 'REFERENCE / APPROVED SCREEN EVIDENCE', 'REQUIRED BROWSER SCREENSHOTS / BREAKPOINTS', 'VISUAL-DIFF / REPAIR LOOP')

if errors:
    print('FAIL')
    for e in errors: print('-',e)
    sys.exit(1)
print('PASS')
print('v2.0.9 contracts preserved under v2.0.10: dispatcher/state/product/content/growth-money/safety/preservation')

need('references/production-dispatcher-runtime.md', 'Safe live-regression semantics', 'Correct safe blocking is successful dispatcher behavior')
