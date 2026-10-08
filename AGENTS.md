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

- Before a change, inspect the exact branch, HEAD, status, diffs, required source and target paths. For substantial SYSTEM/DEVELOPMENT/RELEASE work, run `scripts/run-spec-lint-preflight.mjs` before implementation and record its task hash and baseline evidence.
- Keep scope explicit. Preserve unrelated dirty work and accepted refs. Use exact path allowlists; never use `git clean`, broad staging, or force operations.
- Obtain owner approval for paid dependencies, sensitive access, external publication, legal/financial commitments and destructive actions unless this run explicitly authorizes the exact operation.
- Verify the actual result. Apply relevant technical/product/editorial/security checks and the `docs/ai/SECOND_BRAIN_REVIEW_BOARD.md` plus `docs/ai/COMPLETION_GATE.md` when their task criteria apply. A self-report, build or file-presence check alone is not proof.
- For tracked changes outside read-only work, review the exact diff, run relevant checks, commit only the allowlist, push when authorized/required, then read back the remote SHA.

## Domain branch inheritance guard

- Before creating or refreshing any DOKRUTI domain branch/worktree, read the latest VERIFIED canonical Core SHA and status from the live Business System, then confirm that exact commit exists in the repository.
- Create the domain branch directly from that verified Core SHA. A GitHub default branch name alone is never a valid base. Record the Core source/status, base SHA, and git merge-base --is-ancestor <VERIFIED_CORE_SHA> HEAD result before implementation.
- If the GitHub default does not contain the latest VERIFIED Core commit as an ancestor, stop branch creation and implementation until the default/canonical relationship is reconciled and remotely read back. Never silently fall back to stale main or rewrite history to conceal divergence.
- Domain branches are technical isolation and execution overlays over the one shared Business OS. Do not copy or fork the shared brain into a domain executor.

## Handoff

Report in clear Russian: what changed, exact evidence, current Git/remote state and remaining blockers. Do not claim `VERIFIED` while a required fresh-session, independent or external-source check remains open.
