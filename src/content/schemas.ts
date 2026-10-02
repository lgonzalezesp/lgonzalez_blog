import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';

// Frontmatter schemas, kept apart from content.config.ts so they can be unit tested.
// Error messages are in Spanish: they are read by the author when `npm run check` fails.

export const LANGS = ['es', 'en'] as const;
export const PROJECT_STATUSES = ['active', 'completed', 'archived'] as const;

const text = (field: string) => z.string({ error: `«${field}» es obligatorio` }).trim().min(1, {
	error: `«${field}» no puede estar vacío`,
});

const date = (field: string) =>
	z.coerce.date({ error: `«${field}» debe ser una fecha válida (p. ej. 2026-10-01)` });

const tag = z.string().trim().min(1, { error: 'las etiquetas no pueden estar vacías' });

const cover = (image: SchemaContext['image']) =>
	z.object({
		src: image(),
		alt: text('cover.alt'),
	});

const common = ({ image }: SchemaContext) =>
	z.object({
		title: text('title'),
		description: text('description'),
		pubDate: date('pubDate'),
		updatedDate: date('updatedDate').optional(),
		tags: z.array(tag).default([]),
		lang: z.enum(LANGS, { error: '«lang» debe ser "es" o "en"' }),
		draft: z.boolean().default(false),
		cover: cover(image).optional(),
		translationKey: text('translationKey'),
	});

export const blogSchema = (context: SchemaContext) => common(context);

export const projectSchema = (context: SchemaContext) =>
	common(context).extend({
		stack: z.array(tag).min(1, { error: '«stack» necesita al menos una tecnología' }),
		status: z.enum(PROJECT_STATUSES, { error: '«status» debe ser "active", "completed" o "archived"' }),
		repoUrl: z.url({ error: '«repoUrl» debe ser una URL válida' }).optional(),
		demoUrl: z.url({ error: '«demoUrl» debe ser una URL válida' }).optional(),
		featured: z.boolean().default(false),
	});

export const noteSchema = (context: SchemaContext) =>
	common(context).extend({
		description: text('description').optional(),
		tags: z
			.array(tag, { error: 'las notas necesitan «tags» con al menos una etiqueta' })
			.min(1, { error: 'las notas necesitan al menos una etiqueta en «tags»' }),
	});

/** Standalone pages written in Markdown (e.g. "About"): no date, tags or drafts. */
export const pageSchema = ({ image }: SchemaContext) =>
	z.object({
		title: text('title'),
		description: text('description'),
		lang: z.enum(LANGS, { error: '«lang» debe ser "es" o "en"' }),
		translationKey: text('translationKey'),
		updatedDate: date('updatedDate').optional(),
		cover: cover(image).optional(),
	});
