// Pure helpers over content entries. No `astro:content` imports, so they can be unit tested.
import type { Lang } from '../i18n/ui';

export type { Lang };

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

export function assertLangMatchesFolder(
	entry: Pick<ContentEntry, 'id' | 'filePath'> & { data: { lang: Lang } },
): void {
	const folder = langFromId(entry.id);
	if (entry.data.lang !== folder) {
		throw new Error(
			`${entry.filePath ?? entry.id}: «lang» es "${entry.data.lang}" pero el archivo está en la carpeta "${folder}/".`,
		);
	}
}

/** Build environment as seen by draft filtering. On Vercel, VERCEL_ENV is `preview` or `production`. */
export function currentBuildEnv(
	env: Record<string, string | undefined> = process.env,
	prod: boolean = import.meta.env.PROD,
): BuildEnv {
	return { prod, vercelEnv: env.VERCEL_ENV };
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

/** Covers are also the social image, cropped to 1200×627 (spec 006); Astro never upscales. */
export const MIN_COVER = { width: 1200, height: 627 } as const;

interface MaybeCovered {
	id: string;
	filePath?: string;
	data: { cover?: { src: { width: number; height: number } } };
}

export function assertCoverSize(entry: MaybeCovered): void {
	const size = entry.data.cover?.src;
	if (size && (size.width < MIN_COVER.width || size.height < MIN_COVER.height)) {
		throw new Error(
			`${entry.filePath ?? entry.id}: la portada mide ${size.width}×${size.height} px y debe medir al menos ${MIN_COVER.width}×${MIN_COVER.height} px.`,
		);
	}
}
