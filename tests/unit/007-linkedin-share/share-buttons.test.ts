import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import ShareButtons from '../../../src/components/ShareButtons.astro';

const container = await AstroContainer.create();
const render = (lang: 'es' | 'en', url: string) =>
	container.renderToString(ShareButtons, { props: { lang, url } });

const textOf = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('ShareButtons', () => {
	it.each([
		['es', 'https://lgonzalez.dev/blog/usando-mdx/', 'Compartir en LinkedIn', 'se abre en una pestaña nueva'],
		['en', 'https://lgonzalez.dev/en/blog/using-mdx/', 'Share on LinkedIn', 'opens in a new tab'],
	] as const)(
		'links to LinkedIn in %s with a translated, accessible name',
		async (lang, url, label, newTab) => {
			const html = await render(lang, url);
			const link = html.match(/<a[^>]+linkedin[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
			expect(link).toContain(
				`href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}"`,
			);
			expect(link).toMatch(/target="_blank"/);
			expect(link).toMatch(/rel="noopener noreferrer"/);
			expect(textOf(link)).toContain(label);
			expect(textOf(link)).toContain(newTab);
			expect(link).toMatch(/<svg[^>]+aria-hidden="true"/);
		},
	);

	it.each([
		['es', 'Copiar enlace'],
		['en', 'Copy link'],
	] as const)(
		'has a hidden copy button (until its script runs) and a status region in %s',
		async (lang, label) => {
			const html = await render(lang, 'https://lgonzalez.dev/x/');
			expect(html).toMatch(/<button[^>]+type="button"[^>]*hidden/);
			expect(html).toMatch(/<button[^>]+data-url="https:\/\/lgonzalez.dev\/x\/"/);
			expect(textOf(html)).toContain(label);
			expect(html).toMatch(/role="status"/);
			expect(html).toMatch(/aria-live="polite"/);
		},
	);

	it('loads no third-party script', async () => {
		const html = await render('es', 'https://lgonzalez.dev/x/');
		expect(html).not.toMatch(/<script[^>]+src="https?:/);
		expect(html).not.toMatch(/<iframe/);
	});
});
