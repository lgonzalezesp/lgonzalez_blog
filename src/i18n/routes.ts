// Every URL of the site, per language, in one place.
import { slugFromId } from '../lib/content';
import { tagSlug } from '../lib/tags';
import type { Lang } from './ui';

const SECTIONS = {
	home: { es: '/', en: '/en/' },
	blog: { es: '/blog/', en: '/en/blog/' },
	projects: { es: '/proyectos/', en: '/en/projects/' },
	notes: { es: '/notas/', en: '/en/notes/' },
	tags: { es: '/etiquetas/', en: '/en/tags/' },
	about: { es: '/sobre-mi/', en: '/en/about/' },
} as const satisfies Record<string, Record<Lang, string>>;

// Base path of the detail pages of each routed collection.
const COLLECTIONS = {
	blog: SECTIONS.blog,
	projects: SECTIONS.projects,
	notes: SECTIONS.notes,
} as const satisfies Record<string, Record<Lang, string>>;

// Translated segment for blog pages 2…n, so it never clashes with a post slug.
const PAGE_SEGMENT: Record<Lang, string> = { es: 'pagina', en: 'page' };

export type Section = keyof typeof SECTIONS;
export type RoutedCollection = keyof typeof COLLECTIONS;
/** URL of the current page in each language it exists in. */
export type Alternates = Partial<Record<Lang, string>>;

interface RoutedEntry {
	id: string;
	data: { lang: Lang };
}

export function otherLang(lang: Lang): Lang {
	return lang === 'es' ? 'en' : 'es';
}

export function sectionUrl(section: Section, lang: Lang): string {
	return SECTIONS[section][lang];
}

export function sectionAlternates(section: Section): Alternates {
	return { ...SECTIONS[section] };
}

export function entryUrl(collection: RoutedCollection, entry: RoutedEntry): string {
	return `${COLLECTIONS[collection][entry.data.lang]}${slugFromId(entry.id)}/`;
}

export function tagUrl(tag: string, lang: Lang): string {
	return `${SECTIONS.tags[lang]}${tagSlug(tag)}/`;
}

/** Page 1 is the blog index itself; the rest live under /blog/pagina/N/ (ES) or /en/blog/page/N/ (EN). */
export function blogPageUrl(page: number, lang: Lang): string {
	return page <= 1 ? SECTIONS.blog[lang] : `${SECTIONS.blog[lang]}${PAGE_SEGMENT[lang]}/${page}/`;
}

export function entryAlternates(
	collection: RoutedCollection,
	entry: RoutedEntry,
	translation?: RoutedEntry,
): Alternates {
	const alternates: Alternates = { [entry.data.lang]: entryUrl(collection, entry) };
	if (translation) alternates[translation.data.lang] = entryUrl(collection, translation);
	return alternates;
}

/** Where the language picker goes: the same page in the other language, or that language's home. */
export function switchUrl(alternates: Alternates, current: Lang): string {
	const target = otherLang(current);
	return alternates[target] ?? sectionUrl('home', target);
}
