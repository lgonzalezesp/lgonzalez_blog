// Generates the favicon files in public/ from the SVG sources in src/assets/.
// Run with `npm run icons` after changing a source; the generated files are versioned.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const MAIN = 'src/assets/favicon-source.svg';
const SMALL = 'src/assets/favicon-small.svg';
const ICO_SIZES = [16, 32];

/** Renders an SVG (light scheme) to a PNG of `size`×`size` px. */
const toPng = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();

/**
 * Builds an ICO container from PNG images (supported since Windows Vista and by every browser):
 * a 6-byte header, a 16-byte directory entry per image, then the PNGs as they are.
 * @param {{ size: number, png: Buffer }[]} images
 * @returns {Buffer}
 */
export function buildIco(images) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(images.length, 4);
	let offset = header.length + images.length * 16;
	const entries = images.map(({ size, png }) => {
		const entry = Buffer.alloc(16);
		entry[0] = size >= 256 ? 0 : size;
		entry[1] = size >= 256 ? 0 : size;
		entry.writeUInt16LE(1, 4); // color planes
		entry.writeUInt16LE(32, 6); // bits per pixel
		entry.writeUInt32LE(png.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += png.length;
		return entry;
	});
	return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

/**
 * Every generated file, by name. Apple and Android icons fill the whole square
 * (the platform applies its own rounding), so they have no transparent corners.
 * @returns {Promise<Record<string, Buffer>>}
 */
export async function renderAll() {
	const main = await readFile(MAIN, 'utf8');
	const small = await readFile(SMALL, 'utf8');
	const square = main.replace('rx="14"', 'rx="0"');
	const ico = await Promise.all(ICO_SIZES.map(async (size) => ({ size, png: await toPng(small, size) })));
	return {
		'favicon.svg': Buffer.from(main),
		'favicon.ico': buildIco(ico),
		'apple-touch-icon.png': await toPng(square, 180),
		'icon-192.png': await toPng(square, 192),
		'icon-512.png': await toPng(square, 512),
	};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	for (const [name, content] of Object.entries(await renderAll())) {
		await writeFile(`public/${name}`, content);
		console.log(`public/${name}`);
	}
}
