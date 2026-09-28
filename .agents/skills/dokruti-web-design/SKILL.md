---
name: dokruti-web-design
description: Route substantial DOKRUTI web design work through current sources, a resolved visual target, official visual-production tools, and evidence-based browser QA. Do not use for routine copy or minor implementation fixes.
---

# DOKRUTI web production

This is the DOKRUTI-specific web/design execution contract. It does not replace Product Design, Build Web Apps, ImageGen, Browser, Playwright, or optional Figma capabilities; it routes them around the current DOKRUTI source and review rules.

## Source order and source access

Resolve sources in this order:

1. latest explicit owner decision;
2. live `Бизнес-система` / Drive and Sheets sources;
3. current Brand System and `12_САЙТ_МАТРИЦА`;
4. current task Visual SOT and approved reference artifacts, when they are explicitly current;
5. repository implementation.

Before substantial work record a source access map: `LOCAL REPO`, `GITHUB`, `LIVE DRIVE/SHEETS`, `BROWSER/WEB`, and `OWNER/BUSINESS OS SNAPSHOT` as `YES/NO`, with date and limitation. Private source IDs, URLs, contents, prices, queues, or credentials do not enter the repository.

The historical `docs/design/site-brand-001/approved/` B+A package is not automatically current authority. Use it only when the current task explicitly promotes an exact artifact as immutable reference or asks for BEFORE comparison.

## Mandatory production route

Use this route for a new page, substantial redesign, hero, visual system, or material page rebuild:

`OWNER INTENT → LIVE SITE MATRIX → PAGE INVENTORY → CONTENT/SOURCE RESOLUTION → CURRENT REFERENCES → VISUAL TARGET → ASSET PLAN → IMPLEMENTATION → REAL BROWSER → FULL-PAGE QA → SPECIALIST REVIEW → CONSOLIDATED REPAIR → RERENDER → HANDOFF`

Do not write production Astro before the route has a page inventory, selected visual target, material transformation map, asset decision, and QA plan. A code diff, build, or producer screenshot list is not visual evidence by itself.

## Page Completeness Gate

For every substantial page, read the current Site Matrix and write `CURRENT → APPROVED TARGET → REQUIRED STRUCTURAL CHANGE → ACCEPTANCE EVIDENCE` before implementation. Do not satisfy a materially different reference by leaving legacy sections in place and changing only copy, CTA, padding, or color.

For a complete Home, inspect the whole page contract: header/navigation; compact hero; seven problem directions; factual evidence/how it works; articles/library; tools/product access; active services; founder/About/trust; active channel reasons; footer/next step; SEO/schema/navigation/conversion. The exact inventory for other routes comes from the current Site Matrix, not memory.

## Visual and asset decisions

Use Product Design for context, ideation, image-to-code, and design QA where appropriate; use Build Web Apps after the target is resolved; use ImageGen for a meaningful bespoke raster asset when reuse is generic, stale, or semantically weak. For every material visual asset record one decision: `REUSE`, `EDIT`, `GENERATE NEW`, or `NO IMAGE`, with semantic fit, brand specificity, source/provenance, rights, quality/crop, role, and fallback.

The current DOKRUTI visual contract is SYPartners for composition, NOBL only as a bounded semantic-identity principle, and 11point2 only for meaningful `START → ACTION → CHANGE → PAYOFF` motion. Prefer controlled asymmetry, editorial rhythm, real evidence, materiality, causal Trace, and a visual event first. Avoid generic AI UI, dashboard/card walls, giant dead-space hero, social-poster grammar, decorative Trace, fake proof, random gradients, and CSS art replacing meaningful imagery. Mobile is recomposed, not merely scaled.

## Invariants

Preserve canonical Astro routes, real texts/articles, seven pain directions, three frozen services, contacts, SEO/meta/schema/internal links, event hooks, staging noindex, commercial/legal guards, and the current Business System truth. Visual restructuring must not invent products, prices, cases, metrics, partners, or claims.

## Full-page QA

Capture exact current/reference/after artifacts at requested desktop and mobile viewports. Inspect the full page and section evidence for composition, hierarchy, density, whitespace, typography, CTA hierarchy, specificity, asset meaning, article/product/service/founder/trust presence, mobile recomposition, reduced motion, accessibility/contrast, touch targets, images, overflow, console/network, metadata/schema, links/404, and build/check. Use real Browser/Playwright evidence; `build != visual PASS`.

## Article renderer and editorial composition

Shared article template does not mean identical article composition. The shared shell is limited to:

- header and unified cover hero;
- reading width and typography;
- navigation / TOC;
- author and related materials;
- shared contacts/footer;
- SEO and schema;
- responsive/mobile rules.

Before assembling a new article, read its approved content, map its actual meaning and section structure, create an explicit article presentation map in its content data, and only then compose the page from reusable editorial components. The map must account for every real H2 and state which sections remain prose, where a meaningful comparison/checklist/path/steps/example/callout belongs, and whether the existing final takeaway should be emphasized. A presentation map changes presentation only; it does not duplicate or replace the article's copy.

The common presentation shared by articles is limited to:

- Site header;
- article hero;
- reading width and typography;
- navigation / table of contents;
- author block;
- related materials;
- shared contacts and footer;
- SEO and schema;
- responsive and mobile behavior.

Each article's internal composition follows the meaning and actual structure of its approved text. Do not automatically format every H2 the same way. Do not render articles as plain text plus TOC or as a UI kit of identical cards. Keep prose readable and broken into meaningful authored sections; do not turn it into a dashboard or PDF-like page. Never apply the same component set to all articles.

Reusable editorial components are: PrincipleCallout, Comparison, Checklist, DiagnosticPath, Steps, ExampleCase, Contrast, Quote, KeyTakeaways, and ProductBridge. Use only components that the approved text supports; a section with no clear fit remains ordinary editorial prose. Components must present existing article content without adding facts, numbers, conclusions, CTAs, or imagery. For already approved copy, change presentation only; never rewrite, shorten, or extend the text.

By default, every article gets one unified editorial hero built from that article's own cover image. The cover fills the hero composition and the breadcrumb, topic, H1, and existing lead are integrated with it using a soft readability gradient; do not use the pattern "copy on the left + small separate cover on the right" or a separate white text card. A small side image is allowed only when the owner explicitly approves that treatment for the specific article. Use the responsive image pipeline, `srcset`/`sizes`, reserved dimensions, and an intentionally recomposed mobile layout that keeps the title readable and avoids reducing the cover to a tiny crop.

Before handoff of each article, inspect its real desktop render and its 390px mobile render. Verify the TOC comes from that article's actual H2 headings; mobile TOC is collapsed and not sticky. Check single-column flow and no horizontal overflow at 390/375/360 when those widths are in scope.

### ARTICLE PUBLICATION GATE

Before publishing any new article, verify:

1. Approved content has a meaning-based presentation map.
2. The shared template does not make every article composition identical.
3. The hero contains only public-facing information.
4. Internal IDs, statuses, and editorial instructions do not enter rendered DOM or visible text.
5. Empty editorial components are not rendered.
6. The article ending contains no production delimiter such as “Где заканчивается статья”.
7. Related materials, CTA, and footer do not leave a large empty gap.
8. Desktop and 390px visual QA pass.
9. Browser console errors = 0.
10. Horizontal overflow = 0.

## Review and handoff

Run relevant read-only passes sequentially in this owner chat: Research/Current Intelligence when needed, Visual, Product/Growth, Media when relevant, Technical, then Review Chair. Record `artifact_truth`, `reference_fidelity`, exact artifact path/SHA, viewport, observed result, and PASS/FAIL/UNKNOWN. Technical PASS never overrides a material visual or product FAIL. A material result requires consolidated repair and rerender before owner-facing handoff.
