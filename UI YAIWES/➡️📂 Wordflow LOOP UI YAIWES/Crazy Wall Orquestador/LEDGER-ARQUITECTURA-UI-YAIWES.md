# LEDGER ARQUITECTURA — UI YAIWES

Contrato: `tel.workflow/v3`
Modo: FAIL-CLOSED

## Autoridades
1. Instrucciones literales del Director en el chat actual.
2. Arquitectura de trabajo fuente: `maxbry123-commits/agentes/➡️📂 Wordflow LOOP Yaiwes`.
3. README backend de este destino: `UI YAIWES/README arquitectura UI YAIWES.md`.
4. STATE/CHECKPOINT/RECOVERY/Crazy Wall del destino.

## Evidencia fuente recuperada
- Wordflow tree SHA: `4d0ed5e0910ca6fe573b7b3dac83d2c451ba49b3`.
- Source STATE blob: `bb0d1608c2b899eccf64fa0dd52d7eb9e26ee3e9`.
- Source CHECKPOINT blob: `5bfa8f5d1f355972714a8a0959ba888ecc8f70b2`.
- Source HANDOFF blob: `d2a5b8383082bfef4f1451ebfea857cd39908fd9`.
- Source BITACORA blob: `07b249ee9c83592cf7ab51f502a4c929e7a70d97`.

## Métodos recuperados por commit canónico
### Método de trabajo
Commit: `8024e57606cedc34592ef18b3565c624b1e6d676`
Blob leído: `82096da0f52d45624344eeaf8eedf8c7ae0a0f42`

### Auditoría forense
Commit: `2072d535920573550a443cf9a3967ab66b50375c`
Blob leído: `11e3fb376d252818bf23f2cf7b84252d336e1fec`

### Estándar ingeniería
Commit: `7bc798ad4173f39f758abd3d4e6cbc2d909658e6`
Blob leído: `5c4f0d8b22880af6f5677d6da5d9ae8f24604b53`

## Decisiones aprobadas para UI YAIWES
- `Stabilize CORE` = único owner de workflow.
- No crear micro-orquestador desde cero.
- No ejecutar Dagu/redun como runtimes paralelos.
- Dagu dona patrón declarativo YAML/IR.
- redun dona hashing/provenance/fingerprint.
- Router existente se cablea por adapter.
- Memory existente se cablea por adapter.
- Grok se encarga del frontend.
- Este árbol se limita a backend/Wordflow/integración.

## Estado inicial de componentes
Ruta esperada: `UI YAIWES/componentes/`.
Comprobación inicial: `404 / NOT_FOUND`.
Interpretación: descarga de Codex todavía no visible en esa lectura; no se declara fallo del proceso de Codex, solo ausencia observable en ese instante.

## Regla de ledger
Un evento pasado no se reescribe como si nunca hubiera ocurrido. Correcciones posteriores se agregan como eventos/deltas nuevos con evidencia.

## Cierre
Sin ruta + SHA/commit + test/check real, un componente puede estar `PRESENT` pero no `INTEGRATED`.
