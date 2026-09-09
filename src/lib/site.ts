export const SITE_NAME = 'Розница в цифрах';
export const AUTHOR_NAME = 'Светлана Тарасова';

export const categories = [
  { name: 'Продажи', slug: 'prodazhi', icon: 'ti-chart-bar' },
  { name: 'Товар', slug: 'tovar', icon: 'ti-package' },
  { name: 'Покупатель', slug: 'pokupatel', icon: 'ti-user' },
  { name: 'Персонал', slug: 'personal', icon: 'ti-users-group' },
  { name: 'Управление', slug: 'upravlenie', icon: 'ti-clipboard-check' },
  { name: 'Маркетинг', slug: 'marketing', icon: 'ti-speakerphone' },
  { name: 'ИИ и автоматизация', slug: 'ai-avtomatizatsiya', icon: 'ti-ai' },
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

export const personalMaxLink = { id: 'max-personal', label: 'MAX, личный контакт', href: 'https://max.ru/u/f9LHodD0cOLF-PQtORzTwE5pK8qp1T1cWwz87rnQkkVb8yHYO66Qp8BcOO0?utm_source=chatgpt.com', event: 'click_max', icon: 'ti-message-circle' } as const;
export const projectMaxLink = { id: 'max-channel', label: 'MAX-канал «Розница в цифрах»', href: 'https://max.ru/se13981398_biz?utm_source=chatgpt.com', event: 'click_max', icon: 'ti-message-circle' } as const;

export const categoryByName = new Map(categories.map((item) => [item.name, item]));
export const categoryBySlug = new Map(categories.map((item) => [item.slug, item]));

export const formatDate = (date: Date) => new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric',
}).format(date);

export const formatPrice = (price: number, prefix = '') => `${prefix ? `${prefix} ` : ''}${new Intl.NumberFormat('ru-RU').format(price)} ₽`;
