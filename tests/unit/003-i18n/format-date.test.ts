import { describe, expect, it } from 'vitest';
import { formatDate } from '../../../src/i18n/utils';

describe('formatDate', () => {
	const date = new Date('2026-10-01T00:00:00.000Z');

	it('formats dates in Spanish', () => {
		expect(formatDate(date, 'es')).toBe('1 de octubre de 2026');
	});

	it('formats dates in English', () => {
		expect(formatDate(date, 'en')).toBe('October 1, 2026');
	});

	it('does not move the day depending on the build time zone', () => {
		const lateNight = new Date('2026-10-01T23:30:00.000Z');
		expect(formatDate(lateNight, 'es')).toBe('1 de octubre de 2026');
		expect(formatDate(lateNight, 'en')).toBe('October 1, 2026');
	});
});
