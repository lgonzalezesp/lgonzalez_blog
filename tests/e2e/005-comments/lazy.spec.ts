import { expect, test } from '@playwright/test';
import { stubGiscus } from './giscus-stub';

test.use({ viewport: { width: 1280, height: 500 } });

test('Giscus is not requested until the comments come into view', async ({ page }) => {
	const requests = await stubGiscus(page);
	await page.goto('/blog/articulo-con-codigo/');
	await page.waitForLoadState('networkidle');
	expect(requests).toEqual([]);

	await page.locator('#comments').scrollIntoViewIfNeeded();
	await expect.poll(() => requests).toContain('https://giscus.app/client.js');
	await expect(page.locator('#comments iframe.giscus-frame')).toBeAttached();
});
