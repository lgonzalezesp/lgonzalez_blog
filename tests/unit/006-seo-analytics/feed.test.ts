import { describe, expect, it } from 'vitest';
import { feedItems, type FeedEntry } from '../../../src/lib/feed';

const entry = (
	collection: 'blog' | 'notes',
	id: string,
	date: string,
	extra: Partial<FeedEntry['data']> = {},
): FeedEntry => ({
	collection,
	id,
	data: {
		title: id,
		description: collection === 'blog' ? `Resumen de ${id}` : undefined,
		pubDate: new Date(date),
		lang: id.startsWith('en/') ? 'en' : 'es',
		draft: false,
		tags: ['astro'],
		translationKey: id,
		...extra,
	},
});

const entries = [
	entry('blog', 'es/viejo', '2025-01-01'),
	entry('notes', 'es/nota', '2026-03-01'),
	entry('blog', 'es/nuevo', '2026-01-01'),
	entry('blog', 'es/borrador', '2026-06-01', { draft: true }),
	entry('blog', 'en/post', '2026-02-01'),
];

const PROD = { prod: true };

describe('feedItems', () => {
	it('only includes published content of the requested language, most recent first', () => {
		expect(feedItems(entries, 'es', PROD).map((item) => item.link)).toEqual([
			'/notas/nota/',
			'/blog/nuevo/',
			'/blog/viejo/',
		]);
		expect(feedItems(entries, 'en', PROD).map((item) => item.link)).toEqual(['/en/blog/post/']);
	});

	it('includes drafts outside production builds', () => {
		expect(feedItems(entries, 'es', { prod: false }).map((item) => item.link)).toContain('/blog/borrador/');
	});

	it('maps title, description, date and tags', () => {
		const [note, post] = feedItems(entries, 'es', PROD);
		expect(post).toEqual({
			title: 'es/nuevo',
			description: 'Resumen de es/nuevo',
			pubDate: new Date('2026-01-01'),
			link: '/blog/nuevo/',
			categories: ['astro'],
		});
		expect(note?.description).toBeUndefined();
	});
});
