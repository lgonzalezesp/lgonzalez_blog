# Spec 008 — Despliegue en Vercel

- **Estado:** Aprobada
- **Rama:** `feature/008-deploy`

## Contexto / Por qué

Siguiendo Gitflow, publicar debe ser tan simple como mergear una `release/*` a `main`, y cada cambio debe poder revisarse antes en una preview.

## Historias de usuario

- Como **autor**, quiero que al mergear una release a `main` el blog se publique solo.
- Como **autor**, quiero ver el estado integrado de `develop` en una URL de preview estable.
- Como **autor**, quiero una URL de preview por cada Pull Request para revisar antes de publicar.
- Como **lector**, quiero acceder por `https://lgonzalez.dev`.

## Criterios de aceptación

- [x] `lgonzalezesp/lgonzalez_blog` importado en Vercel como proyecto Astro estático.
- [x] Deploy de producción automático desde `main` (tras merge de `release/*` o `hotfix/*`, con tag `vX.Y.Z`).
- [ ] `develop` se despliega automáticamente en una URL de preview estable.
- [x] Vercel instala con `npm ci`.
- [ ] Preview automática en cada PR (los `draft` visibles solo en previews).
- [x] Dominio `lgonzalez.dev` conectado con HTTPS; `www` redirige al dominio raíz.
- [ ] Un build fallido no reemplaza la versión publicada.
- [x] No se despliega a producción si las pruebas de CI fallan.

## Pruebas

### Unitarias (Vitest)

- [x] La lógica de borradores muestra `draft` en entorno preview y los oculta en producción según la variable de entorno de Vercel.

### Funcionales (Playwright)

- [x] Pruebas de humo contra la URL de la preview de cada PR (portada, un post, `/en/`, 404) ejecutadas desde CI.
- [x] Contra producción, tras el deploy: `https://lgonzalez.dev` responde 200, `http://` y `www` redirigen a `https://lgonzalez.dev`.

## Fuera de alcance

- Compra del dominio (tarea manual en `specs/README.md`).
- CMS visual (mejora futura: Decap CMS o Keystatic).

## Preguntas abiertas

- ¿Dominio comprado en Vercel o en otro registrador?
