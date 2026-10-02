import { type CollectionEntry, type CollectionKey, getCollection } from 'astro:content';
import {
	assertLangMatchesFolder,
	type ContentEntry,
	filterPublished,
	type Lang,
	slugFromId,
	findTranslation,
	sortByDateDesc,
} from './content';
import { groupByTag } from './tags';

/**
 * Entries of a collection that can be published in this build, most recent first.
 * Pages, feeds and listings must use this instead of `getCollection` so drafts never leak.
 */
export async function getPublished<C extends CollectionKey>(
	collection: C,
	lang?: Lang,
): Promise<CollectionEntry<C>[]> {
	const entries = (await getCollection(collection)) as unknown as (CollectionEntry<C> & ContentEntry)[];
	entries.forEach(assertLangMatchesFolder);
	const published = filterPublished(entries, {
		prod: import.meta.env.PROD,
		vercelEnv: process.env.VERCEL_ENV,
	});
	return sortByDateDesc(lang ? published.filter((entry) => entry.data.lang === lang) : published);
}

/**
 * `getStaticPaths` for the detail pages of a collection in one language: `/…/<slug>/`.
 * Each page also gets its published translation (if any) for hreflang and the language picker.
 */
export async function entryPaths<C extends CollectionKey>(collection: C, lang: Lang) {
	const all = (await getPublished(collection)) as (CollectionEntry<C> & ContentEntry)[];
	return all
		.filter((entry) => entry.data.lang === lang)
		.map((entry) => ({
			params: { slug: slugFromId(entry.id) },
			props: { entry, translation: findTranslation(all, entry) },
		}));
}

/** A Markdown page (collection `pages`) in one language, e.g. `getPageEntry('about', 'es')`. */
export async function getPageEntry(translationKey: string, lang: Lang): Promise<CollectionEntry<'pages'>> {
	const pages = await getCollection('pages');
	pages.forEach(assertLangMatchesFolder);
	const page = pages.find(
		(entry) => entry.data.translationKey === translationKey && entry.data.lang === lang,
	);
	if (!page) {
		throw new Error(
			`Falta la página "${translationKey}" en "${lang}": créala en src/content/pages/${lang}/.`,
		);
	}
	return page;
}

/** Published posts, notes and projects of one language, grouped by tag. */
export async function getTagGroups(lang: Lang) {
	const entries = [
		...(await getPublished('blog', lang)),
		...(await getPublished('notes', lang)),
		...(await getPublished('projects', lang)),
	];
	return groupByTag(entries, lang);
}
