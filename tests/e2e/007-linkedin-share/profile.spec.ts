import { expect, test } from '@playwright/test';

const LINKEDIN = 'https://www.linkedin.com/in/luis-gonzalez-espejo/';

for (const path of ['/', '/en/', '/blog/usando-mdx/', '/en/notes/']) {
	test(`the footer of ${path} links the author's LinkedIn profile`, async ({ page }) => {
		await page.goto(path);
		const link = page.getByRole('contentinfo').getByRole('link', { name: 'LinkedIn', exact: true });
		await expect(link).toHaveAttribute('href', LINKEDIN);
		await expect(link).toHaveAttribute('rel', /\bme\b/);
	});
}

for (const [path, heading] of [
	['/sobre-mi/', 'Encuéntrame en'],
	['/en/about/', 'Find me on'],
] as const) {
	test(`${path} links the author's LinkedIn and GitHub profiles`, async ({ page }) => {
		await page.goto(path);
		const section = page.getByRole('region', { name: heading });
		await expect(section.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute(
			'href',
			LINKEDIN,
		);
		await expect(section.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute(
			'href',
			'https://github.com/lgonzalezesp',
		);
		await expect(section.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute(
			'rel',
			/\bme\b/,
		);
	});
}
