# Tareas 006 — SEO, feeds y analítica

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Metadatos

- [x] T1 — Prueba unitaria: `seo.test.ts` (`buildMeta`) y `og-default.test.ts` → ver fallar
- [x] T2 — Implementación: `src/assets/og-default.svg` → `og-default.png` (1200×627) y `src/lib/seo.ts` → ver pasar
- [x] T3 — Prueba funcional: `meta.spec.ts` → ver fallar
- [x] T4 — Implementación: `BaseHead.astro` sobre `buildMeta`, recorte de portadas con `getImage()`, datos de artículo en `BlogPost.astro`/`Project.astro`, `noindex` en la 404 → ver pasar
- [x] T4b — Bug encontrado por `meta.spec.ts`: portadas menores de 1200×627. Prueba `cover-size.test.ts` (vista fallar), `assertCoverSize` en `getPublished`/`getPageEntry`, marcadores ampliados a 1920×960

## Feeds

- [x] T5 — Prueba unitaria: `feed.test.ts` (`feedItems`) → ver fallar
- [x] T6 — Implementación: `src/lib/feed.ts`, `/rss.xml` y `/en/rss.xml`, enlace del `<head>` por idioma → ver pasar
- [x] T7 — Prueba funcional: `feeds.spec.ts` → verde

## Sitemap y robots

- [x] T8 — Prueba funcional: `sitemap.spec.ts` → ver fallar
- [x] T9 — Implementación: `robots.txt.ts` y filtro de la 404 en el sitemap → ver pasar

## Analítica

- [x] T10 — Prueba unitaria: `analytics.test.ts` y funcional: `privacy.spec.ts` → ver fallar
- [x] T11 — Implementación: `Analytics.astro` en `Base.astro` (solo en builds de Vercel o con `ENABLE_VERCEL_ANALYTICS=1`), `env` del build de pruebas → ver pasar

## Cierre de la feature

- [x] T12 — Comprobar que las pruebas de 001–005 siguen pasando
- [x] T13 — `AGENTS.md` y `.claude/rules/` (metadatos con `buildMeta`, feeds, analítica, `ENABLE_VERCEL_ANALYTICS`)

## Cierre

- [x] `npm run build` y `npm run check` en verde
- [x] `npm test` (unitarias + funcionales) en verde, en local (174 + 268) y en CI
- [x] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [x] Criterios de aceptación de la spec verificados (ES y EN)
- [x] Manual: feeds validados en local (XML bien formado con `xmllint`, elementos obligatorios de RSS 2.0, idioma correcto); el validador de W3C, por URL tras el deploy
- [x] Lighthouse ≥ 95 en portada, artículo, proyecto y nota (ES y EN): 100 en las cuatro categorías
- [x] `specs/README.md` actualizado
- [ ] Pendiente para después del deploy (008): activar Web Analytics y Speed Insights en Vercel y comprobar datos y ausencia de cookies
