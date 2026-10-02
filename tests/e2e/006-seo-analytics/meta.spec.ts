import { expect, type Page, test } from '@playwright/test';
import sharp from 'sharp';
import { PAGES } from '../004-pages-design/pages';

const SITE = 'https://lgonzalez.dev';

const content = (page: Page, selector: string) => page.locator(selector).first().getAttribute('content');
const ogImage = (page: Page) => content(page, 'meta[property="og:image"]');

for (const path of Object.values(PAGES).flat()) {
	test(`${path} has title, description, canonical, Open Graph and Twitter tags`, async ({ page }) => {
		await page.goto(path);
		expect((await page.title()).trim()).not.toBe('');
		expect(await content(page, 'meta[name="description"]')).toBeTruthy();
		expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`${SITE}${path}`);
		for (const property of [
			'og:title',
			'og:description',
			'og:url',
			'og:type',
			'og:locale',
			'og:image',
			'og:image:alt',
		]) {
			expect(await content(page, `meta[property="${property}"]`), property).toBeTruthy();
		}
		for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
			expect(await content(page, `meta[name="${name}"]`), name).toBeTruthy();
		}
		expect(await ogImage(page)).toMatch(/^https:\/\/lgonzalez\.dev\//);
		expect(await content(page, 'meta[property="og:locale"]')).toBe(
			path.startsWith('/en/') ? 'en_US' : 'es_ES',
		);
	});
}

for (const path of ['/blog/usando-mdx/', '/blog/articulo-con-codigo/', '/en/']) {
	test(`${path}: og:image is a downloadable 1200×627 image`, async ({ page, request }) => {
		await page.goto(path);
		const image = new URL((await ogImage(page))!);
		const response = await request.get(image.pathname);
		expect(response.status()).toBe(200);
		const { width, height } = await sharp(await response.body()).metadata();
		expect({ width, height }).toEqual({ width: 1200, height: 627 });
		expect(await content(page, 'meta[property="og:image:width"]')).toBe('1200');
		expect(await content(page, 'meta[property="og:image:height"]')).toBe('627');
	});
}

test('a post with a cover shares its cover; one without uses the default image', async ({ page }) => {
	await page.goto('/blog/usando-mdx/');
	const withCover = await ogImage(page);
	expect(withCover).not.toMatch(/og-default/);
	expect(await content(page, 'meta[property="og:image:alt"]')).toBe(
		'Degradado abstracto usado como imagen de ejemplo',
	);

	await page.goto('/blog/articulo-con-codigo/');
	expect(await ogImage(page)).toMatch(/og-default/);
});

test('posts are articles with publication date and tags', async ({ page }) => {
	await page.goto('/en/blog/post-with-code/');
	expect(await content(page, 'meta[property="og:type"]')).toBe('article');
	expect(await content(page, 'meta[property="article:published_time"]')).toBe('2026-02-01T00:00:00.000Z');
	expect(await content(page, 'meta[property="article:modified_time"]')).toBe('2026-03-01T00:00:00.000Z');
	expect(
		await page
			.locator('meta[property="article:tag"]')
			.evaluateAll((m) => m.map((e) => e.getAttribute('content'))),
	).toEqual(['astro', 'code']);
});

test('the 404 page is not indexed', async ({ page }) => {
	await page.goto('/no-existe/');
	expect(await content(page, 'meta[name="robots"]')).toBe('noindex');
	await page.goto('/');
	await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});
