# Tareas 005 — Comentarios (Giscus)

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Requisitos previos (manuales)

- [ ] T1 — Activar Discussions en el repo
- [ ] T2 — (Autor) Crear la categoría «Comments» de tipo Announcement e instalar la app Giscus en el repo
- [ ] T3 — Obtener `categoryId` con `gh api graphql` y comprobar que la app Giscus tiene acceso al repo

## Configuración y lógica

- [ ] T4 — Prueba unitaria: `giscus.test.ts` (atributos ES/EN y claro/oscuro, `pathname` + `strict`, ids `R_…`/`DIC_…`, mensaje de tema) → ver fallar
- [ ] T5 — Implementación: `GISCUS` en `src/consts.ts` y `src/lib/giscus.ts` → ver pasar

## Componente

- [ ] T6 — Prueba unitaria: `comments.test.ts` con la Container API (sección, título, `noscript`, `data-giscus`) → ver fallar
- [ ] T7 — Implementación: `Comments.astro` (carga con `IntersectionObserver`, tema inicial, sincronización por `postMessage`) y textos en `src/i18n/ui.ts` → ver pasar
- [ ] T8 — Implementación: `ThemeToggle.astro` emite `themechange`

## Páginas

- [ ] T9 — Pruebas funcionales: `comments.spec.ts`, `lazy.spec.ts`, `lang-theme.spec.ts` y `a11y.spec.ts` con `giscus.app` interceptado (`client.js` e iframe simulados) → ver fallar
- [ ] T10 — Implementación: comentarios en `BlogPost.astro` (solo artículos) y `Project.astro`; páginas de artículos y proyectos en ES y EN → pruebas de T9 pasan
- [ ] T11 — Comprobar que las pruebas de 001–004 siguen pasando (ninguna debe llamar a giscus.app)

## Documentación

- [ ] T12 — `spec.md` (pregunta abierta resuelta), `AGENTS.md` y `.claude/rules/astro-ui.md` (excepción de JS de comentarios) y `.claude/rules/testing.md` (interceptar giscus.app)

## Cierre

- [ ] `npm run build` y `npm run check` en verde
- [ ] `npm test` (unitarias + funcionales) en verde, en local y en CI
- [ ] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [ ] Criterios de aceptación de la spec verificados (ES y EN)
- [ ] Manual en local: Giscus real carga al hacer scroll, en ES y EN, y cambia de tema
- [ ] Lighthouse ≥ 95 en un artículo y un proyecto (ES y EN)
- [ ] `specs/README.md` actualizado
- [ ] Pendiente para después del deploy (008): comentario de prueba visible en Discussions → Comments
