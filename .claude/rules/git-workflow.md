# Git: Gitflow y commits

Se aplica siempre.

- Nunca hagas commit en `main` ni en `develop` (están protegidas; además lo prohíbe `AGENTS.md`). Comprueba la rama con `git status -sb` antes de commitear.
- Trabajo nuevo: `feature/NNN-nombre` desde `develop` actualizado. Correcciones de producción: `hotfix/X.Y.Z` desde `main`.
- No hagas `push` a `main`/`develop`, no crees tags, no mergees PRs ni despliegues salvo petición explícita del usuario. Hacer push de la rama de feature propia sí está permitido.
- Merge de `feature/*` → `develop` con **squash**; `release/*` y `hotfix/*` con **merge commit**. Rebase está deshabilitado en el repo.
- Antes de abrir o actualizar una PR: `git rebase develop` y `npm test` en verde.
- Commits con Conventional Commits y el ámbito de la spec: `feat(003-i18n): selector de idioma`, `fix(004-pages-design): …`, `chore(001-setup): …`, `docs: …`.
- PRs hacia `develop` con título en Conventional Commits; el cuerpo enlaza la spec y resume criterios y pruebas.
- Nunca uses `--no-verify`, `--force` sobre ramas compartidas ni reescribas historia publicada.
- Nunca commitees `.env*` (salvo `.env.example`), `.vercel/`, `.claude/settings.local.json` ni `CLAUDE.local.md`.
- Release y hotfix: sigue la sección «Despliegue» de `AGENTS.md` (versión, `CHANGELOG.md`, PR a `main` y a `develop` con merge commit, tag `vX.Y.Z`). Nunca sin que el usuario lo pida: publicar en `main` es publicar en `lgonzalez.dev`.
