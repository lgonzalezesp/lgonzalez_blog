# Spec 010 — Crear posts

- **Estado:** Hecha ([PR #14](https://github.com/lgonzalezesp/lgonzalez_blog/pull/14))
- **Rama:** `feature/010-new-post`

## Contexto / Por qué

Hoy escribir un post exige recordar la ruta, el frontmatter y las reglas (`translationKey`, `lang` igual que la carpeta, fecha, etiquetas, `draft`). Un error solo aparece al ejecutar `npm run check` o el build.

El objetivo es que empezar un post sea **un comando** (o una petición a Claude Code) y que el archivo salga ya válido, en borrador y listo para escribir.

## Historias de usuario

- Como **autor**, quiero crear el archivo de un post con un comando para no copiar frontmatter a mano.
- Como **autor**, quiero que el post nuevo nazca como borrador y con la fecha de hoy para no publicarlo por accidente.
- Como **autor**, quiero crear a la vez la versión en español y en inglés, enlazadas, para no olvidar la traducción.
- Como **autor**, quiero pedirle a Claude Code «crea un post sobre X» y que siga el flujo del proyecto (rama, archivo, previsualización).

## Criterios de aceptación

- [x] `npm run new-post -- "<título>"` crea `src/content/blog/es/<slug>.md` con frontmatter válido: `title`, `description` provisional, `pubDate` de hoy, `tags: []`, `lang`, `translationKey` y `draft: true`, más un esqueleto de texto.
- [x] El `slug` se deriva del título: minúsculas, sin acentos ni signos, con guiones.
- [x] Con `--lang en` crea solo la versión en inglés, y con `--lang both` crea las dos con el **mismo** `translationKey`; cada una con su slug (el inglés con `--title-en "<title>"`).
- [x] Con `--type note` crea una nota (`src/content/notes/<lang>/`) con título, fecha y al menos una etiqueta (`--tags a,b`), como exige su esquema.
- [x] Nunca sobrescribe un archivo existente: falla con un mensaje claro que nombra el archivo.
- [x] Un título vacío, un idioma no válido o un slug vacío fallan con un mensaje claro y sin crear nada.
- [x] Todo archivo creado pasa `npm run check` sin errores.
- [x] Un post creado y luego publicado (quitando `draft`) se construye y aparece en ES y EN, con el selector de idioma enlazando las dos versiones.
- [x] Skill de Claude Code `/nuevo-post`: pregunta el tema y el idioma, ejecuta el script, ayuda a redactar y recuerda el flujo (rama `post/<slug>`, vista previa, PR a `develop`). No publica ni mergea por sí sola.
- [x] Documentado en `AGENTS.md`, `README.md` y `.claude/rules/content.md`.
- [x] Sin dependencias nuevas.

## Pruebas

### Unitarias (Vitest)

- [x] `slugify`: acentos, `ñ`, signos, espacios múltiples, mayúsculas, títulos que quedan vacíos.
- [x] El constructor del frontmatter genera un documento que valida con `blogSchema` y `noteSchema` (ES y EN), con la fecha de hoy y `draft: true`.
- [x] `createPost` en un directorio temporal: crea los archivos esperados (`es`, `en`, `both`, `note`), usa el mismo `translationKey` en `both` y **no sobrescribe** (error que nombra el archivo).
- [x] Validaciones: título vacío, `--lang` inválido, nota sin etiquetas, slug vacío.

### Funcionales (Playwright)

- [x] Se ejecuta el comando contra una copia del contenido de pruebas, se publica el post (se quita `draft`) y se construye en un directorio temporal: existen las páginas ES y EN y el selector de idioma lleva de una a otra.
- [x] Mientras sea borrador, el post **no** está en el build de producción (ni en listados, ni RSS, ni sitemap).

## Fuera de alcance

- Un CMS visual o un editor en el navegador.
- Crear proyectos (`projects`), que tienen más campos obligatorios (`stack`, `status`).
- Acortar el camino de publicación (`develop` → `main` sin release completa): sería otra spec.
- Subir o crear portadas; generar el texto del post.
- Crear ramas, commits o PR desde el script (eso lo hace el flujo de Git o la skill, nunca el script).

## Decisiones propuestas (a aprobar con la spec)

- **P1 — Idioma por defecto:** `es`. `--lang en` y `--lang both` son explícitos. Un post sin traducción es válido (ya existe esa regla).
- **P2 — Tipos:** `blog` (por defecto) y `note`. Proyectos quedan fuera.
- **P3 — Skill de Claude Code:** sí, `.claude/skills/nuevo-post/SKILL.md`, además del script (el script sirve también sin Claude).
- **P4 — El script no usa Git:** solo crea archivos. La rama y el commit siguen el flujo de `AGENTS.md`.
- **P5 — Publicación más corta para contenido:** se trata aparte (spec 011) si quieres publicar posts sin una release completa cada vez.
