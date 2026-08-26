# PROJECT_MAP

Статус: Действующая карта репозитория
Проект: «Розница в цифрах»
Назначение: ориентир для AI-агентов и технических исполнителей

## 1. Структура репозитория

Каждый каталог помечен маркером достоверности:

- **SOURCE** — достоверный исходник; можно читать как источник истины.
- **GENERATED** — генерируется сборкой или инструментами; не читать как источник.
- **QA OUTPUT** — результат визуального QA или тестирования; не достоверно.
- **ARTIFACT** — артефакт разработки; может устареть.

```
business-automation/
├── AGENTS.md                      SOURCE    Единый контракт для AI-агентов
├── QWEN.md                        SOURCE    Адаптер Qwen Coder
├── README.md                      SOURCE    Описание проекта для людей
├── astro.config.mjs               SOURCE    Конфигурация Astro
├── package.json                   SOURCE    Зависимости и скрипты
├── tsconfig.json                  SOURCE    Конфигурация TypeScript
├── .gitignore                     SOURCE    Правила игнорирования Git
│
├── .qwen/                         SOURCE    Конфигурация Qwen Code
│   └── skills/
│       └── karpathy-guidelines/   SOURCE    Skill инженерной дисциплины
│
├── src/                           SOURCE    Исходный код сайта
│   ├── components/                SOURCE    Astro-компоненты
│   ├── content/                   SOURCE    Контентные коллекции
│   │   ├── articles/              SOURCE    Статьи (Markdown/MDX)
│   │   ├── tools/                 SOURCE    Цифровые инструменты (Markdown/MDX)
│   │   └── services/              SOURCE    Услуги (Markdown/MDX)
│   ├── layouts/                   SOURCE    Layout-шаблоны
│   ├── lib/                       SOURCE    Утилиты (TypeScript)
│   ├── pages/                     SOURCE    Страницы сайта
│   └── styles/                    SOURCE    Глобальные стили
│
├── public/                        SOURCE    Статические ассеты (изображения, favicon)
│
├── products/                      SOURCE    Автономные HTML-продукты
│
├── paid-products/                 SOURCE    Спецификации будущих продуктов
│
├── docs/
│   ├── ai/                        SOURCE    AI-архитектура (этот домен)
│   ├── project-knowledge/         SOURCE    Бизнес-документация
│   └── site/                      SOURCE    Документация сайта
│
├── dist/                          GENERATED Результат сборки Astro
├── .astro/                        GENERATED Кэш Astro
├── node_modules/                  GENERATED Зависимости npm
├── site-static-preview/           GENERATED Статический превью сайта
├── qa-output/                     QA OUTPUT Скриншоты визуального QA
├── output/                        QA OUTPUT Результаты Playwright
└── .playwright-cli/               ARTIFACT Конфигурация Playwright
```

## 2. Утверждённые решения

| Решение | Зафиксировано | Дата |
|---|---|---|
| Позиционирование сайта | docs/site/SITE_SOURCE_OF_TRUTH_v1.1.md | 2026 |
| Визуальная система главной | docs/site/DESIGN_REFERENCE_v2.md | 2026 |
| Технический стек (Astro) | docs/site/SITE_SOURCE_OF_TRUTH_v1.1.md §14 | 2026 |
| Архитектура URL | docs/site/SITE_SOURCE_OF_TRUTH_v1.1.md §5 | 2026 |
| Дизайн-токены (цвета) | docs/site/DESIGN_REFERENCE_v2.md §3 | 2026 |
| Контентные коллекции | src/content.config.ts | 2026 |
| Бренд-система 2026-2029 | docs/project-knowledge/02-brand-system.md | 2026 |
| Продуктовая карта | docs/project-knowledge/04-product-map-and-automation-system.md | 2026 |

## 3. Контентные коллекции

| Коллекция | Путь | Тип | Схема |
|---|---|---|---|
| articles | src/content/articles/ | Markdown/MDX | src/content.config.ts |
| tools | src/content/tools/ | Markdown/MDX | src/content.config.ts |
| services | src/content/services/ | Markdown/MDX | src/content.config.ts |

Текущее количество элементов не фиксируется в этом документе.
Для получения актуального счётчика используйте `npm run build` или glob по соответствующему каталогу.

### 3.1. Быстрый выбор домена

| Нужно изменить или проверить | Начать с |
|---|---|
| Сайт и его страницы | docs/site/SITE_SOURCE_OF_TRUTH_v1.1.md, затем src/ |
| Контент сайта | src/content/, схема src/content.config.ts |
| Автономный цифровой продукт | products/ |
| Будущий продукт или спецификация | paid-products/ |
| Бренд, продукт, контент, автоматизация | docs/project-knowledge/ |
| AI-процесс или передача задачи | docs/ai/ |

## 4. Заблокированные файлы и решения

Без утверждения владельца нельзя изменять:

- `docs/site/SITE_SOURCE_OF_TRUTH_v1.1.md` — источник истины сайта.
- `docs/site/DESIGN_REFERENCE_v2.md` — утверждённый визуальный контракт.
- `docs/project-knowledge/` — бизнес-документация.
- `src/content.config.ts` — схема контентных коллекций.
- `astro.config.mjs` — конфигурация сборки.

## 5. Активные задачи

| Задача | Файл | Статус |
|---|---|---|
| Аудит репозитория | docs/site/TASK_01_REPOSITORY_AUDIT.md | Выполнена |
| Фундамент Astro | docs/site/TASK_02_ASTRO_FOUNDATION.md | Выполнена |

Активный handoff: docs/ai/handoffs/ACTIVE_HANDOFF.md (если существует). Его содержимое имеет приоритет над повторным исследованием задачи.

## 6. Бизнес-домены

| Домен | Расположение | Источник истины |
|---|---|---|
| Сайт | docs/site/ | docs/site/SITE_SOURCE_OF_TRUTH_v1.1.md |
| Бренд | docs/project-knowledge/ | docs/project-knowledge/02-brand-system.md |
| Продукты | docs/project-knowledge/ | docs/project-knowledge/04-product-map-and-automation-system.md |
| Контент и площадки | docs/project-knowledge/ | docs/project-knowledge/03-assets-and-content-system.md |
| Профиль эксперта | docs/project-knowledge/ | docs/project-knowledge/01-master-profile.md |
