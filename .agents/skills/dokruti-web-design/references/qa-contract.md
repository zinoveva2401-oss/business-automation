# DOKRUTI visual QA contract

## Required sequence

1. Capture current render and the selected current references at the same viewport.
2. Record `CURRENT → TARGET → ACTUAL AFTER` for each material section.
3. Run Product Design design QA or equivalent visual critique and real Browser/Playwright render checks.
4. Review hierarchy, composition, density, whitespace, typography, visual event, brand specificity, pain navigation, Trace meaning, mobile recomposition, accessibility feasibility, and performance feasibility.
5. Run a separate final visual review of the actual rendered artifact, not the producer report.

## Evidence requirements

Evidence must identify the exact URL/file and final SHA, viewport, reference source, observed result, and PASS/FAIL/UNKNOWN. A build, changed-file list, self-authored screenshot list, or producer PASS is navigation evidence only.

## Automatic visual failures

Fail when the result is generic AI, generic consultancy, card-wall/dashboard grammar, a giant headline with dead void, newspaper imitation, social poster inside a web page, decorative Trace, fake evidence, or CSS-art replacement for meaningful imagery. Technical PASS cannot override a material visual failure.

## Acceptance

Accept only when the composition stands without explanatory text, is recognisably DOKRUTI, preserves exact copy and route/business invariants, has a deliberate mobile composition, and the browser artifact matches the selected target with no Critical/Major mismatch.
