# Spec 009 — Favicon

- **Estado:** Aprobada
- **Rama:** `feature/009-favicon`

## Contexto / Por qué

El sitio usa todavía el favicon de la plantilla de Astro. Un icono propio identifica el blog en las pestañas, los marcadores, el historial y la pantalla de inicio del móvil.

El diseño son las iniciales **LG** con una **pata de perro**, en los colores de acento del sitio. Se dibuja como SVG a mano y el resto de formatos se generan a partir de él.

## Historias de usuario

- Como **lector**, quiero reconocer el blog por su icono en la pestaña y en los marcadores.
- Como **lector**, quiero que el icono se vea bien en modo claro y oscuro.
- Como **autor**, quiero un único SVG fuente del que salgan todos los formatos, para cambiar el diseño en un solo sitio.

## Criterios de aceptación

- [ ] El favicon es un diseño propio: iniciales **LG** y una pata de perro. No queda rastro del logo de Astro.
- [ ] Legible a 16×16 y a 32×32 px (las letras y la pata se distinguen).
- [ ] `favicon.svg` se adapta al modo claro/oscuro del navegador (`prefers-color-scheme`).
- [ ] Existen `favicon.ico` (32×32), `apple-touch-icon.png` (180×180) e iconos de 192×192 y 512×512 px.
- [ ] `manifest.webmanifest` válido con nombre, colores e iconos; enlazado desde el `<head>`.
- [ ] Todas las páginas (ES y EN, incluida la 404) enlazan los iconos en el `<head>` con rutas absolutas desde la raíz, y todos responden 200 con el tipo y el tamaño correctos.
- [ ] Los formatos se generan desde un único SVG fuente con un script de npm; los archivos generados se versionan.
- [ ] Sin dependencias nuevas, sin JS en cliente ni peticiones externas.
- [ ] Lighthouse ≥ 95 en las páginas afectadas.

## Pruebas

### Unitarias (Vitest)

- [ ] El SVG fuente es válido, usa `prefers-color-scheme` y no contiene el logo de Astro.
- [ ] Los PNG e ICO generados miden lo esperado (32, 180, 192 y 512 px) y no están en blanco.
- [ ] El manifest es JSON válido y sus iconos existen en `public/`.
- [ ] `BaseHead` incluye los enlaces del favicon, del icono de Apple y del manifest.

### Funcionales (Playwright)

- [ ] En ES y EN (portada, un artículo y la 404) el `<head>` enlaza los iconos y cada uno responde 200 con el `Content-Type` correcto.
- [ ] El manifest se descarga, es JSON válido y sus iconos responden 200.
- [ ] Una captura del favicon en modo claro y en modo oscuro muestra el SVG con colores distintos y legibles.

## Fuera de alcance

- Un logo completo para la cabecera o la imagen social (OG).
- Otros iconos de plataforma (Windows, Safari anclado, etc.).
- Funcionamiento sin conexión (service worker).

## Decisiones (aprobadas con la spec)

- **P1 — Colores:** tarjeta redondeada con fondo azul del sitio (`#1d4ed8` en claro, `#93c5fd` en oscuro) y letras claras u oscuras con contraste suficiente.
- **P2 — Composición:** «LG» grandes y una pata pequeña en la esquina inferior derecha. Si a 16 px la pata no se distingue, el `.ico` usa solo «LG».
- **P3 — Manifest e iconos de 192/512:** se incluyen.
