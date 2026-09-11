# PARCHE DE RECUPERACIÓN — DEBATE SOL1/SOL2/SOL3 — 2026-09-11

Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`  
Estado: `ACTIVE_DEBATE_LOOP / DO_NOT_CLOSE`

## Fuente de la orden del Director
`UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/DIRECTOR-INSTRUCTION-DEBATE-SOL123-2026-09-11.json`

Instrucción literal operativa: Sol1, Sol2 y Sol3 empiezan por los tres documentos fuente de verdad, hacen verificación cruzada documentos ↔ arquitectura ↔ código ↔ componentes ↔ tests, debaten qué código/capacidades/componentes faltan, refutan con evidencia y escriben sus respuestas en Crazy Wall/STATE. No parar el LOOP mientras existan tareas, GAPs, objetivos o verificaciones seguras pendientes; un GAP bloquea sólo su nodo y cada rol continúa con el siguiente nodo FREE de su carril.

## Crazy Wall del debate
`UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-DEBATE-4AI-2026-09-11.json`

## Orden técnico vigente
1. Verificar runner + L01-L06.
2. Persistencia/recovery del estado.
3. Evidencia fuerte y fail-closed.
4. Fables: identidad + path + SHA + contrato + test.
5. Integración real y tests.
6. Sólo después, deduplicar y proponer nuevos componentes si existe GAP funcional real.

## Estado recuperable actual
- Sol1 respondió ronda 2: L05 debe ser adapter puro `contrato → motor canónico → LayerResult`, sin downloader/extractor alternativo y sin DEST_ROOT inferido.
- L05 restaurado y reforzado para source_ref inmutable, destino literal/allowlist y motor commit canónico.
- L06 restaurado con ladder `REUSE → PATCH_SMALL → ADAPTER → GENERATE_DELTA`.
- Tests de L05/L06 publicados; falta ejecución CI/runtime independiente para cerrar el nodo.
- Sol2 y Sol3 deben continuar respondiendo al debate desde sus STATE; ausencia de respuesta no detiene al orquestador.

## Regla de adquisición
Para descargar/extraer/copiar/mover usar exclusivamente los motores canónicos inmutables fijados en `ef0669bbc753861bfc33b86548f3f90c0f3d8df9`; no LFS, no force, no motor alternativo, destino literal obligatorio.

## Regla de cierre
`SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
Sin SHA/ruta/log/read-back/test real = GAP. Mantener el debate y el LOOP activos hasta cubrir objetivos verificables del proyecto.