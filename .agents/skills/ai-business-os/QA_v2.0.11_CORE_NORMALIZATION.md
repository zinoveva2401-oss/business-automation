# v2.0.11 Core Normalization — Release QA record

Status: **RELEASE; Architect runtime gate, independent Review Chair acceptance and final Core cleanup QA PASS; live Business System write-back pending**
Date: 2026-10-02
Base: exact verified r9 archive SHA-256 `322d3dcce936f444b0b5e7547985c97b58b36139bb98b307c3c3eaf7a5857458`
Release build: `2026-10-02 core-normalization-v2.0.11-release`

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
- New `tests/test_v211_core_gates.py` covers candidate identity, conditional Architect routing, prototype/owner gate, format neutrality and client isolation. The repo-local `dokruti-product-production` Skill was separately compared and reduced to executor procedures; it is not a dependency of the standalone Core package.
- PyYAML is unavailable in the bundled runtime; validator's documented YAML syntax-only checks are used. No dependency was installed.
- The exact v2.0.11 candidate ZIP and clean-unzip verification are produced separately in the run's local evidence/output area; their path, SHA-256 and test result are recorded in its sidecar manifest.
- Fresh Product Factory runtime: CWD `products`, root Core inheritance, Product Factory overlay, repo-scoped v2.0.11 discovery and live Business System access confirmed. Architect preflight was applied before one bounded source-audit next-step card; no product files were created or edited.
- Independent Review Chair challenge: PASS for Architect runtime acceptance only; reviewer confirmed live rows 83 and 101 plus the linked current-product/research folders, and explicitly did not credit the underlying research audit as completed. Live write-back is the remaining authorized completion step after final Core QA PASS.

## Release decision

The v2.0.11 package was promoted to RELEASE after the fresh Product Factory runtime acceptance and independent Review Chair PASS. DOKRUTI-CORE-001 remains unverified in the live Business System until exact cleanup, remote readback and final Core QA are complete. The original candidate ZIP remains a review artifact; the repository package is RELEASE.
