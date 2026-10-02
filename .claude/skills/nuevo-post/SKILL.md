---
name: nuevo-post
description: Crea un post o una nota nueva del blog (en español, inglés o ambos) con el frontmatter correcto y en borrador, y guía el flujo hasta la PR. Úsala cuando el autor quiera escribir un artículo o una nota.
---

# Nuevo post

Crea el archivo de un artículo (`blog`) o una nota (`notes`) con `npm run new-post` y acompaña al autor hasta la PR. La spec es `specs/010-new-post/spec.md`.

## Pasos

1. **Pregunta lo mínimo** (si el autor no lo ha dicho ya):
   - Tema y título.
   - Idioma: `es` (por defecto), `en` o `both`. Con `both`, el título en inglés para `--title-en`.
   - Tipo: artículo (`post`, por defecto) o nota (`note`, necesita etiquetas con `--tags a,b`).
2. **Rama.** Parte de `develop` actualizado y crea `post/<slug>` (el slug es el título sin acentos, en minúsculas y con guiones). Si el árbol de trabajo tiene cambios sin commitear del autor, no los toques ni los guardes: avísale y propón una carpeta de trabajo aparte (`git worktree`) o que los commitee él.
3. **Crea los archivos:**

   ```bash
   npm run new-post -- "Título del post" --lang both --title-en "Post title" --tags gcp,ideas
   ```

   Opciones: `--lang es|en|both`, `--title-en`, `--type post|note`, `--tags`. Enseña al autor los archivos creados y las URL locales que imprime el comando. El comando nunca sobrescribe un archivo existente; si falla, lee el mensaje y corrige la causa, no borres nada.

4. **Ayuda a redactar** con lo que el autor cuente. **No inventes** experiencias, cifras, enlaces ni opiniones suyas (regla de `.claude/rules/content.md`): donde falte información, deja un marcador `[COMPLETAR: lo que falta]` y pregúntala. Si hay versión en inglés, traduce solo el texto que el autor ya haya dado.
5. **Vista previa:** `npm run dev` y abre las URL locales. Si tras cambiar de rama el servidor muestra contenido viejo o da 404, para el servidor (`npx astro dev stop`), borra la caché (`rm -rf .astro node_modules/.astro node_modules/.vite`) y vuelve a arrancarlo.
6. **Antes de publicar** recuerda al autor:
   - Cambiar la `description` provisional por una real y añadir etiquetas.
   - Quitar `draft: true` cuando el post esté listo (mientras sea borrador no se publica en producción).
   - Ejecutar `npm run check` (valida el frontmatter) y `npm test`.
   - Abrir la PR a `develop` con el título en Conventional Commits (por ejemplo `docs(content): post sobre …`).

## Límites

- No hagas push, merge, tag ni release por tu cuenta: publicar en `main` es publicar en lgonzalez.dev y lo decide el autor.
- No commitees en `main` ni en `develop`.
- Un post sin traducción es válido; no crees la otra versión si el autor no la pide.
