import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import FormattedDate from '../../../src/components/FormattedDate.astro';

describe('Vitest + Astro Container API', () => {
	it('renderiza un componente .astro', async () => {
		const container = await AstroContainer.create();
		const html = await container.renderToString(FormattedDate, {
			props: { date: new Date('2026-10-01T12:00:00Z') },
		});

		expect(html).toContain('<time');
		expect(html).toContain('datetime="2026-10-01T12:00:00.000Z"');
	});
});
