import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublished } from '../lib/collections';
import { slugFromId } from '../lib/content';

// Spanish posts only: feeds per language arrive with 006-seo-analytics.
export async function GET(context) {
	const posts = await getPublished('blog', 'es');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${slugFromId(post.id)}/`,
		})),
	});
}
