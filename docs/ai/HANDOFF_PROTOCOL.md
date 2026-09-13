# HANDOFF_PROTOCOL

Статус: Действующий
Версия: 3.0
Проект: `Докрути`

Handoff — компактная передача реально незавершённой задачи, а не память репозитория.

## 1. Когда создавать

Создавать только при технической блокировке, лимите контекста, смене исполнителя, передаче части работы или плановой остановке большой `DEVELOPMENT/SYSTEM` задачи. Для завершённого PATCH/INTEGRATION не создавать.

## 2. Где хранить

- active: `docs/ai/handoffs/ACTIVE_HANDOFF.md`;
- archive: `docs/ai/handoffs/archive/`.

Active handoff относится только к одной незавершённой задаче. После завершения его архивировать или удалить из active-состояния.

## 3. Формат

```markdown
# HANDOFF: [task]
- TASK_ID:
- TASK_CLASS: PATCH / INTEGRATION / DEVELOPMENT / SYSTEM
- MAIN:
- SOURCE_OF_DECISION:
- WORKING_BRANCH:
- LAST_KNOWN_GOOD_COMMIT:
- RETURN_TO:

## TARGET_PATHS
-
## ОГРАНИЧЕНИЯ
-
## FILES_CHANGED
-
## ВЫПОЛНЕНО
-
## ПРОВЕРЕНО
-
## ACCEPTANCE
-
## OWNER DECISION REQUIRED
- none / exact decision
## ОСТАВШЕЕСЯ
-
## BLOCKERS
-
## NEXT EXACT ACTION
- одно конкретное действие
```

## 4. Приём

Принимать handoff только если совпадает задача. Проверить ветку и последний хороший commit, не повторять зафиксированное исследование, продолжить с `NEXT EXACT ACTION`, не расширять scope, после завершения архивировать.

Сам факт наличия `ACTIVE_HANDOFF.md` не делает его релевантным новой задаче.
