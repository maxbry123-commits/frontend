# HANDOFF — Skills UI YAIWES + Fábrica UI

Fecha: 2026-09-27  
Estado: `ARCHITECTURE_WIRED / RUNTIME_ADAPTERS_PENDING`

## Resultado de auditoría

Se auditaron las dos raíces pedidas:

- `UI YAIWES interface/`: **10 SKILL.md físicos**.
- `fabrica de UI INTERFACE fromtend/`: **41 SKILL.md físicos**.
- Total físico: **51 SKILL.md**.
- Capacidad lógica consolidada: **39 familias**, al colapsar los mirrors `.agents/.claude` de Fluent UI y el alias legacy `linear-tickets -> orca-linear`.

La raíz de fábrica devuelve un árbol Git recursivo truncado; para cerrar el conteo se recorrieron sus subárboles superiores individualmente. El registro máquina queda en `UI YAIWES interface/readme arquitectura UI YAIWES interface beta/actualizaciones arquitectura/SKILL-REGISTRY-UI-YAIWES-2026-09-27.json`.

## Regla de seguridad

**Encontrado no significa activado.**

Los skills internos de Appsmith, Budibase, Fluent UI, VS Code, Orca y Omarchy contienen supuestos, comandos y convenciones de esos proyectos. Se registran como `DONOR_SCOPED` y **no se cargan globalmente en YAIWES**.

`DONOR_SCOPED -> ADAPTER -> TEST -> APPROVAL -> ACTIVE`

Sin adapter/test, el router de skills debe fallar cerrado.

## Skills primarios de la fábrica

1. `frontend-design` — dirección visual y diseño intencional.
2. `impeccable` — auditoría/pulido/hardening UI, responsive, a11y y calidad visual.
3. `skill-creator` — creación, mejora y evaluación de skills.

## Skills de QA reutilizables por patrón

Appsmith:
- `diagnose-pw-failure`.
- `fix-pw-spec`.
- `write-and-verify-pw-test`.

Fluent UI:
- `lint-check`.
- `review-pr`.
- `token-lookup`.
- `visual-test`.
- `headless-component`.
- `v9-component`.
- resto: operaciones específicas de Fluent/release/triage.

Estos skills se reutilizan **como patrón o mediante adapter YAIWES**; no se ejecutan contra rutas/proyectos que no les correspondan.

## Skills de operación UI YAIWES interface

Orca:
- `computer-use`.
- `orca-cli`.
- `orca-emulator`.
- `orca-emulator-android`.
- `orca-per-workspace-env`.
- `orchestration`.
- `orca-linear` + alias legacy `linear-tickets`.

Omarchy:
- `diagnose-crash`.
- `omarchy`.

Todos permanecen donor-scoped salvo que una tarea use realmente ese runtime.

## Skills documentales de donor

La fábrica contiene 10 skills del donor VS Code Contribution Points Docs:
`blog-writer`, `content-redirect`, `daily-docs-audit`, `doc-writer`,
`docs-product-alignment`, `frontmatter-description`, `pr-review`,
`release-note-writer`, `review-agent-corrections`, `write-my-release-notes`.

Son útiles como patrones de documentación/revisión, pero sus instrucciones mencionan repos y convenciones VS Code. Estado: `DONOR_SCOPED`.

## Skills canónicos relacionados fuera de las dos raíces

La propia fábrica apunta a `Skills arquitectura frontend Yaiwes/.../skills-referencia-claude`. Por eso se cablean como referencias, **sin sumarlos a los 51**:

- `fromted-frontend-architecture` — orquestador/ley FROMTED.
- `frontend-design.SKILL.md`.
- `web-design-guidelines.SKILL.md`.
- `web-artifacts-builder.SKILL.md`.
- `theme-factory.SKILL.md` — no sustituye tokens de producto.
- `brand-guidelines.SKILL.md` — explícitamente no aplicar a FROMTED.
- `image-to-code` — flujo image-first para trabajos visuales.

## Cableado canónico

```text
TASK
  ↓
SkillResolver
  ↓
FROMTED architecture policy
  ↓
┌─ DESIGN: frontend-design / image-to-code
├─ BUILD: web-artifacts-builder / component adapter
├─ POLISH: impeccable
├─ QA: Playwright skills / visual-test / web-design-guidelines
├─ DEVICE: emulator skills
├─ ORCHESTRATION: Orca orchestration (solo si runtime real)
├─ DOCS/RELEASE: donor adapters cuando aplique
└─ CREATE-SKILL: skill-creator
  ↓
Action/Tool execution
  ↓
Browser / device / repo
  ↓
Evidence
  ↓
PASS/FAIL
```

## Condiciones de entrega a otro agente

Antes de usar un skill:

1. resolver path exacto;
2. leer su `SKILL.md`;
3. verificar `scope`;
4. verificar dependencias/herramientas;
5. no usar un donor skill fuera de su dominio sin adapter;
6. registrar evidencia;
7. no declarar integración por mera presencia del archivo.

Siguiente documento: `PLAN-ACCION-SKILLS-UI-YAIWES-2026-09-27.md`.

## Verificación final de inventario — 17:05 -05:00

Se verificó el conteo por subárbol porque el árbol recursivo raíz de `fabrica de UI INTERFACE fromtend/` devuelve `truncated=true`.

Resultado completo:

- `UI YAIWES interface/`: 10 SKILL.md, árbol completo (`truncated=false`).
- `fabrica de UI INTERFACE fromtend/`: 41 SKILL.md, verificados por subárboles completos.
- total físico: **51**.
- familias lógicas: **39**.

Desglose fábrica:
- Appsmith: 3.
- Budibase: 1.
- Fluent UI: 24.
- VS Code Contribution Points Docs: 10.
- skills propios de fábrica: 3 (`frontend-design`, `impeccable`, `skill-creator`).

Registry operativo sincronizado:
`UI YAIWES interface/fabrica-ui/SKILLS-REGISTRY.json`.

Fuente canónica:
`actualizaciones arquitectura/SKILL-REGISTRY-UI-YAIWES-2026-09-27.json`.

Estado de cableado documental: **PASS**. Runtime/adapters de donors: **PENDING / GATED**.

