// Verified live channel records on 25.09.2026; inactive channels are deliberately omitted.
export const VK_COMMUNITY_URL = 'https://vk.ru/dokruti_biz';
export const readingChannels = [
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/dokruti_biz', reason: 'Короткие разборы и наблюдения из работы.' },
  { id: 'vk', label: 'VK', href: VK_COMMUNITY_URL, reason: '' },
  { id: 'dzen', label: 'Дзен', href: 'https://dzen.ru/user/j0k4kngnxzw8m5tlmxy8gvho3im?share_to=link', reason: '' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/svetlana.24011982/', reason: '' },
  { id: 'max', label: 'MAX', href: 'https://max.ru/se13981398_biz', reason: '' },
  { id: 'vc', label: 'VC.ru', href: 'https://vc.ru/id5659262', reason: '' },
] as const;
export const questionChannels = [
  { id: 'telegram-personal', label: 'Telegram', href: 'https://t.me/Cvetlana2401', reason: 'Написать Светлане о своей задаче.' },
  { id: 'max-personal', label: 'MAX', href: 'https://max.ru/u/f9LHodD0cOI3kOAFuFlFv0E5gzchvPbqueGHIJMaGzLlQRuLbbA6G9GEI3k', reason: '' },
  { id: 'email', label: 'Email', href: 'mailto:As24011982@yandex.ru', address: 'As24011982@yandex.ru', reason: '' },
] as const;
