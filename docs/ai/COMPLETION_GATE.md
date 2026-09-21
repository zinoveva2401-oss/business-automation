# COMPLETION_GATE — Final Completion Gate / Release Verifier

Статус: Действующий обязательный runtime-контракт
Версия: 1.1
Проект: `Докрути`

## 1. Обязательность

Для `DEVELOPMENT`, `SYSTEM`, `RELEASE`, значимой `INTEGRATION`, source cleanup, deployment и коммерческого digital-актива producer не имеет права сам поставить quality PASS. Сначала обязателен внутренний [`SECOND_BRAIN_REVIEW_BOARD.md`](SECOND_BRAIN_REVIEW_BOARD.md).

Обычная reversible работа:

`PRODUCER → EVIDENCE FREEZE → SEQUENTIAL SPECIALIST PASSES IN SAME CHAT → REVIEW CHAIR → ACCEPT_INTERNAL → MATERIAL COMPLETION GATE → READY`

High-risk/irreversible/runtime работа при `independent_review_required=true`:

`INTERNAL REVIEW BOARD → MATERIAL COMPLETION GATE → READY_FOR_INDEPENDENT_QA → EXTERNAL/OWNER INDEPENDENT QA → VERIFIED`

Локальный executor не может доказать внешнюю независимость внутри собственного runtime. Поля `independent`, `reviewer`, `verdict`, имя subagent, secret или nonce в executor-owned JSON не создают доверенного происхождения внешней проверки. Внутренний quality loop выполняется последовательными read-only role-checklists в том же чате; физические subagent threads не обязательны. Их evidence и verdict должны блокировать owner-facing handoff при `REWORK`.

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

Task packet / execution packet до implementation обязан зафиксировать: `OWNER INTENT`, `METHOD CHALLENGE`, `SOURCE ACCESS MAP`, `CURRENT INTELLIGENCE` при необходимости, `DOMAIN PRODUCTION ROUTE`, `PRE-PRODUCTION PROOF`, применимый quality contract, `SEQUENTIAL REVIEW PASSES`, `TASK BUDGET` и `STOP CONDITION`. Для каждого material criterion добавляется trace `REQ-ID → EXPECTED OBSERVABLE DELTA → TARGET LOCATION/ROUTE/FILE/SCREEN → VERIFY METHOD → REQUIRED EVIDENCE`; для redesign/rebuild — transformation map `CURRENT → TARGET`. Для mixed customer-facing artifact acceptance matrix разделяет technical, visual, product, media и content lanes; technical PASS не может перекрыть FAIL/UNKNOWN другой применимой lane.

Для `DEVELOPMENT`, `SYSTEM` и `RELEASE` gate требует IDs: `source_restore`, `scope_integrity`, `profile_checks`, `spec_lint_preflight`, `internal_review_board`, `artifact_truth`. При `delivery_required=true` обязательны также `git_diff_review`, `commit`, `push`, `remote_readback`. При `visual_required=true` обязательны `browser_render`, `desktop_evidence`, `mobile_evidence`, `visual_review`, `reference_fidelity`. При `independent_review_required=true` дополнительно обязательны `independent_review` и `independent_auditor`. Отсутствующий ID или evidence — `BLOCKED`, даже если все присутствующие criteria имеют `STATUS=PASS`.

`artifact_truth` обязан содержать criterion-specific claim, expected observable delta, actual final location, final artifact path + SHA256, reviewed artifact path + SHA256 и actual inspection; deterministic gate проверяет существование и hash exact final artifact и совпадение reviewed/final identity. Для `reference_fidelity` evidence обязано содержать distinct material before/reference/after artifacts с path + SHA256, а final-after identity должна совпадать с exact artifact under review. Missing reference, same before/after, stale candidate, path/hash mismatch или build/commit/report-only evidence — `BLOCKED`.

Противоречие между producer claim и фактическим artifact даёт `COMPLETION_INTEGRITY_FAIL + STOPPED_INCOMPLETE`; локальный runtime не превращает такой результат в `READY`/`ACCEPT_INTERNAL`.

Если после работы остаётся tracked-file delta и задача не `READ-ONLY`/`NO-DELIVERY`, delivery обязателен по умолчанию: отсутствующее поле `delivery_required` трактуется как `true`, а явное `false` блокируется и не может отменить commit → PUSH → remote readback → SHA match. `PUSH != MERGE`: merge, deploy, hosting, publication и production access остаются отдельным scope/approval.

Локальный deterministic gate проверяет material acceptance criteria, включая artifact внутреннего Review Board. При `independent_review_required=true` он возвращает только `READY_FOR_INDEPENDENT_QA`. При `independent_review_required=false` он может закрыть material gate локально после `ACCEPT_INTERNAL`; это не отменяет owner gate для необратимых действий.

Если `independent_review_required=true`, для внешнего разрешения `VERIFIED` одновременно нужны:

- все обязательные criteria имеют `STATUS=PASS`;
- evidence содержит фактический объект проверки, а не обещание или описание маршрута;
- независимый auditor получил исходный запрос, acceptance matrix и scope напрямую;
- auditor проверил соответствующие объекты и вынес отдельный verdict;
- нет `FAIL`, `UNKNOWN`, Critical или Major дефекта;
- после исправлений выполнен independent recheck и regression.

## 3. Что не является evidence

Self-report исполнителя, список changed files, написанный им QA-report, dry-run, существование инструкции/Skill, локальный HEAD без remote readback, staging HEAD вместо требуемого default branch, build вместо требуемого browser QA и наличие Red Team-секции без фактического независимого прохода — не evidence.

## 4. Fix loop и статусы

Внутренний Review Chair получает исходный запрос, `MAIN`, acceptance, фактический artifact/evidence и specialist reports. Он обязан искать незавершённость и не учитывать producer self-PASS. Если есть `REWORK`, `FAIL` или `UNKNOWN` и исправление входит в scope, владельцу не передаётся промежуточный результат:

`DEFECT REGISTER → CONSOLIDATED FIX → FRESH SPECIALIST RECHECK → REVIEW CHAIR`.

При formal external gate внешний auditor дополнительно проверяет stale branch, remote mismatch, scope leakage, неподтверждённые внешние состояния и ложный local PASS.

Для routine work owner-facing статусы: `READY`, `BLOCKED`, `OWNER DECISION REQUIRED`. `READY_FOR_INDEPENDENT_QA` используется только когда `independent_review_required=true`. Внешний formal verdict при таком gate: `VERIFIED`, `BLOCKED`, `OWNER DECISION REQUIRED`. `PARTIAL PASS` и `REWORK` — внутренние состояния и означают продолжение работы.

## 5. Repo-local Skill decision

Внутренняя независимость реализуется не декоративным Skill-флагом и не созданием новых threads, а evidence firewall, последовательными project role-checklists из `.codex/agents/`, контрактами [`SECOND_BRAIN_REVIEW_BOARD.md`](SECOND_BRAIN_REVIEW_BOARD.md), `AGENTS.md`, `CODEX_RUNTIME.md` и deterministic material gate. Профили read-only и не должны быть producer-ом проверяемого artifact; `.codex/config.toml` держит физические agents disabled по умолчанию.

## 6. Проверка

Для матрицы задачи запускать:

```text
node scripts/verify-completion-gate.mjs acceptance.json verifier.json
```

При `independent_review_required=true` команда возвращает `READY_FOR_INDEPENDENT_QA` после прохождения material criteria; она не принимает executor-created reviewer/verdict за доказательство независимости. Команда завершается ошибкой при любом `FAIL`/`UNKNOWN`, отсутствующем mandatory ID/evidence. `--self-test` отдельно доказывает, что полностью заполненный executor-owned `verifier.json` не приводит к `VERIFIED`, а невалидные material gates остаются `BLOCKED`/`FAIL`.
