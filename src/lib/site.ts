export const SITE_NAME = 'Докрути';
export const AUTHOR_NAME = 'Светлана Тарасова';

export const categories = [
  { name: 'Продажи', slug: 'sales', legacy: 'Продажи', legacySlug: 'prodazhi', icon: 'ti-chart-bar' },
  { name: 'Ассортимент и закупки', slug: 'assortiment-i-zakupki', legacy: 'Товар', legacySlug: 'assortiment-zakupki', icon: 'ti-package' },
  { name: 'Клиенты', slug: 'klienty', legacy: 'Покупатель', legacySlug: 'pokupatel', icon: 'ti-user' },
  { name: 'Команда', slug: 'komanda', legacy: 'Персонал', legacySlug: 'personal', icon: 'ti-users-group' },
  { name: 'Управление и процессы', slug: 'upravlenie-i-processy', legacy: 'Управление', legacySlug: 'upravlenie', icon: 'ti-clipboard-check' },
  { name: 'Маркетинг', slug: 'marketing', legacy: 'Маркетинг', legacySlug: 'marketing', icon: 'ti-speakerphone' },
  { name: 'ИИ и автоматизация', slug: 'ii-i-avtomatizaciya', legacy: 'ИИ и автоматизация', legacySlug: 'ai-avtomatizatsiya', icon: 'ti-ai' },
] as const;

export const categoryByName = new Map(categories.flatMap((item) => [[item.name, item], [item.legacy, item]]));
export const categoryBySlug = new Map(categories.flatMap((item) => [[item.slug, item], [item.legacySlug, item]]));
export const topicBySlug = new Map(categories.map((item) => [item.slug, item]));

export const topicForCategory = (category: string) => categories.find((item) => item.name === category || item.legacy === category || item.slug === category);

export const formatDate = (date: Date) => new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric',
}).format(date);

export const topicDescriptions: Record<string, string> = {
  sales: 'Поток, покупка и показатель, который изменился первым.',
  'assortiment-i-zakupki': 'Решения о товаре, остатке и деньгах до заказа.',
  klienty: 'Моменты, в которых клиент выбирает, уходит или возвращается.',
  komanda: 'Роли, навыки и договорённости, которые держат результат.',
  'upravlenie-i-processy': 'Задачи, ритм и контроль без постоянного ручного вмешательства.',
  marketing: 'Связь обещания, канала и действия покупателя.',
  'ii-i-avtomatizaciya': 'Где ИИ помогает проверить гипотезу, а не подменяет решение.',
};

export const formatPrice = (price: number, prefix = '') => `${prefix ? `${prefix} ` : ''}${new Intl.NumberFormat('ru-RU').format(price)} ₽`;
