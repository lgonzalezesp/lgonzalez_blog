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
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		// Functional tests always run against the production build.
		// `--ignore-lock` keeps `astro preview` in the foreground even when it
		// detects an AI agent (otherwise it auto-backgrounds and exits).
		command: `npm run build && npm run preview -- --port ${PORT} --ignore-lock`,
		// Stable test content (pagination, drafts, translations…), independent of the real posts.
		env: { CONTENT_DIR: './tests/fixtures/content' },
		url: `http://localhost:${PORT}`,
		// Always build and serve fresh, so a stale or dev server is never reused.
		reuseExistingServer: false,
		timeout: 180_000,
	},
});
