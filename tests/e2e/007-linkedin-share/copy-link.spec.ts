import { expect, test } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

for (const [path, name, copied] of [
	['/blog/usando-mdx/', 'Copiar enlace', 'Enlace copiado'],
	['/en/projects/lgonzalez-dev/', 'Copy link', 'Link copied'],
] as const) {
	test(`"${name}" copies the canonical URL of ${path} and announces it`, async ({ page }) => {
		await page.goto(path);
		await page.getByRole('button', { name }).first().click();
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`https://lgonzalez.dev${path}`);
		await expect(page.getByRole('status').filter({ hasText: copied })).toBeVisible();
	});
}

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('the copy button is not shown, sharing still works', async ({ page }) => {
		await page.goto('/blog/usando-mdx/');
		await expect(page.getByRole('button', { name: 'Copiar enlace' })).toHaveCount(0);
		await expect(page.getByRole('link', { name: /Compartir en LinkedIn/ }).first()).toBeVisible();
	});
});
