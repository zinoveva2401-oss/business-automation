# Карта формул Google Таблицы «Конструктор прибыльных акций для магазина»

## 1. Назначение файла

Этот документ описывает показатели, входные данные, формулы, зависимости и проверки ошибок для сборки Google Таблицы.

Формулы указаны в логике таблицы. При сборке нужно назначить именованные диапазоны, чтобы формулы были понятными и не зависели от случайного смещения ячеек.

## 2. Основные входные данные

| Входное поле | Лист | Зависит от пользователя | Проверка |
|---|---|---|---|
| `retail_price` | `01_Калькулятор` | Да | Больше 0. |
| `purchase_price_input` | `01_Калькулятор` | Да, если известна закупка | Пусто или больше 0. |
| `markup_input` | `01_Калькулятор` | Да, если неизвестна закупка | Пусто или больше 0. |
| `current_units` | `01_Калькулятор` | Да | Больше или равно 0. |
| `stock_units` | `01_Калькулятор` | Желательно | Пусто или больше или равно 0. |
| `period` | `01_Калькулятор` | Да | Значение из списка. |
| `base_promo_costs` | `01_Калькулятор` | Да | Больше или равно 0. |
| `min_profit_keep_rate` | `01_Калькулятор` / `SETTINGS` | Да / настройка | Обычно 90–100%. |
| `mechanic_1`, `mechanic_2`, `mechanic_3` | `01_Калькулятор` | Да | Значение из `MECHANICS_DB`. |
| `discount_pct_1..3` | `01_Калькулятор` | Да, если скидка в % | От 0 до 100%. |
| `discount_rub_1..3` | `01_Калькулятор` | Да, если скидка в рублях | Больше или равно 0. |
| `gift_cost_1..3` | `01_Калькулятор` | Для подарков и бонусов | Больше или равно 0. |
| `expected_growth_pct_1..3` | `01_Калькулятор` | Да | Может быть 0%, но не отрицательное. |
| `extra_costs_1..3` | `01_Калькулятор` | Да | Больше или равно 0. |

## 3. Общие показатели

### 3.1. Расчётная закупочная цена

Если закупочная цена введена, берём её. Если не введена, считаем из наценки.

```text
purchase_price_calc = IF(
  purchase_price_input <> "",
  purchase_price_input,
  retail_price / (1 + markup_input)
)
```

Зависимости: `retail_price`, `purchase_price_input`, `markup_input`.

Проверки:

- если закупочная цена и наценка пустые — ошибка;
- если розничная цена меньше или равна 0 — ошибка;
- если наценка меньше или равна 0 при пустой закупочной цене — ошибка.

### 3.2. Расчётная наценка

```text
markup_calc = (retail_price - purchase_price_calc) / purchase_price_calc
```

Зависимости: `retail_price`, `purchase_price_calc`.

Проверки:

- если закупочная цена равна 0 — ошибка;
- если наценка выше 120% — предупреждение;
- если наценка 150% и выше — критичное предупреждение перепроверить цену.

### 3.3. Проверка согласованности закупочной цены и наценки

Если пользователь ввёл оба значения, таблица считает закупочную цену из наценки и сравнивает с введённой закупкой.

```text
purchase_from_markup = retail_price / (1 + markup_input)
markup_purchase_gap_pct = ABS(purchase_price_input - purchase_from_markup) / purchase_price_input
```

Ошибка / предупреждение:

```text
IF(markup_purchase_gap_pct > 3%, "Закупочная цена и наценка не совпадают. Проверьте цифры", "")
```

### 3.4. Валовая маржа

```text
gross_margin_pct = (retail_price - purchase_price_calc) / retail_price
```

Важно: это не наценка. В интерфейсе рядом нужна подсказка: «Маржа считается от розничной цены».

### 3.5. Валовая прибыль с единицы до акции

```text
base_gross_profit_per_unit = retail_price - purchase_price_calc
```

### 3.6. Базовая выручка

```text
base_revenue = retail_price * current_units
```

### 3.7. Базовая валовая прибыль

```text
base_gross_profit = base_gross_profit_per_unit * current_units
```

## 4. Показатели по каждой акции 1–3

Все формулы ниже повторяются для `promo_1`, `promo_2`, `promo_3`.

### 4.1. Суммарные расходы акции

```text
promo_total_costs_n = base_promo_costs + extra_costs_n
```

### 4.2. Цена после скидки

Если задана процентная скидка:

```text
promo_price_by_pct_n = retail_price * (1 - discount_pct_n)
```

Если задана скидка в рублях:

```text
promo_price_by_rub_n = retail_price - discount_rub_n
```

Итоговая цена:

```text
promo_price_n = IF(discount_rub_n > 0, promo_price_by_rub_n, promo_price_by_pct_n)
```

Проверки:

- цена после скидки меньше 0 — ошибка;
- цена после скидки ниже закупочной цены — критичное предупреждение.

### 4.3. Прогноз продаж после акции

```text
promo_units_n = current_units * (1 + expected_growth_pct_n)
```

Проверки:

- если `promo_units_n > stock_units`, показать предупреждение «Остатка может не хватить»;
- если ожидаемый рост выше 100%, показать предупреждение «Рост продаж выглядит очень высоким».

### 4.4. Выручка после акции

```text
promo_revenue_n = promo_price_n * promo_units_n
```

### 4.5. Валовая прибыль с единицы после акции

```text
promo_gross_profit_per_unit_n = promo_price_n - purchase_price_calc - gift_cost_n
```

Проверка:

```text
IF(promo_gross_profit_per_unit_n <= 0, "Акция убыточна с каждой продажи", "")
```

### 4.6. Валовая прибыль после акции

```text
promo_gross_profit_n = promo_gross_profit_per_unit_n * promo_units_n
```

### 4.7. Итоговая прибыль после расходов

```text
promo_final_profit_n = promo_gross_profit_n - promo_total_costs_n
```

### 4.8. Изменение выручки

```text
revenue_change_rub_n = promo_revenue_n - base_revenue
revenue_change_pct_n = revenue_change_rub_n / base_revenue
```

Проверка: если `base_revenue = 0`, показывать «Нет базовой выручки для сравнения».

### 4.9. Изменение прибыли

```text
profit_change_rub_n = promo_final_profit_n - base_gross_profit
profit_change_pct_n = profit_change_rub_n / base_gross_profit
```

Проверка: если `base_gross_profit = 0`, показывать «Нет базовой прибыли для сравнения».

### 4.10. Точка безубыточности по количеству продаж

```text
break_even_units_n = (base_gross_profit + promo_total_costs_n) / promo_gross_profit_per_unit_n
```

Если `promo_gross_profit_per_unit_n <= 0`, вместо числа показывать «Не считается: прибыль с единицы ниже нуля».

### 4.11. Минимальный необходимый рост продаж

```text
required_growth_units_n = break_even_units_n - current_units
required_growth_pct_n = required_growth_units_n / current_units
```

Если `current_units = 0`, показывать «Нет текущих продаж для сравнения».

### 4.12. Максимальная скидка до себестоимости

```text
max_discount_to_cost_pct = 1 - (purchase_price_calc / retail_price)
```

### 4.13. Максимальная скидка для минимальной маржи

```text
min_price_for_margin = purchase_price_calc / (1 - min_margin_pct)
max_discount_for_margin_pct = 1 - (min_price_for_margin / retail_price)
```

### 4.14. Максимальная скидка для сохранения целевой прибыли

```text
target_profit = base_gross_profit * min_profit_keep_rate
needed_profit_per_unit_n = (target_profit + promo_total_costs_n) / promo_units_n
min_price_for_target_profit_n = purchase_price_calc + gift_cost_n + needed_profit_per_unit_n
max_discount_for_target_profit_pct_n = 1 - (min_price_for_target_profit_n / retail_price)
```

### 4.15. Рекомендуемая безопасная скидка

```text
safe_discount_pct_n = MIN(
  max_discount_to_cost_pct,
  max_discount_for_margin_pct,
  max_discount_for_target_profit_pct_n,
  max_discount_default_pct
)
```

### 4.16. Запас прочности

```text
safety_buffer_units_n = promo_units_n - break_even_units_n
```

### 4.17. ROI акции

```text
promo_roi_n = IF(
  promo_total_costs_n = 0,
  "Расходов на акцию нет",
  (promo_final_profit_n - base_gross_profit) / promo_total_costs_n
)
```

### 4.18. Риск акции

```text
risk_level_n = IFS(
  promo_gross_profit_per_unit_n <= 0, "Критичный",
  promo_final_profit_n < 0, "Критичный",
  required_growth_pct_n > 100%, "Критичный",
  required_growth_pct_n > 50%, "Высокий",
  discount_pct_n > safe_discount_pct_n, "Высокий",
  promo_final_profit_n < base_gross_profit * min_profit_keep_rate, "Средний",
  TRUE, "Низкий"
)
```

### 4.19. Итоговый статус

```text
status_n = IFS(
  promo_gross_profit_per_unit_n <= 0, "Не запускать",
  promo_final_profit_n < 0, "Не запускать",
  required_growth_pct_n > 100%, "Не запускать",
  discount_pct_n > safe_discount_pct_n, "Опасно",
  promo_final_profit_n >= base_gross_profit, "Можно запускать",
  promo_final_profit_n >= base_gross_profit * min_profit_keep_rate, "Можно тестировать",
  TRUE, "Осторожно"
)
```

### 4.20. Итоговый балл акции

```text
profit_score_n = MAX(0, MIN(35, 35 * promo_final_profit_n / base_gross_profit))
safe_discount_score_n = IF(discount_pct_n <= safe_discount_pct_n, 20, 10)
growth_score_n = IFS(required_growth_pct_n <= 20%, 15, required_growth_pct_n <= 50%, 10, required_growth_pct_n <= 100%, 5, TRUE, 0)
stock_score_n = IF(stock_units = "", 7, IF(promo_units_n <= stock_units, 10, 0))
simplicity_score_n = XLOOKUP(mechanic_n, MECHANICS_DB[name], MECHANICS_DB[simplicity_score])
goal_score_n = XLOOKUP(mechanic_n, MECHANICS_DB[name], MECHANICS_DB[goal_match_score])
total_score_n = profit_score_n + safe_discount_score_n + growth_score_n + stock_score_n + simplicity_score_n + goal_score_n
```

## 5. Сравнение трёх акций

### 5.1. Лучший вариант

Лучший вариант выбирается по максимальному баллу среди акций, которые не имеют статус `Не запускать`.

```text
best_promo_score = MAX(FILTER(total_score_1:total_score_3, status_1:status_3 <> "Не запускать"))
best_promo_name = XLOOKUP(best_promo_score, total_score_1:total_score_3, mechanic_1:mechanic_3)
```

Если все варианты имеют статус `Не запускать`, показывать текст: «Безопасного варианта среди выбранных акций нет».

## 6. Проверки ошибок

| Проверка | Условие | Сообщение |
|---|---|---|
| Нет розничной цены | `retail_price = ""` | Введите розничную цену. |
| Цена некорректна | `retail_price <= 0` | Розничная цена должна быть больше нуля. |
| Нет закупки и наценки | `purchase_price_input = "" AND markup_input = ""` | Введите закупочную цену или наценку. |
| Закупка отрицательная | `purchase_price_input < 0` | Закупочная цена не может быть отрицательной. |
| Наценка отрицательная | `markup_input < 0` | Наценка не может быть отрицательной. |
| Закупка выше цены | `purchase_price_calc > retail_price` | Закупочная цена выше розничной. Проверьте данные. |
| Наценка выше 120% | `markup_calc > 120%` | Наценка выше обычного диапазона малого бизнеса. Проверьте цифры. |
| Наценка 150%+ | `markup_calc >= 150%` | Наценка выглядит завышенной. Не считайте это нормой без проверки. |
| Расхождение закупки и наценки | `markup_purchase_gap_pct > 3%` | Закупочная цена и наценка не совпадают. |
| Скидка отрицательная | `discount_pct_n < 0 OR discount_rub_n < 0` | Скидка не может быть отрицательной. |
| Скидка выше 100% | `discount_pct_n > 100%` | Скидка не может быть больше 100%. |
| Расходы отрицательные | `promo_total_costs_n < 0` | Расходы не могут быть отрицательными. |
| Продажи отрицательные | `current_units < 0` | Продажи не могут быть отрицательными. |
| Остаток отрицательный | `stock_units < 0` | Остаток не может быть отрицательным. |
| Не хватает остатка | `promo_units_n > stock_units` | Остатка может не хватить для такого роста продаж. |
| Цена ниже себестоимости | `promo_price_n < purchase_price_calc` | Цена после скидки ниже закупочной цены. |
| Минус с каждой продажи | `promo_gross_profit_per_unit_n <= 0` | Акция убыточна с каждой продажи. |
| Рост выше 100% | `required_growth_pct_n > 100%` | Для окупаемости нужен рост продаж выше 100%. Это высокий риск. |

## 7. Зависимости для листов

| Видимый лист | Берёт данные из | Отдаёт данные в |
|---|---|---|
| `00_Начало` | Нет | Переход на `01_Калькулятор`. |
| `01_Калькулятор` | `LOOKUPS`, `MECHANICS_DB` | `CALCULATIONS`, `CHECKS`. |
| `02_Дашборд` | `CALCULATIONS`, `CHECKS`, `SETTINGS` | Пользовательский вывод. |
| `03_Сравнение` | `CALCULATIONS`, `MECHANICS_DB` | Пользовательский вывод. |
| `04_Библиотека` | `MECHANICS_DB`, `LOOKUPS` | Пользовательский выбор механик. |
| `SETTINGS` | Нет | Все расчёты и статусы. |
| `FORMULAS` | Нет | Документация формул. |
| `CALCULATIONS` | `01_Калькулятор`, `SETTINGS`, `MECHANICS_DB` | `02_Дашборд`, `03_Сравнение`. |
| `CHECKS` | `01_Калькулятор`, `CALCULATIONS` | `02_Дашборд`. |
| `LOOKUPS` | Нет | Выпадающие списки. |
| `MECHANICS_DB` | Нет | `01_Калькулятор`, `04_Библиотека`, `CALCULATIONS`. |
