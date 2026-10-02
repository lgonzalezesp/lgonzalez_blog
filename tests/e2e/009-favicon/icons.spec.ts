import { expect, test } from '@playwright/test';
import { PAGES } from '../004-pages-design/pages';

// Home, a post and the 404, in both languages.
const PATHS = [...PAGES.home, ...PAGES.post, '/no-existe/', '/en/does-not-exist/'];

const ICONS = [
	{ rel: 'icon', href: '/favicon.ico', type: /image\/(x-icon|vnd\.microsoft\.icon)/ },
	{ rel: 'icon', href: '/favicon.svg', type: /image\/svg\+xml/ },
	{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png', type: /image\/png/ },
	{ rel: 'manifest', href: '/manifest.webmanifest', type: /application\/(manifest\+)?json/ },
];

for (const path of PATHS) {
	test(`${path} links the favicon, the Apple icon and the manifest, and they all respond`, async ({
		page,
		request,
	}) => {
		await page.goto(path);
		for (const { rel, href, type } of ICONS) {
			expect(await page.locator(`head link[rel="${rel}"][href="${href}"]`).count(), `${rel} ${href}`).toBe(1);
			const response = await request.get(href);
			expect(response.status(), href).toBe(200);
			expect(response.headers()['content-type'], href).toMatch(type);
		}
	});
}

test('the manifest downloads as JSON and its icons respond', async ({ request }) => {
	const manifest = await (await request.get('/manifest.webmanifest')).json();
	expect(manifest.name).toBe('Luis González');
	for (const icon of manifest.icons) {
		const response = await request.get(icon.src);
		expect(response.status(), icon.src).toBe(200);
		expect(response.headers()['content-type']).toMatch(/image\/png/);
	}
});
