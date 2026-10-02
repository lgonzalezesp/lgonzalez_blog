import { expect, type Page, test } from '@playwright/test';

const SITE = 'https://lgonzalez.dev';

// Parses a feed in the browser: fails on invalid XML.
async function readFeed(page: Page, path: string) {
	const response = await page.request.get(path);
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toMatch(/xml/);
	const xml = await response.text();
	await page.goto('/');
	return page.evaluate((source) => {
		const doc = new DOMParser().parseFromString(source, 'application/xml');
		return {
			error: doc.querySelector('parsererror')?.textContent ?? null,
			language: doc.querySelector('channel > language')?.textContent,
			title: doc.querySelector('channel > title')?.textContent,
			links: [...doc.querySelectorAll('item > link')].map((link) => link.textContent ?? ''),
		};
	}, xml);
}

test('the Spanish feed is valid XML with Spanish posts and notes only', async ({ page }) => {
	const feed = await readFeed(page, '/rss.xml');
	expect(feed.error).toBeNull();
	expect(feed.language).toBe('es-ES');
	expect(feed.links).toContain(`${SITE}/blog/usando-mdx/`);
	expect(feed.links).toContain(`${SITE}/notas/primera-nota/`);
	expect(feed.links.filter((link) => link.startsWith(`${SITE}/en/`))).toEqual([]);
});

test('the English feed is valid XML with English content only and no drafts', async ({ page }) => {
	const feed = await readFeed(page, '/en/rss.xml');
	expect(feed.error).toBeNull();
	expect(feed.language).toBe('en-US');
	expect(feed.links).toContain(`${SITE}/en/blog/using-mdx/`);
	expect(feed.links).toContain(`${SITE}/en/notes/first-note/`);
	expect(feed.links.every((link) => link.startsWith(`${SITE}/en/`))).toBe(true);
	expect(feed.links.some((link) => link.includes('markdown-style-guide'))).toBe(false);
});

for (const [path, feed] of [
	['/', '/rss.xml'],
	['/blog/usando-mdx/', '/rss.xml'],
	['/en/', '/en/rss.xml'],
	['/en/notes/first-note/', '/en/rss.xml'],
] as const) {
	test(`${path} links the feed of its language`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
			'href',
			`${SITE}${feed}`,
		);
	});
}
