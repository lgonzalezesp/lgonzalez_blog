import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

for (const path of Object.values(PAGES).flat()) {
	test(`${path}: every image has alt text, size and an optimised source`, async ({ page }) => {
		await page.goto(path);
		const images = await page.locator('img').evaluateAll((imgs) =>
			imgs.map((img) => ({
				src: img.getAttribute('src') ?? '',
				alt: img.getAttribute('alt'),
				width: img.getAttribute('width'),
				height: img.getAttribute('height'),
			})),
		);
		for (const image of images) {
			expect(image.alt, image.src).not.toBeNull();
			expect(image.alt?.trim(), image.src).not.toBe('');
			expect(image.src).toMatch(/^\/_astro\/.+\.(webp|avif)$/);
			expect(image.width).not.toBeNull();
			expect(image.height).not.toBeNull();
		}
	});
}

test('pages with covers do show images', async ({ page }) => {
	await page.goto('/blog/usando-mdx/');
	await expect(page.locator('article img').first()).toBeVisible();
});
