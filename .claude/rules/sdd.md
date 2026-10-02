# SDD: la spec manda

Se aplica siempre. Complementa `AGENTS.md` (canónico); si hay contradicción, gana `AGENTS.md` y se corrigen ambos en el mismo cambio.

- Antes de tocar `src/`, `tests/` o la configuración, identifica la spec (`specs/NNN-nombre/`) que cubre el cambio y comprueba en `specs/README.md` que su `spec.md`, `plan.md` y `tasks.md` están aprobados.
- Si no hay spec que lo cubra, **no implementes**: propón el cambio a la spec (o una spec nueva con la plantilla de `specs/_templates/`) y espera aprobación.
- Las aprobaciones son del usuario y son explícitas, una por documento: `spec.md` → `plan.md` → `tasks.md`. No encadenes los tres en un solo paso.
- Implementa `tasks.md` en orden y marca `[x]` en cuanto termines cada tarea, no al final.
- Si la implementación obliga a desviarse (otra dependencia, otro enfoque, un criterio inviable), actualiza `spec.md`/`plan.md` en el mismo commit y avisa al usuario.
- Al cerrar una feature, actualiza el estado en `spec.md` y en `specs/README.md` (Borrador → Aprobada → En revisión → Hecha).
- Todo cambio de dependencias queda justificado en la tabla "Dependencias nuevas" del `plan.md`.
