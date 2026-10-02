// Browser-side pieces of the Giscus integration. No imports, so the client script stays tiny.

export type Theme = 'light' | 'dark';

export const GISCUS_ORIGIN = 'https://giscus.app';
export const GISCUS_SCRIPT = `${GISCUS_ORIGIN}/client.js`;

/** Message the Giscus iframe understands to change its theme without reloading. */
export function giscusThemeMessage(theme: Theme) {
	return { giscus: { setConfig: { theme } } };
}
