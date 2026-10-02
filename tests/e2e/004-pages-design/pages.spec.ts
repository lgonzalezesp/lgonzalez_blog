import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

test('the e2e build uses the test fixtures, not the real content', async ({ page }) => {
	const response = await page.goto('/blog/articulo-de-prueba-01/');
	expect(response?.status()).toBe(200);
});

for (const path of Object.values(PAGES).flat()) {
	test(`${path} responds 200 with a single h1`, async ({ page }) => {
		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page.locator('h1')).toHaveCount(1);
	});
}

test('the 404 page uses the site layout', async ({ page }) => {
	const response = await page.goto('/no-existe/');
	expect(response?.status()).toBe(404);
	await expect(page.locator('header nav')).toBeVisible();
});
