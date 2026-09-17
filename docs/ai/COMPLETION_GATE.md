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

`EVIDENCE` должна быть criterion-specific: исполняемый объект обязан содержать `criterion_id`, совпадающий с ID критерия, непустой `claim`, относящийся к этому ID, `artifact_path`, точный `artifact_sha256` и поле измерения/инспекции/команды/readback. Один произвольный artifact с совпадающим SHA не может автоматически подтверждать несколько независимых критериев; deterministic verifier проверяет relevance и блокирует reused/copied evidence.

Исполняемый формат и deterministic gate: `scripts/verify-completion-gate.mjs`.

Acceptance JSON обязан содержать metadata:

```json
{
  "task_class": "SYSTEM",
  "delivery_required": true,
  "visual_required": false,
  "independent_review_required": true
}
```

Для `DEVELOPMENT`, `SYSTEM` и `RELEASE` gate требует IDs: `source_restore`, `scope_integrity`, `profile_checks`, `spec_lint_preflight`, `independent_review`. При `delivery_required=true` обязательны также `git_diff_review`, `commit`, `push`, `remote_readback`. При `visual_required=true` обязательны `browser_render`, `desktop_evidence`, `mobile_evidence`, `visual_review`. При `independent_review_required=true` обязателен `independent_auditor`. Отсутствующий ID или evidence — `BLOCKED`, даже если все присутствующие criteria имеют `STATUS=PASS`.

Если после работы остаётся tracked-file delta и задача не `READ-ONLY`/`NO-DELIVERY`, delivery обязателен по умолчанию: отсутствующее поле `delivery_required` трактуется как `true`, а явное `false` блокируется и не может отменить commit → PUSH → remote readback → SHA match. `PUSH != MERGE`: merge, deploy, hosting, publication и production access остаются отдельным scope/approval.

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

Команда завершается ошибкой при любом `FAIL`/`UNKNOWN`, отсутствующем mandatory ID/evidence, не независимом reviewer или verdict, не равном `PASS`. `--self-test` проверяет UNKNOWN, пропущенные push/readback, visual evidence, independent reviewer и полный valid fixture.
