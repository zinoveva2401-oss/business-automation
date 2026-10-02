# Product Factory — local autonomy overlay v1.1.0

Inherit the repository `AGENTS.md` and shared Business OS v2.0.11 RELEASE, as declared by the Core `MANIFEST.md`, `SKILL.md` and `QA_v2.0.11_CORE_NORMALIZATION.md`. The referenced Core Product Factory module still has a stale `candidate` label in its heading; the package QA record confirms the package was promoted to RELEASE. This versioned project overlay narrows the Product Factory handoff policy without changing the shared Core identity or its general architecture. The Core owns product strategy and methods; this overlay makes internal completion and owner handoff explicit for the local Product Factory.

## Preproduction definition of done

`OWNER_HANDOFF = BLOCKED` until every applicable gate below is closed with evidence:

1. Recovery audit of the current product and canonical sources.
2. Current buyer/problem evidence.
3. Current market, competitor and substitute research.
4. Free-AI replaceability check.
5. Commercial and value logic.
6. Evidence-based format decision.
7. Legal, IP and claims check.
8. Representative prototype made from real product content and rendered, opened or used in its intended medium.
9. Technical QA.
10. Visual and UX QA.
11. Independent Product, Market, Editorial, Commercial, Legal/IP, UX, Technical and Red-Team reviews of the actual prototype/package.
12. One consolidated repair of correctable review defects.
13. Fresh recheck of repaired criteria and a regression review after repair.

For every gate, record `APPLICABLE / NOT APPLICABLE`, status, source/evidence and date. A skipped gate is valid only as `NOT APPLICABLE` with a specific reason; blank, unknown or incomplete is not closed. If the product is not ready for a representative prototype, continue its missing upstream stages and do not create a premature owner gate.

## Self-heal and routing

For any incomplete or failed but correctable criterion:

`DETECT → ROUTE TO THE RESPONSIBLE SPECIALIST → REPAIR → RECHECK → CONTINUE`.

Route correctable gaps as follows:

| Gap | Responsible specialist |
|---|---|
| Market, competitor or substitute evidence is insufficient | Market Research |
| Buyer value or commercial logic is weak | Product/Commercial |
| Text or explanation is weak | Editorial |
| Visual hierarchy or usability is weak | Art/UX |
| Workbook, formula, code or technical behavior is defective | Technical |
| Rights, IP or claims need review | Legal/IP |

Do not ask Светлана whether normal research, review or repair should continue, which specialist/tool/model to use, or to inspect unfinished QA. If a recheck finds another correctable defect, route that defect and continue. If an actual external prerequisite or decision blocks progress, record the exact blocker and the smallest owner action needed.

## Architect pre-handoff block

Before any owner handoff, Architect/Supervisor must answer internally: `ARE ALL REQUIRED INTERNAL GATES CLOSED?`

- If **NO**: set `OWNER_HANDOFF = BLOCKED`, list each open gate and evidence gap, assign its specialist, and route the run back to that stage. A prototype by itself never authorizes owner handoff.
- If **YES**: prepare one owner decision package from the reviewed representative artifact, accepted evidence, remaining genuine decision, and its consequences. P10.75 owner approval, when required by the shared Core, can occur only after this internal definition of done; it remains before full production and does not substitute for internal QA.

## Owner decision policy

Ask Светлана only for a material choice between valid product directions, approval of a fully reviewed representative product/visual direction, permission/access/payment with owner consequences, or a business risk/claim that specialists cannot resolve internally. Do not route ordinary evidence gaps or correctable defects to her. A simple request such as `Дошей продукт до сильного продаваемого прототипа и покажи мне, когда сам всё проверишь` means Product Factory autonomously restores sources, completes the gates above, repairs and rechecks the artifact, and only then returns a decision package if a genuine decision remains.

If owner-controlled access, permission, payment or a unique owner-held fact is the exact external prerequisite for closing a required gate, make only a narrowly scoped `EXTERNAL_PREREQUISITE_REQUEST` stating what is needed and which stage it unblocks. This is not an owner acceptance/review handoff: do not present unfinished work for QA or approval, continue all independent stages, and resume the blocked gate when the prerequisite is supplied.

## Evidence budget and anti-loop

At task start, Architect records the question each research pass must resolve, minimum sufficient evidence, source diversity/freshness, time or query budget, diminishing-return stop condition, and reroute threshold. Synthesize when evidence is sufficient; stop repeated searches that add no distinct evidence. Allow at most two materially identical failed repair attempts; on a second repeat, change specialist/method/tool/scope or record `CAPABILITY_GAP` with an exact blocker. Autonomy does not authorize endless research or silent scope reduction.

## Local execution boundaries

- Resolve current product state and source files from the live Business System and canonical product Drive sources. Do not use historical repository copies as current truth.
- Preserve all existing product folders and unrelated files. Select the exact target product and inspect its current state before editing.
- For technical production, use `docs/PRODUCT_EXECUTION.md` and the product's current design source after the Business OS has chosen and approved the stage.
- Use the product format selected from the user need; this project does not impose an e-book, spreadsheet, PDF or software default.
- This project covers Product Factory work only. Do not create Site, Content or Automation projects here. Future client work must keep each client's state, brand, data, files and access isolated while reusing the shared Core; see the conditional Business OS client boundary module.
