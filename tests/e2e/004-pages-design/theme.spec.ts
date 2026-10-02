import { expect, type Page, test } from '@playwright/test';

const LIGHT_BG = 'rgb(255, 255, 255)';
const DARK_BG = 'rgb(24, 24, 27)';

const background = (page: Page) =>
	page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
const toggle = (page: Page, name = 'Modo oscuro') => page.getByRole('button', { name });

test.describe('with a light system preference', () => {
	test.use({ colorScheme: 'light' });

	test('starts light, the toggle switches to dark and the choice survives a reload', async ({ page }) => {
		await page.goto('/');
		expect(await background(page)).toBe(LIGHT_BG);
		await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');

		await toggle(page).click();
		expect(await background(page)).toBe(DARK_BG);
		await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');

		await page.reload();
		expect(await background(page)).toBe(DARK_BG);
		await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
	});

	test('the choice also applies on other pages and in English', async ({ page }) => {
		await page.goto('/');
		await toggle(page).click();
		await page.goto('/en/blog/');
		expect(await background(page)).toBe(DARK_BG);
		await expect(toggle(page, 'Dark mode')).toHaveAttribute('aria-pressed', 'true');
	});
});

test.describe('with a dark system preference', () => {
	test.use({ colorScheme: 'dark' });

	test('follows the system and lets the reader switch back to light', async ({ page }) => {
		await page.goto('/');
		expect(await background(page)).toBe(DARK_BG);
		await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');

		await toggle(page).click();
		expect(await background(page)).toBe(LIGHT_BG);
		await page.reload();
		expect(await background(page)).toBe(LIGHT_BG);
	});
});

test.describe('without JavaScript', () => {
	test.use({ colorScheme: 'dark', javaScriptEnabled: false });

	test('still follows the system preference and hides the toggle', async ({ page }) => {
		await page.goto('/');
		expect(await background(page)).toBe(DARK_BG);
		await expect(toggle(page)).toBeHidden();
	});
});
