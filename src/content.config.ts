import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const category = z.enum(['Продажи', 'Товар', 'Покупатель', 'Персонал', 'Управление', 'Маркетинг', 'ИИ и автоматизация']);
const cluster = z.enum([
  'Диагностика магазина', 'Найм продавца', 'Первый руководитель', 'Первый час директора',
  'Закупки и остатки', 'Клиентский опыт', 'Маркетинговые активности', 'Экономика акций',
  'ИИ для малого бизнеса', 'Обучение продавцов',
]);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    id: z.string(), slug: z.string(), title: z.string(), description: z.string(),
    primarySearchQuestion: z.string(), category, cluster, publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(), author: z.string(), draft: z.boolean().default(true),
    featured: z.boolean().default(false), cover: z.string().optional(), coverAlt: z.string().optional(),
    readingTime: z.number().int().positive(), relatedArticleIds: z.array(z.string()).default([]),
    relatedProductIds: z.array(z.string()).default([]), relatedServiceIds: z.array(z.string()).default([]), contentRole: z.enum(['pillar', 'cluster', 'support']).default('support'),
    seoTitle: z.string(), seoDescription: z.string(), canonicalUrl: z.string().url().optional(), ogImage: z.string().optional(),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    id: z.string(), slug: z.string(), title: z.string(), description: z.string(),
    type: z.string(), category, cluster, status: z.enum(['draft', 'comingSoon', 'published']),
    featured: z.boolean().default(false), bestseller: z.boolean().default(false), price: z.number().nonnegative(),
    pricePrefix: z.string().optional(), cover: z.string(), coverAlt: z.string(), screenshots: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    tags: z.array(z.string()).default([]), version: z.string(), updatedAt: z.coerce.date(), deliveryType: z.string(),
    relatedArticleIds: z.array(z.string()).default([]), problem: z.string(), forWhom: z.array(z.string()),
    notForWhom: z.array(z.string()).optional(), result: z.string(), contents: z.array(z.string()), workflow: z.array(z.string()),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]), seoTitle: z.string(), seoDescription: z.string(),
    canonicalUrl: z.string().url().optional(), purchaseChannel: z.enum(['saleBot', 'site', 'vkMarket', 'external']).optional(),
    purchaseUrl: z.string().url().optional(), purchaseStatus: z.enum(['inactive', 'active']).default('inactive'),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    id: z.string(), slug: z.string(), title: z.string(), description: z.string(),
    order: z.number().int().positive(), active: z.boolean().default(true), seoTitle: z.string(), seoDescription: z.string(),
  }),
});

export const collections = { articles, tools, services };
