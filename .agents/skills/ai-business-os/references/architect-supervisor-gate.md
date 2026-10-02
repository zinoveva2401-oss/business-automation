# Runtime Architect / Execution Supervisor Gate

Status: internal conditional entry contract for the shared Business OS. This is a routing layer over existing modules, not a new agent framework, project, memory store, database or daemon.

## Before meaningful execution

Resolve only the information that can change the route:

1. **Outcome and timing:** restate the requested observable result; decide GO / WAIT / STOP from MAIN, dependencies, urgency, revenue/opportunity cost and owner hours. Preserve the owner's goal while challenging a weak method.
2. **Source and freshness:** identify the canonical source for this task; inspect the minimum relevant current state; require web/connector verification only for mutable, disputed or explicitly current facts. Record unavailable sources as `UNKNOWN` and use only an exact provenance-labelled snapshot when allowed.
3. **Capability route:** select the minimum sufficient model, Skill, plugin, MCP, browser, script or reviewer. Verify actual callable access when the acceptance needs it. Explicitly allow `NO ADDITIONAL TOOL REQUIRED`. Do not install for curiosity; require owner approval for paid, credentialed, risky, unclear-license or irreversible additions.
4. **Execution boundary:** lock target repository, path, branch/worktree, input files, data classification, secret/access limits, allowed writes and exclusions. Inspect existing dirty state before any mutation. No silent cross-project or client/DOKRUTI context mixing.
5. **Economics and acceptance:** set a proportional token/cost/time budget, expected observable result, evidence method, regression needs, write-back target and stop condition. A meaningful owner choice, missing unique fact or frozen business decision remains an owner gate.

Load only the task-specific source and applicable domain checklists. Common routes:

- System/runtime/code → `task-specification-delegation.md`, `production-dispatcher-runtime.md`, `work-production-controller.md`, then technical/security and completion gates as applicable.
- Product → `product-factory.md`, then only relevant research, finance, legal/IP, editorial, UX, visual, technical and QA modules. `P10.75` prototype approval blocks full production.
- Site/design, content/media, growth/sales, analytics or automation → the corresponding domain module and its current-source route; do not preload every checklist.

## During execution

- Compare each material event with the expected stage/output. A repeated event with no new evidence or observable progress is non-progress.
- Permit at most two materially identical failed repair attempts. Then change model/tool/method/scope or stop as `CAPABILITY_GAP`; never repeat the same patch loop a third time.
- Recheck sources when age or external changes can invalidate a decision. Keep discovered defects within the parent acceptance; do not silently shrink scope or add unrelated work.
- Escalate owner decisions only at the defined boundary. Keep spend, external writes, publication, access changes and irreversible operations behind their applicable explicit approval.

## After execution

1. Inspect the actual final artifact/result at its final location; compare its identity/hash or live readback with the object under review where applicable.
2. Invoke only applicable domain specialist QA, then Review Chair; apply one consolidated repair and one fresh re-review, then regression.
3. Enforce `DONE != VERIFIED`. Missing artifact, evidence, independent review or required source access stays `UNKNOWN`/blocked; executor claims are not evidence.
4. Write back only confirmed state to the canonical source, then read it back. If access is unavailable, mark `PENDING WRITE-BACK` without claiming an update.

## Routing result

Record a compact internal decision: `OUTCOME / GO-WAIT-STOP / MAIN LINK / SOURCE+AS-OF / MODEL+TOOLS (or NONE) / SCOPE+BOUNDARY / COST BUDGET / ACCEPTANCE+EVIDENCE / DOMAIN CHECKLISTS / OWNER GATE / STOP CONDITION / WRITE-BACK`. This is a per-task execution packet, not persistent duplicate business state.
