import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const SOURCES = ['src/assets/favicon-source.svg', 'src/assets/favicon-small.svg'];
const read = (path: string) => readFileSync(path, 'utf8');

/** Colors declared in the <style> block: `.bg{fill:#…}` and `.fg{stroke:#…}`, for light and dark. */
function palette(svg: string) {
	const style = svg.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
	const [light, dark = ''] = style.split(/@media\s*\(prefers-color-scheme:\s*dark\)/);
	const pick = (css: string, cls: string) =>
		css.match(new RegExp(`\\.${cls}\\s*\\{[^}]*#([0-9a-fA-F]{6})`))?.[1];
	return {
		light: { bg: pick(light, 'bg'), fg: pick(light, 'fg') },
		dark: { bg: pick(dark, 'bg'), fg: pick(dark, 'fg') },
	};
}

function luminance(hex: string) {
	const [r, g, b] = [0, 2, 4].map((i) => {
		const c = parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

describe.each(SOURCES)('%s', (path) => {
	const svg = read(path);

	it('is a well-formed 64×64 SVG', () => {
		expect(svg).toMatch(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
		expect(svg).toMatch(/viewBox="0 0 64 64"/);
		expect(svg.trim()).toMatch(/<\/svg>$/);
	});

	it('is our own design, with no trace of the Astro logo', () => {
		expect(svg).not.toMatch(/astro/i);
		expect(svg).not.toContain('M50.4 78.5');
		expect(svg).toMatch(/id="letters"/);
		expect(svg).not.toMatch(/<text/);
	});

	it('adapts to dark mode and has readable contrast in both schemes', () => {
		expect(svg).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
		const { light, dark } = palette(svg);
		for (const scheme of [light, dark]) {
			expect(scheme.bg).toBeDefined();
			expect(scheme.fg).toBeDefined();
			expect(contrast(scheme.bg!, scheme.fg!)).toBeGreaterThanOrEqual(4.5);
		}
		expect(light.bg).not.toBe(dark.bg);
	});
});

describe('paw', () => {
	it('is in the main icon (a pad and four toes) and not in the small one', () => {
		const main = read('src/assets/favicon-source.svg');
		expect(main).toMatch(/id="paw"/);
		const paw = main.match(/<g id="paw"[\s\S]*?<\/g>/)?.[0] ?? '';
		expect(paw.match(/<circle/g)).toHaveLength(4);
		expect(paw.match(/<ellipse/g)).toHaveLength(1);
		expect(read('src/assets/favicon-small.svg')).not.toMatch(/id="paw"/);
	});
});
