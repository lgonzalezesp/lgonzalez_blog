# AGENTS.md — lgonzalez.dev

Instrucciones para cualquier agente de IA (Claude Code, Copilot, Cursor, Codex…) que trabaje en este repositorio.

Este archivo es la fuente canónica. `.claude/rules/` lo detalla por tema y ruta para Claude Code; si algo cambia aquí, actualiza también la regla afectada (y al revés).

## Proyecto

Blog personal de Luis González en **lgonzalez.dev**: proyectos, ideas, comentarios y notas.

- Idiomas: **español (por defecto, sin prefijo)** e **inglés (bajo `/en/`)**.
- Repositorio: https://github.com/lgonzalezesp/lgonzalez_blog (público, necesario para Giscus).
- Ramas `main` y `develop` protegidas: solo PR con el check `CI` en verde; `develop` es la rama por defecto.
- Hosting: Vercel (salida estática). Producción = rama `main`; `develop` = preview estable; previews en cada PR.
- Flujo de ramas: **Gitflow**. Gestor de paquetes: **npm**.

## Stack

- **Astro** + **MDX** + **Content Collections** (esquemas validados)
- **TypeScript** en modo estricto
- **Tailwind CSS**
- **Shiki** para resaltado de código (incluido en Astro)
- **Giscus** para comentarios (GitHub Discussions)
- **Vercel Web Analytics** y **Speed Insights** (sin cookies)
- **Vitest** + **Astro Container API** para pruebas unitarias
- **Playwright** (+ **axe-core**) para pruebas funcionales y de accesibilidad
- **GitHub Actions** para ejecutar las pruebas en cada PR

## Metodología: Spec-Driven Development (SDD)

Este proyecto se gobierna por especificaciones. **La spec es la fuente de verdad.**

1. Lee siempre `specs/constitution.md` antes de proponer o implementar algo.
2. **Nunca implementes una feature** sin que exista en `specs/NNN-nombre/`:
   - `spec.md` — qué y por qué (historias de usuario, criterios de aceptación, fuera de alcance).
   - `plan.md` — cómo (decisiones técnicas, archivos afectados, riesgos), validado contra la constitución.
   - `tasks.md` — checklist de tareas pequeñas y verificables.
3. Flujo por feature: **Specify → Plan → Tasks → Implement → Review**.
   - Usa las plantillas de `specs/_templates/`.
   - Pide aprobación de `spec.md` antes de escribir `plan.md`, y de `plan.md` antes de `tasks.md`.
   - Al implementar, sigue `tasks.md` en orden y marca cada tarea con `[x]` al terminarla.
   - No avances si un criterio de aceptación falla.
4. Si algo que se pide **no está en la spec**, no lo implementes directamente: pregunta o propone primero un cambio a la spec.
5. Si durante la implementación la realidad difiere de la spec, **actualiza la spec** en el mismo cambio para que código y spec coincidan.

El índice de features y su estado está en `specs/README.md`.

## Pruebas (obligatorias en cada spec)

Cada spec debe crear **pruebas unitarias del código** y **pruebas funcionales del comportamiento**:

- **Unitarias (Vitest):** utilidades, esquemas de contenido, diccionarios i18n y componentes `.astro` renderizados con la Astro Container API. Prueban la lógica de forma aislada y rápida.
- **Funcionales (Playwright):** recorren el sitio construido en un navegador real como lo haría un lector (navegar, cambiar idioma, modo oscuro, compartir, comentar…). Incluyen comprobaciones de accesibilidad con axe-core.

Reglas:

1. **Cada criterio de aceptación de `spec.md` tiene al menos una prueba** que lo verifica. La sección "Pruebas" de la spec y la tabla de trazabilidad de `plan.md` lo documentan.
2. **Pruebas primero:** en `tasks.md`, las tareas de pruebas van antes o junto a la implementación que cubren; una prueba se ve fallar antes de hacerla pasar.
3. Todo lo que dependa del idioma se prueba en **ES y EN**.
4. Las pruebas no usan red externa: los servicios de terceros (Giscus, LinkedIn) se verifican por el HTML/URL generados, no llamándolos.
5. Nunca borres, desactives ni marques como `skip` una prueba para conseguir un build en verde; si la prueba está mal, corrígela y explica por qué.
6. Una corrección de bug incluye una prueba que reproduce el bug.

Ubicación:

```
tests/
  unit/<NNN-feature>/        # *.test.ts (Vitest)
  e2e/<NNN-feature>/         # *.spec.ts (Playwright)
  fixtures/                  # contenido de prueba
```

## Estructura del repositorio

Las rutas marcadas con _(NNN)_ aún no existen; se crean en esa spec.

```
AGENTS.md                 # este archivo (canónico)
CLAUDE.md                 # importa AGENTS.md para Claude Code
.claude/rules/            # reglas de Claude Code por tema/ruta (detallan AGENTS.md, no lo sustituyen)
specs/
  constitution.md         # principios no negociables
  README.md               # índice de features y estado
  _templates/             # plantillas spec/plan/tasks
  NNN-nombre/             # una carpeta por feature
src/
  consts.ts               # título y descripción del sitio
  content.config.ts       # colecciones blog, projects y notes (glob por idioma)
  content/
    schemas.ts            # esquemas Zod del frontmatter (probados con Vitest)
    blog/{es,en}/         # artículos → /blog/<slug>/ y /en/blog/<slug>/
    projects/{es,en}/     # fichas de proyectos (sin ruta hasta 004)
    notes/{es,en}/        # notas cortas → /notas/<slug>/ y /en/notes/<slug>/
  lib/
    content.ts            # utilidades puras: idioma, slug, borradores, orden, traducciones
    collections.ts        # getPublished() y entryPaths(): único acceso a las colecciones
  assets/                 # imágenes y fuentes procesadas por Astro
  components/             # componentes .astro
  layouts/                # layouts de página
  pages/                  # rutas (es en raíz, en bajo /en/ desde 003)
  i18n/                   # diccionarios de UI y utilidades de idioma (003)
  styles/global.css       # estilos globales + import de Tailwind
public/                   # estáticos servidos tal cual (favicon, robots.txt…)
tests/
  unit/NNN-feature/       # Vitest (*.test.ts)
  e2e/NNN-feature/        # Playwright (*.spec.ts)
  fixtures/               # contenido de prueba (p. ej. invalid-content/: mini-proyecto con frontmatter inválido)
astro.config.mjs          # site, integraciones, Tailwind (plugin de Vite), fuentes
vitest.config.ts          # Vitest sobre la config de Vite de Astro
playwright.config.ts      # e2e sobre build + preview en :4322 (nunca el dev server)
eslint.config.js          # ESLint (flat config)
.prettierrc.json          # Prettier (+ plugin de Astro)
.nvmrc                    # versión de Node (24 LTS)
.github/workflows/ci.yml  # CI: check + lint + formato + pruebas
```

## Notas de Astro

- Astro 7. Documentación: https://docs.astro.build — consulta la guía correspondiente antes de tocar [rutas](https://docs.astro.build/en/guides/routing/), [componentes](https://docs.astro.build/en/basics/astro-components/), [content collections](https://docs.astro.build/en/guides/content-collections/), [estilos/Tailwind](https://docs.astro.build/en/guides/styling/) o [i18n](https://docs.astro.build/en/guides/internationalization/).
- Cuando detecta que lo ejecuta un agente de IA, `astro dev` y `astro preview` arrancan **en segundo plano**. Gestiónalos con `astro dev stop|status|logs` (igual con `preview`). Para forzar primer plano usa `--ignore-lock` (así lo hace `playwright.config.ts`).
- Tailwind 4 se integra con `@tailwindcss/vite` e `@import 'tailwindcss'` en `src/styles/global.css`; no hay `tailwind.config.*`.
- Componentes en la Container API para pruebas: `experimental_AstroContainer` de `astro/container`.

## Gestor de paquetes: npm

- Usa **solo npm**. No uses pnpm, yarn ni bun, ni generes sus lockfiles.
- `package-lock.json` siempre se commitea y nunca se edita a mano.
- Instalación limpia (CI y verificación): `npm ci`. Añadir dependencias: `npm install <paquete>` (`-D` si es de desarrollo), justificándolo en el `plan.md` de la spec.
- Versión de Node fijada en `.nvmrc` y en `engines` de `package.json`.

## Flujo de ramas: Gitflow

| Rama                 | Sale de   | Se mergea a        | Uso                                                                                        |
| -------------------- | --------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `main`               | —         | —                  | Producción. Solo recibe merges de `release/*` y `hotfix/*`. Cada merge lleva tag `vX.Y.Z`. |
| `develop`            | `main`    | —                  | Integración. Base de todo el trabajo nuevo.                                                |
| `feature/NNN-nombre` | `develop` | `develop`          | Una por spec (p. ej. `feature/003-i18n`).                                                  |
| `release/X.Y.Z`      | `develop` | `main` y `develop` | Preparar una versión: solo ajustes, changelog y versión.                                   |
| `hotfix/X.Y.Z`       | `main`    | `main` y `develop` | Correcciones urgentes en producción.                                                       |

Reglas:

- **Nunca** se hace commit directo en `main` ni en `develop`; todo entra por Pull Request con CI en verde.
- Las `feature/*` se mergean a `develop` con squash; `release/*` y `hotfix/*` con merge commit para conservar el historial.
- Antes de abrir la PR, actualiza tu rama con `develop` (rebase) y ejecuta `npm test`.
- Versionado semántico: `MAJOR.MINOR.PATCH`. Una spec terminada suele ser `MINOR`; un hotfix, `PATCH`.
- Borra la rama tras el merge.
- Mensajes de commit con Conventional Commits (ver Convenciones).

## Comandos

| Acción                               | Comando                |
| ------------------------------------ | ---------------------- |
| Instalar dependencias                | `npm ci`               |
| Servidor de desarrollo               | `npm run dev`          |
| Build de producción                  | `npm run build`        |
| Previsualizar build                  | `npm run preview`      |
| Tipos + esquemas de contenido        | `npm run check`        |
| Lint                                 | `npm run lint`         |
| Formato                              | `npm run format`       |
| Comprobar formato (CI)               | `npm run format:check` |
| Pruebas unitarias                    | `npm run test:unit`    |
| Pruebas funcionales (sobre el build) | `npm run test:e2e`     |
| Todas las pruebas                    | `npm test`             |

> Si cambian los scripts de `package.json`, actualiza esta tabla.

## Convenciones

- Rutas, contenido, utilidades y pruebas en **kebab-case**; componentes y layouts `.astro` en **PascalCase** (convención de Astro).
- Todo contenido lleva **frontmatter validado por esquema**; nunca desactives la validación.
- Las traducciones de un mismo post comparten el campo `translationKey`.
- **Ningún texto de UI hardcodeado**: todo pasa por el diccionario de `src/i18n/`, en ES y EN.
- Imágenes con el componente de imágenes de Astro y **`alt` obligatorio**.
- **Cero JS en cliente por defecto**; usa islas solo si aportan valor y justifícalo en `plan.md`.
- Commits con **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`…), referenciando la spec cuando aplique (p. ej. `feat(003-i18n): selector de idioma`).
- **Una rama por spec**: `feature/NNN-nombre` desde `develop`, mergeada a `develop` vía PR (ver Gitflow).

## Definición de "hecho"

Una feature está terminada solo si:

- [ ] `npm run build` y `npm run check` pasan sin errores.
- [ ] Existen pruebas unitarias y funcionales para la feature, y `npm test` pasa en local y en CI.
- [ ] Todos los criterios de aceptación de su `spec.md` se cumplen y cada uno está cubierto por una prueba.
- [ ] Funciona en **ambos idiomas** (ES y EN).
- [ ] Lighthouse ≥ 95 en rendimiento, accesibilidad, buenas prácticas y SEO en las páginas afectadas.
- [ ] `tasks.md` está completo y `specs/README.md` refleja el nuevo estado.

## Lo que NO debes hacer

- Añadir dependencias sin justificarlo en el `plan.md` de la feature.
- Introducir backend, base de datos o funciones serverless sin una spec aprobada que lo justifique.
- Añadir scripts de terceros o cookies de seguimiento (los comentarios de Giscus son la excepción aprobada).
- Romper URLs ya publicadas (si una ruta cambia, añade redirección).
- Publicar contenido con `draft: true` en producción.
- Hacer `push` a `main` o `develop`, crear tags o desplegar sin que el usuario lo pida.
- Commitear directamente en `main` o `develop`.
- Usar otro gestor de paquetes que no sea npm.
- Dar una feature por terminada sin pruebas, o saltarse/desactivar pruebas que fallan.
