# Публикация и доставка

## Назначение
Доведи одобренную версию до нужного destination, не создавая дубликатов и ложного статуса.

## Рабочая процедура
Перед side effect проверь owner authorization, account/destination, актуальную capability, preview, format, rights/legal/consent, timezone/schedule, canonical link и idempotency key. Отличай DRAFT, READY, SCHEDULED, SENDING, PUBLISHED, FAILED, UNKNOWN. При timeout сначала выполни readback по external ID/hash/destination; не повторяй слепой send. Owner-only OAuth и необратимую публикацию не обходи. Не логируй секреты.

## Выход и gate
Записывай channel/revision/hash/key/destination, attempt/result, external id/URL, timestamp и verification. Только live platform readback подтверждает published; HTTP success недостаточен.

Publication contract дополнительно фиксирует method (`API`, `BROWSER`, `MANUAL`), account, destination, scheduled_at и timezone, каждый attempt с timestamp/result/error и reconciliation status/evidence. После таймаута readback сначала проверяет destination, payload hash/marker и external ID; неоднозначный результат остаётся UNKNOWN и не повторяется слепо. После publish записывай доступные метрики в существующую аналитику с provenance; неизвестная метрика остаётся UNKNOWN.
