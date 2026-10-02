# Spec 003 — Internacionalización ES/EN

- **Estado:** Aprobada
- **Rama:** `feature/003-i18n`

## Contexto / Por qué

El blog se dirige a lectores hispanohablantes y anglohablantes. El español es el idioma principal.

## Historias de usuario

- Como **lector**, quiero leer el blog en mi idioma y cambiar de idioma fácilmente.
- Como **lector**, al cambiar de idioma en un post quiero ir a su traducción si existe.
- Como **autor**, quiero que traducir un post sea solo crear otro archivo con el mismo `translationKey`.

## Criterios de aceptación

- [ ] Español en la raíz (`/`), inglés bajo `/en/`.
- [ ] Todos los textos de interfaz (menú, botones, fechas, etiquetas) salen de un diccionario por idioma.
- [ ] Selector de idioma en la cabecera: lleva a la traducción del contenido actual o, si no existe, a la portada del otro idioma.
- [ ] Fechas formateadas según el idioma.
- [ ] `<html lang>` correcto y etiquetas `hreflang` entre traducciones.
- [ ] Los listados solo muestran contenido del idioma actual.

## Pruebas

### Unitarias (Vitest)

- [ ] Los diccionarios ES y EN tienen exactamente las mismas claves y ningún valor vacío.
- [ ] La utilidad de traducción devuelve el texto correcto por idioma y falla de forma visible ante una clave inexistente.
- [ ] Detección de idioma por URL: `/…` → `es`, `/en/…` → `en`.
- [ ] Generación de la URL equivalente en el otro idioma (con y sin traducción disponible).
- [ ] Formato de fechas en ES y EN.

### Funcionales (Playwright)

- [ ] `/` tiene `<html lang="es">` y `/en/` tiene `<html lang="en">`.
- [ ] El selector de idioma en un post traducido lleva a su traducción; en uno sin traducción, a la portada del otro idioma.
- [ ] Las etiquetas `hreflang` enlazan las traducciones en ambos sentidos.
- [ ] El listado en `/en/` no muestra contenido en español (y viceversa).
- [ ] Ningún texto de interfaz en español aparece en las páginas `/en/`.

## Fuera de alcance

- Traducción automática del contenido.
- Más de dos idiomas.

## Preguntas abiertas

- ¿Detectar el idioma del navegador y sugerir (sin redirigir) la versión inglesa?
