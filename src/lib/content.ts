import { getCollection } from 'astro:content';

export async function getPublishedArticles() {
  return (await getCollection('articles'))
    .filter(({ data }) => !data.draft && data.status === 'READY')
    .sort((a, b) => (b.data.publishedAt?.valueOf() ?? 0) - (a.data.publishedAt?.valueOf() ?? 0));
}

export async function getVisibleProducts() {
  return (await getCollection('tools')).filter(({ data }) => data.status === 'published');
}

export async function getCatalogProducts() {
  return (await getCollection('tools')).filter(({ data }) => data.status === 'published');
}

export async function getActiveServices() {
  return (await getCollection('services'))
    .filter(({ data }) => data.page === 'service' && data.status === 'READY' && !data.draft && ['razbor-odnoy-zadachi','audit-prodazh-i-processov','dorabotka-sistemy-raboty'].includes(data.slug))
    .sort((a, b) => a.data.order - b.data.order);
}
