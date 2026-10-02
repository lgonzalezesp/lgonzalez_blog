import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const posts = [
	{ lang: 'es', url: '/blog/usando-mdx/', title: 'Usando MDX' },
	{ lang: 'en', url: '/en/blog/using-mdx/', title: 'Using MDX' },
];

const notes = [
	{ lang: 'es', url: '/notas/primera-nota/', title: 'Primera nota', tags: ['ejemplo', 'notas'] },
	{ lang: 'en', url: '/en/notes/first-note/', title: 'First note', tags: ['example', 'notes'] },
];

const DRAFT_URL = '/en/blog/markdown-style-guide/';

for (const post of posts) {
	test(`blog post (${post.lang}) is published at its URL`, async ({ page }) => {
		const response = await page.goto(post.url);
		expect(response?.status()).toBe(200);
		await expect(page.locator('article h1')).toHaveText(post.title);
	});
}

for (const note of notes) {
	test(`note (${note.lang}) shows its title, creation date and tags`, async ({ page }) => {
		const response = await page.goto(note.url);
		expect(response?.status()).toBe(200);
		await expect(page.locator('article h1')).toHaveText(note.title);
		await expect(page.locator('article time').first()).toHaveAttribute('datetime', /^2026-10-01/);
		for (const tag of note.tags) {
			await expect(page.getByRole('listitem').filter({ hasText: new RegExp(`^#?${tag}$`) })).toBeVisible();
		}
	});
}

test('a draft is not published in the production build', async ({ page, request }) => {
	const response = await page.goto(DRAFT_URL);
	expect(response?.status()).toBe(404);

	for (const listing of ['/en/blog/', '/blog/', '/blog/pagina/2/']) {
		await page.goto(listing);
		await expect(page.locator(`a[href="${DRAFT_URL}"]`)).toHaveCount(0);
		await expect(page.getByText('Markdown Style Guide')).toHaveCount(0);
	}

	const rss = await (await request.get('/rss.xml')).text();
	expect(rss).not.toContain('markdown-style-guide');
});

test('the blog listing links to published posts', async ({ page }) => {
	// Since 004 the listing is paginated: usando-mdx (2024) is on page 2 of the fixtures.
	await page.goto('/blog/pagina/2/');
	await expect(page.locator('a[href="/blog/usando-mdx/"]').first()).toBeVisible();
});

test('a note has no serious accessibility violations', async ({ page }) => {
	await page.goto(notes[0]!.url);
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();
	const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
	expect(serious).toEqual([]);
});
