# Security Baseline — 2026-09-17
Scope: runtime/test code и bounded fixtures для `CODEX-SECOND-BRAIN-001`. Production/site files вне scope и не переписывались.
Executable check: `node scripts/security-baseline-scan.mjs --self-test`.
Проверяются hardcoded keys/passwords/secrets/tokens; eval/dynamic Function; unsafe HTML sinks; wildcard postMessage; external dependency или credentialed service.
Implementation использует safe DOM APIs, task-scoped generated media, portable project-package ffmpeg/ffprobe resolver и current Brand SOT. Windows media binaries are dev-only; wrapper licenses are LGPL-2.1 and selected Windows binary metadata is GPLv3. `npm audit` reported 4 vulnerabilities (3 high, 1 critical) with an audit-endpoint error, so dependency security remains an explicit unresolved follow-up and is not treated as a clean release certification. PASS static baseline не является полной production security certification.
