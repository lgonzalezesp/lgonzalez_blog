import type { Page } from '@playwright/test';

// Fake https://giscus.app: client.js records its configuration and inserts an iframe served from
// the real Giscus origin (also stubbed), which reports back every message it receives.
const CLIENT = `
	const script = document.currentScript;
	window.__giscusConfig = Object.fromEntries(
		[...script.attributes].filter((a) => a.name.startsWith('data-')).map((a) => [a.name, a.value]),
	);
	const frame = document.createElement('iframe');
	frame.className = 'giscus-frame';
	frame.title = 'Comments';
	frame.src = 'https://giscus.app/widget?origin=' + encodeURIComponent(location.href);
	(document.querySelector('.giscus') || script.parentElement).append(frame);
`;

const FRAME = `<!doctype html><title>Giscus</title><script>
	addEventListener('message', (event) => parent.postMessage({ giscusStub: event.data }, '*'));
</script>`;

export async function stubGiscus(page: Page) {
	const requests: string[] = [];
	await page.addInitScript(() => {
		const w = window as unknown as { __giscusMessages: unknown[] };
		w.__giscusMessages = [];
		addEventListener('message', (event) => {
			if (event.data?.giscusStub) w.__giscusMessages.push(event.data.giscusStub);
		});
	});
	await page.route('https://giscus.app/**', (route) => {
		const url = route.request().url();
		requests.push(url);
		return url.endsWith('/client.js')
			? route.fulfill({ contentType: 'application/javascript', body: CLIENT })
			: route.fulfill({ contentType: 'text/html', body: FRAME });
	});
	return requests;
}

export const giscusConfig = (page: Page) =>
	page
		.waitForFunction(() => (window as unknown as { __giscusConfig?: Record<string, string> }).__giscusConfig)
		.then((h) => h.jsonValue());

export const giscusMessages = (page: Page) =>
	page.evaluate(() => (window as unknown as { __giscusMessages: unknown[] }).__giscusMessages);
