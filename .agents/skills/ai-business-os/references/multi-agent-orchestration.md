# Multi-Agent / Subagent Orchestration Contract

## Purpose

Parallelism must improve quality/speed, not multiply context and conflicts.

## 1. Default = single-session sequential review

Default for Svetlana's Codex work is **ONE visible chat/session**. Run specialist lenses as separated sequential passes inside that session when this can meet acceptance. This preserves budget and context.

Real spawned subagents/parallel threads are an exception, only when independence materially improves a high-risk result and the owner explicitly authorizes the extra task/quota after seeing the predicted cost. Never auto-create a new chat/fork/clean task.

If a restart is technically required: save checkpoint → return `RESTART REQUIRED` → STOP. Svetlana opens the next chat herself. Do not parallel-edit the same source/file without a merge plan.

## 2. Subtask contract

Before launching any production/modification branch, the main agent runs the [Task Specification & Delegation Compiler](task-specification-delegation.md).

Every delegated branch receives a self-contained execution packet:
`CURRENT STATE / TASK MODE / ONE RESULT / INPUT-SOT / FROZEN BASELINE / PRESERVE / CHANGE ONLY / DON'T TOUCH / EXACT DATA / DECISION RIGHTS / EVIDENCE / OUTPUT FORMAT / BUDGET / STOP CONDITION / RETURN TO`.

The branch does not redefine MAIN, owner-approved strategy or frozen upstream outputs. If output A is still subject to acceptance and becomes input for B, A and B are not delegated in one packet.

## 3. Shared requirement ledger

Main agent owns the canonical `REQ-ID` ledger. Subagents return evidence against assigned REQ IDs rather than inventing a new checklist.

## 4. Merge protocol

Main agent must:
1. verify outputs actually answer assigned questions;
2. identify contradictions;
3. resolve by source hierarchy/evidence/economics/risk;
4. preserve citations/provenance where required;
5. run integrated QA after merge.

Agreement between agents is not proof.

## 5. Concurrency safety

For shared external state/files:
- assign one writer or non-overlapping file scopes;
- reread before write;
- avoid simultaneous deployment/merge on same branch;
- never force-push/overwrite merely to resolve agent divergence;
- preserve rollback point for high-risk changes.

## 6. Cost control

Before any physical subagent launch calculate `count of threads/chats × expected turns × reasoning level + owner/recovery cost`. Default concurrency budget is zero extra spawned threads unless Svetlana explicitly approves. Do not spawn agents for routine work; do not convert a role label such as `visual critic` into a new paid/limited session automatically.

## 7. Sequential-role protocol

For production-quality tasks, sequential role passes must use the applicable domain contract (visual/site, product/value, media, content/growth, technical) and judge the actual artifact. Role switching is not permission to reuse the producer self-score.

A sequential review is valid when the current session deliberately switches from PRODUCER to a read-only CRITIC pass using immutable owner intent/acceptance and actual artifact evidence, records defects before reading its own prior self-rating, then performs one consolidated repair. It is less independent than a separate model and must not be described as external independence, but it is the budget-default. Physical independent review is reserved for high-risk release or a demonstrated capability gap.
## 8. Independent verifier role

For substantial release/research completion, assign a verifier that did not own the production judgment. It receives original acceptance and actual evidence, not the producer's self-score, and must return `PASS / FAIL / UNKNOWN` per requirement. Its job is to find what is still incomplete. Agreement with the producer is not the goal.


## 9. Specification failure handling

If two executors or two retries misread the same task, treat the specification/decomposition as suspect before blaming execution quality. Recompile state, exact references, scope and stop condition; reduce granularity; then rerun only the failed stage.

## 10. Quality-contract specialists

When applicable, production and verification roles are separated:
- writer/author ≠ final human-language verifier;
- art director/producer ≠ sole visual critic;
- workbook builder ≠ sole buyer-comprehension verifier.

The main agent injects the applicable quality contract into each child execution packet, including Universal Output Design / Format-Native Presentation whenever a meaningful owner/customer/public artifact is produced. A child may narrow scope, but may not replace a detailed quality contract with a generic `make it premium / make it human` instruction.


## 11. Parent-run inheritance and transport

A child executor inherits the parent RUN/STAGE identity and cannot redefine the parent acceptance or mark the parent VERIFIED. Results return as evidence/checkpoint to the dispatcher.

Prefer direct/shared canonical state transport. If cross-runtime automatic transport is unavailable, state that limitation and use a bounded handoff artifact; do not simulate autonomous agents.

## 12. Event/side-effect safety

Parallel branches that can write the same external state require non-overlapping writer scopes or a lock/merge rule. Replayed events must be idempotent. Duplicate writes, recursive triggers and infinite retries are release-blocking defects for automation workflows.

## 13. Evals and layered guardrails

Сильный multi-agent runtime проверяется не количеством ролей, а evals. Для устойчивых классов задач поддерживай representative tests и failure fixtures. Guardrails слоятся: deterministic rules for known failures + LLM specialist review for semantic quality + external/human owner gate only for real high-risk decisions.

Не запускай 10 агентов, если один сильный агент + 2 независимых критика дают тот же результат дешевле и чище.

## Owner-question centralization

Subagents do not independently invent or interrogate the owner. If a branch discovers a missing materially relevant owner fact, it returns `OWNER_CONTEXT_GAP: <fact> / why it matters / source checked`. Main Business OS dedupes gaps, retrieves existing context and asks Светлана one consolidated minimal diagnostic set only if still necessary.
