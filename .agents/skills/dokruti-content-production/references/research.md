# Исследование и факт-проверка

## Назначение
Создай проверяемую основу для каждого существенного утверждения.

## Рабочая процедура
Разбей master на атомарные claims; пометь business/dynamic fact, мнение, вывод и owner-only сведения. Для изменяемого ищи первичный/официальный источник и записывай ref, дату, scope и ограничения. Сверяй event date с publication date. Для чисел проверь единицу, знаменатель, период и выборку. Противоречия сохрани.

## Выход и gate
Claim ledger: claim, type, evidence, checked_at, scope, status SUPPORTED/QUALIFIED/UNKNOWN/CONTRADICTED, permitted wording. UNKNOWN удали или оговори; не повышай уверенность догадкой.
