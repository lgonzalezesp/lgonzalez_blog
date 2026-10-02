// RSS items per language (spec 006): published posts and notes, most recent first.
import { entryUrl } from '../i18n/routes';
import type { Lang } from '../i18n/ui';
import { type BuildEnv, filterPublished, sortByDateDesc } from './content';

export interface FeedEntry {
	collection: 'blog' | 'notes';
	id: string;
	data: {
		title: string;
		description?: string;
		pubDate: Date;
		updatedDate?: Date;
		lang: Lang;
		draft: boolean;
		tags: string[];
		translationKey: string;
	};
}

export interface FeedItem {
	title: string;
	description?: string;
	pubDate: Date;
	link: string;
	categories: string[];
}

export function feedItems(entries: FeedEntry[], lang: Lang, env: BuildEnv): FeedItem[] {
	const ofLang = entries.filter((entry) => entry.data.lang === lang);
	return sortByDateDesc(filterPublished(ofLang, env)).map((entry) => ({
		title: entry.data.title,
		description: entry.data.description,
		pubDate: entry.data.pubDate,
		link: entryUrl(entry.collection, entry),
		categories: entry.data.tags,
	}));
}
