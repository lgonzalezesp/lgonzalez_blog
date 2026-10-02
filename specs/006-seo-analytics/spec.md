# Spec 006 — SEO, feeds y analítica

- **Estado:** Hecha ([PR #6](https://github.com/lgonzalezesp/lgonzalez_blog/pull/6))
- **Rama:** `feature/006-seo-analytics`

## Contexto / Por qué

El contenido debe encontrarse en buscadores, poder seguirse por RSS y verse bien al compartirse. El autor quiere saber qué se lee, sin rastrear a los lectores.

## Historias de usuario

- Como **lector**, quiero suscribirme por RSS en mi idioma.
- Como **autor**, quiero que mis posts aparezcan bien en buscadores y redes sociales.
- Como **autor**, quiero ver visitas y rendimiento sin usar cookies.

## Criterios de aceptación

- [x] Cada página tiene título, descripción y URL canónica.
- [x] Etiquetas Open Graph y Twitter Card por página, con `og:image` absoluta (1200×627).
- [x] Imagen OG por defecto cuando el contenido no tenga portada.
- [x] Un feed RSS por idioma, enlazado desde el `<head>`.
- [x] `sitemap.xml` con ambos idiomas y `robots.txt` que lo referencia.
- [x] Vercel Web Analytics y Speed Insights activos, sin cookies.

## Pruebas

### Unitarias (Vitest)

- [x] El componente de metadatos genera título, descripción, canónica, Open Graph y Twitter Card a partir de un contenido.
- [x] La URL de `og:image` y la canónica son siempre absolutas; se usa la imagen por defecto si no hay portada.
- [x] El generador de RSS incluye solo contenido publicado del idioma correcto, ordenado por fecha.

### Funcionales (Playwright)

- [x] Cada tipo de página tiene `<title>`, `meta description`, canónica y etiquetas OG/Twitter no vacías, en ES y EN.
- [x] `/rss.xml` y `/en/rss.xml` son XML válidos y están enlazados desde el `<head>`.
- [x] `sitemap.xml` contiene URLs de ambos idiomas y ningún borrador; `robots.txt` lo referencia.
- [x] Tras cargar las páginas, el navegador no tiene cookies.

## Fuera de alcance

- Generación automática de imágenes OG por post (se trata en 007).
- Herramientas de analítica de terceros (Google Analytics, etc.).

## Preguntas abiertas

- Ninguna por ahora.
