# business-automation

Репозиторий проекта `Докрути`: implementation workspace для сайта, цифровых продуктов, контента и производственных инструментов.

Актуальный бизнес-контекст, бренд, оперативные задачи, цены, SKU, решения и статусы живут в канонических Google Drive/Sheets источниках. Их read-only маршрут описан в [`docs/ai/SOURCE_MANIFEST.md`](docs/ai/SOURCE_MANIFEST.md). Репозиторий не является второй Business OS и не должен вручную поддерживать конкурирующую бизнес-базу.

## Структура

- `src/`, `public/` — публичный Astro-сайт и его реализация.
- `products/`, `paid-products/` — цифровые продукты и их производственные материалы.
- `docs/ai/` — контракт Codex, runtime, source manifest, capability snapshot и handoff.
- `docs/ARTICLE_IMPORT.md`, `docs/PRODUCT_EXECUTION.md` — активные production-регламенты.
- `docs/project-knowledge/`, `docs/site/` — исторические/reference-копии; они не отменяют live Drive и не используются как текущая бизнес-истина.

## Для AI-исполнителей

Начать с [`AGENTS.md`](AGENTS.md), затем выбрать маршрут через [`docs/ai/PROJECT_MAP.md`](docs/ai/PROJECT_MAP.md). Для существенной задачи Codex сам выбирает нужные роли, Skills/tools, QA и regression. `DONE != VERIFIED`.
