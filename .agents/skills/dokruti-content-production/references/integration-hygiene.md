# Canonical branch integration hygiene

Canonical Content Factory находится в `.agents/skills/dokruti-content-production` на canonical repository branch. Если дефект или пакет изменений обнаружен в product-specific branch:

1. Прочитай repo instructions, проверь base branch, HEAD, status и diff. Не переноси продуктовую историю, unrelated dirty files, секреты или продуктовые артефакты.
2. Создай отдельную ветку от актуальной canonical default branch и перенеси только allowlisted Content Factory commit/diff через cherry-pick либо patch. Для восстановления из конкретного продуктового commit проверь результат `git diff --name-status <canonical-base>...<candidate>` и допустимые пути до commit.
3. Сохрани источник переноса в commit trailer `-x` либо в repair evidence. Не переписывай/не force-push продуктовую ветку.
4. После тестов commit только scoped allowlist, push отдельной canonical ветки и прочитай remote branch SHA обратно. Сверь remote SHA с локальным HEAD; при расхождении не объявляй доставку завершённой.

Обычная ежедневная работа остаётся на canonical branch. Product branch используется только как источник изолированного patch, а не как постоянный владелец Skill.
