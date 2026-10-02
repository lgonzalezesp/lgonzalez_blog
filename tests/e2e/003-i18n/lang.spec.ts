import { expect, test } from '@playwright/test';

for (const [path, lang] of [
	['/', 'es'],
	['/en/', 'en'],
	['/blog/usando-mdx/', 'es'],
	['/en/blog/using-mdx/', 'en'],
	['/sobre-mi/', 'es'],
	['/en/about/', 'en'],
	['/en/notes/first-note/', 'en'],
] as const) {
	test(`${path} declares <html lang="${lang}">`, async ({ page }) => {
		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page.locator('html')).toHaveAttribute('lang', lang);
	});
}
