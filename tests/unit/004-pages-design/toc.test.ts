import { describe, expect, it } from 'vitest';
import { buildToc } from '../../../src/lib/toc';

const h = (depth: number, text: string) => ({ depth, text, slug: text.toLowerCase() });

describe('buildToc', () => {
	it('nests h3 headings under the previous h2', () => {
		expect(
			buildToc([h(2, 'Intro'), h(2, 'Setup'), h(3, 'Requirements'), h(3, 'Install'), h(2, 'End')]),
		).toEqual([
			{ slug: 'intro', text: 'Intro', children: [] },
			{
				slug: 'setup',
				text: 'Setup',
				children: [
					{ slug: 'requirements', text: 'Requirements', children: [] },
					{ slug: 'install', text: 'Install', children: [] },
				],
			},
			{ slug: 'end', text: 'End', children: [] },
		]);
	});

	it('ignores h1 and h4+ headings', () => {
		expect(buildToc([h(1, 'Title'), h(2, 'A'), h(4, 'Deep'), h(5, 'Deeper')])).toEqual([
			{ slug: 'a', text: 'A', children: [] },
		]);
	});

	it('keeps an h3 without a previous h2 at the top level', () => {
		expect(buildToc([h(3, 'Orphan'), h(2, 'A')]).map((item) => item.slug)).toEqual(['orphan', 'a']);
	});

	it('returns an empty list without headings', () => {
		expect(buildToc([])).toEqual([]);
	});
});
