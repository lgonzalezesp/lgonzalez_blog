import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import FormattedDate from '../../../src/components/FormattedDate.astro';
import LanguagePicker from '../../../src/components/LanguagePicker.astro';

const container = await AstroContainer.create();

describe('LanguagePicker', () => {
	it('on a Spanish page links to the English translation, labelled in English', async () => {
		const html = await container.renderToString(LanguagePicker, {
			props: { lang: 'es', alternates: { es: '/blog/usando-mdx/', en: '/en/blog/using-mdx/' } },
		});
		expect(html).toMatch(/href="\/en\/blog\/using-mdx\/"/);
		expect(html).toMatch(/hreflang="en"/);
		expect(html).toMatch(/lang="en"/);
		expect(html).toContain('English');
	});

	it('on an English page without translation links to the Spanish home, labelled in Spanish', async () => {
		const html = await container.renderToString(LanguagePicker, {
			props: { lang: 'en', alternates: { en: '/en/blog/only-english/' } },
		});
		expect(html).toMatch(/href="\/"/);
		expect(html).toMatch(/hreflang="es"/);
		expect(html).toMatch(/lang="es"/);
		expect(html).toContain('Español');
	});
});

describe('FormattedDate', () => {
	const date = new Date('2026-10-01T12:00:00.000Z');

	it.each([
		['es', '1 de octubre de 2026'],
		['en', 'October 1, 2026'],
	])('formats the date in %s', async (lang, text) => {
		const html = await container.renderToString(FormattedDate, { props: { date, lang } });
		expect(html).toContain(text);
		expect(html).toContain('datetime="2026-10-01T12:00:00.000Z"');
	});
});
