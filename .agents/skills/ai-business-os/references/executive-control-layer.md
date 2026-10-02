# Executive Control Layer v2.0.9

## Purpose

Give Svetlana one visual director view of the business without creating a second source of truth. This layer is derived from canonical operational/product/content/money sources and exists to answer: `что сейчас / что застряло / что приносит деньги / что требует решения / что будет дальше`.

## 1. Minimum owner view

Show only supported current facts, as applicable:
- one `СЕЙЧАС` action;
- active MAIN + parent `RUN-ID / CURRENT STAGE / NEXT ACTION`;
- genuine owner decisions count and exact choices;
- hard blockers / write-back inconsistency / automation health;
- confirmed revenue/cost/cash facts with `as-of` date;
- active products and stage/readiness;
- content/Growth outputs and evidence state;
- READY-TO-SELL / payment-delivery readiness;
- stale/unknown/data-not-available markers.

## 2. Derived, not duplicated

The dashboard/map never becomes a manually maintained parallel ledger. It reads current canonical sources and stores only display/config metadata where needed. If source data is missing, show `UNKNOWN / STALE / DATA NOT AVAILABLE`; do not infer green status.

## 3. Tool-agnostic

Google Sheets, Looker Studio (formerly Google Data Studio), another BI layer or a future agent UI may render the view. Tool choice is a dynamic implementation decision based on actual connectors, cost, account, latency and maintenance. The Business OS contract is the data/decision view, not one vendor.

## 4. Owner vs system action

Never mix `Светлане нужно решить` with `система должна выполнить`. Routine executor/QA/write-back actions stay system-owned. A visible owner card exists only for a genuine owner gate.

## 5. Freshness and drill-down

Each material KPI/status must be traceable to its current source and freshness. The owner view may summarize, but agents need drill-down links/IDs to the parent run, work row, decision, product/content object or finance evidence.

## 6. Structural restraint

Do not create new sheets/folders just to make a dashboard look complete. Reuse current structures; add a storage/view surface only after a proven structural gap.

## Owner Workspace evolution

Executive Control Layer отвечает за «что происходит», а Owner Workspace Architecture — за «как Светлане удобнее это видеть и использовать».

Если current Sheet остаётся хорошим storage, но owner-view требует постоянного чтения строк, допускается derived interactive cockpit. Он не хранит отдельный truth и должен иметь drill-down/freshness.

Типовые view upgrades: executive cockpit, content calendar with previews, commercial architecture map, evidence-backed audience map, product portfolio, case/proof gallery, knowledge-capital library, founder-learning cockpit.
