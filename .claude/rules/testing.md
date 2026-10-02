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
- Funcionales: se ejecutan contra el **build** (`build` + `preview` en `:4321`, lo arranca Playwright). Navega como un lector; usa selectores accesibles (`getByRole`, `getByText`) antes que CSS.
- Accesibilidad: toda página nueva entra en un análisis de `@axe-core/playwright` (wcag2a/aa, wcag21a/aa) sin violaciones `serious` ni `critical`.
- Todo lo que depende del idioma se prueba en ES (`/…`) y EN (`/en/…`).
- Sin red externa: Giscus, LinkedIn o analítica se verifican por el HTML/URL generados, nunca llamándolos.
- Prohibido `test.skip`, `test.only`, `it.todo` o comentar pruebas para pasar CI. Si una prueba está mal, corrígela y explica por qué en el commit.
- Un bug se corrige con una prueba que lo reproduce primero.
