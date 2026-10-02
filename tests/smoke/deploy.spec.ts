import { expect, test } from '@playwright/test';

// Only things that always exist, whatever the real content is.

test('the Spanish home page is up', async ({ page }) => {
	const response = await page.goto('/');
	expect(response?.status()).toBe(200);
	await expect(page.locator('html')).toHaveAttribute('lang', 'es');
	await expect(page).toHaveTitle(/Luis González/);
});

test('the English home page is up', async ({ page }) => {
	const response = await page.goto('/en/');
	expect(response?.status()).toBe(200);
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('the blog lists posts and the latest one opens, or says there are none yet', async ({ page }) => {
	expect((await page.goto('/blog/'))?.status()).toBe(200);
	const first = page.locator('main article h2 a').first();
	if ((await first.count()) === 0) {
		// A blog with no posts yet is a valid state: it must say so instead of failing.
		await expect(page.getByText('Todavía no hay artículos.')).toBeVisible();
		return;
	}
	const href = await first.getAttribute('href');
	expect(href).toMatch(/^\/blog\/.+\/$/);
	expect((await page.goto(href!))?.status()).toBe(200);
	await expect(page.locator('article h1')).toBeVisible();
});

test('feeds, sitemap and robots.txt are served', async ({ request }) => {
	for (const path of ['/rss.xml', '/en/rss.xml', '/sitemap-index.xml', '/robots.txt']) {
		expect((await request.get(path)).status(), path).toBe(200);
	}
});

test('unknown URLs get the site 404 page', async ({ page }) => {
	const response = await page.goto('/esta-pagina-no-existe-smoke/');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
});
