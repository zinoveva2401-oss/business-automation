# Codex capability registry

Status: current environment observation, not a permanent vendor promise. Checked 2026-10-02 (Europe/Moscow). Recheck the selected tool and its access when a task needs it. No plugin, Skill, package or account was installed for this audit.

## R9 role and workflow coverage

| Capability | R9 evidence / route | Result | Boundary |
|---|---|---|---|
| Runtime Architect | Distributed in r9 across `production-dispatcher-runtime.md`, `task-specification-delegation.md`, `model-economics-routing.md`, `execution-memory.md`; candidate adds conditional entry at `references/architect-supervisor-gate.md` | EXISTS_BUT_WEAK → CANDIDATE IMPLEMENTED | Fresh-session runtime trigger still pending |
| Execution Supervisor | Dispatcher states and transition gates; Work Production Controller; execution memory; task compiler | EXISTS_AND_SUFFICIENT | Transport/provider integrations still require live capability checks |
| Watchdog | `scripts/runtime_watchdog.py`, `tests/test_runtime_watchdog.py` | EXISTS_AND_SUFFICIENT | Proves deterministic event/loop/retry semantics, not provider transport |
| Product Factory | `references/product-factory.md` P0–P20, Product Council, buyer/substitute, blueprint and release stages; candidate adds blocking P10.75 real-content prototype + owner approval | EXISTS_BUT_WEAK → CANDIDATE IMPLEMENTED | Actual project discovery and fresh-session smoke still pending |
| Market / competitor research | Product P1–P3; Strategic Intelligence; global donor and user-language modules | EXISTS_AND_SUFFICIENT | Fresh, legal source access is task-specific |
| Professional research / evidence | Domain landscape, source/provenance and disconfirmation route in Product Factory and Research modules | EXISTS_AND_SUFFICIENT | Does not replace professional legal/medical advice |
| Svetlana practice extraction | Product Factory practice check and owner-context/source modules | EXISTS_AND_SUFFICIENT | Attribute practice; do not present it as external evidence |
| Product strategy / format / commercial value | P5–P10; product thesis, format fit, economics and value gates | EXISTS_AND_SUFFICIENT | Add prototype owner gate in v2.0.11 |
| Finance | CFO/economics and commercial route modules; margin, spend and opportunity-cost checks | EXISTS_AND_SUFFICIENT | Dynamic numbers must come from current sources |
| Legal / IP | Founder claims/IP, legal contour and QA/Red Team | EXISTS_AND_SUFFICIENT | Workflow routes issues; it is not a legal opinion |
| Human-language editorial / content depth | Russian Language Gate, Editorial Reader Experience, Publication Design | EXISTS_AND_SUFFICIENT | Actual owner/customer output still needs its applicable review |
| UX / artifact architecture | `product-experience-artifact-architecture.md` and digital-product journey gates | EXISTS_AND_SUFFICIENT | Exact format is chosen from the proven job |
| Art direction / Visual Futures | Design Thinking, Art/Video/Visual Futures and independent visual review | EXISTS_AND_SUFFICIENT | Figma/Canva access is separate from workflow availability |
| Technical production | executor packets, `docs/PRODUCT_EXECUTION.md`, technical/reliability modules | EXISTS_AND_SUFFICIENT | Product-specific tools and dependencies are checked at use time |
| QA / Red Team / regression | `qa-redteam-release.md`, package contract tests, evidence and completion-integrity gates | EXISTS_AND_SUFFICIENT | Runtime/system migration may still require external independent QA |
| Source routing / freshness | canonical source hierarchy, current-source restore, platform intelligence and source manifest | EXISTS_AND_SUFFICIENT | Connector access and source version are checked each run |
| Model / tool routing | model economics, capability expansion and task-specific selection | EXISTS_AND_SUFFICIENT | Names and auth are dynamic; registry below records current observation only |
| Cost / token control | task budget, model economics, execution-memory depth and anti-loop limits | EXISTS_AND_SUFFICIENT | No hard-coded provider price is authoritative |
| Trend / freshness checks | current-intelligence triggers, trend velocity, platform/source freshness rules | EXISTS_AND_SUFFICIENT | Re-query at production time |
| Write-back | dispatcher state transition, idempotency, write-back/readback requirements | EXISTS_AND_SUFFICIENT | Actual permissions and target cells/documents must be verified |
| `DOKRUTI_INTERNAL` / `CLIENT_WORK` isolation | No explicit shared-Core context boundary found; candidate adds `references/client-work-boundary.md` | MISSING → CANDIDATE IMPLEMENTED | Conditional future contract only; no Client Factory |

`DUPLICATED` / `CONFLICTING`: the old repo-local `dokruti-product-production` Skill repeated commercial routes, buyer strategy, format/price logic and Product Factory acceptance already owned by the Business OS. It has been replaced by complementary local executor routing; contract coverage is in `tests/test_v211_core_gates.py`. Root `AGENTS.md` is likewise a short router, not a copied Business OS.

## Product Factory operational routing

| Product job | Existing route / stage | Observable output or check |
|---|---|---|
| Market demand and buyer language | Product P1 + `research-competitive-intelligence.md`, Strategic Intelligence and current VOC | Sourced pain, behavior, frequency, alternatives and disconfirming evidence |
| Competitor / donor teardown | P3 + `competitor-reverse-engineering.md` + global creative/product intelligence | Legal public offer/demo/review evidence → `WHAT WORKS / WHY / VALUE / COMPLAINTS / GAP / ORIGINAL DOKRUTI MECHANIC`; no protected-material copying |
| Professional research and evidence | P2 + research/source provenance modules | Evidence map, limits, disagreements and claim-to-source trace |
| Svetlana practice extraction | Product Factory “Svetlana practice check” + owner-context/source modules | Practice separated from external evidence and original adaptation |
| Product strategy, format and durable value | P5–P10 + Product Value Integrity + Artifact Architecture | Need-first decision and justified book/workbook/calculator/web/app/course/toolkit/library/combined/other format; no launch-price quality ceiling |
| Finance and commercial logic | P9 + `finance-capital.md` and `sales-crm-attribution.md` | Cost, margin, price-worthiness hypothesis, delivery and downside gates |
| Legal/IP | Founder claims and IP gate + `legal-accounting-ip-ru.md` | Rights/provenance/claim risks; escalation where professional advice is needed |
| Human-language editorial and content depth | Blueprint + `editorial-reader-experience.md`, `russian-language-gate.md`, long-form design | Full meaningful content, clear WHAT/WHY/HOW/example/action/result as relevant; no filler |
| UX and visual direction | `product-experience-artifact-architecture.md`, `design-thinking-visual-system.md`, `art-video-visual-futures.md` | Format-native flow, actual visual direction and applicable review |
| Technical production | Frozen blueprint + `docs/PRODUCT_EXECUTION.md` + bounded executor packet | Actual working/rendered artifact with scoped dependencies and data boundaries |
| Real prototype / owner direction | Candidate Product Factory P10.75 | Actual-content prototype opened/rendered/tested; owner decision recorded before full production |
| QA, Red Team, regression and release packaging | P13–P20 + `qa-redteam-release.md`, exact artifact/release integrity | Actual assembled artifact, consolidated repair, fresh recheck, regression and final-package readback |

The route is conditional: a product task loads only its relevant specialist modules. Existing executable council, watchdog, product-value and release tests exercise the package logic; the fresh Product Factory project-context smoke remains unrun.

## Current tools and routes

| Capability | Preferred tool | Fallback | Auth/access | Use / avoid | Cost and risk | Observed now |
|---|---|---|---|---|---|---|
| Business System / Drive | Google Drive MCP; bounded Sheets metadata/row reads | Owner-provided exact source snapshot | Drive read worked for workbook metadata, DOKRUTI-CORE-001, PROD-TEAM-001, DEC-200; write not yet tested | Read current state; avoid broad workbook dumps | Writes change canonical business state; exact range/readback required | VERIFIED read |
| GitHub | local Git + `git ls-remote`, or GitHub MCP read | exact local ref with limitation stated | GitHub MCP read tested for current branch refs and accepted SITE SHA; push is pending | Source and remote SHA readback; no merge/deploy unless scoped | Push changes external refs | READ/accepted SHA verified; push pending |
| Web research | `web__run` | browser connector / Firecrawl when scale requires | Official Codex docs returned in this run | Dynamic facts, market and legal/technical references; avoid unsupported claims | Web evidence needs dates/sources | VERIFIED |
| Firecrawl | Firecrawl search/map/crawl tools | `web__run` or direct official source | Tools are registered; target/account capability not tested | Deep site mapping or structured crawl only when acceptance needs it | May consume credits; never use for curiosity |
| Figma | Figma tools + scoped Figma Skills | browser or local artifact review | Callable tools/Skills; file-specific auth not verified (no target supplied) | Use for an actual Figma source or concept workflow; do not create a file speculatively | External file mutations and model generation require task-specific authorization |
| Canva | Canva tools | local docs/slides workflow | Callable tools; account/design access not verified (no target supplied) | Use for existing brand templates/assets when the task calls for them | Generation/editing may affect user assets or spend credits |
| MagicPath | MagicPath tools | local HTML/prototype or Figma | Callable tools; project access not tested | Use when a real product prototype needs this canvas; do not generate a speculative project | Generation/mutations require target and budget review |
| Documents | bundled Documents Skill + Google Docs MCP | local DOCX workflow | Runtime available; no target Doc operation tested | Create/review actual document deliverables | Verify exact source and destination |
| PDF | bundled PDF Skill + Acrobat tools | local PDF tools in bundled runtime | Runtime available; no target PDF operation tested | Read/render/produce PDFs when product format requires | Check page content/render; no unnecessary conversion |
| Spreadsheets | bundled Spreadsheets Skill + Sheets MCP | deterministic local XLSX tooling | Sheets metadata and source reads verified | Workbook, calculator, analysis; test formulas and edge cases | Live writes require exact ranges and readback |
| Presentations | bundled Presentations Skill + Slides MCP | local PPTX workflow | Tooling available; no target deck operation tested | Slides only when chosen product/use supports it | Render and inspect actual output |
| Browser / computer-use | `web__run`, Playwright; CUA for supported browser surfaces | browser connector | Web works; this environment exposes browser UI controls; native OS control is unavailable in the CUA tool contract | Research and actual browser QA; use Playwright for product UI tests | External sessions/data; scope to the supplied target |
| OpenAI/Codex docs | `openai-docs` Skill + official web docs | official documentation search | Current official skill/project docs fetched in this run | Check behavior that can change by client/version | Cite primary source; no model/vendor hard-pin |
| Specialist review | sequential role checklists in the same task; bounded reviewer only where permitted/callable | internal review board and external Business OS QA when required | Reviewer APIs are not needed for current local workflow; independent QA remains a distinct gate | Invoke only applicable product, visual, technical, legal and editorial roles | Avoid swarm/repeated quota |
| Codex Product Factory project | Codex desktop local project with primary folder `products` | exact user UI step | App API lists only the existing repo-root project; it does not expose local project-folder creation | Create the distinct domain context only after local rules are ready | Project folders scope context; sandbox still governs writes |

## Capability smoke

- Live Drive/Sheets read: metadata and exact decision/task rows were fetched successfully on 2026-10-02.
- Official Codex docs: skill discovery and primary-folder/project behavior were fetched from official documentation on 2026-10-02.
- GitHub remote refs: verify with remote readback during this run's delivery; local checkout status alone is insufficient.
- Firecrawl, Figma, Canva, MagicPath, document/PDF/presentation write flows: callable surface is present, but no task target or authorized write was supplied; account-level execution remains `UNKNOWN` until the relevant product stage requires it.
