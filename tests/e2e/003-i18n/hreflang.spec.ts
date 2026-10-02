import { expect, test } from '@playwright/test';

const SITE = 'https://lgonzalez.dev';

async function hreflangs(page: import('@playwright/test').Page) {
	return page
		.locator('head link[rel="alternate"][hreflang]')
		.evaluateAll((links) =>
			Object.fromEntries(links.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')])),
		);
}

test('a post and its translation point to each other with hreflang', async ({ page }) => {
	const expected = {
		es: `${SITE}/blog/usando-mdx/`,
		en: `${SITE}/en/blog/using-mdx/`,
		'x-default': `${SITE}/blog/usando-mdx/`,
	};
	await page.goto('/blog/usando-mdx/');
	expect(await hreflangs(page)).toEqual(expected);
	await page.goto('/en/blog/using-mdx/');
	expect(await hreflangs(page)).toEqual(expected);
});

test('sections point to their counterpart', async ({ page }) => {
	await page.goto('/en/about/');
	expect(await hreflangs(page)).toMatchObject({ es: `${SITE}/sobre-mi/`, en: `${SITE}/en/about/` });
});

test('a post without translation announces no alternate', async ({ page }) => {
	await page.goto('/blog/articulo-sin-traduccion/');
	expect(await hreflangs(page)).toEqual({});
});
