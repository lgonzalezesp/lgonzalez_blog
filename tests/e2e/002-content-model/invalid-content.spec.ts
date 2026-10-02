import { spawnSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

// A mini Astro project that uses the real schemas and contains a note without tags.
const FIXTURE = 'tests/fixtures/invalid-content';

test('invalid frontmatter fails with a message naming the file and the field', () => {
	test.setTimeout(60_000);
	const result = spawnSync('npx', ['astro', 'sync', '--root', FIXTURE], {
		encoding: 'utf8',
		env: { ...process.env, FORCE_COLOR: '0' },
	});
	const output = `${result.stdout}\n${result.stderr}`;

	expect(result.status, output).not.toBe(0);
	expect(output).toContain('nota-sin-etiquetas');
	expect(output).toContain('tags');
	expect(output).toMatch(/al menos una etiqueta/);
});
