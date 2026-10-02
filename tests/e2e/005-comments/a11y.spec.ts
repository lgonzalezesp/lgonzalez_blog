import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { stubGiscus } from './giscus-stub';

for (const path of ['/blog/usando-mdx/', '/en/projects/lgonzalez-dev/']) {
	test(`${path} with comments has no serious accessibility violations`, async ({ page }) => {
		await stubGiscus(page);
		await page.goto(path);
		await page.locator('#comments').scrollIntoViewIfNeeded();
		await expect(page.locator('#comments iframe')).toBeAttached();
		const { violations } = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.exclude('#comments iframe') // third-party content, simulated here
			.analyze();
		const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
		expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
	});
}
