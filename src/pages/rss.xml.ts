import type { APIContext } from 'astro';
import { feedResponse } from '../lib/feed-response';

// Spanish feed (posts and notes). English: /en/rss.xml.
export function GET(context: APIContext) {
	return feedResponse('es', context.site!);
}
