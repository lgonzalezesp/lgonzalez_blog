# Specs — índice

Flujo SDD: **Specify → Plan → Tasks → Implement → Review**. Ver `AGENTS.md` y `constitution.md`.

Cada spec debe entregar **pruebas unitarias** (Vitest) y **pruebas funcionales** (Playwright) que cubran todos sus criterios de aceptación. La infraestructura de pruebas se monta en 001.

| #   | Feature                                               | Spec     | Plan                            | Tasks                         | Estado                                                                 |
| --- | ----------------------------------------------------- | -------- | ------------------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| 001 | [Setup del proyecto](./001-setup/spec.md)             | Aprobada | [Aprobado](./001-setup/plan.md) | [16/16](./001-setup/tasks.md) | Hecha ([PR #1](https://github.com/lgonzalezesp/lgonzalez_blog/pull/1)) |
| 002 | [Modelo de contenido](./002-content-model/spec.md)    | Borrador | —                               | —                             | Pendiente                                                              |
| 003 | [Internacionalización ES/EN](./003-i18n/spec.md)      | Borrador | —                               | —                             | Pendiente                                                              |
| 004 | [Páginas y diseño](./004-pages-design/spec.md)        | Borrador | —                               | —                             | Pendiente                                                              |
| 005 | [Comentarios (Giscus)](./005-comments/spec.md)        | Borrador | —                               | —                             | Pendiente                                                              |
| 006 | [SEO, feeds y analítica](./006-seo-analytics/spec.md) | Borrador | —                               | —                             | Pendiente                                                              |
| 007 | [Compartir en LinkedIn](./007-linkedin-share/spec.md) | Borrador | —                               | —                             | Pendiente                                                              |
| 008 | [Despliegue en Vercel](./008-deploy/spec.md)          | Borrador | —                               | —                             | Pendiente                                                              |

## Tareas manuales (fuera del código)

- [ ] Comprar el dominio **lgonzalez.dev** (recomendado: Vercel Domains; alternativas: Cloudflare Registrar, Porkbun). Activar renovación automática, privacidad WHOIS y bloqueo de transferencia. Si no está disponible, decidir alternativa antes de 001.
- [ ] Habilitar GitHub Discussions en `lgonzalezesp/lgonzalez_blog` e instalar la app Giscus (antes de 005).
