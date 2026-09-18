# Security Baseline — 2026-09-17
Scope: runtime/test code и bounded fixtures для `CODEX-SECOND-BRAIN-001`. Production/site files вне scope и не переписывались.
Executable check: `node scripts/security-baseline-scan.mjs --self-test`.
Проверяются hardcoded keys/passwords/secrets/tokens; eval/dynamic Function; unsafe HTML sinks; wildcard postMessage; external dependency или credentialed service.
Implementation использует safe DOM APIs, task-scoped generated media, portable project-package ffmpeg/ffprobe resolver и current Brand SOT. Windows media binaries are dev-only; wrapper licenses are LGPL-2.1 and selected Windows binary metadata is GPLv3. Astro 7.3.3 was compatibility-checked with `npm run check`; the unused `@tabler/icons-webfont` dependency was removed to eliminate the remaining transitive svgo advisory. `npm audit --omit=dev --audit-level=high --json` returned 0 vulnerabilities. PASS static baseline не является полной production security certification.

Private-media guard: `.codex-task-media/` and `task-media/` are ignored local paths; standard local task-media location is `%LOCALAPPDATA%\\Dokruti\\task-media`. `scripts/guard-staged-media.mjs --self-test` passes and the delivery check scans staged paths, private markers, extensions and unallowlisted size. Current tree/history audit found no tracked video/audio/private media; no history rewrite was performed.
