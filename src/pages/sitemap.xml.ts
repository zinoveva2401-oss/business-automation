import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const staticPaths = ['/', '/articles/', '/tools/', '/services/', '/about/', '/contacts/'];
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' })[char]!);

export const GET: APIRoute = async ({ site }) => {
  if (!site) return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  const articles = (await getCollection('articles')).filter(({ data }) => !data.draft).map(({ id }) => `/articles/${id}/`);
  const tools = (await getCollection('tools')).filter(({ data }) => data.status === 'available').map(({ id }) => `/tools/${id}/`);
  const services = (await getCollection('services')).map(({ id }) => `/services/${id}/`);
  const urls = [...staticPaths, ...articles, ...tools, ...services].map((path) => `<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
