import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { renderOgImage } from '../../../src/lib/og-image';

// Standard deviation of the pixels in the title area: a flat background is ~0, text is not.
async function titleAreaVariation(png: Buffer) {
	const { channels } = await sharp(png).extract({ left: 96, top: 200, width: 1000, height: 250 }).stats();
	return Math.max(...channels.slice(0, 3).map((channel) => channel.stdev));
}

describe('renderOgImage', () => {
	it('renders a 1200×627 PNG', async () => {
		const png = await renderOgImage({ title: 'Usando MDX', section: 'Blog' });
		const { width, height, format } = await sharp(png).metadata();
		expect({ width, height, format }).toEqual({ width: 1200, height: 627, format: 'png' });
	});

	it('draws the title (the title area is not a flat colour)', async () => {
		const png = await renderOgImage({ title: 'Usando MDX', section: 'Blog' });
		expect(await titleAreaVariation(png)).toBeGreaterThan(10);
	});

	it('changes with the title and with the (translated) section', async () => {
		const a = await renderOgImage({ title: 'Primera nota', section: 'Nota' });
		const b = await renderOgImage({ title: 'First note', section: 'Note' });
		const c = await renderOgImage({ title: 'First note', section: 'Nota' });
		expect(a.equals(b)).toBe(false);
		expect(b.equals(c)).toBe(false);
	});

	it('is deterministic', async () => {
		const a = await renderOgImage({ title: 'Usando MDX', section: 'Blog' });
		const b = await renderOgImage({ title: 'Usando MDX', section: 'Blog' });
		expect(a.equals(b)).toBe(true);
	});

	it('copes with very long titles and accents', async () => {
		const title = 'Ñandúes, acentos y un título larguísimo '.repeat(8);
		const png = await renderOgImage({ title, section: 'Proyecto' });
		const { width, height } = await sharp(png).metadata();
		expect({ width, height }).toEqual({ width: 1200, height: 627 });
	});
});
