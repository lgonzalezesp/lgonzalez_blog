import { describe, expect, it } from 'vitest';
import { blogPageUrl, entryUrl, sectionAlternates, sectionUrl, tagUrl } from '../../../src/i18n/routes';

describe('new sections', () => {
	it.each([
		['projects', '/proyectos/', '/en/projects/'],
		['notes', '/notas/', '/en/notes/'],
		['tags', '/etiquetas/', '/en/tags/'],
	] as const)('%s → %s · %s', (section, es, en) => {
		expect(sectionUrl(section, 'es')).toBe(es);
		expect(sectionUrl(section, 'en')).toBe(en);
		expect(sectionAlternates(section)).toEqual({ es, en });
	});
});

describe('project URLs', () => {
	it('builds detail URLs in both languages', () => {
		expect(entryUrl('projects', { id: 'es/mi-proyecto', data: { lang: 'es' } })).toBe(
			'/proyectos/mi-proyecto/',
		);
		expect(entryUrl('projects', { id: 'en/my-project', data: { lang: 'en' } })).toBe(
			'/en/projects/my-project/',
		);
	});
});

describe('tag URLs', () => {
	it('uses the normalised tag slug', () => {
		expect(tagUrl('Diseño Web', 'es')).toBe('/etiquetas/diseno-web/');
		expect(tagUrl('astro', 'en')).toBe('/en/tags/astro/');
	});
});

describe('blog pagination URLs', () => {
	it.each([
		[1, 'es', '/blog/'],
		[2, 'es', '/blog/pagina/2/'],
		[1, 'en', '/en/blog/'],
		[3, 'en', '/en/blog/page/3/'],
	] as const)('page %i in %s → %s', (page, lang, url) => {
		expect(blogPageUrl(page, lang)).toBe(url);
	});
});
