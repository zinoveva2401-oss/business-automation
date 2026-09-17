# Skill Regression Harness

`node scripts/skill-regression-harness.mjs` запускает bounded golden suite для технического runtime. Harness не заменяет независимый Completion Auditor и не переписывает существующие Skills.

Текущие suites:

1. runtime Completion Gate self-test;
2. SPEC-LINT v2;
3. digital-product format-fit;
4. dashboard decision usefulness and loading/empty/error/ready states;
5. multi-source media inventory → content map → edit plan route;
6. automation retry/idempotency;
7. performance and weight evidence;
8. video master/delivery and document/product size QA;
9. weak-input quality challenge;
10. meaningful motion и reduced-motion contract;
11. real browser render with desktop/mobile evidence;
12. asset inventory, source/license/bytes и duplicate check;
13. static security baseline для новых runtime/test files;
14. Git delivery readback и local/remote SHA match.

Fixture format: JSON с явными acceptance fields и evidence. Browser fixture находится в `tests/fixtures/second-brain/visual/index.html`; его real-render evidence зафиксирована в `visual-evidence.json`.

PASS означает только прохождение bounded fixture. Он не доказывает live deployment, production visual QA или бизнес-истину.
