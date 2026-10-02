# Tool Router | Chat / Work / Codex / Connectors

## Objective
Choose the route that minimizes TOTAL cost, not just model tokens.

TOTAL COST = AI quota + elapsed time + owner manual hours + rework probability + external spend + operational burden.

## Environment check
Before routing verify actual capabilities in the current environment. Product features change; do not hardcode a tool as eternally mandatory.

## Observed executor reliability
Capability is not enough. Route by **observed quality on this task class** when evidence exists. Maintain or derive a lightweight executor history from the canonical runtime state/journal: `task class / executor+surface / SPEC quality / first-pass result / Critical-Major defects / repair count / owner manual minutes-hours / quota-cost / runtime failure signature / final VERIFIED? / date`.

Use it as a routing prior, not a permanent reputation score:
- a simpler ChatGPT route may outrank Work/Codex when it has repeatedly produced stronger verified results at lower total cost;
- repeated Major defects or owner rescue demote that executor for the affected task class until a later controlled test proves recovery;
- one bad run is evidence, not an eternal ban; separate tool failure from bad task specification;
- after the second materially similar executor misunderstanding, first suspect/rebuild the execution packet or decomposition before another blind retry;
- never force Work/Codex merely because the task category normally fits them.

When a canonical store exists, write only compact performance evidence there; do not create a new dashboard/table solely for executor scoring.

## Ordinary ChatGPT
Prefer when:
- strategy/decision/synthesis;
- moderate research;
- writing/editing;
- small file artifact;
- owner discussion/gates;
- task can be completed with current connectors.

## Work
Prefer when it materially helps:
- deep multi-source research;
- many files/apps/web steps;
- long production workflow with handoff;
- independent subtasks can run while preserving one goal;
- browser actions/downloads/collection at scale.

Do not use Work just because prompt is long. Give Work a production contract and acceptance tests.

## Codex
Prefer when:
- code/repo/site;
- systematic file transformations;
- tests/build/deploy integration;
- scripts/parsers/automation;
- repeatable technical production.

Codex task contract is compiled, not improvised:
`TASK MODE / CURRENT STATE / ONE RESULT / SOURCE OF TRUTH / FROZEN BASELINE / PRESERVE / CHANGE ONLY / DON'T TOUCH / EXACT DATA / DECISION RIGHTS / TEST / PUSH-DEPLOY PERMISSION / STOP CONDITION / REPORT`.

For complex task provide requirement ledger or acceptance checklist. Require actual build/tests and browser/visual QA when applicable.


## Creative / media route

Do not route all video to Codex and do not assume “desktop” or “browser” is always best. Use current environment capability preflight.

Typical routing logic:
- strategy, angle, hooks, script, critique and lightweight asset planning → ChatGPT when it has the needed context/tools;
- multi-step work requiring many sources/web/apps or direct local-file/app access → Work when the current surface actually provides it;
- repeatable programmatic composition, Remotion/HTML-motion code, batch transformations, reproducible rendering and repo-based pipelines → Codex/technical route;
- direct timeline/audio/video/image manipulation → specialized media/design plugin/app when its quality and file-access path are better;
- AI generation → only for specific missing shots/assets and with rights/identity/brand review.

For every substantial media job choose the route after checking `source location/privacy / editing need / generation need / re-editability / quality / Russian support / local device load / cost-quota / export portability / verified recent performance`.

A tool can be combined with another: creative direction in ChatGPT, local production in Work/media app, reproducible motion layer in Codex, independent QA back in Business OS. Svetlana should not manually shuttle technical context; Business OS compiles the handoff.

## Subagents / extra sessions
Default = no spawned subagents for Svetlana's Codex production. Run specialist checks sequentially in the same visible session unless a physical independent reviewer has a proven quality advantage that justifies quota/cost; launching any extra Codex chat/fork/thread requires explicit owner authorization. Role names are not permission to spawn.

## Capability architect
When a recurrent task is hard:
1. check built-in tool;
2. check installed plugin/connector/skill;
3. check whether a small script solves it;
4. only then consider adding new integration.

## Skill creator
When modifying this Skill:
- preserve stable source hierarchy;
- keep core concise;
- add detail as modular references;
- run regression tests;
- do not duplicate dynamic project state inside Skill.

## Exact handoff rule

When another environment is materially better, do not tell Светлана only «лучше через Work/Codex». Business OS first runs the [Task Specification & Delegation Compiler](task-specification-delegation.md), then produces the shortest sufficient **self-contained** execution packet itself. The executor must not need to reconstruct “what we meant” from old chat history.

If the current environment can invoke the better tool directly, use it only when the standing transport policy permits that action. For Codex, current owner policy is manual submit: prepare one copy-ready task and STOP; do not send/start/continue it yourself. For other tools, if user action is genuinely required, give one exact action, not a chain of interpretation steps.

## Execute-now / user-action gate

Before promising an external action, verify actual access/capability. If the needed tool is available and the action is permitted, execute it rather than sending Светлана to do routine intermediary work.

Ask for user action only when it is genuinely required: authentication/approval, physical action, unavailable capability, irreversible owner decision or legally required personal step. Explain one exact action and what the system will do immediately after it.

## Cost-aware capability routing

Use the least expensive/smallest capable route for routine work. Escalate model/tool/reasoning level when complexity, money, legal exposure, public reputation, code risk or likely rework makes a weaker route more expensive overall. Do not hardcode a current model name as a permanent rule.

## Executor reliability is a hard routing input

Before choosing ChatGPT / Work / Codex / specialized app for a material task, inspect current task-class evidence when available:
`task class / executor+surface / date / result quality / owner rescue hours / rework loops / acceptance result / specific failure mode`.

Rules:
- capability alone never outranks verified poor history;
- recent repeated owner rescue or verifier FAIL applies a reliability penalty until a representative recovery test passes;
- Work is not a default for product/site/commercial architecture merely because it can browse/files/apps;
- ordinary ChatGPT may own reasoning/creative direction when it has stronger evidence, while Codex/specialized media tools perform reproducible implementation;
- for a new task class, run the smallest representative benchmark instead of a full expensive job when routing uncertainty is material;
- after verified success/failure, write compact evidence back to the existing runtime/task record; do not create a parallel executor-score project.

## Model/reasoning economics

See [Model Economics & Reasoning Router](model-economics-routing.md). Для сложных задач сначала докажи качество сильным маршрутом, затем удешевляй повторяемые стадии. Разделяй thinking и rendering: креатив/архитектура/критика могут требовать сильной модели, а нарезка, конвертация, сборка по frozen spec и deterministic QA — нет.

## Owner-context and workspace route

Перед персонализированным советом запусти Owner Context Diagnostic, если materially relevant facts о Светлане неизвестны. Retrieval before questions; questions before invention.

Если повторяющаяся задача требует от Светланы постоянно сводить таблицы/тексты/статусы, не продолжай оптимизировать только промпты. Проверь Owner Workspace Architecture: возможно, лучший route — derived dashboard/content cockpit/interactive map поверх canonical data.

## Capability expansion route

При подтверждённом capability gap запусти Capability Expansion Radar. Проверяй существующие Skills/Plugins/apps/connectors и только затем внешние модели/парсеры/сервисы. Установка/подключение должна иметь измеримую цель и rollback.
