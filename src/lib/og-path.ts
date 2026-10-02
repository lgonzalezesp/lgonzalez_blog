import type { OgImage } from './seo';

export type OgCollection = 'blog' | 'projects' | 'notes';

/** Generated social image of a content entry without cover: /og/<collection>/<id>.png (spec 007). */
export function generatedOgImage(
	collection: OgCollection,
	entry: { id: string; data: { title: string } },
): OgImage {
	return { src: `/og/${collection}/${entry.id}.png`, width: 1200, height: 627, alt: entry.data.title };
}
