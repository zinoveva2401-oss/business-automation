# Golden fixtures
Bounded inputs и browser artifacts для `CODEX-SECOND-BRAIN-001` находятся в `tests/fixtures/second-brain/`. Inputs описывают job/constraints/candidate paths; measured results создаются `scripts/second-brain-executable-golden.mjs` во временной директории.
Запуск: `node scripts/second-brain-executable-golden.mjs --run` и `node scripts/skill-regression-harness.mjs`.
Fixture data не является business truth, visual approval или live deployment claim. Production files остаются вне runtime/test scope.
