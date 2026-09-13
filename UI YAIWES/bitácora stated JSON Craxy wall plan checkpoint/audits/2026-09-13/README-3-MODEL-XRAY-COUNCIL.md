# UI YAIWES — PROGRAMA 3 MODELOS / XRAY + COUNCIL12

Contrato `tel.workflow/v3`; modo `FAIL_CLOSED_LOOP`. Objetivo: tres modelos independientes intentan refutar la completitud y proponen mejoras medibles, no confirman narrativas previas.

## Lectura fresca obligatoria
HEAD/main + árbol raíz `UI YAIWES/`; `READ-FIRST-AUTHORITY-INDEX-2026-09-13.md`; Crazy Wall V5 + extensión N34/N35; arquitectura consolidada + Python DSL/DAG V7; Handoff dinámico; Contrato Maestro Forense; S1 MAX-SYSTEM + S2 Virtual Computer + S3 Memory/Workflow + S4 Command Center; código/runtime/Wordflow/UI/factory/components; tests + Actions/reports/logs.

## Asignación
- Modelo A: `AUDIT-A-ARCHITECTURE-PRODUCT-COMPLETENESS.md`
- Modelo B: `AUDIT-B-RUNTIME-SECURITY-RELIABILITY.md`
- Modelo C: `AUDIT-C-UX-PERFORMANCE-10X-DELIVERY.md`

Cada modelo termina su informe antes de leer los otros. Luego: tabla `A vs B vs C`; acuerdo 3/3, mayoría 2/3, desacuerdo 1/3. Una recomendación sólo entra al backlog si tiene evidencia, destino, owner/scope, test y no duplica capability existente. Capability huérfana demostrada → nodo literal nuevo; capability con owner → GAP del nodo existente.

## Prohibiciones
No inventar % global; documentación ≠ implementación; no segundo scheduler/orchestrator/auditor; no descarga OSS por catálogo; no borrar provenance; no declarar 10x sin baseline+candidate medidos. Sin URL/SHA/path/run real → `INSUFFICIENT_EVIDENCE`.

## Salida conjunta
Gaps deduplicados + contradicciones + recomendaciones rankeadas por impacto/evidencia/coste/riesgo + nodos necesarios + lista de cosas que NO deben construirse + verdict `VERIFIED_CLOSED|CLOSED_UNVERIFIED|INCONCLUSIVE`.
