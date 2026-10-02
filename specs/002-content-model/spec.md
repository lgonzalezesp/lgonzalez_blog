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

## Pruebas

### Unitarias (Vitest)

- [ ] Cada esquema acepta un frontmatter válido de su colección.
- [ ] Cada esquema rechaza: falta de campos obligatorios, fecha inválida, idioma fuera de `es|en`, portada sin `alt`, estado de proyecto desconocido.
- [ ] El filtro de borradores excluye `draft: true` en producción y los incluye en desarrollo/preview.
- [ ] La utilidad que busca traducciones por `translationKey` devuelve la pareja correcta y `undefined` si no existe.
- [ ] La ordenación por fecha devuelve primero lo más reciente.

### Funcionales (Playwright)

- [ ] Un post de ejemplo en ES y otro en EN se publican y son accesibles por su URL.
- [ ] Un contenido de fixture con `draft: true` no existe en el build de producción (404).
- [ ] Un build con un fixture inválido falla con un mensaje que nombra el archivo y el campo.

## Fuera de alcance

- Cómo se muestran los contenidos (spec 004).

## Preguntas abiertas

- ¿Las notas necesitan título o basta con el texto y la fecha?
