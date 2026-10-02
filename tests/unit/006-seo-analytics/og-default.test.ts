import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

describe('default Open Graph image', () => {
	it('is a 1200×627 PNG', async () => {
		const { width, height, format } = await sharp('src/assets/og-default.png').metadata();
		expect({ width, height, format }).toEqual({ width: 1200, height: 627, format: 'png' });
	});
});
