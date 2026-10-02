// Creates the Markdown file(s) of a new post or note, with a valid draft frontmatter.
// Usage: npm run new-post -- "<title>" [--lang es|en|both] [--title-en "<title>"]
//                            [--type post|note] [--tags a,b] [--dir <content dir>]
// It only creates files: branches, commits and pull requests follow the Git flow of AGENTS.md.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const LANGS = ['es', 'en'];
const LANG_OPTIONS = [...LANGS, 'both'];
const TYPES = ['post', 'note'];
const FOLDER = { post: 'blog', note: 'notes' };
// Detail-page base paths, as in src/i18n/routes.ts (a unit test keeps them in sync).
const URL_BASE = {
	post: { es: '/blog/', en: '/en/blog/' },
	note: { es: '/notas/', en: '/en/notes/' },
};
const DESCRIPTION = {
	es: 'Escribe aquí una descripción breve del post.',
	en: 'Write a short description here.',
};
const BODY = {
	post: {
		es: 'Escribe aquí el texto en **Markdown**.\n\n## Un apartado\n\nLos títulos `##` y `###` aparecen en la tabla de contenidos.\n',
		en: 'Write the text here in **Markdown**.\n\n## A section\n\nThe `##` and `###` headings appear in the table of contents.\n',
	},
	note: { es: 'Escribe aquí la nota.\n', en: 'Write the note here.\n' },
};
const USAGE =
	'Uso: npm run new-post -- "Título" [--lang es|en|both] [--title-en "Title"] [--type post|note] [--tags a,b]';

/** A mistake of the author (bad option, existing file…), shown without a stack trace. */
export class NewPostError extends Error {}

/** `¿Qué es GCP?` → `que-es-gcp`: lowercase, no accents or symbols, words joined with hyphens. */
export function slugify(title) {
	const slug = String(title ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	if (!slug) throw new NewPostError('El título no es válido: necesita al menos una letra o un número.');
	return slug;
}

const quote = (text) => `'${text.replaceAll("'", "''")}'`;

/** Today's date in the author's time zone, as YYYY-MM-DD. */
function today(now) {
	const pad = (n) => String(n).padStart(2, '0');
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function frontmatter({ type, title, lang, tags, translationKey, now }) {
	return [
		'---',
		`title: ${quote(title)}`,
		...(type === 'post' ? [`description: ${quote(DESCRIPTION[lang])}`] : []),
		`pubDate: ${today(now)}`,
		`tags: [${tags.map(quote).join(', ')}]`,
		`lang: ${lang}`,
		`translationKey: ${translationKey}`,
		'draft: true',
		'---',
	].join('\n');
}

/**
 * Validates the options and returns the files to create, without touching the disk.
 * @param {{ title: string, lang?: string, titleEn?: string, type?: string, tags?: string[], dir?: string }} options
 * @param {Date} [now]
 * @returns {{ path: string, url: string, lang: string, content: string }[]}
 */
export function buildPlan(options, now = new Date()) {
	const { lang = 'es', type = 'post', dir = process.env.CONTENT_DIR ?? './src/content' } = options;
	if (!LANG_OPTIONS.includes(lang))
		throw new NewPostError(`--lang debe ser es, en o both (recibido: «${lang}»).`);
	if (!TYPES.includes(type)) throw new NewPostError(`--type debe ser post o note (recibido: «${type}»).`);
	const title = (options.title ?? '').trim();
	if (!title) throw new NewPostError('El título no puede estar vacío.');
	const titleEn = (options.titleEn ?? '').trim();
	if (lang === 'both' && !titleEn) {
		throw new NewPostError('Con --lang both hace falta --title-en "<título en inglés>".');
	}
	const tags = (options.tags ?? []).map((tag) => tag.trim()).filter(Boolean);
	if (type === 'note' && tags.length === 0) {
		throw new NewPostError('Las notas necesitan al menos una etiqueta: --tags a,b.');
	}

	// Both versions share the key, taken from the title given first (Spanish in `both`).
	const translationKey = slugify(title);
	const titles = lang === 'both' ? { es: title, en: titleEn } : { [lang]: title };
	return Object.entries(titles).map(([l, text]) => {
		const slug = slugify(text);
		return {
			path: join(dir, FOLDER[type], l, `${slug}.md`),
			url: `${URL_BASE[type][l]}${slug}/`,
			lang: l,
			content: `${frontmatter({ type, title: text, lang: l, tags, translationKey, now })}\n\n${BODY[type][l]}`,
		};
	});
}

/** Writes the planned files. Never overwrites: if any exists, nothing is created. */
export function createPosts(options, now = new Date()) {
	const plan = buildPlan(options, now);
	for (const { path } of plan) {
		if (existsSync(path)) {
			throw new NewPostError(`Ya existe ${path}; no se sobrescribe. Elige otro título o edita ese archivo.`);
		}
	}
	for (const { path, content } of plan) {
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, content, { flag: 'wx' });
	}
	return plan;
}

/** Turns the command-line arguments into `createPosts` options. */
export function parseCli(argv) {
	let parsed;
	try {
		parsed = parseArgs({
			args: argv,
			allowPositionals: true,
			options: {
				lang: { type: 'string' },
				'title-en': { type: 'string' },
				type: { type: 'string' },
				tags: { type: 'string' },
				dir: { type: 'string' },
			},
		});
	} catch (error) {
		throw new NewPostError(`${error.message}\n${USAGE}`);
	}
	const { values, positionals } = parsed;
	const title = positionals.join(' ').trim();
	if (!title) throw new NewPostError(`Falta el título.\n${USAGE}`);
	return {
		title,
		lang: values.lang ?? 'es',
		titleEn: values['title-en'],
		type: values.type ?? 'post',
		tags: (values.tags ?? '')
			.split(',')
			.map((tag) => tag.trim())
			.filter(Boolean),
		dir: values.dir ?? process.env.CONTENT_DIR ?? './src/content',
	};
}

export function main(argv) {
	try {
		const created = createPosts(parseCli(argv));
		console.log('Creado (en borrador):');
		for (const { path, url } of created) console.log(`  ${path}\n    → http://localhost:4321${url}`);
		console.log(
			'\nSiguientes pasos: escribe el texto, mira el resultado con `npm run dev` y, cuando esté listo, quita `draft: true` y ejecuta `npm run check`.',
		);
	} catch (error) {
		if (!(error instanceof NewPostError)) throw error;
		console.error(`Error: ${error.message}`);
		process.exitCode = 1;
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main(process.argv.slice(2));
}
