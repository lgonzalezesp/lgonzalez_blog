// Page metadata (title, canonical, Open Graph, Twitter Card, hreflang) as data, so it can be
// unit tested; BaseHead.astro only renders it. Every URL it returns is absolute.
import { SITE_TITLE } from '../consts';
import type { Alternates } from '../i18n/routes';
import { DEFAULT_LANG, type Lang, LANGS } from '../i18n/ui';

export interface OgImage {
	/** Relative (/_astro/…) or absolute URL. */
	src: string;
	width: number;
	height: number;
	alt: string;
}

export interface MetaInput {
	site: string | URL;
	path: string;
	title: string;
	description: string;
	lang: Lang;
	alternates: Alternates;
	/** Cover cropped for social networks; `defaultImage` when missing. */
	image?: OgImage;
	defaultImage: OgImage;
	article?: { publishedTime: Date; modifiedTime?: Date; tags: string[] };
	noindex?: boolean;
}

export interface MetaTag {
	property?: string;
	name?: string;
	content: string;
}

const OG_LOCALES: Record<Lang, string> = { es: 'es_ES', en: 'en_US' };
const IMAGE_TYPES: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	avif: 'image/avif',
};

function imageType(src: string): string | undefined {
	const extension = new URL(src, 'https://x').pathname.split('.').pop()?.toLowerCase() ?? '';
	return IMAGE_TYPES[extension];
}

export function buildMeta(input: MetaInput) {
	const { site, path, title, description, lang, alternates, defaultImage, article, noindex } = input;
	const absolute = (url: string) => new URL(url, site).href;
	const canonical = absolute(path);
	const image = input.image ?? defaultImage;
	const imageUrl = absolute(image.src);

	const translations = LANGS.flatMap((code) => {
		const href = alternates[code];
		return href ? [{ hreflang: code as string, href: absolute(href) }] : [];
	});
	const hasTranslation = translations.length > 1;
	const defaultHref = translations.find((alt) => alt.hreflang === DEFAULT_LANG)?.href;
	const alternateLinks = hasTranslation
		? [...translations, ...(defaultHref ? [{ hreflang: 'x-default', href: defaultHref }] : [])]
		: [];

	const tags: MetaTag[] = [
		...(noindex ? [{ name: 'robots', content: 'noindex' }] : []),
		{ property: 'og:site_name', content: SITE_TITLE },
		{ property: 'og:type', content: article ? 'article' : 'website' },
		{ property: 'og:url', content: canonical },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		{ property: 'og:locale', content: OG_LOCALES[lang] },
		...(hasTranslation
			? translations
					.filter((alt) => alt.hreflang !== lang)
					.map((alt) => ({ property: 'og:locale:alternate', content: OG_LOCALES[alt.hreflang as Lang] }))
			: []),
		{ property: 'og:image', content: imageUrl },
		{ property: 'og:image:width', content: String(image.width) },
		{ property: 'og:image:height', content: String(image.height) },
		{ property: 'og:image:alt', content: image.alt },
		...(imageType(imageUrl) ? [{ property: 'og:image:type', content: imageType(imageUrl)! }] : []),
		...(article
			? [
					{ property: 'article:published_time', content: article.publishedTime.toISOString() },
					...(article.modifiedTime
						? [{ property: 'article:modified_time', content: article.modifiedTime.toISOString() }]
						: []),
					...article.tags.map((articleTag) => ({ property: 'article:tag', content: articleTag })),
				]
			: []),
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		{ name: 'twitter:image', content: imageUrl },
		{ name: 'twitter:image:alt', content: image.alt },
	];

	return { title, description, canonical, alternateLinks, tags };
}
