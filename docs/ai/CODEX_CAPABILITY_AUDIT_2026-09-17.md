# Codex Capability Audit — 2026-09-18 corrective continuation

Область аудита: локальный Codex runtime и доступные бесплатные/уже установленные capabilities для `CODEX-SECOND-BRAIN-001`. По DEC-131 установлены только две reversible dev-only зависимости для portable media proof; платные инструменты, SaaS и private source connectors не подключались.

Машинный probe: `node scripts/audit-codex-capabilities.mjs`.

## Матрица

| Capability | Status | Evidence / limitation |
|---|---|---|
| Node / npm / Git / pnpm | VERIFIED | version probes из локального runtime |
| Python on PATH | MISSING | machine probe returned `ENOENT`; cache-specific Python path is not a dependency |
| ffmpeg / ffprobe | VERIFIED | project-owned resolver uses `@ffmpeg-installer/ffmpeg` and `@ffprobe-installer/ffprobe`; encode/decode golden probe |
| ffmpeg / ffprobe on PATH | MISSING | generic PATH workflow unavailable |
| Astro / TypeScript / JSZip | VERIFIED | Astro 7.3.3 compatibility path; root `npm run check` passed |
| Remotion | NOT REQUIRED | no `ernest-16-film` or foreign-project dependency remains in the resolver/golden path |
| Playwright CLI/package | MISSING | CUA browser used for real render; Playwright-specific automation remains PARTIAL |
| Browser QA / responsive evidence | VERIFIED | real CUA render, interaction, material 1280px and 390px screenshots; network evidence is separately executed through Chrome CDP |
| Browser network throttling | VERIFIED | local HTTP fixture, ephemeral Chrome profile, `Network.enable` + `Network.emulateNetworkConditions`, baseline/throttled timing, bytes, screenshots, console/network failure collection |
| Speech / TTS | VERIFIED (elevated route) | Windows SAPI voice is materialized in the real video exam; normal sandbox remains unable to create the WAV |
| Captions | VERIFIED | SRT sidecar generated and checked in the media golden |
| Google Drive / Sheets | NOT_PROBED | no connector call in this local run; no private source media was imported |
| GitHub | VERIFIED | repository access, branch push and remote readback in this runtime history |
| Figma / Airtable / Sites | NOT_PROBED | no file-level connector call; deployment intentionally not performed |
| Independent multi-agent auditor | VERIFIED | Completion Auditor recheck |
| Security review baseline | VERIFIED | executable static scan, staged-media guard, history audit and `npm audit --omit=dev --audit-level=high`: 0 Critical / 0 High |
| ImageMagick | MISSING | existing project image pipeline remains available |
| Backend framework | MISSING | bounded local Node mock is sufficient for retry/idempotency golden test |

`AVAILABLE != VERIFIED`. Missing optional Playwright/Python/ImageMagick remain non-required because the required browser and media routes have real local evidence. Speech is explicitly elevated-only, not silently treated as an ordinary sandbox capability.

## Dependency and environment notes

The media resolver checks, in order: approved environment path, project package export, then PATH. It does not reference `ernest-16-film`, a foreign worktree, a cache path or an absolute user directory. The selected Astro security path is `7.3.3`, validated by `npm run check` and static build compatibility; the unused `@tabler/icons-webfont → svgtofont → svgo@3.3.4` path was removed rather than overridden blindly. Both the live audit and the local-cache route returned 0 vulnerabilities; the reproducible cache output is recorded at `tests/fixtures/second-brain/security/npm-audit-high.json`. The ffmpeg/ffprobe wrappers remain dev-only test dependencies and are not shipped to the site.

Generated speech, source frames and working encodes are written to task-scoped `%TEMP%\\dokruti-video-exam-*` directories and removed after the run. The four final generated MP4 evidence files, rights-safe contact sheets and JSON/HTML fixtures are tracked only under the narrow `tests/fixtures/second-brain/video/evidence/` allowlist. The staged-media guard is `scripts/guard-staged-media.mjs`; local task media belongs in ignored `.codex-task-media/`, `task-media/` or `%LOCALAPPDATA%\\Dokruti\\task-media`, never in the repository.

Private-media/history audit: current tree and `git log --all --diff-filter=A` were checked for video/audio and private path markers; no tracked `.mp4`, `.mov`, `.wav`, `.m4a`, Drive path or `ernest-16-film` media was found. Existing public PNG assets are site/product assets. No history rewrite was performed.

Network evidence: `tests/fixtures/second-brain/performance/network-evidence.json` records Chrome `153.0.8010.48`, local HTTP, ephemeral profile cleanup, a 182.8ms load-event delta, transfer bytes, screenshots, zero console errors and zero network failures.

Video evidence: `tests/fixtures/second-brain/video/evidence/video-evidence.json` records a real 20s first cut and a real 20s second cut, 3 versus 8 shots, generated moving/still/graphic source classes, SAPI voice, captions, audio mix, master/delivery metadata, decode bytes and contact sheets. The four generated master/delivery MP4s are retained under the same allowlisted evidence directory for independent ffprobe/decode/review. It is execution evidence, not a codec-only demo.

## Security boundary

The new runtime/test files pass `scripts/security-baseline-scan.mjs`. The scan covers hardcoded secrets, dynamic code evaluation, unsafe HTML sinks and wildcard `postMessage`. Material browser artifacts are `tests/fixtures/second-brain/visual/evidence/desktop-1280.png` and `mobile-390.png`, with hashes recorded by the asset inventory/golden evidence.

Existing production code was not silently changed. Existing uses of browser storage and generated HTML in product/site files remain outside this SYSTEM scope and require a separate security/product review before any alteration.
