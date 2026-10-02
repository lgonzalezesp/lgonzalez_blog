import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	// The real scripts only exist on Vercel; serve empty ones from the same paths.
	await page.route('**/_vercel/**', (route) =>
		route.fulfill({ contentType: 'application/javascript', body: '' }),
	);
});

test('Vercel Web Analytics and Speed Insights are loaded from the same origin', async ({ page }) => {
	const requests: string[] = [];
	page.on('request', (request) => requests.push(new URL(request.url()).pathname));
	await page.goto('/en/');
	await page.waitForLoadState('networkidle');
	expect(requests).toContain('/_vercel/insights/script.js');
	expect(requests).toContain('/_vercel/speed-insights/script.js');
});

test('browsing the site leaves no cookies', async ({ page, context }) => {
	for (const path of [
		'/',
		'/blog/usando-mdx/',
		'/en/projects/lgonzalez-dev/',
		'/notas/',
		'/en/tags/astro/',
	]) {
		await page.goto(path);
		await page.waitForLoadState('networkidle');
	}
	expect(await context.cookies()).toEqual([]);
});
