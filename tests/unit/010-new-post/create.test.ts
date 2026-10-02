import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildPlan, createPosts, NewPostError, parseCli } from '../../../scripts/new-post.mjs';

const NOW = new Date(2026, 9, 2, 12);
let dir: string;

beforeEach(() => {
	dir = mkdtempSync(join(tmpdir(), 'new-post-'));
});
afterEach(() => {
	rmSync(dir, { recursive: true, force: true });
});

describe('createPosts', () => {
	it('writes the planned files, creating missing folders', () => {
		const created = createPosts(
			{ title: 'Mi primer post', lang: 'both', titleEn: 'My first post', dir },
			NOW,
		);
		expect(created.map((f) => f.path)).toEqual(
			[join(dir, 'blog/es/mi-primer-post.md'), join(dir, 'blog/en/my-first-post.md')].map((p) => p),
		);
		for (const file of created) expect(readFileSync(file.path, 'utf8')).toBe(file.content);
	});

	it('never overwrites: it fails naming the file and creates none of the others', () => {
		const existing = join(dir, 'blog/es/mi-primer-post.md');
		mkdirSync(join(dir, 'blog/es'), { recursive: true });
		writeFileSync(existing, 'mi texto original');
		let error: unknown;
		try {
			createPosts({ title: 'Mi primer post', lang: 'both', titleEn: 'My first post', dir }, NOW);
		} catch (e) {
			error = e;
		}
		expect(error).toBeInstanceOf(NewPostError);
		expect((error as Error).message).toContain(existing);
		expect(readFileSync(existing, 'utf8')).toBe('mi texto original');
		expect(existsSync(join(dir, 'blog/en/my-first-post.md'))).toBe(false);
	});
});

describe('validation', () => {
	const fails = (options: Record<string, unknown>, message: RegExp) => {
		expect(() => createPosts({ dir, ...options } as never, NOW)).toThrow(NewPostError);
		expect(() => createPosts({ dir, ...options } as never, NOW)).toThrow(message);
		expect(existsSync(join(dir, 'blog'))).toBe(false);
		expect(existsSync(join(dir, 'notes'))).toBe(false);
	};

	it('rejects an empty title', () => fails({ title: '   ' }, /título/i));
	it('rejects a title that leaves an empty slug', () => fails({ title: '¿¡!?' }, /título/i));
	it('rejects an invalid language', () => fails({ title: 'Hola', lang: 'fr' }, /--lang/));
	it('rejects an invalid type', () => fails({ title: 'Hola', type: 'project' }, /--type/));
	it('requires --title-en with --lang both', () => fails({ title: 'Hola', lang: 'both' }, /--title-en/));
	it('requires at least one tag for notes', () => fails({ title: 'Idea', type: 'note' }, /etiqueta/i));
});

describe('buildPlan does not touch the disk', () => {
	it('writes nothing', () => {
		buildPlan({ title: 'Hola', dir }, NOW);
		expect(existsSync(join(dir, 'blog'))).toBe(false);
	});
});

describe('parseCli', () => {
	it('reads the title and options', () => {
		expect(
			parseCli([
				'Mi post',
				'--lang',
				'both',
				'--title-en',
				'My post',
				'--tags',
				'gcp, ideas',
				'--type',
				'note',
				'--dir',
				'/x',
			]),
		).toEqual({
			title: 'Mi post',
			lang: 'both',
			titleEn: 'My post',
			tags: ['gcp', 'ideas'],
			type: 'note',
			dir: '/x',
		});
	});

	it('defaults to a Spanish post and the content directory', () => {
		const options = parseCli(['Hola']);
		expect(options).toMatchObject({ title: 'Hola', lang: 'es', type: 'post', tags: [] });
		expect(options.dir).toBe(process.env.CONTENT_DIR ?? './src/content');
	});

	it('requires a title', () => {
		expect(() => parseCli([])).toThrow(/título/i);
	});
});
