# Plan NNN — <Nombre de la feature>

- **Spec:** [spec.md](./spec.md)
- **Estado:** Borrador | Aprobado

## Enfoque técnico

<Cómo se implementa. Decisiones y su justificación.>

## Archivos afectados

- `ruta/archivo` — <crear | modificar> — <motivo>

## Dependencias nuevas

- <paquete> — <por qué es necesario> (o "Ninguna")

## Validación contra la constitución

| Principio | ¿Cumple? | Nota |
| --- | --- | --- |
| 1. Simplicidad | ✅ | |
| 2. Dueño de los datos | ✅ | |
| 3. Bilingüe | ✅ | |
| 4. Rendimiento / a11y | ✅ | |
| 5. Privacidad | ✅ | |
| 6. Cero JS por defecto | ✅ | |
| 7. Spec = verdad | ✅ | |
| 8. URLs estables | ✅ | |
| 9. Todo se prueba | ✅ | |

## Riesgos

- <Riesgo> → <mitigación>

## Estrategia de pruebas

- **Unitarias:** <qué módulos/componentes, fixtures necesarios.>
- **Funcionales:** <qué recorridos, en qué viewports (móvil/escritorio) e idiomas.>

### Trazabilidad criterio → prueba

| Criterio de aceptación | Prueba unitaria | Prueba funcional |
| --- | --- | --- |
| <criterio> | `tests/unit/NNN-.../x.test.ts` | `tests/e2e/NNN-.../x.spec.ts` |

## Verificación

<Cómo se comprobará cada criterio de aceptación además de las pruebas automáticas (p. ej. Lighthouse, revisión manual).>
