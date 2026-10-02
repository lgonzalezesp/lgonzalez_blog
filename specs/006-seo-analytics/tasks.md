# Tareas 006 — SEO, feeds y analítica

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Metadatos

- [ ] T1 — Prueba unitaria: `seo.test.ts` (`buildMeta`) y `og-default.test.ts` → ver fallar
- [ ] T2 — Implementación: `src/assets/og-default.svg` → `og-default.png` (1200×627) y `src/lib/seo.ts` → ver pasar
- [ ] T3 — Prueba funcional: `meta.spec.ts` → ver fallar
- [ ] T4 — Implementación: `BaseHead.astro` sobre `buildMeta`, recorte de portadas con `getImage()`, datos de artículo en `BlogPost.astro`/`Project.astro`, `noindex` en la 404 → ver pasar

## Feeds

- [ ] T5 — Prueba unitaria: `feed.test.ts` (`feedItems`) → ver fallar
- [ ] T6 — Implementación: `src/lib/feed.ts`, `/rss.xml` y `/en/rss.xml`, enlace del `<head>` por idioma → ver pasar
- [ ] T7 — Prueba funcional: `feeds.spec.ts` → verde

## Sitemap y robots

- [ ] T8 — Prueba funcional: `sitemap.spec.ts` → ver fallar
- [ ] T9 — Implementación: `robots.txt.ts` y filtro de la 404 en el sitemap → ver pasar

## Analítica

- [ ] T10 — Prueba unitaria: `analytics.test.ts` y funcional: `privacy.spec.ts` → ver fallar
- [ ] T11 — Implementación: `Analytics.astro` en `Base.astro` (solo en builds de Vercel o con `ENABLE_VERCEL_ANALYTICS=1`), `env` del build de pruebas → ver pasar

## Cierre de la feature

- [ ] T12 — Comprobar que las pruebas de 001–005 siguen pasando
- [ ] T13 — `AGENTS.md` y `.claude/rules/` (metadatos con `buildMeta`, feeds, analítica, `ENABLE_VERCEL_ANALYTICS`)

## Cierre

- [ ] `npm run build` y `npm run check` en verde
- [ ] `npm test` (unitarias + funcionales) en verde, en local y en CI
- [ ] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [ ] Criterios de aceptación de la spec verificados (ES y EN)
- [ ] Manual: feeds validados con un lector o el validador de W3C
- [ ] Lighthouse ≥ 95 en portada, artículo, proyecto y nota (ES y EN)
- [ ] `specs/README.md` actualizado
- [ ] Pendiente para después del deploy (008): activar Web Analytics y Speed Insights en Vercel y comprobar datos y ausencia de cookies
