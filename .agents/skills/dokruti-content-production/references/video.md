# Video Production

## Назначение
Производи видео через доказуемую историю и инспекцию финального playable export.

## Рабочая процедура
До монтажа зафиксируй audience, формат, hook/payoff, beat sheet, текст/опоры, storyboard/shot list, capture, provenance/rights, captions, CTA и актуальные delivery specs. После ingest проверь sources/transcript; сделай paper edit/timeline и first cut. Отдельно оцени смысл, удержание, ритм, continuity, framing/safe areas, captions, audio, rights и platform fit. Исправь и посмотри second cut целиком.

## Выход и gate
Video Job хранит asset manifest, timeline/version, review notes, export profile, SHA/path, decoder/playability и inspection refs. Full decode не заменяет visual review. При недоступном tool возобновляй с доказанного шага.

## Исполняемая production-линия

Runtime `runtime/video-production-pipeline.mjs` превращает approved master в pre-production plan: topic → angle → beat-script (hook/setup/payoff/CTA) → формат и длительность → shot-card → asset/rights plan → монтажная последовательность → captions/audio → QA → адаптации и publication package. Никаких новых личных историй или footage система не выдумывает.

По умолчанию выбирай автоматизируемый монтаж `voiceover-motion-graphics`: лицензированные/собственные assets, схема/титры, озвучка только с разрешённым голосом, генерация субтитров, FFmpeg экспорт и ffprobe decode. Talking head включай только если он добавляет доказательство/доверие; если footage Светланы действительно нужен и его нет, план выдаёт shot list с кадрированием, длительностью, звуком и ограничениями приватности и останавливает только этот конкретный клип.

Каждая платформа получает отдельные длительность/кадрирование, безопасные зоны титров, обложку, подпись и export hash. Перед статусом EXPORTED обязательны полный decode и ссылка на просмотр всего клипа; статус платформенной инспекции остаётся PENDING до просмотра адаптированного render. Черновик публикации собирается отдельно для каждого канала. См. `runtime/video-production-pipeline.mjs` и regression `tests/video-production-pipeline.test.mjs`.