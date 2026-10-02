import { expect, test } from '@playwright/test';
import { stubGiscus } from './giscus-stub';

test.beforeEach(async ({ page }) => {
	await stubGiscus(page);
});

for (const [path, title] of [
	['/blog/usando-mdx/', 'Comentarios'],
	['/en/blog/using-mdx/', 'Comments'],
	['/proyectos/lgonzalez-dev/', 'Comentarios'],
	['/en/projects/lgonzalez-dev/', 'Comments'],
] as const) {
	test(`${path} ends with the comments section`, async ({ page }) => {
		await page.goto(path);
		const comments = page.locator('#comments');
		await expect(comments.getByRole('heading', { name: title })).toBeVisible();
		const article = await page.locator('main article').boundingBox();
		const section = await comments.boundingBox();
		expect(section!.y).toBeGreaterThan(article!.y + article!.height - 1);
	});
}

for (const path of [
	'/',
	'/blog/',
	'/proyectos/',
	'/notas/',
	'/notas/primera-nota/',
	'/en/notes/first-note/',
	'/sobre-mi/',
	'/etiquetas/astro/',
]) {
	test(`${path} has no comments`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('#comments')).toHaveCount(0);
	});
}
