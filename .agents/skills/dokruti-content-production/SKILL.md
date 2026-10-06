---
name: dokruti-content-production
description: Единый front door полного цикла Content Factory DOKRUTI: актуальные источники, стратегия, master, native channel adaptations, права, QA, публикация и обучение.
---
# DOKRUTI Content Factory Core

Этот существующий canonical skill — единственная входная точка существенной контентной работы DOKRUTI. Он исполняет доменные контуры shared Business OS и не создаёт параллельный источник состояния.

## Порядок работы
1. Восстанови задачу из прямого запроса владельца. Через docs/ai/SOURCE_MANIFEST.md прочитай только применимые текущие строки «Бизнес-система» и вкладки «Контент-система | DOKRUTI | 2026»; добавь связанные брендовые, продуктовые, коммерческие и правовые источники. Repo хранит процессы, но не live-очередь, цены, статусы, личные данные или credentials.
2. Выбери маршрут в references/strategy.md и marketing.md. Для меняющихся трендов, platform mechanics, SERP, конкурентов, закона/API проведи датированное исследование в trend.md и research.md; не запускай нерелевантные lanes.
3. Создай один master: аудитория, задача, тезис, доказательства, payoff, next action. Продумай hook/story через hooks-story.md, создай форматный master и отредактируй через human-editor.md.
4. Подключай только нужные контуры: art.md, video.md, seo-aeo.md, affiliate.md, legal-ip.md. Affiliate всегда проходит research, disclosure/legal и QA.
5. Для каждого канала создай самостоятельную версию по channels.md и профилю в references/channels/; не копируй master дословно.
6. Примени publishing.md, owner-gates.md, content-qa.md, qa.md. Черновик и send response не подтверждают публикацию: нужен platform readback.
7. После значимой стадии сохрани checkpoint согласно state-recovery.md. После сбоя возобновляйся с последнего доказанного checkpoint; неоднозначный внешний side effect сначала сверяй, чтобы избежать дубля.
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

Восемь сущностей описаны JSON Schema Draft 2020-12 в schemas/. Pure runtime runtime/content-factory-runtime.mjs проверяет lanes, state transitions, checkpoints/resume, owner gates и source freshness без зависимостей. Запуск тестов: node --test .agents/skills/dokruti-content-production/tests/*.test.mjs.

## Модули
Marketing marketing.md; Strategy strategy.md; Trend trend.md; Research research.md; Human Editor human-editor.md; Hooks hooks-story.md; Art art.md; Video video.md; SEO/AEO seo-aeo.md; Affiliate affiliate.md; Channels channels.md; Publishing publishing.md; Analytics analytics.md; Legal/IP legal-ip.md; Recovery state-recovery.md; Owner Gates owner-gates.md; QA qa.md и content-qa.md.

Обязательны source restore, state/factual integrity и общий QA; запускай только соответствующие production lanes. В конфликте приоритет у владельца и live canonical. Недоступный источник = UNKNOWN, неподтверждённая запись = PENDING WRITE-BACK.
