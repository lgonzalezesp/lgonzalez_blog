# Spec 001 — Setup del proyecto

- **Estado:** Borrador
- **Rama:** `feat/001-setup`

## Contexto / Por qué

Necesitamos una base de proyecto Astro limpia, tipada y con herramientas de calidad para que todas las features siguientes se construyan sobre el mismo terreno.

## Historias de usuario

- Como **autor**, quiero arrancar el blog en local con un solo comando para trabajar rápido.
- Como **autor**, quiero que errores de tipos y de formato se detecten antes de publicar.

## Criterios de aceptación

- [ ] El proyecto parte de la plantilla oficial Astro Blog y arranca en local con `npm run dev`.
- [ ] Integraciones MDX, sitemap y Tailwind instaladas y funcionando.
- [ ] TypeScript en modo estricto; `npm run check` pasa.
- [ ] Scripts `dev`, `build`, `preview`, `check`, `lint`, `format` definidos y funcionando.
- [ ] La URL del sitio (`site`) apunta al dominio definitivo.
- [ ] `.gitignore` adecuado; repo conectado a `lgonzalezesp/lgonzalez_blog`.
- [ ] La sección "Estructura" y "Comandos" de `AGENTS.md` refleja la realidad.

## Fuera de alcance

- Diseño visual, contenido real e i18n (specs 002–004).

## Preguntas abiertas

- ¿Dominio definitivo confirmado (`lgonzalez.dev`)?
- ¿Gestor de paquetes: npm o pnpm?
