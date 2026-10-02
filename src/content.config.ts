import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, noteSchema, projectSchema } from './content/schemas';

// Content lives in src/content/<collection>/{es,en}/; entry ids are `es/slug` or `en/slug`.
const byLanguage = (collection: string) =>
	glob({ base: `./src/content/${collection}`, pattern: '{es,en}/**/*.{md,mdx}' });

const blog = defineCollection({ loader: byLanguage('blog'), schema: blogSchema });
const projects = defineCollection({ loader: byLanguage('projects'), schema: projectSchema });
const notes = defineCollection({ loader: byLanguage('notes'), schema: noteSchema });

export const collections = { blog, projects, notes };
