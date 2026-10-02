# Tareas 003 — Internacionalización ES/EN

- **Plan:** [plan.md](./plan.md)

Tareas pequeñas y verificables, en orden. Marca con `[x]` al terminar.
Las pruebas se escriben antes o junto a la implementación que cubren y deben verse fallar primero.

## Configuración y diccionario

- [ ] T1 — Leer la guía de [i18n de Astro](https://docs.astro.build/en/guides/internationalization/) y ajustar el plan si algo difiere
- [ ] T2 — Prueba unitaria: `dictionaries.test.ts` (mismas claves ES/EN, sin valores vacíos, idiomas = `i18n` de `astro.config.mjs`) y `translate.test.ts` (`t()` por idioma; clave inexistente → error) → ver fallar
- [ ] T3 — Implementación: bloque `i18n` en `astro.config.mjs`; `src/i18n/ui.ts` y `useTranslations` en `src/i18n/utils.ts`; `SITE_DESCRIPTION` desde `ui.es` → ver pasar

## Idioma, URLs y fechas

- [ ] T4 — Prueba unitaria: `routes.test.ts` (`getLangFromUrl`, URLs de secciones y de contenido, `getAlternates`, `switchUrl` con y sin traducción) → ver fallar
- [ ] T5 — Implementación: `getLangFromUrl` en `utils.ts` y `src/i18n/routes.ts` → ver pasar
- [ ] T6 — Prueba unitaria: `format-date.test.ts` (ES, EN, 23:30 UTC no salta de día) → ver fallar
- [ ] T7 — Implementación: `formatDate` en `utils.ts` → ver pasar

## Componentes y layout

- [ ] T8 — Prueba unitaria: `components.test.ts` con la Container API (`LanguagePicker` y `FormattedDate` en ES y EN) → ver fallar
- [ ] T9 — Implementación: `LanguagePicker.astro`; `FormattedDate.astro` con `lang` → ver pasar
- [ ] T10 — Implementación: `src/layouts/Base.astro` (`<html lang>`, `hreflang` y `og:locale` en `BaseHead`); `Header.astro` y `Footer.astro` desde el diccionario y sin enlaces de la plantilla; `BlogPost.astro` sobre `Base.astro` con «Actualizado el» traducido

## Páginas

- [ ] T11 — Prueba funcional: `lang.spec.ts`, `listings.spec.ts`, `language-picker.spec.ts` y `hreflang.spec.ts` → ver fallar
- [ ] T12 — Contenido: `blog/es/articulo-sin-traduccion.md` (ejemplo sin traducción)
- [ ] T13 — Implementación: `entryPaths` con traducción en las props y `entryUrl` en las páginas de artículos y notas (ES y EN) con `alternates`
- [ ] T14 — Implementación: vistas `HomeView`, `BlogIndexView`, `AboutView` en `src/views/`; páginas `/`, `/en/`, `/blog/`, `/en/blog/`, `/sobre-mi/`, `/en/about/`; borrar `about.astro`; 404 bilingüe → pruebas de T11 pasan
- [ ] T15 — Prueba funcional: `no-spanish-on-en.spec.ts` (sin textos del diccionario ES en páginas `/en/`, fechas en inglés) y `a11y.spec.ts` (axe en `/en/`, `/en/blog/`, `/en/about/`, `/sobre-mi/`) → corregir lo que falle
- [ ] T16 — Comprobar que las pruebas de 001 y 002 siguen pasando (404, rutas, a11y) y ajustar solo si cambió una URL a propósito, explicándolo en el commit

## Documentación

- [ ] T17 — `spec.md` (pregunta abierta resuelta), `AGENTS.md` (estructura: `src/i18n/`, `src/views/`, `src/layouts/Base.astro`; rutas) y `.claude/rules/astro-ui.md` (cómo usar `t()`, `routes.ts` y `Base.astro`)

## Cierre

- [ ] `npm run build` y `npm run check` en verde
- [ ] `npm test` (unitarias + funcionales) en verde, en local y en CI
- [ ] Tabla de trazabilidad de `plan.md` completa: ningún criterio sin prueba
- [ ] Criterios de aceptación de la spec verificados (ES y EN)
- [ ] Manual: navegar ES ↔ EN con el selector en portada, blog, artículo traducido, artículo sin traducción y nota
- [ ] Lighthouse ≥ 95 en `/`, `/en/`, `/en/blog/using-mdx/` y `/sobre-mi/`
- [ ] `specs/README.md` actualizado
