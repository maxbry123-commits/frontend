# HANDOFF — 3 GROK — FRONTEND WORKPACK 20 — 2026-09-14

repo: `maxbry123-commits/frontend`
branch: `main`
contract: `tel.workflow/v3`
mode: `FAIL_CLOSED_LOOP`
domain: `FRONTEND_ONLY`

## Autoridad
1. Leer `main` fresh.
2. Leer `FACTORY-CRAZY-WALL-SEGMENTED-V10-2026-09-14.json`.
3. Leer `FACTORY-FRONTEND-GROK-WORKPACK-20-V1-2026-09-14.json`.
4. Leer `src/segments/segment-registry-v1.js`.
5. Si `main` cambia antes de escribir: `STALE_LOCK_GAP_REBUILD_DELTA`.

## Reglas
- 1 chat = 1 nodo activo.
- 1 path = 1 writer.
- Reclamar sólo `FREE` o `GAP_RESOLVABLE` con dependencias satisfechas.
- Seguir exactamente `VERIFY_RESEARCH → EXECUTE_DELTA → TEST_REPORT`.
- `REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.
- Sólo frontend. Prohibido tocar backend, micro-kernel o runtime externo.
- No tocar `index-v19.html` ni `index-v192.html`.
- Productor no cablea candidato. Sólo `SEG-11-INTEGRATOR` integra/promueve.
- Crear versión nueva; no borrar ni sobreescribir la versión anterior.
- No segundo state engine/editor/router.
- No force push. No Git LFS.
- Evidencia obligatoria: fresh_main_sha, paths, blob SHA, commit SHA, test, run/job/artifact y readback.
- `SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
- Sólo `F-UI-063` puede declarar `FRONTEND_100`.

## Cola por chat
### GROK-A — interacción/canvas/shell
`F-FE-072 → 073 → 074 → 075 → 076 → 070 → 071`

### GROK-B — importación/IO/browser
`F-FE-079 → 080 → 081 → 082 → 083 → 077 → 078`

### GROK-C — destinos/skills/remote/HF/OSS/layers
Primero reclamar el nodo existente `F-FE-069-COMMAND-PALETTE` del Crazy Wall padre.
Después:
`F-FE-084 → 085 → 086 → 087 → 088 → 089`

## Cómputo visible obligatorio
`[NODO][SEGMENTO][PASO][WRITE_SCOPE][BASE_SHA][ACCIÓN][RESULTADO][GAP][FIX][TEST][PASS/FAIL][RUN/JOB][SIGUIENTE]`

## Política de colisión
Si otro chat ya reclamó el nodo o cualquiera de sus paths:
`READ_FRESH → NO WRITE → RELEASE/SKIP → NEXT DEPENDENCY-SATISFIED NODE`.

## Cierre de cada nodo
Un productor termina en `PASS_RELEASED` o `GAP_RESOLVABLE`.
Nunca promociona live.
El integrador posterior compone sólo segmentos `PASS_RELEASED`, ejecuta browser regression y mantiene `TESTED_SHA == PUBLISHED_SHA`.

## NEXT_WORKPACK — CONTINUIDAD AUTOMÁTICA FRONTEND
Cuando este chat agote su cola actual y no tenga nodo activo, **no inventar trabajo ni detener el frontend**. Leer fresh:

`UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/FACTORY-FRONTEND-GROK-WORKPACK-100-V1-2026-09-14.json`

Luego leer:

`UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-GROK-MULTI-FRONTEND-WORKPACK-100-2026-09-14.md`

El pack siguiente contiene `F-FE-090..189` y usa claims separados por nodo bajo:

`UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/claims/frontend-workpack-100/`

Antes de saltar al siguiente pack: `READ FRESH → confirmar que el nodo actual terminó PASS_RELEASED/GAP_RESOLVABLE → liberar → elegir sólo un nodo claimable sin colisión`.
