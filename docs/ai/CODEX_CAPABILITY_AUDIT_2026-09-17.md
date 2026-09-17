# Codex Capability Audit — 2026-09-17

Область аудита: локальный Codex runtime и доступные бесплатные/уже установленные capabilities для `CODEX-SECOND-BRAIN-001`. Новые платные инструменты, пакеты и SaaS не устанавливались.

Машинный probe: `node scripts/audit-codex-capabilities.mjs`.

## Матрица

| Capability | Status | Evidence / limitation |
|---|---|---|
| Node / npm / Git / pnpm | VERIFIED | version probes из локального runtime |
| Bundled Python | VERIFIED | version probe |
| ffmpeg / ffprobe | VERIFIED | Remotion-bundled binaries; encode/decode golden probe |
| ffmpeg / ffprobe on PATH | MISSING | generic PATH workflow unavailable |
| Astro / TypeScript / JSZip | AVAILABLE | resolvable project libraries; root `npm run check` passed |
| Remotion | AVAILABLE | existing `ernest-16-film` dependency; check/version probe |
| Playwright CLI/package | MISSING | CUA browser used for real render; Playwright-specific automation remains PARTIAL |
| Browser QA / responsive evidence | VERIFIED/PARTIAL | real CUA render, interaction, desktop and 390px mobile preview; true device emulation unavailable |
| Google Drive / Sheets | VERIFIED | profile, canonical sheet search, metadata and bounded range reads |
| GitHub | VERIFIED | repository access, branch push and remote readback in this runtime history |
| Figma | PARTIAL | authenticated identity probe; file-level design access not tested |
| Airtable | VERIFIED | ping returned successfully |
| Codex Sites | VERIFIED | owned Sites listing; deployment intentionally not performed |
| Independent multi-agent auditor | VERIFIED | Completion Auditor recheck |
| Security review baseline | VERIFIED | security skill/reference plus executable static scan |
| ImageMagick | MISSING | existing project image pipeline remains available |
| Backend framework | MISSING | bounded local Node mock is sufficient for retry/idempotency golden test |

`AVAILABLE != VERIFIED`. Missing optional capabilities are not blockers for this bounded runtime build. No MUST-HAVE installation was identified after the probes.

## Security boundary

The new runtime/test files pass `scripts/security-baseline-scan.mjs`. The scan covers hardcoded secrets, dynamic code evaluation, unsafe HTML sinks and wildcard `postMessage`.

Existing production code was not silently changed. Existing uses of browser storage and generated HTML in product/site files remain outside this SYSTEM scope and require a separate security/product review before any alteration.
