# PLAN MAESTRO TAREA 1 + TAREA 2 — ASTRA V2

Fecha: 2026-09-10
Owner: `➡️ Astra plan fábrica UI YAIWES`
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP`

## REGLA PRINCIPAL

`TAREA 1 = FÁBRICA UI`

`TAREA 2 = INTERFACE UI YAIWES`

La Tarea 2 productiva NO inicia hasta que Tarea 1 alcance `VERIFIED_CLOSED` mediante auditor independiente. Durante T1 sólo se permite estudiar fuentes, backend/contracts y requisitos de T2 para que la fábrica no nazca incompatible. Ese estudio NO cambia el estado de T2 a iniciado.

## ORDEN DE LECTURA OBLIGATORIO

1. `INPUT-BLOCK-LITERAL-2026-09-10.md`
2. `INPUT-BLOCK-LITERAL-ADDENDUM-2026-09-10.md`
3. `CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`
4. `STATE.json`
5. `PERFIL-TRABAJO-Y-PERFIL-UI-YAIWES.md`
6. `ARQUITECTURA-DETALLADA-FABRICA-E-INTERFACE-YAIWES-V1.md`
7. `MATRIZ-FUSION-46-COMPONENTES-FRONTEND-BACKEND.md`
8. última auditoría 4 pasadas
9. último Recovery Patch
10. último Handoff

No ejecutar antes de reconstruir este contexto.

# TAREA 1 — FÁBRICA UI

## T1.00 — INPUT literal
Salida: instrucciones originales preservadas sin reinterpretación.
Estado: `VERIFIED_CLOSED`.

## T1.01 — Perfil Astra/UI
Salida: identidad, objetivo permanente, fronteras y referencias de producto.
Estado: `VERIFIED_CLOSED`.

## T1.02 — Arquitectura
Salida: 5 módulos, 5 pasos, shell, data contracts, seguridad, multiplataforma, reglas y criterios de cierre.
Estado: `CLOSED_UNVERIFIED` hasta auditor independiente final.

## T1.03 — XRAY de componentes >40
Acciones:
1. recorrer raíz canónica completa;
2. leer README/package/manifest/licencia/source ref de cada candidato útil;
3. clasificar `FRONTEND_ONLY | BACKEND_ONLY | FULLSTACK | TOOLING | DESIGN_ASSET`;
4. mapear capacidad concreta, no nombre;
5. detectar redundancias;
6. marcar source/licencia inciertos como `VERIFY_REQUIRED`;
7. actualizar matriz y evidence.

Salida: mapa completo de capacidades útiles.
Estado actual: `ACTIVE_LOOP`.

## T1.04 — Seleccionar owners de capacidades
Decisiones obligatorias:
- 1 AppShell;
- 1 Canvas API;
- 1 Component Registry;
- 1 Inspector API;
- 1 StateDelta model;
- 1 typed action bus;
- 1 preview/sandbox path;
- 1 test/evidence path.

Donantes adicionales sólo via adapter, nunca segundo shell/canvas canónico.

## T1.05 — Contratos canónicos
Crear/validar:
- `ComponentManifest`;
- `ComponentDefinition`;
- `ComponentInstance`;
- `UIDocument`;
- `TypedAction`;
- `UIStateDelta`;
- `BackendBinding`;
- `ArtifactRef`;
- `TaskEvent`;
- `ProviderRef`;
- `EvidenceRef`;
- `SurfaceCapability`.

## T1.06 — Factory Shell + Step Engine
Implementar la navegación visible:
`1 Design/Create -> 2 Compose -> 3 Connect -> 4 AI/Transform -> 5 Validate/Publish/Edit`.

Cada paso debe declarar entrada, salida, validación y evidencia.

## T1.07 — M1 Element Builder
Crear ventana/botón/selector/segmento/toolbar/panel/modal/card/input/etc.
PASS: preview + schema + a11y básico.

## T1.08 — M2 UI Composer
Canvas drag/drop + resize + layout + responsive + pages/windows + inspector + undo/redo + version.
PASS: UIDocument consistente y reversible.

## T1.09 — M3 Component Transformer
`source -> provenance/license/hash -> static scan -> split -> manifest -> adapter -> sandbox -> test -> registry candidate`.
PASS: componente transformado sin ejecución insegura ni wiring oculto.

## T1.10 — M4 AI Operator
MANUAL / AI_ASSIST / AUTOPILOT.
La IA produce `PlanProposal + UIStateDelta`; jamás escritura opaca.
PASS: diff/preview/reject/rollback probados.

## T1.11 — M5 Deterministic Kit
Operaciones sin LLM: scan/copy/move/import/build/lint/typecheck/test/snapshot/a11y/bundle/hash/version/rollback.
PASS: tareas mecánicas reproducibles.

## T1.12 — Universal Contract / Adapter Bus
Todo componente y backend binding pasa por contrato universal.
PASS: no importaciones cruzadas ad-hoc.

## T1.13 — Preview Sandbox
Aislar código no confiable/importado.
PASS: denied capabilities by default + failure contained.

## T1.14 — Test/Evidence/Version
Mínimo:
- unit;
- contract;
- E2E;
- visual;
- responsive;
- accessibility;
- rollback;
- read-back.

## T1.15 — 3 simulaciones
A. humano drag/drop -> UI completa;
B. IA -> StateDelta sobre UI existente;
C. componente OSS/fullstack -> split frontend/backend -> adapter -> preview -> test.

Cada simulación debe tener 3 refutaciones y resultado PASS/FAIL/REPAIR.

## T1.16 — Cierre independiente
Reviewer: Claude u otra AI independiente.
Condición: productor no auto-certifica.
T1 `VERIFIED_CLOSED` sólo con evidence completa.

# TAREA 2 — INTERFACE UI YAIWES

Se desbloquea únicamente después de T1.16 PASS.

## T2.00 — Reconstruir requisitos desde fuentes
Fuentes: INPUT literal + documentos de proyecto + backend contracts reales + Factory capabilities.
Salida: requirement matrix `goal -> surface -> contract -> test`.

## T2.01 — AppShell / Workspaces
Implementar shell multiplataforma, workspaces, docks, navegación, command palette y layout responsive usando la fábrica.

## T2.02 — YAIWES Chat / Jarvis Command Center
Chat central multi-work capaz de direccionar `SurfaceCapability` y tareas; streaming/cancel cuando backend real lo soporte.

## T2.03 — Files / Artifacts / Editors
Code/text/document/PDF/charts/previews/versiones.

## T2.04 — Workflow / Tasks / Evidence
DAG/timeline/tareas/checkpoints/evidence/recovery visibles sin convertir UI en state authority.

## T2.05 — Component / Plugin / Backend Panel
Mostrar componentes, adapters, plugin capabilities, permisos, health y contratos; nunca secretos.

## T2.06 — Model/Provider Selector
AUTO/MANUAL, health/capabilities; `secret_ref` únicamente.

## T2.07 — Multiplataforma
Web + desktop Windows/Linux + Android/iOS mediante capability negotiation y shell/bridge seguro según plataforma.

## T2.08 — Seguridad frontend
CSP/sandbox/permissions/secret-ref/local encryption boundary/provenance.

## T2.09 — Integración frontend↔backend
Por cada superficie:
`UI action -> BackendBinding -> auth/capability -> actual contract -> result event -> normalizer -> StateDelta -> render`.

No mock cuenta como integración productiva.

## T2.10 — E2E / versión candidata
3 simulaciones completas + regresión + auditor independiente + read-back.

# PARALELISMO SIN ROMPER COLA 1×1

Permitido en paralelo:
- lectura de repos independientes;
- investigación;
- static analysis;
- tests aislados;
- generación de reports sin shared write path.

Prohibido en paralelo:
- dos writers en mismo archivo/ruta;
- promoción simultánea al registry;
- cambios de arquitectura canónica concurrentes;
- backend Sol + Astra escribiendo misma ruta.

Canonical write queue siempre `1×1`.

# HANDOFF PARCIAL A CLAUDE

Claude puede tomar un nodo T2 sólo si:
1. T1 está `VERIFIED_CLOSED`;
2. el nodo tiene owner explícito `CLAUDE`;
3. write_paths están definidos y no tienen owner activo;
4. base SHA fue releído;
5. lee los 10 archivos del orden de recuperación;
6. no modifica otro nodo;
7. deja evidence + read-back + handoff de retorno.

Si T1 no está cerrado, Claude sólo puede auditar T1 o investigar T2 read-only.

# SALIDA DE CADA LOOP

Mantener exactamente:
1. avance %;
2. Nodo #;
3. cerradas;
4. en curso;
5. pendientes;
6. GAP/flags;
7. evidencia;
8. cambios;
9. siguiente acción;
10. estado `VERIFIED_CLOSED | CLOSED_UNVERIFIED | INCONCLUSIVE | ACTIVE_LOOP`.
