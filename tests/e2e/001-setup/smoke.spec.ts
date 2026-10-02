import { expect, test } from '@playwright/test';

test('la portada responde 200 y tiene título', async ({ page }) => {
	const response = await page.goto('/');
	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle(/Luis González/);
});

test('un post MDX se publica', async ({ page }) => {
	const response = await page.goto('/blog/usando-mdx/');
	expect(response?.status()).toBe(200);
	await expect(page.locator('article h1')).toBeVisible();
});

test('el sitemap se genera con el dominio definitivo', async ({ request }) => {
	const response = await request.get('/sitemap-index.xml');
	expect(response.status()).toBe(200);
	expect(await response.text()).toContain('https://lgonzalez.dev/');
});

test('una ruta inexistente muestra la página 404 propia', async ({ page }) => {
	const response = await page.goto('/esta-pagina-no-existe/');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
	await expect(page.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/');
});

test('las utilidades de Tailwind se aplican', async ({ page }) => {
	await page.goto('/esta-pagina-no-existe/');
	// La página 404 usa `text-center` en su contenedor principal.
	await expect(page.locator('main')).toHaveCSS('text-align', 'center');
});

test('las pruebas funcionales se ejecutan sobre el build, no sobre `astro dev`', async ({ page }) => {
	// Regresión: Playwright reutilizaba el servidor de desarrollo si estaba arrancado en el mismo puerto.
	const response = await page.goto('/');
	expect(await response?.text()).not.toContain('/@vite/client');
});
