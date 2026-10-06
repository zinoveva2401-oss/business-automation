# Аналитика и learning

## Назначение
Выводи решения из сопоставимых измерений без неподтверждённой причинности.

## Рабочая процедура
Определи вопрос и metric definition; запиши source, window, timezone, denominator, attribution, sample size, lag и missingness. Проверь дубли, смену API, delayed data и сопоставимость форматов. Различай reach, impressions, views, clicks, leads и conversions. Отделяй observed value от causal hypothesis.

## Выход и gate
Metric/Learning хранит readback refs без credentials, расчёт, качество, uncertainty, interpretation, experiment и writeback state. Не меняй автоматически бренд/правовые claims. Нет записи в Content System — PENDING WRITE-BACK.

Machine decision enum: `SCALE`, `ITERATE`, `REPACKAGE`, `RETEST`, `STOP`, `INSUFFICIENT_DATA`; вместе с confidence (0..1) и массивом basis. Недостаточные, отсутствующие или несопоставимые измерения дают `INSUFFICIENT_DATA`, а не нули. После одного batch approval ежедневная публикация и сбор доступных метрик идут внутри точного разрешённого scope; только выход за срок/хеш/канал требует нового решения. Решения должны учитывать portfolio objective mix и не оптимизировать один reach metric ценой trust, return, demand или expertise.
