import { describe, expect, it } from 'vitest';
import { ui } from '../../../src/i18n/ui';
import { useTranslations } from '../../../src/i18n/utils';

describe('useTranslations', () => {
	it('returns the text in each language', () => {
		expect(useTranslations('es')('nav.home')).toBe(ui.es['nav.home']);
		expect(useTranslations('en')('nav.home')).toBe(ui.en['nav.home']);
		expect(useTranslations('es')('nav.home')).not.toBe(useTranslations('en')('nav.home'));
	});

	it('fails loudly with the key name when the key does not exist', () => {
		const t = useTranslations('en') as (key: string) => string;
		expect(() => t('does.not.exist')).toThrow(/does\.not\.exist/);
	});
});
