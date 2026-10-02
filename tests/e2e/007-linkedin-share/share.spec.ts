import { expect, test } from '@playwright/test';

const SITE = 'https://lgonzalez.dev';
const share = (path: string) =>
	`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE}${path}`)}`;

for (const [path, name] of [
	['/blog/usando-mdx/', 'Compartir en LinkedIn'],
	['/en/blog/using-mdx/', 'Share on LinkedIn'],
	['/proyectos/lgonzalez-dev/', 'Compartir en LinkedIn'],
	['/en/projects/lgonzalez-dev/', 'Share on LinkedIn'],
] as const) {
	test(`${path} has the LinkedIn button at the top and at the end, sharing its own URL`, async ({ page }) => {
		await page.goto(path);
		const links = page.getByRole('link', { name: new RegExp(name) });
		await expect(links).toHaveCount(2);
		for (const link of await links.all()) {
			await expect(link).toHaveAttribute('href', share(path));
			await expect(link).toHaveAttribute('target', '_blank');
		}
		const title = await page.locator('article h1').boundingBox();
		const content = await page.locator('article .prose').boundingBox();
		const [top, bottom] = await Promise.all((await links.all()).map((link) => link.boundingBox()));
		expect(top!.y).toBeGreaterThan(title!.y);
		expect(top!.y).toBeLessThan(content!.y);
		expect(bottom!.y).toBeGreaterThan(content!.y + content!.height - 1);
	});
}

for (const path of [
	'/',
	'/blog/',
	'/notas/primera-nota/',
	'/en/notes/first-note/',
	'/proyectos/',
	'/sobre-mi/',
]) {
	test(`${path} has no share buttons`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('.share')).toHaveCount(0);
	});
}

test('no LinkedIn script, iframe, request or cookie', async ({ page, context }) => {
	const requests: string[] = [];
	page.on('request', (request) => requests.push(request.url()));
	for (const path of ['/blog/usando-mdx/', '/en/projects/lgonzalez-dev/']) {
		await page.goto(path);
		await page.waitForLoadState('networkidle');
		await expect(page.locator('script[src*="linkedin"], iframe[src*="linkedin"]')).toHaveCount(0);
	}
	expect(requests.filter((url) => url.includes('linkedin') || url.includes('licdn'))).toEqual([]);
	expect(await context.cookies()).toEqual([]);
});
