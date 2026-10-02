import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import BaseHead from '../../../src/components/BaseHead.astro';

const container = await AstroContainer.create({ astroConfig: { site: 'https://lgonzalez.dev' } });

describe.each(['es', 'en'] as const)('BaseHead favicon links (%s)', (lang) => {
	const render = () =>
		container.renderToString(BaseHead, {
			props: { title: 'T', description: 'D', lang, alternates: { [lang]: lang === 'es' ? '/' : '/en/' } },
		});

	it('links the icons and the manifest with root-relative paths', async () => {
		const html = await render();
		expect(html).toMatch(/<link rel="icon" href="\/favicon\.ico" sizes="32x32"/);
		expect(html).toMatch(/<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"/);
		expect(html).toMatch(/<link rel="apple-touch-icon" href="\/apple-touch-icon\.png"/);
		expect(html).toMatch(/<link rel="manifest" href="\/manifest\.webmanifest"/);
	});

	it('requests nothing external for the icons', async () => {
		const html = await render();
		const links = [...html.matchAll(/<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/g)].map(
			(m) => m[0],
		);
		expect(links).toHaveLength(4);
		for (const link of links) expect(link).not.toMatch(/href="(?:https?:)?\/\//);
	});
});
