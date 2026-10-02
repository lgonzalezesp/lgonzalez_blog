import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { blogSchema, noteSchema, projectSchema } from '../../../src/content/schemas';

// Stub of Astro's image() helper: in tests an image is just its path.
const context = { image: () => z.string() } as unknown as SchemaContext;

const blog = blogSchema(context);
const projects = projectSchema(context);
const notes = noteSchema(context);

const validPost = {
	title: 'Hola mundo',
	description: 'Primer artículo',
	pubDate: '2026-10-01',
	tags: ['astro'],
	lang: 'es',
	translationKey: 'hello-world',
	cover: { src: '../../../assets/cover.jpg', alt: 'Portada' },
};

const validProject = {
	...validPost,
	stack: ['Astro', 'TypeScript'],
	status: 'active',
	repoUrl: 'https://github.com/lgonzalezesp/lgonzalez_blog',
	demoUrl: 'https://lgonzalez.dev',
};

const validNote = {
	title: 'Una idea',
	pubDate: '2026-10-01',
	tags: ['ideas'],
	lang: 'en',
	translationKey: 'an-idea',
};

function without<T extends object>(obj: T, key: keyof T) {
	const copy = { ...obj };
	delete copy[key];
	return copy;
}

function issuePaths(result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) {
	return (result.error?.issues ?? []).map((issue) => issue.path.join('.'));
}

describe('blog schema', () => {
	it('accepts a valid post and applies defaults', () => {
		const data = blog.parse(validPost);
		expect(data.pubDate).toBeInstanceOf(Date);
		expect(data.draft).toBe(false);
	});

	it('defaults tags to an empty list', () => {
		expect(blog.parse(without(validPost, 'tags')).tags).toEqual([]);
	});

	it.each(['title', 'description', 'pubDate', 'lang', 'translationKey'] as const)(
		'rejects a post without %s',
		(field) => {
			const result = blog.safeParse(without(validPost, field));
			expect(result.success).toBe(false);
			expect(issuePaths(result)).toContain(field);
		},
	);

	it('rejects an invalid date', () => {
		const result = blog.safeParse({ ...validPost, pubDate: 'no es una fecha' });
		expect(issuePaths(result)).toContain('pubDate');
	});

	it('rejects a language other than es or en', () => {
		const result = blog.safeParse({ ...validPost, lang: 'fr' });
		expect(issuePaths(result)).toContain('lang');
	});

	it('rejects a cover without alt text', () => {
		const result = blog.safeParse({ ...validPost, cover: { src: 'cover.jpg' } });
		expect(issuePaths(result)).toContain('cover.alt');
	});

	it('rejects a cover with empty alt text', () => {
		const result = blog.safeParse({ ...validPost, cover: { src: 'cover.jpg', alt: '' } });
		expect(issuePaths(result)).toContain('cover.alt');
	});
});

describe('projects schema', () => {
	it('accepts a valid project and applies defaults', () => {
		const data = projects.parse(validProject);
		expect(data.featured).toBe(false);
		expect(data.stack).toEqual(['Astro', 'TypeScript']);
	});

	it('accepts a project without repo or demo URL', () => {
		expect(projects.safeParse(without(without(validProject, 'repoUrl'), 'demoUrl')).success).toBe(true);
	});

	it.each(['active', 'completed', 'archived'])('accepts status %s', (status) => {
		expect(projects.safeParse({ ...validProject, status }).success).toBe(true);
	});

	it('rejects an unknown status', () => {
		const result = projects.safeParse({ ...validProject, status: 'paused' });
		expect(issuePaths(result)).toContain('status');
	});

	it('rejects a project without stack', () => {
		expect(issuePaths(projects.safeParse({ ...validProject, stack: [] }))).toContain('stack');
	});

	it('rejects an invalid repo URL', () => {
		expect(issuePaths(projects.safeParse({ ...validProject, repoUrl: 'not a url' }))).toContain('repoUrl');
	});

	it('rejects a project without common fields', () => {
		expect(issuePaths(projects.safeParse(without(validProject, 'description')))).toContain('description');
	});
});

describe('notes schema', () => {
	it('accepts a note without description or cover', () => {
		const data = notes.parse(validNote);
		expect(data.description).toBeUndefined();
		expect(data.cover).toBeUndefined();
	});

	it.each(['title', 'pubDate', 'tags'] as const)('rejects a note without %s', (field) => {
		const result = notes.safeParse(without(validNote, field));
		expect(result.success).toBe(false);
		expect(issuePaths(result)).toContain(field);
	});

	it('rejects a note with an empty tag list, with a clear message', () => {
		const result = notes.safeParse({ ...validNote, tags: [] });
		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.message).toMatch(/al menos una etiqueta/);
	});

	it('rejects an empty tag', () => {
		expect(notes.safeParse({ ...validNote, tags: [''] }).success).toBe(false);
	});
});
