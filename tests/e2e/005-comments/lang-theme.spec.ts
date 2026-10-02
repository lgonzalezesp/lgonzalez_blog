import { expect, test } from '@playwright/test';
import { giscusConfig, giscusMessages, stubGiscus } from './giscus-stub';

async function openComments(page: import('@playwright/test').Page, path: string) {
	await stubGiscus(page);
	await page.goto(path);
	await page.locator('#comments').scrollIntoViewIfNeeded();
	return giscusConfig(page);
}

test('Giscus speaks Spanish on Spanish pages, one thread per URL', async ({ page }) => {
	const config = await openComments(page, '/blog/usando-mdx/');
	expect(config).toMatchObject({
		'data-lang': 'es',
		'data-mapping': 'pathname',
		'data-strict': '1',
		'data-repo': 'lgonzalezesp/lgonzalez_blog',
		'data-category': 'Comments',
	});
});

test('Giscus speaks English on English pages', async ({ page }) => {
	expect(await openComments(page, '/en/blog/using-mdx/')).toMatchObject({ 'data-lang': 'en' });
});

test.describe('light system theme', () => {
	test.use({ colorScheme: 'light' });

	test('starts light and follows the theme toggle', async ({ page }) => {
		expect(await openComments(page, '/blog/usando-mdx/')).toMatchObject({ 'data-theme': 'light' });
		await expect(page.locator('#comments iframe.giscus-frame')).toBeAttached();
		await page.waitForLoadState('networkidle');

		await page.getByRole('button', { name: 'Modo oscuro' }).click();
		await expect
			.poll(() => giscusMessages(page))
			.toContainEqual({ giscus: { setConfig: { theme: 'dark' } } });

		await page.getByRole('button', { name: 'Modo oscuro' }).click();
		await expect
			.poll(() => giscusMessages(page))
			.toContainEqual({ giscus: { setConfig: { theme: 'light' } } });
	});
});

test.describe('dark system theme', () => {
	test.use({ colorScheme: 'dark' });

	test('starts dark', async ({ page }) => {
		expect(await openComments(page, '/en/projects/lgonzalez-dev/')).toMatchObject({ 'data-theme': 'dark' });
	});
});
