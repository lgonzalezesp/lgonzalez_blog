---
paths:
  - 'package.json'
  - 'package-lock.json'
  - '.nvmrc'
  - '.github/**'
  - 'astro.config.mjs'
  - 'vitest.config.ts'
  - 'playwright.config.ts'
  - 'eslint.config.js'
  - '.prettierrc.json'
  - '.prettierignore'
  - 'tsconfig.json'
---

# Dependencias, configuración y CI

- Solo **npm**: `npm install <paquete>` (`-D` para desarrollo), `npm ci` para instalaciones limpias. Nunca pnpm/yarn/bun ni sus lockfiles; nunca edites `package-lock.json` a mano.
- Cada dependencia nueva se justifica en el `plan.md` de la spec. Prefiere lo que ya trae Astro antes que añadir paquetes.
- Node 24 (`.nvmrc`). Con Node 23 npm instala **en silencio** versiones antiguas de paquetes que lo excluyen en `engines`: tras instalar, comprueba con `npm ls <paquete>` que la versión mayor es la esperada y fíjala si no.
- `npm audit` debe quedar sin vulnerabilidades al añadir o actualizar dependencias.
- El job de `.github/workflows/ci.yml` se llama **`CI`** y es el check obligatorio de la protección de `main` y `develop`: no lo renombres ni elimines pasos (`check`, `lint`, `format:check`, `test:unit`, `test:e2e`) sin actualizar la protección y la spec.
- `playwright.config.ts` usa `astro preview --ignore-lock`: sin ese flag, Astro lanza el servidor en segundo plano al detectar un agente y Playwright falla. No lo quites.
- `site` en `astro.config.mjs` es `https://lgonzalez.dev`; cambiarlo afecta a RSS, sitemap, canónicas y Giscus.
- Si cambias scripts de `package.json`, actualiza la tabla "Comandos" de `AGENTS.md`.
- Al terminar: `npm run check && npm run lint && npm run format:check && npm test`.
