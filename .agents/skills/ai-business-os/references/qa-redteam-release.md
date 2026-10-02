# QA / Red Team / Release Gate

## Principle
Self-score is not evidence. `10/10` language is allowed only as shorthand after objective gates pass; it never overrides a FAIL.

## Universal checks
1. Requirements coverage.
2. Factual/evidence quality.
3. Source-of-truth compliance.
4. User/reader/client outcome.
5. Human clarity.
6. Commercial logic.
7. Financial logic.
8. Brand/positioning.
9. Legal/tax/IP.
10. Technical/functional.
11. Accessibility/usability where applicable.
12. Owner manual-work burden.
13. Future maintainability.
14. Acceptance completeness: no promised stage silently deferred.
15. Version/file consistency and final customer path where applicable.
16. Format-native professional presentation and actual-render QA for meaningful owner/customer/public outputs.

## Product checks
- demand/problem;
- competitor gap;
- professional basis;
- result and format;
- narrative/read-through + full continuity + AI-smell;
- publication design / sustained reading comfort if long-form;
- art/UX + independent visual critic if substantial visual work;
- artifact architecture / duplication / one-primary-tool clarity;
- tools/templates clarity + buyer comprehension;
- price/economics;
- delivery/support;
- commercial package;
- legal/IP;
- actual final files.

## Content checks
- marketing matrix;
- correct writing mode (long-form / post / landing-product / instruction / presentation / UI);
- reader payoff;
- evidence;
- natural Russian / complete prose / transition logic;
- fragmentation and AI-smell lint;
- continuous read-through on final text;
- platform fit;
- visual/video fit;
- CTA/monetization;
- SEO/AEO if relevant;
- legal/affiliate disclosure;
- metric.

## Technical checks
- build/test;
- actual runtime/browser;
- responsive/performance;
- security/data;
- deploy state;
- no regression;
- rollback/recovery.

## Red Team questions
- Where can this fail in real use?
- What did we assume without evidence?
- What looks AI-generated/template-like?
- What forces Светлана to become editor/tester?
- What competitor/alternative makes this weak?
- Is the result worth its price/time?
- What legal/reputation risk was ignored?
- Is anything marked done without actual evidence?

## False technical-PASS blocker

For a mixed customer-facing artifact, technical success is only one lane. `build/test/deploy = PASS` cannot close visual, product, content or media acceptance. If the actual artifact still looks generic/template-like, fails buyer value, has weak story/pacing, or does not meet the promised experience, release remains `QA FAIL` even when all technical checks are green.

## Repair loop
`QA → consolidated defect list → one repair pass → repeat targeted QA`.
Avoid endless micro-edits.

## Artifact Truth / Completion Integrity Gate

The final producer report is never acceptance evidence. Before release, verify the actual artifact/output/runtime and create a claim ledger:

`REQ/CLAIM → expected observable delta → actual location/file/screen/behavior → evidence/measurement → PASS/FAIL/UNKNOWN`.

For material redesigns or approved visual systems require same-breakpoint `BEFORE → APPROVED REFERENCE → AFTER` evidence (or an equivalent inspectable diff) on every governing template/surface. For products compare the actual customer artifact against the frozen value/content blueprint; for media compare the final export/timeline against the approved paper edit/first-cut decisions.

Automatic FAIL conditions:
- producer says `done/implemented/premium` but actual artifact does not show the promised change;
- a system-level transformation is represented only by micro copy/CSS/CTA edits;
- governing pages/components remain materially legacy while acceptance required structural replacement;
- evidence is only commit/build/file-count/self-authored QA text;
- the reviewer inspected an older/local candidate instead of the exact final artifact/URL/SHA.

A contradiction between report and artifact is `COMPLETION INTEGRITY FAIL`; do not hand the owner the result as a candidate.

## Requirement traceability / independent release architect

For a substantial release, an independent release-verification pass maps `REQ/acceptance → actual location/file/behavior → evidence → PASS/FAIL/UNKNOWN`. A requirement is not satisfied merely because a producer claims it was handled. Missing location/evidence = UNKNOWN/FAIL and blocks release when material.

## Brand source / artifact lint

For branded public/client artifacts, verify the current Brand/Product-Design source and scan the **actual final artifact/render** for legacy labels, stale palette/tokens, wrong brand name/positioning and accidental old-template carryover. A hex/token swap alone does not prove a new or compliant visual system.


## Release states
- `DRAFT`
- `PROTOTYPE APPROVED`
- `PRODUCTION`
- `QA FAIL`
- `RELEASE CANDIDATE — INDEPENDENTLY VERIFIED`
- `WAITING OWNER DECISION` — only when a genuine strategic/subjective owner gate remains
- `READY FOR LAUNCH`
- `MARKET VALIDATED`

Strategically subjective elements that remain genuine owner choices require owner decision; owner should not be used to find obvious defects or approve routine editorial/visual/technical QA. When no true owner gate remains, independent verification may move the artifact to the next operational stage automatically.
## Work Completion Gate

For substantial Work research/product tasks, self-report is not sufficient. The original acceptance must be independently checked after production. The verifier receives the original task and evidence, marks each requirement `PASS / FAIL / UNKNOWN`, and actively searches for premature completion.

Research-specific blockers:
- wrong competitor class;
- discovery replaced by confirmation bias;
- broad category presented as SKU evidence;
- missing customer voice hidden by confident scoring;
- critical research deferred to a future plan while status says complete.

Product-specific blockers:
- promised client file absent;
- RC/version mismatch;
- source/master exists but client deliverable does not;
- final format not actually opened/rendered/tested;
- no clean customer route;
- QA performed on older candidate rather than final candidate;
- Critical/Major defects remain.

Any FAIL/UNKNOWN returns to `consolidated repair → regression → independent recheck`.

## Owner-facing completion

Do not hand the owner the defect register as work to finish. Final message begins with `что готово / чем проверено / что требуется от Светланы`. If owner input is genuinely needed, formulate it in plain Russian with options, pros/cons and recommendation.

## Editorial / publication blockers

Major defects include sustained fragmented prose, mechanical heading/template repetition, obvious AI-generated cadence, duplicate teaching, unreadable typography, card-everywhere layout, mobile reading failure, or an HTML/PDF/DOCX route that does not work in the promised customer environment.

## Product-experience blockers

Major defects include duplicate formats without distinct customer jobs, several competing primary workbooks/tools, unclear START HERE, unclear input/calculation/output logic, redundant sheets asking for the same data, or failure of a cold buyer to explain what they bought and what to do first.


## Universal output-design blockers

For any meaningful owner/customer/public artifact, Major defects include material mismatch between function and layout, unreadable hierarchy at target size, card-everywhere/template drift, raw/default formatting that obscures use, document text pasted into slides, spreadsheet logic exposed without usable interface, mobile/print/export failure where promised, or an artifact that was never rendered/opened in its target environment.

A simple artifact may pass with simple formatting; professionalism is measured by fitness for use, not decoration or production effort.


## Media blockers

For substantial video/motion/audio, Major defects include weak or incoherent pacing, unintelligible/uneven speech audio, captions that are wrong/out of sync/unreadable, unsafe mobile crops, generated visual artifacts, platform variants not actually reviewed, unlicensed material, or final exports that differ materially from the approved timeline/preview.
