import { describe, expect, it } from 'vitest';
import { readingTime } from '../../../src/lib/reading-time';

const words = (n: number) => Array.from({ length: n }, (_, i) => `palabra${i}`).join(' ');

describe('readingTime', () => {
	it('is at least one minute, even for empty text', () => {
		expect(readingTime('')).toBe(1);
		expect(readingTime('   \n  ')).toBe(1);
	});

	it('is one minute for a short text', () => {
		expect(readingTime(words(50))).toBe(1);
	});

	it('uses 200 words per minute, rounding up', () => {
		expect(readingTime(words(1000))).toBe(5);
		expect(readingTime(words(1001))).toBe(6);
	});

	it('does not count Markdown syntax or link URLs as words', () => {
		const markdown = '## Title\n\n**bold** [link](https://example.com/a/very/long/url) ![alt](image.png)';
		expect(readingTime(markdown)).toBe(1);
		expect(readingTime(`${words(199)} [one](https://example.com)`)).toBe(1);
	});

	it('counts code as half', () => {
		const code = '```ts\n' + words(400) + '\n```';
		expect(readingTime(code)).toBe(1);
		expect(readingTime(`${words(200)}\n\n${code}`)).toBe(2);
	});
});
