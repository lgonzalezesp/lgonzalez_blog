import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`${colorScheme} theme`, () => {
		test.use({ colorScheme, permissions: ['clipboard-read', 'clipboard-write'] });

		for (const path of ['/blog/usando-mdx/', '/en/projects/lgonzalez-dev/', '/sobre-mi/']) {
			test(`${path} with share buttons has no serious accessibility violations`, async ({ page }) => {
				await page.goto(path);
				const copy = page.locator('.copy-link').first();
				if (await copy.count()) await copy.click(); // also check the confirmation message
				const { violations } = await new AxeBuilder({ page })
					.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
					.exclude('#comments iframe')
					.analyze();
				const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
				expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
			});
		}
	});
}
