# Codex Capability Audit — 2026-09-17

Область аудита: локальный Codex runtime и доступные бесплатные/уже установленные capabilities для `CODEX-SECOND-BRAIN-001`. По DEC-131 установлены только две reversible dev-only зависимости для portable media proof; платные инструменты, SaaS и private source connectors не подключались.

Машинный probe: `node scripts/audit-codex-capabilities.mjs`.

## Матрица

| Capability | Status | Evidence / limitation |
|---|---|---|
| Node / npm / Git / pnpm | VERIFIED | version probes из локального runtime |
| Python on PATH | MISSING | machine probe returned `ENOENT`; cache-specific Python path is not a dependency |
| ffmpeg / ffprobe | VERIFIED | project-owned resolver uses `@ffmpeg-installer/ffmpeg` and `@ffprobe-installer/ffprobe`; encode/decode golden probe |
| ffmpeg / ffprobe on PATH | MISSING | generic PATH workflow unavailable |
| Astro / TypeScript / JSZip | AVAILABLE | resolvable project libraries; root `npm run check` passed |
| Remotion | NOT REQUIRED | no `ernest-16-film` or foreign-project dependency remains in the resolver/golden path |
| Playwright CLI/package | MISSING | CUA browser used for real render; Playwright-specific automation remains PARTIAL |
| Browser QA / responsive evidence | VERIFIED/PARTIAL | real CUA render, interaction, material 1280px and 390px screenshots; CUA exposes visibility/viewport but not true network throttling |
| Browser network throttling | BLOCKED CAPABILITY | no network emulation control in the exposed CUA capability surface; Chrome DevTools/Playwright route not available in this run |
| Speech / TTS | PARTIAL | Windows SAPI speech executed in an approved elevated local probe; normal sandbox invocation is denied |
| Captions | VERIFIED | SRT sidecar generated and checked in the media golden |
| Google Drive / Sheets | NOT_PROBED | no connector call in this local run; no private source media was imported |
| GitHub | VERIFIED | repository access, branch push and remote readback in this runtime history |
| Figma / Airtable / Sites | NOT_PROBED | no file-level connector call; deployment intentionally not performed |
| Independent multi-agent auditor | VERIFIED | Completion Auditor recheck |
| Security review baseline | VERIFIED/PARTIAL | security skill/reference plus executable static scan; dependency audit endpoint returned a vulnerability response/error requiring follow-up |
| ImageMagick | MISSING | existing project image pipeline remains available |
| Backend framework | MISSING | bounded local Node mock is sufficient for retry/idempotency golden test |

`AVAILABLE != VERIFIED`. Missing optional capabilities are not hidden. Real slow-network measurement remains a capability blocker for this graduation run; Python and ImageMagick are non-required for the bounded route.

## Dependency and environment notes

The media resolver checks, in order: approved environment path, project package export, then PATH. It does not reference `ernest-16-film`, a foreign worktree, a cache path or an absolute user directory. The installed package wrappers are LGPL-2.1; the selected Windows platform binaries are marked GPLv3 in `package-lock.json`. They are dev-only test/runtime dependencies and are not shipped to the site. `npm audit` reported 4 vulnerabilities (3 high, 1 critical) while the audit endpoint returned an error; this remains an explicit unresolved dependency-security note, not a hidden PASS.

Generated speech, source frames and encoded videos are written to task-scoped `%TEMP%\\dokruti-second-brain-golden-*` directories. Only rights-safe screenshot evidence and small JSON/HTML fixtures remain tracked.

## Security boundary

The new runtime/test files pass `scripts/security-baseline-scan.mjs`. The scan covers hardcoded secrets, dynamic code evaluation, unsafe HTML sinks and wildcard `postMessage`. Material browser artifacts are `tests/fixtures/second-brain/visual/evidence/desktop-1280.png` and `mobile-390.png`, with hashes recorded by the asset inventory/golden evidence.

Existing production code was not silently changed. Existing uses of browser storage and generated HTML in product/site files remain outside this SYSTEM scope and require a separate security/product review before any alteration.
