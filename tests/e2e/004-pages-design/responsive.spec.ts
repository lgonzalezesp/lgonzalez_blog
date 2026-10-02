import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

const ALL = [...Object.values(PAGES).flat(), '/no-existe/'];

for (const width of [320, 1280]) {
	test.describe(`at ${width}px`, () => {
		test.use({ viewport: { width, height: 800 } });

		for (const path of ALL) {
			test(`${path} has no horizontal scroll`, async ({ page }) => {
				await page.goto(path);
				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
				);
				expect(overflow).toBeLessThanOrEqual(0);
			});
		}
	});
}

test.describe('mobile header', () => {
	test.use({ viewport: { width: 320, height: 640 } });

	test('every header link is visible and usable at 320px', async ({ page }) => {
		await page.goto('/');
		const nav = page.getByRole('navigation', { name: 'Principal' });
		const links = nav.getByRole('link');
		await expect(links).toHaveCount(5);
		for (const link of await links.all()) {
			await expect(link).toBeVisible();
			await expect(link).toBeInViewport();
		}
		await nav.getByRole('link', { name: 'Proyectos' }).click();
		await expect(page).toHaveURL('/proyectos/');
		await expect(page.getByRole('link', { name: 'English' })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Modo oscuro' })).toBeInViewport();
	});
});
