import { expect, test } from '@playwright/test';

const HEADER = {
	es: [
		['Inicio', '/'],
		['Blog', '/blog/'],
		['Proyectos', '/proyectos/'],
		['Notas', '/notas/'],
		['Sobre mí', '/sobre-mi/'],
	],
	en: [
		['Home', '/en/'],
		['Blog', '/en/blog/'],
		['Projects', '/en/projects/'],
		['Notes', '/en/notes/'],
		['About', '/en/about/'],
	],
} as const;

for (const [lang, links] of Object.entries(HEADER)) {
	for (const [name, url] of links) {
		test(`the header (${lang}) leads to ${url}`, async ({ page }) => {
			await page.goto(lang === 'es' ? '/notas/' : '/en/notes/');
			await page
				.getByRole('navigation', { name: lang === 'es' ? 'Principal' : 'Main' })
				.getByRole('link', { name, exact: true })
				.click();
			await expect(page).toHaveURL(url);
			expect((await page.request.get(url)).status()).toBe(200);
		});
	}
}

test('a post card leads to the post', async ({ page }) => {
	await page.goto('/blog/');
	const card = page.locator('main article').first();
	const title = (await card.getByRole('heading').textContent())?.trim() ?? '';
	await card.getByRole('link', { name: title }).click();
	await expect(page.locator('article h1')).toHaveText(title);
});

test('a project card leads to the project', async ({ page }) => {
	await page.goto('/en/projects/');
	await page.getByRole('link', { name: 'Archived project' }).click();
	await expect(page).toHaveURL('/en/projects/archived-project/');
	await expect(page.locator('h1')).toHaveText('Archived project');
});

test('a note card leads to the note', async ({ page }) => {
	await page.goto('/notas/');
	await page.getByRole('link', { name: 'Primera nota' }).click();
	await expect(page).toHaveURL('/notas/primera-nota/');
});

test('the home page shows latest posts, featured projects and notes', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Últimos artículos' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Proyectos destacados' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Últimas notas' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'lgonzalez.dev' }).first()).toBeVisible();
	await expect(page.getByRole('link', { name: 'Proyecto archivado' })).toHaveCount(0);
});

test('a post shows its reading time and table of contents', async ({ page }) => {
	await page.goto('/blog/articulo-con-codigo/');
	await expect(page.getByText('1 min de lectura')).toBeVisible();
	const toc = page.getByRole('navigation', { name: 'En este artículo' });
	await toc.getByRole('link', { name: 'Requisitos' }).click();
	await expect(page).toHaveURL(/#requisitos$/);
	await page.goto('/en/blog/post-with-code/');
	await expect(page.getByText('1 min read')).toBeVisible();
	await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
});
