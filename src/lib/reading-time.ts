const WORDS_PER_MINUTE = 200;

function countWords(text: string): number {
	return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

/** Minutes to read a Markdown text: 200 words per minute, code counts half, at least 1 minute. */
export function readingTime(markdown: string): number {
	let codeWords = 0;
	const prose = markdown
		.replace(/```[\s\S]*?```/g, (block) => {
			codeWords += countWords(block.replace(/^```.*$/gm, ''));
			return ' ';
		})
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links and images: keep the text, drop the URL
		.replace(/<[^>]+>/g, ' ') // HTML/MDX tags
		.replace(/[#*_>`~|]/g, ' '); // Markdown syntax
	const words = countWords(prose) + codeWords / 2;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
