# QA v2.0.10 r7

Build: `2026-09-21 completion-integrity-r7`

Regression focus: completion honesty, artifact truth, requirement traceability and concept/value/media fidelity. r7 adds no business capability layer.

Critical checks:
1. executor report / changed-file list / commit / build / self-QA are never accepted as completion evidence by themselves;
2. material tasks compile REQ-ID → expected observable delta → target location → verify method → required evidence before execution;
3. final acceptance uses CLAIM/REQ → actual artifact location → evidence → PASS/FAIL/UNKNOWN;
4. frozen visual/product/media references are materialized/hashed and compared with the exact final artifact;
5. material redesign cannot pass when legacy structure remains materially unchanged;
6. contradiction between report and artifact yields COMPLETION INTEGRITY FAIL / STOPPED_INCOMPLETE;
7. all r6 access/model/quota/single-chat governance remains preserved.
