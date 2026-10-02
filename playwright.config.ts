import { defineConfig, devices } from '@playwright/test';

// Not 4321: that is `astro dev`, and the tests must never hit the dev server.
const PORT = 4322;

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				// No external network in tests: any host other than localhost fails to resolve.
				// Third parties (e.g. giscus.app) are stubbed with page.route.
				launchOptions: { args: ['--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost'] },
			},
		},
	],
	webServer: {
		// Functional tests always run against the production build.
		// `--ignore-lock` keeps `astro preview` in the foreground even when it
		// detects an AI agent (otherwise it auto-backgrounds and exits).
		command: `npm run build && npm run preview -- --port ${PORT} --ignore-lock`,
		// Stable test content (pagination, drafts, translations…), independent of the real posts.
		// ENABLE_VERCEL_ANALYTICS: include the Vercel scripts (their /_vercel/** paths are stubbed in tests).
		env: { CONTENT_DIR: './tests/fixtures/content', ENABLE_VERCEL_ANALYTICS: '1' },
		url: `http://localhost:${PORT}`,
		// Always build and serve fresh, so a stale or dev server is never reused.
		reuseExistingServer: false,
		timeout: 180_000,
	},
});
