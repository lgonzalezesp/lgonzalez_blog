import type { APIContext } from 'astro';
import { feedResponse } from '../../lib/feed-response';

// English feed (posts and notes). Spanish: /rss.xml.
export function GET(context: APIContext) {
	return feedResponse('en', context.site!);
}
