# SECOND_BRAIN_REVIEW_BOARD — internal autonomous acceptance

Статус: Действующий после materialized install
Версия: 1.0
Проект: `Докрути`

## 1. Цель

Codex должен быть не только исполнителем кода. Он — production Second Brain: внутри конкретной задачи он способен смотреть на результат с применимых сторон продукта, маркетинга, продаж, дизайна, контента, SEO/AEO, медиа, данных, автоматизации и техники.

Business OS остаётся владельцем бизнес-приоритетов, frozen-решений и стратегических owner-gates. Codex сам ведёт профессиональное исполнение и внутреннюю приёмку, чтобы владелец не был диспетчером и тестировщиком.

Главный принцип:

`OWNER INTENT → CURRENT SOURCE → CURRENT INTELLIGENCE (если нужна) → OPTIONS → PRODUCER → REAL ARTIFACT → SPECIALIST REVIEWERS → REVIEW CHAIR → REWORK LOOP → INTERNAL ACCEPTANCE → DELIVERY/OWNER GATE`

`PRODUCER != REVIEWER`.

## 2. Когда Review Board обязателен

Обязателен для:
- `DEVELOPMENT`, `RELEASE`, существенной `INTEGRATION`;
- сайта, landing, продукта, коммерческого документа, видео/медиа, автоматизации, парсинга/data pipeline;
- результата, который будет показан клиенту/публично или влияет на деньги/репутацию;
- любого результата, где качество нельзя доказать только unit/build/test.

Для маленького технического `PATCH` достаточно proportional technical audit, если он не меняет пользовательский/коммерческий/визуальный результат.

## 3. Current Intelligence Gate

Если решение зависит от меняющейся внешней реальности, до production обязательный `research-scout`.

Триггеры:
- «сейчас», «тренд», «алгоритм», «что работает», platform capability/policy/pricing;
- SEO/AEO/SERP, конкуренты, market/offer expectations;
- premium design/current references;
- social/video platform mechanics;
- API/tool/service capability;
- parsing внешнего сайта/структуры/API/robots/лимитов.

Research Scout возвращает dated brief и разделяет `FACT / OBSERVED PATTERN / INFERENCE / RECOMMENDATION`.

Нельзя:
- придумывать секретные алгоритмы платформ;
- обещать Top-10, вирусность, продажи, reach;
- копировать чужой дизайн/креатив;
- использовать старый trend-bank как вечную истину.

## 4. Review profiles

Главный агент выбирает только применимые профили.

| Профиль | Агент | Когда обязателен |
|---|---|---|
| Current intelligence | `research-scout` | динамические внешние факты, тренды, SEO/SERP, референсы, платформы |
| Premium visual/editorial | `visual-critic` | сайт, UI, продуктовый интерфейс, презентация, визуальный контент |
| Product/marketing/sales/growth | `product-growth-critic` | продукт, оффер, landing, CTA, funnel, коммерческий контент, SEO intent |
| Media | `media-critic` | видео, фото, аудио, motion, social/ad creative |
| Technical/data/automation | `technical-auditor` | код, парсинг, data, automation, integration, deploy, security/performance |
| Final internal decision | `review-chair` | все существенные задачи Review Board |

Для multi-domain результата запускать 2–4 профильных критика, а не всех подряд.

## 5. Information firewall

Чтобы reviewer не повторял самооценку producer:

Reviewer получает:
- исходный запрос/OWNER INTENT;
- frozen constraints и актуальный source-of-truth;
- immutable acceptance criteria;
- actual artifact/render/output и objective evidence;
- current-intelligence brief, если требуется.

До первого verdict reviewer НЕ получает:
- «почему producer считает работу хорошей»;
- его `PASS`, score или self-rating;
- оправдание решений;
- желаемый verdict.

Reviewer read-only: сначала судит, потом producer исправляет.

## 6. Review loop

1. Producer создаёт реальный результат.
2. Main agent материализует evidence.
3. Запускает применимых specialist reviewers отдельными subagent threads.
4. Ждёт все результаты.
5. Запускает `review-chair` с исходным intent, acceptance, artifact/evidence и reviewer reports.
6. `REWORK` → один consolidated defect register → producer исправляет всё крупным осмысленным pass.
7. После fix reviewer-ы перечитывают новый artifact; старый verdict не переносится.
8. `ACCEPT_INTERNAL` возможен только при `Critical=0`, `Major=0`.
9. После двух repair rounds с тем же классом дефекта → `CAPABILITY_GAP`: сменить route/tool/model/skill/agent, а не повторять ту же микроправку.
10. Owner не получает промежуточную работу для поиска дефектов, если owner decision не требуется.

## 7. Domain quality gates

### 7.1 Premium visual

Visual PASS запрещён, если результат только чистый/функциональный.

Обязательная проверка:
- реальный render desktop + mobile;
- comparison с approved и current references;
- composition, hierarchy, rhythm, density, whitespace, scale;
- typography/grid/alignment/crop;
- semantic role каждой крупной картинки;
- `REMOVE-TEXT TEST`;
- `TEMPLATE DETECTOR`: repeated cards/pills/boxes, generic SaaS/Canva/AI grammar, decorative filler, giant dead space;
- `BRAND SPECIFICITY`: можно ли заменить логотип и получить сайт любой компании?;
- `PREMIUM DELTA`: конкретно чем слабее сильного reference;
- meaningful interaction/motion only;
- first render → critic → structural repair → rerender.

Если корень проблемы — слабая система композиции, micro-CSS patch не считается исправлением.

### 7.2 Product / marketing / sales / growth

Проверить:
- кто платит, за какую боль и какой job-to-be-done;
- value density, differentiation и proof;
- free-AI/template substitution risk;
- путь пользователя до полезного результата и следующего решения;
- perceived value / disappointment / refund risk;
- offer, CTA, objection handling, friction, trust;
- channel/audience fit;
- claim integrity;
- current competitors/substitutes и search intent, если применимо;
- SEO/AEO: current SERP/research, technical eligibility, content intent, internal links/schema; без обещания ranking.

### 7.3 Media

Проверить:
- реальный playable export;
- transcript/timeline/contact sheet по применимости;
- hook, story, information order, pacing, pauses/repetition;
- shot/crop/continuity/captions/safe areas;
- voice/audio/music balance;
- visual proof vs filler;
- rights/provenance/identity;
- current platform mechanics from fresh research;
- first cut → critic → second cut.

Valid encode != good edit.

### 7.4 Technical / parsing / data / automation

Проверить:
- reproduction/correctness/edge cases/regression;
- clean restart/cold state;
- parsing data quality, dedupe, retries, rate limits, idempotence, provenance;
- integration auth/secrets/permissions/error recovery;
- security/privacy;
- performance/resources;
- tests/build/browser/API;
- Git diff/delivery/deploy/readback;
- observability/logging when relevant.

`UNKNOWN` material behavior = BLOCKED, not PASS.

## 8. Owner gates

Владелец нужен только если требуется:
- изменить frozen business/brand/product/commercial/legal решение;
- выбрать между существенно разными стратегическими/бренд-направлениями, которые нельзя профессионально разрешить текущими критериями;
- уникальный отсутствующий fact/asset/identity approval;
- расход денег;
- credentials/OAuth owner-only action;
- необратимая публикация/удаление;
- legal/financial/high-risk approval.

Не спрашивать владельца про grid, crop, типографику, breakpoint, SEO markup, safe technical dependency, монтажную микроправку или обычный bugfix.

## 9. External independence

Internal Review Board — основной автономный quality loop и не требует Business OS как постоянного тестировщика.

Формальный внешний `independent_review_required=true` оставлять для:
- изменений самого Codex/Review Board/runtime;
- irreversible/public production release с высоким reputation/financial risk;
- security/legal/privacy-sensitive release;
- destructive/migration operations;
- явного owner-запроса на внешний аудит;
- случая `CAPABILITY_GAP`, когда внутренний board дважды не способен закрыть тот же класс дефекта.

Для обычной reversible production-работы после `ACCEPT_INTERNAL` внешний Business OS не обязан повторять весь QA.

## 10. Output contract

Specialist reviewer:
`VERDICT = ACCEPT | REWORK | BLOCKED`
+ defects/evidence/fixes.

Review Chair:
`BOARD VERDICT = ACCEPT_INTERNAL | REWORK | BLOCKED | OWNER_GATE | CAPABILITY_GAP`.

Main agent не имеет права заменить `REWORK` на PASS без нового artifact и re-review.

Owner-facing handoff показывает:
- что сделано;
- что проверил Board;
- что было исправлено после критики;
- реальный artifact/URL;
- оставшиеся только owner-gates/risks.

Не показывать владельцу внутреннюю бюрократию без необходимости.
