# Spec 005 — Comentarios (Giscus)

- **Estado:** En revisión ([PR #5](https://github.com/lgonzalezesp/lgonzalez_blog/pull/5))
- **Rama:** `feature/005-comments`

## Contexto / Por qué

Los lectores deben poder comentar los artículos sin que el blog necesite base de datos ni moderación propia. Giscus usa GitHub Discussions del repo `lgonzalezesp/lgonzalez_blog`.

## Historias de usuario

- Como **lector**, quiero comentar un artículo y responder a otros comentarios.
- Como **autor**, quiero moderar los comentarios desde GitHub.

## Criterios de aceptación

- [x] Sección de comentarios al final de cada post y de cada proyecto.
- [x] Cada post tiene su propio hilo, mapeado por ruta; las traducciones tienen hilos separados.
- [x] Idioma de la interfaz de Giscus = idioma de la página.
- [x] Tema de Giscus sincronizado con el modo claro/oscuro del sitio, también al cambiarlo.
- [x] Giscus se carga de forma diferida (no penaliza el rendimiento inicial).
- [x] Los comentarios aparecen en la categoría "Comments" de Discussions.

## Pruebas

### Unitarias (Vitest)

- [x] El componente de comentarios genera la configuración correcta de Giscus: repo, categoría, mapeo por ruta, idioma (`es`/`en`) y tema según modo.
- [x] La utilidad de sincronización de tema produce el mensaje correcto para claro y oscuro.

### Funcionales (Playwright)

Sin llamar a GitHub: la red de Giscus se intercepta.

- [x] Un post muestra la sección de comentarios al final; las páginas sin comentarios no la muestran.
- [x] El script de Giscus no se pide hasta que la sección entra en pantalla (carga diferida).
- [x] En `/en/…` Giscus se configura en inglés; en ES, en español.
- [x] Al cambiar el modo claro/oscuro se envía el cambio de tema a Giscus.

### Verificación manual (una vez, tras el deploy)

- [ ] Publicar un comentario de prueba y comprobar que aparece en Discussions → "Comments".

## Fuera de alcance

- Comentarios anónimos (Giscus requiere cuenta de GitHub).
- Notificaciones por email propias.

## Preguntas abiertas

- Ninguna. ~~¿Comentarios también en proyectos y notas?~~ Resuelta (plan, P1): en artículos y proyectos; no en notas.

## Requisitos previos (manuales)

- Repo público, Discussions habilitado, app Giscus instalada, categoría "Comments" creada.
