import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, noteSchema, pageSchema, projectSchema } from './content/schemas';

// Content lives in <CONTENT_DIR>/<collection>/{es,en}/; entry ids are `es/slug` or `en/slug`.
// CONTENT_DIR defaults to the real content; functional tests build with tests/fixtures/content.
const CONTENT_DIR = process.env.CONTENT_DIR ?? './src/content';

const byLanguage = (collection: string) =>
	glob({ base: `${CONTENT_DIR}/${collection}`, pattern: '{es,en}/**/*.{md,mdx}' });

const blog = defineCollection({ loader: byLanguage('blog'), schema: blogSchema });
const projects = defineCollection({ loader: byLanguage('projects'), schema: projectSchema });
const notes = defineCollection({ loader: byLanguage('notes'), schema: noteSchema });
const pages = defineCollection({ loader: byLanguage('pages'), schema: pageSchema });

export const collections = { blog, projects, notes, pages };
