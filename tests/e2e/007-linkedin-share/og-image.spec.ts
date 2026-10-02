import { expect, test } from '@playwright/test';
import sharp from 'sharp';

const content = (page: import('@playwright/test').Page, property: string) =>
	page.locator(`meta[property="${property}"]`).first().getAttribute('content');

for (const [path, image, alt] of [
	['/blog/articulo-con-codigo/', '/og/blog/es/articulo-con-codigo.png', 'Artículo con código'],
	['/en/blog/post-with-code/', '/og/blog/en/post-with-code.png', 'Post with code'],
	['/notas/primera-nota/', '/og/notes/es/primera-nota.png', 'Primera nota'],
	['/en/projects/lgonzalez-dev/', '/og/projects/en/lgonzalez-dev.png', 'lgonzalez.dev'],
] as const) {
	test(`${path} without cover shares a generated 1200×627 image`, async ({ page, request }) => {
		await page.goto(path);
		expect(await content(page, 'og:image')).toBe(`https://lgonzalez.dev${image}`);
		expect(await content(page, 'og:image:alt')).toBe(alt);
		const response = await request.get(image);
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toMatch(/image\/png/);
		const { width, height } = await sharp(await response.body()).metadata();
		expect({ width, height }).toEqual({ width: 1200, height: 627 });
	});
}

test('a post with a cover keeps sharing its cover', async ({ page }) => {
	await page.goto('/blog/usando-mdx/');
	expect(await content(page, 'og:image')).toMatch(/\/_astro\/blog-placeholder-5\./);
});

test('translations get images in their own language', async ({ request }) => {
	const es = await (await request.get('/og/blog/es/articulo-con-codigo.png')).body();
	const en = await (await request.get('/og/blog/en/post-with-code.png')).body();
	expect(es.equals(en)).toBe(false);
});
