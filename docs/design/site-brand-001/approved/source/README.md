# MAIN SITE-BRAND-001 — STAGE 3A

Дата: 2026-09-21
Статус: `OWNER DECISION REQUIRED`
Scope: concept stage only; production/staging site was not changed.

## Source Access Map

| Source | Access | Boundary |
|---|---|---|
| LOCAL REPO | YES | Read-only inspection of current Astro source, real content and assets. |
| GITHUB | YES | Existing repository/remote identity and governance baseline were inspected; no write. |
| LIVE DRIVE/SHEETS | NO | Connector was unavailable in this run; no live business snapshot was claimed. |
| BROWSER/WEB | YES | Read-only research plus real browser render of the concept previews. |
| OWNER/BUSINESS OS SNAPSHOT | NO | The task packet is direct owner intent, not a live canonical snapshot. |

## Current intelligence

- Yandex mobile/usability guidance: adaptive content, no horizontal scroll, readable text, complete structured content and logical headings.
- Google page experience guidance: mobile display and Core Web Vitals are baseline constraints, not a ranking promise.
- WCAG 2.2: keyboard/focus, contrast, target size and reduced-motion behavior remain implementation gates.
- Current editorial reference pattern: strong typographic hierarchy, considered columns and art-directed imagery; use the mechanic, not a copied layout.

Sources: [Yandex mobile](https://yandex.ru/support/webmaster/en/recommendations/mobile-site), [Yandex usability](https://yandex.ru/support/webmaster/en/recommendations/usability), [Yandex information presentation](https://yandex.ru/support/webmaster/en/recommendations/presentation), [Google page experience](https://developers.google.com/search/docs/appearance/page-experience), [WCAG 2.2](https://www.w3.org/TR/wcag/), [editorial reference](https://www.a1.gallery/style/editorial).

## Three directions

### A — «Рабочий стол причин»

Dark tactile investigation desk. The hero starts with a symptom, then uses paper, a trace line and a marked next check to make the causal route visible. Library is a lead investigation plus a short evidence list; article ends in a next-check rail; Tools and Services use the same worktable grammar.

Strength: strongest pain-first emotional signal and clearest diagnosis-to-action metaphor.
Risk: requires disciplined art direction; dark density and large serif type can overpower content if scaled carelessly.

### B — «Редакционный маршрут»

Light broadsheet/folio system. A persistent problem map exposes all seven pain directions; ruled rows and magazine-like spreads make the library scalable; Article becomes a focused reading surface; Services are explicit rows rather than a generic card wall.

Strength: clearest information architecture and best fit for multi-industry content growth.
Risk: must retain a distinctive «Докрути» trace so it does not become a generic editorial magazine.

### C — «Сигнальная лента»

Dark signal field. A horizontal route turns the seven pain directions into a visible signal system; evidence, article steps and service bands all follow signal → fact → check → action.

Strength: most memorable portfolio surface and strongest visual distinctiveness.
Risk: the signal mechanic must always refer to a real fact or next action, otherwise it becomes decorative dashboard language.

## Comparison

| Criterion | A | B | C |
|---|---:|---:|---:|
| Premium distinctiveness | High | High | Highest |
| Pain-first clarity | Highest | High | High |
| Multi-industry scalability | High | Highest | Medium |
| Library/article scalability | High | Highest | High |
| Service/product route clarity | High | Highest | High |
| Implementation risk | Medium | Low–medium | Medium–high |
| Mobile resilience | Pass after preview QA | Pass | Pass |

## Browser evidence

Static previews were rendered in a real browser at 1440×1000 and 390×844.

- A/B/C desktop: required sections present; `overflow=false`; `brokenImages=0`; CTA present in viewport.
- A/B/C mobile: `scrollWidth=375` against a 390px viewport; required sections present; `brokenImages=0`; CTA present in viewport.
- A/B/C Article view: `#article` contains a real article heading, source image and a next-action link to Tools; no overflow; `brokenImages=0`.
- The only preview corrections were asset path copies into this ignored output folder and responsive CSS in `concepts.css`. No `src/`, `public/`, staging or production files were changed.

## Sequential Review Board

### 1. Visual Critic

All three are materially different and pass the Remove-Text Test better than the current staging baseline: A reads as a causal worktable, B as an editorial route, C as a signal system. Current staging is not classified as premium; its repeated template/card grammar remains a material defect, so the requested “premium current site = smoke FAIL” condition is **not triggered**.

Visual findings: A has the strongest diagnosis image-language; B has the cleanest hierarchy and content rhythm; C has the most ownable signature but the highest risk of ornamental signal treatment.

### 2. Product / Growth Critic

B provides the strongest first decision for a small-business owner: choose one of seven pains, read a useful proof-oriented article, apply a tool, then describe a task for one of the three frozen services. A is the strongest emotional conversion route for a single painful situation. C needs the most explicit factual labels to prevent abstraction.

### 3. Technical Feasibility Critic

All concepts are feasible as Astro routes/components with shared content data and a small number of layout variants. B has the lowest implementation risk because its grid and row system map cleanly to reusable content collections. A needs careful image cropping, font-size limits and dark-surface contrast. C needs accessible semantics for the signal line, strict reduced-motion rules if motion is later added, and a no-JS fallback. None requires a fake dashboard, lead form, backend or product claims.

### 4. Review Chair

Recommendation: **B — «Редакционный маршрут»**.

Reason: it best balances premium editorial quality, the frozen multi-industry scope, seven-pain discovery, real article growth, Tools and the three services. A is the strongest alternative if the owner wants a darker, more tactile and emotionally charged portfolio position. C is the most distinctive campaign-like option, but it has the highest risk of turning the core mechanic into decoration.

No implementation authorization is inferred from this recommendation. Stage 3B must wait for the owner’s selection and any required reference lock.

## Decision gate

`OWNER DECISION REQUIRED: выбрать A / B / C`

Stop after the decision. No site repair or Stage 3B implementation was performed in this run.
