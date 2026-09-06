import type { APIRoute } from 'astro';
export const GET:APIRoute=({site})=>{const staging=import.meta.env.PUBLIC_DEPLOY_ENV==='staging';return new Response(`User-agent: *\n${staging?'Disallow: /':'Allow: /\n'+(site?`Sitemap: ${new URL('/sitemap.xml',site).href}\n`: '')}`,{headers:{'Content-Type':'text/plain; charset=utf-8'}})};
