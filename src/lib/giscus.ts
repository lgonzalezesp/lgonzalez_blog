import { GISCUS } from '../consts';
import type { Lang } from '../i18n/ui';
import type { Theme } from './giscus-theme';

export { GISCUS_ORIGIN, GISCUS_SCRIPT, giscusThemeMessage, type Theme } from './giscus-theme';

/**
 * `data-*` attributes of the official Giscus script. One thread per URL (`pathname` + `strict`,
 * so /blog/astro/ never matches /blog/astro-2/); translations have different URLs, hence their own threads.
 */
export function giscusAttributes({ lang, theme }: { lang: Lang; theme: Theme }): Record<string, string> {
	return {
		'data-repo': GISCUS.repo,
		'data-repo-id': GISCUS.repoId,
		'data-category': GISCUS.category,
		'data-category-id': GISCUS.categoryId,
		'data-mapping': 'pathname',
		'data-strict': '1',
		'data-reactions-enabled': '1',
		'data-emit-metadata': '0',
		'data-input-position': 'bottom',
		'data-theme': theme,
		'data-lang': lang,
		'data-loading': 'lazy',
	};
}
