# Website / Owned Digital Asset / Conversion & Performance

## Role of site

The website is an owned business asset: knowledge base, discovery/search surface, product/service library, trust layer and commercial route. Current site architecture/state comes from its live source of truth, not this module.

## Applicable expert checks

For meaningful site work activate the smallest necessary set of:
`Brand / UX / Content / SEO-AEO / CRO / Analytics / Accessibility / Performance / Tech / Security / Legal-data`.

Check as applicable:
- information architecture and topic/product connections;
- mobile/responsive behavior;
- page speed/image/media weight;
- crawlability, titles/meta/canonicals/schema/internal links;
- search/discovery intent;
- CTA and conversion path;
- forms, consent/data handling;
- analytics/event IDs;
- payment/delivery state if commercial;
- accessibility;
- 404/redirects/backups/deploy/rollback.

## Change discipline

Do not redesign the whole site to solve one small problem without evidence. Conversely, do not use “minimal change” as excuse for low-quality work when the approved task is a full redesign.

Code/repo work routes through Codex or an equivalent technical executor with build/runtime/browser QA and current branch/environment checks.

## Visual/page task specification discipline

Website design work must follow the Task Specification & Delegation Compiler.

When an owner-approved homepage/page/visual exists, it becomes a `FROZEN BASELINE` until explicitly reopened. A request to change one block must not be bundled with designing another page or reinterpreting the whole homepage.

For iterative site design:
- resolve the exact canonical topics/cards/copy from current site SoT before handoff;
- use `ATOMIC PATCH` for one accepted-page delta;
- after that delta passes, use one `STAGE PRODUCTION` packet for each materially different page/template (`articles library`, `article`, `topic`, `tool/product`, `about`, etc.) until the shared visual system is proven;
- each page packet specifies desktop/mobile output, preserved global shell, allowed local variation and stop condition;
- rejected mockups are not sources of truth merely because they are newer;
- an executor changing frozen hero/palette/layout while asked to modify one block fails the output diff automatically.

Do not ask Светлана to notice unauthorized drift. Business OS must compare the returned screen against the frozen baseline first.

## Reference-fidelity / browser screenshot loop

For an owner-approved reference, mockup or accepted live page, technical build/test PASS is not enough. Before Codex implementation, freeze the reference evidence and what is transferable vs forbidden-to-copy. The site packet must include the exact representative content and required target breakpoints.

Mandatory loop for material visual/site work:
`reference/baseline evidence → implementation → real browser render → screenshot at required desktop/mobile breakpoints → side-by-side/visual-diff review → consolidated defect list → repair → repeat screenshots`.

The review checks at least: composition, hierarchy, scale, spacing/rhythm, typography, image crop/material logic, component semantics, responsive behavior, overflow, navigation/CTA and brand drift. A CSS/token/build PASS cannot override material screenshot mismatch.

If reference capture or browser screenshot evidence is unavailable, mark visual acceptance `UNKNOWN/STOPPED_INCOMPLETE`; do not ask Светлана to become the screenshot comparator. When exact pixel matching would copy protected expression or conflict with the approved DOKRUTI design system, reproduce the transferable principles and business effect instead of cloning the protected composition.

See [task-specification-delegation.md](task-specification-delegation.md).

## Design-thinking requirement for substantial visual work

For a new or materially redesigned visual direction, activate [Design Thinking / Visual System](design-thinking-visual-system.md) before expensive implementation. The brief must define the communication problem, anti-goals and real content; the design pass explores materially different visual routes, selects one governing idea, validates representative desktop/mobile screens, and receives an independent visual critique.

A palette swap, stock-image swap or rearrangement of the same card grid is not evidence of a new visual concept. For editorial/sequential content, repeated cards require explicit semantic justification.

Once a visual system is frozen, Codex implements it; Codex may solve local technical details but may not reinterpret the art direction without reopening the visual decision through the architect.

## Studio-grade / live-portfolio standard

Для материального DOKRUTI redesign активируй [Website Studio-Grade / Premium Portfolio Standard](site-studio-grade-standard.md) и [Live Portfolio Proof](live-portfolio-proof.md).

Это добавляет:
- motion architecture with function, not decoration;
- About/founder page built around visitor trust questions;
- completion/thank-you states after real conversion events;
- FAQ only from real objections/search intent;
- portfolio-grade test;
- explicit mobile/reduced-motion/performance balance.
