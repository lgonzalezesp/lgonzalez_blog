# Plan 004 — Páginas y diseño

- **Spec:** [spec.md](./spec.md)
- **Estado:** Borrador

## Enfoque técnico

### Contenido de prueba separado del contenido real

Hasta ahora las pruebas funcionales dependen del contenido de ejemplo de `src/content/`: en cuanto el autor lo sustituya por artículos reales, las pruebas se rompen. Además, probar la paginación exige más artículos de los que tendrá el blog al principio.

- `src/content.config.ts` lee la raíz del contenido de `process.env.CONTENT_DIR` (por defecto `./src/content`).
- Las pruebas funcionales construyen el sitio con `CONTENT_DIR=tests/fixtures/content` (variable `env` del `webServer` de Playwright): contenido estable, pensado para probar (12 artículos ES para paginar, uno sin traducción, un borrador, uno con código y encabezados para la tabla de contenidos, notas, proyectos y etiquetas compartidas).
- Se copian a los fixtures los ejemplos que usan las pruebas de 002 y 003 (mismos slugs), así esas pruebas no cambian.
- `npm run build` y `npm run check` siguen validando el contenido real; CI hace las dos cosas.
- `content-tree.test.ts` (002) comprueba la estructura de ambos árboles; la exigencia de «un ejemplo por colección e idioma» pasa a los fixtures, para que el autor pueda borrar los ejemplos de `src/content/` cuando escriba (se actualiza la spec 002).

### Diseño visual

- **Tipografía:** se mantiene **Atkinson Hyperlegible** (local, ya cargada con la API de fuentes de Astro): diseñada para la legibilidad, encaja con el principio 4. Código en la fuente monoespaciada del sistema.
- **Paleta:** neutros (escala `zinc` de Tailwind) + un acento azul, definida como variables CSS (`--color-bg`, `--color-text`, `--color-muted`, `--color-accent`, `--color-border`…) con valores para claro y oscuro, todos con contraste AA comprobado por axe.
- **Estilos:** se sustituye el CSS heredado de Bear Blog por Tailwind 4 (utilidades + variables de tema registradas con `@theme`). Estilos de lectura (`.prose`) propios en `global.css`, sin `@tailwindcss/typography`.
- **Maquetación:** columna de lectura de ~70 caracteres; grids de tarjetas de 1 columna en móvil y 2–3 en escritorio; sin anchos fijos (nada de `width: 960px`), para que no haya scroll horizontal desde 320 px.

### Modo oscuro (única isla de JS, justificada)

El criterio «recuerda la elección del lector» no se puede cumplir sin JS. Se usa el mínimo:

- Sin JS el sitio sigue `prefers-color-scheme` solo con CSS.
- Un script **inline** y diminuto en `<head>` aplica `data-theme` desde `localStorage` antes de pintar (sin parpadeo).
- `ThemeToggle.astro`: un `<button>` con `aria-pressed` y texto del diccionario; aparece oculto (`hidden`) y el script lo muestra, así sin JS no hay un botón que no funcione.
- Tailwind: `@custom-variant dark` ligado a `data-theme`. `localStorage` no es una cookie ni sale del navegador (principio 5).

### Resaltado de código

- Shiki (incluido en Astro) con dos temas (`github-light` / `github-dark`) mediante `markdown.shikiConfig.themes`; el CSS elige uno u otro según el tema activo. Sin JS en cliente.

### Páginas y URLs

Todas en ES y EN, con su cuerpo en `src/views/` y URLs registradas en `src/i18n/routes.ts` (patrón de 003):

| Página           | ES                          | EN                              | Notas                                                    |
| ---------------- | --------------------------- | ------------------------------- | -------------------------------------------------------- |
| Inicio           | `/`                         | `/en/`                          | Últimos 3 artículos, proyectos destacados, últimas notas |
| Blog (paginado)  | `/blog/`, `/blog/pagina/2/` | `/en/blog/`, `/en/blog/page/2/` | 10 artículos por página                                  |
| Artículo         | `/blog/<slug>/`             | `/en/blog/<slug>/`              | Tiempo de lectura y tabla de contenidos                  |
| Proyectos (grid) | `/proyectos/`               | `/en/projects/`                 | Destacados primero                                       |
| Detalle proyecto | `/proyectos/<slug>/`        | `/en/projects/<slug>/`          | Stack, estado, enlaces a repo y demo                     |
| Notas            | `/notas/`                   | `/en/notes/`                    | Lista cronológica                                        |
| Nota             | `/notas/<slug>/`            | `/en/notes/<slug>/`             | (002)                                                    |
| Etiquetas        | `/etiquetas/`               | `/en/tags/`                     | Todas las etiquetas del idioma con su recuento           |
| Etiqueta         | `/etiquetas/<tag>/`         | `/en/tags/<tag>/`               | Artículos, notas y proyectos con esa etiqueta            |
| Sobre mí         | `/sobre-mi/`                | `/en/about/`                    | Contenido en Markdown (ver abajo)                        |
| 404              | `/404`                      | —                               | Bilingüe (003), con el nuevo diseño                      |

- Paginación con segmento traducido (`pagina` / `page`) para que nunca choque con el slug de un artículo.
- Etiquetas: el slug se normaliza (minúsculas, sin acentos ni espacios: «Inteligencia Artificial» → `inteligencia-artificial`).
- **«Sobre mí» en Markdown:** nueva colección `pages` (`src/content/pages/{es,en}/about.md`) con `title`, `description`, `lang`, `translationKey` y foto opcional (`cover` con `alt`). El autor edita texto, no código. Hasta que lo escriba, un texto de marcador.
- Enlaces del pie: GitHub del autor (`https://github.com/lgonzalezesp`) y RSS. El perfil de LinkedIn llega con 007.

### Componentes

`Header` (Inicio, Blog, Proyectos, Notas, Sobre mí + selector de idioma + toggle de tema; en móvil los enlaces pasan a varias líneas, sin menú desplegable ni JS), `Footer`, `PostCard`, `ProjectCard`, `NoteCard`, `TagList`, `Pagination`, `ThemeToggle`, `TableOfContents`, `ReadingTime`, `SkipLink` («Saltar al contenido»).

### Lógica pura (`src/lib/`), probada con Vitest

- `reading-time.ts` — `readingTime(text)`: palabras / 200, redondeo hacia arriba, mínimo 1 minuto; ignora la sintaxis Markdown y los bloques de código cuentan la mitad.
- `toc.ts` — `buildToc(headings)`: encabezados `h2`/`h3` (de `render()`) a lista anidada; se muestra si hay al menos 2.
- `pagination.ts` — `paginate(items, pageSize)`: páginas, elementos por página, página anterior/siguiente; una página fuera de rango no se genera (404).
- `tags.ts` — `tagSlug(tag)` y `groupByTag(entries)`: etiquetas por idioma, con sus entradas ordenadas por fecha.
- `useTranslations` admite parámetros (`t('post.readingTime', { minutes: 5 })` → «5 min de lectura» / «5 min read»).

### Accesibilidad

Enlace «Saltar al contenido», foco visible (`:focus-visible` con contorno del color de acento), `aria-current` en la navegación y la paginación, un solo `h1` por página, imágenes con `<Image>` y `alt` del frontmatter.

## Archivos afectados

- `src/content.config.ts` — modificar — `CONTENT_DIR` y colección `pages`
- `src/content/schemas.ts` — modificar — `pageSchema`
- `src/content/pages/{es,en}/about.md` — crear
- `tests/fixtures/content/**` — crear — contenido de prueba
- `playwright.config.ts` — modificar — `env: { CONTENT_DIR }` en el `webServer`
- `astro.config.mjs` — modificar — temas de Shiki
- `src/styles/global.css` — reescribir — tema claro/oscuro, `.prose`, foco, código
- `src/lib/reading-time.ts`, `toc.ts`, `pagination.ts`, `tags.ts` — crear
- `src/i18n/ui.ts`, `utils.ts`, `routes.ts` — modificar — textos nuevos, parámetros en `t()`, URLs nuevas
- `src/components/` — crear `PostCard`, `ProjectCard`, `NoteCard`, `TagList`, `Pagination`, `ThemeToggle`, `TableOfContents`, `ReadingTime`, `SkipLink`; modificar `Header`, `Footer`, `BaseHead`, `FormattedDate`
- `src/layouts/Base.astro`, `BlogPost.astro` — modificar; `src/layouts/Project.astro` — crear
- `src/views/` — modificar `HomeView`, `BlogIndexView`, `AboutView`; crear `ProjectsView`, `NotesView`, `TagsView`, `TagView`
- `src/pages/` — crear paginación del blog, proyectos, notas y etiquetas en ES y EN
- `tests/unit/004-pages-design/*`, `tests/e2e/004-pages-design/*` — crear
- `tests/unit/002-content-model/content-tree.test.ts`, `specs/002-content-model/spec.md` — modificar — ejemplos en fixtures
- `AGENTS.md`, `.claude/rules/*` — modificar — `CONTENT_DIR`, fixtures, tema, rutas nuevas

## Dependencias nuevas

- Ninguna. Shiki viene con Astro; tiempo de lectura, tabla de contenidos, paginación y etiquetas son funciones propias de pocas líneas.

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                                                        |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Todo estático; sin dependencias nuevas                                                      |
| 2. Dueño de los datos  | ✅       | «Sobre mí» pasa a Markdown                                                                  |
| 3. Bilingüe            | ✅       | Todas las páginas en ES y EN                                                                |
| 4. Rendimiento / a11y  | ✅       | Axe en cada tipo de página y en ambos temas; teclado y 320 px probados                      |
| 5. Privacidad          | ✅       | El tema se guarda en `localStorage`, no en cookies; sin terceros                            |
| 6. Cero JS por defecto | ⚠️       | **Excepción justificada:** script inline mínimo para el tema (el criterio exige recordarlo) |
| 7. Spec = verdad       | ✅       | Preguntas abiertas resueltas; spec 002 actualizada (ejemplos en fixtures)                   |
| 8. URLs estables       | ✅       | Nada publicado aún; URLs nuevas definitivas                                                 |
| 9. Todo se prueba      | ✅       | Ver trazabilidad; las e2e dejan de depender del contenido real                              |

## Decisiones que necesitan tu visto bueno

- **P1 — Contenido de prueba separado** (`CONTENT_DIR` + `tests/fixtures/content/`), para que escribir artículos reales no rompa las pruebas.
- **P2 — Paleta y tipografía** (pregunta abierta): Atkinson Hyperlegible + neutros y un acento azul, minimalista. Si tienes referencias visuales o colores, se cambian en las variables del tema.
- **P3 — «Sobre mí»** (pregunta abierta): Markdown en `src/content/pages/`, con foto opcional; enlaces a GitHub y RSS en el pie. Tú escribes el texto; yo dejo un marcador.
- **P4 — Modo oscuro con JS mínimo** (excepción al principio 6).
- **P5 — Menú móvil sin desplegable:** los enlaces de la cabecera bajan a varias líneas en pantallas estrechas (cero JS).
- **P6 — URLs nuevas:** `/proyectos/`, `/notas/`, `/etiquetas/`, `/blog/pagina/N/` y sus equivalentes en inglés (`/en/projects/`, `/en/notes/`, `/en/tags/`, `/en/blog/page/N/`).

## Riesgos

- Los temas de Shiki o el acento pueden no llegar al contraste AA → axe en una página con código en tema claro y oscuro; se ajustan tokens o tema si falla.
- Parpadeo de tema al cargar → script inline síncrono en `<head>` antes del CSS; prueba funcional que comprueba el tema en la primera pintura tras recargar.
- La reescritura de estilos rompe la a11y o el diseño de páginas ya existentes → axe y la prueba de 320 px cubren todas las páginas.
- `CONTENT_DIR` mal configurado haría que las e2e prueben el contenido real → prueba de humo que comprueba que el build de pruebas contiene un artículo que solo existe en los fixtures.
- Etiquetas con mayúsculas o acentos generan URLs distintas para la misma etiqueta → `tagSlug` normaliza y `groupByTag` agrupa por slug.

## Estrategia de pruebas

- **Unitarias** (`tests/unit/004-pages-design/`):
  - `reading-time.test.ts` — vacío → 1, corto → 1, ~1000 palabras → 5, código cuenta menos.
  - `toc.test.ts` — `h2`/`h3` anidados, ignora `h1`/`h4`, vacío.
  - `pagination.test.ts` — número de páginas, tamaño, última página incompleta, anterior/siguiente, lista vacía, página fuera de rango.
  - `tags.test.ts` — `tagSlug` (acentos, espacios, mayúsculas), `groupByTag` (agrupa por slug, ordena, separa idiomas).
  - `translate-params.test.ts` — `t()` con parámetros.
  - `cards.test.ts` — Container API: `PostCard` y `ProjectCard` (título, fecha, etiquetas, enlaces, imagen con `alt`), `ThemeToggle` (botón con `aria-pressed` y texto traducido), `Pagination`.
  - `content-tree.test.ts` (002) — estructura de `src/content/` y de los fixtures.
- **Funcionales** (`tests/e2e/004-pages-design/`, sobre el build con fixtures):
  - `pages.spec.ts` — todas las páginas de la tabla responden 200 en ES y EN; el build usa los fixtures.
  - `navigation.spec.ts` — la cabecera lleva a cada sección (ES y EN); una tarjeta de artículo y una de proyecto llevan a su detalle.
  - `pagination-tags.spec.ts` — `/blog/` → página 2 → vuelta; 10 artículos por página; `/blog/pagina/99/` → 404; una etiqueta lista solo su contenido.
  - `theme.spec.ts` — `prefers-color-scheme: dark` sin elección → oscuro; el botón cambia el tema y `aria-pressed`; persiste al recargar; sin JS sigue la preferencia del sistema.
  - `responsive.spec.ts` — 320 px y 1280 px en cada tipo de página: sin scroll horizontal; en 320 px todos los enlaces de la cabecera son visibles y clicables.
  - `keyboard.spec.ts` — el primer Tab enfoca «Saltar al contenido» y lleva a `main`; el foco es visible (contorno) en enlaces, selector y toggle.
  - `code.spec.ts` — un bloque de código tiene resaltado (colores de Shiki) en claro y en oscuro.
  - `images.spec.ts` — todas las `<img>` tienen `alt` y se sirven optimizadas (`/_astro/…`, `width`/`height`).
  - `a11y.spec.ts` — axe en cada tipo de página, en tema claro y oscuro.

### Trazabilidad criterio → prueba

| Criterio de aceptación                       | Prueba unitaria                                        | Prueba funcional                                                 |
| -------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| Páginas en ES y EN                           | `pagination.test.ts`, `tags.test.ts`                   | `pages.spec.ts`, `navigation.spec.ts`, `pagination-tags.spec.ts` |
| Componentes                                  | `cards.test.ts`, `reading-time.test.ts`, `toc.test.ts` | `navigation.spec.ts`, `theme.spec.ts`                            |
| Modo oscuro (sistema + recuerda la elección) | `cards.test.ts` (`ThemeToggle`)                        | `theme.spec.ts`                                                  |
| Resaltado de código                          | —                                                      | `code.spec.ts`                                                   |
| Imágenes optimizadas con `alt`               | `cards.test.ts`                                        | `images.spec.ts`                                                 |
| Responsive desde 320 px                      | —                                                      | `responsive.spec.ts`                                             |
| WCAG 2.1 AA                                  | —                                                      | `a11y.spec.ts`, `keyboard.spec.ts`                               |
| Lighthouse ≥ 95                              | —                                                      | Verificación manual (Lighthouse)                                 |

## Verificación

- `npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Manual: recorrer el sitio en móvil (320 px) y escritorio, en claro y oscuro, solo con teclado.
- Lighthouse ≥ 95 en las cuatro categorías en una página de cada tipo (inicio, blog, artículo, proyectos, proyecto, notas, etiquetas, sobre mí), en ES y EN.
