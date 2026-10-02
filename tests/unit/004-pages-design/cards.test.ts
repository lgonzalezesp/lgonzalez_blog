import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Pagination from '../../../src/components/Pagination.astro';
import PostCard from '../../../src/components/PostCard.astro';
import ProjectCard from '../../../src/components/ProjectCard.astro';
import ThemeToggle from '../../../src/components/ThemeToggle.astro';

const container = await AstroContainer.create();
const cover = {
	src: { src: '/cover.jpg', width: 1200, height: 600, format: 'jpg' },
	alt: 'Portada de prueba',
};

const post = {
	id: 'es/hola-mundo',
	data: {
		title: 'Hola mundo',
		description: 'Primer artículo',
		pubDate: new Date('2026-10-01T00:00:00Z'),
		tags: ['astro', 'Diseño'],
		lang: 'es',
		cover,
	},
};

const project = {
	id: 'en/my-project',
	data: {
		title: 'My project',
		description: 'A project',
		pubDate: new Date('2026-01-01T00:00:00Z'),
		tags: ['web'],
		lang: 'en',
		stack: ['Astro', 'TypeScript'],
		status: 'active',
		repoUrl: 'https://github.com/example/repo',
		demoUrl: 'https://example.com',
		cover,
	},
};

describe('PostCard', () => {
	it('renders title, link, date, tags and an image with alt', async () => {
		const html = await container.renderToString(PostCard, { props: { post, lang: 'es' } });
		expect(html).toContain('Hola mundo');
		expect(html).toContain('href="/blog/hola-mundo/"');
		expect(html).toContain('1 de octubre de 2026');
		expect(html).toContain('href="/etiquetas/astro/"');
		expect(html).toContain('href="/etiquetas/diseno/"');
		expect(html).toMatch(/<img[^>]+alt="Portada de prueba"/);
	});
});

describe('ProjectCard', () => {
	it('renders title, detail link, status, stack, repo and demo links', async () => {
		const html = await container.renderToString(ProjectCard, { props: { project, lang: 'en' } });
		expect(html).toContain('My project');
		expect(html).toContain('href="/en/projects/my-project/"');
		expect(html).toContain('Active');
		expect(html).toContain('TypeScript');
		expect(html).toContain('href="https://github.com/example/repo"');
		expect(html).toContain('href="https://example.com"');
		expect(html).toMatch(/<img[^>]+alt="Portada de prueba"/);
	});

	it('omits the demo link when there is none', async () => {
		const data = { ...project.data, demoUrl: undefined };
		const html = await container.renderToString(ProjectCard, {
			props: { project: { ...project, data }, lang: 'en' },
		});
		expect(html).not.toContain('https://example.com"');
	});
});

describe('Pagination', () => {
	it('links previous and next pages and marks the current one', async () => {
		const html = await container.renderToString(Pagination, {
			props: { page: { number: 2, total: 3, prev: 1, next: 3 }, lang: 'es' },
		});
		expect(html).toContain('href="/blog/"');
		expect(html).toContain('href="/blog/pagina/3/"');
		expect(html).toContain('Página 2 de 3');
	});

	it('renders nothing when there is a single page', async () => {
		const html = await container.renderToString(Pagination, {
			props: { page: { number: 1, total: 1 }, lang: 'en' },
		});
		expect(html).not.toContain('<nav');
	});
});

describe('ThemeToggle', () => {
	it('is a hidden button with aria-pressed and a translated label', async () => {
		const es = await container.renderToString(ThemeToggle, { props: { lang: 'es' } });
		const en = await container.renderToString(ThemeToggle, { props: { lang: 'en' } });
		expect(es).toMatch(/<button[^>]+aria-pressed="false"/);
		expect(es).toMatch(/<button[^>]+hidden/);
		expect(es).toContain('Modo oscuro');
		expect(en).toContain('Dark mode');
	});
});
