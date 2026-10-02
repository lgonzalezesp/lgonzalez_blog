// Social image (1200×627) for content without a cover (spec 007). satori lays out the title with the
// site's font and turns the text into vector paths, so the result does not depend on the fonts of the
// build machine (CI, Vercel); sharp rasterises it to PNG.
import { readFileSync } from 'node:fs';
import satori from 'satori';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 627;
const MAX_TITLE = 140;

// Same palette as the dark theme and the default image (og-default.svg).
const COLORS = { bg: '#18181b', fg: '#f4f4f5', accent: '#93c5fd', muted: '#a1a1aa' };

const fonts = [
	{ name: 'Atkinson', data: readFileSync('src/assets/fonts/atkinson-regular.woff'), weight: 400 as const },
	{ name: 'Atkinson', data: readFileSync('src/assets/fonts/atkinson-bold.woff'), weight: 700 as const },
];

function fitTitle(title: string) {
	const text = title.length > MAX_TITLE ? `${title.slice(0, MAX_TITLE - 1).trimEnd()}…` : title;
	const fontSize = text.length <= 40 ? 72 : text.length <= 80 ? 60 : 48;
	return { text, fontSize };
}

export interface OgImageInput {
	title: string;
	/** Translated section name ("Blog", "Proyecto", "Note"…), in the language of the content. */
	section: string;
}

export async function renderOgImage({ title, section }: OgImageInput): Promise<Buffer> {
	const { text, fontSize } = fitTitle(title);
	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: WIDTH,
					height: HEIGHT,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					padding: '0 96px',
					background: COLORS.bg,
					borderLeft: `16px solid ${COLORS.accent}`,
					fontFamily: 'Atkinson',
				},
				children: [
					{
						type: 'div',
						props: { style: { color: COLORS.accent, fontSize: 32 }, children: section },
					},
					{
						type: 'div',
						props: {
							style: { color: COLORS.fg, fontSize, fontWeight: 700, lineHeight: 1.2, marginTop: 24 },
							children: text,
						},
					},
					{
						type: 'div',
						props: {
							style: { color: COLORS.muted, fontSize: 28, marginTop: 40 },
							children: 'Luis González · lgonzalez.dev',
						},
					},
				],
			},
		},
		{ width: WIDTH, height: HEIGHT, fonts },
	);
	return sharp(Buffer.from(svg)).png().toBuffer();
}
