export interface Heading {
	depth: number;
	slug: string;
	text: string;
}

export interface TocItem {
	slug: string;
	text: string;
	children: TocItem[];
}

/** Table of contents from rendered headings: h2 at the top level, h3 nested under the previous h2. */
export function buildToc(headings: Heading[]): TocItem[] {
	const toc: TocItem[] = [];
	for (const { depth, slug, text } of headings) {
		const item = { slug, text, children: [] };
		const parent = toc.at(-1);
		if (depth === 2 || (depth === 3 && !parent)) toc.push(item);
		else if (depth === 3 && parent) parent.children.push(item);
	}
	return toc;
}
