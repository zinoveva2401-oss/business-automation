# Model Economics & Reasoning Router / качество без лишнего расхода

## Purpose

Использовать дорогую модель там, где её интеллект окупается, и дешёвую/быструю — там, где задача уже разложена и проверяема. Модель выбирается по фактической доступности и текущим тарифам/лимитам, а не по вечному имени в Skill.

## 1. Baseline-then-downshift

Для нового сложного класса задачи:
1. один representative benchmark на сильном доступном маршруте;
2. зафиксировать acceptance/evidence;
3. попробовать более дешёвую модель/меньший reasoning на том же типе подзадачи;
4. если quality bar сохранён — использовать дешевле;
5. если нет — эскалировать только участок, который реально требует интеллекта.

## 2. Split thinking from rendering

Для video/media/site/product production не держи strongest model на всех шагах.

Типичная схема:
- сильная модель: постановка задачи, креативная концепция, сложный reasoning, критический review;
- средняя/дешёвая: инвентаризация файлов, транскрипция/структурирование, повторяемые правки, подготовка вариантов, код по уже frozen spec;
- deterministic tools/scripts: рендер, ffmpeg, конвертация, проверки размеров/битрейта, тесты;
- сильная модель снова: финальная критика и repair decision.

## 3. Reasoning budget

Начинай с минимального reasoning, который стабильно проходит acceptance. Повышай только если:
- задача неоднозначна;
- нужен новый архитектурный выбор;
- высоки деньги/право/репутация/безопасность;
- предыдущий результат пропустил существенные требования;
- цена переделки выше, чем дополнительный reasoning.

Не использовать максимальный reasoning для механической нарезки/рендера/копирования файлов.

## 4. Context cost

Сокращай расход прежде всего за счёт качества контекста:
- just-in-time retrieval вместо загрузки всей базы;
- compact current-state summary;
- frozen spec/ledger вместо длинной истории чата;
- повторное использование cached/static context where surface supports it;
- отдельные узкие subagents только для независимых веток;
- не пересылать бинарные/гигантские файлы в reasoning-контекст, если инструмент может обработать их напрямую.

## 5. Usage feedback loop

Когда поверхность показывает usage/tokens/credits:
`task class → model → reasoning → context size → tools/subagents → result quality → rework → total usage`.

Используй это для routing следующего аналогичного задания. Не оптимизируй только input tokens: output-heavy/fast/subagent workflows тоже могут стоить дорого.

## 6. Current model names are dynamic

Сегодняшние Sol/Terra/Luna/Astra и будущие названия — runtime facts. Stable Skill хранит роли, а не model IDs: `frontier / balanced / fast-cheap / specialist`. По умолчанию дочерний/критический проход наследует текущую доказанную parent model+reasoning. Явно pin-ить другую модель можно только после current availability + compatibility + quota/cost preflight и измеримого выигрыша. Никогда не заменяй текущую модель на «более сильную» только по названию.

## r4: Per-task model decision card

Для material task система внутренне собирает короткую карточку:
`task class / risk of error / novelty / ambiguity / context size / deterministic share / current proven model / cheaper candidate / reasoning level / expected acceptance / quota-cost / escalation trigger`.

Правила:
- если Luna/fast-cheap route уже доказан на этом task class — не эскалируй автоматически к Sol/frontier;
- если Sol/strong route дал такой же дефект, как дешёвая модель, проблема может быть в context/spec/tool route, а не в «недостатке интеллекта»;
- максимальный reasoning не default; используй его только при доказанной необходимости;
- media render/transcode/image resize/file copy/test execution должны по возможности выполняться deterministic tool, а не потреблять reasoning tokens;
- большой контекст сначала индексируй/фильтруй/сжимай; не отправляй модели весь архив только потому, что окно контекста большое;
- окончательное сравнение моделей делай representative benchmark, а не по впечатлению от одного разговора.

После существенного benchmark сохраняй компактный learning в существующий executor/capability record: `что проверяли / модель+режим / результат / дефекты / стоимость/лимит / owner rescue / решение`.

Для известного повторяемого task class используй **самый дешёвый ранее доказанный route**, пока он продолжает проходить acceptance; повышение уровня — только по evidence.

## Executor role economics | r9 FINAL

Cost routing includes rework and owner rescue. A cheaper tool that repeatedly causes Major defects can be more expensive than a stronger route. Conversely, a premium model/tool that adds no measurable artifact advantage should be downshifted.

Use task-class evidence from [Artifact Outcome Evals / Executor Graduation](artifact-outcome-executor-graduation.md) to set `PRIMARY / SECONDARY / IMPLEMENTER-ONLY / REVIEWER-ONLY / FALLBACK / REJECTED` roles. Repeated failure must change route/role before another prompt-expansion cycle.
