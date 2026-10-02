# AI Capability Benchmark / Model & Tool Economics

## Purpose

Choose the cheapest route that reliably completes the task, based on evidence rather than brand/model loyalty.

## 1. Capability registry

For each materially used AI/tool/environment keep a current capability card in `04_СИСТЕМА` or linked technical source:
`tool/model / tasks it is good at / limits / context/file access / subagents / browser / code / connectors / cost-quota / latency / failure modes / data-risk / fallback / last verified date`.

Do not hardcode today's model names as permanent architecture.

## 2. Controlled benchmark

When choosing between technical/production executors, compare on the SAME representative task where practical:
- elapsed time;
- tokens/quota/cost if available;
- files/sources read;
- unnecessary actions;
- result quality;
- requirements missed;
- rework cycles;
- actual QA/build/browser result;
- owner manual hours.

Representative tests may include:
- small patch;
- content/product integration;
- larger production task;
- research synthesis.

## 3. Routing rule

Assign operational roles only after evidence:
`routine cheap work / deep reasoning / code-production / browser-work / research / media / fallback`.

A smaller/cheaper model is preferred when it passes the acceptance bar. A stronger model/tool is justified when failure/rework cost is greater than the saved quota.

## 4. No install for curiosity

Before adding a plugin/skill/local tool/model:
1. define capability gap;
2. check built-in and installed options;
3. check official/current requirements and legal availability;
4. estimate device load, cost and maintenance;
5. define rollback/removal path;
6. run the smallest proof.

Do not make Svetlana debug a chain of speculative installations.

## 5. Periodic re-benchmark trigger

Re-benchmark only when:
- a major capability/version changes;
- recurring failures appear;
- cost/limits change materially;
- a new tool could replace expensive manual work;
- current route becomes unavailable.

Do not benchmark tools for entertainment while MAIN is blocked.

## 6. Eval-driven downshift

Следуй принципу `strong baseline → same acceptance on cheaper route → downshift if PASS`. Не выбирай дорогую модель только по престижу. Для каждой существенной оптимизации сравни не только токены, но и rework/owner rescue/elapsed time. Детали: [model-economics-routing.md](model-economics-routing.md).
