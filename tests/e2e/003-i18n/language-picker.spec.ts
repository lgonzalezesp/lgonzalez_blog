import { expect, test } from '@playwright/test';

const picker = (page: import('@playwright/test').Page) => page.locator('header a[hreflang]');

for (const [from, to] of [
	['/blog/usando-mdx/', '/en/blog/using-mdx/'],
	['/en/blog/using-mdx/', '/blog/usando-mdx/'],
	['/notas/primera-nota/', '/en/notes/first-note/'],
	['/blog/articulo-sin-traduccion/', '/en/'],
	['/', '/en/'],
	['/en/blog/', '/blog/'],
	['/sobre-mi/', '/en/about/'],
] as const) {
	test(`the language picker on ${from} goes to ${to}`, async ({ page }) => {
		await page.goto(from);
		await picker(page).click();
		await expect(page).toHaveURL(to);
	});
}

test('the picker names the target language in that language', async ({ page }) => {
	await page.goto('/');
	await expect(picker(page)).toHaveText('English');
	await expect(picker(page)).toHaveAttribute('lang', 'en');
	await page.goto('/en/');
	await expect(picker(page)).toHaveText('Español');
	await expect(picker(page)).toHaveAttribute('lang', 'es');
});
