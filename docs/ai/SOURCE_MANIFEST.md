# SOURCE_MANIFEST — live context for Codex

Статус: Действующий runtime-контракт
Версия: 1.0
Проект: `Докрути`
Последняя live-проверка этого manifest: 13.09.2026 (Europe/Moscow)

Этот файл хранит маршрутизацию, а не копию бизнес-логики. Google Drive/Sheets — canonical. GitHub и локальный репозиторий не имеют права отменять более новое подтверждённое live-состояние.

## 1. Порядок чтения

1. Прямое решение владельца в текущем запросе.
2. `Бизнес-система` → `00_ШТАБ` для цели, этапа, blocker, приоритетов и `NEXT ACTION`.
3. `Бизнес-система` → релевантные открытые/непроверенные строки `02_РАБОТА`.
4. `Бизнес-система` → последние применимые решения `06_РЕШЕНИЯ`.
5. Для сайта — применимые строки `10_САЙТ_ТЕХКОНТУР`.
6. Для исследования/дизайна — при необходимости `11_КОНКУРЕНТЫ_И_РЕФЕРЕНСЫ`.
7. Долгоживущий профильный документ из таблицы ниже.
8. Реализация в репозитории.

Не читать всю таблицу или все документы автоматически. Выбирать только нужные вкладки/диапазоны/документы.

## 2. Canonical sources

### Оперативный control center

- Name: `Бизнес-система`
- URL: <https://docs.google.com/spreadsheets/d/1RQVqOiyUxtuI9LnISz0BR31RZYvULz0gzE6-DzlFZz4>
- Role: current state, work queue, decisions, site technical contour, references.
- Access: read-only for Codex unless a separate owner-authorized write is explicitly required.
- Verified: native Google Sheet is reachable; tabs `00_ШТАБ`, `02_РАБОТА`, `06_РЕШЕНИЯ`, `10_САЙТ_ТЕХКОНТУР`, `11_КОНКУРЕНТЫ_И_РЕФЕРЕНСЫ` exist.

### Long-lived sources

| Source | URL | Responsibility | Live status verified 13.09.2026 |
|---|---|---|---|
| `00_Индекс_базы_знаний` | <https://docs.google.com/document/d/1sXAY7GodT5QhXbTfHJcB7dqHHz3qpjkQbKgWuWQ6CP4> | source navigation and freshness rules | v6.3 · 13.09.2026 · Действующий маршрут |
| `00_Ядро_проекта` | <https://docs.google.com/document/d/1e_imsI3iE6oWAIjuHccdeYOWetWOQDGrANYk7kDWeCQ> | durable project/business principles | v7.1 · 11.09.2026 · Действующее ядро |
| `01_Обо_мне` | <https://docs.google.com/document/d/1ti-bGXDH-RM6QVwTGkhqeZlihgJGbKPJWqXeKLVgZmI> | confirmed professional profile | v4.1 · 11.09.2026 · Действующий профиль |
| `02_Бренд-система` | <https://docs.google.com/document/d/1gO7OUFD1SmzCblHnYsV7o9Ig3xq8AL9PX3UGA6WmRns> | master brand, visual and public identity | v8.2 · 11.09.2026 · Действующий brand source |
| `03_Активы_проекта` | <https://docs.google.com/document/d/1jcwgB98OBJXI1Ou8z_7JKjjJVcr946d_cnEDrKVsMXo> | durable asset register and ownership | v6.3 · 13.09.2026 · Действующий реестр |
| `04_Продуктовая_карта` | <https://docs.google.com/document/d/1O2BQZDk3v3pTR0YL_24o6e1wVghq6Tyfbp9GrRSi61s> | durable product direction, not current SKU/pricing | v7.1 · 11.09.2026 · Действующая карта |
| `06_Архитектура_ИИ_и_автоматизации` | <https://docs.google.com/document/d/10d88hXh7ZHvWMFB1fKpWpBTSQzT3ndl_bd2EAFsd_ow> | AI routing, automation, QA and handoff principles | v6.3 · 13.09.2026 · Действующая архитектура |
| `08_Дизайн-система_продуктов` | <https://docs.google.com/document/d/11bQQUhTV69F9NyEfs2WI4h_YqLieuNjMWRaxQWFkXio> | product UX/visual system after product-format choice | v5.2 · 13.09.2026 · Действующая система |

## 3. Freshness gate

Before applying a source, read its current header/metadata and record `Version`, `Date`, `Status` in the task ledger. If the current document no longer matches this manifest, update the manifest only as a routing-contract change; do not copy business contents into Git.

If sources disagree, prefer the newest confirmed direct decision, then the operational sheet, then the relevant durable document. A historical repo snapshot is never an override.

## 4. Unavailable live source

1. Retry the same read only when the connector reports a transient error.
2. If authentication is the only blocker, stop at one owner-auth gate and request one concrete action: authorize the existing Google Drive connector, then resume.
3. If direct access is technically unavailable after the gate, use only an explicitly generated one-way snapshot. It must contain source URL, fetched-at timestamp, version/date/status, hash, and `GENERATED / NON-CANONICAL / DO NOT EDIT`.
4. Never store passwords, OAuth tokens, API secrets or a manually maintained competing Business OS in Git.
5. When a known conflict exists, do not use an older snapshot silently; report `UNKNOWN` or `BLOCKED`.

## 5. Repository rule

The files under `docs/project-knowledge/` and `docs/site/` are retained as `HISTORICAL SAFE` references only. They are not active retrieval sources and cannot override this manifest or current Drive content. No generated snapshot is currently required because the authenticated read-only Drive route passed in this session.
