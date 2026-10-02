# PROJECT_MAP

Статус: Действующий
Версия: 3.0
Проект: `Докрути`

Карта implementation workspace. Она не хранит текущие цены, SKU, очереди, статусы и решения владельца.

## 1. Маркеры достоверности

- `SOURCE` — исходник реализации или действующий runtime-контракт.
- `LIVE CANONICAL` — источник Google Drive/Sheets, читаемый через `SOURCE_MANIFEST.md`.
- `GENERATED / NON-CANONICAL` — односторонняя копия с URL, датой и version/status; не редактировать вручную.
- `HISTORICAL SAFE` — архив/reference, не участвующий в active retrieval.
- `QA OUTPUT` / `ARTIFACT` — результат проверки или временный материал.

## 2. Структура

```text
business-automation/
├── AGENTS.md, QWEN.md, README.md     SOURCE / active contract
├── src/, public/                      SOURCE / public site implementation
├── products/                          SOURCE / format-neutral Product Factory
├── docs/ai/                           SOURCE / Codex runtime
│   ├── SOURCE_MANIFEST.md             LIVE CANONICAL routing contract
│   ├── CODEX_RUNTIME.md               autonomous production contract
│   ├── CAPABILITY_REGISTRY.md         current tools, fallbacks and access evidence
│   ├── AI_CAPABILITIES.md             historical capability snapshot
│   └── HANDOFF_PROTOCOL.md            handoff contract
├── docs/ARTICLE_IMPORT.md             SOURCE / active article pipeline
├── docs/PRODUCT_EXECUTION.md          SOURCE / active product pipeline
├── .agents/skills/                     SOURCE / scoped execution skills
│   ├── ai-business-os/                 shared Business OS Core, current release from verified r9 lineage
│   ├── dokruti-web-design/             substantial web/design production
│   ├── dokruti-product-production/     complementary executor procedures only
│   └── dokruti-content-production/     substantial content/channel production
├── products/AGENTS.md                  Product Factory local execution overlay
├── docs/project-knowledge/            HISTORICAL SAFE / non-canonical snapshots
├── docs/site/                         HISTORICAL SAFE / legacy site references
├── dist/, .astro/, node_modules/      GENERATED
├── output/, qa-output/                QA OUTPUT
└── .playwright-*, .tmp_*              ARTIFACT
```

## 3. Быстрые маршруты

| Задача | Начать с |
|---|---|
| AI/runtime/source/handoff | `AGENTS.md` → `docs/ai/` |
| Готовая статья | `docs/ARTICLE_IMPORT.md` → target renderer/content |
| Готовый цифровой продукт | `docs/PRODUCT_EXECUTION.md` → product passport/target |
| Новый сложный продукт | shared Core `references/product-factory.md` → `products/AGENTS.md` → live Product/Design source → product files |
| Сайт | live `10_САЙТ_ТЕХКОНТУР` + target implementation; legacy `docs/site/` only as reference |
| Существенный web/design | `.agents/skills/dokruti-web-design/SKILL.md` → live Site Matrix → browser QA → review |
| Существенный product/service | `.agents/skills/ai-business-os/references/product-factory.md` → `products/AGENTS.md` → relevant executor procedures → live Product/Design sources → product QA |
| Существенный content/channel | `.agents/skills/dokruti-content-production/SKILL.md` → live Content System → editorial/channel QA |
| Бизнес/бренд/продукты | live Drive source manifest; no historical repo copy as override |

## 4. Правила чтения

`PROJECT_MAP.md` не читается автоматически для простого PATCH. `ACTIVE_HANDOFF.md` читается только при продолжении совпадающей задачи. Не использовать `dist/`, `.astro/`, `node_modules/`, `output/`, `qa-output/`, логи и временные файлы как источники требований.

The shared Business OS is canonical for strategy, source routing, product roles and quality contracts. Domain overlays may add execution steps only. `DOKRUTI_INTERNAL` and future `CLIENT_WORK` use separate project state, brand/data/files and access boundaries while reusing the shared Core.

Historical/reference directories сохраняются для traceability, но active instructions не должны ссылаться на них как на текущую бизнес-, бренд- или ценовую истину.
