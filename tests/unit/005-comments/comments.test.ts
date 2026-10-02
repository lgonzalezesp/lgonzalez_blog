import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Comments from '../../../src/components/Comments.astro';

const container = await AstroContainer.create();

function giscusConfig(html: string) {
	const match = html.match(/data-giscus="([^"]+)"/);
	expect(match, 'data-giscus attribute').not.toBeNull();
	return JSON.parse(match![1]!.replaceAll('&quot;', '"').replaceAll('&#34;', '"'));
}

describe('Comments', () => {
	it.each([
		['es', 'Comentarios', 'Activa JavaScript'],
		['en', 'Comments', 'Enable JavaScript'],
	])('renders a labelled section with a noscript message in %s', async (lang, title, noscript) => {
		const html = await container.renderToString(Comments, { props: { lang } });
		expect(html).toMatch(/<section[^>]+id="comments"/);
		expect(html).toMatch(/aria-labelledby="comments-title"/);
		expect(html).toContain(title);
		expect(html).toMatch(new RegExp(`<noscript>[^<]*${noscript}`));
	});

	it.each(['es', 'en'])(
		'serialises the Giscus configuration for %s (the theme is set by the reader)',
		async (lang) => {
			const html = await container.renderToString(Comments, { props: { lang } });
			const config = giscusConfig(html);
			expect(config).toMatchObject({
				'data-repo': 'lgonzalezesp/lgonzalez_blog',
				'data-category': 'Comments',
				'data-mapping': 'pathname',
				'data-strict': '1',
				'data-lang': lang,
			});
			expect(config).not.toHaveProperty('data-theme');
		},
	);
});
