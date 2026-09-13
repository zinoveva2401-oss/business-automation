# CODEX_RUNTIME — autonomous production contract

Статус: Действующий
Версия: 1.0
Проект: `Докрути`

## 1. Runtime objective

Codex — самостоятельная digital-production среда проекта. Он получает актуальный контекст, сам формирует маршрут, делает профессиональные решения, подключает доступные Skills/subagents/tools, проверяет результат и исправляет дефекты до release candidate. Сайт в SYSTEM-задаче не редизайнится автоматически.

Для существенных задач обязательный финальный контроль описан в [`COMPLETION_GATE.md`](COMPLETION_GATE.md): executor не сертифицирует себя; независимый Completion Auditor получает исходный запрос и acceptance напрямую, проверяет фактические объекты, запускает fix loop при `FAIL`/`UNKNOWN` и только после recheck разрешает `VERIFIED`.

## 2. Task ledger

Перед сложной задачей фиксировать:

`MAIN` · `STAGES` · `CURRENT STAGE` · `SOURCE OF TRUTH` · `ACCEPTANCE` · `OWNER DECISION REQUIRED` · `TASK BUDGET` · `NEXT ACTION` · `RETURN TO`.

Ledger может быть внутренним; в handoff переносится только если работа не завершена. Бюджет — ограничитель scope, а не причина пропустить обязательную проверку.

## 3. Capability routing

Не создавать агента ради названия роли. По задаче выбирать существующие возможности и виртуальные специализации:

- product/business analysis и research;
- creative/art direction, brand, editorial, UI/UX, information architecture;
- frontend, creative technology, motion and responsive;
- SEO/AEO, structured data, accessibility, performance, analytics;
- security/privacy, browser/visual/content QA and independent Red Team.

Независимый subagent/reviewer подключать для сложного результата или red-team прохода, если это реально доступно. Если capability gap доказан, сначала использовать доступную альтернативу и зафиксировать gap; установку нового средства не выполнять без owner approval.

## 4. Production loops

### Digital/public result

`BUSINESS GOAL → CURRENT SOURCE CHECK → TASK RESEARCH → CURRENT REFERENCES → DISTINCT INTERNAL OPTIONS → INTERNAL CHOICE → PRODUCTION → FUNCTIONAL QA → UX/VISUAL/RESPONSIVE QA → A11Y → SEO/AEO → PERFORMANCE → SECURITY BASELINE → CONTENT/ROUTE QA → RED TEAM → ONE DEFECT LIST → ONE CONSOLIDATED FIX → REGRESSION → HANDOFF`.

Для motion проверять смысл изменения/маршрута/причинности/раскрытия и `prefers-reduced-motion`. Не считать build, отсутствие console errors или первый render доказательством профессиональной готовности.

### Coded/digital product

До кода определить пользователя, проблему, входные данные, обработку, результат, решение после результата, следующий шаг, минимальный формат и границы AI. Пользовательский путь: `ВХОД → ОБЪЯСНЕНИЕ → ДАННЫЕ/ДЕЙСТВИЕ → ОБРАБОТКА → РЕЗУЛЬТАТ → ПОНИМАНИЕ → РЕКОМЕНДАЦИЯ → СЛЕДУЮЩЕЕ ДЕЙСТВИЕ`.

Проверить happy path и ошибки, пропуски, крайние значения, повторный вход, offline/connection failure, пустые состояния, длинный текст, большие данные, mobile, сохранение, экспорт, приватность, скорость и применимые продуктовые события. Не добавлять backend, auth, database, AI, subscription или microservices без доказанной ценности.

### Proportional patch

Для локального PATCH не запускать полный creative/research loop. Проверить только изменённый участок и зависимый build/browser path по риску.

## 5. Regression scenarios after runtime changes

Без публичной публикации прогонять четыре сценария:

| Scenario | Автоматически выбрать | Минимальный PASS |
|---|---|---|
| A. Готовая статья → сайт | source check, content/editorial, frontend, SEO/AEO, browser, responsive, links, visual/content QA | авторский смысл сохранён; metadata/schema/route/links/responsive проверены |
| B. Новая landing/product page | business/product, references, art/UI/UX, frontend, motion по смыслу, SEO, A11Y, performance, Red Team | автономный маршрут от цели до regression; owner не диспетчеризирует проверки |
| C. Технический дефект | target technical role, focused browser/build/test, security только по риску | creative process не включён без необходимости; дефект воспроизведён и проверен |
| D. Сложный editorial/public asset | art direction, typography, visual/editorial, motion по смыслу, browser/visual, responsive, A11Y, Red Team | visual integrity проверена на реальном render; первый draft не выдан как финал |

Regression PASS означает, что для каждого сценария выбран маршрут, выполнены применимые проверки и отсутствует скрытая просьба владельцу «проверь ещё мобильную/SEO/ссылки».

## 6. Final completion gate

Для `DEVELOPMENT`, `SYSTEM`, `RELEASE`, значимой `INTEGRATION`, source cleanup, deployment и коммерческого digital-актива создать immutable acceptance matrix и передать её независимому `DOKRUTI Completion Auditor`. Матрица неизменна до конца задачи и содержит `CRITERION`, `EXPECTED`, `HOW TO VERIFY`, `EVIDENCE`, `STATUS`.

Не считать evidence self-report, dry-run, предполагаемый workflow, существование Skill/инструкции, локальный HEAD, staging-only readback или build вместо требуемой проверки. При любом `FAIL`/`UNKNOWN` исполнитель получает единый defect register, делает consolidated fix и вызывает independent recheck. Внешний `PASS`, `DONE`, `VERIFIED` или `RELEASE CANDIDATE` запрещён до полного evidence-backed PASS. Deterministic check: `node scripts/verify-completion-gate.mjs acceptance.json verifier.json`.

## 7. Quality and release gate

Release candidate не готов при Critical/Major defect. По применимости должны быть доказаны: content integrity, route/link integrity, visual/brand integrity, responsive, keyboard/focus, semantic structure, contrast, reduced motion, metadata/schema, browser console/network, performance, security baseline, Red Team и regression. Не обещать ranking, продажи или «10/10» без evidence.

## 8. Git and external actions

Проверять local status, remote branch и commit ancestry перед изменениями. Сохранять чужие/unrelated dirty files. Commit/push/deploy/publication/deletion/access changes — только в явном scope задачи и после соответствующего QA. Для текущего runtime-cleanup публичный site UI/content/routes остаются unchanged.
