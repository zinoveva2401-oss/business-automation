# CODEX_RUNTIME — autonomous production contract

Статус: Действующий
Версия: 1.0
Проект: `Докрути`

## 1. Runtime objective

Codex — самостоятельная digital-production среда проекта. Он получает актуальный контекст, сам формирует маршрут, делает профессиональные решения, подключает доступные Skills/subagents/tools, проверяет результат и исправляет дефекты до release candidate. Сайт в SYSTEM-задаче не редизайнится автоматически.

Для существенных задач обязательный финальный контроль описан в [`COMPLETION_GATE.md`](COMPLETION_GATE.md): executor не сертифицирует себя; независимый Completion Auditor получает исходный запрос и acceptance напрямую, проверяет фактические объекты, запускает fix loop при `FAIL`/`UNKNOWN` и только после recheck разрешает `VERIFIED`.

## 1.1 Executable lifecycle

`INTAKE → SOURCE RESTORE → CAPABILITY PREFLIGHT → WEAK-SPEC REVIEW → PLAN → IMPLEMENT → PROFILE QA → REAL RESULT → SELF-QA → RED TEAM → FIX → REGRESSION → DELIVERY IF TRACKED DELTA AND NOT READ-ONLY (COMMIT → PUSH → REMOTE READBACK → SHA MATCH) → INDEPENDENT COMPLETION AUDITOR → READY FOR BUSINESS OS QA`

`ONE RUN → ONE PERSISTENT CHAT → ONE CANONICAL WORKING BRANCH`. Новый chat/branch/worktree/PR допускается только при технической необходимости, исчерпанном контексте или требуемой независимости; смена chat требует checkpoint/handoff. `PUSH != merge`: merge/deploy/publication остаются отдельным разрешённым этапом.

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

Независимый subagent/reviewer подключать для сложного результата или red-team прохода, если это реально доступно. До производства зафиксировать capability preflight, missing inputs и QA route. Если acceptance требует capability, которого нет, `STOP BEFORE PRODUCTION`; установку нового средства не выполнять без owner approval и слабую замену не выдавать за эквивалент.

## 3.1 Weak-spec review

До реализации проверить противоречия ТЗ, отделить `OWNER INTENT` от ошибочного method, зафиксировать frozen constraints и выбрать более сильный technical route. Frozen business/product/brand/commercial/legal решения не менять самостоятельно.

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

## 5.1 Recovery and checkpoint protocol

До изменений сохранить минимальные recovery evidence: один dirty-state diff/patch, список untracked и SHA256. Не делать полную копию repository. Для длинного RUN после каждой существенной стадии фиксировать `CURRENT STAGE`, `DONE`, `EVIDENCE`, `NEXT EXACT ACTION`, `RETURN TO`; уникальные dirty/untracked изменения не интегрировать без scope.

## 6. Final completion gate

Для `DEVELOPMENT`, `SYSTEM`, `RELEASE`, значимой `INTEGRATION`, source cleanup, deployment и коммерческого digital-актива создать immutable acceptance matrix и передать её независимому `DOKRUTI Completion Auditor`. Матрица неизменна до конца задачи и содержит `CRITERION`, `EXPECTED`, `HOW TO VERIFY`, `EVIDENCE`, `STATUS`.

Не считать evidence self-report, dry-run, предполагаемый workflow, существование Skill/инструкции, локальный HEAD, staging-only readback или build вместо требуемой проверки. При любом `FAIL`/`UNKNOWN` исполнитель получает единый defect register, делает consolidated fix и вызывает independent recheck. Внешний `PASS`, `DONE`, `VERIFIED` или `RELEASE CANDIDATE` запрещён до полного evidence-backed PASS. Deterministic check: `node scripts/verify-completion-gate.mjs acceptance.json verifier.json`.

Для технического Second Brain JSON-флаги из собственного fixture не являются evidence: `PASS`, `true`, `meaningful`, `decision_useful`, выбранный ответ и заранее вписанные bytes должны быть заменены на `INPUT → REAL EXECUTION → OUTPUT ARTIFACT → MEASUREMENT/INSPECTION → RESULT`. Product, media и performance capabilities должны иметь фактически созданный/измеренный результат; visual должен иметь real render, objective browser evidence и independent subjective review. Executor не может сам вынести финальный Second Brain verdict.

До начала implementation значимой SYSTEM/DEVELOPMENT/RELEASE-задачи запускается `scripts/run-spec-lint-preflight.mjs`. Он сохраняет hash task packet, starting HEAD, branch, pre-work git status и SPEC-LINT result. Completion Gate требует criterion `spec_lint_preflight`; отсутствие этого criterion/evidence блокирует проверку.

Acceptance JSON обязан содержать metadata `task_class`, `delivery_required`, `visual_required`, `independent_review_required`. Для `DEVELOPMENT/SYSTEM/RELEASE` обязательны IDs `source_restore`, `scope_integrity`, `profile_checks`, `independent_review`; delivery добавляет `git_diff_review`, `commit`, `push`, `remote_readback`; visual добавляет `browser_render`, `desktop_evidence`, `mobile_evidence`, `visual_review`; independent review добавляет `independent_auditor`. Gate проверяет наличие IDs, а не только статус уже перечисленных criteria.

## 7. Quality and release gate

Release candidate не готов при Critical/Major defect. По применимости должны быть доказаны: content integrity, route/link integrity, visual/brand integrity, responsive, keyboard/focus, semantic structure, contrast, reduced motion, metadata/schema, browser console/network, performance, security baseline, Red Team и regression. Не обещать ranking, продажи или «10/10» без evidence.

## 8. Git and external actions

Проверять local status, remote branch и commit ancestry перед изменениями. Сохранять чужие/unrelated dirty files. Для `READ-ONLY`/`NO-DELIVERY` задач или при явном запрете внешней записи commit/push не выполнять. Во всех остальных задачах, если после работы остаётся tracked-file delta, delivery по умолчанию обязателен: `git diff/status → профильные проверки → staged allowlist → commit → PUSH → remote readback → LOCAL SHA == REMOTE SHA`; отдельная фраза «сделай push» в ТЗ не требуется. Временный эксперимент, полностью отменённый до handoff и не оставивший tracked-file delta, commit/push не требует. Для текущего runtime-cleanup публичный site UI/content/routes остаются unchanged.

Materialized delivery существенной задачи доказывается только этой цепочкой. При недоступном remote readback статус остаётся `BLOCKED AT PUSH`/`BLOCKED`, local commit SHA сохраняется в отчёте. `PUSH != merge`: merge, deploy, hosting, publication и production access требуют отдельного scope/approval.
