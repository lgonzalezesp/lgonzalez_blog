# Tareas 007 — Compartir en LinkedIn

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Compartir

- [x] T1 — Prueba unitaria: `share.test.ts` (URL oficial con la canónica codificada) → ver fallar
- [x] T2 — Implementación: `src/lib/share.ts` → ver pasar
- [x] T3 — Prueba unitaria: `share-buttons.test.ts` (Container API) → ver fallar
- [x] T4 — Implementación: `ShareButtons.astro` (enlace de LinkedIn, botón «Copiar enlace» con región `status`) y textos en `src/i18n/ui.ts` → ver pasar
- [x] T5 — Pruebas funcionales: `share.spec.ts` y `copy-link.spec.ts` → ver fallar
- [x] T6 — Implementación: botones arriba y al final en `BlogPost.astro` (artículos) y `Project.astro` → ver pasar

## Imágenes OG generadas

- [x] T7 — `npm install satori` (justificado en el plan); `fflate` 0.7.5 con `overrides` para dejar `npm audit` limpio
- [x] T8 — Prueba unitaria: `og-image.test.ts` → ver fallar
- [x] T9 — Implementación: `src/lib/og-image.ts` (satori + sharp, fuente Atkinson, título ajustado) → ver pasar
- [x] T10 — Prueba funcional: `og-image.spec.ts` → ver fallar
- [x] T11 — Implementación: endpoint `src/pages/og/[...path].png.ts` y uso en artículos, proyectos y notas sin portada → ver pasar

## Perfil del autor

- [x] T12 — (Autor) URL del perfil de LinkedIn: `https://www.linkedin.com/in/luis-gonzalez-espejo/`
- [x] T13 — Prueba funcional: `profile.spec.ts` → ver fallar
- [x] T14 — Implementación: `AUTHOR` en `src/consts.ts`, enlace en el pie y en «Sobre mí» (`rel="me"`) → ver pasar

## Calidad y documentación

- [x] T15 — Prueba funcional: `a11y.spec.ts`; comprobar que las pruebas de 001–006 siguen pasando
- [x] T16 — `spec.md` (preguntas abiertas resueltas), `AGENTS.md` y `.claude/rules/astro-ui.md`

## Cierre

- [x] `npm run build` y `npm run check` en verde
- [x] `npm test` (unitarias + funcionales) en verde, en local (187 + 300) y en CI
- [x] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [x] Criterios de aceptación de la spec verificados (ES y EN), salvo Post Inspector
- [x] Manual: imágenes generadas revisadas (ES y EN, título corto y largo: cuatro líneas, sin desbordar)
- [x] Lighthouse ≥ 95 en un artículo y un proyecto (ES y EN) y en «Sobre mí»: 100 en las cuatro categorías
- [x] `specs/README.md` actualizado
- [ ] Pendiente para después del deploy (008): LinkedIn Post Inspector con un artículo en ES y otro en EN
