# HANDOFF — GROK FRONTEND — 100 + DELTA 30 — 2026-09-14

Repo `maxbry123-commits/frontend`, branch `main`, `tel.workflow/v3`, `FAIL_CLOSED_LOOP`.

## READ FRESH
1. `FACTORY-FRONTEND-GROK-WORKPACK-100-V1-2026-09-14.json` — autoridad de F-FE-090..189.
2. `FACTORY-FRONTEND-CONTROL-NODES-090-154-V1-2026-09-14.json` — 65 controles aislados.
3. `FACTORY-FRONTEND-OSS-NODES-155-173-V1-2026-09-14.json` — 19 adapters OSS.
4. `FACTORY-FRONTEND-IMPROVEMENT-NODES-174-189-V1-2026-09-14.json` — 16 mejoras.
5. `FACTORY-FRONTEND-DELTA-NODES-190-219-V1-2026-09-14.json` — 30 gaps residuales no duplicados.
6. Crazy Wall segmentado + registry + claims fresh.

`FACTORY-FRONTEND-GROK-WORKPACK-100-V2-2026-09-14.json` está SUPERSEDED; NO reclamar nodos desde ese archivo.

## REPARTO
Workpack 100 ya divide GROK-A..J en bloques de 10. Delta adicional:
- GROK-K: 190..194
- GROK-L: 195..199
- GROK-M: 200..204
- GROK-N: 205..209
- GROK-O: 210..214
- GROK-P: 215..219

Cada instancia: `READ_FRESH -> CLAIM_ONE -> VERIFY_RESEARCH -> EXECUTE_DELTA -> TEST_REPORT -> READBACK -> PASS_RELEASED|GAP_RESOLVABLE -> NEXT`.

## REGLA DE BOTONES
Cada control se prueba aislado. PASS requiere efecto observable real en estado/UI/output. No basta que el botón exista, sea clickable o no arroje excepción. Persistencia se verifica con reload cuando aplique. Disabled sólo pasa con razón visible determinista. QA detecta GAP pero no parchea producto; el fix va en nodo separado y segmentado.

## OSS
Inventario local no significa integración. Confirmados activos: Frappe Builder, xyflow, Craft.js, Lucide y Playwright. Los demás pasan por `gap -> dedup local -> extract/copy existente -> adapter fino -> microtest`.

Motores existentes obligatorios:
- extracción ZIP: `➡️📂motores de descarga extracción copiado movimiento archivos fromtend/➡️📂 Motor de extracción zip/motor_1_extract_only.py`
- copiar lotes: `➡️📂motores de descarga extracción copiado movimiento archivos fromtend/➡️📂motor de copiar archivos/motor_3_copy_batches.py`
- copiar raíz: `➡️📂motores de descarga extracción copiado movimiento archivos fromtend/➡️📂motor de copiar archivos/motor_copy_root_to_repo.py`
- adquisición nueva: Motor2 canónico únicamente si queda GAP después de dedup local y provenance gate.

Nunca copiar monolitos completos sólo porque están disponibles. OpenPencil/Onlook/Webstudio/tldraw son donantes de patrones acotados; assistant-ui/Dockview/i18next son adapters finos. Mermaid y skills QA pueden extraerse con motor existente si el nodo demuestra necesidad.

## COLISIONES
1 chat = 1 nodo. 1 path = 1 writer. Antes de cada write releer main + claim exacto. Si path/nodo ocupado: NO WRITE, saltar al siguiente FREE válido de la propia lane. Productores no tocan candidato/entrypoint. Sólo SEG-11 integra.

## CIERRE
F-FE-219 exige mapa completo de controles descubiertos en un mismo candidato, pero no puede declarar FRONTEND_100. El cierre final sigue siendo F-UI-063 y requiere `TESTED_SHA == PUBLISHED_SHA`.
