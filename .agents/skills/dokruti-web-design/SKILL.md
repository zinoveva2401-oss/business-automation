---
name: dokruti-web-design
description: Route substantial DOKRUTI web design work through current sources, a resolved visual target, official visual-production tools, and evidence-based browser QA. Do not use for routine copy or minor implementation fixes.
---

# DOKRUTI web design

This is the DOKRUTI-specific orchestration layer. It does not replace Product Design, Build Web Apps, ImageGen, Browser, Playwright, or optional Figma capabilities.

## Source order

For substantial design work, resolve sources in this order:

1. latest explicit owner decision;
2. live Business System / Drive and Sheets sources;
3. current Brand and Site Matrix;
4. current task Visual SOT;
5. repository implementation.

The old `docs/design/site-brand-001/approved/` B+A package and its `IMPLEMENTATION_MAP.md` are rejected historical baselines. They may be used for BEFORE comparison only and must never be treated as current approved authority.

## Visual-first routing

Do not write production Astro for a new page, redesign, hero, or substantial visual section until the route has a design brief, inspected references, a selected visual target, and a QA plan.

- Use Product Design for context, ideation, image-to-code, design QA, and existing-flow audit where appropriate.
- Use Build Web Apps / `frontend-app-builder` for polished frontend implementation after the visual target is resolved.
- Use ImageGen for meaningful image-based visual direction or bespoke raster assets; do not replace visual events with CSS art, gradients, emoji, or placeholder geometry.
- Use Browser and Playwright for real render evidence at the requested breakpoints.
- Use Figma only when the available account/tool surface supports the needed operation; writable Figma is never a required dependency.
- Keep review sequential and evidence-based in the same owner chat by default. Independent reviewer contexts are optional only where materially useful and authorized.

## Model neutrality

The quality bar, source hierarchy, visual contract, and QA criteria are independent of the selected Codex model. Never encode model names in design logic or explain a design decision as a consequence of a particular model.

## DOKRUTI contract

Use the current visual SOT in `references/visual-sot.md` and the operational rules in `references/design-contract.md`. Preserve canonical Astro routes, real content, seven directions, three frozen services, contacts, SEO/schema/internal links, event hooks, staging noindex, and commercial/legal guards.

Before owner-facing acceptance, use `references/qa-contract.md` and require reference-to-render evidence, desktop/mobile recomposition, accessibility feasibility, console/network checks, and an independent final visual review. Build or technical PASS never overrides a visual FAIL.
