# QA | DOKRUTI Business OS v2.0.10 RELEASE r4

Build: `2026-09-18 owner-context-workspace-r4`

## Что добавлено после r3

1. **No-Invention / Owner Context Diagnostic** — если персонально значимой информации о Светлане нет, Skill сначала восстанавливает источники, затем фиксирует пробел и задаёт только необходимые диагностические вопросы. Никакой «типичной Светланы» из памяти.
2. **Owner Workspace Architect** — Business OS сам ищет внутреннюю когнитивную/операционную перегрузку и предлагает derived interfaces поверх текущих источников: executive cockpit, content cockpit/calendar, commercial map, audience map, product portfolio, case/proof gallery, knowledge-capital library, founder-learning cockpit.
3. **Visual-first internal architecture** — если Светлане трудно понять коммерческую архитектуру/ЦА/контент-систему в тексте, это считается UX-дефектом внутренней системы, а не проблемой владельца.
4. **Capability Expansion Radar** — Skills/Plugins/apps/models/parsers/APIs/other AI ищутся от доказанного capability gap; установка проходит security/privacy/cost/export/rollback/benchmark.
5. **Model/reasoning economics r4** — per-task model decision card, cheapest-proven route for known classes, escalation only on evidence, deterministic rendering outside reasoning, context-size discipline.
6. **Market whitespace / do-not-go challenge** — система обязана возражать против перегретого направления без edge и искать adjacent whitespace; low competition без demand не считается opportunity.
7. **Target audience evidence gate** — визуальные персоны/карты аудитории строятся из VOC/job/payer/channel evidence, а не художественной биографии клиента.
8. **Quick-command bank expanded to 200+** — diagnostics, owner workspace, dashboards, audience, plugins/skills/AI/parsers, model economy, whitespace. Owner still does not need to remember syntax.

## Исполняемые проверки

- `scripts/context_gap_resolver.py` — эталон `USE_CONFIRMED / RETRIEVE_SOURCE / FRESH_RESEARCH / ASK_OWNER_DIAGNOSTIC / MARK_UNKNOWN / LABELED_ASSUMPTION`.
- `tests/test_r4_owner_context_workspace.py` — no-invention + owner workspace contracts.
- `tests/test_r4_capability_model.py` — capability radar + model economics + whitespace + 200+ quick commands.
- `tests/test_100_angle_r4.py` — 100 contract angles across core, product, creative, founder, workspace, tools, model economics, market, platform, site, QA.
- all pre-existing v2.0.9/v2.0.10 regressions must remain green.
- final validation is repeated after clean unzip of the exact ZIP.

## Release interpretation

`PACKAGE QA PASS ≠ INSTALLED RUNTIME VERIFIED`.

Fresh-chat smoke after install must prove:
1. exact build identity;
2. live state recovery without duplicate task creation;
3. no-invention diagnostic behavior on a materially missing owner fact;
4. proactive derived-view recommendation when Sheet/text creates recurring owner friction;
5. current capability/plugin/model search from a real gap, not novelty;
6. cost-aware model route (cheap proven route vs justified escalation);
7. evidence-backed audience/whitespace behavior;
8. Russian owner-facing language.
