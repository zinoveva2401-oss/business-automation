# Codex contract for DOKRUTI

Status: active shared repository guidance. Google Drive and the current Business System remain the business-state source of truth.

## Shared Core

- For meaningful DOKRUTI work, route through `.agents/skills/ai-business-os/SKILL.md` and load only its relevant modules. The installed Business OS owns business priorities, decisions, professional role routing and domain quality logic.
- The Architect/Supervisor is an internal conditional gate in that shared Core. It is not a separate Codex project, Skill, memory, database or state source.
- Do not copy current prices, queues, product status, customer state, private source content or credentials into Git.

## Source routing

- Priority: direct owner intent for this run → live `Бизнес-система` and linked current Drive sources → approved product/technical source → repository implementation → clearly marked historical references.
- Read only the relevant current rows and documents. Start at `docs/ai/SOURCE_MANIFEST.md`; use `docs/ai/PROJECT_MAP.md` to locate code and procedures.
- Verify dynamic market, legal, model, plugin and platform facts when they affect the result. Label unavailable evidence `UNKNOWN`; never treat a repo snapshot as live truth.

## Domain routing

- `products/AGENTS.md` adds Product Factory execution rules on top of this shared Core. For a new or materially rehabilitated product, show a representative real prototype before full production and obtain owner approval for meaningful product, UX, visual or brand choices.
- Site and content Skills remain conditional to those tasks. Reuse the existing in-repository domain roots/projects. Before creating a project, root, folder, worktree, branch, repository or Skill copy, the architecture review in `scripts/spec-lint-v2.mjs` must prove the canonical object, reuse check, concrete blocker, shared-Core preservation/update path and required owner decision. If any proof is missing, stop and reuse the existing object. The existing Content Factory project remains a domain executor over the shared Core.
- Preserve client state, brand assets, files and access in a client-specific context; use the shared professional Core without copying the Business OS per client.
- For implementation routes see `docs/ai/PROJECT_MAP.md`, `docs/PRODUCT_EXECUTION.md` and `docs/ai/CODEX_RUNTIME.md` as applicable.

## Execution and safety

- Для DEC-220 разрешён только порядок `PRESERVE → EXECUTOR → MEDIA → E2E`; следующий этап нельзя начинать без сохранённого `ПРОВЕРЕНО/VERIFIED` предыдущего. Общий Stage Gate проверяет артефакты и SHA-256; `BLOCKED`, `FAIL`, пропуск этапа, отсутствующее или изменённое доказательство блокирует переход. Самоутверждение агента не является доказательством. Состояние `MAIN / CURRENT STAGE / STATUS / EVIDENCE / BLOCKER / NEXT ACTION / RETURN TO / время` записывается и читается обратно в существующей «Бизнес-системе» при восстановлении.

- Before a change, inspect the exact branch, HEAD, status, diffs, required source and target paths. For substantial SYSTEM/DEVELOPMENT/RELEASE work, run `scripts/run-spec-lint-preflight.mjs` before implementation and record its task hash and baseline evidence.
- Keep scope explicit. Preserve unrelated dirty work and accepted refs. Use exact path allowlists; never use `git clean`, broad staging, or force operations.
- Obtain owner approval for paid dependencies, sensitive access, external publication, legal/financial commitments and destructive actions unless this run explicitly authorizes the exact operation.
- Verify the actual result. Apply relevant technical/product/editorial/security checks and the `docs/ai/SECOND_BRAIN_REVIEW_BOARD.md` plus `docs/ai/COMPLETION_GATE.md` when their task criteria apply. A self-report, build or file-presence check alone is not proof.
- For tracked changes outside read-only work, review the exact diff, run relevant checks, commit only the allowlist, push when authorized/required, then read back the remote SHA.

## Shared branch and workspace reuse guard

- Default every new chat, product, client assignment, Skill repair, and task to the existing canonical repository, its current authorized working tree, and its current branch. None of those events alone justifies another branch, worktree, project, folder, repository, or Business OS copy.
- Before any exception, inspect the existing project/root/branch/worktrees and prove with a concrete constraint that reuse is blocked. A task packet, convenience, parallelism, or an assistant's proposed workflow is not owner approval. Obtain Svetlana's explicit approval for the exact object after the necessity and alternatives are evidenced; otherwise `NO-GO / REUSE EXISTING`.
- If an approved branch/worktree exception is genuinely required, first read the live verified Core SHA/status and prove the exact commit exists. Record its ancestry and shared-Core blob parity before implementation. Never silently base work on stale `main`, copy the shared brain, or rewrite history to conceal divergence.
- Serialize edits to overlapping shared files. Before writing, inspect active Codex work and the exact working-tree diff. If another task is editing an overlapping path, coordinate one writer or wait; do not evade the conflict by creating a second branch/worktree.
- For routine delivery, use the current authorized branch and an exact path allowlist. Commit/push only when the task authorizes delivery; read back the exact remote SHA. A local change, commit, passing test, or temporary branch does not become canonical without the required remote acceptance and runtime readback.

## Handoff

Report in clear Russian: what changed, exact evidence, current Git/remote state and remaining blockers. Do not claim `VERIFIED` while a required fresh-session, independent or external-source check remains open.
