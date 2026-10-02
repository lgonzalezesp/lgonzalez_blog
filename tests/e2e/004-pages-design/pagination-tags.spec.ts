import { expect, test } from '@playwright/test';

test('the blog is paginated, 10 posts per page', async ({ page }) => {
	await page.goto('/blog/');
	await expect(page.locator('main article')).toHaveCount(10);
	await expect(page.getByText('Página 1 de 2')).toBeVisible();

	await page.getByRole('link', { name: /Siguiente/ }).click();
	await expect(page).toHaveURL('/blog/pagina/2/');
	await expect(page.locator('main article')).toHaveCount(5);

	await page.getByRole('link', { name: /Anterior/ }).click();
	await expect(page).toHaveURL('/blog/');
});

test('pages out of range do not exist', async ({ page }) => {
	expect((await page.goto('/blog/pagina/99/'))?.status()).toBe(404);
	expect((await page.goto('/blog/pagina/1/'))?.status()).toBe(404);
});

test('a short blog has no pagination', async ({ page }) => {
	await page.goto('/en/blog/');
	await expect(page.getByRole('navigation', { name: 'Pagination' })).toHaveCount(0);
});

test('the tags index links to each tag', async ({ page }) => {
	await page.goto('/etiquetas/');
	await page.getByRole('link', { name: /web/ }).first().click();
	await expect(page).toHaveURL('/etiquetas/web/');
});

test('a tag page only lists content with that tag, of every type', async ({ page }) => {
	await page.goto('/etiquetas/web/');
	await expect(page.locator('h1')).toContainText('web');
	await expect(page.getByRole('link', { name: 'Artículo de prueba 04' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Proyecto archivado' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Artículo de prueba 01' })).toHaveCount(0);

	await page.goto('/etiquetas/astro/');
	await expect(page.getByRole('link', { name: 'Segunda nota' })).toBeVisible();
});

test('clicking a tag on a post opens the tag page', async ({ page }) => {
	await page.goto('/en/blog/post-with-code/');
	await page.getByRole('link', { name: '#astro' }).first().click();
	await expect(page).toHaveURL('/en/tags/astro/');
});
