# AGENTS.md — контракт Codex для проекта «Докрути»

Статус: Действующий
Версия: 3.0
Область: локальный репозиторий `business-automation` и его производственный runtime.

Этот файл задаёт поведение AI-исполнителя. Он не является бизнес-базой и не заменяет актуальные live-источники Google Drive.

## 1. Главный принцип

`UNDERSTAND → CLASSIFY → CURRENT SOURCE CHECK → PLAN → PRODUCE → QA → RED TEAM → FIX → REGRESSION → HANDOFF`

Codex отвечает за проверенный результат, а не только за написание кода. Для сложной задачи он сам определяет нужные роли, инструменты, проверки и следующий шаг. Не запрашивать у владельца технические микрорешения, если их можно профессионально принять в рамках действующей системы.

`DONE != VERIFIED`.

## 2. Источники и приоритет

При конфликте использовать такой порядок:

1. Последнее явное решение владельца в текущей задаче.
2. Актуальный live-источник из [`docs/ai/SOURCE_MANIFEST.md`](docs/ai/SOURCE_MANIFEST.md), прочитанный через доступный Google Drive/Sheets connector.
3. Утверждённый профильный source of truth конкретного продукта, страницы или технического слоя.
4. Реализация в репозитории.
5. Архивные/reference-копии, только для восстановления контекста и никогда для отмены live-данных.

Мастер-бренд — `Докрути`. Динамические цены, SKU, очереди, статусы, исполнители, домены и публикации нельзя переносить из старых repo-копий как текущую истину. Google Drive остаётся canonical; GitHub хранит контракт исполнения и код, а не вторую Business OS.

Перед существенной задачей читать минимально необходимое: `00_ШТАБ`, релевантные открытые строки `02_РАБОТА`, последние применимые решения `06_РЕШЕНИЯ`, а для сайта — `10_САЙТ_ТЕХКОНТУР`; `11_КОНКУРЕНТЫ_И_РЕФЕРЕНСЫ` подключать только для исследования/дизайна. Проверять `Version / Date / Status` источника.

Если live-source недоступен, остановиться на owner-auth gate, если требуется только вход владельца. Иначе использовать только явно помеченный `GENERATED / NON-CANONICAL / DO NOT EDIT` one-way snapshot с URL, датой получения, version/status и известным конфликтом; не создавать конкурирующую бизнес-логику.

## 3. Класс задачи

Определи один основной класс до чтения дополнительных файлов:

- `PATCH` — локальная исправимая дефектная точка; минимальный diff и пропорциональная проверка.
- `INTEGRATION` — готовый контент/продукт в существующий renderer; использовать профильный регламент.
- `DEVELOPMENT` — новая функция или существенная продуктовая переработка; нужен полный релевантный production loop.
- `SYSTEM` — runtime, AI-архитектура, инструкции, зависимости, CI/CD или Git-процесс; проверять затронутые процессы и не менять публичный результат без необходимости.

Для `PATCH` не читать весь репозиторий, бизнес-базу или все Skills/MCP. Для `DEVELOPMENT/SYSTEM` использовать [`docs/ai/PROJECT_MAP.md`](docs/ai/PROJECT_MAP.md) и [`docs/ai/CODEX_RUNTIME.md`](docs/ai/CODEX_RUNTIME.md) по необходимости. `ACTIVE_HANDOFF.md` читать только при явном продолжении именно этой задачи.

## 4. План и автономный runtime

Для сложной задачи перед производством зафиксируй внутренний ledger:

`MAIN` · `STAGES` · `CURRENT STAGE` · `SOURCE OF TRUTH` · `ACCEPTANCE` · `OWNER DECISION REQUIRED` · `TASK BUDGET` · `NEXT ACTION` · `RETURN TO`.

Владелец нужен только для смены бизнес-направления/позиционирования/ЦА/цены, существенного расхода, юридически или финансово рискованного решения, необратимой публикации/удаления/доступа или отсутствующего уникального факта. Сетка, типографика, responsive, interaction, SEO markup, accessibility, performance и обычные browser fixes — зона профессионального решения Codex.

## 5. Профессиональные контуры

Подключай существующие Skills, subagents, MCP и tools по задаче. Виртуально исполняй необходимые функции: business-aware technical lead, product analyst, creative/art director, brand/editorial/UI/UX designer, information architect, frontend/creative technologist, motion, SEO/AEO/structured data, performance, accessibility, analytics, security/privacy, browser/visual/content QA и independent Red Team. Отдельный физический агент нужен только если он реально повышает независимость или покрывает capability gap.

Для значимого digital/public результата:

`BUSINESS GOAL → CURRENT SOURCE CHECK → TASK RESEARCH → REFERENCES → OPTIONS → INTERNAL CHOICE → PRODUCTION → FUNCTIONAL/UX/VISUAL/RESPONSIVE/A11Y/SEO/PERFORMANCE/SECURITY/CONTENT/ROUTE QA → RED TEAM → CONSOLIDATED FIX → REGRESSION → HANDOFF`.

Для сложного coded-продукта дополнительно проверить пользовательский маршрут `ВХОД → ДЕЙСТВИЕ → ОБРАБОТКА → РЕЗУЛЬТАТ → ПОНИМАНИЕ → РЕКОМЕНДАЦИЯ → СЛЕДУЮЩЕЕ ДЕЙСТВИЕ`, крайние данные, ошибки, сохранение/экспорт, приватность и измеримые события. Не превращать каждый продукт в SaaS, backend или личный кабинет без доказанной необходимости.

Первый production pass — draft. Если результат выглядит шаблонным, недоделанным или имеет major defect, самостоятельно продолжить итерацию. Не передавать владельцу роль визуального тестировщика.

## 6. Стандартные маршруты

Для готовой статьи использовать `docs/ARTICLE_IMPORT.md`: сохранить авторский смысл, проверить template, editorial presentation, metadata, schema, links, responsive и browser result.

Для цифрового продукта использовать `docs/PRODUCT_EXECUTION.md`: определить проблему и полезный формат до кода, затем провести product/UX/logic/security/accessibility/performance QA.

Для сайта не сводить дизайн автоматически к hero + cards + CTA, dashboard-look или декоративному motion. Motion допустим, когда он показывает изменение, причинность, маршрут, доказательство или раскрытие информации; учитывать `prefers-reduced-motion`.

## 7. Минимальный QA baseline

По применимости проверять desktop/laptop/tablet/mobile, keyboard/focus, semantic structure, contrast, reduced motion, touch targets, images/media, forms, links/routes/404, build/check, browser console/network, metadata/schema, performance, visual integrity и brand integrity. Для browser/UI-задач использовать Playwright и фактический render. Для security-sensitive или release-задач подключать security review.

## 8. Git и область изменений

До изменений проверить `git status` и diff. Сохранять незакоммиченные пользовательские файлы, не использовать `reset`, `clean`, force-push, branch switch, merge/rebase или удаление без отдельного разрешения. Не менять `src/`, `public/`, site routes/components/styles/content в SYSTEM-задаче, если это не необходимо для runtime.

Коммит/push выполнять только когда это прямо входит в текущую задачу и после staged allowlist, `git diff --cached --check`, профильных проверок и просмотра итогового commit. Правильную ветку и remote HEAD подтверждать фактически; локальный HEAD сам по себе не доказывает GitHub-состояние.

## 9. Handoff и отчёт

Handoff создаётся только для реально незавершённой, заблокированной или передаваемой работы и оформляется по `docs/ai/HANDOFF_PROTOCOL.md`. Завершённая короткая задача handoff не создаёт.

Для `DEVELOPMENT`, `SYSTEM`, `RELEASE`, значимой `INTEGRATION`, source cleanup, deployment и коммерческого digital-актива перед финальным отчётом обязательно пройти [`docs/ai/COMPLETION_GATE.md`](docs/ai/COMPLETION_GATE.md). Executor не является финальным судьёй: нужен независимый `DOKRUTI Completion Auditor`, immutable acceptance matrix, evidence по каждому критерию, consolidated fix и independent recheck. `FAIL`/`UNKNOWN` запрещают `VERIFIED`.

Финальные внешние статусы только: `VERIFIED`, `BLOCKED`, `OWNER DECISION REQUIRED`. Финальный отчёт содержит только фактически изменённое, evidence, реальный результат и blockers. Не писать «готово» без regression evidence и не выдавать гарантий поискового ranking/продаж.
