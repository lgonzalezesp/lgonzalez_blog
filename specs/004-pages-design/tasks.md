# Tareas 004 — Páginas y diseño

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Contenido de prueba

- [ ] T1 — Prueba funcional: `pages.spec.ts` incluye una comprobación de que el build de pruebas usa los fixtures (artículo que solo existe en `tests/fixtures/content/`) → ver fallar
- [ ] T2 — Implementación: `CONTENT_DIR` en `src/content.config.ts` y `env` del `webServer` en `playwright.config.ts`; `tests/fixtures/content/` con los ejemplos de 002/003 (mismos slugs), 12 artículos ES, código y encabezados, notas, proyectos y etiquetas compartidas → pruebas de 001–003 siguen en verde
- [ ] T3 — `content-tree.test.ts`: estructura de ambos árboles y ejemplos por colección/idioma en los fixtures; actualizar `specs/002-content-model/spec.md`

## Lógica pura

- [ ] T4 — Pruebas unitarias: `reading-time.test.ts`, `toc.test.ts`, `pagination.test.ts`, `tags.test.ts`, `translate-params.test.ts` → ver fallar
- [ ] T5 — Implementación: `src/lib/reading-time.ts`, `toc.ts`, `pagination.ts`, `tags.ts`; parámetros en `useTranslations` → ver pasar

## Diseño base y tema

- [ ] T6 — Implementación: `global.css` reescrito con Tailwind 4 (variables de tema claro/oscuro, `@custom-variant dark`, `.prose`, foco visible, código); `Base.astro` con `SkipLink` y script inline de tema; temas de Shiki en `astro.config.mjs`
- [ ] T7 — Prueba funcional: `theme.spec.ts` y `code.spec.ts` → ver fallar
- [ ] T8 — Implementación: `ThemeToggle.astro` → `theme.spec.ts` y `code.spec.ts` pasan

## Componentes

- [ ] T9 — Prueba unitaria: `cards.test.ts` (`PostCard`, `ProjectCard`, `ThemeToggle`, `Pagination` con la Container API) → ver fallar
- [ ] T10 — Implementación: `PostCard`, `ProjectCard`, `NoteCard`, `TagList`, `Pagination`, `ReadingTime`, `TableOfContents`; `Header` (secciones nuevas, toggle, varias líneas en móvil) y `Footer` (GitHub y RSS) → ver pasar

## Páginas

- [ ] T11 — Pruebas funcionales: `pages.spec.ts` (todas las páginas 200 en ES y EN), `navigation.spec.ts` y `pagination-tags.spec.ts` → ver fallar
- [ ] T12 — Rutas en `src/i18n/routes.ts` (proyectos, notas, etiquetas, paginación) con sus pruebas en `routes.test.ts`
- [ ] T13 — Blog paginado (`/blog/`, `/blog/pagina/N/` y EN) y artículo con tiempo de lectura y tabla de contenidos
- [ ] T14 — Proyectos: grid y detalle (`Project.astro`) en ES y EN
- [ ] T15 — Notas: listado en ES y EN
- [ ] T16 — Etiquetas: índice y página por etiqueta en ES y EN
- [ ] T17 — Inicio (últimos artículos, proyectos destacados, últimas notas), «Sobre mí» desde la colección `pages` (`pageSchema` con prueba en `schemas.test.ts`) y 404 con el nuevo diseño → pruebas de T11 pasan

## Calidad transversal

- [ ] T18 — Pruebas funcionales: `responsive.spec.ts`, `keyboard.spec.ts`, `images.spec.ts` y `a11y.spec.ts` (cada tipo de página, claro y oscuro) → corregir lo que falle
- [ ] T19 — Comprobar que las pruebas de 001–003 siguen pasando; ajustar solo lo que cambió a propósito, explicándolo en el commit

## Documentación

- [ ] T20 — `spec.md` (preguntas abiertas resueltas), `AGENTS.md` (estructura, rutas, `CONTENT_DIR`, fixtures, excepción de JS del tema) y `.claude/rules/` (testing, content, astro-ui)

## Cierre

- [ ] `npm run build` y `npm run check` en verde (con el contenido real)
- [ ] `npm test` (unitarias + funcionales) en verde, en local y en CI
- [ ] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [ ] Criterios de aceptación de la spec verificados (ES y EN)
- [ ] Manual: recorrido en 320 px y escritorio, claro y oscuro, solo con teclado
- [ ] Lighthouse ≥ 95 en una página de cada tipo, en ES y EN
- [ ] `specs/README.md` actualizado
