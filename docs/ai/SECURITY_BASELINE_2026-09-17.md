# Security Baseline — 2026-09-17
Scope: runtime/test code и bounded fixtures для `CODEX-SECOND-BRAIN-001`. Production/site files вне scope и не переписывались.
Executable check: `node scripts/security-baseline-scan.mjs --self-test`.
Проверяются hardcoded keys/passwords/secrets/tokens; eval/dynamic Function; unsafe HTML sinks; wildcard postMessage; external dependency или credentialed service.
Implementation использует safe DOM APIs, local generated media, bundled ffmpeg/ffprobe и current Brand SOT. PASS static baseline не является полной production security certification.
