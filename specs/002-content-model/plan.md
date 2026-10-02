# Plan 002 — Modelo de contenido

- **Spec:** [spec.md](./spec.md)
- **Estado:** Aprobado

## Enfoque técnico

### Esquemas (`src/content/schemas.ts`)

Los esquemas Zod viven en un módulo propio, separado de `src/content.config.ts`, para poder probarlos con Vitest sin el módulo virtual `astro:content`. Cada esquema es una función que recibe el helper `image()` de Astro (en las pruebas se sustituye por un stub).

- **Campos comunes** (`blog`, `projects`, `notes`):

  | Campo            | Tipo                                    | Notas                                                   |
  | ---------------- | --------------------------------------- | ------------------------------------------------------- |
  | `title`          | texto no vacío                          |                                                         |
  | `description`    | texto no vacío                          | Opcional en `notes`                                     |
  | `pubDate`        | fecha (`z.coerce.date()`)               | Fecha de creación/publicación; una fecha inválida falla |
  | `updatedDate`    | fecha, opcional                         |                                                         |
  | `tags`           | lista de textos                         | Por defecto `[]`; en `notes` obligatoria con al menos 1 |
  | `lang`           | `'es' \| 'en'`                          | Debe coincidir con la carpeta (ver abajo)               |
  | `draft`          | booleano                                | Por defecto `false`                                     |
  | `cover`          | `{ src: image(), alt: texto no vacío }` | Opcional; si existe, `alt` es obligatorio               |
  | `translationKey` | texto no vacío                          | Obligatorio; las traducciones comparten el mismo valor  |

- **`projects`** añade: `stack` (lista, al menos 1), `status` (`'active' | 'completed' | 'archived'`, los textos visibles se traducen en 003/004), `repoUrl` y `demoUrl` (URL, opcionales), `featured` (booleano, por defecto `false`).
- **`notes`**: `title`, `pubDate` y `tags` (≥ 1) obligatorios; `description` y `cover` opcionales.
- `heroImage` de la plantilla se sustituye por `cover` (con `alt`); se actualizan `BlogPost.astro` y `blog/index.astro`.
- Mensajes de error en español dentro de los esquemas (p. ej. «las notas necesitan al menos una etiqueta»), para que el fallo de `npm run check` sea claro.

### Colecciones (`src/content.config.ts`)

- `glob()` de `astro/loaders` con `pattern: '{es,en}/**/*.{md,mdx}'` (proyectos y notas también admiten MDX). El `id` resultante es `es/mi-post` / `en/my-post`.
- Un archivo fuera de `es/` o `en/` no se carga: lo detecta la comprobación de coherencia de idioma (siguiente punto) y una prueba unitaria que recorre `src/content/`.

### Utilidades (`src/lib/content.ts`)

Funciones puras (sin `astro:content`), probadas con Vitest:

- `langFromId(id)` y `slugFromId(id)` — `es/hola-mundo` → `es` / `hola-mundo`.
- `assertLangMatchesFolder(entry)` — lanza un error que nombra el archivo si `data.lang` no coincide con la carpeta.
- `isDraftVisible({ prod, vercelEnv })` — los borradores se ven en `astro dev` y en las previews de Vercel (`VERCEL_ENV=preview`); nunca en un build de producción.
- `filterPublished(entries, env)` — aplica lo anterior.
- `sortByDateDesc(entries)` — lo más reciente primero (desempata por `updatedDate`, luego por `id`).
- `findTranslation(entries, entry)` — mismo `translationKey`, otro idioma; `undefined` si no existe.

Y un envoltorio fino `getPublished(collection)` en `src/lib/collections.ts` que llama a `getCollection`, comprueba idioma, filtra borradores y ordena. Todas las páginas lo usan en vez de `getCollection` directo, así ningún listado, RSS o sitemap puede filtrar un borrador.

### Rutas mínimas (el diseño es de 004; la i18n completa, de 003)

Solo lo necesario para que el contenido sea accesible y se pueda probar:

| Contenido | ES                   | EN                   |
| --------- | -------------------- | -------------------- |
| Artículo  | `/blog/<slug>/`      | `/en/blog/<slug>/`   |
| Nota      | `/notas/<slug>/`     | `/en/notes/<slug>/`  |
| Proyecto  | (sin ruta hasta 004) | (sin ruta hasta 004) |

- `/blog/` y el RSS listan solo artículos en español publicados (el listado por idioma completo es de 003).
- Las notas reutilizan el layout `BlogPost.astro`, que gana una lista opcional de etiquetas.
- `projects` se valida en `check`/`build` pero no se publica hasta 004.

### Contenido de ejemplo

Sin inventar contenido real del autor (textos marcados como ejemplo):

- `blog`: `es/usando-mdx.mdx` + `en/using-mdx.mdx` (el post MDX de la plantilla, `translationKey: using-mdx`); `en/markdown-style-guide.md` con `draft: true` (útil para el diseño en 004 y como borrador de prueba).
- `projects`: `es/lgonzalez-dev.md` + `en/lgonzalez-dev.md` (este blog como proyecto de ejemplo).
- `notes`: `es/primera-nota.md` + `en/first-note.md`.
- Se eliminan `first-post`, `second-post` y `third-post` de la plantilla (lorem ipsum).

### Prueba de frontmatter inválido

`tests/fixtures/invalid-content/` es un mini-proyecto Astro (`astro.config.mjs`, `src/content.config.ts` que importa los esquemas reales de `src/content/schemas.ts`, y una nota sin etiquetas). La prueba funcional ejecuta `astro sync --root tests/fixtures/invalid-content` y comprueba que termina con error y que el mensaje nombra el archivo y el campo `tags`. No toca el contenido real ni el build principal.

## Archivos afectados

- `src/content/schemas.ts` — crear — esquemas Zod que se prueban en aislamiento
- `src/content.config.ts` — modificar — colecciones `blog`, `projects`, `notes` con `glob` por idioma
- `src/lib/content.ts` — crear — utilidades puras de contenido
- `src/lib/collections.ts` — crear — `getPublished()` sobre `astro:content`
- `src/content/{blog,projects,notes}/{es,en}/*` — crear/mover — ejemplos; borrar los posts lorem de la plantilla
- `src/pages/blog/[...slug].astro`, `src/pages/blog/index.astro`, `src/pages/rss.xml.js` — modificar — `getPublished`, `slug` sin idioma, `cover`
- `src/pages/en/blog/[...slug].astro` — crear — artículos en inglés
- `src/pages/notas/[...slug].astro`, `src/pages/en/notes/[...slug].astro` — crear — notas
- `src/layouts/BlogPost.astro` — modificar — `cover` en vez de `heroImage`, etiquetas opcionales
- `tests/unit/002-content-model/*.test.ts`, `tests/e2e/002-content-model/*.spec.ts` — crear
- `tests/fixtures/invalid-content/**` — crear — mini-proyecto con frontmatter inválido
- `tests/e2e/001-setup/smoke.spec.ts`, `a11y.spec.ts` — modificar — `/blog/using-mdx/` pasa a `/blog/usando-mdx/` (el post de la plantilla se mueve a `es/`)
- `eslint.config.js` — modificar — ignorar `**/.astro` (lo genera el fixture)
- `AGENTS.md` — modificar — añadir `src/lib/` y `tests/fixtures/` a la estructura; formato del frontmatter
- `.claude/rules/content.md` — modificar — campos obligatorios por colección

## Dependencias nuevas

- Ninguna (Zod viene con Astro como `astro/zod`; `glob` es el loader de Astro).

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                                   |
| ---------------------- | -------- | ---------------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Content Collections nativas, sin CMS ni base de datos                  |
| 2. Dueño de los datos  | ✅       | Markdown/MDX en el repo                                                |
| 3. Bilingüe            | ✅       | Carpetas `es/`/`en/`, `lang` validado, `translationKey` obligatorio    |
| 4. Rendimiento / a11y  | ✅       | `cover.alt` obligatorio; axe en las páginas nuevas                     |
| 5. Privacidad          | ✅       | Sin cambios                                                            |
| 6. Cero JS por defecto | ✅       | Solo HTML generado en build                                            |
| 7. Spec = verdad       | ✅       | Rutas y campos documentados aquí y en `AGENTS.md`                      |
| 8. URLs estables       | ✅       | Aún no hay nada publicado; las rutas elegidas son las definitivas (P1) |
| 9. Todo se prueba      | ✅       | Ver trazabilidad                                                       |

## Decisiones (aprobadas con el plan)

- **P1 — URLs de notas:** `/notas/<slug>/` en español y `/en/notes/<slug>/` en inglés (segmento traducido).
- **P2 — `translationKey` obligatorio** en todo el contenido, aunque no tenga traducción (una línea más en el frontmatter, pero el selector de idioma de 003 queda trivial).
- **P3 — Borradores visibles en previews de Vercel** (`VERCEL_ENV=preview`), como dice la spec; en local, solo con `npm run dev`.

## Riesgos

- El `glob` ignora en silencio archivos fuera de `es/`/`en/` → prueba unitaria que recorre `src/content/` y falla si encuentra contenido fuera de esas carpetas.
- `lang` duplicado con la carpeta puede desincronizarse → `assertLangMatchesFolder` en `getPublished` hace fallar el build con el nombre del archivo.
- `astro sync` sobre el fixture tarda unos segundos y genera `.astro/` dentro de `tests/fixtures/` → ya ignorado por `.gitignore` (`.astro/` aplica a cualquier nivel); se añade `**/.astro` a ESLint.
- La API de Content Collections de Astro 7 puede diferir de versiones anteriores → consultar la guía oficial antes de implementar.
- Mover el post MDX cambia la URL usada en las pruebas de 001 → se actualizan esas pruebas (no se borran) y se explica en el commit.

## Estrategia de pruebas

- **Unitarias:**
  - `schemas.test.ts` — por colección: acepta un frontmatter válido; rechaza campos obligatorios ausentes, fecha inválida, `lang` fuera de `es|en`, `cover` sin `alt`, `status` desconocido; `notes` rechaza sin título, sin fecha, sin `tags` o con `tags: []`, y acepta sin `description` ni `cover`.
  - `content-utils.test.ts` — `langFromId`/`slugFromId`, `assertLangMatchesFolder`, `isDraftVisible` (dev, preview, producción), `filterPublished`, `sortByDateDesc`, `findTranslation` (pareja correcta y `undefined`).
  - `content-tree.test.ts` — recorre `src/content/`: todo archivo está bajo `{blog,projects,notes}/{es,en}/` y cada colección tiene al menos un ejemplo en ES y otro en EN.
- **Funcionales** (Chromium escritorio, sobre el build):
  - `content.spec.ts` — artículo ES y EN responden 200 con su `h1`; nota ES y EN muestran título, `<time datetime>` y etiquetas; el borrador `/en/blog/markdown-style-guide/` da 404 y no aparece en `/blog/` ni en `rss.xml`; axe sin violaciones graves en una nota.
  - `invalid-content.spec.ts` — `astro sync` sobre el fixture falla y el mensaje nombra el archivo y el campo.

### Trazabilidad criterio → prueba

| Criterio de aceptación                       | Prueba unitaria                                    | Prueba funcional                                      |
| -------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Colecciones con esquema validado             | `tests/unit/002-content-model/schemas.test.ts`     | CI (`npm run check`)                                  |
| Campos comunes                               | `schemas.test.ts`                                  | —                                                     |
| Campos de `projects`                         | `schemas.test.ts`                                  | —                                                     |
| `notes`: título, fecha y etiquetas (≥ 1)     | `schemas.test.ts`                                  | `tests/e2e/002-content-model/content.spec.ts`         |
| Contenido organizado por idioma              | `content-utils.test.ts`, `content-tree.test.ts`    | `content.spec.ts` (URLs ES y EN)                      |
| Frontmatter inválido falla con mensaje claro | `schemas.test.ts` (mensajes)                       | `tests/e2e/002-content-model/invalid-content.spec.ts` |
| `draft: true` fuera de producción            | `content-utils.test.ts` (`isDraftVisible`, filtro) | `content.spec.ts` (404, ausente en listado y RSS)     |
| Ejemplo de cada colección en ES y EN         | `content-tree.test.ts`                             | `content.spec.ts` (artículos y notas)                 |
| Ordenación por fecha                         | `content-utils.test.ts`                            | —                                                     |
| Búsqueda de traducciones                     | `content-utils.test.ts`                            | —                                                     |

## Verificación

- `npm ci && npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Manual: romper a propósito el frontmatter de un ejemplo y comprobar que `npm run check` lo señala con archivo y campo; revisar que `npm run dev` muestra el borrador y `npm run build` no.
- Lighthouse ≥ 95 en `/blog/usando-mdx/` y `/notas/primera-nota/`.
