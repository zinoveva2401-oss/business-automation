# QA и regression

## Назначение
Проверь точную финальную версию и применимые качество, факты, права и delivery.

## Рабочая процедура
Сверь request → brief → master → native adaptations → publication records. Каждая финальная версия имеет revision/hash. Проверь source freshness, UNKNOWN handling, claim/disclosure/link consistency, privacy, rights и state integrity. Для video/media реально проиграй итог; для web проверь renderer; для publication прочитай platform status. Выполни разные sequential reviewer passes и зафиксируй criterion-specific evidence.

## Выход и gate
Material FAIL/UNKNOWN исправь в scope или BLOCKED; общий self-PASS не заменяет доказательства. Регрессия: node --test .agents/skills/dokruti-content-production/tests/*.test.mjs. Роли reviewer не должны подменять production evidence.
