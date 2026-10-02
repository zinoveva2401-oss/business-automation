# Execution Memory & Requirements Traceability

## Problem this module prevents

Long prompts often degrade: first steps are good, later requirements disappear, and the agent declares completion without checking the original ask.

## Required state for big tasks

Maintain:
`MAIN / STAGES / CURRENT STAGE / SOURCE OF TRUTH / ACCEPTANCE / OWNER GATES / TASK BUDGET / NEXT ACTION / RETURN TO`.

## Requirement Ledger

At intake convert every explicit and critical implicit requirement to `REQ-001...`.

Fields:
`REQ-ID | exact requirement | source | stage | owner | evidence needed | QA gate | status`.

Do not show the full ledger unless useful, but use it internally.

## Stage checkpoints

At end of each major stage:
1. What was completed?
2. Evidence path/result?
3. Which REQ IDs closed?
4. New blocker/scope change?
5. What exact next stage?
6. Write-back required?

## Context compression

When a task is too large for one context:
- preserve decisions, evidence, unresolved requirements and file paths;
- drop verbose exploration;
- never drop acceptance criteria or owner decisions.

## Task budget

Budget may include:
- research sources;
- number of competitor products;
- full render cycles;
- Work runs;
- Codex iterations;
- files changed;
- tokens/time.

If budget is exhausted without acceptance, diagnose before repeating.

## Anti-loop rule

Same defect twice → stop random retry, identify cause, change route.

## Audit ≠ repair

An audit/diagnosis closes only the diagnostic requirement. If the parent acceptance is `исправить / внедрить / синхронизировать / довести`, the stage is not complete until the change is actually executed and its acceptance/readback passes. A defect list is evidence for repair, not a substitute for repair.

## State reuse / no-repeat

Do not repeat already closed checks, research or setup steps without a new symptom, changed source/version, expired freshness window or failed acceptance. Reuse verified evidence and reopen only the affected requirement. This rule prevents new chats from consuming time by re-auditing what is already proven.


## Final completeness audit

Before `DONE`:
- reread original ask;
- check every REQ ID;
- check output actually exists;
- check source of truth updated or marked blocked;
- check no owner-approved item silently changed;
- check no required downstream artifact is missing.

## WIP / task stack

Default: one MAIN and no more than two short independent SIDE. A new idea is parked unless it truly supersedes MAIN by owner decision or critical evidence. Each SIDE carries `RETURN TO` and the session explicitly resumes MAIN afterward.

## Depth / production mode

Choose the lightest mode that can reliably meet acceptance:
- FAST — reversible low-risk answer/action;
- DEEP — research, multi-expert decision or meaningful uncertainty;
- PRODUCTION — actual deliverable/change with full acceptance/QA.

Escalate depth when failure/rework cost is higher than the extra AI cost.

## One review → one consolidated revision

For a substantial artifact, collect a complete defect list across applicable experts before repair. Prefer one consolidated repair pass and targeted re-QA over dozens of owner-driven micro-edits.

## Proof gate before expensive execution

Before expensive production/implementation confirm the smallest evidence needed for the chosen direction: problem, customer/result, economic plausibility, key constraints and representative prototype where applicable.

## Session close

Before ending a meaningful work session preserve:
`CURRENT STAGE / what changed / evidence / unresolved REQ IDs / blockers / owner gate / NEXT ACTION / RETURN TO / required write-back`.

Do this even when the deliverable itself is not complete, so another chat can resume without reconstructing the strategy.


## Intent lock and preservation contract

Classify the owner's requested change **before research, redesign or handoff**, not only at implementation time. The user's verb and explicit boundaries control scope.

- `PATCH / ADD / FIX / STRENGTHEN` preserves the existing architecture by default.
- `INTEGRATION / SYNC` preserves approved artifacts and connects them.
- `DEVELOPMENT` explores genuinely new work.
- `REBUILD / REPLACE` is a separate mode requiring explicit owner intent or a separate owner approval after evidence of architectural failure.

Never silently promote PATCH or INTEGRATION to REBUILD. A potentially better architecture is a proposal/SIDE until approved.

For substantial existing-asset changes maintain:
`PRESERVE | CHANGE | DO NOT TOUCH | ADD | ACCEPTANCE`.

At final QA run an `INTENT DIFF`: compare result against the original request, preservation list and forbidden changes. Any silent scope expansion is a release-blocking defect.

## Change mode: PATCH / INTEGRATION / DEVELOPMENT / REBUILD

Before work and again before technical/production handoff classify work:
- `PATCH` — exact files/defect/change are known; preserve architecture and do not rediscover the project;
- `INTEGRATION` — approved artifact/result already exists; integrate it without recreating business/editorial decisions;
- `DEVELOPMENT` — new/unknown architecture genuinely requires exploration;
- `REBUILD` — deliberate replacement/redesign of architecture; requires explicit owner intent or owner approval.

Core rule: **do not think from zero where an earlier stage already made an owner-approved decision**. Preserve approved outputs and spend context only on the remaining uncertainty.
## Executor continuity state

For Codex/Work/external executors, after every substantive report infer only from evidence:
`RUNNING / WAITING_OWNER / STOPPED_INCOMPLETE / COMPLETED_UNVERIFIED / VERIFIED`.

If acceptance is open and the run has ended, state is STOPPED_INCOMPLETE and the next continuation action belongs to Business OS, not to Светлана. Never advise «ждать» without evidence of RUNNING.

## Owner question clarity

A genuine owner gate must be understandable without specialist vocabulary. State the concrete choice, why it matters, options with pros/cons, one recommended option and downstream consequence. If the owner would need to ask «а что именно я выбираю?», the gate is malformed and must be rewritten before sending.


## Task compiler checkpoint before handoff

Before any Work/Codex/subagent handoff, convert current state into a self-contained execution packet. Preserve exact accepted baseline, current stage and unresolved parent acceptance. For iterative work use the smallest stage whose output can be independently accepted; do not bundle a not-yet-frozen output with downstream work that depends on it. Run SPEC LINT before launch and EXPECTED DELTA vs ACTUAL DELTA after return. See [task-specification-delegation.md](task-specification-delegation.md).


## Parent-run recovery v2.0.9

For a substantial multi-stage task maintain one parent `RUN-ID` and stable `STAGE-ID`s. The parent state must preserve the original owner instruction, immutable intent, final acceptance, full stage route, exact source snapshots, allowed changes/DO NOT TOUCH, open defects, retry, budget, NEXT ACTION, state version and last EVENT-ID as available.

A new chat/runtime restores from canonical run/task/decision/evidence state before asking the owner to repeat context.

## State-transition commit

A stage is not fully committed merely because an executor says done. Commit sequence:
`evidence → child work state → parent checkpoint/NEXT ACTION → journal event → readback`.

Partial write-back is `WRITE-BACK INCOMPLETE`, not VERIFIED. Dependent stages wait until reconciliation unless the missing write is proven non-blocking and preserved as pending evidence.

## Candidate / release distinction

For the Skill and other high-impact releases: `candidate built ≠ package validated ≠ installed ≠ runtime verified`. Static file presence or self-declared version is never evidence that live orchestration behavior works.

## Context engineering / high-signal memory

Контекст — ограниченный рабочий ресурс. Для длинных agentic задач предпочитай `just-in-time retrieval + structured state + compaction`, а не загрузку всей истории/Drive.

Правила:
- перед новым этапом подавай минимально достаточный source slice + decisions + open REQ + acceptance;
- длинные исследования складывай в evidence/artifacts, а в активном контексте оставляй выводы и ссылки;
- при переполнении делай compaction, сохраняя решения, доказательства, unresolved requirements, IDs и file paths;
- независимые ветки можно отдавать subagents, но main agent владеет merge и canonical state;
- никогда не выкидывай acceptance/owner decision ради экономии контекста.
