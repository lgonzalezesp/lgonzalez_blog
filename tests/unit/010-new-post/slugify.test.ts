import { describe, expect, it } from 'vitest';
import { NewPostError, slugify } from '../../../scripts/new-post.mjs';

describe('slugify', () => {
	it('lowercases and joins words with hyphens', () => {
		expect(slugify('Mi Primer Post')).toBe('mi-primer-post');
	});

	it('removes accents and turns ñ into n', () => {
		expect(slugify('Cómo aprobé la certificación de diseño')).toBe('como-aprobe-la-certificacion-de-diseno');
		expect(slugify('El niño y la ñoñería')).toBe('el-nino-y-la-noneria');
	});

	it('drops punctuation and symbols', () => {
		expect(slugify('¿Qué es GCP? (Guía #1: lo básico)')).toBe('que-es-gcp-guia-1-lo-basico');
		expect(slugify("It's a test: part 2!")).toBe('it-s-a-test-part-2');
	});

	it('collapses repeated separators and trims the ends', () => {
		expect(slugify('  hola   --   mundo  ')).toBe('hola-mundo');
		expect(slugify('---hola---')).toBe('hola');
	});

	it('keeps digits', () => {
		expect(slugify('Top 10 de 2026')).toBe('top-10-de-2026');
	});

	it('throws a clear error when nothing is left', () => {
		expect(() => slugify('¿¡!?')).toThrow(NewPostError);
		expect(() => slugify('   ')).toThrow(/título/i);
	});
});
