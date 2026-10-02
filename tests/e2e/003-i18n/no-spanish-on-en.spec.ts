import { expect, test } from '@playwright/test';
import { ui } from '../../../src/i18n/ui';

// UI texts that only exist in Spanish (values shared by both languages, like "Blog", are skipped).
const englishValues = new Set(Object.values(ui.en));
const spanishOnly = Object.values(ui.es).filter((text) => !englishValues.has(text));

const EN_PAGES = ['/en/', '/en/blog/', '/en/about/', '/en/blog/using-mdx/', '/en/notes/first-note/'];

for (const path of EN_PAGES) {
	test(`${path} shows no Spanish UI text`, async ({ page }) => {
		await page.goto(path);
		// Visible text, accessible labels and the title, ignoring elements explicitly marked as Spanish
		// (the language picker says "Español" on purpose).
		const text = await page.evaluate(() => {
			const body = document.body.cloneNode(true) as HTMLElement;
			body.querySelectorAll('[lang="es"]').forEach((el) => el.remove());
			const labels = [...body.querySelectorAll('[aria-label],[title],[alt]')].map((el) =>
				['aria-label', 'title', 'alt'].map((attr) => el.getAttribute(attr) ?? '').join(' '),
			);
			return [document.title, body.innerText, ...labels].join('\n');
		});
		const found = spanishOnly.filter((spanish) => text.includes(spanish));
		expect(found).toEqual([]);
	});
}

test('dates are formatted in English on English pages and in Spanish on Spanish pages', async ({ page }) => {
	await page.goto('/en/blog/using-mdx/');
	await expect(page.locator('article time').first()).toHaveText('June 1, 2024');
	await page.goto('/blog/usando-mdx/');
	await expect(page.locator('article time').first()).toHaveText('1 de junio de 2024');
});
