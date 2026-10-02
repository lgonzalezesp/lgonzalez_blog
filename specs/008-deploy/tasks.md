# Tareas 008 — Despliegue en Vercel

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Repo

- [x] T1 — Prueba unitaria: `build-env.test.ts` y `vercel-config.test.ts` → ver fallar
- [x] T2 — Implementación: `currentBuildEnv` (usado por `getPublished` y el RSS) y `vercel.json` → ver pasar
- [x] T3 — Pruebas de humo: `playwright.smoke.config.ts`, `tests/smoke/deploy.spec.ts`, `tests/smoke/domain.spec.ts` y scripts `test:smoke` / `test:smoke:domain`. Pasan contra el `preview` local y contra `https://lgonzalez-blog.vercel.app`; fallan contra una URL rota; `domain.spec.ts` falla hasta conectar el dominio
- [x] T4 — Workflow `.github/workflows/smoke.yml` (`deployment_status`, bypass de protección, `domain.spec.ts` solo en producción)
- [x] T5 — Documentación: `AGENTS.md` (despliegue, release, hotfix, humo) y `.claude/rules/` (git-workflow, tooling)
- [x] T6 — PR `feature/008-deploy → develop` con CI en verde

## Vercel y dominio (manuales del autor)

- [x] T7 — (Autor) Comprar `lgonzalez.dev` (renovación automática, privacidad WHOIS, bloqueo de transferencia): comprado en Vercel el 2026-10-02 (registrador Name.com, DNS de Vercel, bloqueo de transferencia activo; vence el 2027-10-02)
- [ ] T8 — (Autor) Importar el repo en Vercel: producción = `main`, Node 24. Importado y producción = `main` verificados (las releases 0.1.0 y 0.2.0 se publicaron desde `main`); falta confirmar Node 24.x en Settings → Build and Deployment
- [x] T9 — (Autor) Dominio `lgonzalez.dev` + `www` con redirección 308 al raíz: `lgonzalez.dev` es el dominio principal y `www` redirige con 308; `test:smoke:domain` pasa 5/5 contra producción (2026-10-02)
- [ ] T10 — (Autor) Activar Web Analytics y Speed Insights. Speed Insights activo (`/_vercel/speed-insights/script.js` responde 200); Web Analytics no (`/_vercel/insights/script.js` responde 404): activarlo en el proyecto → Analytics
- [x] T11 — (Autor) Crear el secreto «Protection Bypass for Automation» y guardarlo en GitHub (`VERCEL_AUTOMATION_BYPASS_SECRET`): el workflow `Smoke` pasa contra la preview protegida de la PR #8; sin el secreto, la preview redirige al login de Vercel
- [ ] T12 — Comprobar: preview del PR y de `develop` desplegadas; workflow de humo en verde; borrador visible en la preview

## Release 0.1.0

- [x] T13 — `release/0.1.0` desde `develop`: `version` 0.1.0 y `CHANGELOG.md`
- [x] T14 — PR `release/0.1.0 → main` (merge commit) con CI en verde; tag `v0.1.0` ([PR #9](https://github.com/lgonzalezesp/lgonzalez_blog/pull/9))
- [x] T15 — PR `release/0.1.0 → develop` (merge commit) ([PR #10](https://github.com/lgonzalezesp/lgonzalez_blog/pull/10)); el historial, la versión y el `CHANGELOG` llegaron de verdad a `develop` con la release 0.2.0 ([PR #18](https://github.com/lgonzalezesp/lgonzalez_blog/pull/18))
- [x] T16 — Producción: humo y `domain.spec.ts` en verde; Lighthouse ≥ 95 (ES y EN): humo 5/5 y dominio 5/5 contra `https://lgonzalez.dev`; Lighthouse en portada y artículo, ES y EN: rendimiento 100, accesibilidad 100, buenas prácticas 96, SEO 100 (2026-10-02)

## Verificaciones pendientes de otras specs (tras el deploy)

- [ ] T17 — 005: comentario de prueba visible en Discussions → Comments
- [ ] T18 — 006: Web Analytics y Speed Insights con datos; sin cookies en producción
- [ ] T19 — 007: LinkedIn Post Inspector con un artículo en ES y otro en EN
- [ ] T20 — Comprobar una vez que un build roto en una preview no afecta a producción

## Cierre

- [x] `npm run build` y `npm run check` en verde
- [x] `npm test` en verde, en local y en CI; `npm run test:smoke` en verde contra producción
- [ ] Tabla de trazabilidad de `plan.md` completa
- [ ] Criterios de aceptación de la spec verificados
- [ ] `specs/README.md` actualizado (tareas manuales y estado de todas las specs)
