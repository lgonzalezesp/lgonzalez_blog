# Constitución de lgonzalez.dev

Principios no negociables. Todo `plan.md` debe validarse contra ellos; cualquier excepción debe justificarse explícitamente en el plan y ser aprobada.

1. **Simplicidad primero.** Sitio estático. Sin servidor, base de datos ni funciones serverless salvo necesidad justificada en una spec.
2. **El autor es dueño de sus datos.** El contenido vive en Markdown/MDX versionado en Git, sin dependencia de un CMS propietario.
3. **Bilingüe desde el diseño.** Español por defecto, inglés bajo `/en/`. Ninguna feature se considera terminada si solo funciona en un idioma.
4. **Rendimiento y accesibilidad no negociables.** Lighthouse ≥ 95 en todas las categorías y cumplimiento WCAG 2.1 AA.
5. **Privacidad.** Sin cookies de seguimiento ni scripts de terceros innecesarios. Analítica solo sin cookies.
6. **Cero JS en cliente por defecto.** Las islas interactivas solo se usan cuando aportan valor claro al lector.
7. **La spec es la fuente de verdad.** Código y spec deben coincidir; si divergen, se actualiza la spec en el mismo cambio.
8. **URLs estables.** Una URL publicada no se rompe; los cambios de ruta llevan redirección.
