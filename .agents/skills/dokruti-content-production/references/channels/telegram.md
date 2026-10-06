# Channel profile: Telegram

## Native adaptation
Форма — пост/серия, сообщение, media или poll по текущей задаче. Начало сразу объясняет ценность; абзацы удобны для мобильной ленты; ссылка и CTA стоят в понятном контексте. Проверь entities/formatting, preview и размер.

## Capability and publication contract
Проверь конкретный bot/user right, destination и send/readback. Перед retry после timeout ищи результат по message marker/external ID. Не меняй действующий publisher; этот профиль не модифицирует его код. Метрики только из подтверждённого live источника.

## Fallback and recovery
При неподтверждённом API подготовь ручной draft. Неоднозначный результат пометь UNKNOWN и reconcile по readback; не повторяй слепо.

## Required record
Сохрани parent master/revision, channel, native format, draft hash, capability evidence/date, rights/disclosure, idempotency key, status, external readback и next step. Динамические platform rules и доступ проверяются во время исполнения; этот профиль сам не доказывает актуальную capability.

## Existing integration contract regression

Сохраняй текущий Telegram Publisher как неизменённый executor. Совместимость проверяется по реальной схеме записи `02_Выходы контент-завода`: `TG route`, `TG media manifest`, `TG interaction payload`, `TG publish options` плюс `ID выхода`, `ID материала`, channel, format, text/brief, CTA, visual, status, schedule/time, platform publication ID, URL, actual time. Проверяемый receipt mapping: approved record → publisher send → external `message_id`/URL/time → publication fields и соответствующая строка `08_Единая аналитика` с Telegram message ID и provenance. Existing publisher return/message fields are contract fixtures; tests must not search for terminology in this Markdown. No standalone Apps Script publisher implementation is in this repository, so contract tests establish adapter compatibility, not live execution health. Missing unique reach remains UNKNOWN; displayed views are not unique reach. Failed analytics fetch is UNKNOWN/NO_DATA, not zero; reaction totals can include publisher seed.
