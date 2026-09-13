# ARQUITECTURA — COMPONENT CLOSURE — V8

Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`  
Base: `ARQUITECTURA-WORDFLOW-PYTHON-DSL-DAG-96-4-V7-2026-09-12.md`

## Objetivo único

Cerrar componentes/capabilities faltantes sin crear otro workflow owner ni degradar el contrato determinista.

## Pipeline transversal

`REQUIREMENT → CAPABILITY_GAP → DEDUP → OFFICIAL_SOURCE/REF/LICENSE → DESTINATION_LITERAL → CANONICAL_MOTOR → PHYSICAL_READBACK → ADAPTER/FABLES → TEST → RUNTIME_PASS → VERIFIED_CLOSED`

Orden de decisión: `REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.

Stabilize CORE permanece único workflow owner. El Wordflow sigue siendo Python DSL/DAG con determinismo mínimo 96% y LLM máximo 4%.

## Gates de adquisición

El motor canónico vigente se conserva inmutable:
- Motor2 blob `84d566e2ee4e98e42eb3a864026d067d48caabd9`.
- Engine blob `91e6e4486692eab314be5c7130d8310d3c855397`.
- sin Git LFS;
- sin force;
- sin sanitización para ocultar special files;
- sin mirrors no autorizados;
- sin motor alternativo.

### Fail-closed por special file

Si la fuente oficial contiene symlinks/special files incompatibles con el motor:
`SOURCE_SPECIAL_FILE_GAP → GAP_RESOLVABLE → StrategyDelta materialmente distinto`.

StrategyDelta permitido: otra fuente/ref/subtree oficial que preserve provenance, o equivalencia ya presente demostrada. No se modifica el motor para convertir un FAIL en PASS.

### Fail-closed por proveedor

Si la fuente canónica usa un proveedor fuera del transporte admitido, como AVF en `android.googlesource`, separar:
`PROVIDER_ACQUISITION_GAP` de `RUNTIME_CAPABILITY_GAP`.
No usar mirror sin autorización/provenance equivalente.

### Fail-closed por requisito no probado

Si el componente no tiene requirement/capability gap demostrado:
`REQUIREMENT_NOT_PROVEN → NO_DOWNLOAD`.
Carpeta vacía o mención histórica no autoriza adquisición.

## Estado del ciclo de componentes

- Vite N07: fuente oficial `vitejs/vite`, v8.3.0; canonical Motor2 rechazó special files. `GAP_RESOLVABLE`. N12 sigue bloqueado.
- Supabase N08: requirement obligatorio no demostrado por la matriz fresca; descarga denegada hasta prueba.
- DuckDB N09: Gap Ledger confirma incompatibilidad por special files; requiere StrategyDelta oficial.
- AVF N10: provider `android.googlesource` incompatible con motor GitHub-only y capability Android aún no probada.
- big-AGI N11: fuente oficial MIT; motor rechazó `AGENTS.md` como special file; `GAP_RESOLVABLE`.
- Vercel AI SDK N13: fuente oficial Apache-2.0; motor rechazó `README.md` como special file; `GAP_RESOLVABLE`.

Estado auditable detallado: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/COMPONENT-CLOSURE-STATE-2026-09-13.json`.

## Coordinación multi-chat

`1 task = 1 node = 1 active owner`.

Antes de reclamar: fresh HEAD + Crazy Wall base + overlay de componentes. Si `CLAIMED|EXECUTING` no produce evidencia nueva verificable durante 4 horas:
`STALE_REOPENED → owner=null → FREE`.

Un run fallido con log fresco cuenta como progreso/evidencia y no se debe reabrir inmediatamente; se debe cambiar StrategyDelta.

## Regla de cierre

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

Ningún componente de este ciclo se promociona por mera descarga o por workflow creado. La adquisición debe pasar readback; después vienen wiring/integration/tests.