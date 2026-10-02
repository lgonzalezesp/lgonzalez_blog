import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { buildIco, renderAll } from '../../../scripts/generate-favicons.mjs';

const PNG_SIGNATURE = '89504e470d0a1a0a';

async function isDrawn(png: Buffer) {
	const { channels } = await sharp(png).metadata();
	const { data } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
	const first = [...data.subarray(0, channels)].join();
	// More than one distinct pixel: not a flat image.
	for (let i = 0; i < data.length; i += channels) {
		if ([...data.subarray(i, i + channels)].join() !== first) return true;
	}
	return false;
}

describe('buildIco', () => {
	it('builds an ICO container with one directory entry per PNG', async () => {
		const small = await sharp({ create: { width: 16, height: 16, channels: 4, background: '#f00' } })
			.png()
			.toBuffer();
		const big = await sharp({ create: { width: 32, height: 32, channels: 4, background: '#00f' } })
			.png()
			.toBuffer();
		const ico = buildIco([
			{ size: 16, png: small },
			{ size: 32, png: big },
		]);
		expect(ico.readUInt16LE(0)).toBe(0); // reserved
		expect(ico.readUInt16LE(2)).toBe(1); // type: icon
		expect(ico.readUInt16LE(4)).toBe(2); // images
		const entry = (i: number) => {
			const at = 6 + i * 16;
			return {
				w: ico[at],
				h: ico[at + 1],
				size: ico.readUInt32LE(at + 8),
				offset: ico.readUInt32LE(at + 12),
			};
		};
		expect(entry(0)).toMatchObject({ w: 16, h: 16, size: small.length, offset: 6 + 2 * 16 });
		expect(entry(1)).toMatchObject({ w: 32, h: 32, size: big.length, offset: 6 + 2 * 16 + small.length });
		expect(ico.subarray(entry(1).offset).equals(big)).toBe(true);
		expect(ico.length).toBe(6 + 2 * 16 + small.length + big.length);
	});
});

describe('generated favicons', () => {
	it('are the expected files and sizes', async () => {
		const files = await renderAll();
		expect(Object.keys(files).sort()).toEqual([
			'apple-touch-icon.png',
			'favicon.ico',
			'favicon.svg',
			'icon-192.png',
			'icon-512.png',
		]);
		for (const [name, size] of [
			['apple-touch-icon.png', 180],
			['icon-192.png', 192],
			['icon-512.png', 512],
		] as const) {
			const meta = await sharp(files[name]).metadata();
			expect({ name, w: meta.width, h: meta.height, format: meta.format }).toEqual({
				name,
				w: size,
				h: size,
				format: 'png',
			});
			expect(await isDrawn(files[name])).toBe(true);
		}
	});

	it('apple-touch-icon has no transparency', async () => {
		const { apple } = { apple: (await renderAll())['apple-touch-icon.png'] };
		const { data, info } = await sharp(apple).raw().toBuffer({ resolveWithObject: true });
		for (let i = info.channels - 1; i < data.length; i += info.channels) {
			if (info.channels === 4) expect(data[i]).toBe(255);
		}
	});

	it('favicon.ico holds 16 and 32 px PNGs that decode and are not blank', async () => {
		const ico = (await renderAll())['favicon.ico'];
		expect(ico.readUInt16LE(2)).toBe(1);
		const count = ico.readUInt16LE(4);
		const sizes: number[] = [];
		for (let i = 0; i < count; i++) {
			const at = 6 + i * 16;
			const size = ico[at];
			const png = ico.subarray(
				ico.readUInt32LE(at + 12),
				ico.readUInt32LE(at + 12) + ico.readUInt32LE(at + 8),
			);
			expect(png.subarray(0, 8).toString('hex')).toBe(PNG_SIGNATURE);
			const meta = await sharp(png).metadata();
			expect({ w: meta.width, h: meta.height }).toEqual({ w: size, h: size });
			expect(await isDrawn(png)).toBe(true);
			sizes.push(size);
		}
		expect(sizes).toEqual([16, 32]);
	});

	it('favicon.svg is the source SVG, with dark mode', async () => {
		const svg = (await renderAll())['favicon.svg'].toString();
		expect(svg).toBe(readFileSync('src/assets/favicon-source.svg', 'utf8'));
		expect(svg).toMatch(/prefers-color-scheme:\s*dark/);
	});
});

describe('versioned files in public/', () => {
	it('match what the script generates from the sources (run `npm run icons` if this fails)', async () => {
		const files = await renderAll();
		for (const [name, content] of Object.entries(files)) {
			const onDisk = readFileSync(`public/${name}`);
			expect(onDisk.equals(content), `${name} is out of date`).toBe(true);
		}
	});
});
