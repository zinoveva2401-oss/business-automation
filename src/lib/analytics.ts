export const analyticsEvents = [
  'article_view', 'product_view', 'checkout_start', 'payment_success', 'download_success',
  'telegram_click', 'max_click', 'email_click', 'vk_click', 'vc_click', 'dzen_click',
] as const;

export type AnalyticsEvent = typeof analyticsEvents[number];
export type UtmData = Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term', string>>;

const consentCookie = 'rvd_analytics_consent';
const utmStorageKey = 'rvd_utm';

export function hasAnalyticsConsent(cookie = document.cookie): boolean {
  return cookie.split('; ').includes(`${consentCookie}=granted`);
}

export function rememberUtm(search = window.location.search): UtmData {
  const params = new URLSearchParams(search);
  const utm = Object.fromEntries([...params.entries()].filter(([key, value]) => key.startsWith('utm_') && value).map(([key, value]) => [key, value.slice(0, 200)])) as UtmData;
  if (Object.keys(utm).length) sessionStorage.setItem(utmStorageKey, JSON.stringify(utm));
  return utm;
}

export function track(event: AnalyticsEvent, context: Record<string, string | number | boolean> = {}): void {
  if (!hasAnalyticsConsent()) return;
  window.dispatchEvent(new CustomEvent('rvd:analytics-event', { detail: { event, context, utm: rememberUtm() } }));
}

// В V1 нет счётчика. Будущий адаптер Яндекс Метрики должен подписаться на
// rvd:analytics-event и передавать только разрешённые неперсональные параметры.
