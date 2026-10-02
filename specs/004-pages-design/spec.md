# Spec 004 — Páginas y diseño

- **Estado:** En revisión ([PR #4](https://github.com/lgonzalezesp/lgonzalez_blog/pull/4))
- **Rama:** `feature/004-pages-design`

## Contexto / Por qué

El blog necesita una presentación minimalista, legible y accesible que ponga el foco en el contenido y en los proyectos.

## Historias de usuario

- Como **lector**, quiero ver en la portada lo último publicado y los proyectos destacados.
- Como **lector**, quiero navegar los artículos por fecha y por etiqueta.
- Como **lector**, quiero leer cómodamente en móvil y en modo oscuro.
- Como **lector**, quiero saber cuánto tarda en leerse un artículo y saltar entre sus secciones.

## Criterios de aceptación

- [x] Páginas: Inicio, Blog (paginado), Post, Proyectos (grid), Detalle de proyecto, Notas, Etiquetas, Sobre mí, 404 — en ES y EN.
- [x] Componentes: cabecera, pie, tarjeta de post, tarjeta de proyecto, selector de idioma, toggle claro/oscuro, tabla de contenidos, tiempo de lectura.
- [x] Modo oscuro respeta la preferencia del sistema y recuerda la elección del lector.
- [x] Bloques de código con resaltado de sintaxis.
- [x] Imágenes optimizadas, con `alt`.
- [x] Responsive desde 320 px, sin scroll horizontal.
- [x] WCAG 2.1 AA (contraste, foco visible, navegación por teclado).
- [x] Lighthouse ≥ 95 en todas las categorías.

## Pruebas

### Unitarias (Vitest)

- [x] Cálculo del tiempo de lectura (texto vacío, corto, largo; mínimo 1 minuto).
- [x] Generación de la tabla de contenidos a partir de los encabezados.
- [x] Paginación: número de páginas, elementos por página, página fuera de rango.
- [x] Agrupación de contenido por etiqueta.
- [x] Componentes (Container API): tarjeta de post y de proyecto renderizan título, fecha, etiquetas y enlaces; las imágenes llevan `alt`.

### Funcionales (Playwright)

- [x] Todas las páginas listadas responden 200 en ES y EN.
- [x] Navegación desde la cabecera a cada sección y desde una tarjeta al detalle.
- [x] Paginación del blog y filtrado por etiqueta funcionan.
- [x] Modo oscuro: respeta la preferencia del sistema, el toggle cambia el tema y la elección persiste al recargar.
- [x] Móvil (320 px) y escritorio: sin scroll horizontal; menú usable en móvil.
- [x] Navegación completa por teclado con foco visible.
- [x] axe-core sin violaciones graves en cada tipo de página.

## Fuera de alcance

- Búsqueda (mejora futura con Pagefind).
- Posts relacionados y series.

## Preguntas abiertas

- Ninguna. Resueltas en el plan (P2, P3): Atkinson Hyperlegible con neutros y acento azul; «Sobre mí» en Markdown (`src/content/pages/`) con foto opcional, y GitHub y RSS en el pie (LinkedIn en 007).
