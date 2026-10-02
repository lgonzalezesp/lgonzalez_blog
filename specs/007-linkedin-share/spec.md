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

## Pruebas

### Unitarias (Vitest)

- [ ] La utilidad de compartir construye la URL oficial de LinkedIn con la URL canónica correctamente codificada (incluye caracteres especiales y acentos).
- [ ] El componente del botón usa el texto traducido y tiene nombre accesible, `target` y `rel` seguros.
- [ ] La imagen OG generada mide 1200×627 y contiene el título en el idioma del post.

### Funcionales (Playwright)

Sin llamar a LinkedIn: se verifica el enlace generado.

- [ ] Cada post y proyecto muestra el botón arriba y al final, en ES y EN.
- [ ] El enlace apunta a LinkedIn con la URL del idioma que se está leyendo.
- [ ] La página no carga ningún script ni cookie de LinkedIn.
- [ ] "Copiar enlace" copia la URL canónica al portapapeles y anuncia la confirmación de forma accesible.
- [ ] `og:image` de un post responde 200 con una imagen de 1200×627.

### Verificación manual (una vez, tras el deploy)

- [ ] LinkedIn Post Inspector con un post en ES y otro en EN.

## Fuera de alcance

- Publicación automática en LinkedIn al hacer deploy.
- Contadores de veces compartido.
- Otras redes sociales (pueden añadirse en otra spec).

## Preguntas abiertas

- URL del perfil de LinkedIn del autor.
- ¿Generar imágenes OG automáticamente o solo usar portadas?
