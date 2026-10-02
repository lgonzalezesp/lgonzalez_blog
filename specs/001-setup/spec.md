# Spec 001 — Setup del proyecto

- **Estado:** En progreso
- **Rama:** `feature/001-setup`

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
- [ ] Infraestructura de pruebas lista: Vitest (con Astro Container API) para unitarias y Playwright (con axe-core) para funcionales, ejecutándose sobre el build.
- [ ] Scripts `test:unit`, `test:e2e` y `test` definidos.
- [ ] Gestor de paquetes npm: `package-lock.json` commiteado, Node fijado en `.nvmrc` y `engines`.
- [ ] Gitflow configurado: rama `develop` creada; `main` y `develop` protegidas en GitHub (solo PR con CI en verde).
- [ ] GitHub Actions ejecuta `npm ci`, `check`, `lint` y `npm test` en cada PR hacia `develop` y `main`; un fallo bloquea el merge.

## Pruebas

### Unitarias (Vitest)

- [ ] Prueba de humo: Vitest arranca y renderiza un componente `.astro` de ejemplo con la Container API.
- [ ] La configuración expone `site` con el dominio definitivo.

### Funcionales (Playwright)

- [ ] La portada del build responde 200 y tiene `<title>`.
- [ ] Una ruta inexistente devuelve la página 404.
- [ ] La portada no tiene violaciones de accesibilidad graves (axe-core).

## Fuera de alcance

- Diseño visual, contenido real e i18n (specs 002–004).

## Preguntas abiertas

- ¿Dominio definitivo confirmado (`lgonzalez.dev`)?
