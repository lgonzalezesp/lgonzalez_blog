import { expect, type APIRequestContext, test } from '@playwright/test';

const SITE = 'https://lgonzalez.dev';

// All URLs listed in the sitemap index and its sitemaps.
async function sitemapUrls(request: APIRequestContext) {
	const index = await (await request.get('/sitemap-index.xml')).text();
	const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
	const urls: string[] = [];
	for (const sitemap of sitemaps) {
		const xml = await (await request.get(sitemap)).text();
		urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!));
	}
	return urls;
}

test('the sitemap lists pages in both languages, without drafts or the 404', async ({ request }) => {
	const urls = await sitemapUrls(request);
	for (const path of ['/', '/en/', '/blog/usando-mdx/', '/en/blog/using-mdx/', '/proyectos/', '/en/about/']) {
		expect(urls).toContain(`${SITE}${path}`);
	}
	expect(urls.every((url) => url.startsWith(`${SITE}/`))).toBe(true);
	expect(urls.some((url) => url.includes('markdown-style-guide'))).toBe(false);
	expect(urls.some((url) => url.includes('404'))).toBe(false);
});

test('robots.txt allows crawling and points to the sitemap', async ({ request }) => {
	const response = await request.get('/robots.txt');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toMatch(/text\/plain/);
	const robots = await response.text();
	expect(robots).toMatch(/^User-agent: \*$/m);
	expect(robots).toMatch(/^Allow: \/$/m);
	expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
});
