# CODEX-SECOND-BRAIN-001 — Golden Evidence

Дата: 2026-09-17. Все fixtures bounded, локальные и не меняют `src/`, `public/` или product/content scope.

| Test | Result | Evidence |
|---|---|---|
| A — premium web | PASS | `tests/fixtures/second-brain/visual/index.html`, real CUA render, interaction and review evidence |
| B — premium SaaS/UI | PASS | same visual fixture plus safe interaction/keyboard path |
| C — digital product format-fit | PASS | `product/format-fit.json`, selected interactive diagnostic with rationale |
| D — dashboard states | PASS | decision usefulness, filters, drill-down, freshness, loading/empty/error/ready and stacked mobile state |
| E — multi-source media | PASS | inventory → content map → story/edit plan → production; simple stitch rejected |
| F — motion | PASS | meaningful motion, 16ms budget and reduced-motion fallback fixture; bundled media probe |
| G — automation | PASS | retryable failure → accepted → duplicate; one commit only |
| H — weak input | PASS | `CHALLENGED`, concrete problems and stronger options |
| I — image weight | PASS | before/after/delivery byte evidence, responsive formats, slow-connection check |
| J — format QA | PASS | video master/delivery byte delta and mobile-open check; document size/compression/readability/compatibility |
| K — Git delivery | PASS | current branch readback and local SHA == remote SHA |
| L — contradiction | PASS | SPEC-LINT valid packet passes; contradictory packet fails with overlap |
| M — paid tool gate | PASS | SPEC-LINT owner-gate rule enforced in self-test |

Command bundle:

```powershell
node scripts/spec-lint-v2.mjs --self-test
node scripts/security-baseline-scan.mjs --self-test
node scripts/skill-regression-harness.mjs
npm run check
```

Mobile evidence is a real browser render of the fixture's explicit 390px preview mode. The current CUA surface does not expose true device viewport emulation; this remains a documented PARTIAL capability rather than an invented PASS.
