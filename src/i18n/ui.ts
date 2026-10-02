// UI text in every language. Spanish is the source: its keys define the type,
// so a key missing in English is a type error (and a unit test failure).

export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'es';

const es = {
	'site.description': 'Proyectos, ideas y notas de Luis González.',
	'lang.name': 'Español',
	'nav.label': 'Principal',
	'nav.home': 'Inicio',
	'nav.blog': 'Blog',
	'nav.about': 'Sobre mí',
	'home.intro': 'Aquí escribo sobre mis proyectos, ideas y notas.',
	'home.cta': 'Leer el blog',
	'blog.title': 'Blog',
	'blog.description': 'Artículos sobre proyectos, ideas y aprendizajes.',
	'blog.empty': 'Todavía no hay artículos.',
	'about.title': 'Sobre mí',
	'about.placeholder': 'Esta página está en construcción.',
	'post.updatedOn': 'Actualizado el',
	'post.tags': 'Etiquetas',
	'footer.rights': 'Todos los derechos reservados.',
	'notFound.title': 'Página no encontrada',
	'notFound.message': 'La página que buscas no existe o se ha movido.',
	'notFound.back': 'Volver al inicio',
} as const;

export type UiKey = keyof typeof es;

const en: Record<UiKey, string> = {
	'site.description': 'Projects, ideas and notes by Luis González.',
	'lang.name': 'English',
	'nav.label': 'Main',
	'nav.home': 'Home',
	'nav.blog': 'Blog',
	'nav.about': 'About',
	'home.intro': 'I write here about my projects, ideas and notes.',
	'home.cta': 'Read the blog',
	'blog.title': 'Blog',
	'blog.description': 'Posts about projects, ideas and lessons learned.',
	'blog.empty': 'No posts yet.',
	'about.title': 'About me',
	'about.placeholder': 'This page is under construction.',
	'post.updatedOn': 'Last updated on',
	'post.tags': 'Tags',
	'footer.rights': 'All rights reserved.',
	'notFound.title': 'Page not found',
	'notFound.message': 'The page you are looking for does not exist or has moved.',
	'notFound.back': 'Back to home',
};

export const ui: Record<Lang, Record<UiKey, string>> = { es, en };
