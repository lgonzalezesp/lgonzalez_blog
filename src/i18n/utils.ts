import { type Lang, type UiKey, ui } from './ui';

/**
 * `t(key, params?)` for one language. `{name}` placeholders are replaced with `params.name`.
 * An unknown key or a missing parameter throws, so broken text never reaches a page.
 */
export function useTranslations(lang: Lang) {
	return function t(key: UiKey, params: Record<string, string | number> = {}): string {
		const text = ui[lang][key];
		if (text === undefined) {
			throw new Error(`Falta la traducción "${key}" (${lang}) en src/i18n/ui.ts`);
		}
		return text.replace(/\{(\w+)\}/g, (_, name: string) => {
			if (!(name in params)) throw new Error(`Falta el parámetro "${name}" para "${key}" (${lang})`);
			return String(params[name]);
		});
	};
}

/** `/en` and `/en/…` are English; everything else is Spanish (the default, without prefix). */
export function getLangFromUrl(url: URL): Lang {
	const [first] = url.pathname.split('/').filter(Boolean);
	return first === 'en' ? 'en' : 'es';
}

const LOCALES: Record<Lang, string> = { es: 'es-ES', en: 'en-US' };

/** Long date in the reader's language. UTC, so the day never shifts with the build machine's time zone. */
export function formatDate(date: Date, lang: Lang): string {
	return new Intl.DateTimeFormat(LOCALES[lang], { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
