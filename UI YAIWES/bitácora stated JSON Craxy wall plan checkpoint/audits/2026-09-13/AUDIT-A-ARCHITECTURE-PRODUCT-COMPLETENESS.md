# MODELO A — AUDITORÍA XRAY ARQUITECTURA + COMPLETITUD DE PRODUCTO

## MISIÓN
Auditar si la arquitectura, requisitos, nodos, código y evidencia describen y cubren **todo YAIWES**. No implementar. Intentar demostrar que falta algo. Autoridad: `code/test/run/log/readback > Crazy Wall/extension > arquitectura/handoff > docs > inferencia`.

## 12 GOALS DE ENTRADA
1. Leer HEAD y todo el primer nivel de `UI YAIWES/`.
2. Leer README raíz y READ-FIRST.
3. Leer arquitectura consolidada y Python DSL/DAG V7.
4. Leer Handoff vigente + Crazy Wall V5 + extensión N34/N35.
5. Leer Contrato Maestro Forense/50 goals.
6. Leer completas S1 MAX-SYSTEM, S2 Virtual Computer, S3 Memory/Workflow y S4 Command Center.
7. Reconstruir objetivo de producto sin usar porcentajes históricos.
8. Inventariar capas UI/runtime/Wordflow/memory/audit/sandbox/virtual computer/components/factory.
9. Mapear requisitos literales → capability → owner/node → código → test → evidencia.
10. Detectar requisitos omitidos, duplicados, contradictorios o sin owner.
11. Distinguir SOURCE_PRESENT/IMPLEMENTED/WIRED/TEST_PASS/VERIFIED_CLOSED.
12. Preservar provenance: path/blob/SHA/run/job/URL para cada conclusión material.

## 12 GOALS DE SALIDA
1. Denominador final de fuentes y requisitos con conteo demostrado.
2. Diferencia exacta S1/S2/S3 vs S1/S2/S3/S4.
3. Capability map completo y deduplicado.
4. Lista de capabilities huérfanas.
5. Lista de nodos redundantes/solapados.
6. Lista de arquitectura escrita pero no implementada.
7. Lista de implementación sin requisito fuente.
8. Cadena crítica hasta PRODUCT VERIFIED_CLOSED.
9. Gaps priorizados P0/P1/P2 por impacto y dependencia.
10. Recomendaciones 10x con métrica o `HYPOTHESIS`.
11. Propuesta exacta de nodos nuevos sólo cuando no exista owner.
12. Verdict fail-closed con evidencia y siguientes acciones.

## ASK COUNCIL — 12 PASOS
1. Objective: ¿la misión real está preservada?
2. Sources: ¿están las cuatro fuentes efectivas y todas sus cláusulas?
3. Scope: ¿qué pertenece realmente a UI YAIWES y qué es donor/histórico?
4. Architecture: ¿las capas forman un sistema coherente sin segundo owner?
5. Contracts: ¿cada efecto/state change cruza schema/policy/audit/judge?
6. Traceability: ¿cada requirement tiene owner/código/test/evidence?
7. Integration: ¿las piezas están wired o sólo presentes?
8. Platform: ¿Web/Android/Windows/Linux/iOS están declarados según capability real?
9. Product journey: ¿chat/work/files/windows/tasks/AI/VM/recovery cierran de punta a punta?
10. Contradictions: ¿README/Handoff/Crazy Wall/código discrepan?
11. Closure: ¿qué evidencia concreta impide hoy VERIFIED_CLOSED?
12. Recommendation: ¿cuál es el delta mínimo que más reduce riesgo/gaps?

## DEBATE INTERNO
- **Advocate:** construye el caso de que el diseño actual es suficiente y reutiliza correctamente Stabilize/Wordflow.
- **Skeptic:** intenta romperlo buscando fuente omitida, owner duplicado, capability sin wiring, porcentaje falso o evidencia débil.
- **Judge:** acepta sólo afirmaciones soportadas por evidencia fresca; emite `PASS/GAP/INCONCLUSIVE` por tema.

## 3 REFUTACIONES OBLIGATORIAS
R1. Suponer que los actuales 98 requisitos son incompletos: intentar demostrarlo contra S4 Command Center y root docs.
R2. Suponer que todos los nodos CLOSED sólo prueban subgates y no producto: buscar missing E2E/wiring/trace.
R3. Suponer que existe arquitectura innecesaria/duplicada: demostrar owner actual antes de recomendar código nuevo.

## 4 SIMULACIONES
S1 Happy path: usuario abre proyecto → chat → modelo/router → tool/agent → artifact/file → checkpoint → respuesta observable.
S2 Recovery: crash durante efecto → checkpoint/hash/ledger → restart/failover → replay idempotente → continuación sin duplicados.
S3 Cross-device: Android/Linux/Windows + guest install + mirror/control; fallar cerrado donde capability real no exista.
S4 Source change: aparece requisito nuevo en S4 → requirement/node → implementation/test/evidence → coverage → Final Judge sin perder provenance.

## RECOMENDACIONES 10X
Evaluar arquitectura, velocidad de cierre, costo, mantenibilidad, resiliencia, trazabilidad y experiencia de desarrollo. Cada recomendación debe tener `baseline`, `target`, `métrica`, `evidencia`, `delta`, `riesgo`, `dependencias`, `test`, `rollback`. Sin medición → etiquetar `HYPOTHESIS`, nunca “10x logrado”.

## FORMATO DEL INFORME
`Finding | Severity | Source anchor | Code/path | Test/run | Current owner | GAP | Minimal fix | 10x metric | Verdict`.
Terminar con: `KEEP / PATCH / DELETE / NEW NODE / NO ACTION` y máximo 10 acciones rankeadas.
