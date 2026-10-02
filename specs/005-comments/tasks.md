# Tareas 005 — Comentarios (Giscus)

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Requisitos previos (manuales)

- [x] T1 — Activar Discussions en el repo (`gh repo edit --enable-discussions`, 2026-10-02)
- [x] T2 — (Autor) Crear la categoría «Comments» de tipo Announcement e instalar la app Giscus en el repo
- [x] T3 — Obtener `categoryId` con `gh api graphql` (`DIC_kwDOU4DNYM4DG4mz`) y comprobar que la app Giscus tiene acceso al repo (la API de giscus.app lista sus categorías)

## Configuración y lógica

- [x] T4 — Prueba unitaria: `giscus.test.ts` (atributos ES/EN y claro/oscuro, `pathname` + `strict`, ids `R_…`/`DIC_…`, mensaje de tema) → ver fallar
- [x] T5 — Implementación: `GISCUS` en `src/consts.ts` y `src/lib/giscus.ts` → ver pasar

## Componente

- [x] T6 — Prueba unitaria: `comments.test.ts` con la Container API (sección, título, `noscript`, `data-giscus`) → ver fallar
- [x] T7 — Implementación: `Comments.astro` (carga con `IntersectionObserver`, tema inicial, sincronización por `postMessage`) y textos en `src/i18n/ui.ts` → ver pasar
- [x] T8 — Implementación: `ThemeToggle.astro` emite `themechange`

## Páginas

- [x] T9 — Pruebas funcionales: `comments.spec.ts`, `lazy.spec.ts`, `lang-theme.spec.ts` y `a11y.spec.ts` con `giscus.app` interceptado (`client.js` e iframe simulados) → ver fallar
- [x] T10 — Implementación: comentarios en `BlogPost.astro` (solo artículos) y `Project.astro`; páginas de artículos y proyectos en ES y EN → pruebas de T9 pasan
- [x] T11 — Comprobar que las pruebas de 001–004 siguen pasando (ninguna debe llamar a giscus.app): Chromium de las e2e ya no resuelve hosts externos

## Documentación

- [x] T12 — `spec.md` (pregunta abierta resuelta), `AGENTS.md` y `.claude/rules/astro-ui.md` (excepción de JS de comentarios) y `.claude/rules/testing.md` (interceptar giscus.app)

## Cierre

- [x] `npm run build` y `npm run check` en verde
- [x] `npm test` (unitarias + funcionales) en verde, en local (151 + 231) y en CI
- [x] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [x] Criterios de aceptación de la spec verificados (ES y EN)
- [x] Manual en local: Giscus real carga al hacer scroll, en ES y EN, y cambia de tema (el 404 en consola es la API de Giscus cuando el hilo aún no existe; se crea con el primer comentario)
- [x] Lighthouse ≥ 95 en un artículo y un proyecto (ES y EN), con Giscus real: 100 en las cuatro categorías
- [x] `specs/README.md` actualizado
- [ ] Pendiente para después del deploy (008): comentario de prueba visible en Discussions → Comments
