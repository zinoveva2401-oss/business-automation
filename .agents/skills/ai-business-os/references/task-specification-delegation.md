# Task Specification & Delegation Compiler

## Purpose

Business OS owns not only the business decision, but also the quality of every task handed to Work, Codex, a subagent, another chat or an external executor.

A vague or context-dependent handoff is an architecture defect. The executor must not be forced to guess what the owner meant, which prior version is approved, what may change, or when to stop.

Core rule:

`OWNER INTENT → METHOD CHALLENGE → CURRENT STATE → PRE-DELEGATION GO/NO-GO → TASK MODE → SCOPE LOCK → EXECUTION PACKET → SPEC LINT → EXECUTE → OUTPUT DIFF → QA`.

Do not delegate before both `PRE-DELEGATION GO/NO-GO` and `SPEC LINT` pass. A technically possible route that wastes quota/time/owner-hours compared with an available route is a FAIL.

## 1. When the compiler is mandatory

Compile an execution packet before:
- every Work or Codex handoff;
- every real subagent branch that will create/modify an artifact;
- every task sent to another chat/environment;
- every multi-file or multi-stage production task;
- every iterative visual/product task where an earlier accepted result must be preserved;
- every repair after the executor previously misunderstood scope.

A simple factual lookup does not need a full packet.

## 2. Resolve state before writing the task

The architect first resolves, from the source hierarchy:

`CURRENT STAGE / latest owner decision / exact source of truth / accepted baseline / rejected candidates / unresolved acceptance / blocker / next allowed action`.

Never write a task with unresolved phrases such as:
- `возьми предыдущую версию`;
- `сделай как раньше`;
- `оставь наши карточки`;
- `доработай вот это`;
- `потом сделай остальные страницы`;

unless the exact referenced artifact/state is attached or uniquely identified in the packet.

If canonical data exists, retrieve it before handoff and put the exact values into the task. Do not ask the executor to rediscover or invent known business facts.

## 2.1. Architecture / taxonomy lock

Before analysis, matrix work, content/site structure or integration that depends on an already accepted classification, restore the current canonical taxonomy/architecture first. Do not silently rename, merge, split or reclassify accepted segments, product classes, site topics, content pillars or artifact roles because a newer executor prefers another scheme. A taxonomy change requires evidence and, when strategically material, an owner gate.

Before requesting any new project, root/folder, worktree, branch, repository or Skill copy, list the existing canonical objects and prove reuse is blocked by a concrete constraint. Also record the shared-Core SHA/ancestry/blob parity, how accepted Core changes reach active domain branches, and whether the owner must approve the new object. Missing evidence or a reusable object is `NO-GO`: return to the existing root. `SYSTEM`/`DEVELOPMENT`/`INTEGRATION`/`RELEASE` packets must pass `scripts/spec-lint-v2.mjs` with `architecture_review`; the lint failure blocks handoff.

## 2.2. Canonical artifact placement

Before creating a significant artifact, resolve its canonical product/task root and current master from live Drive/GitHub/Business-System links. `scratch`, sandbox, temporary export or executor-specific folder is not source of truth. By default one product has one canonical root used by all executors; do not create parallel Work/Codex/editor folders that fragment one product. A new root is allowed only after a proven structural gap or explicit migration/replacement decision.


## 3. Choose the correct task granularity

Before delegation classify the packet:

### ATOMIC PATCH
Use when an approved/frozen artifact exists and only a bounded change is allowed.

One packet = one controlled delta.

Example: `change only the pain-navigation block on the approved homepage; everything else frozen`.

### STAGE PRODUCTION
Use when one complete stage can be executed without an unresolved owner choice.

Example: `design one complete Articles Library page in desktop + mobile using the frozen site visual system`.

### FULL PIPELINE
Use only when the owner explicitly asked for an end-to-end result and the acceptance can remain stable across the whole chain, for example a new product production contract.

A full pipeline may contain internal stages, but the executor may not silently shrink the original acceptance to the latest defect it discovered.

### Hard dependency rule

If output A becomes the source of truth for B and A may still be rejected/changed, **do not delegate A and B in one packet**.

Examples:
- do not combine `fix approved homepage block` + `design article page` when the homepage change is still awaiting freeze;
- do not combine `choose visual direction` + `implement whole site` when direction is not frozen;
- do not combine `revalidate product architecture` + `package final files` when revalidation can change the product.

## 4. Decision rights

For every packet explicitly assign decision rights.

### OWNER decides only
- target audience/positioning changes;
- public promise or material price/economics changes;
- material legal/reputation risk;
- irreversible external action;
- subjective visual/commercial freeze when evidence cannot resolve multiple genuinely equivalent directions.

### BUSINESS OS / ARCHITECT decides
- executor and environment;
- exact current stage;
- exact source of truth;
- task sequence and granularity;
- canonical business facts already stored in sources;
- what is preserved / changed / forbidden;
- acceptance and evidence;
- whether an executor output complies with the packet.

### EXECUTOR decides
Only local professional implementation details inside the allowed scope.

The executor may not reinterpret owner strategy, invent missing canonical business content, expand scope, replace a frozen baseline, or combine future stages for convenience.

## 5. Mandatory Execution Packet

Every substantial delegated task must contain, explicitly or equivalently:

`TASK ID / EXECUTOR / TASK MODE / CURRENT STATE / ONE RESULT / INPUT SOT / FROZEN BASELINE / PRESERVE / CHANGE ONLY / DO NOT TOUCH / EXACT CONTENT OR DATA / ALLOWED DECISIONS / FORBIDDEN DECISIONS / DEPENDENCIES / APPLICABLE QUALITY CONTRACTS / ANTI-PATTERNS / REQUIRED OUTPUT / ACCEPTANCE / EVIDENCE / QA / WRITE-BACK / STOP CONDITION / RETURN TO`.

### Minimum meaning of fields

- `CURRENT STATE` — where the work actually is now, including rejected/accepted candidates.
- `ONE RESULT` — the concrete result of this packet, not the whole program unless FULL PIPELINE is justified.
- `INPUT SOT` — exact files/URLs/rows/commit/screenshots the executor must use.
- `FROZEN BASELINE` — exact approved artifact that cannot be redesigned in this packet.
- `PRESERVE` — elements that must remain identical in meaning/structure/visual direction.
- `CHANGE ONLY` — exact delta allowed.
- `DO NOT TOUCH` — explicit forbidden surfaces.
- `EXACT CONTENT OR DATA` — exact canonical names, counts, copy, IDs, topics, values or mappings already known.
- `ALLOWED DECISIONS` — implementation freedom the executor really has.
- `FORBIDDEN DECISIONS` — choices reserved for owner/architect or already frozen.
- `APPLICABLE QUALITY CONTRACTS` — exact editorial/publication/design/product-experience/technical standards the executor must satisfy.
- `ANTI-PATTERNS` — known failure modes to actively avoid for this output.
- `REQUIRED OUTPUT` — exact artifact(s), count, format and viewports/pages.
- `STOP CONDITION` — where the executor must stop and not continue into the next stage.
- `RETURN TO` — MAIN/stage to resume after this task.

## 6. PRE-DELEGATION GO/NO-GO + SPEC LINT — mandatory before sending

Before writing a long handoff, challenge the proposed method while preserving OWNER INTENT. PASS requires:

1. exact baseline/current state and ONE RESULT are unambiguous;
2. dependencies/task granularity are correct; unstable upstream output is not bundled with downstream implementation;
3. every named source is **actually accessible** to the target runtime, or its exact snapshot/content is embedded/attached;
4. target runtime/model/tool is currently compatible; stable packets do not hard-pin dynamic model names unless a benchmark and quota/cost check justify it;
5. predicted `visible chats / spawned threads / restarts / tool installs / owner actions` are explicit and inside `TASK BUDGET`;
6. 1/3/10-step and, for complex orchestration, 20-step premortem shows no cheaper/safer route with the same acceptance;
7. transport is truthful. For Svetlana→Codex default: **one visible Codex chat, manual owner submit**; Business OS must not auto-start/continue/fork/create Codex tasks unless Svetlana explicitly authorizes that exact action;
8. `PRESERVE / CHANGE ONLY / DO NOT TOUCH`, decision rights and rollback are non-contradictory;
9. output/acceptance/evidence/stop condition allow an independent reviewer to judge PASS/FAIL; vague words such as `premium` are translated into concrete quality contracts/reference evidence;
10. owner input is requested only for a material missing fact/decision, not for professional implementation details;
11. the executor is not asked to rediscover known business facts or a live Drive/Brand source it cannot access;
12. expected total cost = AI quota + elapsed time + owner manual time + rework risk + external spend is acceptable.

Any NO = **do not delegate yet**. Correct the route/spec first. One clarifying question is better than a two-hour wrong RUN; unnecessary questions are not.

## 7. Visual / website atomic protocol

When a visual direction or page is already accepted:

1. Identify the exact approved screenshot/Figma/file as `FROZEN BASELINE`.
2. If the owner says `change only X`, use `ATOMIC PATCH`.
3. Freeze hero, typography, palette, layout, other sections and mobile composition unless specifically included in `CHANGE ONLY`.
4. If a canonical site taxonomy/list exists, insert the exact list into the packet.
5. Request only the screens needed to judge this delta.
6. Do not ask for the next page in the same packet if this patch may alter the visual system.
7. Rejected candidates never become a new baseline merely because they are newer.
8. After output, run a baseline diff: any unauthorized change is automatic FAIL and the architect issues a correction packet without making Светлана rediscover the defect.

For a new page after visual freeze, use one `STAGE PRODUCTION` packet per materially different page/template until the visual system is proven. Structurally identical pages may then be batched.

## 8. Work / product protocol

For a product pipeline, Business OS preserves the original complete acceptance while delegating internal stages.

A newly discovered Excel/HTML/file defect does **not** redefine the product task as `fix these files only` if market/method/content/UX/delivery acceptance is still open.

Before a repair packet:
- list all unresolved acceptance areas;
- decide whether the repair is atomic or whether an earlier product stage must be reopened;
- state what remains frozen and what may be reconsidered;
- keep final customer path and independent verification in the parent acceptance.

## 9. Codex protocol

Codex receives implementation work only after business/visual/product decisions that must be frozen are actually frozen.

A Codex packet must identify:
- **local canonical repo + one working branch + HEAD/status**; no new branch/worktree/PR unless the task explicitly requires it;
- only sources the current Codex session can actually read, or exact snapshots supplied in the packet;
- files/routes allowed and forbidden to change;
- exact acceptance tests and visual/reference evidence when applicable;
- current model/runtime assumptions only if verified; otherwise inherit the active session rather than pinning names;
- TASK BUDGET including max visible chats/threads/restarts (default: one visible Codex chat, no auto-spawn);
- push/deploy permission and stop condition.

Business OS prepares/checks the Codex task but, by Svetlana's standing rule, does **not** send/start/continue/fork/create the Codex chat itself. Svetlana submits the final copy-ready packet. If restart is required, Codex must return `RESTART REQUIRED` and stop; it must not create the next chat itself.

`Make it better`, `use the brand`, or `redesign premium` are not sufficient specifications. `Use Brand/Drive` is also invalid if that runtime has no live access and no snapshot was supplied.

## 10. Output Diff + Artifact Truth — mandatory after executor returns

Before showing the result to Светлана, Business OS must ignore the producer's completion wording and inspect the actual target artifact/readback. The producer report is navigation, not evidence.

Before execution, every material requirement receives a trace row:

`REQ-ID → EXPECTED OBSERVABLE DELTA → TARGET LOCATION/SCREEN/FILE → VERIFY METHOD → REQUIRED EVIDENCE`.

For a frozen visual/product/media direction also preserve an immutable reference/blueprint and, where transformation is material, a `CURRENT → TARGET` map. If the executor cannot actually access the reference, SPEC LINT = FAIL.

After execution build the factual ledger:

`CLAIM/REQ-ID → ACTUAL ARTIFACT LOCATION → EVIDENCE/MEASUREMENT → PASS / FAIL / UNKNOWN`.

Then check `EXPECTED DELTA vs ACTUAL DELTA`.

Verify:
- requested output exists;
- every `CHANGE ONLY` item was addressed;
- every `PRESERVE` item remains;
- nothing in `DO NOT TOUCH` changed;
- no next-stage work was silently performed;
- exact data/content matches the packet;
- acceptance/evidence are real;
- the actual artifact materially changed where a material transformation was required;
- a frozen reference/blueprint is recognizable in the resulting structure/experience, not merely mentioned in the report;
- legacy structure/grammar did not survive unchanged where the TARGET explicitly required replacement.

A changed-file list, commit hash, build log, producer screenshot collage, self-authored QA report or claimed `PASS` is never sufficient evidence by itself. Small diffs may be valid for small tasks, but a system-level redesign/product/media transformation must be evidenced in the actual output.

If actual artifact inspection contradicts the executor report, classify this as `COMPLETION INTEGRITY FAIL`, not as a minor cosmetic defect. The current result is `STOPPED_INCOMPLETE`; repair only after diagnosing whether the cause is spec ambiguity, missing reference, capability gap or execution incompleteness.

Unauthorized scope change = FAIL even if the result is aesthetically or technically good.

## 11. Anti-loop rule for misunderstood tasks

If an executor misunderstands the same work twice:

1. stop adding more vague prose to the same task;
2. diagnose which compiler field was missing/contradictory;
3. rebuild the packet from current state;
4. reduce granularity if necessary;
5. explicitly freeze the accepted baseline and exact content;
6. rerun only the failed stage.

Repeated executor misunderstanding is treated as a **specification architecture defect** until proven otherwise.

## 12. Copy-ready compact packet

Use this compact form when a full template would be excessive:

```text
TASK:
MODE:
CURRENT STATE:
ONE RESULT:
SOURCE OF TRUTH / BASELINE:
PRESERVE:
CHANGE ONLY:
DO NOT TOUCH:
EXACT DATA/CONTENT:
EXECUTOR MAY DECIDE:
EXECUTOR MAY NOT DECIDE:
APPLICABLE QUALITY CONTRACTS:
ANTI-PATTERNS / QUALITY RISKS:
OUTPUT:
ACCEPTANCE / EVIDENCE:
STOP AFTER:
RETURN TO:
```

The architect fills it. Светлана should not have to translate business intent into technical instructions for the executor.

## 13. Recursive delegation inheritance

If an executor/subagent creates another subtask, the same compiler contract applies recursively.

Every child packet must inherit from its parent:
- parent `ONE RESULT` and REQ IDs;
- `FROZEN BASELINE`;
- all `PRESERVE` and `DO NOT TOUCH` constraints;
- canonical exact data;
- owner decisions and forbidden decisions;
- acceptance/evidence relevant to that branch;
- parent stop condition / merge point.

A child agent may narrow its scope, but may not weaken or delete parent constraints. It may not reopen a frozen decision merely because its own preferred implementation would be easier.

The delegating agent remains responsible for SPEC LINT of the child packet and for merging the child result back against the parent acceptance.

## 13A. Production-quality route before expensive execution

A technically capable executor is not automatically a designer, product strategist, editor or marketer. Before sending a substantial customer/public/product/media task to Codex/Work, the compiler must convert the applicable quality contract into an **execution route**, not only a final checklist.

- Website / visual system: current reference mechanics + real-content concept routes/wireframes first; do not start a full CSS/code rebuild until the governing visual idea and representative screen proof are strong enough. A system-level composition defect cannot be closed by padding/card tweaks.
- Paid product: buyer/problem/substitutes + method/value blueprint + free-AI substitution and price-worthiness test before producing the final artifact. A polished file cannot compensate for weak buyer value.
- Video/media: inspect real source → transcript/paper edit/story/pacing plan → first cut → media critique → second cut/export. A playable file is not proof of a good edit.
- Public content/marketing: current platform/search context where material → audience/pain/angle/hook/format → draft → reader/platform/brand critique → final adaptation. Generic expert copy is not acceptable merely because it is grammatically correct.
- SEO/AEO: current query/SERP intent and technical eligibility are evidence inputs; no ranking guarantee is an acceptance criterion.

The executor may choose among materially different routes without owner interruption when evidence clearly favors one. Owner gate is reserved for a genuine strategic/subjective choice.

A full-pipeline task may contain these stages internally; do not fragment them into multiple owner-managed chats. The purpose of the pre-production proof is to reduce rework and make the first full build materially stronger.

## 14. Quality Contract Injection

Before `SPEC LINT = PASS`, classify the output type and inject the detailed quality standard instead of leaving subjective adjectives for the executor to interpret.

- any customer/public/owner-facing copy → [Editorial / Human Language / Reader Experience](editorial-reader-experience.md) in the correct writing mode;
- any meaningful owner/customer/public artifact where presentation affects understanding/action/trust → [Universal Output Design / Format-Native Presentation](universal-output-design.md);
- HTML / PDF / DOCX substantial long-form → additionally [Publication Design / E-book](publication-design-ebook.md);
- website / new visual system / product art direction → additionally [Design Thinking / Visual System](design-thinking-visual-system.md);
- workbook / toolkit / client package → additionally [Product Experience / Artifact Architecture](product-experience-artifact-architecture.md);
- video / motion / substantial audio → additionally [Media Production Quality](media-production-quality.md);
- combine contracts when the output spans several types.

The same classification is mandatory when Business OS executes the artifact itself; direct execution does not bypass Quality Contract Injection.

`Сделай по-человечески`, `дорого`, `вау`, `премиально`, `удобно` are not acceptance criteria by themselves. The architect translates them into observable checks from these contracts.

If the executor lacks the final text, exact baseline, real content or other input required to judge the relevant quality, `SPEC LINT = FAIL`.


## 15. v2.0.9 orchestration fields

For a child stage belonging to a substantial parent run, the execution packet must also preserve when available:
`RUN-ID / STAGE-ID / parent acceptance / exact source snapshot identifiers-or-revisions / parent frozen constraints / expected state transition / write-back target / required evidence / event-or-dedupe identity for side effects`.

Capability preflight is part of SPEC LINT for external execution: actual access/permission/current account or runtime fit/limits/cost/evidence route must be known before delegation.

For side-effecting automation, packet acceptance must include replay/idempotency behavior and rollback/recovery where relevant.

`candidate built` may never be used as a synonym for `release` or `runtime verified`.

## Owner-context dependency / no invented personal facts

Execution packet не имеет права подставлять выдуманный owner context. Если результат зависит от неизвестного персонального факта о Светлане:
1. Business OS сначала восстанавливает актуальные sources;
2. если факт найден — передаёт его как confirmed input;
3. если не найден и materially changes result — ставит `OWNER INPUT REQUIRED` с одним конкретным вопросом;
4. executor не заполняет пробел «reasonable assumption» без явной маркировки/разрешения;
5. субагенты/Work/Codex сообщают gap главному Business OS, а не устраивают Светлане параллельные интервью.

Для необязательного/обратимого пробела допускается `LABELED ASSUMPTION` с проверяемым impact, если это не персонализированный совет высокого риска.
