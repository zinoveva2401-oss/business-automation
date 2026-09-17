# SPEC-LINT v2

Статический preflight для SYSTEM/DEVELOPMENT-задач Codex. Реализация: `scripts/spec-lint-v2.mjs`.

Проверяются:

- пересечение `required_paths` и `forbidden_paths`, а также явные противоречия constraints;
- task class, source of truth, acceptance и evidence;
- VERIFIED-capability для обязательных инструментов;
- обязательная Git delivery chain для tracked delta: diff/status → tests/checks → commit → push → remote readback → SHA match;
- visual/performance gates, если они заявлены или применимы;
- owner gate для paid dependencies и irreversible external actions;
- обязательный quality challenge для слабого/неполного входа.

Запуск:

```powershell
node scripts/spec-lint-v2.mjs --self-test
node scripts/spec-lint-v2.mjs tests/fixtures/second-brain/spec/valid-task-packet.json
node scripts/spec-lint-v2.mjs tests/fixtures/second-brain/spec/contradictory-task-packet.json
```

`AVAILABLE` недостаточен для прохождения capability gate: для `VERIFIED` нужен фактический probe или golden test.
