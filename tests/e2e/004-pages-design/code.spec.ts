import { expect, type Page, test } from '@playwright/test';

const CODE_URL = '/blog/articulo-con-codigo/';

// Colours of the code block and of its tokens, as rendered.
async function codeColors(page: Page) {
	return page.locator('pre.astro-code').evaluate((pre) => ({
		background: getComputedStyle(pre).backgroundColor,
		tokens: [...new Set([...pre.querySelectorAll('span span')].map((s) => getComputedStyle(s).color))],
	}));
}

test('code blocks are highlighted in the light theme', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto(CODE_URL);
	const { tokens } = await codeColors(page);
	expect(tokens.length).toBeGreaterThan(2);
});

test('code blocks switch to the dark highlighting theme', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto(CODE_URL);
	const light = await codeColors(page);
	await page.emulateMedia({ colorScheme: 'dark' });
	const dark = await codeColors(page);
	expect(dark.tokens.length).toBeGreaterThan(2);
	expect(dark.background).not.toBe(light.background);
	expect(dark.tokens).not.toEqual(light.tokens);
});
