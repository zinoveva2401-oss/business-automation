# ARTICLE_IMPORT — готовая статья → сайт

Статус: Действующий production-регламент
Версия: 3.0
Проект: `Докрути`

Это `INTEGRATION`-маршрут. Он не заменяет live source check и не превращается в полный аудит сайта без доказанной причины.

## 1. Вход

Владелец/ChatGPT может передать готовый текст, название, slug или право подобрать slug, изображения/данные и цель/CTA. Готовый авторский текст считать утверждённым содержанием: без отдельного запроса не переписывать смысл, добавлять факты или проводить литературную редактуру.

## 2. Перед работой

1. Прочитать этот регламент, target content и непосредственно связанный renderer/catalog.
2. Для существенной editorial-задачи проверить через `docs/ai/SOURCE_MANIFEST.md` только нужный live brand/site context и Version/Date/Status.
3. Определить, достаточно ли существующего template или материал требует смысловых editorial-блоков: quote, callout, table, diagram, evidence block, related content, product connection или CTA. Не добавлять элементы ради наполненности.

## 3. Производство

Добавить материал в правильный content layer, сохранив авторскую структуру. Codex самостоятельно принимает профессиональные решения по типографике, ритму, media/alt, навигации, responsive и meaningful interaction/motion; не создавать новую постоянную design system. Если CTA/product status не подтверждён live source, не создавать ложную коммерческую кнопку.

## 4. SEO/AEO и integrity

Проверить по применимости: readable URL/slug, unique title/description, ровно один смысловой H1, H2/H3 hierarchy, canonical, robots/noindex, OG, Article/BreadcrumbList schema, author identity, dates, alt/dimensions/optimization, internal links, sitemap inclusion, crawlable navigation и отсутствие fabricated claims.

## 5. QA

Для target page проверить:

- build/check и route;
- desktop/laptop/tablet/mobile, отсутствие horizontal overflow и обрезок;
- real browser render, console/network failures, broken images/links;
- keyboard/focus, semantic structure, contrast, reduced motion;
- metadata/schema и content integrity;
- каталог/категорию/related links только если они затронуты.

Для значимой публичной статьи выполнить independent review/Red Team, один consolidated fix и regression. Не просить владельца проверять мобильную, SEO, alt, ссылки или визуальные дефекты вместо Codex.

## 6. Границы

Не менять другие статьи, зависимости, бизнес-цены или product status; не проводить общий redesign. Commit/push выполнять только если это прямо входит в текущую задачу, после allowlist и проверок. Отчёт содержит фактические файлы, URL/branch/commit, проверки и blockers.
