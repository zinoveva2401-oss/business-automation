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
├── products/, paid-products/         SOURCE / digital products
├── docs/ai/                           SOURCE / Codex runtime
│   ├── SOURCE_MANIFEST.md             LIVE CANONICAL routing contract
│   ├── CODEX_RUNTIME.md               autonomous production contract
│   ├── AI_CAPABILITIES.md             time-stamped capability snapshot
│   └── HANDOFF_PROTOCOL.md            handoff contract
├── docs/ARTICLE_IMPORT.md             SOURCE / active article pipeline
├── docs/PRODUCT_EXECUTION.md          SOURCE / active product pipeline
├── .agents/skills/                     SOURCE / scoped execution skills
│   ├── dokruti-web-design/             substantial web/design production
│   ├── dokruti-product-production/     substantial product/service production
│   └── dokruti-content-production/     substantial content/channel production
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
| Новый сложный продукт | `docs/PRODUCT_EXECUTION.md` → live Product/Design source → product files |
| Сайт | live `10_САЙТ_ТЕХКОНТУР` + target implementation; legacy `docs/site/` only as reference |
| Существенный web/design | `.agents/skills/dokruti-web-design/SKILL.md` → live Site Matrix → browser QA → review |
| Существенный product/service | `.agents/skills/dokruti-product-production/SKILL.md` → live COMM-ARCH/Product sources → product QA |
| Существенный content/channel | `.agents/skills/dokruti-content-production/SKILL.md` → live Content System → editorial/channel QA |
| Бизнес/бренд/продукты | live Drive source manifest; no historical repo copy as override |

## 4. Правила чтения

`PROJECT_MAP.md` не читается автоматически для простого PATCH. `ACTIVE_HANDOFF.md` читается только при продолжении совпадающей задачи. Не использовать `dist/`, `.astro/`, `node_modules/`, `output/`, `qa-output/`, логи и временные файлы как источники требований.

Historical/reference directories сохраняются для traceability, но active instructions не должны ссылаться на них как на текущую бизнес-, бренд- или ценовую истину.
