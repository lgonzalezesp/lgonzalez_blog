import { defineConfig, devices } from '@playwright/test';

// Smoke tests against a real deployment (spec 008): a Vercel preview or production.
//   SMOKE_BASE_URL=https://lgonzalez.dev npm run test:smoke
// Previews are protected by Vercel: VERCEL_AUTOMATION_BYPASS_SECRET lets the tests in.
const baseURL = process.env.SMOKE_BASE_URL;
if (!baseURL) {
	throw new Error('Falta SMOKE_BASE_URL (p. ej. SMOKE_BASE_URL=https://lgonzalez.dev npm run test:smoke).');
}
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
	testDir: './tests/smoke',
	retries: 2,
	reporter: process.env.CI ? [['github'], ['list']] : 'list',
	use: {
		baseURL,
		extraHTTPHeaders: bypass ? { 'x-vercel-protection-bypass': bypass } : {},
	},
	projects: [
		// Any deployment: previews (each PR, develop) and production.
		{ name: 'deploy', testMatch: 'deploy.spec.ts', use: { ...devices['Desktop Chrome'] } },
		// Production only: the lgonzalez.dev domain, HTTPS and redirects.
		{ name: 'domain', testMatch: 'domain.spec.ts', use: { ...devices['Desktop Chrome'] } },
	],
});
