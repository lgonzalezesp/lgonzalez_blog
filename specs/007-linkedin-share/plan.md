# Plan 007 — Compartir en LinkedIn

- **Spec:** [spec.md](./spec.md)
- **Estado:** Borrador

## Enfoque técnico

### Botón «Compartir en LinkedIn» (sin JS ni scripts de LinkedIn)

- `linkedInShareUrl(url)` (`src/lib/share.ts`, pura): `https://www.linkedin.com/sharing/share-offsite/?url=<URL canónica codificada con encodeURIComponent>`. Es el enlace oficial; LinkedIn construye la tarjeta con las etiquetas Open Graph de 006.
- `ShareButtons.astro`: un **enlace** (no un SDK) con texto traducido («Compartir en LinkedIn» / «Share on LinkedIn»), icono SVG decorativo (`aria-hidden`), `target="_blank"` y `rel="noopener noreferrer"`, y una indicación para lectores de pantalla de que se abre en otra pestaña. Comparte la canónica de la página, así que en `/en/…` se comparte la URL en inglés.
- Se muestra **arriba** (bajo el título) y **al final** de cada artículo y proyecto, en ES y EN.

### Botón «Copiar enlace» (cuarta excepción de JS, mínima)

- `<button>` oculto (`hidden`) hasta que su script se ejecuta: sin JS no hay un botón que no funcione.
- Al pulsarlo, `navigator.clipboard.writeText(canónica)` y una región `role="status"` (`aria-live="polite"`) anuncia «Enlace copiado» / «Link copied», o «No se pudo copiar el enlace» si el navegador lo impide.
- Script del componente procesado por Astro (se incluye una vez por página, sin dependencias).

### Imagen OG generada por contenido (P3)

- Si un artículo, proyecto o nota **no tiene portada**, se genera en el build una imagen de **1200×627** con su título, la sección traducida («Blog», «Proyecto», «Nota» / «Blog», «Project», «Note») y el dominio, en el idioma del contenido y con el estilo de la imagen por defecto. Con portada se sigue usando la portada (006).
- Ruta estática: `/og/<colección>/<id>.png` (p. ej. `/og/blog/es/articulo-con-codigo.png`), generada por un endpoint de Astro con `getStaticPaths` sobre el contenido publicado.
- Generación (`src/lib/og-image.ts`): **satori** convierte el diseño (título con salto de línea automático y la fuente Atkinson del sitio, `src/assets/fonts/*.woff`) en SVG con el texto como trazos, y **sharp** (ya instalado) lo pasa a PNG. Se descartó generar el texto solo con sharp: depende de las fuentes del sistema y en Linux (CI y Vercel) puede salir sin texto o con otra fuente; satori lee el archivo de fuente directamente.
- `BaseHead`/`buildMeta` ya aceptan una imagen; las páginas de contenido le pasan la generada cuando no hay portada.

### Perfil de LinkedIn del autor (P1)

- `AUTHOR.linkedin` en `src/consts.ts` (**URL pendiente: la tiene que dar el autor**).
- Enlace en el pie (junto a GitHub y RSS) y en «Sobre mí» (lista «Encuéntrame en» / «Find me on» bajo el texto, con GitHub y LinkedIn), con `rel="me"`.

## Archivos afectados

- `src/lib/share.ts`, `src/lib/og-image.ts` — crear
- `src/components/ShareButtons.astro` — crear
- `src/pages/og/[...path].png.ts` — crear — imágenes OG generadas
- `src/layouts/BlogPost.astro`, `src/layouts/Project.astro` — modificar — botones arriba y al final; imagen OG generada sin portada
- `src/pages/notas/[...slug].astro`, `en/notes/[...slug].astro` — modificar — imagen OG generada
- `src/components/Footer.astro`, `src/views/AboutView.astro` — modificar — perfil de LinkedIn
- `src/consts.ts` — modificar — `AUTHOR` (GitHub, LinkedIn)
- `src/i18n/ui.ts` — modificar — textos de compartir, copiar, confirmación y secciones
- `package.json`, `package-lock.json` — modificar — `satori`
- `tests/unit/007-linkedin-share/*`, `tests/e2e/007-linkedin-share/*` — crear
- `AGENTS.md`, `.claude/rules/astro-ui.md` — modificar — compartir, imagen OG, cuarta excepción de JS

## Dependencias nuevas

| Paquete  | Motivo                                                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `satori` | Generar en el build las imágenes OG con el título y la fuente del sitio, con el texto convertido en trazos (sin depender de fuentes del sistema en CI/Vercel). Solo se ejecuta en el build; no llega al navegador. |

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                                                        |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Enlace oficial de compartir; imágenes generadas en el build, estáticas                      |
| 2. Dueño de los datos  | ✅       | Sin servicios externos para las imágenes                                                    |
| 3. Bilingüe            | ✅       | Textos, URL compartida e imagen generada en el idioma de la página                          |
| 4. Rendimiento / a11y  | ✅       | Sin scripts de LinkedIn; nombre accesible, aviso de pestaña nueva, confirmación en `status` |
| 5. Privacidad          | ✅       | Ni SDK ni cookies de LinkedIn (comprobado por prueba)                                       |
| 6. Cero JS por defecto | ⚠️       | Excepción justificada: script mínimo de «Copiar enlace»; compartir funciona sin JS          |
| 7. Spec = verdad       | ✅       | Preguntas abiertas resueltas (P1, P3)                                                       |
| 8. URLs estables       | ✅       | Se comparte siempre la canónica                                                             |
| 9. Todo se prueba      | ✅       | Ver trazabilidad                                                                            |

## Decisiones que necesitan tu visto bueno

- **P1 — URL de tu perfil de LinkedIn** (pregunta abierta): necesito que me la des (p. ej. `https://www.linkedin.com/in/…`).
- **P2 — «Copiar enlace» con JS mínimo** (cuarta excepción al principio 6); el botón no aparece sin JS.
- **P3 — Imágenes OG generadas** (pregunta abierta): sí, para contenido **sin portada** (artículos, proyectos y notas), con `satori` como única dependencia nueva. Con portada, se usa la portada.
- **P4 — Dónde van los botones:** artículos y proyectos, arriba y al final (no en notas). El enlace se abre en una pestaña nueva.

## Riesgos

- La URL de compartir mal codificada rompe la vista previa → `encodeURIComponent` y prueba con acentos y caracteres especiales.
- `satori` no soporta WOFF2 ni algunas propiedades CSS → se usan los `.woff` existentes y un diseño con flexbox simple; prueba unitaria que renderiza la imagen.
- Títulos muy largos se salen de la imagen → tamaño de letra según la longitud y límite de líneas con puntos suspensivos; prueba con un título largo.
- El portapapeles exige contexto seguro y permiso → en local (`localhost`) y en producción (HTTPS) se cumple; si falla, se anuncia el error. La prueba concede el permiso en Chromium.
- Más tiempo de build por imagen generada → solo se generan para contenido sin portada; medir el build antes y después.
- LinkedIn guarda en caché la tarjeta → tras el deploy, Post Inspector permite refrescarla.

## Estrategia de pruebas

- **Unitarias** (`tests/unit/007-linkedin-share/`):
  - `share.test.ts` — URL oficial con la canónica codificada (acentos, `?`, `&`, `#`, espacios).
  - `share-buttons.test.ts` — Container API: texto traducido ES/EN, `href` correcto, `target="_blank"` + `rel="noopener noreferrer"`, nombre accesible con aviso de pestaña nueva, botón de copiar `hidden` con su región `status`.
  - `og-image.test.ts` — la imagen generada es PNG de 1200×627; contiene texto (la zona del título no es un color plano); títulos distintos (y el mismo título en ES/EN con distinta sección) generan imágenes distintas; un título larguísimo no rompe la generación.
- **Funcionales** (`tests/e2e/007-linkedin-share/`):
  - `share.spec.ts` — artículos y proyectos (ES y EN) tienen el enlace arriba y al final; apunta a LinkedIn con la canónica del idioma leído; notas y listados no lo tienen; ningún script, iframe ni cookie de LinkedIn.
  - `copy-link.spec.ts` — con permiso de portapapeles, «Copiar enlace» copia la canónica y la región `status` anuncia la confirmación (ES y EN); sin JS el botón no se muestra.
  - `og-image.spec.ts` — `og:image` de un artículo sin portada apunta a `/og/…png`, responde 200 y mide 1200×627; con portada sigue siendo la portada.
  - `profile.spec.ts` — el pie y «Sobre mí» enlazan el perfil de LinkedIn (`rel="me"`) en ES y EN.
  - `a11y.spec.ts` — axe en un artículo y un proyecto con los botones.

### Trazabilidad criterio → prueba

| Criterio de aceptación                                  | Prueba unitaria                          | Prueba funcional                   |
| ------------------------------------------------------- | ---------------------------------------- | ---------------------------------- |
| Botón arriba y al final, enlace oficial con la canónica | `share.test.ts`, `share-buttons.test.ts` | `share.spec.ts`                    |
| Sin SDK, scripts ni cookies de LinkedIn                 | —                                        | `share.spec.ts`                    |
| URL del idioma leído y texto traducido                  | `share-buttons.test.ts`                  | `share.spec.ts`                    |
| Imagen OG 1200×627: portada o generada                  | `og-image.test.ts`                       | `og-image.spec.ts`                 |
| «Copiar enlace» con confirmación accesible              | `share-buttons.test.ts`                  | `copy-link.spec.ts`                |
| Perfil de LinkedIn en «Sobre mí» y en el pie            | —                                        | `profile.spec.ts`                  |
| Validado en LinkedIn Post Inspector                     | —                                        | Verificación manual tras el deploy |

## Verificación

- `npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Manual: revisar visualmente las imágenes generadas (ES y EN, título corto y largo).
- Lighthouse ≥ 95 en un artículo y un proyecto (ES y EN).
- Tras el deploy (008): LinkedIn Post Inspector con un artículo en ES y otro en EN.
