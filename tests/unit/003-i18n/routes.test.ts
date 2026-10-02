import { describe, expect, it } from 'vitest';
import {
	entryAlternates,
	entryUrl,
	otherLang,
	sectionAlternates,
	sectionUrl,
	switchUrl,
} from '../../../src/i18n/routes';
import { getLangFromUrl } from '../../../src/i18n/utils';

const entry = (id: string) => ({
	id,
	data: { lang: id.startsWith('en/') ? ('en' as const) : ('es' as const) },
});

describe('getLangFromUrl', () => {
	it.each([
		['/', 'es'],
		['/blog/usando-mdx/', 'es'],
		['/en', 'en'],
		['/en/', 'en'],
		['/en/blog/using-mdx/', 'en'],
		['/english/', 'es'],
		['/entradas/', 'es'],
	])('%s → %s', (path, lang) => {
		expect(getLangFromUrl(new URL(path, 'https://lgonzalez.dev'))).toBe(lang);
	});
});

describe('section URLs', () => {
	it.each([
		['home', 'es', '/'],
		['home', 'en', '/en/'],
		['blog', 'es', '/blog/'],
		['blog', 'en', '/en/blog/'],
		['about', 'es', '/sobre-mi/'],
		['about', 'en', '/en/about/'],
	] as const)('%s in %s → %s', (section, lang, url) => {
		expect(sectionUrl(section, lang)).toBe(url);
	});

	it('every section has an alternate in both languages', () => {
		expect(sectionAlternates('about')).toEqual({ es: '/sobre-mi/', en: '/en/about/' });
	});
});

describe('content URLs', () => {
	it.each([
		['blog', 'es/usando-mdx', '/blog/usando-mdx/'],
		['blog', 'en/using-mdx', '/en/blog/using-mdx/'],
		['notes', 'es/primera-nota', '/notas/primera-nota/'],
		['notes', 'en/first-note', '/en/notes/first-note/'],
	] as const)('%s %s → %s', (collection, id, url) => {
		expect(entryUrl(collection, entry(id))).toBe(url);
	});
});

describe('alternates and language switch', () => {
	const es = entry('es/usando-mdx');
	const en = entry('en/using-mdx');

	it('links a translated entry with its translation', () => {
		expect(entryAlternates('blog', es, en)).toEqual({ es: '/blog/usando-mdx/', en: '/en/blog/using-mdx/' });
	});

	it('only lists the entry itself when there is no translation', () => {
		expect(entryAlternates('blog', es)).toEqual({ es: '/blog/usando-mdx/' });
	});

	it('switches to the translation when it exists', () => {
		expect(switchUrl(entryAlternates('blog', es, en), 'es')).toBe('/en/blog/using-mdx/');
		expect(switchUrl(entryAlternates('blog', en, es), 'en')).toBe('/blog/usando-mdx/');
	});

	it('switches to the home of the other language when there is no translation', () => {
		expect(switchUrl(entryAlternates('blog', es), 'es')).toBe('/en/');
		expect(switchUrl(entryAlternates('notes', entry('en/solo')), 'en')).toBe('/');
	});

	it('switches between equivalent sections', () => {
		expect(switchUrl(sectionAlternates('blog'), 'en')).toBe('/blog/');
	});

	it('knows the other language', () => {
		expect(otherLang('es')).toBe('en');
		expect(otherLang('en')).toBe('es');
	});
});
