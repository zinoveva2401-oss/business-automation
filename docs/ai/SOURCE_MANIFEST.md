# SOURCE_MANIFEST — live context for Codex

Статус: Действующий runtime-контракт
Версия: 1.0
Проект: `Докрути`
Последняя live-проверка этого manifest: 23.09.2026 (Europe/Moscow)

Этот файл хранит маршрутизацию, а не копию бизнес-логики. Google Drive/Sheets — canonical. GitHub и локальный репозиторий не имеют права отменять более новое подтверждённое live-состояние.

## 1. Порядок чтения

1. Прямое решение владельца в текущем запросе.
2. `Бизнес-система` → `00_ШТАБ` для цели, этапа, blocker, приоритетов и `NEXT ACTION`.
3. `Бизнес-система` → релевантные открытые/непроверенные строки `02_РАБОТА`.
4. `Бизнес-система` → последние применимые решения `06_РЕШЕНИЯ`.
5. Для сайта — применимые строки `10_САЙТ_ТЕХКОНТУР` и `12_САЙТ_МАТРИЦА`.
6. Для стратегии/денег — применимые строки `08_СТРАТЕГИЯ`.
7. Для исследования/дизайна — при необходимости `11_КОНКУРЕНТЫ_И_РЕФЕРЕНСЫ`.
8. Для коммерческого маршрута — `COMM-ARCH-001 | Коммерческая архитектура | MASTER`.
9. Для контента — `Контент-система | DOKRUTI | 2026`.
10. Долговременный источник по точному названию через авторизованный Google Drive connector.
11. Реализация в репозитории.

Не читать всю таблицу или все документы автоматически. Выбирать только нужные вкладки/диапазоны/документы.

## 2. Canonical sources

### Оперативный control center

- Name: `Бизнес-система`
- Role: current state, work queue, decisions, site technical contour, references.
- Access: read-only for Codex unless a separate owner-authorized write is explicitly required.
- Lookup: use the authorized Google Drive/Sheets connector and the exact source name `Бизнес-система`.
- Verified 23.09.2026: the authorized connector exposes tabs `00_ШТАБ`, `02_РАБОТА`, `06_РЕШЕНИЯ`, `08_СТРАТЕГИЯ`, `10_САЙТ_ТЕХКОНТУР`, and `12_САЙТ_МАТРИЦА`. `00_ШТАБ` identifies the active system task as AI-PRODUCTION-SKILLS-001 and says the commercial architecture is frozen; `10_САЙТ_ТЕХКОНТУР` remains the publication/runtime contract.

### Long-lived sources

| Source name | Responsibility | Lookup rule |
|---|---|---|
| `00_Индекс_базы_знаний` | source navigation and freshness rules | exact name via authorized Google Drive connector |
| `00_Ядро_проекта` | durable project/business principles | exact name via authorized Google Drive connector |
| `01_Обо_мне` | confirmed professional profile | exact name via authorized Google Drive connector |
| `02_Бренд-система` | master brand, visual and public identity | exact name via authorized Google Drive connector |
| `03_Активы_проекта` | durable asset register and ownership | exact name via authorized Google Drive connector |
| `04_Продуктовая_карта` | durable product direction, not current SKU/pricing | exact name via authorized Google Drive connector |
| `06_Архитектура_ИИ_и_автоматизации` | AI routing, automation, QA and handoff principles | exact name via authorized Google Drive connector |
| `08_Дизайн-система_продуктов` | product UX/visual system after product-format choice | exact name via authorized Google Drive connector |
| `COMM-ARCH-001 | Коммерческая архитектура | MASTER` | frozen commercial architecture, eight money routes, pain-first and NPD/legal gates | exact name via authorized Google Drive connector; recheck dynamic terms before activation |
| `Контент-система | DOKRUTI | 2026` | content matrix, master-first production, channels, rights and measurable next step | exact name via authorized Google Drive connector; read only relevant tabs/ranges |

## 3. Freshness gate

Before applying a source, read its current header/metadata and record `Version`, `Date`, `Status` in the task ledger. If the current document no longer matches this manifest, update the manifest only as a routing-contract change; do not copy business contents into Git.

If sources disagree, prefer the newest confirmed direct decision, then the operational sheet, then the relevant durable document. A historical repo snapshot is never an override.

## 4. Unavailable live source

1. Retry the same read only when the connector reports a transient error.
2. If authentication is the only blocker, stop at one owner-auth gate and request one concrete action: authorize the existing Google Drive connector, then resume.
3. If direct access is technically unavailable after the gate, report the source as unavailable; do not place private URLs, IDs, or source contents in the public repository.
4. Never store passwords, OAuth tokens, API secrets or a manually maintained competing Business OS in Git.
5. When a known conflict exists, do not use an older snapshot silently; report `UNKNOWN` or `BLOCKED`.

## 5. Repository rule

The public repository stores routing and execution contracts only. It does not store private source URLs or IDs, personal/commercial source contents, or historical project snapshots. Live sources are located by exact name through the authorized Google Drive/Sheets connector.
