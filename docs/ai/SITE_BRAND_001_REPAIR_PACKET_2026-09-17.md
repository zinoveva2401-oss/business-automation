# SITE-BRAND-001 — CONSOLIDATED VISUAL / CONTENT-SYNC REPAIR

RUN-ID: `RUN-SITE-BRAND-001-2026-09-17`  
STAGE-ID: `STAGE-SITE-CONSOLIDATED-REPAIR`  
Date: 2026-09-17  
Repository: `zinoveva2401-oss/business-automation`  
BASE / published staging branch: `codex/timeweb-staging-2026-09-06`  
Verified baseline HEAD before this repair: `77a886d580f15a67da13158f717d3df204bbb08f`  
WORK BRANCH: `repair/site-brand-001-2026-09-17`

## 0. EXECUTION CONTRACT

This is a repair of the current implementation, not a new design concept and not a new research task.

Work ONLY in `repair/site-brand-001-2026-09-17`.

DO NOT merge, deploy, change Timeweb settings, buy/connect a domain, enable production analytics, change payment/legal architecture, or push directly to the staging branch.

Before editing:
1. confirm repo / branch / HEAD / clean-or-understood `git status`;
2. inspect actual current implementation and routes;
3. read this packet completely;
4. open the approved visual references below. If the references cannot be viewed, report `STOPPED — VISUAL SOURCE UNAVAILABLE` before doing visual guesswork;
5. preserve current verified technical foundations: Astro/static, staging noindex/robots, 404/routing/redirect foundations, responsive image pipeline, consent-gated analytics scaffold, existing working content routes.

After editing:
- `npm run build` = PASS;
- `npm run check` = PASS;
- inspect real rendered screenshots, not source-only self-review;
- return exact changed files, commit SHA, test evidence, desktop screenshots and mobile screenshots;
- status may be only `READY FOR INDEPENDENT QA`, never `VERIFIED`.

## 1. SOURCE PRIORITY

1. Owner-approved visual references / direct owner decisions.
2. Frozen Site Matrix and current Business-System facts.
3. Brand System v8.2.
4. Current factual product/content state.
5. Current staging implementation.

Visual SOT folder:  
https://drive.google.com/drive/folders/1nl7DusVaryJYskvEiUTzbfAwJ_klSYnH

Mandatory references for this repair:
- Home: https://drive.google.com/file/d/1FNbHcS1v8_P76nKFHcgyaF5n3ZFMg_Ax/view
- Library: https://drive.google.com/file/d/16RHQnZMFyPdsl7QpuIepHXc6dE8SVTE1/view
- Tools/current single-product state: https://drive.google.com/file/d/1ctujbATkd9tLIebAiV7dEuykJ0_yBfLK/view
- Services: https://drive.google.com/file/d/1jaZtcNhwbmWuPhYD_7IaqAU-Eop-NVzq/view
- About: https://drive.google.com/file/d/1EJpu9hCdBLxWVJ49HccOS8mxVHPE6sZR/view
- Contacts: https://drive.google.com/file/d/1N9OlGHqpXkYsZ0N7aEH9uxUfrEDLSfeQ/view

IMPORTANT: `06_PRODUCT_approved_desktop.png` is explicitly a TEMPLATE and says `TEMPLATE — НЕ ДЛЯ CURRENT BUILD`. Do not treat its placeholder copy or price/FAQ blocks as current product facts.

Frozen Site Matrix:  
https://docs.google.com/spreadsheets/d/1RQVqOiyUxtuI9LnISz0BR31RZYvULz0gzE6-DzlFZz4/edit#gid=460134138

Brand v8.2:  
https://docs.google.com/document/d/1gO7OUFD1SmzCblHnYsV7o9Ig3xq8AL9PX3UGA6WmRns/edit

Current product state: `PROD-TEAM-001` = PRE-CODEX VERIFIED / product not yet released. Canonical public name: **«Система управления командой бизнеса»**. No price, checkout, purchase CTA or commercial Product/Offer claims until release QA.

Published baseline to inspect:  
https://zinoveva2401-oss-business-automation-9ed2.twc1.net/

## 2. INDEPENDENT LIVE AUDIT — FACTS TO REPAIR

The current published staging is technically reachable and has `noindex,nofollow`, but independent render review did NOT accept the visual result.

### HARD / factual mismatches

1. `/contacts/` is currently a 301 redirect to `/#question` (`src/pages/contacts.astro`). Frozen matrix requires a real utility `/contacts/` page plus light Telegram / VK / MAX contact choice. Contacts must NOT become a main navigation item.
2. Live tools/product still use **«Система управления командой магазина»** while current canonical product is **«Система управления командой бизнеса»**.
3. The live product page contains stale retail-only product architecture/details (including an old 7-part structure). Current product methodology/package is frozen elsewhere and not yet released. Do not publish obsolete detailed product copy as if it were current.
4. Topic hub `/topics/prodazhi/` exposes stale service names such as «Разбор одной проблемы магазина» and «Аудит продаж и работы магазина», while current service architecture is broader and uses current service names.
5. Article `plan-ne-vypolnen-chto-proverit` contains a stale commercial block for «Анализ продаж магазина: показатели и причины»; that is not the current launch product. Remove the stale commercial bridge or replace only with a factually valid neutral next step. Also fix the observed OG image typo `/hero-retail-investigation.png.png` if present in source/frontmatter.
6. Public channel targets still include externally stale brand states (Telegram/MAX/VC may still display old brand). The SITE must not falsely label an external target as already rebranded. Use neutral platform labels (`Telegram-канал`, `MAX-канал`, etc.) until CHANNEL-GROWTH actually changes the account.

### VISUAL / composition mismatches

7. Homepage currently renders a conventional hero + 7-topic grid + 3 equal article cards + tool + founder + question block. This is materially flatter and more template/blog-like than the approved Home reference.
8. `/articles/` currently feels like a filter/search dashboard and equal-card blog rather than the approved editorial library with visual hierarchy.
9. `/services/` currently repeats three nearly identical service blocks; approved direction uses editorial rows / distinct images / meaningful difference between formats plus a compact process rail.
10. `/about/` is visually simplified compared with approved editorial composition and lacks the approved layered project/founder story rhythm. Do not invent facts to fill it; reuse confirmed factual copy and current real Svetlana asset.
11. Mobile at 390px independently failed: hero/image/text balance and page rhythm are not a deliberate mobile composition. The current homepage CSS uses a 610px mobile hero and drops the hero image below the text; repair must be mobile-specific, not just a stacked desktop.

## 3. PAGE-BY-PAGE REQUIRED DELTA

### A. Global header / navigation / footer

- Preserve main nav: `Библиотека / Инструменты / Услуги / Обо мне` and main CTA `Задать вопрос`.
- Do NOT add `/contacts/` to main nav.
- `Задать вопрос` on desktop opens a light contact popover (Telegram / VK / MAX actual links); mobile uses a simple drawer/bottom-sheet pattern.
- `/contacts/` remains a direct utility route and can be linked from footer/contact contexts.
- Brand stays Russian-first. No public service words such as `preview`, `current`, `template`, `HOLD`, `latest`, `read time`.
- Do not display stale external brand names as if they were current Dokruti channel titles.

### B. `/` Home

Match the approved Home composition logic, without inventing missing content:

1. compact strong editorial hero; image and copy work as one scene; no oversized empty mobile hero;
2. horizontal 7-topic navigation immediately after hero, icon + label + separators; not a 4-column boxed SaaS grid on desktop;
3. `Актуально в Докрути`: one dominant material ~45–50% + up to three independent supporting materials when factual content exists; no duplicate cover/crop;
4. `Полезные материалы`: editorial article cards + visually distinct tool block; do not make every entity the same component;
5. restore a compact `Как мы идём к решению` seven-step rail based on the accepted Dokruti logic: проблема → причины → проверка → решение → инструмент → действие → контроль;
6. founder + services should form an editorial two-column rhythm; current services can be concise but must be present as current factual formats;
7. channel band and contact handoff near footer, consistent with approved Home reference;
8. current small-content state must look finished with 4 articles + 1 HOLD product. Never create filler or empty cards.

### C. `/articles/`

- Use approved Library reference as composition SOT.
- Editorial hero with meaningful image event and compact intro.
- 7 topic controls as a simple visual topic rail/chips; advanced search/sort may remain only if it does not dominate current 4-item state.
- One featured article + compact editorial grid/list for remaining actual articles.
- Preserve article data/links. No fake articles.
- Covers within one viewport must be visually varied, not one repeated retail-photo series.
- Do not inflate card height to simulate a large catalog.

### D. `/topics/[slug]/`

- Progressive hub: with 1 article, keep the page compact and useful; do NOT imitate a large hub.
- Show only factual existing entities.
- Remove stale service names/retail-only service links. Use current factual service titles or omit service blocks if no verified relevance.
- No empty sections / `скоро` filler.

### E. `/tools/`

- Current mode = one HOLD product, not a fake marketplace.
- Match approved Tools split composition: strong editorial visual + factual current product summary + honest next step.
- Canonical product name: `Система управления командой бизнеса`.
- Status must remain honest (`готовится` / equivalent). No price, checkout or purchase CTA.
- Do not publish obsolete seven-part product structure here.

### F. `/tools/store-team-management/`

Current detailed page is stale relative to frozen product work.

For this SITE repair, choose the safer truthful HOLD state:
- canonical name `Система управления командой бизнеса`;
- only facts that are confirmed in current product state: electronic book + integrated Excel workbook, aimed at managing small/medium teams across applicable business contexts;
- no old 7-part retail-only chapter map;
- no price, checkout, `купить`, payment, offer/product commercial schema or invented release claims;
- if exact current public product copy cannot be safely reconstructed from source, render a compact `готовится` page and defer detailed product copy until the technical product build passes independent release QA.

### G. `/services/`

- Keep current factual three formats; do not invent consulting promises.
- Visually differentiate formats instead of three same cards.
- Use approved Services editorial rhythm: split hero; 3 service rows/blocks with image or purposeful visual distinction; who/expected result/format; compact 3-step process; contact handoff.
- Preserve owner constraint: Dokruti is not a giant consulting/service business; services are supporting, scoped formats.

### H. `/about/`

- Use approved About reference for rhythm, not for inventing facts.
- Strong split editorial hero using current real Svetlana asset; no AI-generated face replacement.
- Explain project/founder with confirmed existing content; show how Dokruti works/principles in a denser editorial arrangement; selected materials and video-ready placeholder are allowed if factual.
- No fake certificates, reviews, cases, metrics or invented biography.

### I. `/contacts/`

MUST be restored as a real utility page.

Required current route:
- short intro;
- actual Telegram / VK / MAX personal contact routes from current factual link map;
- optional business email only if currently valid;
- no form and no new personal-data collection in this repair;
- desktop contact popover and mobile drawer should use the same factual links;
- keep `/contacts/` out of top nav.

### J. Article regression

For existing published articles:
- preserve the article subject even when it is genuinely retail-specific; do NOT generalize a retail article merely to remove the word `магазин`;
- remove stale product/service commercial bridges that no longer exist;
- fix broken/duplicated image paths such as `.png.png` where evidenced;
- no mass rewrite of good article bodies.

## 4. MOBILE REPAIR — REQUIRED

At minimum verify 390px; also 360 and 430 if available.

- Header menu must open and remain keyboard/touch usable.
- No hero image overlapping/obscuring heading.
- Hero must not consume an unnecessary ~610px just because desktop composition was stacked.
- Topics become deliberate touch navigation (horizontal scroll/chips or equivalent), not compressed desktop boxes.
- Featured material becomes one clear focal card followed by compact list.
- No horizontal overflow.
- Touch targets approximately 48px.
- Contact CTA opens usable bottom sheet/drawer.
- Footer/channel area remains readable and not icon-noise.

## 5. VISUAL RULES — DO NOT REGRESS

- Brand palette/tokens from Brand v8.2; orange is a rare action/trace accent, not a fill color for every panel.
- Avoid repeated generic rectangular cards.
- Avoid SaaS dashboard aesthetics.
- Use mixed editorial composition: strong visual event → quiet block → dense content → next accent.
- Do not use flat decorative SVG / random bars / diamonds as article hero or cover substitute.
- Do not reuse the same person/scene/crop repeatedly in one viewport.
- No `min-height:100vh` on normal sections.
- Container around 1200–1240px on 1440 desktop; section padding stays deliberate rather than huge.
- Meaningful images remain responsive and optimized.

## 6. DO NOT TOUCH

- Do not change brand strategy, 7-topic taxonomy, route architecture, current strong factual article text, legal/payment architecture, domain, production Metrika, Timeweb deployment config, or current frozen product methodology.
- Do not invent prices, testimonials, cases, metrics, product readiness, service guarantees or channel states.
- Do not global-replace `магазин` inside genuinely retail-focused editorial articles.
- Do not revive old `Розница в цифрах` positioning in public UI.

## 7. ACCEPTANCE / EVIDENCE REQUIRED FROM CODEX

Return one consolidated report with:

1. exact starting HEAD and final commit SHA on repair branch;
2. changed file list;
3. `npm run build` PASS;
4. `npm run check` PASS;
5. route/link regression for `/`, `/articles/`, one `/topics/`, one article, `/tools/`, product HOLD route, `/services/`, `/about/`, `/contacts/`, 404;
6. full-page screenshots at 1440×1000 for Home, Library, Tools, Services, About, Contacts;
7. mobile screenshots at 390px for Home, Library, Tools, Contacts/menu; no overflow and functional navigation;
8. text search/evidence for stale public items: old product name `Система управления командой магазина`, old product `Анализ продаж магазина`, stale service names, accidental visible `Розница в цифрах`; explain any intentional occurrence retained inside historical/editorial content;
9. evidence that `/contacts/` returns a real page, not a redirect;
10. evidence that product remains HOLD/no price/no checkout/no purchase CTA;
11. concise `EXPECTED DELTA vs ACTUAL DELTA` table.

Final Codex status: `READY FOR INDEPENDENT QA` or `STOPPED — <reason>` only.
