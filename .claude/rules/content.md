---
paths:
  - 'src/content/**'
  - 'src/content.config.ts'
  - 'tests/fixtures/**'
---

# Contenido (Markdown/MDX)

- Todo archivo de contenido tiene frontmatter validado por el esquema de `src/content.config.ts`. Nunca relajes ni desactives la validación para que un post compile: corrige el frontmatter o propone cambiar el esquema en la spec.
- Nombres de archivo en kebab-case; el nombre define la URL (slug).
- Desde 002: contenido por idioma en `src/content/<colección>/{es,en}/`. Las traducciones de una misma pieza comparten `translationKey`.
- `draft: true` nunca se publica en producción; los listados, RSS y sitemap deben excluirlo.
- No renombres ni muevas contenido ya publicado sin añadir redirección (URLs estables, principio 8 de la constitución).
- Imágenes con `alt` descriptivo en el idioma del post; colócalas en `src/assets/` para que Astro las optimice.
- No inventes contenido real del autor (biografía, proyectos, opiniones). Usa fixtures o marcadores y pide el texto al usuario.
