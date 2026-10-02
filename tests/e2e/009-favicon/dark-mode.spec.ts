import { expect, type Page, test } from '@playwright/test';
import sharp from 'sharp';

const SIZE = 256;

/** Color of a pixel inside the card, above the letters (the corners are transparent). */
async function cardColor(page: Page) {
	const png = await page.screenshot({ clip: { x: 0, y: 0, width: SIZE, height: SIZE } });
	const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
	const at = (16 * SIZE + SIZE / 2) * info.channels;
	return { png, rgb: [data[at], data[at + 1], data[at + 2]] };
}

test('favicon.svg changes colors with the browser color scheme', async ({ browser }) => {
	const seen: Record<string, number[]> = {};
	for (const colorScheme of ['light', 'dark'] as const) {
		const context = await browser.newContext({ colorScheme, viewport: { width: SIZE, height: SIZE } });
		const page = await context.newPage();
		await page.goto('/favicon.svg');
		const { png, rgb } = await cardColor(page);
		const stats = await sharp(png).stats();
		expect(stats.channels[0].stdev, `${colorScheme}: not blank`).toBeGreaterThan(5);
		seen[colorScheme] = rgb;
		await context.close();
	}
	// Light: blue card (#1d4ed8); dark: light-blue card (#93c5fd).
	expect(seen.light[2]).toBeGreaterThan(seen.light[0] + 100);
	expect(seen.dark[0]).toBeGreaterThan(seen.light[0] + 60);
	expect(seen.dark).not.toEqual(seen.light);
});
