# UI YAIWES — SWARM ACTIVATION MAP

Contrato `tel.workflow/v3` · `FAIL_CLOSED_LOOP` · regla: fresh-read antes de cada claim.

## OLA A — tres auditorías independientes (NO product code)
- Auditor/Modelo A → `audits/2026-09-13/AUDIT-A-ARCHITECTURE-PRODUCT-COMPLETENESS.md`.
- Auditor/Modelo B → `audits/2026-09-13/AUDIT-B-RUNTIME-SECURITY-RELIABILITY.md`.
- Auditor/Modelo C → `audits/2026-09-13/AUDIT-C-UX-PERFORMANCE-10X-DELIVERY.md`.
Cada uno publica un reporte separado; después se deduplica A/B/C. No escribir código desde la auditoría.

## OLA B — cierre de denominador/evidencia
1. **N34-FOUR-SOURCE-DENOMINATOR — FREE en extensión.** Un worker libre debe reclamarlo primero. Leer S1/S2/S3/S4 completos; recalcular denominador y detectar nuevas capabilities/nodos sólo si realmente quedan huérfanos.
2. **N35-FULL-REQUIREMENT-TRACE-CERTIFICATION — BLOCKED_AFTER_N34.** No hardcodear 98; usar el total final N34. Reusar `RequirementMatrix + five_pass + evidence verifier`; cero nuevo auditor.

## OLA C — trabajo existente, sin colisiones
Antes de reclamar revisar Crazy Wall V5 + claim markers + commits recientes. Prioridad por dependencia: N04 state reconciliation si realmente sigue sin owner; N16 checkpoint evidence; N26 integration; N28 API control; N33 mirror CI reconciliation. Si hay claim fresco externo, no tocar.

## CADENA FINAL
N07→N12. N26+N23→N27. N18+N20+N26+N28+N29→N17. N17 + N35 + capacidades adicionales que N34 descubra → N31/Final Judge. N31 no significa producto cerrado si N35 o un gap N34 sigue abierto.

## LIMPIEZA
Borrable: archivos realmente vacíos, workflows one-shot ya consumidos y claim markers redundantes sólo después de readback de cierre. Conservar: reportes, runs, arquitectura histórica y evidencias; se clasifican con READ-FIRST en lugar de borrarse. No mover/borrar código útil para “ordenar”.

## CRITERIO DE TRABAJO
`REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`; 1 chat=1 nodo; no scope overlap; `SOURCE_PRESENT != IMPLEMENTED != WIRED != TEST_PASS != VERIFIED_CLOSED`; 10x sólo con baseline+candidate repetible.
