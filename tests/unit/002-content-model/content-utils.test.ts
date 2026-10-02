import { describe, expect, it } from 'vitest';
import {
	assertLangMatchesFolder,
	filterPublished,
	findTranslation,
	isDraftVisible,
	langFromId,
	slugFromId,
	sortByDateDesc,
	type ContentEntry,
} from '../../../src/lib/content';

function entry(id: string, data: Partial<ContentEntry['data']> = {}): ContentEntry {
	return {
		id,
		filePath: `src/content/blog/${id}.md`,
		data: {
			lang: langFromId(id),
			draft: false,
			pubDate: new Date('2026-01-01'),
			translationKey: id.split('/')[1] ?? id,
			...data,
		},
	};
}

describe('langFromId / slugFromId', () => {
	it('reads the language from the folder', () => {
		expect(langFromId('es/hola-mundo')).toBe('es');
		expect(langFromId('en/hello-world')).toBe('en');
	});

	it('throws for content outside es/ or en/', () => {
		expect(() => langFromId('fr/bonjour')).toThrow(/fr\/bonjour/);
		expect(() => langFromId('sin-carpeta')).toThrow();
	});

	it('removes the language from the slug', () => {
		expect(slugFromId('es/hola-mundo')).toBe('hola-mundo');
		expect(slugFromId('en/2026/nested-post')).toBe('2026/nested-post');
	});
});

describe('assertLangMatchesFolder', () => {
	it('passes when lang matches the folder', () => {
		expect(() => assertLangMatchesFolder(entry('es/hola'))).not.toThrow();
	});

	it('throws naming the file when lang does not match', () => {
		expect(() => assertLangMatchesFolder(entry('es/hola', { lang: 'en' }))).toThrow(
			/src\/content\/blog\/es\/hola\.md/,
		);
	});
});

describe('isDraftVisible', () => {
	it('shows drafts in development', () => {
		expect(isDraftVisible({ prod: false })).toBe(true);
	});

	it('shows drafts in Vercel previews', () => {
		expect(isDraftVisible({ prod: true, vercelEnv: 'preview' })).toBe(true);
	});

	it('hides drafts in production builds', () => {
		expect(isDraftVisible({ prod: true })).toBe(false);
		expect(isDraftVisible({ prod: true, vercelEnv: 'production' })).toBe(false);
	});
});

describe('filterPublished', () => {
	const entries = [entry('es/publicado'), entry('es/borrador', { draft: true })];

	it('excludes drafts in production', () => {
		expect(filterPublished(entries, { prod: true }).map((e) => e.id)).toEqual(['es/publicado']);
	});

	it('includes drafts in development and previews', () => {
		expect(filterPublished(entries, { prod: false })).toHaveLength(2);
		expect(filterPublished(entries, { prod: true, vercelEnv: 'preview' })).toHaveLength(2);
	});
});

describe('sortByDateDesc', () => {
	it('returns the most recent first without mutating the input', () => {
		const entries = [
			entry('es/viejo', { pubDate: new Date('2025-01-01') }),
			entry('es/nuevo', { pubDate: new Date('2026-06-01') }),
			entry('es/medio', { pubDate: new Date('2025-06-01') }),
		];
		expect(sortByDateDesc(entries).map((e) => e.id)).toEqual(['es/nuevo', 'es/medio', 'es/viejo']);
		expect(entries[0]?.id).toBe('es/viejo');
	});

	it('breaks ties by updatedDate and then by id', () => {
		const pubDate = new Date('2026-01-01');
		const entries = [
			entry('es/b', { pubDate }),
			entry('es/a', { pubDate }),
			entry('es/actualizado', { pubDate, updatedDate: new Date('2026-02-01') }),
		];
		expect(sortByDateDesc(entries).map((e) => e.id)).toEqual(['es/actualizado', 'es/a', 'es/b']);
	});
});

describe('findTranslation', () => {
	const es = entry('es/hola-mundo', { translationKey: 'hello-world' });
	const en = entry('en/hello-world', { translationKey: 'hello-world' });
	const lonely = entry('es/solo-en-espanol', { translationKey: 'only-spanish' });
	const all = [es, en, lonely];

	it('finds the entry in the other language with the same translationKey', () => {
		expect(findTranslation(all, es)).toBe(en);
		expect(findTranslation(all, en)).toBe(es);
	});

	it('returns undefined when there is no translation', () => {
		expect(findTranslation(all, lonely)).toBeUndefined();
	});
});
