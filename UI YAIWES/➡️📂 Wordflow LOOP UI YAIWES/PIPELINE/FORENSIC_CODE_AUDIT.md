# FORENSIC_CODE_AUDIT — UI YAIWES

Estado: CANONICAL BRIDGE / X-RAY
Contrato: `tel.workflow/v3`

Fuente histórica recuperada:
https://github.com/maxbry123-commits/agentes/blob/2072d535920573550a443cf9a3967ab66b50375c/PIPELINE/FORENSIC_CODE_AUDIT.md

## Método X-Ray obligatorio
1. Pasada literal: requisito, INPUT, autorización, prohibiciones y destino exacto.
2. Pasada arquitectura: documento ↔ capa ↔ ruta ↔ contrato.
3. Pasada código: archivo ↔ símbolo ↔ imports ↔ wiring ↔ schema ↔ test.
4. Pasada evidencia: ejecución/test/hash/diff/commit/URL real.
5. Pasada cruzada: README ↔ documentos ↔ componentes ↔ código ↔ CHECKPOINT ↔ RECOVERY ↔ STATE ↔ Crazy Wall/HANDOFF.
6. Pasada integración: componente OSS ↔ función requerida ↔ adapter ↔ runtime Stabilize ↔ Router/Memory ↔ test E2E.

Cada pasada termina con refutación. Si hay GAP, aplicar delta quirúrgico; no reescribir la fuente completa.

## Estados
`REAL | PARCIAL | ESQUELETO | FALTANTE | DECLARADO_NO_VERIFICADO | WIRED | TESTED | VERIFIED_CLOSED`

## Regla de prueba
- archivo presente ≠ integrado;
- import presente ≠ cableado;
- dependencia instalada ≠ usada;
- documento aprobado ≠ runtime ejecutable;
- componente descargado ≠ adaptado;
- claim de LLM ≠ PASS.

## Evidencia mínima por nodo
`node_id + source path/URL/SHA + destination + diff/commit + test/check + evidence ref/hash + checkpoint + rollback`

## Checks especiales UI YAIWES
- Stabilize es único owner del workflow.
- Router no se duplica.
- Memory no se duplica.
- retry cognitivo exige StrategyDelta distinto.
- output inválido no modifica estado canónico.
- coverage incompleta bloquea COMPLETE.
- crash/recovery no duplica side effects.
- final judge no acepta auto-declaración del modelo.

## Fail-closed
Fuente ausente, 404 no resuelto, divergencia entre anclas, wiring incompleto o ausencia de prueba real => `GAP`.
