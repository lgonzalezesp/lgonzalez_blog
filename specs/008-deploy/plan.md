# Plan 008 — Despliegue en Vercel

- **Spec:** [spec.md](./spec.md)
- **Estado:** Aprobado

## Situación (2026-10-02)

- `lgonzalez.dev` **comprado** por el autor en Vercel Domains el 2026-10-02 (registrador Name.com, DNS `ns1/ns2.vercel-dns.com`, bloqueo de transferencia activo).
- El repo aún no está conectado a Vercel; no hay CLI de Vercel instalada (no hace falta: Vercel despliega desde GitHub).
- `main` no tiene nada de 001–007: todo está en `develop`. La primera publicación será la release `0.1.0`.

## Enfoque técnico

### Configuración en el repo (`vercel.json`)

- `framework: "astro"`, `installCommand: "npm ci"`, `buildCommand: "npm run build"`, `outputDirectory: "dist"`.
- `trailingSlash: true`: `/blog` redirige a `/blog/`, igual que las canónicas.
- Node: Vercel lee `engines` de `package.json`; en el proyecto se fija **Node 24** (como `.nvmrc` y CI).
- Rama de producción: `main`. Vercel despliega como preview cualquier otra rama y cada PR; `develop` tiene URL estable automática (`<proyecto>-git-develop-<equipo>.vercel.app`).

### Borradores según el entorno de Vercel

- Ya funciona desde 002 (`isDraftVisible` con `VERCEL_ENV=preview`). Para que la lectura del entorno quede probada, `currentBuildEnv(env, prod)` (`src/lib/content.ts`) centraliza `{ prod, vercelEnv }` y lo usan `getPublished()` y el RSS; prueba unitaria: `VERCEL_ENV=preview` → borradores visibles, `production` → ocultos, sin Vercel en `npm run build` → ocultos, `astro dev` → visibles.

### Producción solo con CI en verde (P3)

- `main` y `develop` ya exigen el check `CI` en verde y la rama al día (_strict_) antes de mergear: el commit que llega a `main` es exactamente el que pasó CI. Además, CI se vuelve a ejecutar en el push a `main`.
- Si el build de Vercel falla, Vercel **no promociona** ese deploy: sigue sirviendo el último correcto (comportamiento por defecto; se comprueba una vez a mano con una preview rota a propósito).

### Pruebas de humo contra los despliegues (`tests/smoke/`)

- Configuración aparte, `playwright.smoke.config.ts`: sin `webServer` ni bloqueo de red, con `baseURL = SMOKE_BASE_URL` y la cabecera `x-vercel-protection-bypass` si existe el secreto.
- `deploy.spec.ts`: portada 200, `/en/` 200 con `lang="en"`, el primer artículo del listado 200 con `h1`, una URL inexistente → 404 propia; en previews, la página de la preview no tiene `noindex` roto (las previews las marca Vercel con `X-Robots-Tag: noindex`).
- `domain.spec.ts` (solo contra producción): `https://lgonzalez.dev` 200; `http://lgonzalez.dev` → `https://lgonzalez.dev/` (301/308); `https://www.lgonzalez.dev` → `https://lgonzalez.dev/`; HSTS presente.
- Script `npm run test:smoke`.
- Workflow `.github/workflows/smoke.yml`, disparado por `deployment_status` (Vercel informa a GitHub de cada deploy): si el deploy terminó bien, ejecuta las pruebas de humo contra su URL (`target_url`); en producción, además, `domain.spec.ts`. El resultado aparece como check en el commit/PR. No es un check obligatorio para mergear (dependería de que Vercel termine).

### Protección de las previews (P2)

- Se mantiene la **Deployment Protection** de Vercel en las previews (solo tú las ves con tu sesión de Vercel; los borradores no quedan públicos).
- Para que CI pueda probarlas: secreto **Protection Bypass for Automation** de Vercel guardado en GitHub como `VERCEL_AUTOMATION_BYPASS_SECRET`.

### Release `0.1.0` (Gitflow)

1. `release/0.1.0` desde `develop`: `version` = `0.1.0` en `package.json`, `CHANGELOG.md` (001–008).
2. PR `release/0.1.0 → main` (merge commit) con CI en verde → tag `v0.1.0` en ese merge → Vercel publica.
3. PR `release/0.1.0 → develop` (merge commit) para devolver versión y changelog.
4. Se documenta el proceso de release y hotfix en `AGENTS.md`.

### Pasos manuales del autor (no se pueden hacer desde el repo)

1. **Comprar `lgonzalez.dev`** (P1: recomendado en Vercel Domains; renovación automática, privacidad WHOIS, bloqueo de transferencia).
2. **Importar** `lgonzalezesp/lgonzalez_blog` en Vercel (cuenta Hobby): rama de producción `main`, Node 24.
3. **Dominio:** añadir `lgonzalez.dev` y `www.lgonzalez.dev` (este último con redirección 308 al raíz). HTTPS es automático (y `.dev` exige HTTPS por HSTS preload).
4. **Activar** Web Analytics y Speed Insights.
5. **Crear** el secreto de bypass de protección y guardarlo en GitHub (`gh secret set VERCEL_AUTOMATION_BYPASS_SECRET`).

## Archivos afectados

- `vercel.json` — crear
- `src/lib/content.ts`, `src/lib/collections.ts`, `src/lib/feed-response.ts` — modificar — `currentBuildEnv`
- `playwright.smoke.config.ts`, `tests/smoke/deploy.spec.ts`, `tests/smoke/domain.spec.ts` — crear
- `.github/workflows/smoke.yml` — crear
- `package.json` — modificar — script `test:smoke`; `version` en la release
- `CHANGELOG.md` — crear (en la release)
- `tests/unit/008-deploy/*` — crear
- `AGENTS.md`, `.claude/rules/git-workflow.md`, `.claude/rules/tooling.md` — modificar — despliegue, release, smoke
- `specs/README.md` — modificar — tareas manuales y estado final

## Dependencias nuevas

- Ninguna (Playwright ya está; Vercel despliega desde GitHub sin CLI).

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                                |
| ---------------------- | -------- | ------------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Salida estática, sin funciones ni adaptador de servidor             |
| 2. Dueño de los datos  | ✅       | El contenido sigue en Git; Vercel solo sirve el build               |
| 3. Bilingüe            | ✅       | Las pruebas de humo cubren ES y EN                                  |
| 4. Rendimiento / a11y  | ✅       | Lighthouse en producción tras el deploy                             |
| 5. Privacidad          | ✅       | Previews protegidas; analítica sin cookies (006)                    |
| 6. Cero JS por defecto | ✅       | Sin cambios                                                         |
| 7. Spec = verdad       | ✅       | Pregunta abierta resuelta (P1)                                      |
| 8. URLs estables       | ✅       | `trailingSlash` coherente con las canónicas; `www` redirige al raíz |
| 9. Todo se prueba      | ✅       | Unitarias del entorno; humo contra cada preview y producción        |

## Decisiones (aprobadas con el plan)

- **P1 — Dónde comprar el dominio** (pregunta abierta): **Vercel Domains** (DNS y HTTPS sin configurar nada). Alternativas: Cloudflare Registrar o Porkbun (más baratos en renovación; hay que crear los registros A/CNAME).
- **P2 — Previews protegidas** con la autenticación de Vercel + secreto de bypass para CI (alternativa: previews públicas, sin secreto, pero con los borradores visibles para cualquiera que tenga la URL).
- **P3 — «No desplegar si CI falla»** se garantiza con la protección de `main` (solo entra lo que pasó CI) y el comportamiento de Vercel ante builds fallidos; no se añade un despliegue manual desde GitHub Actions (más complejo, exigiría token de Vercel en GitHub).
- **P4 — `develop` usa la URL estable automática de Vercel** (no un subdominio como `develop.lgonzalez.dev`; se puede añadir después).
- **P5 — Release `0.1.0`** con todo lo de 001–008 como primera publicación.

## Ajustes durante la implementación

- Dos proyectos en `playwright.smoke.config.ts` (`deploy` y `domain`) y dos scripts (`test:smoke`, `test:smoke:domain`), en lugar de saltar pruebas según el entorno.
- `vercel.json` no fija la rama de producción (se configura en Vercel): el autor la cambió de `develop` (rama por defecto del repo) a `main`.

## Riesgos

- Vercel elige otra versión de Node por el rango de `engines` → fijar Node 24 en el proyecto de Vercel; la prueba de humo comprueba que el sitio responde.
- Protección de previews sin secreto en GitHub → el workflow de humo fallaría con 401: el workflow comprueba el secreto y da un mensaje claro.
- `deployment_status` también llega por deploys de ramas sin PR → se ejecutan igual (barato y útil).
- El dominio tarda en propagar o en emitir el certificado → `domain.spec.ts` solo corre contra producción y puede relanzarse.
- Las pruebas de humo dependen del contenido real → solo comprueban cosas que existen siempre (portada, `/en/`, primer artículo del listado, 404), sin slugs fijos.

## Estrategia de pruebas

- **Unitarias** (`tests/unit/008-deploy/`):
  - `build-env.test.ts` — `currentBuildEnv` con `VERCEL_ENV` `preview` / `production` / sin definir y en dev; combinado con `isDraftVisible`.
  - `vercel-config.test.ts` — `vercel.json` usa `npm ci`, `npm run build`, `dist`, framework `astro` y `trailingSlash: true`.
- **Humo** (`tests/smoke/`, contra despliegues reales): `deploy.spec.ts` en cada preview y en producción; `domain.spec.ts` en producción.
- Las e2e existentes (001–007) siguen corriendo en CI sobre el build local, como hasta ahora.

### Trazabilidad criterio → prueba

| Criterio de aceptación                             | Prueba unitaria         | Prueba funcional / verificación                  |
| -------------------------------------------------- | ----------------------- | ------------------------------------------------ |
| Proyecto Astro estático importado en Vercel        | `vercel-config.test.ts` | `deploy.spec.ts` (preview y producción)          |
| Producción automática desde `main` con tag         | —                       | Release `0.1.0` + `deploy.spec.ts` en producción |
| `develop` en URL de preview estable                | —                       | `deploy.spec.ts` sobre el deploy de `develop`    |
| Instalación con `npm ci`                           | `vercel-config.test.ts` | Log del build en Vercel                          |
| Preview por PR, borradores solo en previews        | `build-env.test.ts`     | `deploy.spec.ts` en la preview de un PR          |
| Dominio con HTTPS y `www` → raíz                   | —                       | `domain.spec.ts`                                 |
| Un build fallido no reemplaza la versión publicada | —                       | Verificación manual (preview rota a propósito)   |
| No se despliega a producción si CI falla           | —                       | Protección de `main` (verificada con `gh api`)   |

## Verificación

- `npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Tras importar en Vercel: el workflow de humo pasa en la preview de este PR.
- Tras la release: `domain.spec.ts` en verde, Lighthouse ≥ 95 en producción (ES y EN) y las verificaciones pendientes de otras specs: comentario de prueba en Giscus (005), Web Analytics y Speed Insights con datos y sin cookies (006), LinkedIn Post Inspector en ES y EN (007).
