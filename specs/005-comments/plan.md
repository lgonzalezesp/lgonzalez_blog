# Plan 005 — Comentarios (Giscus)

- **Spec:** [spec.md](./spec.md)
- **Estado:** Aprobado

## Requisitos previos (manuales, antes de implementar)

Comprobado el 2026-10-02: el repo es público, pero **Discussions está desactivado** y no hay categorías.

1. Activar Discussions en `lgonzalezesp/lgonzalez_blog` (Settings → General → Features, o `gh repo edit --enable-discussions`).
2. Crear la categoría **Comments** de tipo **Announcement** (solo el autor y Giscus abren hilos; los lectores responden).
3. Instalar la app [Giscus](https://github.com/apps/giscus) solo en ese repo.
4. Obtener `categoryId` con `gh api graphql` (lo hago yo cuando existan la categoría y la app). El `repoId` ya se conoce: `R_kgDOU4DNYA`.

## Enfoque técnico

### Configuración (`src/consts.ts`)

`GISCUS = { repo: 'lgonzalezesp/lgonzalez_blog', repoId: 'R_kgDOU4DNYA', category: 'Comments', categoryId: 'DIC_…' }`. Los ids son públicos (aparecen en el HTML de cualquier sitio con Giscus), así que no van en variables de entorno.

### Lógica pura (`src/lib/giscus.ts`), probada con Vitest

- `giscusAttributes({ lang, theme })` → atributos `data-*` del script oficial:
  - `repo`, `repo-id`, `category`, `category-id` desde `GISCUS`.
  - `mapping: 'pathname'` + `strict: '1'`: un hilo por URL, sin coincidencias parciales (`/blog/astro/` ≠ `/blog/astro-2/`). Como las traducciones tienen URL distinta, tienen hilos separados.
  - `lang`: `es` / `en`; `theme`: `light` / `dark`.
  - `reactions-enabled: '1'`, `emit-metadata: '0'`, `input-position: 'bottom'`, `loading: 'lazy'`.
- `giscusThemeMessage(theme)` → `{ giscus: { setConfig: { theme } } }`, el mensaje que acepta el iframe de Giscus.
- `GISCUS_ORIGIN = 'https://giscus.app'`.

### Componente `Comments.astro`

- `<section id="comments" aria-labelledby="comments-title">` con el título «Comentarios» / «Comments» y un `<noscript>` traducido («Activa JavaScript para ver y escribir comentarios»).
- Los atributos se serializan en el HTML (`data-giscus='{…}'`, sin el tema, que depende del lector).
- Script del componente (procesado por Astro, se incluye solo en las páginas con comentarios):
  - **Carga diferida real:** un `IntersectionObserver` (margen de 200 px) inserta `https://giscus.app/client.js` solo cuando la sección se acerca a la pantalla. Así no se pide nada a giscus.app al cargar el artículo; el `data-loading="lazy"` de Giscus solo difiere el iframe, no el script.
  - **Tema inicial:** el tema activo del sitio (`data-theme` o la preferencia del sistema).
  - **Sincronización:** escucha el evento `themechange` que emitirá `ThemeToggle` (y el cambio de preferencia del sistema) y envía `giscusThemeMessage` al iframe con `postMessage(…, GISCUS_ORIGIN)`.
- `ThemeToggle.astro`: tras cambiar el tema, emite `document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))`. Desacopla el botón de los comentarios.

### Dónde se muestran

Al final de cada **artículo** y de cada **proyecto** (respuesta a la pregunta abierta, ver P1). No en notas, listados ni páginas de sección.

### Privacidad y rendimiento

- Giscus es la excepción a «sin scripts de terceros» aprobada en la constitución. Solo se carga si el lector llega a los comentarios.
- Lighthouse no se ve afectado: en la carga inicial no hay petición a giscus.app (lo comprueba una prueba).

## Archivos afectados

- `src/consts.ts` — modificar — `GISCUS`
- `src/lib/giscus.ts` — crear
- `src/components/Comments.astro` — crear
- `src/components/ThemeToggle.astro` — modificar — evento `themechange`
- `src/layouts/BlogPost.astro`, `src/layouts/Project.astro` — modificar — prop `comments` (activada en artículos y proyectos)
- `src/pages/blog/[...slug].astro`, `en/blog/[...slug].astro`, `proyectos/[...slug].astro`, `en/projects/[...slug].astro` — modificar
- `src/i18n/ui.ts` — modificar — `comments.title`, `comments.noscript`
- `tests/unit/005-comments/*`, `tests/e2e/005-comments/*` — crear
- `AGENTS.md`, `.claude/rules/astro-ui.md` — modificar — segunda excepción de JS (comentarios) y cómo se prueban sin red

## Dependencias nuevas

- Ninguna (`client.js` de Giscus se carga desde giscus.app en el navegador del lector; no es un paquete npm).

## Validación contra la constitución

| Principio              | ¿Cumple? | Nota                                                                               |
| ---------------------- | -------- | ---------------------------------------------------------------------------------- |
| 1. Simplicidad         | ✅       | Sin backend: Discussions guarda los comentarios                                    |
| 2. Dueño de los datos  | ✅       | Los comentarios viven en el repo del autor (Discussions)                           |
| 3. Bilingüe            | ✅       | Interfaz de Giscus en el idioma de la página; hilos separados por idioma           |
| 4. Rendimiento / a11y  | ✅       | Carga solo al llegar a la sección; sección con título y `noscript`                 |
| 5. Privacidad          | ✅       | Excepción aprobada (Giscus); nada se carga si el lector no llega a los comentarios |
| 6. Cero JS por defecto | ⚠️       | Excepción justificada: un script pequeño que carga Giscus bajo demanda             |
| 7. Spec = verdad       | ✅       | Pregunta abierta resuelta (P1)                                                     |
| 8. URLs estables       | ✅       | El hilo depende de la URL: cambiar una URL publicada exige redirección (ya regla)  |
| 9. Todo se prueba      | ✅       | Ver trazabilidad; la red de giscus.app se intercepta                               |

## Decisiones (aprobadas con el plan)

- **P1 — Dónde hay comentarios:** artículos y proyectos; no en notas.
- **P2 — Categoría «Comments» de tipo Announcement:** los lectores no pueden abrir hilos sueltos desde GitHub; solo comentar en los que crea Giscus.
- **P3 — Mapeo estricto por URL** (`pathname` + `strict`): consecuencia, si una URL publicada cambia, su hilo queda huérfano salvo que se renombre la discusión (refuerza el principio 8).
- **P4 — ¿Activo yo Discussions** con `gh repo edit --enable-discussions`? La categoría y la app de Giscus tienes que crearlas/instalarlas tú desde la web de GitHub.

## Ajustes durante la implementación

- `src/lib/giscus-theme.ts` separa lo que usa el navegador (origen, URL del script y mensaje de tema) de `giscus.ts`, para que el script del cliente no incluya `consts.ts` ni el diccionario.
- Todas las e2e bloquean la red externa (`--host-resolver-rules` en `playwright.config.ts`): un artículo corto ya muestra los comentarios al cargar y, sin el bloqueo, las pruebas de 001–004 habrían llamado a giscus.app.
- La prueba de accesibilidad excluye el iframe simulado (es contenido de un tercero).

## Riesgos

- Sin `categoryId` real no se puede terminar → una prueba unitaria exige un id con formato `DIC_…`; la tarea queda bloqueada hasta completar los requisitos previos.
- El iframe de Giscus ignora mensajes con un origen distinto → `postMessage` siempre con `GISCUS_ORIGIN`; prueba funcional con un iframe simulado servido en `https://giscus.app` (interceptado).
- Giscus cambia sus atributos → se usan solo los documentados en giscus.app; prueba unitaria fija el contrato.
- La sección queda visible al cargar en artículos muy cortos (y entonces Giscus sí se carga al inicio) → es el comportamiento correcto; la prueba de carga diferida usa un artículo largo y un viewport bajo.

## Estrategia de pruebas

- **Unitarias** (`tests/unit/005-comments/`):
  - `giscus.test.ts` — atributos completos para ES/EN y claro/oscuro; `strict` y `pathname`; ids con formato válido (`R_…`, `DIC_…`); mensaje de tema para claro y oscuro.
  - `comments.test.ts` — Container API: sección con `id="comments"`, título y `noscript` traducidos, `data-giscus` con la configuración.
- **Funcionales** (`tests/e2e/005-comments/`, toda la red de `giscus.app` interceptada con `page.route`; `client.js` simulado que inserta un iframe en `https://giscus.app/…`, también simulado):
  - `comments.spec.ts` — artículo y proyecto muestran la sección al final; notas, listados y portada no.
  - `lazy.spec.ts` — al cargar un artículo largo no hay peticiones a giscus.app; al hacer scroll hasta la sección, sí.
  - `lang-theme.spec.ts` — `data-lang` es `es` en ES y `en` en EN; `data-theme` según el tema activo; al pulsar el botón de tema el iframe recibe `{ giscus: { setConfig: { theme } } }`.
  - `a11y.spec.ts` — axe en un artículo con la sección de comentarios.

### Trazabilidad criterio → prueba

| Criterio de aceptación                     | Prueba unitaria                        | Prueba funcional                   |
| ------------------------------------------ | -------------------------------------- | ---------------------------------- |
| Sección al final de cada post (y proyecto) | `comments.test.ts`                     | `comments.spec.ts`                 |
| Un hilo por post, traducciones separadas   | `giscus.test.ts` (`pathname`+`strict`) | `lang-theme.spec.ts` (atributos)   |
| Idioma de Giscus = idioma de la página     | `giscus.test.ts`                       | `lang-theme.spec.ts`               |
| Tema sincronizado, también al cambiarlo    | `giscus.test.ts` (mensaje)             | `lang-theme.spec.ts`               |
| Carga diferida                             | —                                      | `lazy.spec.ts`                     |
| Comentarios en la categoría «Comments»     | `giscus.test.ts` (categoría e id)      | Verificación manual tras el deploy |

## Verificación

- `npm run check && npm run lint && npm run format:check && npm test` en local y en CI.
- Manual en local (`npm run dev`): la sección carga Giscus real al hacer scroll, en ES y EN, y cambia de tema con el botón.
- Manual tras el deploy (spec 008): publicar un comentario de prueba y verlo en Discussions → Comments.
- Lighthouse ≥ 95 en un artículo y un proyecto (ES y EN).
