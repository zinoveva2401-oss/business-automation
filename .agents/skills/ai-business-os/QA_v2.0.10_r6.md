# QA v2.0.10 r6

Build: `2026-09-21 delegation-governance-r6`

Regression focus: delegation governance, cost/quota foresight, source visibility, Codex transport, dynamic model inheritance and single-session review. r6 does not add business capabilities; it tightens stop conditions around existing r5 logic.

Critical checks:
1. weak owner method is challenged/rephrased without silently refusing the goal;
2. pre-delegation access/runtime/model/transport/budget/rollback/1-3-10-20-step checks are blocking;
3. Business OS never assumes Codex can see Drive/Brand without actual access or supplied snapshot;
4. Business OS does not auto-send/start/continue/fork Codex tasks under the owner transport lock;
5. one visible Codex session is default; restart returns RESTART REQUIRED and stops;
6. stable specs do not hard-pin dynamic model names;
7. physical subagents are not spawned by role labels and require explicit owner approval when extra quota is material;
8. same task still preserves r5 demand/media/personal capabilities.

## Production quality delegation hardening
- Added concept-before-code / value-blueprint-before-artifact / paper-edit-before-render / angle-hook-format-before-production routes.
- Added explicit CAPABILITY != QUALITY and false technical-PASS blocker.
- Extended Codex task template so applicable domain quality is part of production, not a late adjective/checklist.

- technical availability of subagents is not authorization; explicit owner approval is required for extra spawned quota.
