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

export const contactLinks = [
  { id: 'vk', label: 'VK', href: 'https://vk.ru/id719641565', event: 'click_vk', icon: 'ti-brand-vk' },
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/Cvetlana2401', event: 'click_telegram', icon: 'ti-brand-telegram' },
] as const;

export const projectLinks = [
  { id: 'vk', label: 'VK-сообщество', href: 'https://vk.ru/svetlana_tarasova_marketolog', event: 'click_vk', icon: 'ti-brand-vk' },
  { id: 'telegram', label: 'Telegram-канал', href: 'https://t.me/Svetlana_Marketolog_riteil', event: 'click_telegram', icon: 'ti-brand-telegram' },
  { id: 'dzen', label: 'Дзен', href: 'https://dzen.ru/user/j0k4kngnxzw8m5tlmxy8gvho3im?share_to=link', event: 'click_dzen', icon: 'ti-sparkles' },
  { id: 'vc', label: 'VC.ru', href: 'https://vc.ru/id5659262', event: 'click_vc', icon: 'ti-news' },
] as const;

export const personalMaxLink = { id: 'max-personal', label: 'MAX, личный контакт', href: 'https://max.ru/u/f9LHodD0cOLF-PQtORzTwE5pK8qp1T1cWwz87rnQkkVb8yHYO66Qp8BcOO0', event: 'click_max', icon: 'ti-message-circle' } as const;
export const projectMaxLink = { id: 'max-channel', label: 'MAX-канал «Докрути»', href: 'https://max.ru/se13981398_biz', event: 'click_max', icon: 'ti-message-circle' } as const;

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
