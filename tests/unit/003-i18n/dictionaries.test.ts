import { describe, expect, it } from 'vitest';
import astroConfig from '../../../astro.config.mjs';
import { DEFAULT_LANG, LANGS, ui } from '../../../src/i18n/ui';

describe('UI dictionaries', () => {
	it('have exactly the same keys in ES and EN', () => {
		expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.es).sort());
	});

	it.each(LANGS)('have no empty values in %s', (lang) => {
		const empty = Object.entries(ui[lang]).filter(([, value]) => value.trim() === '');
		expect(empty).toEqual([]);
	});

	it('match the locales configured in Astro, with Spanish as default', () => {
		expect(astroConfig.i18n?.locales).toEqual([...LANGS]);
		expect(astroConfig.i18n?.defaultLocale).toBe(DEFAULT_LANG);
		expect(DEFAULT_LANG).toBe('es');
		expect(astroConfig.i18n?.routing).toMatchObject({ prefixDefaultLocale: false });
	});
});
