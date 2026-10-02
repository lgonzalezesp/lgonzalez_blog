// Every URL of the site, per language, in one place.
import { slugFromId } from '../lib/content';
import type { Lang } from './ui';

const SECTIONS = {
	home: { es: '/', en: '/en/' },
	blog: { es: '/blog/', en: '/en/blog/' },
	about: { es: '/sobre-mi/', en: '/en/about/' },
} as const satisfies Record<string, Record<Lang, string>>;

// Base path of the detail pages of each routed collection (projects get theirs in 004).
const COLLECTIONS = {
	blog: { es: '/blog/', en: '/en/blog/' },
	notes: { es: '/notas/', en: '/en/notes/' },
} as const satisfies Record<string, Record<Lang, string>>;

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
