# Plan de acción — Skills UI YAIWES

Fecha: 2026-09-27  
Objetivo: convertir el inventario de skills en un sistema gobernado, seleccionable y verificable, sin contaminar YAIWES con reglas específicas de donors.

## Fase S0 — Registro — PASS documental

- congelar conteo actual: 51 SKILL.md físicos / 39 familias lógicas;
- mantener `SKILL-REGISTRY-UI-YAIWES-2026-09-27.json`;
- registrar source path, categoría, scope y estado;
- mirrors/aliases deben apuntar a una sola familia lógica.

**Gate:** ningún skill sin registro puede ser invocado por el router.

## Fase S1 — Política y resolución

Crear/definir `SkillResolver` con prioridad:

```text
explicit task requirement
→ fromted-frontend-architecture
→ surface-specific primary skill
→ QA skill
→ donor adapter only if scope matches
→ fail_closed
```

Estados mínimos:

- `CANONICAL`
- `FACTORY_PRIMARY`
- `REFERENCE`
- `DONOR_SCOPED`
- `MIRROR`
- `ALIAS`
- `ADAPTER_READY`
- `VERIFIED`
- `BLOCKED`

## Fase S2 — Core frontend

Cablear primero:

1. `fromted-frontend-architecture` — política base.
2. `frontend-design` — diseño.
3. `image-to-code` — cuando hay imágenes/referencias visuales.
4. `impeccable` — crítica/pulido/hardening.
5. `web-design-guidelines` — auditoría web.
6. `web-artifacts-builder` — cuando la salida es React/Vite compleja.
7. `skill-creator` — crear adapters/skills YAIWES, no editar donors en sitio.

**Gate:** una prueba pequeña por skill y evidencia de qué decisión cambió.

## Fase S3 — QA determinista

Adaptar patrones de Appsmith/Fluent:

- write Playwright test;
- fix spec;
- diagnose product failure;
- lint;
- visual screenshot check;
- PR/code review;
- token lookup.

Flujo:

`BUILD -> PLAYWRIGHT -> SCREENSHOT -> VISUAL CHECK -> LINT -> ACCESSIBILITY -> FIX -> RETEST`

**Gate:** 0 controles muertos, 0 errores de consola, responsive desktop+móvil, keyboard/touch.

## Fase S4 — Device/runtime skills

Activar Orca únicamente si existe el runtime requerido:

- desktop GUI -> `computer-use`;
- iOS -> `orca-emulator`;
- Android -> `orca-emulator-android`;
- worktree/runtime -> `orca-cli`;
- multi-agent supervised DAG -> `orchestration`;
- workspace env -> `orca-per-workspace-env`.

Sin runtime real: `BLOCKED`, no simulación.

## Fase S5 — Donor adapters

No promover directamente skills Fluent/VS Code/Budibase/Omarchy.

Para reutilizar uno:

```text
READ DONOR SKILL
→ extract generic behavior
→ skill-creator
→ create YAIWES adapter
→ tests
→ compare donor vs adapter
→ approve
→ register ADAPTER_READY
```

No copiar comandos específicos del donor si no existen en YAIWES.

## Fase S6 — Integración con Fábrica UI

```text
GOAL
→ SkillResolver
→ skill selected
→ component/capability registry
→ build/edit
→ browser/device
→ screenshot
→ Playwright
→ evidence
→ PASS
```

El skill orienta el trabajo; la capacidad/componente ejecuta. No mezclar `skill` con `tool` o `plugin`.

## Fase S7 — PANEL-01 / CHAT-01

Skills mínimos por etapa:

- referencia visual -> `image-to-code` + `frontend-design`;
- construcción -> `fromted-frontend-architecture` + builder;
- comportamiento -> contrato Action Bus/bridge;
- pulido -> `impeccable`;
- verificación -> Playwright + visual-test + web-design-guidelines;
- skill nuevo específico del chat -> `skill-creator`.

Gate del chat sigue siendo `OK PANEL-01-CHAT`.

## Fase S8 — Handoff y observabilidad

Cada ejecución debe dejar:

- skill elegido;
- versión/path;
- motivo de selección;
- entradas;
- salida;
- test ejecutado;
- evidencia;
- PASS/FAIL;
- fallback o bloqueo.

## Definition of Done

No cerrar integración de skills hasta:

- registry consumible;
- resolver con fail-closed;
- core frontend cableado;
- donor adapters separados;
- QA real;
- pruebas de dispositivo cuando aplique;
- trazabilidad por tarea;
- documentación y handoff actualizados.
