# Spec 005 — Comentarios (Giscus)

- **Estado:** Borrador
- **Rama:** `feat/005-comments`

## Contexto / Por qué

Los lectores deben poder comentar los artículos sin que el blog necesite base de datos ni moderación propia. Giscus usa GitHub Discussions del repo `lgonzalezesp/lgonzalez_blog`.

## Historias de usuario

- Como **lector**, quiero comentar un artículo y responder a otros comentarios.
- Como **autor**, quiero moderar los comentarios desde GitHub.

## Criterios de aceptación

- [ ] Sección de comentarios al final de cada post (y de cada proyecto, si se decide).
- [ ] Cada post tiene su propio hilo, mapeado por ruta; las traducciones tienen hilos separados.
- [ ] Idioma de la interfaz de Giscus = idioma de la página.
- [ ] Tema de Giscus sincronizado con el modo claro/oscuro del sitio, también al cambiarlo.
- [ ] Giscus se carga de forma diferida (no penaliza el rendimiento inicial).
- [ ] Los comentarios aparecen en la categoría "Comments" de Discussions.

## Fuera de alcance

- Comentarios anónimos (Giscus requiere cuenta de GitHub).
- Notificaciones por email propias.

## Preguntas abiertas

- ¿Comentarios también en proyectos y notas, o solo en artículos?

## Requisitos previos (manuales)

- Repo público, Discussions habilitado, app Giscus instalada, categoría "Comments" creada.
