import { describe, expect, it } from 'vitest';
import { currentBuildEnv, isDraftVisible } from '../../../src/lib/content';

describe('currentBuildEnv + isDraftVisible', () => {
	it('shows drafts in Vercel previews (pull requests and develop)', () => {
		const env = currentBuildEnv({ VERCEL: '1', VERCEL_ENV: 'preview' }, true);
		expect(env).toEqual({ prod: true, vercelEnv: 'preview' });
		expect(isDraftVisible(env)).toBe(true);
	});

	it('hides drafts in Vercel production', () => {
		expect(isDraftVisible(currentBuildEnv({ VERCEL: '1', VERCEL_ENV: 'production' }, true))).toBe(false);
	});

	it('hides drafts in a local production build (npm run build)', () => {
		expect(isDraftVisible(currentBuildEnv({}, true))).toBe(false);
	});

	it('shows drafts in astro dev', () => {
		expect(isDraftVisible(currentBuildEnv({}, false))).toBe(true);
	});
});
