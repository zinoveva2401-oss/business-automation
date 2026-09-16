# DOKRUTI Business OS — Codex transport probe

TEST ONLY. DO NOT MERGE.

RUN-ID: RUN-BSYS-003-2026-09-16
STAGE-ID: BSYS-CODEX-TRANSPORT-PROBE

Purpose: verify that a task can be dispatched from ChatGPT Business OS to Codex through GitHub pull-request context without Svetlana copying the prompt manually.

Acceptance for this probe:
1. Codex reacts to the PR comment and starts a cloud task.
2. Codex reads this RUN/STAGE context and reports it back.
3. Codex must not change files, commit, push, deploy, publish, or modify product/content/site state.
4. Result/evidence must appear back on the PR so Business OS can read and verify it.

Source of truth for the full transport specification: GitHub issue #11 plus live Business System parent RUN. This probe file is not a business source of truth.
