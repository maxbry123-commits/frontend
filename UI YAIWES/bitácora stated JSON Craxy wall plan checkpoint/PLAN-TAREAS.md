# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01A ✅ Inventario raíz: 0 component dirs sueltos; 14 centralizados.
2. P01B ✅ Revisión code-root 14/14.
3. P01C ✅ SOURCE_URL + SOURCE_COMMIT + tree/code-root + destino/dedup 14/14; read-back independiente PASS.
4. P01D ✅ Socket universal modular + local tests 5/5 + GitHub file read-back.
5. P01E ✅ Stabilize code-only vendor copy.
6. P01 ✅ VERIFIED_CLOSED — matriz física/provenance 14/14 reconciliada.
7. P02A 🚩 CLOSED_UNVERIFIED_WITH_FLAG — factory Stabilize + Queue/WorkflowStore + allowlist + loader/health están cableados; FakeOrchestrator tests 5/5 y guards publicados. Verificación con `stabilize.Orchestrator` real bloqueada porque el entorno local no resuelve `github.com`; no se declara PASS.
8. P02A-RECOVERY PENDING — cuando exista entorno ejecutable, montar vendor real mediante el mismo `stabilize_adapter`; prohibido crear adapter duplicado.
9. P02B ACTIVE_SAFE — Pydantic contract plugin aislado y deshabilitado por defecto; primero 5 búsquedas obligatorias + inspección `pydantic/` y `pydantic-core` + contratos/tests.
10. P02C PENDING — Rule Engine policy plugin.
11. P03 — HTTPX/Starlette adapters.
12. P04 — Bulkman/resilient-circuit.
13. P05 — structlog/OpenTelemetry; SDK OTel separado.
14. P06 — pytest/Hypothesis test-only.
15. P07 — Dagu/redun donor-only.
16. P08 — PyCasbin policy.

Búsquedas obligatorias por nodo antes de programar: raíz central UI YAIWES → todas las raíces frontend → agentes → router-universal-router-inteligente- → osquestador-auditor. Solo reutilizar con provenance/destino/dedup.

Revisión obligatoria: arquitectura UI ×4 + fuentes de verdad ×4. GAP documental vigente: arquitectura canónica contiene 4 documentos únicos efectivos mientras una instrucción posterior menciona 3 enlaces; no inventar una terna.

Regla flag: un bloqueo se persiste con evidencia y recuperación, no se transforma en PASS; después puede continuar el siguiente nodo que sea seguro e independiente.

Invariante: `SOURCE_URL+COMMIT → code-root SHA → capability passport → adapter/factory → registry → mount guard → health/test → evidence`. No monolitos; código presente ≠ integración; sin evidencia real no VERIFIED_CLOSED.
