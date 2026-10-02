import { expect, test } from '@playwright/test';

// Production only: https://lgonzalez.dev, HTTPS and redirects (absolute URLs, not baseURL).
const SITE = 'https://lgonzalez.dev';

test('https://lgonzalez.dev answers with HSTS', async ({ request }) => {
	const response = await request.get(`${SITE}/`);
	expect(response.status()).toBe(200);
	expect(response.headers()['strict-transport-security']).toMatch(/max-age=\d+/);
});

for (const [from, to] of [
	['http://lgonzalez.dev/', `${SITE}/`],
	['https://www.lgonzalez.dev/', `${SITE}/`],
	['http://www.lgonzalez.dev/', null],
	[`${SITE}/blog`, `${SITE}/blog/`],
] as const) {
	test(`${from} redirects${to ? ` to ${to}` : ' to https'}`, async ({ request }) => {
		const response = await request.get(from, { maxRedirects: 0 });
		expect([301, 302, 307, 308]).toContain(response.status());
		const location = new URL(response.headers()['location']!, from).href;
		if (to) expect(location).toBe(to);
		else expect(location).toMatch(/^https:\/\//);
	});
}
