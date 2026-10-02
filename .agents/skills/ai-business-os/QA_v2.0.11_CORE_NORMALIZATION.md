# v2.0.11 Core Normalization — QA record

Status: **RELEASE CANDIDATE; runtime and independent acceptance pending**
Date: 2026-10-02
Base: exact verified r9 archive SHA-256 `322d3dcce936f444b0b5e7547985c97b58b36139bb98b307c3c3eaf7a5857458`
Candidate build: `2026-10-02 core-normalization-v2.0.11`

## Scope

The r9 package already provides domain modules for Product Factory, market and professional research, owner-practice extraction, marketing, finance, legal/IP, editorial, UX, visual futures, technical production, QA/Red Team, source and model/tool routing, cost control, current-intelligence triggers and confirmed write-back. Existing watchdog and dispatcher tests remain the executable reference for state and loop behavior.

This candidate adds only the missing integration gates found during the capability audit:

1. Conditional Runtime Architect / Execution Supervisor entry over existing modules, with explicit no-additional-tool choice, scope/source/access/cost boundary, anti-loop reroute and artifact/review/write-back closeout.
2. Product Factory P10.75, requiring a real content prototype and owner approval of material direction before full production; format-neutral value standards are explicit.
3. Conditional future `DOKRUTI_INTERNAL` / `CLIENT_WORK` context isolation. No Client Factory is created.
4. Product-local Skill reduced to executor routing so it cannot override shared Core business strategy.

## Local verification

- Original canonical r9 ZIP re-read after QA: SHA-256 matched `322d3dcce936f444b0b5e7547985c97b58b36139bb98b307c3c3eaf7a5857458`.
- Exact archive-vs-candidate comparison: all 124 original files present; 7 changed originals are exactly `SKILL.md`, `MANIFEST.md`, `references/INDEX.md`, `references/product-factory.md`, `tests/validate_package.py`, `tests/test_v209_contracts.py`, and `tests/test_v210_contracts.py`; 4 new files are exactly this QA record, two new reference modules and `tests/test_v211_core_gates.py`. No other archive file changed. Baseline byte total reported by the exact current ZIP comparison: 899,040.
- Candidate validator: PASS (`128` files / `91` markdown files; PyYAML unavailable, structural syntax checks only).
- All `26` direct `test_*.py` files: PASS after aligning historical r9 identity assertions with the candidate/release distinction.
- New `tests/test_v211_core_gates.py` covers candidate identity, conditional Architect routing, prototype/owner gate, format neutrality, client isolation and local executor de-duplication.
- PyYAML is unavailable in the bundled runtime; validator's documented YAML syntax-only checks are used. No dependency was installed.
- Fresh-session Product Factory project smoke has not been run. The current Codex session cannot prove a new project discovers this package.
- Independent Business OS QA, final candidate ZIP identity and live write-back have not been completed.

## Release decision

Do not call this candidate RELEASE, runtime-installed, externally verified or eligible for live state write-back until the fresh-session smoke and independent review pass, exact final artifact identity is recorded, and the required regression/readback gates are complete.
