import { describe, expect, it } from 'vitest';
import { groupByTag, tagSlug } from '../../../src/lib/tags';

const entry = (id: string, tags: string[], date: string) => ({
	id,
	data: { lang: id.startsWith('en/') ? ('en' as const) : ('es' as const), tags, pubDate: new Date(date) },
});

describe('tagSlug', () => {
	it.each([
		['astro', 'astro'],
		['Inteligencia Artificial', 'inteligencia-artificial'],
		['diseño', 'diseno'],
		['  C++ / Rust  ', 'c-rust'],
		['Node.js', 'node-js'],
	])('%s → %s', (tag, slug) => {
		expect(tagSlug(tag)).toBe(slug);
	});
});

describe('groupByTag', () => {
	const entries = [
		entry('es/a', ['Astro', 'web'], '2026-01-01'),
		entry('es/b', ['astro'], '2026-03-01'),
		entry('es/c', ['diseño'], '2026-02-01'),
		entry('en/d', ['astro'], '2026-04-01'),
	];

	it('groups entries of one language by tag slug, most recent first', () => {
		const astro = groupByTag(entries, 'es').find((group) => group.slug === 'astro');
		expect(astro?.entries.map((e) => e.id)).toEqual(['es/b', 'es/a']);
	});

	it('keeps languages apart', () => {
		expect(groupByTag(entries, 'en')).toEqual([{ slug: 'astro', label: 'astro', entries: [entries[3]] }]);
	});

	it('sorts tags by number of entries and then alphabetically', () => {
		expect(groupByTag(entries, 'es').map((group) => group.slug)).toEqual(['astro', 'diseno', 'web']);
	});

	it('uses the first spelling found as the label', () => {
		expect(groupByTag(entries, 'es').find((group) => group.slug === 'diseno')?.label).toBe('diseño');
	});
});
