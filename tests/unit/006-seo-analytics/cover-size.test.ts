import { describe, expect, it } from 'vitest';
import { assertCoverSize, MIN_COVER } from '../../../src/lib/content';

// Covers are also the social image (1200×627) and Astro never upscales images.
const entry = (width: number, height: number) => ({
	id: 'es/hola',
	filePath: 'src/content/blog/es/hola.md',
	data: { cover: { src: { width, height }, alt: 'Portada' } },
});

describe('assertCoverSize', () => {
	it('requires at least 1200×627', () => {
		expect(MIN_COVER).toEqual({ width: 1200, height: 627 });
	});

	it.each([
		[1200, 627],
		[1920, 960],
	])('accepts a %i×%i cover', (width, height) => {
		expect(() => assertCoverSize(entry(width, height))).not.toThrow();
	});

	it('accepts content without cover', () => {
		expect(() => assertCoverSize({ id: 'es/x', data: {} })).not.toThrow();
	});

	it.each([
		[960, 480],
		[1200, 600],
		[1000, 1000],
	])('rejects a %i×%i cover naming the file', (width, height) => {
		expect(() => assertCoverSize(entry(width, height))).toThrow(
			/src\/content\/blog\/es\/hola\.md: la portada mide \d+×\d+ px y debe medir al menos 1200×627 px/,
		);
	});
});
