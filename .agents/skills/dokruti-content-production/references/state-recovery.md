# State и recovery

## Назначение
Возобновляй частичный процесс, сохраняя доказательства, revision и идемпотентность.

## Рабочая процедура
Run содержит stable run_id/request fingerprint, scope, source freshness/references, lanes/channels, stage, revision, checkpoints, blockers, gates, idempotency keys и writeback status. После существенной стадии сохраняй immutable checkpoint: step, input/output hash/ref, evidence, timestamp, next step. Не сериализуй credentials и лишний private data. Переходи только по разрешённой state machine.

## Выход и gate
Retry: классифицируй transient/permanent/owner-required; для внешнего side effect сначала reconciliation/readback. Устаревший source перечитай. FAILED/BLOCKED продолжается с последнего доказанного checkpoint, а не с предположения. См. schemas/content-run и runtime module.
