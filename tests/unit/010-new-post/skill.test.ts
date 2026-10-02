import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const skill = readFileSync('.claude/skills/nuevo-post/SKILL.md', 'utf8');
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';

describe('skill /nuevo-post', () => {
	it('declares its name and a description', () => {
		expect(frontmatter).toMatch(/^name: nuevo-post$/m);
		expect(frontmatter).toMatch(/^description: .{20,}/m);
	});

	it('creates the files with the project script', () => {
		expect(skill).toContain('npm run new-post');
		for (const option of ['--lang', '--title-en', '--type', '--tags']) expect(skill).toContain(option);
	});

	it('follows the Git flow: branch from develop, PR to develop', () => {
		expect(skill).toMatch(/post\/<slug>/);
		expect(skill).toMatch(/develop/);
	});

	it('never publishes on its own and does not invent the author’s content', () => {
		expect(skill).toMatch(/no (hagas|hace|hagas)[^.\n]*(push|merge|release|tag)/i);
		expect(skill).toMatch(/no inventes/i);
		expect(skill).toContain('[COMPLETAR');
	});
});
