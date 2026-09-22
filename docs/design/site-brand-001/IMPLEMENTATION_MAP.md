# SITE-BRAND-001 — Historical Stage 3B-R implementation map

> REJECTED / NEGATIVE BASELINE / HISTORICAL ONLY
>
> This map describes the superseded B+A direction. It is retained only for provenance and BEFORE comparison. Do not use it as an active implementation contract.

Status: rejected historical map; not an active implementation contract.
Before reference: live/current site at 2ac8e42ee467f6dd37cf4feef51102e4220ddd31.
Historical reference only: docs/design/site-brand-001/approved/README.md and the hashed B/A renders listed in SHA256SUMS.txt. These are not current approved references.

## Historical target description

Concept B, “Редакционный маршрут”, governs the page composition, navigation, editorial rhythm, density, whitespace, route discovery, and mobile recomposition. The selected Concept A mechanics are limited to materiality, evidence, and explicit cause → check → action traces. The implementation must preserve the existing factual content, routes, SEO contracts, event hooks, staging noindex, and commercial/legal truth.

## Route map

### Home /

- CURRENT: Hero copy with CTA, topics list, one CausalTrace block, article cards, dark tools band, founder/about block, and question CTA. The page reads as a sequence of generic sections with card/grid grammar.
- HISTORICAL TARGET: B folio route: editorial masthead, visible seven-direction problem map, one material lead story, ruled supporting reading list, an A evidence strip, tool dossier, service route rows, and a closing contact route.
- REQUIRED STRUCTURAL CHANGE: Replace the hero → cards → CTA sequence with a route-led composition. Make the pain map the primary navigation surface; promote the article/material surface; convert tools/services/about into editorial rows and evidence surfaces; keep the existing article/service/product links and analytics attributes.
- ACCEPTANCE EVIDENCE: 1440 and 390 render show folio + problem map + lead story + ruled rows + cause/check/action + tool/service/about/contact route sections. DOM contains all seven pain links, a real article link, real product/service links, and no legacy card wall as the dominant composition.

### Library /articles/

- CURRENT: Catalog hero, topic pills, four compact filter controls, featured ArticleCard, then a supporting ArticleCard grid.
- HISTORICAL TARGET: B reading desk: route folio, editorial library statement, seven-direction index, featured spread, and a ruled archive of articles with visible topic/date/type evidence.
- REQUIRED STRUCTURAL CHANGE: Remove card-grid dominance. Keep the search/filter form and filtering data contract, but render results as editorial rows with image, metadata, title, excerpt, topic, and a clear reading arrow; preserve pagination/category links.
- ACCEPTANCE EVIDENCE: 1440 and 390 show a feature spread and stacked ruled archive; every visible article retains data-article-card, topic/search metadata, a working slug link, and no horizontal overflow.

### Article /articles/[slug]/

- CURRENT: Article hero image/copy, trace mark, metadata, article reading grid, next-step block, and related article tiles.
- HISTORICAL TARGET: B single reading route: folio and route rail, material opening spread, explicit evidence/trace annotation, uninterrupted reading surface, and next-check navigation.
- REQUIRED STRUCTURAL CHANGE: Recompose the opening and related navigation around the reading route: make the route marker and evidence metadata structural, keep prose/heading hierarchy unchanged, and replace generic related tiles with ruled next-reading rows.
- ACCEPTANCE EVIDENCE: 1440 and 390 show the material opening, readable article column, trace/evidence labels, preserved H1/meta/schema/links, and related articles as route rows rather than a card wall.

### Tools /tools/

- CURRENT: Tools hero followed by one product card/band with mood image and “В подготовке” state.
- HISTORICAL TARGET: B tool route: dossier masthead, editorial product record, material cover/evidence image, explicit status and fit, and a preparation/next-check rail.
- REQUIRED STRUCTURAL CHANGE: Replace the generic product-card composition with a dossier-like split and ruled product record. Preserve HOLD state and all product truth; no invented purchase flow or metrics.
- ACCEPTANCE EVIDENCE: 1440 and 390 show a single editorial tool dossier, real product status, real image, frozen CTA behavior, and no SaaS dashboard/card-wall grammar.

### Services /services/

- CURRENT: Intro, service format rows, process list, and dark CTA; rows are visually close but not integrated into a route system.
- HISTORICAL TARGET: B service route: folio statement, three frozen services as annotated editorial rows, cause/check/action process, and a restrained contact route.
- REQUIRED STRUCTURAL CHANGE: Make service rows the governing content surface with route number, audience/problem, deliverable/evidence, and next action; retain the three existing active services and their links/copy.
- ACCEPTANCE EVIDENCE: 1440 and 390 show exactly the active services as ruled rows, an explicit evidence/process sequence, preserved service slugs and contact CTA, and no generic service-card grid.

### About /about/

- CURRENT: Intro split, numbered approach list, closing statement.
- HISTORICAL TARGET: B editorial profile: route folio, material workspace image, “who/why” statement, working method as cause/check/action notes, and a contact continuation.
- REQUIRED STRUCTURAL CHANGE: Turn the split intro and list into a visual reading route with material image/evidence captions and a ruled method sequence. Preserve founder text and claims; do not add a founder portrait or new credentials.
- ACCEPTANCE EVIDENCE: 1440 and 390 show the workspace material, editorial profile hierarchy, four method steps, and a visible continuation to contacts without legacy centered marketing composition.

### Contacts /contacts/

- CURRENT: Blue hero plus ContactLinks rendered as two groups of rounded link cards and email CTA.
- HISTORICAL TARGET: B closing route: dark/navy contact folio, direct question statement, ruled channel rows for contacts and project reading, and clear response expectation.
- REQUIRED STRUCTURAL CHANGE: Keep the existing link data/events but render them as editorial rows with icons, channel labels, and arrows; remove rounded card-grid grammar and make the two link groups read as a single route.
- ACCEPTANCE EVIDENCE: 1440 and 390 show both existing contact/project groups, working external targets and event attributes, no rounded card wall, and a readable closing route at mobile width.

## Cross-route fidelity gate

For each route, historical evidence may be captured as BEFORE (2ac8e42) → HISTORICAL REFERENCE (B/A render) → AFTER (new browser render) at 1440 and 390. A build, a changed color palette, copy, CTA, padding, or isolated CausalTrace block is not structural fidelity. Review Chair may not accept a current artifact without current visual authority and reference fidelity.
