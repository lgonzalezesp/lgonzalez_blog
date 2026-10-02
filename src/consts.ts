import { ui } from './i18n/ui';

export const SITE_TITLE = 'Luis González';
// Default (Spanish) description; per-language text lives in src/i18n/ui.ts.
export const SITE_DESCRIPTION = ui.es['site.description'];

/** Posts per page in the blog listing (spec 004). */
export const BLOG_PAGE_SIZE = 10;

/**
 * Giscus comments (spec 005), backed by GitHub Discussions of the blog repo.
 * The ids are public (they end up in every page's HTML); get them with `gh api graphql`.
 */
export const GISCUS = {
	repo: 'lgonzalezesp/lgonzalez_blog',
	repoId: 'R_kgDOU4DNYA',
	category: 'Comments',
	categoryId: 'DIC_kwDOU4DNYM4DG4mz',
} as const;
