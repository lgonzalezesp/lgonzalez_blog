# Plan 010 — Crear posts

- **Spec:** [spec.md](./spec.md)
- **Estado:** Borrador

## Enfoque técnico

### Script `scripts/new-post.mjs` (sin dependencias)

- Se ejecuta con `npm run new-post -- "<título>" [opciones]`. Sigue el patrón de `scripts/generate-favicons.mjs` (spec 009): módulo ESM que **exporta** sus funciones (para probarlas con Vitest) y solo ejecuta la CLI cuando se lanza directamente.
- Argumentos con `parseArgs` de `node:util` (incluido en Node, sin paquetes):

  | Opción       | Valores                         | Por defecto                     |
  | ------------ | ------------------------------- | ------------------------------- |
  | `<título>`   | texto (posicional, obligatorio) | —                               |
  | `--lang`     | `es` \| `en` \| `both`          | `es`                            |
  | `--title-en` | título en inglés                | obligatorio con `both`          |
  | `--type`     | `post` \| `note`                | `post`                          |
  | `--tags`     | `a,b,c`                         | `[]` (obligatorio en notas)     |
  | `--dir`      | carpeta de contenido            | `CONTENT_DIR` o `./src/content` |

  El título posicional es el del idioma elegido (en `both`, el español; el inglés va en `--title-en`). `--dir` existe para las pruebas y respeta la misma variable `CONTENT_DIR` que `src/content.config.ts`.

### Funciones exportadas (puras salvo `createPosts`)

- `slugify(title)`: normaliza con `NFD`, quita marcas diacríticas, pasa a minúsculas, cambia todo lo que no sea `a-z0-9` por `-`, colapsa y recorta guiones. Si queda vacío, lanza error.
- `buildPlan(options, now)`: valida las opciones y devuelve la lista de archivos a crear (`{ path, content }`) sin tocar el disco. Reglas:
  - `translationKey` = slug del título en español (o del inglés si `--lang en`), el mismo en las dos versiones de `both`.
  - Frontmatter con el estilo del repo (comillas simples, `'` duplicada dentro del texto): `title`, `description` provisional («Escribe aquí una descripción breve del post.» / «Write a short description here.»), `pubDate` = fecha local de hoy `YYYY-MM-DD`, `tags`, `lang`, `translationKey`, `draft: true`. Las notas llevan `title`, `pubDate`, `tags`, `lang`, `translationKey` y `draft: true`, sin `description` (opcional en su esquema).
  - Esqueleto: en posts, una frase en Markdown y un apartado `##` de ejemplo; en notas, una línea.
  - Ruta: `<dir>/blog/<lang>/<slug>.md` o `<dir>/notes/<lang>/<slug>.md`.
- `createPosts(options, now)`: ejecuta `buildPlan`, **comprueba que ninguno de los archivos existe antes de escribir ninguno** (si uno existe, error que nombra el archivo y no se crea nada) y los escribe con `flag: 'wx'` (segunda barrera contra sobrescribir). Devuelve las rutas creadas.
- Errores como `NewPostError` con mensaje en español; la CLI los imprime y sale con código 1 sin trazas.
- Salida de la CLI: rutas creadas, URL local de cada una (`/blog/<slug>/`, `/en/blog/<slug>/`, `/notas/<slug>/`, `/en/notes/<slug>/`) y los siguientes pasos (rama, `npm run dev`, quitar `draft`). Una prueba compara esas URL con las funciones de `src/i18n/routes.ts` para que no diverjan.
- El script **no usa Git**: no crea ramas, commits ni PR.

### Salida de build configurable (para la prueba funcional)

- `astro.config.mjs`: `outDir: process.env.OUT_DIR ?? './dist'`. Vercel y el desarrollo no lo definen, así que no cambia nada; permite a la prueba funcional construir en una carpeta temporal sin pisar `dist/`.

### Skill de Claude Code `/nuevo-post`

- `.claude/skills/nuevo-post/SKILL.md` (frontmatter `name` y `description`). Instrucciones:
  1. Preguntar tema, idioma (es / en / ambos) y si es post o nota; pedir el título y, en `both`, el título en inglés.
  2. Comprobar que se parte de `develop` actualizado y crear la rama `post/<slug>`.
  3. Ejecutar `npm run new-post -- …` y mostrar los archivos creados.
  4. Ayudar a redactar a partir de lo que el autor cuente: **no inventar experiencias ni datos** (regla de `content.md`), dejar marcadores `[COMPLETAR: …]` donde falte información.
  5. Recordar la vista previa (`npm run dev`; si algo falla tras cambiar de rama, limpiar la caché de Astro) y el flujo: quitar `draft`, `npm run check`, PR a `develop`; la publicación en producción es una release que pide el autor.
  6. No hace `push`, merge, tag ni release por su cuenta.

### Documentación

- `AGENTS.md`: comando en la tabla, `scripts/new-post.mjs` y `.claude/skills/` en la estructura, y una línea en «Convenciones» para empezar contenido con el script.
- `README.md`: «Escribir un artículo» empieza por el comando y deja la creación a mano como alternativa.
- `.claude/rules/content.md`: usar `npm run new-post` para crear contenido.

## Archivos afectados

- `scripts/new-post.mjs` — crear — CLI y funciones
- `.claude/skills/nuevo-post/SKILL.md` — crear — skill
- `astro.config.mjs` — modificar — `outDir` por `OUT_DIR`
- `package.json` — modificar — script `new-post`
- `tests/unit/010-new-post/*`, `tests/e2e/010-new-post/*` — crear
- `AGENTS.md`, `README.md`, `.claude/rules/content.md` — modificar
- `specs/README.md` — modificar — fila 010

## Dependencias nuevas

- Ninguna (`node:util`, `node:fs` y `node:path`).

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                                         |
| ---------------------- | -------- | ---------------------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Un script local sin dependencias; el sitio no cambia                         |
| 2. Dueño de los datos  | ✅       | Archivos Markdown en Git                                                     |
| 3. Bilingüe            | ✅       | `--lang both` con el mismo `translationKey`; textos provisionales en ES y EN |
| 4. Rendimiento / a11y  | ✅       | Sin cambios en el sitio                                                      |
| 5. Privacidad          | ✅       | Sin red ni servicios externos                                                |
| 6. Cero JS por defecto | ✅       | Solo herramienta de desarrollo; nada llega al navegador                      |
| 7. Spec = verdad       | ✅       | Decisiones P1–P5 de la spec aplicadas                                        |
| 8. URLs estables       | ✅       | No renombra ni mueve contenido; nunca sobrescribe                            |
| 9. Todo se prueba      | ✅       | Ver trazabilidad                                                             |

## Riesgos

- Un título con comillas, `:` o `#` rompe el YAML → el título se escribe entre comillas simples duplicando las internas; prueba unitaria con esos caracteres y la prueba funcional construye de verdad.
- Un archivo existente podría perderse → comprobación previa de todos los destinos y escritura con `wx`; prueba de que no se modifica nada si uno de los dos existe.
- La descripción provisional se publicaría por descuido → el post nace con `draft: true`; la skill recuerda cambiarla antes de quitar el borrador.
- Dos posts con el mismo título en el mismo idioma → el segundo falla por archivo existente, con mensaje claro (no se añade sufijo automático para no crear URLs inesperadas).
- Fecha en UTC frente a la local → se usa la fecha local de la máquina del autor; prueba con una fecha inyectada.
- La build de la prueba funcional comparte la caché de contenido de Astro con el servidor de desarrollo → es el mismo riesgo que ya tienen las e2e actuales; si el servidor de desarrollo enseña contenido viejo tras `npm test`, se limpia `.astro` (ya documentado en `AGENTS.md`).
- Dos builds por la prueba funcional alargan CI unos 30–40 s → solo se hacen dos (borrador y publicado) y el test es único y en serie.

## Estrategia de pruebas

- **Unitarias** (`tests/unit/010-new-post/`):
  - `slugify.test.ts` — acentos, `ñ`, signos, espacios múltiples, mayúsculas y título vacío tras limpiar.
  - `plan.test.ts` — `buildPlan`: `es`, `en`, `both` (mismo `translationKey`, slugs distintos), `note`; fecha inyectada; `draft: true`; los datos del frontmatter validan con `blogSchema` y `noteSchema`; escapado de comillas; las URL impresas coinciden con `src/i18n/routes.ts`.
  - `create.test.ts` — en un directorio temporal: crea los archivos esperados, no sobrescribe (error que nombra el archivo y no se crea ninguno de los otros), y las validaciones (título vacío, `--lang` inválido, `both` sin `--title-en`, nota sin etiquetas, slug vacío).
  - `skill.test.ts` — `SKILL.md` tiene `name: nuevo-post`, `description`, menciona `npm run new-post` y la regla de no publicar ni mergear.
- **Funcionales** (`tests/e2e/010-new-post/new-post.spec.ts`, una sola prueba en serie):
  1. Copia `tests/fixtures/content` a un directorio temporal y ejecuta `npm run new-post` con `--lang both` y `--dir`.
  2. Construye con `CONTENT_DIR` y `OUT_DIR` temporales: el borrador **no** aparece en el build (ni páginas, ni listado, ni RSS, ni sitemap). Esto valida también el esquema de lo creado.
  3. Quita `draft: true` de los dos archivos y vuelve a construir: existen las páginas ES y EN y cada una enlaza a la otra (selector de idioma) por el `translationKey`.

### Trazabilidad criterio → prueba

| Criterio de aceptación                                 | Prueba unitaria                  | Prueba funcional                       |
| ------------------------------------------------------ | -------------------------------- | -------------------------------------- |
| Crea el post con frontmatter válido en borrador        | `plan.test.ts`, `create.test.ts` | `new-post.spec.ts`                     |
| Slug derivado del título                               | `slugify.test.ts`                | `new-post.spec.ts`                     |
| `--lang en` y `both` con el mismo `translationKey`     | `plan.test.ts`                   | `new-post.spec.ts`                     |
| `--type note` con etiquetas                            | `plan.test.ts`, `create.test.ts` | —                                      |
| Nunca sobrescribe                                      | `create.test.ts`                 | —                                      |
| Errores claros sin crear nada                          | `create.test.ts`                 | —                                      |
| Pasa `check` / el build                                | `plan.test.ts` (esquemas)        | `new-post.spec.ts`                     |
| Publicado: ES y EN enlazados; borrador fuera del build | —                                | `new-post.spec.ts`                     |
| Skill `/nuevo-post`                                    | `skill.test.ts`                  | Revisión manual                        |
| Documentado                                            | —                                | Revisión manual                        |
| Sin dependencias nuevas                                | —                                | `npm ls` / revisión del `package.json` |

## Verificación

- `npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Manual: ejecutar `npm run new-post -- "Prueba" --lang both --title-en "Test"`, ver ambas páginas en `npm run dev` y borrar los archivos de prueba.
- Manual: invocar `/nuevo-post` en Claude Code y comprobar que sigue el flujo sin publicar nada.
