import type { APIRoute, GetStaticPaths } from 'astro';
import type { UiKey } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { getPublished } from '../../lib/collections';
import { renderOgImage } from '../../lib/og-image';
import type { OgCollection } from '../../lib/og-path';

// One 1200×627 PNG per published post, project or note without cover (spec 007).
const SECTIONS: Record<OgCollection, UiKey> = {
	blog: 'og.section.blog',
	projects: 'og.section.project',
	notes: 'og.section.note',
};

export const getStaticPaths = (async () => {
	const paths = [];
	for (const collection of Object.keys(SECTIONS) as OgCollection[]) {
		for (const entry of await getPublished(collection)) {
			if (entry.data.cover) continue;
			const t = useTranslations(entry.data.lang);
			paths.push({
				params: { path: `${collection}/${entry.id}` },
				props: { title: entry.data.title, section: t(SECTIONS[collection]) },
			});
		}
	}
	return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
	const png = await renderOgImage({ title: props.title, section: props.section });
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
