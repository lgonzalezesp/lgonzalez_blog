import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));

describe('manifest.webmanifest', () => {
	it('has the required fields', () => {
		expect(manifest.name).toBe('Luis González');
		expect(manifest.short_name).toBe('lgonzalez.dev');
		expect(manifest.start_url).toBe('/');
		expect(manifest.display).toBe('browser');
		expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
		expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);
	});

	it('lists the 192 and 512 icons, which exist in public/ with the declared size', async () => {
		expect(manifest.icons.map((i: { sizes: string }) => i.sizes).sort()).toEqual(['192x192', '512x512']);
		for (const icon of manifest.icons) {
			expect(icon.type).toBe('image/png');
			expect(icon.src).toMatch(/^\//);
			expect(existsSync(`public${icon.src}`), icon.src).toBe(true);
			const [w, h] = icon.sizes.split('x').map(Number);
			const meta = await sharp(`public${icon.src}`).metadata();
			expect({ w: meta.width, h: meta.height }).toEqual({ w, h });
		}
	});
});
