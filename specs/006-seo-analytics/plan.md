# Plan 006 — SEO, feeds y analítica

- **Spec:** [spec.md](./spec.md)
- **Estado:** Borrador

## Enfoque técnico

### Metadatos (`src/lib/seo.ts` + `BaseHead.astro`)

Toda la lógica pasa a una función pura, probada con Vitest, y `BaseHead.astro` solo la pinta:

- `buildMeta({ site, path, title, description, lang, image, alternates, article?, noindex? })` devuelve:
  - `<title>`, `meta description`, `link rel="canonical"` **absoluta** (`site` + ruta).
  - Open Graph: `og:site_name`, `og:type` (`article` en artículos y notas, `website` en el resto), `og:url` (= canónica), `og:title`, `og:description`, `og:locale` (+ `og:locale:alternate` si hay traducción), `og:image` **absoluta** con `og:image:width` = 1200, `og:image:height` = 627, `og:image:alt` y `og:image:type`.
  - Artículos: `article:published_time`, `article:modified_time` y `article:tag`.
  - Twitter Card: `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`.
  - `robots: noindex` solo en la 404.
- **Imagen OG de 1200×627:** si el contenido tiene portada, se recorta con `getImage()` de Astro (`width: 1200`, `height: 627`, `fit: 'cover'`, JPEG); si no, se usa la imagen por defecto. La generación automática por artículo (título + logo) es de 007.
- **Imagen por defecto:** `src/assets/og-default.png` (1200×627, nombre del sitio y dominio, válida para ES y EN), creada una vez a partir de `src/assets/og-default.svg` con `sharp` (ya instalado); ambos archivos se versionan.
- Las páginas de contenido pasan a `Base.astro` lo que necesita `buildMeta` (portada, fechas, etiquetas, tipo); el resto usa los valores por defecto.

### RSS por idioma (`src/lib/feed.ts`)

- `/rss.xml` (español) y `/en/rss.xml` (inglés), con `@astrojs/rss` (ya instalado).
- `feedItems(entries, lang, env)` — función pura: solo publicados (`filterPublished`), solo del idioma, ordenados por fecha; cada ítem con título, descripción, fecha, enlace (`entryUrl`) y etiquetas como `categories`.
- Contenido: **artículos y notas** (P1). Canal con `<language>es</language>` / `en`, título «Luis González» / «Luis González (English)».
- `<link rel="alternate" type="application/rss+xml">` en el `<head>` apunta al feed del idioma de la página.

### Sitemap y robots

- `@astrojs/sitemap` ya genera `sitemap-index.xml` con todas las páginas construidas (los borradores no se construyen en producción, así que no aparecen). Se excluye la 404.
- Sin `hreflang` en el sitemap (P4): la integración empareja idiomas por ruta y nuestros slugs están traducidos (`usando-mdx` ↔ `using-mdx`); las alternativas correctas ya están en el `<head>` de cada página (003).
- `src/pages/robots.txt.ts` genera `robots.txt` con `Sitemap: https://lgonzalez.dev/sitemap-index.xml` a partir de `site`.

### Vercel Web Analytics y Speed Insights (P2)

- Sin paquetes npm: se usa el fragmento HTML oficial de Vercel (dos scripts del **mismo dominio**, `/_vercel/insights/script.js` y `/_vercel/speed-insights/script.js`). No usan cookies.
- `Analytics.astro` los incluye solo si el build se hace en Vercel (`process.env.VERCEL === '1'`) o con `ENABLE_VERCEL_ANALYTICS=1`; en local no existen esas rutas y darían 404.
- Las e2e construyen con `ENABLE_VERCEL_ANALYTICS=1` y simulan `/_vercel/**`, para comprobar que los scripts están y que no aparece ninguna cookie.
- Tercera excepción de JS en cliente (scripts de Vercel), aprobada en el stack de `AGENTS.md`.

## Archivos afectados

- `src/lib/seo.ts`, `src/lib/feed.ts` — crear
- `src/components/BaseHead.astro` — reescribir sobre `buildMeta`; `src/components/Analytics.astro` — crear
- `src/layouts/Base.astro`, `BlogPost.astro`, `Project.astro` — modificar — datos de metadatos (tipo, fechas, etiquetas, portada, `noindex`)
- `src/pages/404.astro` — modificar — `noindex`
- `src/pages/rss.xml.js` → `src/pages/rss.xml.ts`; `src/pages/en/rss.xml.ts` — crear
- `src/pages/robots.txt.ts` — crear
- `src/assets/og-default.svg`, `src/assets/og-default.png` — crear
- `astro.config.mjs` — modificar — filtro del sitemap (sin 404)
- `playwright.config.ts` — modificar — `ENABLE_VERCEL_ANALYTICS=1` en el build de pruebas
- `src/i18n/ui.ts` — modificar — título de los feeds y `alt` de la imagen por defecto
- `tests/unit/006-seo-analytics/*`, `tests/e2e/006-seo-analytics/*` — crear
- `AGENTS.md`, `.claude/rules/*` — modificar — metadatos, feeds, analítica

## Dependencias nuevas

- Ninguna. `@astrojs/rss`, `@astrojs/sitemap` y `sharp` ya están; la analítica usa el fragmento HTML de Vercel en lugar de `@vercel/analytics` y `@vercel/speed-insights`.

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                                                   |
| ---------------------- | -------- | -------------------------------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Sin dependencias nuevas                                                                |
| 2. Dueño de los datos  | ✅       | Feeds RSS abiertos                                                                     |
| 3. Bilingüe            | ✅       | Metadatos, `og:locale` y RSS por idioma                                                |
| 4. Rendimiento / a11y  | ✅       | Scripts de Vercel `defer`, del mismo dominio; `og:image:alt`                           |
| 5. Privacidad          | ✅       | Analítica sin cookies, comprobado por una prueba                                       |
| 6. Cero JS por defecto | ⚠️       | Excepción justificada: scripts de analítica de Vercel (stack aprobado), solo en Vercel |
| 7. Spec = verdad       | ✅       | —                                                                                      |
| 8. URLs estables       | ✅       | `/rss.xml` se mantiene (español); se añade `/en/rss.xml`                               |
| 9. Todo se prueba      | ✅       | Ver trazabilidad                                                                       |

## Decisiones que necesitan tu visto bueno

- **P1 — Qué entra en el RSS:** artículos **y notas** de cada idioma (los proyectos no).
- **P2 — Analítica sin paquetes npm:** fragmento HTML oficial de Vercel, activo solo en builds de Vercel (producción y previews). Para verla habrá que activar Web Analytics y Speed Insights en el panel de Vercel (spec 008).
- **P3 — Imagen OG por defecto** con el nombre del sitio y el dominio, sin idioma; las portadas se recortan a 1200×627.
- **P4 — Sitemap sin `hreflang`** (las alternativas ya están en cada página).

## Riesgos

- Una URL relativa en `og:image` o canónica rompe las vistas previas → `buildMeta` construye siempre con `new URL(…, site)`; pruebas unitaria y funcional lo comprueban.
- Recortar la portada a 1200×627 puede cortar la parte importante → `fit: 'cover'` centrado; 007 añadirá imágenes generadas por artículo.
- RSS no válido por caracteres especiales en títulos → `@astrojs/rss` escapa el XML; la prueba funcional parsea ambos feeds.
- Los scripts de Vercel en local darían 404 → solo se incluyen en builds de Vercel o de pruebas (con las rutas simuladas).
- Indexar previews de Vercel → Vercel ya responde `X-Robots-Tag: noindex` en los dominios de preview; se comprobará en 008.

## Estrategia de pruebas

- **Unitarias** (`tests/unit/006-seo-analytics/`):
  - `seo.test.ts` — `buildMeta`: título, descripción, canónica absoluta, OG completos (incluidas dimensiones y `alt`), Twitter Card, `article:*` en artículos, `og:locale:alternate` con traducción, imagen por defecto sin portada, `noindex` en la 404.
  - `feed.test.ts` — `feedItems`: excluye borradores en producción, solo el idioma pedido, artículos y notas mezclados por fecha, enlaces y categorías correctos.
  - `analytics.test.ts` — Container API: `Analytics` incluye los dos scripts del mismo dominio cuando está activo y nada cuando no.
  - `og-default.test.ts` — la imagen por defecto mide 1200×627.
- **Funcionales** (`tests/e2e/006-seo-analytics/`, sobre el build con fixtures):
  - `meta.spec.ts` — cada tipo de página (ES y EN): `<title>`, `description`, canónica absoluta, `og:*` y `twitter:*` no vacíos; `og:image` absoluta y descargable con 1200×627; artículo con portada usa su imagen; página sin portada usa la de por defecto; 404 con `noindex`.
  - `feeds.spec.ts` — `/rss.xml` y `/en/rss.xml` son XML válido, con su idioma, sin borradores ni contenido del otro idioma, y enlazados desde el `<head>` de las páginas de su idioma.
  - `sitemap.spec.ts` — el sitemap incluye URLs ES y EN, no incluye borradores ni la 404; `robots.txt` lo referencia.
  - `privacy.spec.ts` — tras recorrer varias páginas (con los scripts de Vercel simulados), `context.cookies()` está vacío; los scripts de analítica están presentes y son del mismo dominio.

### Trazabilidad criterio → prueba

| Criterio de aceptación                        | Prueba unitaria                     | Prueba funcional  |
| --------------------------------------------- | ----------------------------------- | ----------------- |
| Título, descripción y canónica                | `seo.test.ts`                       | `meta.spec.ts`    |
| Open Graph y Twitter Card con imagen 1200×627 | `seo.test.ts`, `og-default.test.ts` | `meta.spec.ts`    |
| Imagen OG por defecto                         | `seo.test.ts`, `og-default.test.ts` | `meta.spec.ts`    |
| RSS por idioma enlazado desde el `<head>`     | `feed.test.ts`                      | `feeds.spec.ts`   |
| Sitemap con ambos idiomas y `robots.txt`      | —                                   | `sitemap.spec.ts` |
| Analítica y Speed Insights sin cookies        | `analytics.test.ts`                 | `privacy.spec.ts` |

## Verificación

- `npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Manual: validar `/rss.xml` y `/en/rss.xml` con un lector de RSS o el validador de W3C (sobre el build local).
- Lighthouse ≥ 95 (SEO incluido) en portada, artículo, proyecto y nota, en ES y EN.
- Tras el deploy (008): activar Web Analytics y Speed Insights en Vercel, ver datos y comprobar que no hay cookies; probar la vista previa en LinkedIn (007).
