# Automation Observability + External Capability Integration | r9 FINAL

## Purpose

Make automations operable in production and connect external Skills/Plugins/tools without turning Business OS into a vendor-dependent bundle.

## 1. Workflow observability

For every material automated workflow maintain a compact operational record where technically available:
`workflow / trigger / last run / success-fail / stage failed / latency / retries / tool/API cost or quota / human intervention / QA fail reason / output object ID / write-back status / owner-visible impact / rollback-fallback / last verified`.

Examples: Radar run, Content Package, Publisher, Analytics Collector, media render, product delivery, CRM/payment handoff.

Do not create a second raw analytics warehouse. Operational telemetry belongs in the existing automation/run logs and summarized Business System state.

## 2. Failure classes

Classify failures so the system repairs the correct layer:
`SOURCE / AUTH / RATE LIMIT / TOOL CAPABILITY / MODEL QUALITY / SPEC / DATA / RENDER / PLATFORM/API / PUBLICATION / WRITE-BACK / ANALYTICS / LEGAL-OWNER GATE`.

Repeated failure of the same class must change route or raise a precise blocker; blind retries are not resilience.

## 3. Service-level operating expectations

For recurring workflows define only useful SLO-style expectations, for example:
`must finish before publish deadline / must write back exact ID / must not publish twice / must expose blocked state / must retain rollback evidence`.

Do not invent enterprise-style uptime metrics for a workflow that does not need them.

## 4. Capability route, not vendor dependency

External tool adoption follows:
`PROVEN GAP → CAPABILITY CLASS → CURRENT CANDIDATES → PERMISSIONS/DATA/RIGHTS/COST → SMALL BENCHMARK → ARTIFACT OUTCOME EVAL → ADOPT AS PRIMARY/SECONDARY/FALLBACK/REJECT`.

A plugin is not installed merely because it exists. Installation/connection always requires the actual platform/user authorization path.

## 5. Candidate capability classes discovered during r9 FINAL audit

These are **non-normative candidates** and must be reverified at installation time:
- visual design/prototyping and design-system collaboration — e.g. Figma-class capability;
- production web-app implementation/browser testing — build-web-app-class capability;
- programmatic video/motion/captions/audio — Remotion-class capability;
- behavior analytics/CRO/experimentation/session evidence — PostHog-class capability;
- social scheduling/distribution — Postiz-class capability when our actual channels are supported;
- integration/workflow orchestration — Activepieces-class capability when it improves over current Apps Script/connectors;
- external marketing skill libraries — use only as donor modules for missing methods such as CRO/referral/churn/PR/A-B, not as a second business brain.

Names, availability, plans, APIs and supported channels are dynamic. Recheck official current sources and the actual Plugin Directory/account before adoption.

## 6. Collision and authority rule

External Skill/Plugin may execute a capability but does not become source of business truth. It receives a bounded task, current source snapshot and acceptance from Business OS. It cannot silently overwrite positioning, prices, strategy, methodology, channel cards or Skill core.

## 7. Install/connection checklist

Before owner action, Business OS provides:
`tool/plugin / exact missing capability / where used / permissions requested / data leaving DOKRUTI / paid/free/unknown / current support / test task / success criteria / rollback-removal path / duplicate-risk`.

After connection run one representative benchmark before putting the tool into a production automation.
