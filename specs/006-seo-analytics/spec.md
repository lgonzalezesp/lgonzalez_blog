# Spec 006 — SEO, feeds y analítica

- **Estado:** Borrador
- **Rama:** `feat/006-seo-analytics`

## Contexto / Por qué

El contenido debe encontrarse en buscadores, poder seguirse por RSS y verse bien al compartirse. El autor quiere saber qué se lee, sin rastrear a los lectores.

## Historias de usuario

- Como **lector**, quiero suscribirme por RSS en mi idioma.
- Como **autor**, quiero que mis posts aparezcan bien en buscadores y redes sociales.
- Como **autor**, quiero ver visitas y rendimiento sin usar cookies.

## Criterios de aceptación

- [ ] Cada página tiene título, descripción y URL canónica.
- [ ] Etiquetas Open Graph y Twitter Card por página, con `og:image` absoluta (1200×627).
- [ ] Imagen OG por defecto cuando el contenido no tenga portada.
- [ ] Un feed RSS por idioma, enlazado desde el `<head>`.
- [ ] `sitemap.xml` con ambos idiomas y `robots.txt` que lo referencia.
- [ ] Vercel Web Analytics y Speed Insights activos, sin cookies.

## Fuera de alcance

- Generación automática de imágenes OG por post (se trata en 007).
- Herramientas de analítica de terceros (Google Analytics, etc.).

## Preguntas abiertas

- Ninguna por ahora.
