import type { Lang } from '../i18n/ui';

interface TaggedEntry {
	id: string;
	data: { lang: Lang; tags: string[]; pubDate: Date };
}

export interface TagGroup<T> {
	slug: string;
	/** First spelling of the tag found in the content. */
	label: string;
	entries: T[];
}

/** URL-safe tag: lowercase, without accents, words joined by hyphens ("Diseño Web" → "diseno-web"). */
export function tagSlug(tag: string): string {
	return tag
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Entries of one language grouped by tag; most used tags first, entries most recent first. */
export function groupByTag<T extends TaggedEntry>(entries: T[], lang: Lang): TagGroup<T>[] {
	const groups = new Map<string, TagGroup<T>>();
	for (const entry of entries.filter((e) => e.data.lang === lang)) {
		for (const tag of entry.data.tags) {
			const slug = tagSlug(tag);
			const group = groups.get(slug) ?? { slug, label: tag, entries: [] };
			if (!group.entries.includes(entry)) group.entries.push(entry);
			groups.set(slug, group);
		}
	}
	for (const group of groups.values()) {
		group.entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	}
	return [...groups.values()].sort(
		(a, b) => b.entries.length - a.entries.length || a.slug.localeCompare(b.slug),
	);
}
