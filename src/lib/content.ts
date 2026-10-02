// Pure helpers over content entries. No `astro:content` imports, so they can be unit tested.

export type Lang = 'es' | 'en';

export interface ContentEntry {
	id: string;
	filePath?: string;
	data: {
		lang: Lang;
		draft: boolean;
		pubDate: Date;
		updatedDate?: Date;
		translationKey: string;
	};
}

export interface BuildEnv {
	prod: boolean;
	vercelEnv?: string;
}

const LANGS: readonly string[] = ['es', 'en'];

/** `es/hola-mundo` → `es`. Content must live in an `es/` or `en/` folder. */
export function langFromId(id: string): Lang {
	const [folder] = id.split('/');
	if (!id.includes('/') || !folder || !LANGS.includes(folder)) {
		throw new Error(`El contenido "${id}" debe estar dentro de una carpeta "es/" o "en/".`);
	}
	return folder as Lang;
}

/** `es/hola-mundo` → `hola-mundo`. */
export function slugFromId(id: string): string {
	langFromId(id);
	return id.slice(id.indexOf('/') + 1);
}

export function assertLangMatchesFolder(entry: ContentEntry): void {
	const folder = langFromId(entry.id);
	if (entry.data.lang !== folder) {
		throw new Error(
			`${entry.filePath ?? entry.id}: «lang» es "${entry.data.lang}" pero el archivo está en la carpeta "${folder}/".`,
		);
	}
}

/** Drafts are visible in `astro dev` and in Vercel previews, never in production builds. */
export function isDraftVisible({ prod, vercelEnv }: BuildEnv): boolean {
	return !prod || vercelEnv === 'preview';
}

export function filterPublished<T extends ContentEntry>(entries: T[], env: BuildEnv): T[] {
	return isDraftVisible(env) ? entries : entries.filter((entry) => !entry.data.draft);
}

/** Most recent first; ties broken by `updatedDate` and then by `id`. Does not mutate the input. */
export function sortByDateDesc<T extends ContentEntry>(entries: T[]): T[] {
	return [...entries].sort(
		(a, b) =>
			b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
			(b.data.updatedDate?.valueOf() ?? 0) - (a.data.updatedDate?.valueOf() ?? 0) ||
			a.id.localeCompare(b.id),
	);
}

/** The same content in the other language, if it exists. */
export function findTranslation<T extends ContentEntry>(entries: T[], entry: T): T | undefined {
	return entries.find(
		(other) => other.data.translationKey === entry.data.translationKey && other.data.lang !== entry.data.lang,
	);
}
