# Skill Governance / Versioning / Migration

## Goal

Keep Business OS useful for years without freezing current tools or continuously rewriting stable rules.

## 1. Stable core vs dynamic state

Skill stores durable operating rules.
Dynamic facts — current products, prices, priorities, model names, platform algorithms, branch/hosting state, partner terms — live in Control Center/current sources and are verified fresh.

## 2. Change trigger

Do not rewrite the Skill because of one new trend or idea.
A Skill update is justified by:
- business/brand operating model change;
- repeated critical defect;
- proven missing capability;
- new stable cross-project process;
- source-of-truth architecture change;
- legal/security stop-factor;
- architecture failure demonstrated by regression/runtime tests.

## 3. Version package

Every released package should include:
- semantic version/build date;
- MANIFEST;
- module index;
- changelog/delta from prior installed version;
- migration/rollback note;
- static validator;
- acceptance + regression tests.

## 4. Preserve-before-change / preserve-before-replace gate

A request to `дописать / добавить / усилить / исправить / синхронизировать` the installed Skill is a PATCH/INTEGRATION by default, not permission to redesign the package. Before any substantial change to an installed Skill, first create an intent/preservation map:
- what must remain unchanged;
- what exact delta is requested;
- what must not be touched;
- what new files/modules, if any, are necessary;
- how preservation will be verified.

If a redesign/rebuild seems superior, propose it separately. Do not execute it until the owner explicitly approves REBUILD.

Before replacing installed Business OS:
1. inventory the current package;
2. map every stable v1/vN rule to new module or mark intentionally retired with reason;
3. preserve source hierarchy/Control Center/WIP/DONE≠VERIFIED/environment-check/writeback/QA unless owner explicitly changes them;
4. run regression tests;
5. install new package without deleting old copy first;
6. run live new-chat tests;
7. only then retire/archive old package.

## 5. Runtime visibility

Do not confuse:
- active Skill instructions;
- project documents;
- a runtime passport/manifest;
- files physically visible in chat.

If asked whether a Skill is active/installed, verify through available product/runtime evidence rather than pretending to have opened hidden files.


## 5.1. Self-declared package identity

The active package must self-declare both semantic version and release channel/build, e.g. `v2.0.9 CANDIDATE` or `v2.0.9 RELEASE`. This is evidence of the instruction package being executed, distinct from platform-level installation telemetry. An exact same identity/build should not be reinstalled merely because a stale rollout row says “install”. However a CANDIDATE never satisfies a later target to install the RELEASE of the same semantic version.

## 5.2. Installed Skill vs Project source / browser update contract

If the actual ChatGPT surface already exposes an installed `DOKRUTI Business OS` Skill, that installed Skill remains the primary reusable instruction package. A Project source/MD projection is supplementary context/fallback and **does not replace updating the installed Skill**.

Before updating an installed browser Skill:
1. verify the currently installed identity/version from the actual Skill details/UI when available;
2. preserve/download the current package or retain a verified rollback copy;
3. verify the exact new RELEASE ZIP hash/manifest and scan result;
4. use the platform's current edit/modify/upload-version path if available; if only create/upload is available, install the new version alongside the old one rather than deleting the old first;
5. run a fresh-chat self-identity + source-priority + parent-RUN recovery smoke test;
6. test at least one representative routing case;
7. only after PASS retire/archive the older installed version or remove its automatic use;
8. if the new version fails, rollback to the preserved package and record the defect/evidence.

Project instructions/sources must not duplicate conflicting copies of the same stable rules. **Do not add the full Project runtime-source by default when the installed Skill is available and passes fresh-chat invocation/recovery smoke tests.** Keep it as an optional fallback/diagnostic projection for surfaces where the installed Skill is unavailable or demonstrably not invoked. If both installed Skill and Project source are present, the Project source should point to the same release identity and contain no newer contradictory policy.

## 6. Self-change boundary

Business OS may propose its own improvement when a trigger is evidenced, but must not silently rewrite/install itself or its source hierarchy without capability + owner approval appropriate to the environment.

## 7. Learning-promotion boundary

Do not let a “self-learning” plugin/repo automatically mutate stable Business OS rules. Candidate learnings pass `learning-promotion-loop.md`: evidence → destination → preservation/conflict check → targeted patch → regression → release/update. Dynamic creative/platform findings normally live in playbooks/cards until they prove durable.

## 8. Changelog discipline

Record WHAT changed, WHY, source/defect, compatibility impact, tests and rollback. Do not create version-number churn for copy edits.
