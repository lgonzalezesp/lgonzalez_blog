# Spec 003 — Internacionalización ES/EN

- **Estado:** En revisión ([PR #3](https://github.com/lgonzalezesp/lgonzalez_blog/pull/3))
- **Rama:** `feature/003-i18n`

## Contexto / Por qué

El blog se dirige a lectores hispanohablantes y anglohablantes. El español es el idioma principal.

## Historias de usuario

- Como **lector**, quiero leer el blog en mi idioma y cambiar de idioma fácilmente.
- Como **lector**, al cambiar de idioma en un post quiero ir a su traducción si existe.
- Como **autor**, quiero que traducir un post sea solo crear otro archivo con el mismo `translationKey`.

## Criterios de aceptación

- [x] Español en la raíz (`/`), inglés bajo `/en/`.
- [x] Todos los textos de interfaz (menú, botones, fechas, etiquetas) salen de un diccionario por idioma.
- [x] Selector de idioma en la cabecera: lleva a la traducción del contenido actual o, si no existe, a la portada del otro idioma.
- [x] Fechas formateadas según el idioma.
- [x] `<html lang>` correcto y etiquetas `hreflang` entre traducciones.
- [x] Los listados solo muestran contenido del idioma actual.

## Pruebas

### Unitarias (Vitest)

- [x] Los diccionarios ES y EN tienen exactamente las mismas claves y ningún valor vacío.
- [x] La utilidad de traducción devuelve el texto correcto por idioma y falla de forma visible ante una clave inexistente.
- [x] Detección de idioma por URL: `/…` → `es`, `/en/…` → `en`.
- [x] Generación de la URL equivalente en el otro idioma (con y sin traducción disponible).
- [x] Formato de fechas en ES y EN.

### Funcionales (Playwright)

- [x] `/` tiene `<html lang="es">` y `/en/` tiene `<html lang="en">`.
- [x] El selector de idioma en un post traducido lleva a su traducción; en uno sin traducción, a la portada del otro idioma.
- [x] Las etiquetas `hreflang` enlazan las traducciones en ambos sentidos.
- [x] El listado en `/en/` no muestra contenido en español (y viceversa).
- [x] Ningún texto de interfaz en español aparece en las páginas `/en/`.

## Fuera de alcance

- Traducción automática del contenido.
- Más de dos idiomas.

## Preguntas abiertas

- Ninguna. ~~¿Detectar el idioma del navegador y sugerir la versión inglesa?~~ Resuelta: no. Exigiría JS en cliente (principio 6) y el selector de idioma visible ya cubre la necesidad. Queda como posible mejora futura.
