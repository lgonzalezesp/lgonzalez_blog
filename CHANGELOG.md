# Changelog

Cambios por versión de lgonzalez.dev. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [versionado semántico](https://semver.org/lang/es/). Cada versión enlaza las specs (`specs/`) que incluye.

## [0.2.0] — 2026-10-02

Favicon propio, herramientas para escribir y el primer artículo.

### Añadido

- **Favicon** ([009](specs/009-favicon/spec.md)): iniciales LG con una pata de perro, con modo oscuro; `favicon.ico`, icono de Apple, iconos de 192 y 512 px y `manifest.webmanifest`, generados desde un SVG fuente con `npm run icons`.
- **Crear posts** ([010](specs/010-new-post/spec.md)): `npm run new-post` crea un artículo o una nota en borrador, en español, inglés o ambos enlazados, con el frontmatter válido y sin sobrescribir archivos; skill `/nuevo-post` de Claude Code que guía el flujo hasta la PR.
- **Primer artículo:** «El conocimiento que me debía: Professional Cloud Architect de GCP» (y su versión en inglés), con portada ilustrada.
- `README.md` con las funcionalidades, los comandos y el flujo de trabajo.

### Cambiado

- Se eliminan los artículos, proyectos y notas de ejemplo de `src/content/`.
- La prueba de humo acepta un blog sin artículos ([008](specs/008-deploy/spec.md)).
- `OUT_DIR` permite construir en otra carpeta (solo para pruebas).

## [0.1.0] — 2026-10-02

Primera publicación del blog en https://lgonzalez.dev.

### Añadido

- **Proyecto** ([001](specs/001-setup/spec.md)): Astro 7 con MDX, Tailwind CSS 4 y TypeScript estricto; ESLint y Prettier; Vitest (con la Container API) y Playwright (con axe-core); CI en GitHub Actions; Gitflow con `main` y `develop` protegidas; npm y Node 24.
- **Modelo de contenido** ([002](specs/002-content-model/spec.md)): colecciones `blog`, `projects` y `notes` con esquemas validados, contenido por idioma (`es/`, `en/`), borradores, traducciones por `translationKey` y notas con título, fecha y etiquetas obligatorios.
- **Internacionalización** ([003](specs/003-i18n/spec.md)): español en la raíz e inglés bajo `/en/`; diccionario de UI; selector de idioma que lleva a la traducción; `hreflang`; fechas por idioma.
- **Páginas y diseño** ([004](specs/004-pages-design/spec.md)): portada, blog paginado, artículos con tiempo de lectura y tabla de contenidos, proyectos, notas, etiquetas, «Sobre mí» en Markdown y 404; modo claro/oscuro que recuerda la elección; código resaltado; diseño adaptable desde 320 px y accesible (WCAG 2.1 AA).
- **Comentarios** ([005](specs/005-comments/spec.md)): Giscus sobre GitHub Discussions en artículos y proyectos, en el idioma y tema de la página, cargado solo al llegar a la sección.
- **SEO, feeds y analítica** ([006](specs/006-seo-analytics/spec.md)): metadatos, Open Graph y Twitter Card con imagen de 1200×627; RSS por idioma (artículos y notas); sitemap y `robots.txt`; Vercel Web Analytics y Speed Insights sin cookies.
- **Compartir en LinkedIn** ([007](specs/007-linkedin-share/spec.md)): botón de compartir sin scripts de LinkedIn, «Copiar enlace», imágenes OG generadas para contenido sin portada y enlace al perfil del autor.
- **Despliegue** ([008](specs/008-deploy/spec.md)): Vercel con producción en `main` y previews protegidas para `develop` y cada PR; pruebas de humo tras cada despliegue; proceso de release y hotfix.

[0.2.0]: https://github.com/lgonzalezesp/lgonzalez_blog/releases/tag/v0.2.0
[0.1.0]: https://github.com/lgonzalezesp/lgonzalez_blog/releases/tag/v0.1.0
