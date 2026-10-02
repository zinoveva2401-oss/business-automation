# Production Dispatcher Runtime Contract v2.0.9

## Purpose

One owner instruction must become one parent production run that can survive executor changes, chat changes and interruptions without asking Svetlana to carry context manually.

Core route:

`OWNER INTENT → BOOTSTRAP → STRATEGIC/PRE-FLIGHT → ROUTE → SPEC PASS → EXECUTE → EVIDENCE → INDEPENDENT VERIFY → REPAIR IF NEEDED → NEXT STAGE → WRITE-BACK → READBACK → CLOSE`.

The dispatcher manages transitions. Product/Content/Growth/Sales/Tech factories produce. Strategic Intelligence decides what is worth producing. Independent QA permits release.

## 1. Parent RUN

Every substantial multi-stage task has one stable `RUN-ID`.

Minimum parent-run state:
`RUN-ID / original owner instruction / immutable owner intent / final acceptance / STAGES / CURRENT STAGE / status / executor / exact source snapshots / frozen baseline / allowed changes / DO NOT TOUCH / owner gates / evidence / open defects / retry count / NEXT ACTION / RETURN TO / TASK BUDGET / write-back / state version / last EVENT-ID`.

`14_ЗАПУСКИ` is the current parent-run state when that sheet exists in the live Business System. `03_ЖУРНАЛ` is transition/evidence history. `02_РАБОТА` holds active child work and links it to the parent through `RUN-ID` + `STAGE-ID` when these fields exist.

Do not create substitute sheets or new schemas merely because this package describes the logical fields. Always inspect the live workbook first.

## 2. Run states

Owner-facing logical states:
- `ПРИНЯТО`;
- `КОНТЕКСТ ВОССТАНОВЛЕН`;
- `МАРШРУТ СОБРАН`;
- `ТЗ ПРОШЛО ПРОВЕРКУ`;
- `В РАБОТЕ`;
- `НА ПРОВЕРКЕ`;
- `НА ИСПРАВЛЕНИИ`;
- `ЖДЁТ РЕШЕНИЯ СВЕТЛАНЫ`;
- `ЗАБЛОКИРОВАНО`;
- `ПРОВЕРЕНО`;
- `ЗАПИСАНО/ЗАКРЫТО`.

Technical executor states may use `RUNNING / WAITING_OWNER / STOPPED_INCOMPLETE / COMPLETED_UNVERIFIED / VERIFIED`, but the producer cannot self-assign the final parent `VERIFIED`.

## 3. Mandatory transition gates

A stage may move to execution only when:
1. current state, OWNER INTENT and latest decision were restored;
2. the proposed method was challenged and no cheaper/safer route meets the same acceptance;
3. the stage has one bounded result and ordered dependencies;
4. every source is actually accessible to the executor or an exact snapshot is supplied;
5. `PRESERVE / CHANGE / DO NOT TOUCH`, decision rights and acceptance/evidence are explicit;
6. capability/model/runtime/permission preflight passed without unsupported hard-pins;
7. TASK BUDGET covers quota + predicted chats/threads/restarts + owner time + rollback;
8. transport is permitted by owner policy; for Codex default = one owner-submitted visible chat, no automatic continuation/fork;
9. `SPEC LINT = PASS`.

`SPEC FAIL → delegation prohibited`.

After execution compare `EXPECTED DELTA vs ACTUAL DELTA`, then run independent applicable QA.

The legacy transition rule `Stage PASS + no true owner gate/blocker → automatically continue` applies only inside the same already-authorized runtime/session. A new chat/task/fork is a new transport action and requires the standing transport rule or explicit owner permission.

## 4. Repair and anti-loop

First local defect: repair the same stage with a consolidated defect list.

If the same misunderstanding/defect repeats a second time, a blind third retry is forbidden. Recompile source/scope/spec, reduce granularity, change tool/executor or reroute.

Persistent capability/permission/risk blocker becomes `BLOCKED` and is escalated only if a real owner decision is required.

## 5. Owner gates

Ask Svetlana only when evidence requires a material owner choice, for example:
- target audience/positioning/public promise changes;
- materially new price/economics/spend;
- material legal/reputation/data risk without an existing rule;
- irreversible/high-impact public action, destructive delete, payment or sensitive access change;
- two genuinely equivalent strategic options remain after evidence;
- portfolio-level product/channel closure materially changes strategy.

Routine editorial, visual, technical and QA decisions are not owner gates. Runtime owner-gate events must name a permitted gate class (strategy/positioning, material price/spend, legal-reputation-data risk, irreversible/high-impact action, sensitive access, public promise/brand, genuinely equivalent strategic options, or portfolio closure); a bare `owner_gate=true` is invalid.

## 6. Capability preflight

Before choosing Work/Codex/connector/MCP/browser/other executor verify:
`available? / write permission? / current account/OS compatibility? / relevant limit? / current source? / acceptable cost? / rollback? / evidence path?`.

If automatic cross-surface transport does not exist, do not pretend it does. Prefer shared canonical artifacts/state. Owner copy-paste is last fallback and counts as automation debt.

## 7. Safe side effects and event idempotency

Every side-effecting transition must be replay-safe.

Required controls when technically applicable:
- stable `RUN-ID` and `STAGE-ID`;
- unique `EVENT-ID` or dedupe key;
- last-processed marker + optimistic `EXPECTED STATE VERSION`; stale/out-of-order event → REJECT;
- one-writer lock/lease for overlapping state;
- duplicate event → NO-OP; this includes duplicate EVENT-ID, and a fresh EVENT-ID that repeats the same logical `stage_started` is also NO-OP;
- max retry and execution budget;
- cooldown/backoff;
- dead-letter/BLOCKED path;
- circuit breaker when repeated failures or spend thresholds trigger;
- rollback/recovery route for high-impact writes.

A write-back event must not recursively retrigger itself without a state/version guard. Long-term dedupe is anchored in the canonical EVENT journal; the portable local core keeps only a bounded recent-event cache and must not be treated as the sole permanent replay ledger.

## 8. State-transition commit

A meaningful stage transition is complete only after this logical chain:

`stage evidence → child work state → parent checkpoint/NEXT ACTION → journal EVENT → readback`.

If a write partially succeeds, status is `WRITE-BACK INCOMPLETE`, not `VERIFIED`. Reconcile on the next bootstrap before continuing dependent work.

## 9. Recovery in a new chat/runtime

For an open substantial run restore:
1. live Business System basics;
2. matching parent `RUN-ID` current state if available;
3. matching active child rows by `RUN-ID/STAGE-ID`;
4. latest relevant owner decisions;
5. exact task SoT and snapshots;
6. last journal `EVENT-ID`/evidence when needed;
7. unresolved blockers/acceptance;
8. `NEXT ACTION`.

Do not ask Svetlana to retell the history if the canonical state is available.

## 10. Candidate vs release

`CANDIDATE BUILT ≠ RELEASE ≠ RUNTIME VERIFIED`.

A Business OS candidate can be assembled after architecture PASS, but it becomes an install/release candidate only after package validation, preservation/regression checks and required live runtime tests. Runtime VERIFIED requires real behavior, not static Markdown presence.

### Safe live-regression semantics

A live regression must not create a public, financial, destructive, privacy-sensitive or otherwise material side effect only to prove the Skill. A scenario is a runtime PASS when the system correctly detects a genuine external prerequisite or owner gate, records `BLOCKED / WAITING OWNER / PARTIAL / DATA NOT AVAILABLE` truthfully, preserves evidence, names the exact `NEXT ACTION`, and does not fabricate completion or metrics. Correct safe blocking is successful dispatcher behavior; it is not a Skill failure.

## 11. Transport adapter contract

Transport is a replaceable adapter, not the business brain. The dispatcher must remain usable if the physical orchestrator changes.

Every transport hop carries the same `RUN-ID / STAGE-ID / ONE RESULT / exact accessible sources/snapshots / acceptance / evidence / stop condition / TASK BUDGET`. Transport must match the owner's standing rule. For Svetlana→local Codex, default transport is **Business OS drafts/checks one copy-ready packet → Svetlana manually submits it to one visible Codex chat**. Business OS and Codex must not auto-start/continue/fork/create chats/tasks unless Svetlana explicitly authorizes that action. Shared canonical state may reduce context but does not grant hidden access.

The package includes `scripts/runtime_watchdog.py` as a deterministic portable event-core reference. It proves bounded local replay/loop/retry semantics, optimistic state-version checks, RUN/STAGE isolation, explicit owner-decision resolution and verification-bypass prevention, but does not by itself prove provider authentication or direct Chat↔Work↔Codex transport. Every mutating event carries the expected current state version; stale/out-of-order events are rejected. A generic checkpoint may never self-assign `ПРОВЕРЕНО/VERIFIED` or `ЗАБЛОКИРОВАНО`; verification is accepted only from `НА ПРОВЕРКЕ` with explicit evidence, and blocking uses an explicit blocker event/reason.

For the current DOKRUTI local-Codex setup, do not create a parallel GitHub branch/PR/issue as transport when the same local canonical repo/branch is already the working surface. GitHub is delivery/readback, not a duplicate runtime. A GitHub job envelope is allowed only when the owner explicitly chooses that cloud route and its cost/context implications were preflighted.

Do not substitute `openai/codex-action` for the subscription route unless separate API/provider credentials, cost and security have been explicitly accepted and preflighted.

## Missing-owner-context state

A stage may enter `WAITING OWNER INPUT` only when:
- the missing fact materially changes acceptance/strategy/personalization/risk;
- current sources were checked first;
- the exact question and reason are recorded;
- the system cannot safely continue with a reversible labeled assumption.

`WAITING OWNER INPUT` is not permission to create a new task. Resume the same RUN/STAGE after answer and write back the confirmed fact only to the appropriate canonical place.
