# Spec 002 — Modelo de contenido

- **Estado:** En revisión
- **Rama:** `feature/002-content-model`

## Contexto / Por qué

El blog publica tres tipos de contenido: artículos, proyectos y notas cortas. Un modelo validado evita errores de publicación y permite enlazar traducciones.

## Historias de usuario

- Como **autor**, quiero escribir un artículo en un archivo Markdown/MDX con metadatos claros.
- Como **autor**, quiero documentar mis proyectos (stack, estado, enlaces a repo y demo).
- Como **autor**, quiero publicar ideas cortas sin la estructura de un artículo completo.
- Como **lector**, quiero ver de qué trata una nota (título y etiquetas) y cuándo se escribió.
- Como **autor**, quiero que un error en los metadatos falle el build en vez de publicarse roto.

## Criterios de aceptación

- [x] Colecciones `blog`, `projects` y `notes` con esquema validado.
- [x] Campos comunes: título, descripción, fecha, fecha de actualización, etiquetas, idioma, `draft`, portada (con `alt`) y `translationKey`.
- [x] `projects` añade: stack, estado (activo / terminado / archivado), URL de repo y de demo, destacado.
- [x] `notes` exige **título**, **fecha de creación** y **etiquetas** (al menos una) que indican de qué trata la nota; descripción y portada son opcionales.
- [x] Contenido organizado por idioma: `src/content/<colección>/{es,en}/`.
- [x] Un frontmatter inválido hace fallar `npm run check` con un mensaje claro.
- [x] Los `draft: true` no aparecen en el build de producción.
- [x] Al menos un ejemplo de cada colección en ES y EN.

## Pruebas

### Unitarias (Vitest)

- [x] Cada esquema acepta un frontmatter válido de su colección.
- [x] Cada esquema rechaza: falta de campos obligatorios, fecha inválida, idioma fuera de `es|en`, portada sin `alt`, estado de proyecto desconocido.
- [x] El esquema de `notes` rechaza una nota sin título, sin fecha de creación o sin etiquetas (lista vacía incluida) y acepta una sin descripción ni portada.
- [x] El filtro de borradores excluye `draft: true` en producción y los incluye en desarrollo/preview.
- [x] La utilidad que busca traducciones por `translationKey` devuelve la pareja correcta y `undefined` si no existe.
- [x] La ordenación por fecha devuelve primero lo más reciente.

### Funcionales (Playwright)

- [x] Un post de ejemplo en ES y otro en EN se publican y son accesibles por su URL.
- [x] Una nota de ejemplo en ES y otra en EN se publican con su título, fecha de creación y etiquetas en el HTML.
- [x] Un contenido de fixture con `draft: true` no existe en el build de producción (404).
- [x] Un build con un fixture inválido falla con un mensaje que nombra el archivo y el campo.

## Fuera de alcance

- Cómo se muestran los contenidos (spec 004).

## Preguntas abiertas

- Ninguna. ~~¿Las notas necesitan título?~~ Resuelta: título, fecha de creación y etiquetas obligatorios.
