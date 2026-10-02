import { expect, type Page, test } from '@playwright/test';

// Links of every page of a (paginated, since 004) blog listing.
async function listingLinks(page: Page, firstPage: string) {
	const hrefs: (string | null)[] = [];
	let url: string | null = firstPage;
	while (url) {
		await page.goto(url);
		hrefs.push(
			...(await page.locator('main a').evaluateAll((links) => links.map((a) => a.getAttribute('href')))),
		);
		url = await page
			.locator('a[rel="next"]')
			.getAttribute('href', { timeout: 500 })
			.catch(() => null);
	}
	return hrefs;
}

test('the English blog only lists English posts', async ({ page }) => {
	const hrefs = await listingLinks(page, '/en/blog/');
	expect(hrefs).toContain('/en/blog/using-mdx/');
	expect(hrefs.filter((href) => href?.startsWith('/blog/'))).toEqual([]);
});

test('the Spanish blog only lists Spanish posts', async ({ page }) => {
	const hrefs = await listingLinks(page, '/blog/');
	expect(hrefs).toContain('/blog/usando-mdx/');
	expect(hrefs).toContain('/blog/articulo-sin-traduccion/');
	expect(hrefs.filter((href) => href?.startsWith('/en/'))).toEqual([]);
});
