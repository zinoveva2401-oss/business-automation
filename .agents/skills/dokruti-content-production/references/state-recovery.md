# State и recovery

## Назначение
Возобновляй частичный процесс, сохраняя доказательства, revision и идемпотентность.

## Рабочая процедура
Run содержит stable run_id/request fingerprint, portfolio/brand/audience/source-set scope, source freshness/references, lanes/channels, stage, revision, checkpoints, blockers, scope-aware owner authorization, idempotency keys и writeback status. Checkpoint принимается только для текущего `run.stage`; нужны evidence refs и при наличии input/output SHA-256. Resume принимает последний валидный checkpoint на текущей или более ранней стадии и проверяет `proven`, evidence, hashes и immediate next stage. Checkpoint из будущей относительно run стадии недействителен.

## Durable Content System writeback

Храни serialized run, publication receipts и metric-learning decisions в существующей `Контент-система | DOKRUTI | 2026` → `02_Выходы контент-завода` → поле `Примечание` записи, найденной заново по точному `ID выхода`. Добавляй ограниченный marker `<!-- DOKRUTI_CONTENT_FACTORY_STATE_V1 {json} -->`, сохраняя весь human note вне marker. Не добавляй таблицу/колонку и не храни в Git текущие queue/content/prices/secrets. Если output ID ещё не существует — сначала создай или переиспользуй output через существующий owner transaction; не записывай в произвольную строку.

Перед записью прочитай note/state и storage revision/hash; конфликт версии означает остановку и повторное чтение. Записывай только `Примечание`, затем перечитай запись по точному ID и проверь полное совпадение, envelope checksum, run ID и монотонный storage revision. Без read/write capability ставь `PENDING WRITE-BACK`; не называй состояние resumable. Коннекторный adapter обязан разрешать строку по заголовку `ID выхода`/значению ID, передавать compare hash или revision если поддерживается и подтверждать readback.

## Выход и gate
Retry: классифицируй transient/permanent/owner-required; для внешнего side effect сначала reconciliation/readback. Устаревший source перечитай. FAILED/BLOCKED продолжается с последнего валидного proven checkpoint только после его persistent readback; in-memory object сам по себе не восстанавливает run. См. schemas/content-run и runtime modules.
