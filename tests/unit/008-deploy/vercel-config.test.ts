import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));

describe('vercel.json', () => {
	it('builds the static Astro site with npm', () => {
		expect(vercel).toMatchObject({
			framework: 'astro',
			installCommand: 'npm ci',
			buildCommand: 'npm run build',
			outputDirectory: 'dist',
		});
	});

	it('adds the trailing slash, like the canonical URLs', () => {
		expect(vercel.trailingSlash).toBe(true);
	});
});
