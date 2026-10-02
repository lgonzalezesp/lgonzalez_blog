# Plan 003 — Internacionalización ES/EN

- **Spec:** [spec.md](./spec.md)
- **Estado:** Borrador

## Enfoque técnico

### Configuración

- `i18n` nativo de Astro en `astro.config.mjs`: `locales: ['es', 'en']`, `defaultLocale: 'es'`, `routing.prefixDefaultLocale: false`. Deja a Astro (y a futuras integraciones como el sitemap de 006) al tanto de los idiomas; la lógica del sitio usa nuestras utilidades puras, que se prueban con Vitest.

### Diccionario y utilidades (`src/i18n/`)

- `ui.ts` — diccionario `{ es: {…}, en: {…} }` con claves planas (`nav.home`, `post.updatedOn`, `footer.rights`, `lang.switchTo`…). El tipo de las claves sale de `es`, así que una clave que falte en `en` es un error de TypeScript, y además lo comprueba una prueba.
- `utils.ts` — funciones puras:
  - `getLangFromUrl(url)` — `/en` o `/en/…` → `en`; todo lo demás → `es` (`/english/` sigue siendo `es`).
  - `useTranslations(lang)` → `t(key)`; una clave inexistente **lanza un error** con su nombre (nunca muestra texto vacío ni la clave).
  - `formatDate(date, lang)` — `Intl.DateTimeFormat` (`es-ES` / `en-US`, zona `UTC` para que la fecha no cambie según el huso del build): «1 de octubre de 2026» / «October 1, 2026».
- `routes.ts` — URLs por idioma en un solo sitio:
  - Secciones: `home` (`/` · `/en/`), `blog` (`/blog/` · `/en/blog/`), `about` (`/sobre-mi/` · `/en/about/`).
  - Contenido: `entryUrl(collection, entry)` → `/blog/<slug>/` · `/en/blog/<slug>/`, `/notas/<slug>/` · `/en/notes/<slug>/` (sustituye las URLs construidas a mano en 002).
  - `getAlternates(...)` → `{ es?: url, en?: url }` de la página actual: en secciones, la misma sección en el otro idioma; en contenido, la traducción (por `translationKey`, con `findTranslation` de 002) o nada si no existe.
  - `switchUrl(alternates, lang)` → la URL a la que lleva el selector: la alternativa si existe; si no, la portada del otro idioma.

### Layout común y componentes

- `src/layouts/Base.astro` (nuevo) — `<html lang>`, `BaseHead`, `Header`, `<main>` y `Footer`. Recibe `lang` y `alternates`. Todas las páginas y `BlogPost.astro` lo usan, así que `lang` y `hreflang` se resuelven en un solo sitio.
- `BaseHead.astro` — `<link rel="alternate" hreflang="es|en|x-default">` solo cuando hay traducción (más la propia página); `x-default` apunta a la versión en español. `og:locale` según idioma.
- `LanguagePicker.astro` (nuevo) — un enlace normal (cero JS) al otro idioma con `hreflang` y `lang` del destino. Su texto es el nombre del idioma **en ese idioma** («English» en páginas ES, «Español» en páginas EN), como recomienda WCAG 3.1.2; por eso el enlace lleva `lang` y la prueba de «sin español en `/en/`» excluye elementos con `lang="es"`.
- `Header.astro` — navegación desde el diccionario (Inicio/Home, Blog, Sobre mí/About) con URLs de `routes.ts` + selector de idioma. Se eliminan los enlaces sociales de la plantilla (eran de Astro, no del autor; los reales llegan en 004/007).
- `Footer.astro` — «© 2026 Luis González. Todos los derechos reservados.» / «… All rights reserved.» desde el diccionario; sin enlaces de la plantilla.
- `FormattedDate.astro` — recibe `lang` y usa `formatDate`.
- `BlogPost.astro` — «Actualizado el» / «Last updated on» desde el diccionario.

### Páginas

Cada ruta existe en los dos idiomas. Para no duplicar marcado, el cuerpo de las páginas de sección vive en `src/views/` (componentes que reciben `lang`) y los archivos de `src/pages/` son envoltorios de pocas líneas:

| Página         | ES                | EN                  | Vista                  |
| -------------- | ----------------- | ------------------- | ---------------------- |
| Portada        | `/`               | `/en/`              | `HomeView.astro`       |
| Blog (listado) | `/blog/`          | `/en/blog/`         | `BlogIndexView.astro`  |
| Sobre mí       | `/sobre-mi/`      | `/en/about/`        | `AboutView.astro`      |
| Artículo       | `/blog/<slug>/`   | `/en/blog/<slug>/`  | `BlogPost.astro` (002) |
| Nota           | `/notas/<slug>/`  | `/en/notes/<slug>/` | `BlogPost.astro` (002) |
| 404            | `/404` (bilingüe) | —                   | —                      |

- La portada y «Sobre mí» pierden el texto de la plantilla y muestran un texto mínimo del diccionario (el contenido real y el diseño son de 004; no se inventa la biografía del autor).
- `/blog/` y `/en/blog/` listan solo los artículos de su idioma (`getPublished('blog', lang)`).
- 404: Vercel sirve un único `404.html`, así que la página es bilingüe (bloque ES y bloque EN con su `lang`), manteniendo «Volver al inicio».
- `/about/` desaparece en favor de `/sobre-mi/` y `/en/about/` (aún no hay nada publicado; no hace falta redirección).
- RSS sigue siendo solo en español (feeds por idioma: 006).

### Contenido de ejemplo

- Nuevo `blog/es/articulo-sin-traduccion.md` (marcado como ejemplo) para probar el selector cuando no hay traducción.

### Pregunta abierta de la spec

- **Detectar el idioma del navegador y sugerir la versión inglesa:** no en esta spec. Exigiría JS en cliente (principio 6) y el selector visible ya cubre la necesidad. Se anota como mejora futura en `spec.md`.

## Archivos afectados

- `astro.config.mjs` — modificar — bloque `i18n`
- `src/i18n/ui.ts`, `src/i18n/utils.ts`, `src/i18n/routes.ts` — crear
- `src/consts.ts` — modificar — `SITE_DESCRIPTION` sale del diccionario (`ui.es`)
- `src/layouts/Base.astro` — crear; `src/layouts/BlogPost.astro` — modificar
- `src/components/LanguagePicker.astro` — crear; `Header.astro`, `Footer.astro`, `FormattedDate.astro`, `BaseHead.astro` — modificar
- `src/views/HomeView.astro`, `BlogIndexView.astro`, `AboutView.astro` — crear
- `src/pages/index.astro`, `blog/index.astro`, `404.astro` — modificar; `src/pages/en/index.astro`, `en/blog/index.astro`, `sobre-mi.astro`, `en/about.astro` — crear; `about.astro` — borrar
- `src/pages/blog/[...slug].astro`, `en/blog/[...slug].astro`, `notas/[...slug].astro`, `en/notes/[...slug].astro` — modificar — `alternates` y `lang`
- `src/lib/collections.ts` — modificar — `entryPaths` añade la traducción a las props
- `src/content/blog/es/articulo-sin-traduccion.md` — crear
- `tests/unit/003-i18n/*.test.ts`, `tests/e2e/003-i18n/*.spec.ts` — crear
- `AGENTS.md`, `.claude/rules/astro-ui.md` — modificar — estructura (`src/i18n/`, `src/views/`), rutas y uso del diccionario
- `specs/003-i18n/spec.md` — modificar — resolver la pregunta abierta

## Dependencias nuevas

- Ninguna (`Intl` es nativo; el i18n es el de Astro).

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                                       |
| ---------------------- | -------- | -------------------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Diccionario en TypeScript, sin librerías de i18n                           |
| 2. Dueño de los datos  | ✅       | Sin cambios                                                                |
| 3. Bilingüe            | ✅       | Es el objetivo de la spec; ES por defecto sin prefijo                      |
| 4. Rendimiento / a11y  | ✅       | `lang` correcto en página y en el selector (WCAG 3.1.1 y 3.1.2); axe en EN |
| 5. Privacidad          | ✅       | Se eliminan enlaces a terceros de la plantilla                             |
| 6. Cero JS por defecto | ✅       | Selector de idioma = enlace; sin detección del navegador                   |
| 7. Spec = verdad       | ✅       | Pregunta abierta resuelta en la spec                                       |
| 8. URLs estables       | ✅       | Nada publicado aún; las URLs elegidas son las definitivas (P1)             |
| 9. Todo se prueba      | ✅       | Ver trazabilidad                                                           |

## Decisiones que necesitan tu visto bueno

- **P1 — URLs de «Sobre mí»:** `/sobre-mi/` y `/en/about/` (segmento traducido, igual que las notas). Sustituye a `/about/`.
- **P2 — Selector de idioma:** enlace con el nombre del idioma de destino en su propio idioma («English» / «Español»).
- **P3 — Sin detección del idioma del navegador** (respuesta a la pregunta abierta de la spec).
- **P4 — Enlaces sociales de la plantilla eliminados** de cabecera y pie hasta 004/007.

## Riesgos

- Fechas que cambian de día según la zona horaria del build → `timeZone: 'UTC'` en `formatDate` y prueba unitaria con una fecha límite.
- Se cuela texto de UI sin traducir → tipo de claves derivado de `es`, prueba de claves iguales y prueba funcional que busca textos del diccionario ES en las páginas `/en/`.
- `hreflang` mal emparejado con slugs traducidos (`usando-mdx` ↔ `using-mdx`) → las alternativas salen de `translationKey`, nunca de reescribir la ruta; prueba en ambos sentidos.
- El bloque `i18n` de Astro cambia el comportamiento del 404 o de las rutas → pruebas de 001 (404) y 002 (rutas) siguen ejecutándose y deben pasar.
- Refactor a `Base.astro` toca todas las páginas → las pruebas de a11y de 001 y 002 actúan de red de seguridad.

## Estrategia de pruebas

- **Unitarias** (`tests/unit/003-i18n/`):
  - `dictionaries.test.ts` — ES y EN tienen exactamente las mismas claves; ningún valor vacío; `astro.config.mjs` declara los mismos idiomas.
  - `translate.test.ts` — `t()` por idioma; clave inexistente → error con su nombre.
  - `routes.test.ts` — `getLangFromUrl` (`/`, `/blog/x/`, `/en`, `/en/`, `/en/blog/x/`, `/english/`); URLs de secciones y de contenido por idioma; `getAlternates` y `switchUrl` con y sin traducción.
  - `format-date.test.ts` — ES y EN; una fecha a las 23:30 UTC no salta de día.
  - `components.test.ts` — Container API: `LanguagePicker` (href, `hreflang`, `lang`, texto) y `FormattedDate` en ES y EN.
- **Funcionales** (`tests/e2e/003-i18n/`, Chromium escritorio, sobre el build):
  - `lang.spec.ts` — `<html lang>` en `/`, `/en/`, un artículo ES y uno EN.
  - `language-picker.spec.ts` — artículo traducido → su traducción (ES→EN y EN→ES); artículo sin traducción → `/en/`; en secciones, la misma sección en el otro idioma.
  - `hreflang.spec.ts` — un artículo ES y su traducción se enlazan con `hreflang` en ambos sentidos (+ `x-default`); un artículo sin traducción no anuncia alternativa.
  - `listings.spec.ts` — `/en/blog/` no enlaza contenido ES y `/blog/` no enlaza contenido EN.
  - `no-spanish-on-en.spec.ts` — en `/en/`, `/en/blog/`, `/en/about/`, un artículo y una nota EN no aparece ningún texto exclusivo del diccionario ES (excluyendo elementos con `lang="es"`); fechas en formato inglés.
  - `a11y.spec.ts` — axe en `/en/`, `/en/blog/`, `/en/about/` y `/sobre-mi/`.

### Trazabilidad criterio → prueba

| Criterio de aceptación                         | Prueba unitaria                             | Prueba funcional                      |
| ---------------------------------------------- | ------------------------------------------- | ------------------------------------- |
| ES en la raíz, EN bajo `/en/`                  | `routes.test.ts`                            | `lang.spec.ts`, `listings.spec.ts`    |
| Textos de interfaz desde un diccionario        | `dictionaries.test.ts`, `translate.test.ts` | `no-spanish-on-en.spec.ts`            |
| Selector: traducción o portada del otro idioma | `routes.test.ts`, `components.test.ts`      | `language-picker.spec.ts`             |
| Fechas según el idioma                         | `format-date.test.ts`, `components.test.ts` | `no-spanish-on-en.spec.ts` (fecha EN) |
| `<html lang>` y `hreflang`                     | `routes.test.ts` (`getAlternates`)          | `lang.spec.ts`, `hreflang.spec.ts`    |
| Listados solo del idioma actual                | —                                           | `listings.spec.ts`                    |
| Sin texto de UI en español en `/en/`           | `dictionaries.test.ts`                      | `no-spanish-on-en.spec.ts`            |

## Verificación

- `npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Manual: navegar ES ↔ EN con el selector en portada, blog, artículo traducido, artículo sin traducción y nota.
- Lighthouse ≥ 95 en `/`, `/en/`, `/en/blog/using-mdx/` y `/sobre-mi/`.
