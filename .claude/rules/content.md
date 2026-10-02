---
paths:
  - 'src/content/**'
  - 'src/content.config.ts'
  - 'tests/fixtures/**'
---

# Contenido (Markdown/MDX)

- Todo archivo de contenido tiene frontmatter validado por el esquema de `src/content.config.ts`. Nunca relajes ni desactives la validación para que un post compile: corrige el frontmatter o propone cambiar el esquema en la spec.
- Nombres de archivo en kebab-case; el nombre define la URL (slug). Imágenes del frontmatter con ruta relativa al archivo (`../../../assets/…`).
- Contenido por idioma en `src/content/<colección>/{es,en}/`; `lang` debe coincidir con la carpeta (si no, el build falla).
- Frontmatter (esquemas en `src/content/schemas.ts`):
  - Todas: `title`, `pubDate`, `lang`, `translationKey` obligatorios; `updatedDate`, `draft` (por defecto `false`) y `cover: { src, alt }` opcionales (`alt` obligatorio si hay portada).
  - `blog` y `projects`: además `description` obligatoria; `tags` opcional.
  - `projects`: además `stack` (≥ 1), `status` (`active` | `completed` | `archived`), `repoUrl`/`demoUrl` (URL) y `featured`.
  - `notes`: `tags` obligatorio con al menos una etiqueta; `description` opcional.
  - `pages` (p. ej. `about.md`): solo `title`, `description`, `lang`, `translationKey`, `updatedDate` y `cover` opcionales; se leen con `getPageEntry()`.
- `translationKey` lo comparten las traducciones de una misma pieza; se pone aunque no haya traducción.
- `draft: true` nunca se publica en producción (sí en `npm run dev` y previews de Vercel). Las páginas, listados y RSS obtienen el contenido solo con `getPublished()`/`entryPaths()` de `src/lib/collections.ts`, nunca con `getCollection` directo.
- No renombres ni muevas contenido ya publicado sin añadir redirección (URLs estables, principio 8 de la constitución).
- Imágenes con `alt` descriptivo en el idioma del post; colócalas en `src/assets/` para que Astro las optimice.
- El contenido de `src/content/` es del autor y puede cambiar o borrarse: las pruebas usan `tests/fixtures/content/` (mismas reglas de estructura).
- No inventes contenido real del autor (biografía, proyectos, opiniones). Usa fixtures o marcadores y pide el texto al usuario.
