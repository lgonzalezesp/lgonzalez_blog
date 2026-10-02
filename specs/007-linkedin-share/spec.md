# Spec 007 — Compartir en LinkedIn

- **Estado:** Borrador
- **Rama:** `feat/007-linkedin-share`

## Contexto / Por qué

LinkedIn es el canal principal para difundir los artículos y proyectos. Compartir debe ser un clic y la publicación debe verse atractiva en el feed.

## Historias de usuario

- Como **lector**, quiero compartir un artículo o proyecto en LinkedIn con un clic.
- Como **autor**, quiero que la tarjeta en LinkedIn muestre título, descripción e imagen correctos.
- Como **lector**, quiero copiar el enlace del artículo fácilmente.

## Criterios de aceptación

- [ ] Botón "Compartir en LinkedIn" en cada post y proyecto (arriba y al final), usando el enlace oficial de compartir con la URL canónica.
- [ ] Sin SDK, scripts de terceros ni cookies de LinkedIn.
- [ ] Se comparte la URL del idioma que se está leyendo; el texto del botón está traducido.
- [ ] Cada post tiene imagen OG de 1200×627: su portada o una generada en build (título + logo, en el idioma del post).
- [ ] Botón "Copiar enlace" con confirmación accesible.
- [ ] Enlace al perfil de LinkedIn del autor en "Sobre mí" y en el pie.
- [ ] Validado en **LinkedIn Post Inspector**: título, descripción e imagen correctos en ES y EN.

## Fuera de alcance

- Publicación automática en LinkedIn al hacer deploy.
- Contadores de veces compartido.
- Otras redes sociales (pueden añadirse en otra spec).

## Preguntas abiertas

- URL del perfil de LinkedIn del autor.
- ¿Generar imágenes OG automáticamente o solo usar portadas?
