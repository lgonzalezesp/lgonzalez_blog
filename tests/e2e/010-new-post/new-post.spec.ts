import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

// Two real builds (draft, then published) into temporary folders: slow, so it runs alone.
test.describe.configure({ mode: 'serial' });
test.setTimeout(300_000);

const ES = { slug: 'prueba-de-creacion', title: 'Prueba de creación', url: '/blog/prueba-de-creacion/' };
const EN = { slug: 'creation-test', title: 'Creation test', url: '/en/blog/creation-test/' };

let root: string;
let content: string;

test.beforeAll(() => {
	root = mkdtempSync(join(tmpdir(), 'new-post-e2e-'));
	content = join(root, 'content');
	cpSync('tests/fixtures/content', content, { recursive: true });
});

test.afterAll(() => {
	rmSync(root, { recursive: true, force: true });
});

const run = (args: string[], env: Record<string, string> = {}) =>
	execFileSync('npm', ['run', ...args], {
		env: { ...process.env, ...env },
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	});

const build = (name: string) => {
	const out = join(root, name);
	run(['build', '--silent'], { CONTENT_DIR: content, OUT_DIR: out });
	return out;
};

const page = (out: string, url: string) => join(out, url, 'index.html');
const read = (path: string) => readFileSync(path, 'utf8');

test('a new post is created as a draft, left out of the build, and linked in both languages once published', () => {
	const output = run([
		'new-post',
		'--silent',
		'--',
		ES.title,
		'--lang',
		'both',
		'--title-en',
		EN.title,
		'--dir',
		content,
	]);
	expect(output).toContain(`${ES.slug}.md`);
	expect(output).toContain(`http://localhost:4321${EN.url}`);

	const esFile = join(content, 'blog/es', `${ES.slug}.md`);
	const enFile = join(content, 'blog/en', `${EN.slug}.md`);
	for (const file of [esFile, enFile]) expect(read(file)).toContain('draft: true');

	// Draft: the build succeeds (so the frontmatter satisfies the schema) and publishes nothing of it.
	const draftOut = build('draft');
	expect(existsSync(page(draftOut, ES.url))).toBe(false);
	expect(existsSync(page(draftOut, EN.url))).toBe(false);
	for (const file of ['rss.xml', 'en/rss.xml', 'blog/index.html', 'en/blog/index.html', 'sitemap-0.xml']) {
		const text = read(join(draftOut, file));
		expect(text, file).not.toContain(ES.slug);
		expect(text, file).not.toContain(EN.slug);
	}

	// Published: both pages exist and each links to its translation through the shared translationKey.
	for (const file of [esFile, enFile]) writeFileSync(file, read(file).replace('draft: true\n', ''));
	const publishedOut = build('published');
	const es = read(page(publishedOut, ES.url));
	const en = read(page(publishedOut, EN.url));
	expect(es).toContain('<html lang="es"');
	expect(en).toContain('<html lang="en"');
	expect(es).toContain(`href="${EN.url}"`);
	expect(en).toContain(`href="${ES.url}"`);
	expect(read(join(publishedOut, 'blog/index.html'))).toContain(ES.url);
	expect(read(join(publishedOut, 'sitemap-0.xml'))).toContain(ES.slug);
});
