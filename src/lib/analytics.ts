export const analyticsEvents = [
  'view_article', 'click_related_article', 'click_article_category', 'click_product', 'view_product',
  'click_product_catalog', 'click_product_purchase', 'click_service', 'click_contact', 'click_social',
  'click_vk', 'click_telegram', 'click_vc', 'click_dzen', 'click_teletype', 'click_instagram', 'click_email',
  'start_checkout', 'outbound_checkout', 'payment_success', 'download_success',
] as const;

export type AnalyticsEvent = typeof analyticsEvents[number];
export type AnalyticsContext = Partial<Record<'content_id' | 'content_type' | 'category' | 'cluster' | 'product_id' | 'service_id' | 'destination' | 'placement' | 'cta_id', string>>;
export type UtmData = Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term', string>>;

const consentKey = 'rvd_analytics_consent';
const utmKey = 'rvd_utm';
const utmNames = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);

export function hasAnalyticsConsent(): boolean {
  return localStorage.getItem(consentKey) === 'granted';
}

export function rememberUtm(search = window.location.search): UtmData {
  const params = new URLSearchParams(search);
  const utm = Object.fromEntries([...params.entries()].filter(([key, value]) => utmNames.has(key) && value).map(([key, value]) => [key, value.slice(0, 200)])) as UtmData;
  if (Object.keys(utm).length) sessionStorage.setItem(utmKey, JSON.stringify(utm));
  return utm;
}

export function readUtm(): UtmData {
  try { return JSON.parse(sessionStorage.getItem(utmKey) || '{}') as UtmData; } catch { return {}; }
}

export function track(event: AnalyticsEvent, context: AnalyticsContext = {}): void {
  if (!hasAnalyticsConsent()) return;
  window.dispatchEvent(new CustomEvent('rvd:analytics-event', { detail: { event, context, utm: readUtm() } }));
}
