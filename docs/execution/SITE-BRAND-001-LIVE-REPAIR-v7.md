# SITE-BRAND-001 | LIVE REPAIR v7 | EXECUTION SPEC

RUN-ID: `RUN-SITE-BRAND-001-2026-09-17`  
STAGE-ID: `STAGE-INDEPENDENT-LIVE-VISUAL-QA`  
Target repo: `zinoveva2401-oss/business-automation`  
Base/staging branch: `codex/timeweb-staging-2026-09-06`  
Repair branch: `repair/site-brand-001-live-qa-20260917`  
Live baseline: `https://zinoveva2401-oss-business-automation-9ed2.twc1.net/`

## 0. INTENT LOCK

Не проектировать новый сайт и не проводить новое исследование.

Цель — довести **фактически опубликованный staging** до независимого visual/mobile PASS по уже принятой архитектуре «Докрути».

Business OS = Site Architect + Art/UX/Marketing QA.  
Codex = технический исполнитель.  
Self-PASS исполнителя не является приёмкой.

Не требуется восстанавливать незапушенный локальный результат предыдущего запуска Codex: source of truth этой repair-задачи — текущий staging branch + live staging + frozen sources.

## 1. SOURCE PRIORITY

При конфликте:

1. последнее owner decision;
2. frozen `12_САЙТ_МАТРИЦА`;
3. Brand System v8.2;
4. approved visual SOT;
5. текущие Product/COMM sources;
6. текущий staging implementation.

Approved visual SOT:
`https://drive.google.com/drive/folders/1nl7DusVaryJYskvEiUTzbfAwJ_klSYnH`

Relevant approved references:
- HOME: `https://drive.google.com/file/d/1FNbHcS1v8_P76nKFHcgyaF5n3ZFMg_Ax/view`
- LIBRARY: `https://drive.google.com/file/d/16RHQnZMFyPdsl7QpuIepHXc6dE8SVTE1/view`
- TOPIC: `https://drive.google.com/file/d/1y4G9m5z1ZrFGOcw1trH3qzfymdpiPFB8/view`
- ARTICLE: `https://drive.google.com/file/d/13NeNsm28CsT8-Ua5w5QbzcbKG3W5BgQy/view`
- TOOLS: `https://drive.google.com/file/d/1ctujbATkd9tLIebAiV7dEuykJ0_yBfLK/view`
- PRODUCT: `https://drive.google.com/file/d/1cM51JLcMr4vL7s6UgfA_Wn6fingwHkGU/view`
- SERVICES: `https://drive.google.com/file/d/1jaZtcNhwbmWuPhYD_7IaqAU-Eop-NVzq/view`
- ABOUT: `https://drive.google.com/file/d/1EJpu9hCdBLxWVJ49HccOS8mxVHPE6sZR/view`
- CONTACTS: `https://drive.google.com/file/d/1N9OlGHqpXkYsZ0N7aEH9uxUfrEDLSfeQ/view`
- FOOTER: `https://drive.google.com/file/d/1dkTTisK_A0_2_CKZ2bZcrwdpF39_4XZm/view`
- 404: `https://drive.google.com/file/d/1dMKnXVnuM32cZ5zYVNUhd3pTjozOnvMV/view`

Если Drive reference недоступен, НЕ придумывать новую visual system. Использовать ограничения этого SPEC + уже существующие assets/layout в repo; явно отметить недоступный reference в отчёте.

## 2. PRESERVE — НЕ ЛОМАТЬ

- существующие CURRENT routes и 7 topic-направлений;
- фактические тексты/статьи и сильные legacy-блоки, уже прошедшие content gate;
- product HOLD: пока продукт не собран/не прошёл release QA, не добавлять цену, checkout, purchase CTA или ложное READY;
- staging `noindex,nofollow`;
- consent/analytics scaffold и env-based analytics hooks;
- подтверждённые redirects/aliases;
- Brand v8.2;
- русскоязычный публичный интерфейс;
- текущие реальные channel URLs; изменение внешних профилей не входит в этот PR.

НЕ трогать domain/DNS/production Metrika/payment/legal architecture.

## 3. CONFIRMED LIVE DEFECTS — REPAIR REQUIRED

Ниже — не wishlist, а дефекты, подтверждённые независимым live QA 17.09.

### A. Global / desktop

1. Текущий сайт технически открывается, но на ключевых страницах остаётся ощущение шаблонного blog/SaaS layout вместо approved premium editorial direction.
2. Визуальная иерархия между основным editorial event и вторичными карточками недостаточно сильная.
3. Повторяющиеся по конструкции карточки/секции делают страницы слишком однообразными.
4. Не растягивать пустоту ради высоты секций. Контент должен определять высоту.

### B. Homepage `/`

1. `Свежие материалы` выглядит как равноправная шаблонная карточная лента. Нужен approved pattern: один dominant editorial material + три вторичных материала с собственной визуальной иерархией.
2. Pain navigation должна читаться как функциональная полоса из 7 направлений, не как набор SaaS-pill/card элементов.
3. CTA hierarchy: один главный следующий шаг в hero; вторичный не должен конкурировать визуально.
4. Founder / services / channels должны иметь разные editorial compositions, не повтор одной сетки.

### C. Library `/articles/`

1. Current grid слишком однородный и не дотягивает approved premium editorial reference.
2. Topic/pain navigation должна быть визуально отделена от content grid и помогать выбрать проблему, а не выглядеть как generic filter panel.
3. Featured/editorial hierarchy должна отличать главный материал от остальных.
4. Не повторять одинаковый crop/scene/style как всю библиотеку.

### D. Tools `/tools/` and current product route

1. На live используется stale product name: `Система управления командой магазина`.
2. Current Product SoT: `Система управления командой бизнеса`.
3. Синхронизировать публичное название и применимый scope без добавления цены/checkout. Статус разработки/HOLD сохранять честным до реального Product release QA.
4. Visual presentation продукта должна соответствовать approved TOOLS/PRODUCT refs, а не выглядеть как одна generic content card.

### E. Services `/services/`

1. Три услуги визуально слишком похожи друг на друга.
2. Сохранить три factual formats, но различить их композиционно/иерархически; не изобретать новые услуги.
3. Повтор CTA `Описать задачу` не должен создавать три визуально конкурирующих primary actions. Должен быть понятный единый путь к вопросу.

### F. Contacts `/contacts/`

FROZEN MATRIX REQUIREMENT:
- `/contacts/` сохраняется как utility-page;
- не выводится отдельным пунктом main menu;
- короткое пояснение → Telegram / VK personal / MAX;
- header/footer `Задать вопрос` открывает лёгкий popover/drawer или ведёт на utility flow;
- без лишнего сбора ПД.

CURRENT LIVE DEFECT:
`/contacts/` фактически уводит на homepage `#question`, отдельная utility-page не сохранена.

Исправить route согласно frozen matrix. Не строить форму и CRM в этом PR.

### G. Mobile 390px

Independent live mobile render = FAIL.

Обязательно исправить:
- hero не должен визуально давить/перекрывать текст и следующий блок;
- menu/open-menu должен быть фактически usable;
- не должно быть horizontal overflow;
- размер heading/body/CTA должен сохранять иерархию;
- pain navigation/cards должны иметь мобильную композицию, а не desktop grid squeezed to 390;
- между крупными hero-блоками и карточками нужен ровный vertical rhythm;
- sticky/fixed/large imagery не должна закрывать текст;
- footer/channel actions остаются tappable.

## 4. PAGE-BY-PAGE COMPOSITION CONTRACT

### Home

Target viewport desktop: `1440 × 1000 CSS px`.

- strong editorial hero: text + meaningful photographic workspace/diagnostic image;
- 7-direction pain rail immediately after hero;
- `Актуально`: dominant ≈45–50% + 3 secondary materials where content exists;
- useful materials: editorial cards + visually distinct tool block;
- approach/process: compact 7-step rail, not full-screen whitespace;
- founder/services: asymmetric editorial layout;
- channel block separate from final contact CTA;
- footer follows approved reference.

### Articles library

- compact editorial hero;
- clear pain/topic navigation;
- featured material visually dominant;
- editorial 3-col grid on desktop where width permits;
- descriptions readable, not title-only cards;
- real visual variation.

### Services

- keep factual service copy;
- 3 formats must be scannably different without decorative overdesign;
- one obvious contact path after the formats;
- no invented prices/cases/metrics.

### About

- preserve factual founder copy and current Dokruti positioning;
- image remains editorial/trust-building;
- do not turn page into resume/certificate wall;
- CTA hierarchy should be clear and compact.

### Contacts

- restore CURRENT utility page and contact choices;
- no separate main-menu item;
- no form in this repair.

## 5. RUSSIAN UI / BRAND LINT

Public interface must not expose technical English labels such as `preview`, `current`, `template`, `HOLD`, `latest`, `read time`, etc.
Official platform names (VK, Telegram, MAX, VC.ru) are allowed.

Scan for stale public master-brand strings. `Розница в цифрах` must not remain as current Dokruti brand copy inside site UI. External destinations may still currently carry old names — do not rewrite their URLs in this PR.

Scan product naming so current public product label is `Система управления командой бизнеса` wherever this SKU is shown.

## 6. IMPLEMENTATION RULES

- Start from current repair branch only.
- Before editing: output `git status`, current HEAD, branch.
- Inspect existing components/CSS before adding new component systems.
- Prefer targeted reuse/refactor; do not create duplicate design systems.
- No new package/dependency unless essential and justified.
- Preserve Astro build and route generation.
- Do not merge/deploy.
- Do not change `main`.
- Do not alter owner/business documents in repo.

## 7. REQUIRED QA BEFORE REPORT

Run available project build/lint/tests.

Then real-browser render screenshots:

Desktop `1440 × 1000`:
- `/`
- `/articles/`
- one topic page
- one article page
- `/tools/`
- current product page
- `/services/`
- `/about/`
- `/contacts/`
- 404

Mobile `390 × 844`:
- `/`
- `/articles/`
- current product page
- `/services/`
- `/contacts/`

For every checked route report:
`route | reference/contract | changed | desktop | mobile | remaining defect`.

Also prove:
- no stale current-brand `Розница в цифрах` in site UI;
- no stale product label `Система управления командой магазина` for current SKU;
- `/contacts/` resolves as utility page, not homepage redirect;
- staging remains `noindex,nofollow`;
- no price/checkout/purchase activation;
- no domain/Metrika change.

## 8. ACCEPTANCE / STOP

Return **`READY FOR INDEPENDENT LIVE QA`**, not VERIFIED.

STOP and report exact blocker if:
- build cannot run;
- required CURRENT route is missing unexpectedly;
- repair would require changing frozen IA/business claims/product meaning;
- a destructive staging/main operation would be required.

Do not ask owner for routine visual/technical choices covered by this spec.
