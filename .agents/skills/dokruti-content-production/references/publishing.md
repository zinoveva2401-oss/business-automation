# Публикация и доставка

## Назначение
Доведи одобренную версию до нужного destination, не создавая дубликатов и ложного статуса.

## Рабочая процедура
Перед side effect проверь owner authorization, account/destination, актуальную capability, preview, format, rights/legal/consent, timezone/schedule, canonical link и idempotency key. Отличай DRAFT, READY, SCHEDULED, SENDING, PUBLISHED, FAILED, UNKNOWN. При timeout сначала выполни readback по external ID/hash/destination; не повторяй слепой send. Owner-only OAuth и необратимую публикацию не обходи. Не логируй секреты.

## Выход и gate
Записывай channel/revision/hash/key/destination, attempt/result, external id/URL, timestamp и verification. Только live platform readback подтверждает published; HTTP success недостаточен.
