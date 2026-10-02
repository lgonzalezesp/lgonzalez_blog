import { describe, expect, it } from 'vitest';
import { getPage, paginate } from '../../../src/lib/pagination';

const items = Array.from({ length: 23 }, (_, i) => i + 1);

describe('paginate', () => {
	const pages = paginate(items, 10);

	it('computes the number of pages', () => {
		expect(pages).toHaveLength(3);
		expect(pages.every((page) => page.total === 3)).toBe(true);
	});

	it('puts pageSize items per page and the rest on the last one', () => {
		expect(pages.map((page) => page.items.length)).toEqual([10, 10, 3]);
		expect(pages[0]?.items[0]).toBe(1);
		expect(pages[2]?.items).toEqual([21, 22, 23]);
	});

	it('links previous and next pages', () => {
		expect(pages[0]).toMatchObject({ number: 1, prev: undefined, next: 2 });
		expect(pages[1]).toMatchObject({ number: 2, prev: 1, next: 3 });
		expect(pages[2]).toMatchObject({ number: 3, prev: 2, next: undefined });
	});

	it('returns a single empty page for an empty list', () => {
		expect(paginate([], 10)).toEqual([{ number: 1, total: 1, items: [], prev: undefined, next: undefined }]);
	});

	it('returns undefined for a page out of range', () => {
		expect(getPage(pages, 2)?.number).toBe(2);
		expect(getPage(pages, 0)).toBeUndefined();
		expect(getPage(pages, 4)).toBeUndefined();
	});

	it('rejects a non-positive page size', () => {
		expect(() => paginate(items, 0)).toThrow();
	});
});
