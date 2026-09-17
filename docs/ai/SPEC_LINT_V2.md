# SPEC-LINT v2
Статический preflight для SYSTEM/DEVELOPMENT-задач Codex. Реализация: `scripts/spec-lint-v2.mjs`; wrapper с hash/HEAD/status: `scripts/run-spec-lint-preflight.mjs`.
Проверяются exact, parent/child, normalized (backslash, dot-segments, repeated slash) и reverse-nesting conflicts между `required_paths` и `forbidden_paths`.
Проверяются semantic conflicts production scope, installation gate и external delivery prohibition; task class, source of truth, acceptance, evidence, VERIFIED capabilities; Git delivery chain при tracked delta; visual/performance/owner/quality gates.
Запуск: `node scripts/spec-lint-v2.mjs --self-test` и `node scripts/run-spec-lint-preflight.mjs tests/fixtures/second-brain/repair-acceptance-matrix.json evidence.json`.
`AVAILABLE` недостаточен для capability gate: для `VERIFIED` нужен фактический probe или golden execution. Completion Gate требует criterion `spec_lint_preflight`.
