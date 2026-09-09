import { getCollection } from 'astro:content';

export async function getPublishedArticles() {
  return (await getCollection('articles')).filter(({ data }) => !data.draft).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getVisibleProducts() {
  return (await getCollection('tools')).filter(({ data }) => data.status === 'published' && data.purchaseStatus === 'active' && Boolean(data.purchaseUrl));
}

export async function getCatalogProducts() {
  return (await getCollection('tools')).filter(({ data }) => data.status !== 'draft');
}

export async function getActiveServices() {
  return (await getCollection('services')).filter(({ data }) => data.active).sort((a, b) => a.data.order - b.data.order);
}
