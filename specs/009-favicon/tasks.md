# Tareas 009 — Favicon

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Diseño y generación

- [x] T1 — Prueba unitaria: `source.test.ts` (SVG válido, sin rastro de Astro, con modo oscuro y pata, contraste ≥ 4,5:1) → ver fallar
- [x] T2 — Implementación: `src/assets/favicon-source.svg` y `favicon-small.svg` (LG con trazos y pata) → ver pasar
- [x] T3 — Prueba unitaria: `generated.test.ts` (`buildIco()`, tamaños y contenido de PNG e ICO, coincidencia con la fuente) → ver fallar
- [x] T4 — Implementación: `scripts/generate-favicons.mjs` y script `npm run icons`; ejecutarlo y versionar `public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png` e `icon-512.png` → ver pasar
- [x] T5 — Revisión visual del render a 16, 32 y 180 px; ajustar el diseño si algo no se lee

## Manifest y `<head>`

- [x] T6 — Pruebas unitarias: `manifest.test.ts` y `base-head.test.ts` (Container API) → ver fallar
- [x] T7 — Implementación: `public/manifest.webmanifest` y enlaces en `BaseHead.astro` → ver pasar
- [x] T8 — Pruebas funcionales: `icons.spec.ts` y `dark-mode.spec.ts` (ES y EN: portada, artículo y 404) → ver fallar antes de T4/T7 y pasar después

## Documentación

- [x] T9 — `AGENTS.md` y `.claude/rules/tooling.md`: script `icons`, estructura y cómo cambiar el icono
- [x] T10 — `specs/README.md`: fila 009

## Cierre

- [x] `npm run build` y `npm run check` en verde
- [ ] `npm test` (unitarias + funcionales) en verde, en local y en CI
- [x] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [x] Criterios de aceptación de la spec verificados (ES y EN)
- [x] Lighthouse ≥ 95 en portada y un artículo (ES y EN)
- [x] `specs/README.md` actualizado
