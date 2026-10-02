import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Analytics from '../../../src/components/Analytics.astro';

const container = await AstroContainer.create();

describe('Analytics', () => {
	it('loads Vercel Web Analytics and Speed Insights from the same origin when enabled', async () => {
		const html = await container.renderToString(Analytics, { props: { enabled: true } });
		expect(html).toMatch(/<script[^>]+src="\/_vercel\/insights\/script\.js"/);
		expect(html).toMatch(/<script[^>]+src="\/_vercel\/speed-insights\/script\.js"/);
		expect(html).not.toMatch(/src="https?:/);
	});

	it('renders nothing when disabled', async () => {
		const html = await container.renderToString(Analytics, { props: { enabled: false } });
		expect(html).not.toContain('<script');
	});
});
