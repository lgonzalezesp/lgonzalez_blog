import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sectionUrl } from '../i18n/routes';
import type { Lang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import { currentBuildEnv } from './content';
import { type FeedEntry, feedItems } from './feed';

const RSS_LANGUAGES: Record<Lang, string> = { es: 'es-ES', en: 'en-US' };

/** The RSS response of one language, for src/pages/rss.xml.ts and src/pages/en/rss.xml.ts. */
export async function feedResponse(lang: Lang, site: URL) {
	const t = useTranslations(lang);
	const entries = [...(await getCollection('blog')), ...(await getCollection('notes'))] as FeedEntry[];
	return rss({
		title: t('feed.title'),
		description: t('feed.description'),
		site: new URL(sectionUrl('home', lang), site).href,
		items: feedItems(entries, lang, currentBuildEnv()),
		customData: `<language>${RSS_LANGUAGES[lang]}</language>`,
	});
}
