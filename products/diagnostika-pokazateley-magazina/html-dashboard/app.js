'use strict';

const SIGNIFICANCE_THRESHOLD = 0.05;
const STORAGE_KEY = 'diagnostika-pokazateley-magazina-v1';

const FIELD_DEFINITIONS = [
  { key: 'revenue', label: 'Выручка после возвратов, ₽', inputMode: 'decimal' },
  { key: 'checks', label: 'Количество чеков', inputMode: 'numeric', positive: true, integer: true },
  { key: 'items', label: 'Количество проданных товаров', inputMode: 'numeric', positive: true, integer: true },
  { key: 'visitors', label: 'Количество посетителей', inputMode: 'numeric', positive: true, integer: true },
  { key: 'markup', label: 'Средняя торговая наценка, %', inputMode: 'decimal' }
];

function parseNumber(value) {
  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized || !/^-?\d+(?:\.\d+)?$/.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function validatePeriod(raw) {
  const values = {};
  const errors = {};
  FIELD_DEFINITIONS.forEach((field) => {
    const original = raw[field.key];
    if (String(original ?? '').trim() === '') {
      errors[field.key] = 'Заполните обязательное поле.';
      return;
    }
    const value = parseNumber(original);
    if (value === null) {
      errors[field.key] = 'Введите число без букв и посторонних символов.';
      return;
    }
    if (value < 0) {
      errors[field.key] = 'Значение не может быть отрицательным.';
      return;
    }
    if (field.positive && value === 0) {
      errors[field.key] = 'Значение должно быть больше нуля.';
      return;
    }
    if (field.integer && !Number.isInteger(value)) {
      errors[field.key] = 'Введите целое число';
      return;
    }
    values[field.key] = value;
  });

  if (!errors.checks && !errors.visitors && values.checks > values.visitors) {
    errors.checks = 'Количество чеков не может быть больше посетителей.';
  }
  if (!errors.items && !errors.checks && values.items < values.checks) {
    errors.items = 'Количество товаров не может быть меньше чеков.';
  }
  return { valid: Object.keys(errors).length === 0, values, errors };
}

function calculateMetrics(data) {
  return {
    averageCheck: data.revenue / data.checks,
    conversion: data.checks / data.visitors * 100,
    itemsPerCheck: data.items / data.checks,
    averageItemPrice: data.revenue / data.items,
    grossProfit: data.revenue * data.markup / (100 + data.markup)
  };
}

function percentageChange(first, second) {
  if (first === 0) throw new Error('Нельзя рассчитать изменение: значение первого периода равно нулю.');
  return (second - first) / Math.abs(first);
}

// Небольшой допуск защищает точную границу −5% от погрешности двоичных дробей JavaScript.
function isDecline(change) { return change < -SIGNIFICANCE_THRESHOLD - 1e-10; }

function comparePeriods(first, second) {
  const firstMetrics = calculateMetrics(first);
  const secondMetrics = calculateMetrics(second);
  const changes = {
    traffic: percentageChange(first.visitors, second.visitors),
    conversion: percentageChange(firstMetrics.conversion, secondMetrics.conversion),
    averageCheck: percentageChange(firstMetrics.averageCheck, secondMetrics.averageCheck),
    profitability: percentageChange(firstMetrics.grossProfit, secondMetrics.grossProfit),
    itemsPerCheck: percentageChange(firstMetrics.itemsPerCheck, secondMetrics.itemsPerCheck),
    averageItemPrice: percentageChange(firstMetrics.averageItemPrice, secondMetrics.averageItemPrice),
    checks: percentageChange(first.checks, second.checks),
    revenue: first.revenue === 0 ? null : percentageChange(first.revenue, second.revenue),
    markup: first.markup === 0 ? (second.markup === 0 ? 0 : null) : percentageChange(first.markup, second.markup)
  };
  return { firstData: first, secondData: second, firstMetrics, secondMetrics, changes, diagnosis: diagnose(changes) };
}

function diagnose(changes) {
  const down = {
    traffic: isDecline(changes.traffic),
    conversion: isDecline(changes.conversion),
    averageCheck: isDecline(changes.averageCheck),
    profitability: isDecline(changes.profitability)
  };
  let zone = 'Не выявлена';

  if (down.traffic && down.conversion && down.averageCheck && down.profitability) {
    zone = 'Системное снижение';
  } else if (down.profitability && (
    (changes.revenue !== null && changes.revenue >= -SIGNIFICANCE_THRESHOLD && isDecline(changes.markup)) ||
    (isDecline(changes.markup) && changes.profitability < changes.traffic && changes.profitability < changes.conversion && changes.profitability < changes.averageCheck)
  )) {
    zone = 'Прибыльность';
  } else if (down.traffic && down.conversion) {
    zone = changes.traffic <= changes.conversion ? 'Трафик' : 'Конверсия';
  } else if (down.traffic && !down.conversion && isDecline(changes.checks)) {
    zone = 'Трафик';
  } else if (!down.traffic && down.conversion && (isDecline(changes.checks) || changes.checks < changes.traffic)) {
    zone = 'Конверсия';
  } else if (down.averageCheck && changes.traffic >= changes.averageCheck && changes.conversion >= changes.averageCheck) {
    zone = 'Средний чек';
  } else if (down.profitability) {
    zone = 'Прибыльность';
  }

  const content = diagnosisContent(zone, changes, down);
  const risk = additionalRisk(zone, down);
  return { zone, fact: content.fact, meaning: content.meaning, risk };
}

function diagnosisContent(zone, changes, down) {
  if (zone === 'Трафик') return {
    fact: down.conversion ? 'Трафик снизился сильнее конверсии.' : 'Посетителей стало меньше, при этом конверсия существенно не ухудшилась.',
    meaning: 'Магазин получает недостаточно входящего потока.'
  };
  if (zone === 'Конверсия') return {
    fact: down.traffic
      ? 'Конверсия снизилась сильнее трафика.'
      : (isDecline(changes.checks)
        ? 'Трафик сохранился или вырос, но покупок стало меньше.'
        : 'Трафик вырос быстрее количества покупок, поэтому конверсия снизилась.'),
    meaning: 'Посетители приходят, но реже совершают покупку.'
  };
  if (zone === 'Средний чек') {
    const itemsDown = isDecline(changes.itemsPerCheck);
    const priceDown = isDecline(changes.averageItemPrice);
    let fact = 'Средний чек снизился, но отдельный внутренний фактор не выделился существенно.';
    if (itemsDown && priceDown) fact = 'Средний чек снизился одновременно из-за количества товаров и средней цены.';
    else if (itemsDown) fact = 'Средний чек снизился из-за меньшего количества товаров в покупке.';
    else if (priceDown) fact = 'Средний чек снизился из-за уменьшения средней цены проданного товара.';
    return { fact, meaning: 'Сумма одной покупки стала меньше.' };
  }
  if (zone === 'Прибыльность') return {
    fact: isDecline(changes.revenue)
      ? 'Выручка снизилась, а ориентировочная валовая прибыль сократилась ещё сильнее.'
      : 'Выручка сохранилась или выросла, но ориентировочная валовая прибыль снизилась.',
    meaning: 'Магазин продаёт, но зарабатывает меньше с этих продаж.'
  };
  if (zone === 'Системное снижение') return {
    fact: 'Одновременно ухудшились трафик, конверсия, средний чек и прибыльность.',
    meaning: 'Проблема не ограничивается одним показателем.'
  };
  return {
    fact: 'Ключевые показатели не ухудшились существенно.',
    meaning: 'Система работает стабильно относительно первого периода.'
  };
}

function additionalRisk(zone, down) {
  if (zone === 'Системное снижение' || zone === 'Не выявлена') return '';
  const order = ['traffic', 'conversion', 'averageCheck', 'profitability'];
  const names = { traffic: 'Трафик', conversion: 'Конверсия', averageCheck: 'Средний чек', profitability: 'Прибыльность' };
  return order.map((key) => names[key]).find((name, index) => down[order[index]] && name !== zone) || '';
}

function analyze(mode, rawFirst, rawSecond) {
  const first = validatePeriod(rawFirst);
  if (!first.valid) return { valid: false, period1: first };
  if (mode === 'current') return { valid: true, mode, firstData: first.values, firstMetrics: calculateMetrics(first.values) };
  if (first.values.revenue === 0) {
    first.valid = false;
    first.errors.revenue = 'Для сравнения выручка первого периода должна быть больше нуля';
  }
  const second = validatePeriod(rawSecond || {});
  if (!first.valid || !second.valid) return { valid: false, period1: first, period2: second };
  return { valid: true, mode, ...comparePeriods(first.values, second.values) };
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

function formatChange(value) {
  const percent = value * 100;
  return `${percent > 0 ? '+' : ''}${formatNumber(percent, 1)}%`;
}

function initApp() {
  const form = document.querySelector('#diagnostic-form');
  if (!form) return;
  const modeInputs = [...document.querySelectorAll('input[name="mode"]')];
  const periodElements = [...document.querySelectorAll('.period')];
  const button = document.querySelector('#diagnose-button');
  const clearButton = document.querySelector('#clear-button');
  const dialog = document.querySelector('#clear-dialog');

  periodElements.forEach((element, periodIndex) => {
    const fields = element.querySelector('.fields');
    FIELD_DEFINITIONS.forEach((field) => {
      const id = `p${periodIndex + 1}-${field.key}`;
      fields.insertAdjacentHTML('beforeend', `<div class="field"><label for="${id}"><span>${field.label}</span><span class="required-mark" aria-hidden="true">•</span></label><input id="${id}" name="${id}" inputmode="${field.inputMode}" autocomplete="off" aria-describedby="${id}-error"><p class="field-error" id="${id}-error"></p></div>`);
    });
  });

  const currentMode = () => modeInputs.find((input) => input.checked).value;
  const readPeriod = (index) => Object.fromEntries(FIELD_DEFINITIONS.map((field) => [field.key, document.querySelector(`#p${index}-${field.key}`).value]));
  const paintErrors = (index, validation) => FIELD_DEFINITIONS.forEach((field) => {
    const input = document.querySelector(`#p${index}-${field.key}`);
    const error = document.querySelector(`#p${index}-${field.key}-error`);
    const message = validation?.errors?.[field.key] || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = message;
  });
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: currentMode(), period1: readPeriod(1), period2: readPeriod(2) })); } catch (_) { /* local file privacy settings may disable storage */ }
  };
  const updateButton = (showErrors = false) => {
    const first = validatePeriod(readPeriod(1));
    const second = currentMode() === 'compare' ? validatePeriod(readPeriod(2)) : { valid: true };
    const comparisonRevenueIsZero = currentMode() === 'compare' && first.valid && first.values.revenue === 0;
    if (comparisonRevenueIsZero) {
      first.valid = false;
      first.errors.revenue = 'Для сравнения выручка первого периода должна быть больше нуля';
    }
    button.disabled = !(first.valid && second.valid);
    if (showErrors || comparisonRevenueIsZero) paintErrors(1, first);
    if (showErrors && currentMode() === 'compare') paintErrors(2, second);
  };

  function setMode(mode) {
    const comparison = mode === 'compare';
    periodElements[1].hidden = !comparison;
    document.querySelector('.periods-grid').classList.toggle('is-comparison', comparison);
    periodElements[0].querySelector('legend').textContent = comparison ? 'Период 1' : 'Текущий период';
    document.querySelector('#input-title').textContent = comparison ? 'Введите два сопоставимых периода' : 'Введите данные за один период';
    document.querySelector('#input-description').textContent = comparison ? 'Одинаковая длительность и условия сравнения. Все поля обязательны.' : 'Все пять показателей обязательны.';
    document.querySelector('#mode-hint').textContent = comparison ? 'Найдите главную слабую зону и один дополнительный риск.' : 'Рассчитайте базовые показатели без преждевременных выводов.';
    updateButton();
  }

  function metricCard(label, value, change) {
    const direction = change === undefined ? '' : (change < -SIGNIFICANCE_THRESHOLD ? 'down' : change > SIGNIFICANCE_THRESHOLD ? 'up' : '');
    return `<div class="metric"><span class="metric-label">${label}</span><strong>${value}</strong>${change === undefined ? '' : `<span class="metric-change ${direction}">${formatChange(change)} к периоду 1</span>`}</div>`;
  }

  function render(result) {
    const target = document.querySelector('#result-content');
    if (result.mode === 'current') {
      const m = result.firstMetrics;
      target.innerHTML = `<div class="conclusion conclusion--stable"><span class="conclusion-label">Оценка текущего состояния</span><h3 class="conclusion-zone">Показатели рассчитаны</h3><p class="conclusion-fact">Для определения главной слабой зоны сравните два сопоставимых периода.</p></div><h3 class="metrics-title">Текущие показатели</h3><div class="metrics-grid">${metricCard('Средний чек', `${formatNumber(m.averageCheck, 2)} ₽`)}${metricCard('Конверсия', `${formatNumber(m.conversion, 2)}%`)}${metricCard('Товаров в покупке', formatNumber(m.itemsPerCheck, 2))}${metricCard('Средняя цена товара', `${formatNumber(m.averageItemPrice, 2)} ₽`)}${metricCard('Ориентировочная валовая прибыль', `${formatNumber(m.grossProfit, 2)} ₽`)}</div><p class="privacy-note">Заключение основано только на введённых показателях. Данные хранятся локально в браузере.</p>`;
      return;
    }
    const d = result.diagnosis;
    const cls = d.zone === 'Системное снижение' ? ' conclusion--system' : d.zone === 'Не выявлена' ? ' conclusion--stable' : '';
    target.innerHTML = `<div class="conclusion${cls}"><span class="conclusion-label">Главная слабая зона</span><h3 class="conclusion-zone">${d.zone}</h3><p class="conclusion-fact">${d.fact}</p></div><div class="meaning"><span class="conclusion-label">Это означает</span><p>${d.meaning}</p></div>${d.risk ? `<p class="risk">Дополнительный риск: ${d.risk}.</p>` : ''}<h3 class="metrics-title">Изменение ключевых показателей</h3><div class="metrics-grid">${metricCard('Трафик', `${formatNumber(result.secondData.visitors)} посетителей`, result.changes.traffic)}${metricCard('Конверсия', `${formatNumber(result.secondMetrics.conversion, 2)}%`, result.changes.conversion)}${metricCard('Средний чек', `${formatNumber(result.secondMetrics.averageCheck, 2)} ₽`, result.changes.averageCheck)}${metricCard('Ориентировочная валовая прибыль', `${formatNumber(result.secondMetrics.grossProfit, 2)} ₽`, result.changes.profitability)}</div><p class="privacy-note">Вывод требует проверки ассортимента, цен, наличия, трафика и условий работы магазина.</p>`;
  }

  modeInputs.forEach((input) => input.addEventListener('change', () => { setMode(currentMode()); save(); }));
  form.addEventListener('input', () => { updateButton(true); save(); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = analyze(currentMode(), readPeriod(1), readPeriod(2));
    paintErrors(1, result.period1 || validatePeriod(readPeriod(1)));
    if (currentMode() === 'compare') paintErrors(2, result.period2 || validatePeriod(readPeriod(2)));
    if (!result.valid) { updateButton(true); return; }
    render(result); save();
  });
  clearButton.addEventListener('click', () => dialog.showModal());
  document.querySelector('#confirm-clear').addEventListener('click', () => {
    form.reset();
    modeInputs[0].checked = true;
    periodElements.forEach((element) => element.querySelectorAll('input').forEach((input) => { input.value = ''; input.setAttribute('aria-invalid', 'false'); }));
    document.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* storage unavailable */ }
    setMode('current');
    document.querySelector('#result-content').innerHTML = '<div class="result-placeholder"><span class="status-dot" aria-hidden="true"></span><div><span class="result-kicker">Готово к расчёту</span><strong>Заполните обязательные поля</strong></div></div><p class="privacy-note">Расчёт выполняется только в этом браузере. Данные никуда не отправляются.</p>';
  });

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored) {
      const modeInput = modeInputs.find((input) => input.value === stored.mode) || modeInputs[0];
      modeInput.checked = true;
      [stored.period1, stored.period2].forEach((data, index) => FIELD_DEFINITIONS.forEach((field) => { document.querySelector(`#p${index + 1}-${field.key}`).value = data?.[field.key] ?? ''; }));
    }
  } catch (_) { /* ignore damaged or unavailable local storage */ }
  setMode(currentMode());
}

const DiagnosticEngine = { SIGNIFICANCE_THRESHOLD, parseNumber, validatePeriod, calculateMetrics, percentageChange, comparePeriods, diagnose, analyze };
if (typeof window !== 'undefined') { window.DiagnosticEngine = DiagnosticEngine; document.addEventListener('DOMContentLoaded', initApp); }
if (typeof module !== 'undefined' && module.exports) module.exports = DiagnosticEngine;
