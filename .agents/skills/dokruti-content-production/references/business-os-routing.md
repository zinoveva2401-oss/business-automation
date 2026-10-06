# Владение глубокой логикой и execution contracts

Локальные Content Factory references описывают входы, выходы, evidence, handoff и блокировки исполнения. Они не переписывают доменную экспертизу shared Business OS. Перед содержательной работой прочитай канонический модуль по нужной роли и применяй его правила; при расхождении с локальным contract остановись на конфликте источников и восстанови актуальный approved contract.

| Content Factory lane | Глубокий владелец в `ai-business-os/references/` | Локальный execution contract |
| --- | --- | --- |
| Marketing / стратегия / портфель целей | `strategic-intelligence-opportunity.md`, `growth-distribution.md`, `growth-execution-operating-system.md` | `marketing.md`, `strategy.md` |
| Creative / hooks / story / Human Editor | `creative-content-production.md`, `editorial-reader-experience.md`, `channel-experience-packaging.md` | `hooks-story.md`, `human-editor.md`, `content-qa.md` |
| Owner approval → publication transaction | `content-owner-transaction.md`, `production-dispatcher-runtime.md`, `business-system-state-contract.md` | `owner-gates.md`, `publishing.md`, `state-recovery.md` |
| Creator mix / human presence | `content-personality-creator-mix.md`, `creative-content-production.md` | `human-editor.md`, `channels.md` |
| Analytics / metric learning | `experiments-analytics.md`, `growth-distribution.md`, `business-system-state-contract.md` | `analytics.md` |
| Trend / platform signals | `platform-intelligence-operations.md`, `growth-distribution.md`, `strategic-intelligence-opportunity.md` | `trend.md`, `research.md` |
| Research / competitive evidence | `research-competitive-intelligence.md`, `strategic-intelligence-opportunity.md` | `research.md` |
| Art / video / media QA | `creative-content-production.md`, `media-production-quality.md` | `art.md`, `video.md`, `qa.md` |
| Affiliate / rights / commercial claim | `legal-accounting-ip-ru.md`, `content-owner-transaction.md`, `product-factory.md` | `affiliate.md`, `legal-ip.md`, `owner-gates.md` |
| Product demand handoff | `knowledge-capital-product-mining.md`, `product-factory.md` | `demand-intake.md`, then existing Product Factory route |

Load only relevant Business OS modules. Never copy live priorities, current prices, queues, owner data or credentials into this skill. Channel profiles state the required capability evidence and writeback mapping; they do not imply that an API is available or authorize posting.

## Portfolio isolation

Each run binds `portfolio_id`, `brand_id`, `audience_id` and `source_set_id`. Current DOKRUTI defaults are identifiers, not permission to join other portfolios. A different creator or client portfolio needs its own audience, source set, channels, monetization and analytics scope. Do not mix signals or attribution across portfolios unless an explicit owner-approved analysis says to.

## Objective balance

Every run records one primary objective and can name secondary objectives in its source record. Supported primary objectives cover cold reach, followers, trust, awareness, engagement, platform monetization, affiliate revenue, product demand, service demand, SEO/search, market pain, incoming requests and demonstrated expertise. Objective is a measurement target, not permission to force a sales CTA. Select format and role from live evidence and preserve a balanced portfolio over time.
