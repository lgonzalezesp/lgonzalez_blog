# Tareas 008 — Despliegue en Vercel

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Repo

- [ ] T1 — Prueba unitaria: `build-env.test.ts` y `vercel-config.test.ts` → ver fallar
- [ ] T2 — Implementación: `currentBuildEnv` (usado por `getPublished` y el RSS) y `vercel.json` → ver pasar
- [ ] T3 — Pruebas de humo: `playwright.smoke.config.ts`, `tests/smoke/deploy.spec.ts`, `tests/smoke/domain.spec.ts` y script `test:smoke`; verlas pasar contra un `preview` local (`SMOKE_BASE_URL=http://localhost:4323`) y fallar contra una URL rota
- [ ] T4 — Workflow `.github/workflows/smoke.yml` (`deployment_status`, bypass de protección, `domain.spec.ts` solo en producción)
- [ ] T5 — Documentación: `AGENTS.md` (despliegue, release, hotfix, humo) y `.claude/rules/` (git-workflow, tooling)
- [ ] T6 — PR `feature/008-deploy → develop` con CI en verde

## Vercel y dominio (manuales del autor)

- [ ] T7 — (Autor) Comprar `lgonzalez.dev` (renovación automática, privacidad WHOIS, bloqueo de transferencia)
- [ ] T8 — (Autor) Importar el repo en Vercel: producción = `main`, Node 24
- [ ] T9 — (Autor) Dominio `lgonzalez.dev` + `www` con redirección 308 al raíz
- [ ] T10 — (Autor) Activar Web Analytics y Speed Insights
- [ ] T11 — (Autor) Crear el secreto «Protection Bypass for Automation» y guardarlo en GitHub (`VERCEL_AUTOMATION_BYPASS_SECRET`)
- [ ] T12 — Comprobar: preview del PR y de `develop` desplegadas; workflow de humo en verde; borrador visible en la preview

## Release 0.1.0

- [ ] T13 — `release/0.1.0` desde `develop`: `version` 0.1.0 y `CHANGELOG.md`
- [ ] T14 — PR `release/0.1.0 → main` (merge commit) con CI en verde; tag `v0.1.0`
- [ ] T15 — PR `release/0.1.0 → develop` (merge commit)
- [ ] T16 — Producción: humo y `domain.spec.ts` en verde; Lighthouse ≥ 95 (ES y EN)

## Verificaciones pendientes de otras specs (tras el deploy)

- [ ] T17 — 005: comentario de prueba visible en Discussions → Comments
- [ ] T18 — 006: Web Analytics y Speed Insights con datos; sin cookies en producción
- [ ] T19 — 007: LinkedIn Post Inspector con un artículo en ES y otro en EN
- [ ] T20 — Comprobar una vez que un build roto en una preview no afecta a producción

## Cierre

- [ ] `npm run build` y `npm run check` en verde
- [ ] `npm test` en verde, en local y en CI; `npm run test:smoke` en verde contra producción
- [ ] Tabla de trazabilidad de `plan.md` completa
- [ ] Criterios de aceptación de la spec verificados
- [ ] `specs/README.md` actualizado (tareas manuales y estado de todas las specs)
