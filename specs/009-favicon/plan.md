# Plan 009 — Favicon

- **Spec:** [spec.md](./spec.md)
- **Estado:** Aprobado

## Enfoque técnico

### Diseño (SVG a mano)

- **Fuente única:** `src/assets/favicon-source.svg`, viewBox 64×64: tarjeta redondeada (`rx` ≈ 14), «LG» dibujadas con trazos (`path`, no `<text>`: así no dependen de ninguna fuente) y una pata de perro (una almohadilla y cuatro dedos, círculos y elipses) en la esquina inferior derecha.
- **Colores:** variables CSS en un `<style>` dentro del SVG, con `@media (prefers-color-scheme: dark)` para el modo oscuro: claro = fondo `#1d4ed8` y letras `#ffffff`; oscuro = fondo `#93c5fd` y letras `#0b1220`. Los contrastes cumplen 4,5:1 (se comprueba en una prueba unitaria).
- **Variante pequeña:** `src/assets/favicon-small.svg`, solo «LG» (sin pata), para el `.ico`, que se muestra a 16 y 32 px. Si al revisar el render a 16 px la pata del SVG principal no se distingue, el `.ico` ya cubre el caso; el SVG sigue llevándola porque los navegadores lo escalan a la pantalla real.

### Generación de formatos (`scripts/generate-favicons.mjs`)

- Script de npm `npm run icons`. Usa `sharp` (ya instalado) para renderizar el SVG a PNG y escribe en `public/`:
  - `favicon.svg` (copia del fuente, con modo oscuro).
  - `favicon.ico`: contenedor ICO con PNG de 16 y 32 px de la variante pequeña. `sharp` no escribe ICO, pero el formato es una cabecera de 6 bytes más un directorio de 16 bytes por imagen y los PNG tal cual; `buildIco()` (exportada y probada) lo monta sin dependencias.
  - `apple-touch-icon.png` (180×180), `icon-192.png` y `icon-512.png`, desde el SVG principal en claro y con la tarjeta rellena hasta el borde (iOS aplica su propio recorte; el `.png` no lleva transparencia).
- Los archivos generados **se versionan**: el build de Vercel no ejecuta el script, así que no depende de `sharp` para los iconos. Una prueba unitaria regenera en memoria y comprueba que lo versionado coincide con la fuente (si cambia el SVG y nadie ejecuta `npm run icons`, falla).

### Manifest

- `public/manifest.webmanifest`: `name` «Luis González», `short_name` «lgonzalez.dev», `start_url` `/`, `display` `browser`, `theme_color` `#1d4ed8`, `background_color` `#ffffff` e iconos de 192 y 512 (`purpose: any`). Un solo manifest para ES y EN (los textos son un nombre propio).

### `<head>` (`BaseHead.astro`)

- Sustituye las dos líneas actuales por:
  - `<link rel="icon" href="/favicon.ico" sizes="32x32" />`
  - `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`
  - `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`
  - `<link rel="manifest" href="/manifest.webmanifest" />`
- Rutas absolutas desde la raíz, sin depender del idioma; `BaseHead` ya lo usan todas las páginas, 404 incluida.

## Archivos afectados

- `src/assets/favicon-source.svg`, `src/assets/favicon-small.svg` — crear — diseño
- `scripts/generate-favicons.mjs` — crear — generación y `buildIco()`
- `public/favicon.svg`, `public/favicon.ico` — reemplazar; `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/manifest.webmanifest` — crear
- `src/components/BaseHead.astro` — modificar — enlaces
- `package.json` — modificar — script `icons`
- `tests/unit/009-favicon/*`, `tests/e2e/009-favicon/*` — crear
- `AGENTS.md`, `.claude/rules/tooling.md` — modificar — script `icons`, estructura, flujo para cambiar el icono
- `specs/README.md` — modificar — fila 009

## Dependencias nuevas

- Ninguna (`sharp` ya está; el ICO se escribe a mano).

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                             |
| ---------------------- | -------- | ---------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Archivos estáticos; un script local, sin servicios               |
| 2. Dueño de los datos  | ✅       | Diseño y fuente versionados en el repo                           |
| 3. Bilingüe            | ✅       | Mismos iconos en ES y EN; manifest con nombre propio             |
| 4. Rendimiento / a11y  | ✅       | Iconos pequeños; contraste verificado; sin impacto en Lighthouse |
| 5. Privacidad          | ✅       | Sin peticiones externas                                          |
| 6. Cero JS por defecto | ✅       | Sin JS en cliente                                                |
| 7. Spec = verdad       | ✅       | Preguntas abiertas resueltas (P1–P3)                             |
| 8. URLs estables       | ✅       | `/favicon.svg` y `/favicon.ico` conservan su URL                 |
| 9. Todo se prueba      | ✅       | Ver trazabilidad                                                 |

## Riesgos

- La pata o las letras no se leen a 16 px → `.ico` con la variante pequeña (solo «LG») y revisión visual del render a 16, 32 y 180 px antes de dar el diseño por bueno.
- `.ico` mal formado → prueba unitaria que lee la cabecera y comprueba que `sharp` decodifica cada imagen; prueba funcional que lo descarga.
- Los navegadores cachean el favicon mucho tiempo → es normal; se ve el cambio tras recargar sin caché. Sin acción de código.
- El SVG con `prefers-color-scheme` se aplica al esquema del sistema, no al botón de tema del sitio → es lo esperado para un favicon (la pestaña sigue al navegador).
- Safari no usa el SVG y toma el `.ico` o el icono de Apple → cubierto con ambos.
- Los PNG versionados se desincronizan del SVG → prueba de coincidencia fuente ↔ generados.

## Estrategia de pruebas

- **Unitarias** (`tests/unit/009-favicon/`):
  - `source.test.ts` — el SVG es XML válido, sin rastro de Astro, con `prefers-color-scheme: dark`, con el grupo de la pata; contraste ≥ 4,5:1 de letras sobre tarjeta en claro y oscuro.
  - `generated.test.ts` — con `sharp`: `apple-touch-icon.png` 180×180, `icon-192.png`, `icon-512.png` correctos y sin transparencia total ni blanco total; el `.ico` tiene cabecera válida con entradas de 16 y 32 px que `sharp` decodifica; `buildIco()` con entradas de prueba; lo versionado coincide con lo que genera el script.
  - `manifest.test.ts` — JSON válido, campos obligatorios, iconos existentes en `public/` con el tamaño declarado.
  - `base-head.test.ts` — Container API: `BaseHead` incluye los cuatro enlaces y ya no el icono por defecto.
- **Funcionales** (`tests/e2e/009-favicon/`, ES y EN):
  - `icons.spec.ts` — portada, un artículo y la 404 (ES y EN): el `<head>` enlaza icono, SVG, icono de Apple y manifest; cada ruta responde 200 con el `Content-Type` correcto; el manifest se descarga y sus iconos responden 200.
  - `dark-mode.spec.ts` — se abre `/favicon.svg` con `colorScheme: 'light'` y `'dark'` y la captura muestra colores distintos (fondo azul oscuro frente a claro) y no está en blanco.

### Trazabilidad criterio → prueba

| Criterio de aceptación                      | Prueba unitaria                         | Prueba funcional    |
| ------------------------------------------- | --------------------------------------- | ------------------- |
| Diseño propio, sin logo de Astro            | `source.test.ts`                        | `icons.spec.ts`     |
| Legible a 16 y 32 px                        | `generated.test.ts` (ICO 16/32)         | Revisión manual     |
| `favicon.svg` con modo claro/oscuro         | `source.test.ts`                        | `dark-mode.spec.ts` |
| `.ico`, icono de Apple, 192 y 512           | `generated.test.ts`                     | `icons.spec.ts`     |
| Manifest válido y enlazado                  | `manifest.test.ts`, `base-head.test.ts` | `icons.spec.ts`     |
| Enlaces en todas las páginas, respuesta 200 | `base-head.test.ts`                     | `icons.spec.ts`     |
| Un único SVG fuente y script `icons`        | `generated.test.ts` (coincidencia)      | —                   |
| Sin dependencias, JS ni peticiones externas | `base-head.test.ts`                     | `icons.spec.ts`     |
| Lighthouse ≥ 95                             | —                                       | Verificación manual |

## Verificación

- `npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Manual: ver el favicon real en la pestaña (claro y oscuro) y el icono de iOS en la vista de la preview de Vercel; revisar el render a 16, 32 y 180 px.
- Lighthouse ≥ 95 en portada y un artículo (ES y EN).

## Ajustes durante la implementación

- Los iconos de Apple, 192 y 512 se generan con la tarjeta cuadrada (`rx="0"`): la plataforma aplica su propio redondeo y así no hay esquinas transparentes. El `favicon.svg` conserva la tarjeta redondeada.
- La prueba funcional del modo oscuro usa un viewport de 256 px y muestrea un píxel dentro de la tarjeta (Chromium no renderiza un SVG a 64 px exactos).
- `BaseHead` se prueba con la Container API configurando `site` (necesario para las URLs absolutas de `buildMeta`).
