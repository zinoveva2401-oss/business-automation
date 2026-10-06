---
name: dokruti-content-production
description: "Единый front door полного цикла Content Factory DOKRUTI: актуальные источники, стратегия, master, native channel adaptations, права, QA, публикация и обучение."
---
# DOKRUTI Content Factory Core

Этот существующий canonical skill — единственная входная точка существенной контентной работы DOKRUTI. Он исполняет доменные контуры shared Business OS и не создаёт параллельный источник состояния.

## Порядок работы
1. Восстанови задачу из прямого запроса владельца. Через docs/ai/SOURCE_MANIFEST.md прочитай только применимые текущие строки «Бизнес-система» и вкладки «Контент-система | DOKRUTI | 2026»; добавь связанные брендовые, продуктовые, коммерческие и правовые источники. Repo хранит процессы, но не live-очередь, цены, статусы, личные данные или credentials.
2. Начни с [маршрутизации по глубоким Business OS references](references/business-os-routing.md); локальные файлы этой папки — execution contracts, а доменная экспертиза остаётся в shared Business OS. Выбери применимые lanes; для живого спроса см. [demand-intake.md](references/demand-intake.md). Для меняющихся трендов, platform mechanics, SERP, конкурентов, закона/API проведи датированное исследование.
3. Создай один master: аудитория, задача, тезис, доказательства, payoff, next action. Продумай hook/story через hooks-story.md, создай форматный master и отредактируй через human-editor.md.
4. Подключай только нужные контуры: art.md, video.md, seo-aeo.md, affiliate.md, legal-ip.md. Affiliate всегда проходит research, disclosure/legal и QA.
5. Для каждого канала создай самостоятельную версию по channels.md и профилю в references/channels/; не копируй master дословно.
6. Примени publishing.md, owner-gates.md, content-qa.md, qa.md. Черновик и send response не подтверждают публикацию: нужен platform readback.
7. После значимой стадии сохрани checkpoint через persistence contract в существующую Content System согласно state-recovery.md. In-memory state не является recovery. После сбоя выбери последний валидный доказанный checkpoint до текущей стадии; неоднозначный внешний side effect сначала сверяй, чтобы избежать дубля.
8. Свежие метрики и обучение обработай в analytics.md; при отсутствии write access укажи PENDING WRITE-BACK.

## Маршруты
- Обычный пост: strategy → research по необходимости → hook/master → editor → channel profile → QA.
- Тренд: trend scout → fact check → strategy → brief → нужный production lane.
- Видео: strategy/research → story → pre-production → ingest/paper edit → first cut → critic/revision → playable second cut. Capability не доказывает качество экспорта.
- SEO/AEO: intent/SERP research → brief → master → editor/claims → renderer QA.
- Affiliate/commerce: audience need → evidence/alternatives → legal/disclosure → owner gate по необходимости → native draft → QA.
- Publishing/analytics: проверяй capability, полномочия, privacy, idempotency и live readback.

## Факты и контракты
Приоритет: direct owner intent → live Business System/Drive → свежие первичные внешние источники → approved master → channel adaptation → historical material. Для меняющегося факта храни source/date. UNKNOWN нельзя утверждать как факт. Не придумывай аудиторию, личный опыт и voice владельца.

Машинные сущности описаны JSON Schema Draft 2020-12 в schemas/ и проверяются валидными/невалидными fixtures реальным schema validator. Runtime runtime/content-factory-runtime.mjs проверяет lanes, state transitions, scope-aware owner authorization и checkpoint integrity; content-system-state-store.mjs задаёт verified writeback/readback в существующее поле Content System. Запуск: `node --test .agents/skills/dokruti-content-production/tests/*.test.mjs`.

## Модули
Business OS ownership: business-os-routing.md. Demand: demand-intake.md. Marketing marketing.md; Strategy strategy.md; Trend trend.md; Research research.md; Human Editor human-editor.md; Hooks hooks-story.md; Art art.md; Video video.md; SEO/AEO seo-aeo.md; Affiliate affiliate.md; Channels channels.md; Publishing publishing.md; Analytics analytics.md; Legal/IP legal-ip.md; Recovery state-recovery.md; Owner Gates owner-gates.md; QA qa.md и content-qa.md; branch handoff — integration-hygiene.md.

Обязательны source restore, state/factual integrity и общий QA; запускай только соответствующие production lanes. В конфликте приоритет у владельца и live canonical. Недоступный источник = UNKNOWN, неподтверждённая запись = PENDING WRITE-BACK.

## Параллельные каналы и видео (fresh preflight 2026-10-06)
Для текущих доказательств доступов MAX, VK, Дзена, vc.ru и Instagram используй `references/channels/capability-preflight-2026-10-06.md`. Текущая video production-процедура исполняется через `runtime/video-production-pipeline.mjs`; она строит plan из approved master, запрашивает owner footage только при обязательности и не выдаёт draft за export/publication.