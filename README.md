# lgonzalez.dev

Blog personal de Luis González sobre proyectos, ideas y notas. Publicado en **https://lgonzalez.dev**, en español (por defecto) e inglés (`/en/`).

Es un sitio **estático** hecho con Astro y desplegado en Vercel. El contenido vive en Markdown dentro de este repositorio; no hay servidor ni base de datos.

## Qué incluye

Cada apartado corresponde a una especificación de [`specs/`](./specs/README.md), que es la fuente de verdad de lo que hace el sitio.

| #   | Qué es                     | Qué aporta                                                                                                                                                                                                                      |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001 | **Setup**                  | Astro 7, MDX, Tailwind CSS 4, TypeScript estricto, ESLint y Prettier. Pruebas con Vitest y Playwright. CI en GitHub Actions. Solo npm.                                                                                          |
| 002 | **Modelo de contenido**    | Colecciones `blog`, `projects`, `notes` y `pages` con frontmatter validado por esquema. Borradores (`draft`), traducciones enlazadas por `translationKey`, notas con título, fecha y etiquetas obligatorios.                    |
| 003 | **Internacionalización**   | Español en la raíz e inglés bajo `/en/`. Textos de interfaz en un diccionario tipado. Selector de idioma que lleva a la traducción del contenido, `hreflang` y fechas por idioma.                                               |
| 004 | **Páginas y diseño**       | Portada, blog paginado, artículos con tiempo de lectura y tabla de contenidos, proyectos, notas, etiquetas, «Sobre mí» y 404. Modo claro/oscuro, código resaltado con Shiki, responsive desde 320 px y accesible (WCAG 2.1 AA). |
| 005 | **Comentarios**            | [Giscus](https://giscus.app) sobre GitHub Discussions en artículos y proyectos, en el idioma y tema de la página. Se carga solo cuando el lector llega a los comentarios.                                                       |
| 006 | **SEO, feeds y analítica** | Metadatos, Open Graph y Twitter Card, URLs canónicas, RSS por idioma, sitemap y `robots.txt`. Vercel Web Analytics y Speed Insights, sin cookies.                                                                               |
| 007 | **Compartir en LinkedIn**  | Botón de compartir (un enlace, sin scripts de LinkedIn), «Copiar enlace», imagen social de 1200×627 generada en el build para el contenido sin portada y enlace al perfil del autor.                                            |
| 008 | **Despliegue**             | Vercel con producción en `main` y previews protegidas en `develop` y en cada PR. Pruebas de humo tras cada despliegue. Proceso de release y hotfix.                                                                             |
| 009 | **Favicon**                | Iniciales LG con una pata de perro, con modo oscuro. Generado desde un SVG fuente (`npm run icons`): `.ico`, icono de Apple e iconos de 192/512 con `manifest.webmanifest`.                                                     |

## Principios

Definidos en [`specs/constitution.md`](./specs/constitution.md):

1. Simplicidad: sitio estático, sin servidor.
2. El autor es dueño de sus datos: todo en Markdown dentro de Git.
3. Bilingüe desde el diseño.
4. Rendimiento y accesibilidad: Lighthouse ≥ 95 y WCAG 2.1 AA.
5. Privacidad: sin cookies de seguimiento.
6. Cero JavaScript en cliente por defecto.
7. La spec es la fuente de verdad.
8. URLs estables: si una cambia, lleva redirección.
9. Todo se prueba.

## Requisitos

- **Node 24** (ver `.nvmrc`; también sirven 22.12+ y 26+).
- **npm** (no se usan pnpm, yarn ni bun).

## Empezar

```bash
npm ci          # instalar dependencias
npm run dev     # servidor de desarrollo en http://localhost:4321
```

Los borradores (`draft: true`) se ven en `npm run dev` y en las previews de Vercel, pero no en producción.

### Comandos

| Acción                               | Comando                                                          |
| ------------------------------------ | ---------------------------------------------------------------- |
| Servidor de desarrollo               | `npm run dev`                                                    |
| Build de producción                  | `npm run build`                                                  |
| Previsualizar el build               | `npm run preview`                                                |
| Tipos y esquemas de contenido        | `npm run check`                                                  |
| Lint                                 | `npm run lint`                                                   |
| Formato (escribir / comprobar)       | `npm run format` / `npm run format:check`                        |
| Pruebas unitarias                    | `npm run test:unit`                                              |
| Pruebas funcionales (sobre el build) | `npm run test:e2e`                                               |
| Todas las pruebas                    | `npm test`                                                       |
| Regenerar favicon e iconos           | `npm run icons`                                                  |
| Humo contra un despliegue            | `SMOKE_BASE_URL=<url> npm run test:smoke`                        |
| Dominio y redirecciones (producción) | `SMOKE_BASE_URL=https://lgonzalez.dev npm run test:smoke:domain` |

## Escribir un artículo

1. Crea el archivo en la carpeta de su idioma. El nombre es la URL:
   - `src/content/blog/es/mi-post.md` → `/blog/mi-post/`
   - `src/content/blog/en/my-post.md` → `/en/blog/my-post/`
2. Añade el frontmatter y el texto:

   ```markdown
   ---
   title: 'Mi primer post'
   description: 'Resumen en una frase (listado, Google y LinkedIn).'
   pubDate: 2026-10-03
   tags: ['astro', 'ideas']
   lang: es
   translationKey: mi-primer-post
   # Opcionales: updatedDate, draft: true, cover
   ---

   Texto en **Markdown**.
   ```

3. Obligatorios: `title`, `description`, `pubDate`, `lang` (igual que la carpeta) y `translationKey` (el mismo valor en ES y EN enlaza las traducciones).
4. Portada opcional (`cover.src` y `cover.alt`): imagen de al menos **1200×627** en `src/assets/`. Sin portada se genera una imagen social con el título.
5. Revísalo con `npm run dev` y `npm run check`.

Las notas (`src/content/notes/`) llevan título, fecha y etiquetas. Los proyectos (`src/content/projects/`) y «Sobre mí» (`src/content/pages/`) siguen el mismo esquema por idioma.

## Estructura

```
src/
  content/{blog,projects,notes,pages}/{es,en}/   # contenido en Markdown/MDX
  content.config.ts, content/schemas.ts          # colecciones y esquemas
  pages/                                         # rutas (es en la raíz, en bajo /en/)
  views/, layouts/, components/                  # interfaz
  i18n/                                          # diccionario ES/EN y rutas por idioma
  lib/                                           # lógica pura (contenido, SEO, RSS, compartir…)
specs/                                           # especificaciones (SDD)
tests/{unit,e2e,smoke,fixtures}/                 # pruebas
```

El detalle completo está en [`AGENTS.md`](./AGENTS.md).

## Cómo se trabaja

### Spec-Driven Development

Ninguna feature se implementa sin `spec.md`, `plan.md` y `tasks.md` aprobados en `specs/NNN-nombre/`. El flujo es **Specify → Plan → Tasks → Implement → Review** y cada spec entrega pruebas unitarias y funcionales de todos sus criterios de aceptación.

### Pruebas

- **Unitarias (Vitest + Astro Container API):** utilidades, esquemas, diccionarios y componentes.
- **Funcionales (Playwright + axe-core):** recorren el sitio construido en un navegador real, en ES y EN, con comprobaciones de accesibilidad. No usan red externa.
- **Humo:** tras cada despliegue de Vercel, el workflow `Smoke` prueba la URL desplegada.

### Gitflow

| Rama                 | Uso                                                                 |
| -------------------- | ------------------------------------------------------------------- |
| `main`               | Producción. Solo recibe `release/*` y `hotfix/*`, con tag `vX.Y.Z`. |
| `develop`            | Integración y rama por defecto.                                     |
| `feature/NNN-nombre` | Una por spec; PR a `develop` (squash).                              |
| `release/X.Y.Z`      | Prepara una versión; PR a `main` y a `develop` (merge commit).      |
| `hotfix/X.Y.Z`       | Correcciones urgentes desde `main`.                                 |

`main` y `develop` están protegidas: solo entran por Pull Request con el check `CI` en verde. Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/).

### Despliegue

Vercel construye con `npm ci` y `npm run build` y publica `dist/`. Producción es `main`; `develop` y cada PR tienen una preview protegida. Los pasos de release y hotfix están en [`AGENTS.md`](./AGENTS.md) y los cambios por versión en [`CHANGELOG.md`](./CHANGELOG.md).

## Para agentes de IA

[`AGENTS.md`](./AGENTS.md) es la fuente canónica de instrucciones; [`CLAUDE.md`](./CLAUDE.md) lo importa y [`.claude/rules/`](./.claude/rules) lo detalla por tema.
