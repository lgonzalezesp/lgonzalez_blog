# Tareas 002 — Modelo de contenido

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Esquemas

- [x] T1 — Leer la guía de [Content Collections](https://docs.astro.build/en/guides/content-collections/) de Astro 7 (`glob`, `image()`, `astro/zod`) y ajustar el plan si algo difiere
- [x] T2 — Prueba unitaria: `schemas.test.ts` — frontmatter válido de `blog`, `projects` y `notes`; rechazos (campos obligatorios, fecha inválida, `lang` fuera de `es|en`, `cover` sin `alt`, `status` desconocido); `notes` sin título, sin fecha, sin `tags` o con `tags: []`; `notes` sin `description` ni `cover` es válida → ver fallar
- [x] T3 — Implementación: `src/content/schemas.ts` (campos comunes, `projects`, `notes`, mensajes de error en español) → ver pasar

## Utilidades

- [x] T4 — Prueba unitaria: `content-utils.test.ts` — `langFromId`, `slugFromId`, `assertLangMatchesFolder`, `isDraftVisible` (dev / preview de Vercel / producción), `filterPublished`, `sortByDateDesc`, `findTranslation` (pareja y `undefined`) → ver fallar
- [x] T5 — Implementación: `src/lib/content.ts` → ver pasar
- [x] T6 — Implementación: `src/lib/collections.ts` (`getPublished()`: comprueba idioma, filtra borradores, ordena)

## Colecciones y contenido de ejemplo

- [x] T7 — Prueba unitaria: `content-tree.test.ts` — todo archivo bajo `src/content/{blog,projects,notes}/{es,en}/` y al menos un ejemplo por colección e idioma → ver fallar
- [x] T8 — Implementación: `src/content.config.ts` con `blog`, `projects` y `notes` (`glob` `{es,en}/**/*.{md,mdx}`)
- [x] T9 — Contenido: mover `using-mdx.mdx` a `blog/es/usando-mdx.mdx` + `blog/en/using-mdx.mdx`; `markdown-style-guide.md` a `blog/en/` con `draft: true`; borrar `first-post`, `second-post`, `third-post`; `heroImage` → `cover` con `alt`
- [x] T10 — Contenido: `projects/{es,en}/lgonzalez-dev.md` y `notes/es/primera-nota.md` + `notes/en/first-note.md` → `content-tree.test.ts` pasa; `npm run check` en verde

## Rutas y layout

- [x] T11 — Prueba funcional: `content.spec.ts` — artículo ES (`/blog/usando-mdx/`) y EN (`/en/blog/using-mdx/`) con su `h1`; nota ES (`/notas/primera-nota/`) y EN (`/en/notes/first-note/`) con título, `<time datetime>` y etiquetas; borrador `/en/blog/markdown-style-guide/` → 404 y ausente de `/blog/` y `/rss.xml`; axe en una nota → ver fallar
- [x] T12 — Implementación: `BlogPost.astro` (`cover` en vez de `heroImage`, lista opcional de etiquetas)
- [x] T13 — Implementación: `blog/[...slug].astro`, `blog/index.astro` y `rss.xml.js` con `getPublished` y `slugFromId` (solo ES)
- [x] T14 — Implementación: `en/blog/[...slug].astro`, `notas/[...slug].astro`, `en/notes/[...slug].astro` → `content.spec.ts` pasa
- [x] T15 — Actualizar `tests/e2e/001-setup/smoke.spec.ts` y `a11y.spec.ts`: `/blog/using-mdx/` → `/blog/usando-mdx/` (el post se movió a `es/`)
- [x] T15b — Bug: las e2e reutilizaban `astro dev` en `:4321`. Prueba de regresión en `smoke.spec.ts` (vista fallar) y `playwright.config.ts` en `:4322` sin reutilizar servidores

## Frontmatter inválido

- [x] T16 — Prueba funcional: `invalid-content.spec.ts` — `astro sync --root tests/fixtures/invalid-content` falla y el mensaje nombra el archivo y el campo `tags` → ver fallar
- [x] T17 — Fixture: `tests/fixtures/invalid-content/` (`astro.config.mjs`, `src/content.config.ts` con los esquemas reales, nota sin etiquetas); `**/.astro` en `eslint.config.js` → ver pasar

## Documentación

- [x] T18 — `AGENTS.md` (estructura: `src/lib/`, `tests/fixtures/`, rutas de notas; frontmatter por colección) y `.claude/rules/content.md` (campos obligatorios)

## Cierre

- [x] `npm run build` y `npm run check` en verde
- [x] `npm test` (unitarias + funcionales) en verde, en local (53 + 18) y en CI
- [x] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [x] Criterios de aceptación de la spec verificados (ES y EN)
- [x] Manual: frontmatter roto señalado por `npm run check`; borrador visible en `npm run dev` y ausente en `npm run build`
- [x] Lighthouse ≥ 95 en `/blog/usando-mdx/`, `/notas/primera-nota/` y `/en/notes/first-note/` (100 en las cuatro categorías)
- [x] `specs/README.md` actualizado
