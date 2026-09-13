# COMPLETION_GATE — Final Completion Gate / Release Verifier

Статус: Действующий обязательный runtime-контракт
Версия: 1.0
Проект: `Докрути`

## 1. Обязательность

Для `DEVELOPMENT`, `SYSTEM`, `RELEASE`, значимой `INTEGRATION`, source cleanup, deployment и коммерческого digital-актива исполнитель не имеет права сам поставить внешний финальный статус. Обязательная схема:

`EXECUTOR → INDEPENDENT COMPLETION AUDITOR → CONSOLIDATED FIX → INDEPENDENT RECHECK → HANDOFF`

Аудитор — один узкий независимый subagent с рабочим именем `DOKRUTI Completion Auditor` / `Release Verifier`. Он не продолжает production и не принимает self-report за evidence.

## 2. Immutable acceptance matrix

До производства создать матрицу и больше не удалять критерии по ходу работы. Для каждого критерия обязательны:

```text
CRITERION
EXPECTED
HOW TO VERIFY
EVIDENCE
STATUS = PASS / FAIL / UNKNOWN
```

Исполняемый формат и deterministic gate: `scripts/verify-completion-gate.mjs`.

Для разрешения `VERIFIED` одновременно нужны:

- все обязательные criteria имеют `STATUS=PASS`;
- evidence содержит фактический объект проверки, а не обещание или описание маршрута;
- независимый auditor получил исходный запрос, acceptance matrix и scope напрямую;
- auditor проверил соответствующие объекты и вынес отдельный verdict;
- нет `FAIL`, `UNKNOWN`, Critical или Major дефекта;
- после исправлений выполнен independent recheck и regression.

## 3. Что не является evidence

Self-report исполнителя, список changed files, написанный им QA-report, dry-run, существование инструкции/Skill, локальный HEAD без remote readback, staging HEAD вместо требуемого default branch, build вместо требуемого browser QA и наличие Red Team-секции без фактического независимого прохода — не evidence.

## 4. Fix loop и статусы

Auditor получает исходный запрос, `MAIN`, полный acceptance, разрешённый scope и фактическое post-work состояние. Он обязан искать незавершённость: stale default branch, неправильную ветку, remote mismatch, scope leakage, неподтверждённые внешние состояния, пропущенные QA и ложный PASS.

Если есть `FAIL` или `UNKNOWN` и исправление входит в scope, владельцу не передаётся промежуточный результат:

`DEFECT REGISTER → CONSOLIDATED FIX → INDEPENDENT RECHECK`.

Внешние финальные статусы только: `VERIFIED`, `BLOCKED`, `OWNER DECISION REQUIRED`. `PARTIAL PASS` — лишь внутреннее состояние и означает продолжение работы.

## 5. Repo-local Skill decision

В текущем Codex runtime обнаружен repo-local Qwen adapter `.qwen/skills/karpathy-guidelines/`, но native автоматически вызываемый Codex Skill из репозитория фактически не предоставлен в текущей session surface. Поэтому декоративный `dokruti-release-verifier` Skill не создаётся. Обязательность реализуется через этот контракт, `AGENTS.md`, `CODEX_RUNTIME.md`, `multi_agent_v1` и deterministic script.

## 6. Проверка

Для матрицы задачи запускать:

```text
node scripts/verify-completion-gate.mjs acceptance.json verifier.json
```

Команда завершается ошибкой при любом `FAIL`/`UNKNOWN`, отсутствующем evidence, не независимом reviewer или verdict, не равном `PASS`. `--self-test` проверяет в том числе намеренно незавершённую матрицу и должен доказать, что false PASS блокируется.
