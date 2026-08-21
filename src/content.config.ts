import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(), description: z.string(), publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(), seoTitle: z.string().optional(), seoDescription: z.string().optional(), image: z.string().optional(),
    category: z.enum(['Продажи', 'Товар', 'Покупатель', 'Персонал', 'Управление', 'Маркетинг', 'ИИ и автоматизация']),
    readingTime: z.number().int().positive(), draft: z.boolean().default(true),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(), description: z.string(), price: z.number().nonnegative(),
    image: z.string(), status: z.enum(['draft', 'available', 'unavailable']), featured: z.boolean().default(false),
    order: z.number().int().positive(), orderForm: z.enum(['future', 'disabled']).default('future'),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(), description: z.string(), price: z.number().positive(),
    pricePrefix: z.string().default(''), order: z.number().int().positive(),
  }),
});

export const collections = { articles, tools, services };
