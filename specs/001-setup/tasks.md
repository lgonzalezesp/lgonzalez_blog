# Tareas 001 — Setup del proyecto

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

- [x] T1 — Copiar la plantilla `blog` de Astro 7 al repo (sin su `AGENTS.md`), fusionar `.gitignore`, `npm install`
- [x] T2 — `package.json`: nombre, `engines`, `.nvmrc` = 24
- [x] T3 — Instalar Vitest y Playwright; `vitest.config.ts` y `playwright.config.ts`; scripts `test:unit`, `test:e2e`, `test`
- [x] T4 — Prueba unitaria: `config.test.ts` (`site` = `https://lgonzalez.dev`, `engines` y `.nvmrc`) → ver fallar
- [x] T5 — Implementación: `site` en `astro.config.mjs`, `SITE_TITLE`/`SITE_DESCRIPTION` → ver pasar
- [x] T6 — Prueba unitaria: `container.test.ts` (renderiza `FormattedDate` con Container API)
- [x] T7 — Prueba funcional: `smoke.spec.ts` (portada, post MDX, sitemap, Tailwind, 404) → ver fallar
- [x] T8 — Implementación: Tailwind 4 con `@tailwindcss/vite`, `404.astro` → ver pasar
- [x] T9 — Prueba funcional: `a11y.spec.ts` (axe-core en portada) y corregir lo que falle
- [x] T10 — `@astrojs/check` + `typescript`; script `check` en verde
- [x] T11 — ESLint + Prettier; scripts `lint`, `format`, `format:check` en verde
- [x] T12 — CI en `.github/workflows/ci.yml`
- [x] T13 — Actualizar `AGENTS.md` (estructura, comandos, notas de Astro)
- [ ] T14 — Push, PR `feature/001-setup → develop`, CI en verde
- [ ] T15 — GitHub: `develop` por defecto y protección de `main` y `develop` (PR + CI obligatorio)

## Cierre

- [x] `npm run build` y `npm run check` en verde
- [ ] `npm test` (unitarias + funcionales) en verde, en local y en CI
- [x] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [x] Lighthouse ≥ 95 en páginas afectadas (`/`, `/blog/`, `/blog/using-mdx/`: 97–100)
- [ ] `specs/README.md` actualizado
