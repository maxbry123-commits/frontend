# HANDOFF DINÁMICO DE NODOS — UI YAIWES — V8

Fecha: 2026-09-12
Repo: `maxbry123-commits/frontend`
Branch: `main`
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP_NOT_CLOSED`

## Entrada única para chats Sol GPT

1. Cola autoritativa de tareas/nodos: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-TASK-NODES-DYNAMIC-V5-2026-09-12.json`
2. Handoff base técnico: `UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-MAESTRO-OPERATIVO-UI-YAIWES-V7-2026-09-12.md`
3. Arquitectura Python DSL/DAG 96/4: `UI YAIWES/readme arquitectura UI YAIWES/ARQUITECTURA-WORDFLOW-PYTHON-DSL-DAG-96-4-V7-2026-09-12.md`
4. Crazy Wall X-Ray: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-WORDFLOW-XRAY-V4-2026-09-12.json`
5. Gap ledger: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/AUDIT-GAP-LEDGER-4AI-2026-09-11.json`
6. Código/tests/logs actuales tienen mayor autoridad que documentación histórica.

## Regla de coordinación

No hay tareas fijas por chat. Cada chat Sol debe:

`READ FRESH -> IDENTIFY FREE -> CLAIM -> EXECUTE -> TEST -> REPORT -> RELEASE/NEXT FREE`

Un chat sólo puede tener un nodo `CLAIMED|EXECUTING` a la vez. No puede reclamar un nodo ya reclamado ni escribir fuera de su `write_scope`.

### Claim mínimo

- `chat_id`
- `node_id`
- `fresh_main_sha`
- `write_scope`
- `claimed_at`
- `state=CLAIMED`

### Cada nodo usa exactamente 3 pasos

1. `VERIFY_RESEARCH`: releer requisito, código, tests, componentes ya presentes y fuentes oficiales; deduplicar.
2. `EXECUTE_DELTA`: ejecutar sólo el delta mínimo autorizado; prioridad `REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.
3. `TEST_REPORT`: test específico + global cuando aplique; registrar SHA/run/log/evidencia; `PASS|GAP`; actualizar Crazy Wall y tomar siguiente FREE.

## Nuevos hallazgos incorporados

La cola V5 incorpora como nodos explícitos los hallazgos reportados por Astra:
- lectura exhaustiva de los 3 documentos y denominador completo de requisitos;
- trazabilidad bidireccional requisito↔tarea↔código↔test↔evidencia;
- auditor automático/evidence verifier;
- reconciliación Crazy Wall/STATE/CHECKPOINT/HANDOFF;
- recovery real de chats/ventanas/archivos y separación de memorias;
- cancel/disconnect/restart sin duplicación;
- matriz Web/Windows/Linux/Android/iOS + benchmarks 100x;
- Vite, Supabase, DuckDB, AVF como nodos de adquisición/equivalencia;
- big-AGI, Vite y Vercel AI SDK como source/integration pendientes;
- Research con fuente real verificada;
- Supervisor pre-effect gate;
- checkpoint bytes SHA256 before restore;
- E2E UI→API/Fables→execution→memory→recovery→response.

También conserva Memory/Retrieval/Context, Storage, Sandbox/UEK, Worker, OTel, Five-pass, Consolidator, Resource Brain, Integration, Continuous LOOP, API, Global Recovery, G12 y UI final.

## Componentes

No descargar por carpeta vacía. Para cada componente:
`REQUIREMENT -> CAPABILITY_GAP -> DEDUP -> OFFICIAL_SOURCE -> DESTINATION -> CANONICAL_MOTOR -> READBACK -> ADAPTER/FABLES -> TEST -> VERIFIED_CLOSED`.

Motores canónicos solamente. Prohibido Git LFS, force o motor alternativo. `stabilize_core` sigue como único workflow owner.

## Estado verificado vigente

CI global registrado en Handoff V7: run `34730513826`, job `103652482919`, success; Wordflow `23 PASS`, runtime `75 PASS + 9 subtests`. Esto demuestra regresión actual, no cierre global.

`big-AGI`, `Vite` y `Vercel AI SDK` siguen `PENDING_SOURCE` en `component_registry.py`. El ledger conserva Vite/Supabase/DuckDB/AVF como GAPs de adquisición/capability.

## Porcentaje

No usar porcentajes históricos de lotes/integración como porcentaje global. El porcentaje global sólo puede publicarse cuando N01 define el denominador completo y N02/N30 producen la matriz bidireccional verificable.

## Cierre

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

Final Judge sólo puede cerrar cuando no queden nodos obligatorios abiertos y N30 demuestre cobertura completa con evidencia fresca.