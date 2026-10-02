import { describe, expect, it } from 'vitest';
import { useTranslations } from '../../../src/i18n/utils';

describe('useTranslations with parameters', () => {
	it('replaces {placeholders} in each language', () => {
		expect(useTranslations('es')('post.readingTime', { minutes: 5 })).toBe('5 min de lectura');
		expect(useTranslations('en')('post.readingTime', { minutes: 5 })).toBe('5 min read');
	});

	it('fails loudly when a placeholder has no value', () => {
		expect(() => useTranslations('es')('post.readingTime')).toThrow(/minutes/);
	});
});
