# Tareas 010 — Crear posts

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Lógica del script

- [x] T1 — Prueba unitaria: `slugify.test.ts` (acentos, `ñ`, signos, espacios, mayúsculas, título vacío) → ver fallar
- [x] T2 — Implementación: `slugify` en `scripts/new-post.mjs` → ver pasar
- [x] T3 — Pruebas unitarias: `plan.test.ts` (`es`, `en`, `both`, `note`; fecha inyectada; `draft: true`; esquemas `blogSchema` y `noteSchema`; escapado de comillas; URL de `routes.ts`) → ver fallar
- [x] T4 — Implementación: `buildPlan` → ver pasar
- [x] T5 — Pruebas unitarias: `create.test.ts` (crea los archivos, no sobrescribe y no deja nada a medias, validaciones) → ver fallar
- [x] T6 — Implementación: `createPosts`, `NewPostError` y la CLI (`parseArgs`, salida con URL y pasos siguientes); script `npm run new-post` → ver pasar

## Prueba funcional

- [x] T7 — Implementación: `outDir` desde `OUT_DIR` en `astro.config.mjs` (sin cambiar el comportamiento por defecto)
- [x] T8 — Prueba funcional: `new-post.spec.ts` (comando con `both`, build con borrador, build publicado, ES y EN enlazados) → ver fallar antes de T6/T7 y pasar después

## Skill y documentación

- [x] T9 — Prueba unitaria: `skill.test.ts` → ver fallar
- [x] T10 — Implementación: `.claude/skills/nuevo-post/SKILL.md` → ver pasar
- [x] T11 — Documentación: `AGENTS.md`, `README.md` y `.claude/rules/content.md`
- [x] T12 — `specs/README.md`: fila 010

## Cierre

- [x] `npm run build` y `npm run check` en verde
- [x] `npm test` (unitarias + funcionales) en verde, en local y en CI
- [x] `npm run lint`, `npm run format:check` y `npm audit` limpios
- [x] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [x] Criterios de aceptación de la spec verificados (ES y EN)
- [x] Comprobación manual: `npm run new-post -- "Prueba" --lang both --title-en "Test"`, ver ambas páginas en `npm run dev` y borrar los archivos de prueba
- [x] `specs/README.md` actualizado
