import { expect, type Locator, test } from '@playwright/test';

async function expectVisibleFocus(locator: Locator) {
	await expect(locator).toBeFocused();
	const outline = await locator.evaluate((el) => {
		const style = getComputedStyle(el);
		return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
	});
	expect(outline.style).not.toBe('none');
	expect(outline.width).toBeGreaterThanOrEqual(2);
}

test('the first Tab shows the skip link, which jumps to the main content', async ({ page }) => {
	await page.goto('/blog/');
	await page.keyboard.press('Tab');
	const skip = page.getByRole('link', { name: 'Saltar al contenido' });
	await expectVisibleFocus(skip);
	await expect(skip).toBeInViewport();
	await page.keyboard.press('Enter');
	await expect(page.locator('main')).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator('main a').first()).toBeFocused();
});

test('header links, language picker and theme toggle are reachable with a visible focus', async ({
	page,
}) => {
	await page.goto('/en/');
	const targets = [
		page.getByRole('link', { name: 'Skip to content' }),
		page.getByRole('link', { name: 'Luis González' }).first(),
		page.getByRole('link', { name: 'Home', exact: true }),
		page.getByRole('link', { name: 'Blog', exact: true }).first(),
		page.getByRole('link', { name: 'Projects', exact: true }).first(),
		page.getByRole('link', { name: 'Notes', exact: true }).first(),
		page.getByRole('link', { name: 'About', exact: true }),
		page.getByRole('link', { name: 'Español' }),
		page.getByRole('button', { name: 'Dark mode' }),
	];
	for (const target of targets) {
		await page.keyboard.press('Tab');
		await expectVisibleFocus(target);
	}
	await page.keyboard.press('Enter');
	await expect(page.getByRole('button', { name: 'Dark mode' })).toHaveAttribute('aria-pressed', 'true');
});
