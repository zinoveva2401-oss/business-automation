import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const category = z.enum([
  'Продажи', 'Товар', 'Покупатель', 'Персонал', 'Управление', 'Маркетинг', 'ИИ и автоматизация',
  'Ассортимент и закупки', 'Клиенты', 'Команда', 'Управление и процессы',
]);
const cluster = z.string();
const readingTime = z.union([z.number(), z.string()]).transform((value) => typeof value === 'number' ? value : Number.parseInt(value, 10));

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    id: z.string(), slug: z.string(), title: z.string(), description: z.string(),
    primarySearchQuestion: z.string(), category, cluster, publishedAt: z.coerce.date().nullable().default(null),
    updatedAt: z.coerce.date().nullable().optional(), author: z.string(), draft: z.boolean().default(true),
    status: z.string().optional(),
    content_type: z.enum(['Статья', 'Разбор', 'Эксперимент', 'Инструмент', 'История', 'Сигнал', 'Внутри Докрути']).default('Статья'),
    revenue_route: z.enum(['NONE', 'OWN_PRODUCT', 'OWN_SERVICE', 'AFFILIATE', 'SPONSOR', 'OWN_PARTNER_PROGRAM', 'PLATFORM', 'LEADGEN', 'CORPORATE']).default('NONE'),
    commercial_status: z.enum(['OFF', 'DRAFT', 'LEGAL_HOLD', 'READY', 'ACTIVE', 'EXPIRED']).default('OFF'),
    featured: z.boolean().default(false), cover: z.string().optional(), coverAlt: z.string().optional(),
    readingTime: readingTime.pipe(z.number().int().positive()), relatedArticleIds: z.array(z.string()).default([]),
    relatedProductIds: z.array(z.string()).default([]), relatedServiceIds: z.array(z.string()).default([]), contentRole: z.string().default('support'),
    seoTitle: z.string(), seoDescription: z.string(), canonicalUrl: z.string().url().optional(), ogImage: z.string().optional(),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    id: z.string(), slug: z.string(), title: z.string(), description: z.string(),
    type: z.string(), cardFormat: z.string().optional(), cardDescription: z.string().optional(), category, cluster, status: z.enum(['draft', 'comingSoon', 'published', 'HOLD']),
    featured: z.boolean().default(false), bestseller: z.boolean().default(false), price: z.number().nonnegative(),
    pricePrefix: z.string().optional(), cover: z.string(), coverAlt: z.string(), screenshots: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    tags: z.array(z.string()).default([]), version: z.string(), updatedAt: z.coerce.date(), deliveryType: z.string(),
    relatedArticleIds: z.array(z.string()).default([]), relatedServiceIds: z.array(z.string()).default([]),
    managementLevels: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
    workbookSections: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
    includedFormats: z.array(z.object({ title: z.string(), description: z.string(), items: z.array(z.string()) })).default([]),
    previewSlots: z.array(z.object({ title: z.string(), description: z.string() })).default([]), problem: z.string(), problemDescription: z.string().optional(), forWhom: z.array(z.string()),
    notForWhom: z.array(z.string()).optional(), result: z.string(), contents: z.array(z.string()), workflow: z.array(z.string()),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]), seoTitle: z.string(), seoDescription: z.string(),
    canonicalUrl: z.string().url().optional(), purchaseChannel: z.enum(['saleBot', 'site', 'vkMarket', 'external']).optional(),
    purchaseUrl: z.string().url().optional(), purchaseStatus: z.enum(['inactive', 'active']).default('inactive'),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    id: z.string().optional(), slug: z.string(), title: z.string(), description: z.string().optional(),
    situation: z.string().optional(), process: z.string().optional(), output: z.string().optional(), clientInput: z.string().optional(),
    h1: z.string().optional(), page: z.string().optional(), status: z.string().optional(), draft: z.boolean().default(false),
    order: z.number().int().positive().default(99), active: z.boolean().default(true), seoTitle: z.string().default('Услуги «Докрути»'), seoDescription: z.string().default('Форматы помощи «Докрути».'),
  }),
});

export const collections = { articles, tools, services };
