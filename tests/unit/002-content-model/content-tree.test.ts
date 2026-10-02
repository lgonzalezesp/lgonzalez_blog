import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const COLLECTIONS = ['blog', 'projects', 'notes', 'pages'];
const LANGS = ['es', 'en'];

// Every Markdown/MDX file under a content root, as `collection/lang/…` paths.
function contentFiles(root: string) {
	const dir = join(process.cwd(), root);
	return readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
		.map((entry) => relative(dir, join(entry.parentPath, entry.name)).split(sep).join('/'));
}

// Real content (src/content) and functional test content (tests/fixtures/content).
describe.each(['src/content', 'tests/fixtures/content'])('content tree in %s', (root) => {
	it('keeps every content file under <collection>/{es,en}/', () => {
		const misplaced = contentFiles(root).filter((file) => {
			const [collection, lang, ...rest] = file.split('/');
			return !COLLECTIONS.includes(collection ?? '') || !LANGS.includes(lang ?? '') || rest.length === 0;
		});
		expect(misplaced).toEqual([]);
	});
});

// The examples live in the fixtures, so the author can replace the real examples freely.
describe('test fixtures', () => {
	const files = contentFiles('tests/fixtures/content');

	it.each(COLLECTIONS.flatMap((collection) => LANGS.map((lang) => [collection, lang])))(
		'have at least one %s example in %s',
		(collection, lang) => {
			expect(files.some((file) => file.startsWith(`${collection}/${lang}/`))).toBe(true);
		},
	);
});
