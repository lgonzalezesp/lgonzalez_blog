import { describe, expect, it } from 'vitest';
import { buildMeta, type MetaInput } from '../../../src/lib/seo';

const SITE = 'https://lgonzalez.dev';
const defaultImage = {
	src: '/_astro/og-default.abc.png',
	width: 1200,
	height: 627,
	alt: 'Luis González · lgonzalez.dev',
};
const cover = { src: '/_astro/cover.def.jpg', width: 1200, height: 627, alt: 'Portada del artículo' };

const base: MetaInput = {
	site: SITE,
	path: '/blog/usando-mdx/',
	title: 'Usando MDX',
	description: 'Cómo usar MDX',
	lang: 'es',
	alternates: { es: '/blog/usando-mdx/', en: '/en/blog/using-mdx/' },
	defaultImage,
};

const meta = (input: Partial<MetaInput> = {}) => buildMeta({ ...base, ...input });
const tag = (m: ReturnType<typeof buildMeta>, key: string) =>
	m.tags.filter((t) => (t.property ?? t.name) === key).map((t) => t.content);

describe('buildMeta', () => {
	it('sets title, description and an absolute canonical URL', () => {
		const m = meta();
		expect(m.title).toBe('Usando MDX');
		expect(m.description).toBe('Cómo usar MDX');
		expect(m.canonical).toBe('https://lgonzalez.dev/blog/usando-mdx/');
	});

	it('builds the Open Graph tags', () => {
		const m = meta({ image: cover });
		expect(tag(m, 'og:site_name')).toEqual(['Luis González']);
		expect(tag(m, 'og:url')).toEqual([m.canonical]);
		expect(tag(m, 'og:title')).toEqual(['Usando MDX']);
		expect(tag(m, 'og:description')).toEqual(['Cómo usar MDX']);
		expect(tag(m, 'og:type')).toEqual(['website']);
		expect(tag(m, 'og:locale')).toEqual(['es_ES']);
		expect(tag(m, 'og:locale:alternate')).toEqual(['en_US']);
		expect(tag(m, 'og:image')).toEqual(['https://lgonzalez.dev/_astro/cover.def.jpg']);
		expect(tag(m, 'og:image:width')).toEqual(['1200']);
		expect(tag(m, 'og:image:height')).toEqual(['627']);
		expect(tag(m, 'og:image:alt')).toEqual(['Portada del artículo']);
		expect(tag(m, 'og:image:type')).toEqual(['image/jpeg']);
	});

	it('builds the Twitter card tags', () => {
		const m = meta({ image: cover });
		expect(tag(m, 'twitter:card')).toEqual(['summary_large_image']);
		expect(tag(m, 'twitter:title')).toEqual(['Usando MDX']);
		expect(tag(m, 'twitter:description')).toEqual(['Cómo usar MDX']);
		expect(tag(m, 'twitter:image')).toEqual(['https://lgonzalez.dev/_astro/cover.def.jpg']);
		expect(tag(m, 'twitter:image:alt')).toEqual(['Portada del artículo']);
	});

	it('uses the default image when there is no cover', () => {
		const m = meta();
		expect(tag(m, 'og:image')).toEqual(['https://lgonzalez.dev/_astro/og-default.abc.png']);
		expect(tag(m, 'og:image:type')).toEqual(['image/png']);
		expect(tag(m, 'og:image:alt')).toEqual([defaultImage.alt]);
	});

	it('keeps already absolute image URLs', () => {
		const m = meta({ image: { ...cover, src: 'https://cdn.example.com/x.webp' } });
		expect(tag(m, 'og:image')).toEqual(['https://cdn.example.com/x.webp']);
		expect(tag(m, 'og:image:type')).toEqual(['image/webp']);
	});

	it('marks posts as articles with dates and tags', () => {
		const m = meta({
			article: {
				publishedTime: new Date('2026-10-01T00:00:00Z'),
				modifiedTime: new Date('2026-10-05T00:00:00Z'),
				tags: ['astro', 'mdx'],
			},
		});
		expect(tag(m, 'og:type')).toEqual(['article']);
		expect(tag(m, 'article:published_time')).toEqual(['2026-10-01T00:00:00.000Z']);
		expect(tag(m, 'article:modified_time')).toEqual(['2026-10-05T00:00:00.000Z']);
		expect(tag(m, 'article:tag')).toEqual(['astro', 'mdx']);
	});

	it('lists hreflang alternates (absolute, with x-default) only when there is a translation', () => {
		expect(meta().alternateLinks).toEqual([
			{ hreflang: 'es', href: 'https://lgonzalez.dev/blog/usando-mdx/' },
			{ hreflang: 'en', href: 'https://lgonzalez.dev/en/blog/using-mdx/' },
			{ hreflang: 'x-default', href: 'https://lgonzalez.dev/blog/usando-mdx/' },
		]);
		const lonely = meta({ alternates: { es: '/blog/solo/' } });
		expect(lonely.alternateLinks).toEqual([]);
		expect(tag(lonely, 'og:locale:alternate')).toEqual([]);
	});

	it('uses the English locale on English pages', () => {
		const m = meta({ lang: 'en', path: '/en/blog/using-mdx/' });
		expect(tag(m, 'og:locale')).toEqual(['en_US']);
		expect(tag(m, 'og:locale:alternate')).toEqual(['es_ES']);
	});

	it('asks search engines not to index the 404', () => {
		expect(tag(meta({ noindex: true }), 'robots')).toEqual(['noindex']);
		expect(tag(meta(), 'robots')).toEqual([]);
	});

	it('never emits empty content', () => {
		expect(
			meta({ image: cover, article: { publishedTime: new Date(), tags: [] } }).tags.every(
				(t) => t.content.trim() !== '',
			),
		).toBe(true);
	});
});
