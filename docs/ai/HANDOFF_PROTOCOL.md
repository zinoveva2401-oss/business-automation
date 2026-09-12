# HANDOFF_PROTOCOL

Статус: ACTIVE  
Проект: `Докрути`

Назначение — компактно передавать незавершённую задачу между агентами без повторного исследования.

## Когда нужен

- лимит/контекст заканчивается;
- реальный blocker;
- смена исполнителя;
- передача крупного этапа.

## Где

Активный handoff: `docs/ai/handoffs/ACTIVE_HANDOFF.md` (если каталог/файл используется в текущем workflow).
После завершения активный handoff не должен продолжать управлять новой работой.

## Формат

```markdown
# HANDOFF: [TASK]
- TASK_ID:
- SOURCE_OF_DECISION:
- CREATED_BY:
- WORKING_BRANCH:
- LAST_KNOWN_GOOD_COMMIT:

## MAIN / CURRENT STAGE
## SOURCE OF TRUTH
## LOCKED DECISIONS
## FILES_CHANGED
## DONE
## VERIFIED
## NOT VERIFIED
## BLOCKERS
## NEXT EXACT ACTION
```

Принимающий агент сначала проверяет branch/HEAD и фактическую среду, затем продолжает с `NEXT EXACT ACTION`; не повторяет доказанно закрытое исследование.
