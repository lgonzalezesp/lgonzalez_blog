export interface Page<T> {
	/** 1-based page number. */
	number: number;
	total: number;
	items: T[];
	prev?: number;
	next?: number;
}

/** Splits a list into pages. An empty list still has one (empty) page, so listings always exist. */
export function paginate<T>(items: T[], pageSize: number): Page<T>[] {
	if (!Number.isInteger(pageSize) || pageSize < 1) {
		throw new Error(`pageSize debe ser un entero positivo (recibido: ${pageSize})`);
	}
	const total = Math.max(1, Math.ceil(items.length / pageSize));
	return Array.from({ length: total }, (_, index) => ({
		number: index + 1,
		total,
		items: items.slice(index * pageSize, (index + 1) * pageSize),
		prev: index > 0 ? index : undefined,
		next: index + 1 < total ? index + 2 : undefined,
	}));
}

/** The page with that number, or undefined when it is out of range. */
export function getPage<T>(pages: Page<T>[], number: number): Page<T> | undefined {
	return pages[number - 1];
}
