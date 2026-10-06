# Channel profile: Telegram

## Native adaptation
Форма — пост/серия, сообщение, media или poll по текущей задаче. Начало сразу объясняет ценность; абзацы удобны для мобильной ленты; ссылка и CTA стоят в понятном контексте. Проверь entities/formatting, preview и размер.

## Capability and publication contract
Проверь конкретный bot/user right, destination и send/readback. Перед retry после timeout ищи результат по message marker/external ID. Не меняй действующий publisher; этот профиль не модифицирует его код. Метрики только из подтверждённого live источника.

## Fallback and recovery
При неподтверждённом API подготовь ручной draft. Неоднозначный результат пометь UNKNOWN и reconcile по readback; не повторяй слепо.

## Required record
Сохрани parent master/revision, channel, native format, draft hash, capability evidence/date, rights/disclosure, idempotency key, status, external readback и next step. Динамические platform rules и доступ проверяются во время исполнения; этот профиль сам не доказывает актуальную capability.
