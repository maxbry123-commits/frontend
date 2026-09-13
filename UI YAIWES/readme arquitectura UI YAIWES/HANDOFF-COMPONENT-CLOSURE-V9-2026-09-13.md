# HANDOFF — COMPONENT CLOSURE — V9

Repo: `maxbry123-commits/frontend`  
Branch: `main`  
Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`

## Reentrada obligatoria

1. Arquitectura base V7.
2. `ARQUITECTURA-COMPONENT-CLOSURE-V8-2026-09-13.md`.
3. Crazy Wall base `CRAZY-WALL-TASK-NODES-DYNAMIC-V5-2026-09-12.json`.
4. Overlay `CRAZY-WALL-COMPONENT-CLOSURE-V6-2026-09-13.json`.
5. Estado `COMPONENT-CLOSURE-STATE-2026-09-13.json`.
6. Gap Ledger + reports/runs/logs frescos + HEAD real.

Autoridad: `code/test/run/log/readback real > state/overlay > architecture/handoff > historical chat`.

## Estado componente por componente

- **N07 Vite — GAP_RESOLVABLE.** Fuente oficial Vite v8.3.0 / commit `434e8e9495436a60789f2b588a04a6a24a3d1661`. Run `34732661919`, job `103658218081`: FAIL esperado, `SOURCE_SPECIAL_FILE_GAP`; no publicación. Buscar StrategyDelta oficial/equivalencia. N12 bloqueado.
- **N08 Supabase — NO_DOWNLOAD hasta prueba.** La matriz fresca de requisitos no demuestra obligación literal. No inventar destino/capability.
- **N09 DuckDB — GAP_RESOLVABLE.** El Gap Ledger registra fuente oficial incompatible por special files. No sanitizar ni alterar motor.
- **N10 AVF — GAP_RESOLVABLE.** Fuente canónica `android.googlesource` fuera del transporte GitHub-only; además falta capability probe Android ARM64/Cuttlefish/hardware guest boot. Separar adquisición de capability.
- **N11 big-AGI — GAP_RESOLVABLE.** Fuente `enricoros/big-AGI`, MIT. Run `34734227288`, job `103662591732`: `SOURCE_SPECIAL_FILE_GAP:AGENTS.md`; no publicación.
- **N13 Vercel AI SDK — GAP_RESOLVABLE.** Fuente `vercel/ai`, ref `ai@5.0.257`, commit `82137ec13283bb0f72d89f192403ab7378194a37`, Apache-2.0. Run `34734135513`, job `103662336769`: `SOURCE_SPECIAL_FILE_GAP:README.md`; no publicación.

## Siguiente StrategyDelta

Trabajar 1×1 y no repetir exactamente el mismo intento:

1. N07: comprobar ref/subtree/release oficial Vite compatible con el motor o equivalencia ya existente en UI/factory.
2. N11: comprobar ref/release/subtree oficial big-AGI sin romper provenance; si no existe, clasificar donor capability equivalente ya presente.
3. N13: comprobar release/ref/subtree oficial Vercel AI SDK compatible; integración permanece bloqueada hasta SOURCE_PRESENT readback.
4. N09: investigar adquisición oficial DuckDB compatible con el contrato, sin sanitización.
5. N10: resolver provider AVF y capability Android como subgates distintos.
6. N08 sólo si aparece prueba literal de requisito/capability/destino.

No descargar componentes adicionales salvo capability gap único probado.

## Claim/watchdog

`1 chat = 1 active node`. Cada claim exige HEAD fresco, node_id, owner/chat_id, scope y timestamp. Si pasan >4h sin evidencia verificable nueva, `STALE_REOPENED`, liberar owner y devolver a FREE. Un FAIL fresco con run/log es evidencia y exige StrategyDelta, no reapertura inmediata por inactividad.

## Cierre

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

No declarar estos nodos cerrados mientras los motores sólo hayan producido fail-closed; ese resultado sí es evidencia útil porque elimina estrategias inválidas.