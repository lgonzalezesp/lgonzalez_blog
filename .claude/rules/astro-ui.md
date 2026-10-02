---
paths:
  - 'src/**/*.astro'
  - 'src/pages/**'
  - 'src/layouts/**'
  - 'src/components/**'
  - 'src/i18n/**'
  - 'src/views/**'
  - 'src/styles/**'
---

# Páginas, componentes y estilos

- Componentes y layouts en PascalCase (`PostCard.astro`); rutas en kebab-case. Español en la raíz, inglés bajo `/en/`.
- Toda página usa `src/layouts/Base.astro` con `lang` y `alternates` (de `sectionAlternates()` o `entryAlternates()`); así se generan `<html lang>`, `hreflang` y el selector de idioma.
- Una página nueva existe en ES y EN: su cuerpo va en `src/views/<Nombre>View.astro` con prop `lang`, y en `src/pages/` solo hay envoltorios finos. Registra su URL en `src/i18n/routes.ts`.
- **Cero JS en cliente por defecto.** No uses `client:*` ni `<script>` salvo que el `plan.md` lo justifique; prefiere HTML/CSS (p. ej. `<details>`, enlaces simples). Excepciones aprobadas: el tema (`ThemeToggle.astro` + script inline de `Base.astro`) y Giscus (`Comments.astro`, que solo pide `giscus.app/client.js` cuando la sección se acerca a pantalla). Un componente que deba reaccionar al tema escucha el evento `themechange` del documento.
- `Base.astro` acepta `width="reading"` (columna de lectura, por defecto) o `width="wide"` (listados y grids).
- **Sin texto de UI hardcodeado**: todo literal visible, `aria-label`, `title` y `alt` genérico sale de `src/i18n/ui.ts` con `useTranslations(lang)` y existe en ES y EN (añade la clave en los dos). Fechas con `FormattedDate` pasando `lang`. Excepción: texto en otro idioma a propósito, marcado con `lang` (p. ej. el selector).
- Estilos con Tailwind 4 (`@import 'tailwindcss'` en `src/styles/global.css`, sin `tailwind.config.*`). Nada de librerías de UI ni CSS-in-JS.
- Colores solo con los tokens de tema (`bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `border-border`, `text-accent`), que cambian solos en modo oscuro; no uses colores fijos ni la variante `dark:`. Texto largo dentro de `.prose`.
- Enlaces subrayados por defecto (WCAG 1.4.1); quita el subrayado solo en navegación, títulos de tarjeta y etiquetas.
- Imágenes con `<Image>`/`<Picture>` de `astro:assets` y `alt` obligatorio.
- Accesibilidad: HTML semántico (`header`, `nav`, `main`, `article`, `footer`), un solo `h1` por página, foco visible, contraste WCAG AA, `lang` correcto en `<html>`.
- Privacidad: ningún script, fuente, iframe ni píxel de terceros. Excepción aprobada: Giscus (005) y Vercel Analytics/Speed Insights sin cookies (006).
- Rendimiento: Lighthouse ≥ 95 en rendimiento, accesibilidad, buenas prácticas y SEO; fuentes locales mediante la API de fuentes de Astro.
