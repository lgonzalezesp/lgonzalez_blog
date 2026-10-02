const LINKEDIN_SHARE = 'https://www.linkedin.com/sharing/share-offsite/';

/**
 * Official LinkedIn share link (no SDK). LinkedIn builds the preview from the page's Open Graph tags,
 * so `url` must be the absolute canonical URL of the page being read.
 */
export function linkedInShareUrl(url: string): string {
	if (!URL.canParse(url)) throw new Error(`linkedInShareUrl necesita una URL absoluta (recibido: "${url}")`);
	return `${LINKEDIN_SHARE}?url=${encodeURIComponent(url)}`;
}
