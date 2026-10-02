import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const CONTENT_DIR = join(process.cwd(), 'src/content');
const COLLECTIONS = ['blog', 'projects', 'notes'];
const LANGS = ['es', 'en'];

// Every Markdown/MDX file under src/content, as `collection/lang/…` paths.
const files = readdirSync(CONTENT_DIR, { recursive: true, withFileTypes: true })
	.filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
	.map((entry) => relative(CONTENT_DIR, join(entry.parentPath, entry.name)).split(sep).join('/'));

describe('content tree', () => {
	it('keeps every content file under <collection>/{es,en}/', () => {
		const misplaced = files.filter((file) => {
			const [collection, lang, ...rest] = file.split('/');
			return !COLLECTIONS.includes(collection ?? '') || !LANGS.includes(lang ?? '') || rest.length === 0;
		});
		expect(misplaced).toEqual([]);
	});

	it.each(COLLECTIONS.flatMap((collection) => LANGS.map((lang) => [collection, lang])))(
		'has at least one %s example in %s',
		(collection, lang) => {
			expect(files.some((file) => file.startsWith(`${collection}/${lang}/`))).toBe(true);
		},
	);
});
