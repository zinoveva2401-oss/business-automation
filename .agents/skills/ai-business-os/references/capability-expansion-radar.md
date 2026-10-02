# Capability Expansion Radar / Skills, Plugins, Apps, Models, Parsers & External AI

## Purpose

Business OS должен замечать не только рыночные тренды, но и **пробелы собственных возможностей**: что можно делать быстрее/качественнее с новым Skill, Plugin, app, API, парсером, моделью, локальным инструментом или внешней нейросетью.

Цель — расширять DOKRUTI осмысленно, а не коллекционировать инструменты.

## 1. Capability-gap first

Новый инструмент ищется только после формулировки пробела:
`задача → текущий маршрут → дефект/лишние owner-hours/качество/стоимость → нужная способность → кандидаты`.

Не устанавливать «потому что модно».

## 2. Search order

Перед внешним сервисом проверь:
1. встроенную способность текущей поверхности;
2. уже установленные Skills/Plugins/apps/connectors;
3. существующий безопасный скрипт/CLI/автоматизацию;
4. Plugin Directory / current skills ecosystem;
5. внешний API/нейросеть/platform;
6. собственную разработку — только если предыдущие пути хуже.

## 3. Capability registry

Поддерживай **один** текущий реестр способностей, а не список названий сервисов:
`capability / current route / quality evidence / cost/quota / privacy / surface / status / last checked / known failure / alternative`.

Примеры capability-классов:
- web research/monitoring;
- crawling/parsing;
- dashboard/data analysis;
- CRM/sales;
- image/design/mockup;
- 3D;
- video/edit/motion/audio;
- transcription/TTS;
- SEO/search;
- ads/local business;
- automation/integration;
- code/repo/browser;
- knowledge/memory;
- document production;
- legal/finance evidence;
- analytics/experiments.

## 4. Install/recommend gate

Перед установкой/подключением оцени:
`fit / качество / официальный статус / privacy/data / права / security / лицензия / цена / лимиты / export/lock-in / collision / maintenance / rollback / learning curve / owner-hours / доказанное преимущество`.

Платные, credentialed, privacy-sensitive, irreversible или vendor-lock-in решения требуют соответствующего решения владельца.

Бесплатный и обратимый инструмент всё равно не ставится, если нет gap.

## 5. Current information only

Тарифы, модели, названия, лимиты, Plugin Directory, UI, поддерживаемые поверхности и capability меняются. Перед решением проверяй актуальные официальные источники и текущий аккаунт/среду.

Stable Skill хранит **классы возможностей и критерии**, а не вечный рейтинг сервисов.

## 6. Model & reasoning router

Для каждой существенной задачи Business OS сам выбирает модель/уровень размышления и объясняет это только если это влияет на стоимость/качество.

Алгоритм:
- если задача новая, дорогая в ошибке или плохо формализована → получить quality baseline сильным маршрутом;
- затем проверить, проходит ли более дешёвая/быстрая модель тот же acceptance;
- для известного повторяемого класса сразу использовать **самый дешёвый ранее доказанный** маршрут;
- повысить модель/размышление только при конкретном сигнале: ошибки, сложная архитектура, неоднозначность, высокий риск, провал проверки;
- не использовать максимальное размышление для механического рендера, копирования, конвертации или frozen-spec transforms;
- разделять `думать / производить / рендерить / проверять`.

Контекст тоже стоит ресурсов: не отправляй модели весь репозиторий/всю базу, если достаточно извлечённых источников, индекса, ledger и конкретных файлов.

## 7. Small benchmark before adoption

Если неясно, что лучше — Sol/Luna/Terra/Astra, Work/Codex/Chat, новый плагин или другой сервис — не запускай сразу большую задачу.

Сделай representative benchmark:
`одинаковый brief + acceptance → 1–3 маршрута → качество → время → токены/лимит → owner rescue → дефекты → итоговая стоимость`.

После benchmark обнови существующий capability/executor record.

## 8. Opportunity scout

Capability Radar также спрашивает:
- какие новые возможности позволяют создать то, что раньше было слишком дорого/долго;
- можно ли из новой capability получить новый продукт/услугу/контент/портфолио;
- есть ли market whitespace, где новая способность даёт DOKRUTI реальное преимущество.

Не обещай доход без данных. Для «там можно заработать X» нужны спрос, цена, объём, delivery capacity и экономика; иначе это гипотеза диапазона.

## 9. Proactive but not noisy

Business OS должен сообщать о новой capability, если выполнено хотя бы одно:
- закрывает доказанный повторяющийся дефект;
- экономит заметные owner-hours;
- повышает публичное качество/портфолио;
- открывает новый revenue route;
- снижает существенный риск;
- делает возможной автоматизацию, которую раньше нельзя было безопасно сделать.

Не присылай новости об инструментах ради новостей.

## 10. Acceptance

PASS, если рекомендация нового инструмента отвечает:
`какой gap / почему текущий route хуже / что именно получим / сколько стоит / какие данные отдаём / как проверить / как откатить / как измерим преимущество`.


## Creator / trend intelligence class

Отдельно отслеживай инструменты для `trend discovery / competitor velocity / creative libraries / transcript editing / captions / audio cleanup / teleprompter / creator analytics / social listening`. Это классы возможностей, не вечный список брендов. Конкретный сервис допускается после current availability, data/privacy, price, export, platform-ToS и representative benchmark.

Примеры источников на дату проверки могут включать официальные TikTok Creative Center/Top Ads/Trends, YouTube Studio Trends/breakout/content gaps, Meta/Instagram creator tools/Edits, Google Trends и специализированные creator analytics вроде vidIQ; перед использованием перепроверь актуальность.

## 11. r9 FINAL external capability integration

Use [Automation Observability + External Capability Integration](automation-observability-external-capabilities.md). During the post-r9 audit useful candidate classes included visual prototyping (Figma-class), production web-app tooling, programmatic video/motion (Remotion-class), behavior analytics/CRO (PostHog-class), social scheduling (Postiz-class), workflow orchestration (Activepieces-class) and external marketing skill libraries.

These names are examples, not permanent dependencies. Reverify Plugin Directory/account availability, permissions, supported DOKRUTI channels, pricing, data handling and license immediately before connection. Import missing **methods** from an external marketing skill library; do not install a second operating brain that competes with Business OS.
