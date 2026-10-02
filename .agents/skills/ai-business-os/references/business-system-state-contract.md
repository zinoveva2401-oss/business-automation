# Business System State Contract v2.0.10

## 1. One live Control Center

Canonical operational state is the live Google Sheet `Бизнес-система` plus task-specific current sources. Large artifacts stay in Drive/GitHub; the Business System stores status, links, evidence, dependencies, decisions and NEXT ACTION.

Never treat exports/snapshots as current operational state when the live sheet is accessible.

For significant products/site/content/automation artifacts, resolve the current canonical root/master link before creation or delegation. Temporary/sandbox/executor-specific copies are evidence/workspace only until promoted and read back in the canonical source.

## 2. Live-schema rule — no hardcoded future migration

This package MUST NOT assume or auto-create a fixed future list of sheet tabs.

At bootstrap inspect the actual live workbook and use the roles that already exist. A new sheet/column/schema change is allowed only after a demonstrated structural gap, bounded design, collision check and readback. Do not create duplicate operational structures merely because a reference document describes a logical field.

Current known roles may include `00_ШТАБ`, `02_РАБОТА`, `03_ЖУРНАЛ`, `04_СИСТЕМА`, `05_ДЕНЬГИ`, `06_РЕШЕНИЯ`, `13_РЕЕСТР_МАСТЕРОВ`, `14_ЗАПУСКИ` and others, but exact tab names/availability are dynamic live state, not eternal Skill architecture.

## 2.1. ENTITY RESOLUTION / UPDATE-IN-PLACE — новая мысль не равна новой строке

Перед созданием **любой новой operational row / RUN / task / channel record / content object / product hypothesis** сначала разреши сущность в текущей live-схеме.

Минимальный порядок:
1. определить, что это за объект: `existing task update / child stage / new independent task / decision clarification / signal-idea / content unit / journal event / product hypothesis / channel state`;
2. найти релевантные активные строки по стабильному ID, parent RUN, цели, acceptance, названию/синонимам и зависимостям;
3. проверить последние применимые решения и task-specific SoT;
4. если совпадает конечный результат/объект — **переиспользовать существующий ID и строку**, обновив `CURRENT STAGE / status / evidence / blocker / NEXT ACTION / last updated`;
5. child stage/event привязать к parent RUN вместо создания конкурирующей parent task;
6. новую строку создавать только если это действительно новый самостоятельный объект с отличающимся результатом/acceptance/lifecycle и он не является стадией, уточнением или сигналом существующей задачи;
7. после записи сделать readback и убедиться, что не появился смысловой дубль.

Нельзя создавать новую задачу только потому, что:
- пришла новая формулировка той же проблемы;
- изменился исполнитель/инструмент;
- появился новый дефект внутри уже открытого RUN;
- owner уточнил способ выполнения;
- та же идея получила новый формат;
- старый статус оказался stale.

В этих случаях обнови существующий объект. Если старая строка неверна/устарела, исправь её состояние с evidence вместо создания «правильной новой копии».

### Content-system dedupe
Для отдельной `Контент-системы` сначала ищи тот же центральный вопрос/боль/intent и существующий content ID. Новые platform adaptations, обложки, ролики, карусели и производственные outputs одной content idea **не обязаны становиться новыми content-plan строками**: храни их как outputs/variants, если они не являются самостоятельными публикационными единицами с собственной задачей/intent.

### Decision dedupe
Уточнение существующего решения не требует нового решения, если business choice не изменился materially. Если новое owner decision действительно отменяет/изменяет прежнее — новая decision record должна явно ссылаться на `SUPERSEDES/AMENDS`, а не жить как неоднозначный дубль.

## 3. Separate Content System

If a separate current `Контент-система` exists, it remains its own source of truth for content queue/outputs/analytics until an explicit, evidence-backed migration decision exists.

Never automatically migrate it, archive it or create substitute content/metrics sheets by package assumption. Reuse its existing research and IDs; update brand/product/commercial truth at production time.

## 4. Stable IDs and traceability

Use stable IDs appropriate to the object. Existing prefixes remain valid. For orchestration add:
`RUN-` parent run / `STAGE-` child stage / unique `EVENT-ID` or dedupe key for meaningful state transitions.

When the live schema supports it:
- parent current state → `14_ЗАПУСКИ`;
- active child work → `02_РАБОТА` with `RUN-ID/STAGE-ID`;
- history/evidence → `03_ЖУРНАЛ` with `RUN-ID/STAGE-ID/EVENT-ID`.

Do not create these fields again if an equivalent canonical structure already exists.

## 5. Session bootstrap

Use minimal context:
`unresolved PENDING WRITE-BACK markers when relevant → 00_ШТАБ → relevant open 02_РАБОТА → parent RUN state when the task belongs to an open substantial run → latest relevant 06_РЕШЕНИЯ → mutable task SoT → task-specific sources`.

For an open run, restore `CURRENT STAGE / acceptance / exact source snapshots / frozen baseline / allowed changes / open defects / retry / NEXT ACTION / last EVENT-ID/state version` as available.

If mutable external state may have changed (GitHub HEAD, deploy, automation, payment, CRM, domain, platform UI), verify the live source before relying on an old row.

Do not read the whole workbook.

### Runtime identity

Package self-identity comes from the active Skill instructions. A self-declared version is package evidence, not platform install telemetry. Control Center stores rollout/runtime-verification state and can be stale.

Do not reinstall the same package merely because an old rollout row says “install”. If package version is already current, proceed to live/runtime verification and update stale operational state after evidence.
If active package/install evidence contradicts an older operational row (for example the Skill is already installed but a row says “prepared/not installed”), reconcile and **update the existing rollout/task row in place** after evidence. Do not create a second installation task to correct stale status.

### Effective-state precedence

`latest direct owner decision → newer verified pending write-back → fresh canonical live state → verified mutable-source readback → older history/snapshot`.


## 5.1. Master/dependency registry

If the live Business System contains a master-document registry (for example `13_РЕЕСТР_МАСТЕРОВ`), read only the rows relevant to the current task before assuming a strategic/commercial/product/legal master is complete. `PARTIAL/IN WORK` means dependency state, not permission to invent missing truth and not an automatic blocker: use the latest actual master/source, proceed on independent stages when safe, and mark what remains conditional. Never create a duplicate master because an older file looks incomplete.

## 6. Write-back

Write only confirmed state changes such as:
- owner decision;
- stage/status/checkpoint;
- new/closed blocker;
- verified result/evidence;
- NEXT ACTION/RETURN TO;
- experiment result;
- confirmed money/revenue/expense;
- capability/install/remove event.

Do not store hidden reasoning or unverified guesses as operational truth.

## 7. Safe write / concurrency / idempotency

Before a write:
1. capability/permission preflight;
2. fresh read of the target and relevant version/state;
3. reconcile if state changed;
4. for side effects, use stable event/dedupe identity where technically possible;
5. write with one-writer or non-overlapping scope;
6. readback;
7. report success only after readback.

Duplicate event/transition should be NO-OP. Critical automations need retry limits, lock/lease, cooldown/backoff, dead-letter/BLOCKED route, circuit breaker and rollback/recovery where applicable.

Never let a write-back event recursively trigger itself without a state/version/dedupe guard.

## 8. State-transition commit

For a meaningful parent-run transition, the logical commit is:
`stage evidence → child state → parent checkpoint/NEXT ACTION → journal EVENT → readback`.

Partial success = `WRITE-BACK INCOMPLETE`. On the next bootstrap reconcile before dependent execution.

If direct canonical write is blocked, preserve a precise `PENDING WRITE-BACK` record/comment when that route is available; never call the canonical update complete until the actual target is written and read back.

## 9. Automation health

For canonical scheduled/critical automations store enough current state to detect silent failure and duplicates, e.g.:
`automation_id / purpose / enabled / trigger-or-schedule / timezone / last_success / last_error / next_run / persistence / duplicate-or-dedupe rule / recovery / owner`.

Exact fields/sheet are live implementation details, not a hardcoded migration requirement.

## 10. Daily action brief

`Что сегодня?` is an execution query. Preserve unfinished stage chains and return:
- `СЕЙЧАС` exact next action;
- maximum one MAIN + two SIDE;
- next dependent step;
- only active owner gates;
- `НЕ ТРОГАТЬ` distractions when useful.

Inactive business domains stay hidden rather than appearing as empty HOLD rows.

## Knowledge-capital write-back / no idea-bank spam

After a verified solution, learning or reusable method, first search the existing asset/product-hypothesis/knowledge records. Update the existing object with new evidence, format options or applicability. Create a new asset/product-hypothesis record only when the reusable value core, buyer/result or method is materially distinct. A useful observation is not automatically a new task, product or sheet row.
