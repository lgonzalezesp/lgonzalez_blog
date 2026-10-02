# AGENTS.md — lgonzalez.dev

Instrucciones para cualquier agente de IA (Claude Code, Copilot, Cursor, Codex…) que trabaje en este repositorio.

## Proyecto

Blog personal de Luis González en **lgonzalez.dev**: proyectos, ideas, comentarios y notas.

- Idiomas: **español (por defecto, sin prefijo)** e **inglés (bajo `/en/`)**.
- Repositorio: https://github.com/lgonzalezesp/lgonzalez_blog (público, necesario para Giscus).
- Hosting: Vercel (salida estática). Producción = rama `main`; previews en cada PR.

## Stack

- **Astro** + **MDX** + **Content Collections** (esquemas validados)
- **TypeScript** en modo estricto
- **Tailwind CSS**
- **Shiki** para resaltado de código (incluido en Astro)
- **Giscus** para comentarios (GitHub Discussions)
- **Vercel Web Analytics** y **Speed Insights** (sin cookies)

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

## Estructura del repositorio

```
AGENTS.md                 # este archivo (canónico)
CLAUDE.md                 # importa AGENTS.md para Claude Code
specs/
  constitution.md         # principios no negociables
  README.md               # índice de features y estado
  _templates/             # plantillas spec/plan/tasks
  NNN-nombre/             # una carpeta por feature
src/
  content/
    blog/{es,en}/         # artículos
    projects/{es,en}/     # fichas de proyectos
    notes/{es,en}/        # notas cortas (opcional)
  content.config.ts       # esquemas de las colecciones
  components/             # componentes .astro
  layouts/                # layouts de página
  pages/                  # rutas (es en raíz, en bajo /en/)
  i18n/                   # diccionarios de UI y utilidades de idioma
  styles/
public/                   # estáticos (favicon, imágenes OG por defecto, robots.txt)
```

> La carpeta `src/` se crea en la feature `001-setup`. Mantén esta sección actualizada si la estructura cambia.

## Comandos

| Acción | Comando |
| --- | --- |
| Servidor de desarrollo | `npm run dev` |
| Build de producción | `npm run build` |
| Previsualizar build | `npm run preview` |
| Tipos + esquemas de contenido | `npm run check` |
| Lint | `npm run lint` |
| Formato | `npm run format` |

> Los scripts se definen en `001-setup`. Si cambian, actualiza esta tabla.

## Convenciones

- Archivos y rutas en **kebab-case**.
- Todo contenido lleva **frontmatter validado por esquema**; nunca desactives la validación.
- Las traducciones de un mismo post comparten el campo `translationKey`.
- **Ningún texto de UI hardcodeado**: todo pasa por el diccionario de `src/i18n/`, en ES y EN.
- Imágenes con el componente de imágenes de Astro y **`alt` obligatorio**.
- **Cero JS en cliente por defecto**; usa islas solo si aportan valor y justifícalo en `plan.md`.
- Commits con **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`…), referenciando la spec cuando aplique (p. ej. `feat(003-i18n): selector de idioma`).
- **Una rama por spec**: `feat/NNN-nombre`, mergeada a `main` vía PR.

## Definición de "hecho"

Una feature está terminada solo si:

- [ ] `npm run build` y `npm run check` pasan sin errores.
- [ ] Todos los criterios de aceptación de su `spec.md` se cumplen.
- [ ] Funciona en **ambos idiomas** (ES y EN).
- [ ] Lighthouse ≥ 95 en rendimiento, accesibilidad, buenas prácticas y SEO en las páginas afectadas.
- [ ] `tasks.md` está completo y `specs/README.md` refleja el nuevo estado.

## Lo que NO debes hacer

- Añadir dependencias sin justificarlo en el `plan.md` de la feature.
- Introducir backend, base de datos o funciones serverless sin una spec aprobada que lo justifique.
- Añadir scripts de terceros o cookies de seguimiento (los comentarios de Giscus son la excepción aprobada).
- Romper URLs ya publicadas (si una ruta cambia, añade redirección).
- Publicar contenido con `draft: true` en producción.
- Hacer `push` a `main` o desplegar sin que el usuario lo pida.
