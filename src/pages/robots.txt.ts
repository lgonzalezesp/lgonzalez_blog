import type { APIContext } from 'astro';

// Everything can be crawled; the sitemap lists the published pages of both languages.
export function GET({ site }: APIContext) {
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${new URL('sitemap-index.xml', site).href}`,
		'',
	].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
