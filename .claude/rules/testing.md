---
paths:
  - 'tests/**'
  - 'src/**'
  - 'vitest.config.ts'
  - 'playwright.config.ts'
---

# Pruebas

- Cada criterio de aceptación tiene al menos una prueba, registrada en la tabla de trazabilidad de `plan.md`. Si añades un criterio, añade su prueba.
- Pruebas primero: escribe la prueba, **mírala fallar** (`npm run test:unit` / `npm run test:e2e`) y después implementa.
- Ubicación y nombres: `tests/unit/NNN-feature/*.test.ts` (Vitest) y `tests/e2e/NNN-feature/*.spec.ts` (Playwright), en kebab-case. Contenido de prueba en `tests/fixtures/`.
- Unitarias: lógica pura, esquemas de contenido, diccionarios i18n y componentes `.astro` con `experimental_AstroContainer` de `astro/container` (`AstroContainer.create()` + `renderToString`).
- Las e2e construyen el sitio con `CONTENT_DIR=./tests/fixtures/content` y `ENABLE_VERCEL_ANALYTICS=1` (lo pone `playwright.config.ts`; las rutas `/_vercel/**` se simulan con `page.route` donde importan): nunca dependas del contenido real de `src/content/`. Si una prueba necesita contenido, añádelo a los fixtures.
- Funcionales: se ejecutan contra el **build** (`build` + `preview` en `:4322`, lo arranca Playwright siempre desde cero; `:4321` es de `astro dev` y nunca se reutiliza). Navega como un lector; usa selectores accesibles (`getByRole`, `getByText`) antes que CSS.
- Accesibilidad: toda página nueva entra en un análisis de `@axe-core/playwright` (wcag2a/aa, wcag21a/aa) sin violaciones `serious` ni `critical`.
- Todo lo que depende del idioma se prueba en ES (`/…`) y EN (`/en/…`).
- Sin red externa: Chromium no resuelve ningún host salvo `localhost` (`--host-resolver-rules` en `playwright.config.ts`). Los terceros se simulan con `page.route` (Giscus: `tests/e2e/005-comments/giscus-stub.ts`) o se verifican por el HTML/URL generados.
- Prohibido `test.skip`, `test.only`, `it.todo` o comentar pruebas para pasar CI. Si una prueba está mal, corrígela y explica por qué en el commit.
- Un bug se corrige con una prueba que lo reproduce primero.
