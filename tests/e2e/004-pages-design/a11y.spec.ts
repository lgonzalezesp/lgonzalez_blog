import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

const ALL = [...Object.values(PAGES).flat(), '/no-existe/'];

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`${colorScheme} theme`, () => {
		test.use({ colorScheme });

		for (const path of ALL) {
			test(`${path} has no serious accessibility violations`, async ({ page }) => {
				await page.goto(path);
				const { violations } = await new AxeBuilder({ page })
					.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
					.analyze();
				const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
				expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target).join(', ')})`)).toEqual(
					[],
				);
			});
		}
	});
}
