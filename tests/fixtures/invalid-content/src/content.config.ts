import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// The real schemas, so the fixture fails exactly like the site would.
import { noteSchema } from '../../../../src/content/schemas';

const notes = defineCollection({
	loader: glob({ base: './src/content/notes', pattern: '{es,en}/**/*.{md,mdx}' }),
	schema: noteSchema,
});

export const collections = { notes };
