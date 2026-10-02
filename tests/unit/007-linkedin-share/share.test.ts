import { describe, expect, it } from 'vitest';
import { linkedInShareUrl } from '../../../src/lib/share';

describe('linkedInShareUrl', () => {
	it('builds the official LinkedIn share URL with the encoded canonical URL', () => {
		expect(linkedInShareUrl('https://lgonzalez.dev/blog/usando-mdx/')).toBe(
			'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flgonzalez.dev%2Fblog%2Fusando-mdx%2F',
		);
	});

	it('encodes accents, spaces and query characters', () => {
		const url = linkedInShareUrl('https://lgonzalez.dev/etiquetas/diseño web/?a=1&b=2#x');
		expect(url).toBe(
			'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flgonzalez.dev%2Fetiquetas%2Fdise%C3%B1o%20web%2F%3Fa%3D1%26b%3D2%23x',
		);
		expect(new URL(url).searchParams.get('url')).toBe(
			'https://lgonzalez.dev/etiquetas/diseño web/?a=1&b=2#x',
		);
	});

	it('only accepts absolute URLs', () => {
		expect(() => linkedInShareUrl('/blog/usando-mdx/')).toThrow();
	});
});
