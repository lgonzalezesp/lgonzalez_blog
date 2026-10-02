# Plan 001 — Setup del proyecto

- **Spec:** [spec.md](./spec.md)
- **Estado:** Aprobado

## Enfoque técnico

- Partir de la plantilla oficial `blog` de **Astro 7** (`npm create astro -- --template blog`), copiada a la raíz del repo. Se conserva nuestro `AGENTS.md` (la plantilla trae uno propio; sus notas útiles se integran en el nuestro).
- `site: 'https://lgonzalez.dev'` en `astro.config.mjs`.
- Integraciones: MDX y sitemap (ya vienen en la plantilla) + **Tailwind CSS 4** mediante su plugin de Vite (`@tailwindcss/vite`), que es la forma recomendada por Astro.
- TypeScript estricto (`astro/tsconfigs/strict`) y `astro check` como comprobación de tipos.
- **Calidad:** ESLint (flat config) con `eslint-plugin-astro` y `typescript-eslint`; Prettier con `prettier-plugin-astro`.
- **Pruebas:**
  - Vitest configurado con `getViteConfig` de Astro, para que entienda archivos `.astro` y los módulos virtuales; componentes renderizados con la Astro Container API.
  - Playwright (solo Chromium) sobre el build: su `webServer` hace `build` + `preview`. Accesibilidad con `@axe-core/playwright`.
- Página `404.astro` mínima (la plantilla no la trae y la spec la prueba).
- **npm:** `package-lock.json` commiteado, `.nvmrc` = `24` (LTS), `engines` alineado con Astro (`node >=22.12.0`).
- **CI:** GitHub Actions en PR y push a `develop` y `main`: `npm ci` → `check` → `lint` → `format:check` → `test:unit` → `test:e2e`.
- **Gitflow en GitHub:** `develop` como rama por defecto; protección de `main` y `develop` exigiendo PR y el check de CI en verde.

## Archivos afectados

- `package.json`, `package-lock.json`, `.nvmrc` — crear
- `astro.config.mjs`, `tsconfig.json`, `src/**`, `public/**` — crear (desde plantilla) y ajustar
- `src/pages/404.astro` — crear
- `src/styles/global.css` — modificar (importar Tailwind)
- `src/consts.ts` — modificar (título y descripción del sitio)
- `eslint.config.js`, `.prettierrc.json`, `.prettierignore` — crear
- `vitest.config.ts`, `playwright.config.ts` — crear
- `tests/unit/001-setup/*.test.ts`, `tests/e2e/001-setup/*.spec.ts` — crear
- `.github/workflows/ci.yml` — crear
- `.gitignore` — fusionar con el de la plantilla
- `AGENTS.md` — actualizar estructura y notas de Astro

## Dependencias nuevas

| Paquete                                                                       | Motivo                                                     |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `astro`, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `sharp`          | Plantilla oficial (framework, MDX, sitemap, RSS, imágenes) |
| `tailwindcss`, `@tailwindcss/vite`                                            | Estilos (stack aprobado)                                   |
| `@astrojs/check`, `typescript`                                                | `npm run check`                                            |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`, `globals` | Lint                                                       |
| `prettier`, `prettier-plugin-astro`                                           | Formato                                                    |
| `vitest`                                                                      | Pruebas unitarias                                          |
| `@playwright/test`, `@axe-core/playwright`                                    | Pruebas funcionales y de accesibilidad                     |

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                      |
| ---------------------- | -------- | ----------------------------------------- |
| 1. Simplicidad         | ✅       | Sitio estático, sin adaptador de servidor |
| 2. Dueño de los datos  | ✅       | Contenido en Markdown en el repo          |
| 3. Bilingüe            | ➖       | No aplica todavía (spec 003)              |
| 4. Rendimiento / a11y  | ✅       | axe-core desde el primer día              |
| 5. Privacidad          | ✅       | Sin scripts de terceros                   |
| 6. Cero JS por defecto | ✅       | La plantilla no envía JS de cliente       |
| 7. Spec = verdad       | ✅       | `AGENTS.md` actualizado con la realidad   |
| 8. URLs estables       | ✅       | Aún no hay URLs publicadas                |
| 9. Todo se prueba      | ✅       | Vitest + Playwright + CI                  |

## Riesgos

- Tailwind (preflight) cambia el aspecto de la plantilla → aceptable; el diseño se aborda en 004.
- **Node local 23 (no LTS):** Vitest 5, ESLint 10, `@eslint/js` 10.0.1 y eslint-plugin-astro 3 excluyen Node 23 en `engines`, y npm instala en silencio versiones antiguas (p. ej. Vitest 3 con una vulnerabilidad). → Versiones fijadas explícitamente; `engines` = `^22.12.0 || ^24.0.0 || >=26.0.0`; CI usa Node 24 desde `.nvmrc`. **Recomendado: Node 24 en local.**
- **`astro preview` se lanza en segundo plano** cuando detecta un agente de IA, y Playwright lo interpreta como que el servidor terminó. → `--ignore-lock` en el `webServer` de Playwright (documentado en `AGENTS.md`).
- La protección de ramas exige que el nombre del check de CI coincida → se configura después del primer run de CI.

## Estrategia de pruebas

- **Unitarias:** `FormattedDate.astro` renderizado con Container API (prueba de humo de Vitest + Astro); `astro.config.mjs` expone `site`.
- **Funcionales:** sobre `astro preview` del build, en Chromium escritorio.

### Trazabilidad criterio → prueba

| Criterio de aceptación             | Prueba unitaria                          | Prueba funcional                                                                     |
| ---------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Plantilla Astro arranca            | —                                        | `tests/e2e/001-setup/smoke.spec.ts` (portada 200 + título)                           |
| MDX, sitemap, Tailwind funcionando | —                                        | `smoke.spec.ts` (post MDX 200, `sitemap-index.xml` 200, CSS con utilidades Tailwind) |
| TS estricto, `check` pasa          | —                                        | CI (`npm run check`)                                                                 |
| Scripts definidos                  | —                                        | CI los ejecuta todos                                                                 |
| `site` = dominio definitivo        | `tests/unit/001-setup/config.test.ts`    | —                                                                                    |
| Repo y `.gitignore`                | —                                        | Revisión manual                                                                      |
| `AGENTS.md` refleja la realidad    | —                                        | Revisión manual                                                                      |
| Reglas `.claude/rules/`            | —                                        | Revisión manual (`/memory` las lista)                                                |
| Infraestructura de pruebas         | `tests/unit/001-setup/container.test.ts` | `smoke.spec.ts`                                                                      |
| 404                                | —                                        | `smoke.spec.ts` (404 + página propia)                                                |
| Accesibilidad portada              | —                                        | `tests/e2e/001-setup/a11y.spec.ts`                                                   |
| npm / `.nvmrc` / `engines`         | `config.test.ts`                         | —                                                                                    |
| Gitflow + ramas protegidas         | —                                        | Verificación con `gh api`                                                            |
| CI bloquea merge                   | —                                        | PR de esta feature                                                                   |

## Verificación

`npm ci && npm run check && npm run lint && npm run format:check && npm test` en local; después, la PR `feature/001-setup → develop` debe pasar CI.
