# CODEX_RUNTIME — autonomous production contract

Статус: Действующий
Версия: 1.1
Проект: `Докрути`

## 1. Runtime objective

Codex — самостоятельная production Second Brain среда проекта. Он получает актуальный контекст, сам формирует маршрут, делает профессиональные решения, подключает доступные Skills/tools, производит реальный artifact и прогоняет его через последовательный, независимый от producer контур качества в одном видимом чате. Профили `.codex/agents/*.toml` используются как read-only checklists; физические subagents по умолчанию выключены. Сайт в SYSTEM-задаче не редизайнится автоматически.

Основной автономный quality loop описан в [`SECOND_BRAIN_REVIEW_BOARD.md`](SECOND_BRAIN_REVIEW_BOARD.md). Для high-risk/irreversible/runtime задач дополнительно действует [`COMPLETION_GATE.md`](COMPLETION_GATE.md). Главный producer не может сам принять существенный результат.

## 1.1 Executable lifecycle

`INTAKE → SOURCE RESTORE → CAPABILITY PREFLIGHT → CURRENT INTELLIGENCE WHEN NEEDED → WEAK-SPEC REVIEW → PRE-PRODUCTION PROOF → PLAN/OPTIONS → IMPLEMENT/PRODUCE → REAL RESULT → OBJECTIVE EVIDENCE → SEQUENTIAL SPECIALIST PASSES IN SAME CHAT → REVIEW CHAIR → ONE CONSOLIDATED REPAIR → ONE RE-REVIEW → REGRESSION → DELIVERY IF TRACKED DELTA AND NOT READ-ONLY (COMMIT → PUSH → REMOTE READBACK → SHA MATCH) → EXTERNAL COMPLETION GATE ONLY WHEN REQUIRED`

`ONE OWNER TASK → ONE VISIBLE CHAT → ONE CANONICAL WORKING BRANCH`. Не создавать `spawn_agent`, новый chat, fork, delegated task, parallel review thread или новый worktree без явного owner-разрешения. Если нужен restart для чистого контекста: checkpoint → `RESTART REQUIRED` → STOP; автоматически не перезапускаться. `PUSH != merge`: merge/deploy/publication остаются отдельным разрешённым этапом.

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

Для существенного результата обязательна применимая последовательность role-checklists из [`SECOND_BRAIN_REVIEW_BOARD.md`](SECOND_BRAIN_REVIEW_BOARD.md), но не отдельные threads: `research-scout`, `visual-critic`, `product-growth-critic`, `media-critic`, `technical-auditor`, затем `review-chair`. До производства зафиксировать capability preflight, source access, missing inputs, required lanes и QA route. Capability не равен quality: наличие Skill, профильного файла, команды, build или self-authored PASS не доказывает результат. Для browser/UI-задач invariant: `REAL BROWSER RENDER + OBJECTIVE EVIDENCE REQUIRED`; маршрут выбирается из реально доступных CUA, browser automation, Playwright или другого capability. Если нужного capability нет, сначала проверить бесплатный доступный маршрут; reversible technical install известной бесплатной зависимости допустим без отдельного owner gate только при zero cost, проверенных license/security, минимальном footprint и обновлённом tracked manifest/lock. OWNER GATE остаётся обязательным для paid, credentialed commercial, material spend, risky/irreversible install или неясного license/security риска; слабую замену нельзя выдавать за эквивалент.

## 3.1 Weak-spec review

До реализации проверить противоречия ТЗ, отделить `OWNER INTENT` от ошибочного method, зафиксировать frozen constraints и выбрать более сильный technical route. Frozen business/product/brand/commercial/legal решения не менять самостоятельно.

### 3.2 Source access map

В task packet явно отмечать `LOCAL REPO`, `GITHUB`, `LIVE DRIVE/SHEETS`, `BROWSER/WEB`, `OWNER/BUSINESS OS SNAPSHOT` как `YES/NO`, с датой, способом доступа и ограничением. Если canonical source недоступен, использовать только exact task snapshot с provenance либо вернуть `SOURCE SNAPSHOT REQUIRED`; не подменять источник capability или памятью.

## 4. Production loops

### Digital/public result

`BUSINESS GOAL → CURRENT SOURCE CHECK → CURRENT INTELLIGENCE WHEN DYNAMIC → CURRENT REFERENCES → DISTINCT INTERNAL OPTIONS → PRE-PRODUCTION PROOF → INTERNAL CHOICE → PRODUCTION → REAL ARTIFACT → OBJECTIVE QA → SEQUENTIAL SPECIALIST PASSES IN SAME CHAT → REVIEW CHAIR → ONE DEFECT LIST → ONE CONSOLIDATED FIX → FRESH RE-REVIEW → REGRESSION → HANDOFF`.

До implementation выбрать domain route и material pre-production proof: visual/site — current reference research и concept proof до кода; product — buyer/value blueprint, free-AI substitution и price-worthiness; media — transcript, paper edit и first cut до render; content/marketing — audience, pain, hook, format и payoff; SEO/AEO — current intent/SERP/source check без обещания ranking; technical/data — reproduction, scope, risk и test plan. Mixed customer-facing work разделяется на technical, visual, product, media и content lanes. Technical PASS не перекрывает FAIL в другой применимой lane.

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

## 6. Internal Review Board + Final completion gate

Для `DEVELOPMENT`, `SYSTEM`, `RELEASE`, значимой `INTEGRATION`, source cleanup, deployment и коммерческого digital-актива создать immutable acceptance matrix до production. Внутренний Review Board обязателен и должен материализовать criterion `internal_review_board` с artifact/evidence. Board выполняется как sequential artifact в том же чате; физические subagent threads не обязательны. Матрица неизменна до конца задачи и содержит `CRITERION`, `EXPECTED`, `HOW TO VERIFY`, `EVIDENCE`, `STATUS`.

`independent_review_required=false` допустим для reversible routine work после `ACCEPT_INTERNAL`. `independent_review_required=true` обязателен для изменений самого Codex/Review Board/runtime, irreversible/public high-risk release, security/legal/privacy-sensitive release, destructive/migration действий, explicit owner external audit или `CAPABILITY_GAP`. В этом случае локальный runtime не может сам выдать внешний `VERIFIED`.

Не считать evidence self-report, dry-run, предполагаемый workflow, существование Skill/инструкции, локальный HEAD, staging-only readback или build вместо требуемой проверки. При любом `FAIL`/`UNKNOWN` исполнитель получает единый defect register, делает consolidated fix и вызывает independent recheck. Внешний `PASS`, `DONE`, `VERIFIED` или `RELEASE CANDIDATE` запрещён до полного evidence-backed PASS. Deterministic check: `node scripts/verify-completion-gate.mjs acceptance.json verifier.json`.

Для технического Second Brain JSON-флаги из собственного fixture не являются evidence: `PASS`, `true`, `meaningful`, `decision_useful`, выбранный ответ и заранее вписанные bytes должны быть заменены на `INPUT → REAL EXECUTION → OUTPUT ARTIFACT → MEASUREMENT/INSPECTION → RESULT`. Product, media и performance capabilities должны иметь фактически созданный/измеренный результат; visual должен иметь real render, objective browser evidence и sequential `visual-critic` verdict; cross-domain work должен пройти sequential `review-chair`. Producer не может заменить reviewer verdict своим self-PASS.

### 6.1 Completion integrity

Для каждого material criterion до production фиксировать `REQ-ID → EXPECTED OBSERVABLE DELTA → TARGET LOCATION/ROUTE/FILE/SCREEN → VERIFY METHOD → REQUIRED EVIDENCE`. Для material redesign/rebuild обязательна transformation map `CURRENT → TARGET`. Если visual/product/media direction frozen, acceptance записывает exact materialized reference/blueprint с path + hash/provenance; missing reference blocks acceptance.

Перед `READY` строить final claim ledger `CLAIM/REQ-ID → ACTUAL FINAL LOCATION → EVIDENCE/MEASUREMENT → PASS/FAIL/UNKNOWN`. `artifact_truth` обязан доказать expected observable delta, actual final location, final artifact path + SHA256 и actual inspection; `reference_fidelity` при visual lane обязан связать distinct before/reference/after artifacts с final-after identity. Report, changed-file list, commit/build/deploy log и self-authored PASS — navigation only. Exact final artifact должен совпадать с reviewed final SHA/URL/file; mismatch resets acceptance.

До начала implementation значимой SYSTEM/DEVELOPMENT/RELEASE-задачи запускается `scripts/run-spec-lint-preflight.mjs`. Он сохраняет hash task packet, starting HEAD, branch, pre-work git status и SPEC-LINT result. Completion Gate требует criterion `spec_lint_preflight`; отсутствие этого criterion/evidence блокирует проверку.

Acceptance JSON обязан содержать metadata `task_class`, `delivery_required`, `visual_required`, `independent_review_required`. Для `DEVELOPMENT/SYSTEM/RELEASE` обязательны IDs `source_restore`, `scope_integrity`, `profile_checks`, `spec_lint_preflight`, `internal_review_board`, `artifact_truth`, `independent_review`; delivery добавляет `git_diff_review`, `commit`, `push`, `remote_readback`; visual добавляет `browser_render`, `desktop_evidence`, `mobile_evidence`, `visual_review`, `reference_fidelity`; independent review добавляет `independent_auditor`. Gate проверяет наличие IDs и material evidence, а не только статус уже перечисленных criteria.

## 7. Quality and release gate

Release candidate не готов при Critical/Major defect. По применимости должны быть доказаны: content integrity, route/link integrity, visual/brand integrity, responsive, keyboard/focus, semantic structure, contrast, reduced motion, metadata/schema, browser console/network, performance, security baseline, Red Team и regression. Не обещать ranking, продажи или «10/10» без evidence.

## 8. Git and external actions

Проверять local status, remote branch и commit ancestry перед изменениями. Сохранять чужие/unrelated dirty files. Для `READ-ONLY`/`NO-DELIVERY` задач или при явном запрете внешней записи commit/push не выполнять. Во всех остальных задачах, если после работы остаётся tracked-file delta, delivery по умолчанию обязателен: `git diff/status → профильные проверки → staged allowlist → commit → PUSH → remote readback → LOCAL SHA == REMOTE SHA`; отдельная фраза «сделай push» в ТЗ не требуется. Временный эксперимент, полностью отменённый до handoff и не оставивший tracked-file delta, commit/push не требует. Для текущего runtime-cleanup публичный site UI/content/routes остаются unchanged.

Materialized delivery существенной задачи доказывается только этой цепочкой. При недоступном remote readback статус остаётся `BLOCKED AT PUSH`/`BLOCKED`, local commit SHA сохраняется в отчёте. `PUSH != merge`: merge, deploy, hosting, publication и production access требуют отдельного scope/approval.
