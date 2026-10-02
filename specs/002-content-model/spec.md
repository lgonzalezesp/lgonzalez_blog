# Spec 002 — Modelo de contenido

- **Estado:** Borrador
- **Rama:** `feat/002-content-model`

## Contexto / Por qué

El blog publica tres tipos de contenido: artículos, proyectos y notas cortas. Un modelo validado evita errores de publicación y permite enlazar traducciones.

## Historias de usuario

- Como **autor**, quiero escribir un artículo en un archivo Markdown/MDX con metadatos claros.
- Como **autor**, quiero documentar mis proyectos (stack, estado, enlaces a repo y demo).
- Como **autor**, quiero publicar ideas cortas sin la estructura de un artículo completo.
- Como **autor**, quiero que un error en los metadatos falle el build en vez de publicarse roto.

## Criterios de aceptación

- [ ] Colecciones `blog`, `projects` y `notes` con esquema validado.
- [ ] Campos comunes: título, descripción, fecha, fecha de actualización, etiquetas, idioma, `draft`, portada (con `alt`) y `translationKey`.
- [ ] `projects` añade: stack, estado (activo / terminado / archivado), URL de repo y de demo, destacado.
- [ ] Contenido organizado por idioma: `src/content/<colección>/{es,en}/`.
- [ ] Un frontmatter inválido hace fallar `npm run check` con un mensaje claro.
- [ ] Los `draft: true` no aparecen en el build de producción.
- [ ] Al menos un ejemplo de cada colección en ES y EN.

## Fuera de alcance

- Cómo se muestran los contenidos (spec 004).

## Preguntas abiertas

- ¿Las notas necesitan título o basta con el texto y la fecha?
