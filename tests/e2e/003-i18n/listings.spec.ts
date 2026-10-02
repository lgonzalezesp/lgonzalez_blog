import { expect, test } from '@playwright/test';

test('the English blog only lists English posts', async ({ page }) => {
	await page.goto('/en/blog/');
	const hrefs = await page.locator('main a').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
	expect(hrefs).toContain('/en/blog/using-mdx/');
	expect(hrefs.filter((href) => href?.startsWith('/blog/'))).toEqual([]);
});

test('the Spanish blog only lists Spanish posts', async ({ page }) => {
	await page.goto('/blog/');
	const hrefs = await page.locator('main a').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
	expect(hrefs).toContain('/blog/usando-mdx/');
	expect(hrefs).toContain('/blog/articulo-sin-traduccion/');
	expect(hrefs.filter((href) => href?.startsWith('/en/'))).toEqual([]);
});
