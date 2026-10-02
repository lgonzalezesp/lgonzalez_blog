import { describe, expect, it } from 'vitest';
import { GISCUS } from '../../../src/consts';
import { GISCUS_ORIGIN, giscusAttributes, giscusThemeMessage } from '../../../src/lib/giscus';

describe('GISCUS config', () => {
	it('points to the blog repository and its "Comments" category', () => {
		expect(GISCUS.repo).toBe('lgonzalezesp/lgonzalez_blog');
		expect(GISCUS.category).toBe('Comments');
	});

	it('has real repository and category ids', () => {
		expect(GISCUS.repoId).toMatch(/^R_[\w-]+$/);
		expect(GISCUS.categoryId).toMatch(/^DIC_[\w-]+$/);
	});
});

describe('giscusAttributes', () => {
	it('builds the data-* attributes of the Giscus script', () => {
		expect(giscusAttributes({ lang: 'es', theme: 'light' })).toEqual({
			'data-repo': GISCUS.repo,
			'data-repo-id': GISCUS.repoId,
			'data-category': GISCUS.category,
			'data-category-id': GISCUS.categoryId,
			'data-mapping': 'pathname',
			'data-strict': '1',
			'data-reactions-enabled': '1',
			'data-emit-metadata': '0',
			'data-input-position': 'bottom',
			'data-theme': 'light',
			'data-lang': 'es',
			'data-loading': 'lazy',
		});
	});

	it('follows the page language and the site theme', () => {
		expect(giscusAttributes({ lang: 'en', theme: 'dark' })).toMatchObject({
			'data-lang': 'en',
			'data-theme': 'dark',
		});
	});
});

describe('giscusThemeMessage', () => {
	it.each(['light', 'dark'] as const)('tells the Giscus iframe to switch to %s', (theme) => {
		expect(giscusThemeMessage(theme)).toEqual({ giscus: { setConfig: { theme } } });
	});

	it('targets the Giscus origin', () => {
		expect(GISCUS_ORIGIN).toBe('https://giscus.app');
	});
});
