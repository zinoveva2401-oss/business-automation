# PROJECT_MAP

Статус: ACTIVE  
Проект: `Докрути`  
Назначение: минимальная карта репозитория для AI и технических исполнителей.

## 1. Главный принцип

Не читать весь репозиторий автоматически. Для текущего состояния бизнеса выше GitHub стоят прямые решения владельца и Google Sheet `Бизнес-система`.
GitHub хранит код, технические инструкции и синхронизированные копии устойчивых нормативных документов.

## 2. Карта

```text
business-automation/
├── AGENTS.md                         единый контракт AI
├── QWEN.md                           адаптер Qwen
├── README.md                         описание репозитория
├── src/                              SOURCE: сайт Astro
├── public/                           SOURCE: публичные ассеты
├── products/                         SOURCE: автономные продукты
├── paid-products/                    SOURCE: продуктовые спецификации/черновики
└── docs/
    ├── ai/                           AI-архитектура репозитория
    ├── project-knowledge/            синхронизированные устойчивые документы `Докрути`
    └── site/                         только актуальная site-документация после site-freeze
```

GENERATED / QA OUTPUT (`dist`, `.astro`, `qa-output`, `output`, preview-артефакты) не являются source of truth.

## 3. Канонические копии project knowledge

- `docs/project-knowledge/00-index.md` — маршрутизация базы и актуальность.
- `docs/project-knowledge/00-core.md` — стратегическое ядро.
- `docs/project-knowledge/01-about.md` — профиль Светланы.
- `docs/project-knowledge/02-brand-system.md` — бренд и верхний визуальный source of truth.
- `docs/project-knowledge/03-assets.md` — устойчивые активы.
- `docs/project-knowledge/04-product-map.md` — направления продуктового портфеля, без SKU/цен.
- `docs/project-knowledge/06-ai-automation-architecture.md` — AI/runtime/автоматизация.
- `docs/project-knowledge/08-product-design-system.md` — UX/качество цифровых продуктов.

Первичный актуальный профильный документ хранится в Google Drive; GitHub-копия должна синхронизироваться после подтверждённых изменений.

## 4. Сайт

Фактический source of truth кода сайта — текущая GitHub staging-ветка, подключённая к Timeweb, и её remote HEAD.

Во время `SITE-BRAND-001` старые `SITE_SOURCE_OF_TRUTH_v1.1.md`, `DESIGN_REFERENCE_v2.md` и ранние TASK-документы выведены из нормативного контура: они описывали прежнюю `Розницу в цифрах` и не должны направлять новый дизайн.

Пока новый сайт не прошёл staging QA, site-source = утверждённая активная задача/решения `Бизнес-системы` + фактический код.
После PASS должен быть создан/обновлён один актуальный site-source и только после этого считаться нормативным.

## 5. Контентные коллекции

- `src/content/articles/`
- `src/content/tools/`
- `src/content/services/`
- схема: `src/content.config.ts`

Текущие количества не фиксировать в документации — считать по фактической ветке.

## 6. Быстрый маршрут

| Задача | С чего начать |
|---|---|
| Текущий приоритет/статус | `Бизнес-система` |
| Бренд | `docs/project-knowledge/02-brand-system.md` |
| Профиль Светланы | `docs/project-knowledge/01-about.md` |
| Продуктовая стратегия | `docs/project-knowledge/04-product-map.md` |
| AI/runtime | `docs/project-knowledge/06-ai-automation-architecture.md` + `docs/ai/` |
| Сайт | активный handoff/task → фактическая staging-ветка → `src/` |
| Конкретный продукт | его фактический каталог / спецификация + актуальная `Бизнес-система` |

## 7. Запреты

Не использовать старое имя `Розница в цифрах`, retail-first, хаки/оливковый, старые прайсы, старые продуктовые очереди или старые site-reference как действующее правило только потому, что они сохранились в истории Git.
