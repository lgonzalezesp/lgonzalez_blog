import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { blogSchema, noteSchema } from '../../../src/content/schemas';
import { entryUrl } from '../../../src/i18n/routes';
import { buildPlan } from '../../../scripts/new-post.mjs';

const context = { image: () => z.string() } as unknown as SchemaContext;
const NOW = new Date(2026, 9, 2, 23, 30); // 2 Oct 2026, late evening, local time
const DIR = '/tmp/content';

/** Reads back the flat `key: value` lines of a generated frontmatter. */
function readFrontmatter(content: string) {
	const block = content.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
	const data: Record<string, unknown> = {};
	for (const line of block.split('\n')) {
		const [, key, raw] = line.match(/^(\w+): (.*)$/) ?? [];
		if (!key) continue;
		const string = (s: string) => s.replace(/^'|'$/g, '').replace(/''/g, "'");
		if (raw.startsWith('[')) {
			data[key] = [...raw.slice(1, -1).matchAll(/'((?:[^']|'')*)'/g)].map((m) => string(`'${m[1]}'`));
		} else if (raw === 'true' || raw === 'false') data[key] = raw === 'true';
		else data[key] = raw.startsWith("'") ? string(raw) : raw;
	}
	return data;
}

describe('buildPlan: post in Spanish (default)', () => {
	const [file, ...rest] = buildPlan({ title: 'Mi primer post' }, NOW);

	it('plans a single file under blog/es named after the slug', () => {
		expect(rest).toHaveLength(0);
		expect(file.path).toBe('src/content/blog/es/mi-primer-post.md');
	});

	it('writes a valid draft frontmatter dated today (local date)', () => {
		const data = readFrontmatter(file.content);
		expect(data).toMatchObject({
			title: 'Mi primer post',
			pubDate: '2026-10-02',
			tags: [],
			lang: 'es',
			translationKey: 'mi-primer-post',
			draft: true,
		});
		expect(String(data.description).length).toBeGreaterThan(0);
		expect(blogSchema(context).safeParse(data).success).toBe(true);
	});

	it('includes a body skeleton after the frontmatter', () => {
		expect(file.content).toMatch(/\n---\n\n[\s\S]*## /);
		expect(file.content.endsWith('\n')).toBe(true);
	});
});

describe('buildPlan: languages', () => {
	it('--lang en creates only the English version, keyed by its own slug', () => {
		const files = buildPlan({ title: 'My First Post', lang: 'en' }, NOW);
		expect(files.map((f) => f.path)).toEqual(['src/content/blog/en/my-first-post.md']);
		expect(readFrontmatter(files[0].content)).toMatchObject({
			lang: 'en',
			translationKey: 'my-first-post',
			draft: true,
		});
		expect(readFrontmatter(files[0].content).description).toMatch(/^Write /);
	});

	it('--lang both creates both versions with the same translationKey and their own slugs', () => {
		const files = buildPlan({ title: 'Mi primer post', lang: 'both', titleEn: 'My first post' }, NOW);
		expect(files.map((f) => f.path)).toEqual([
			'src/content/blog/es/mi-primer-post.md',
			'src/content/blog/en/my-first-post.md',
		]);
		const [es, en] = files.map((f) => readFrontmatter(f.content));
		expect(es.translationKey).toBe('mi-primer-post');
		expect(en.translationKey).toBe('mi-primer-post');
		expect(es.lang).toBe('es');
		expect(en.lang).toBe('en');
		expect(es.title).toBe('Mi primer post');
		expect(en.title).toBe('My first post');
		for (const data of [es, en]) expect(blogSchema(context).safeParse(data).success).toBe(true);
	});
});

describe('buildPlan: notes', () => {
	it('creates a note with title, date and tags, and no description', () => {
		const [file] = buildPlan({ title: 'Una idea', type: 'note', tags: ['gcp', 'ideas'] }, NOW);
		expect(file.path).toBe('src/content/notes/es/una-idea.md');
		const data = readFrontmatter(file.content);
		expect(data).toMatchObject({
			title: 'Una idea',
			pubDate: '2026-10-02',
			tags: ['gcp', 'ideas'],
			draft: true,
		});
		expect(file.content).not.toMatch(/^description:/m);
		expect(noteSchema(context).safeParse(data).success).toBe(true);
	});
});

describe('buildPlan: content directory', () => {
	it('writes under the given directory', () => {
		const [file] = buildPlan({ title: 'Hola', dir: DIR }, NOW);
		expect(file.path).toBe(`${DIR}/blog/es/hola.md`);
	});
});

describe('buildPlan: special characters', () => {
	it('quotes the title, doubling inner single quotes, so the YAML stays valid', () => {
		const [file] = buildPlan({ title: "It's: a #test", lang: 'en' }, NOW);
		expect(file.content).toContain("title: 'It''s: a #test'");
		expect(readFrontmatter(file.content).title).toBe("It's: a #test");
	});

	it('keeps tags with quotes or commas intact', () => {
		const [file] = buildPlan({ title: 'Nota', type: 'note', tags: ["o'reilly"] }, NOW);
		expect(readFrontmatter(file.content).tags).toEqual(["o'reilly"]);
	});
});

describe('buildPlan: URLs shown to the author', () => {
	it('match the site routes', () => {
		const files = buildPlan({ title: 'Mi primer post', lang: 'both', titleEn: 'My first post' }, NOW);
		expect(files[0].url).toBe(entryUrl('blog', { id: 'es/mi-primer-post', data: { lang: 'es' } }));
		expect(files[1].url).toBe(entryUrl('blog', { id: 'en/my-first-post', data: { lang: 'en' } }));
		const [note] = buildPlan({ title: 'Una idea', type: 'note', tags: ['a'], lang: 'en' }, NOW);
		expect(note.url).toBe(entryUrl('notes', { id: 'en/una-idea', data: { lang: 'en' } }));
	});
});
