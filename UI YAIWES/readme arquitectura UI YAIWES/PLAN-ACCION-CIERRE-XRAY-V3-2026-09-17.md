# PLAN DE ACCIÓN Y CIERRE X-RAY UI YAIWES — V3
Fecha: 2026-09-17
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`

## Estado forense de entrada
- HEAD debe releerse antes de cada write.
- Inventario físico X-Ray: **207 directorios** en 5 raíces de componentes.
- Identidades normalizadas: **196**.
- Grupos duplicados/repetidos detectados: **10**.
- Fuente detallada: `XRAY-COMPONENT-INVENTORY-V1-2026-09-17.json`.
- Crazy Wall X-Ray: `CRAZY-WALL-XRAY-COMPONENT-INTEGRATION-CLOSURE-V1-2026-09-17.json`.
- Regla: `SOURCE_PRESENT != INTEGRATED != WIRED != TESTED != VERIFIED_CLOSED`.

## Plan de acción
1. READ_FRESH: HEAD + autoridades + claims + CI.
2. XRAY INVENTORY: reconciliar raíces físicas, provenance y duplicados.
3. DEDUP: seleccionar un canonical source por capacidad; jamás borrar sin hash/provenance.
4. MAP CAPABILITY: componente -> capacidad -> requisito real S1/S2/S3/S4.
5. UI/EDITOR: reutilizar componentes existentes para controles/canvas/editor sólo ante GAP probado.
6. STATE/IO/MEMORY/DOCS: integrar únicamente adapters necesarios para persistencia/import/recovery.
7. AI/MCP/AGENTS: MCP/API; conservar un único router/state owner.
8. SECURITY/OBSERVABILITY: SECRET_REF_ONLY + policy/auth/telemetry según requisito.
9. TEST/CI: focused test -> evidence -> trusted CI completed/success -> five-pass -> readback.
10. PLATFORM: runtime/virtualización sólo si el alcance soportado demuestra necesidad.
11. USER-REQUESTED: Codebase Memory MCP, OmniRoute, Orca, Omarchy, Anydoc con gates separados de acquisition/copy/wiring.
12. RECONCILE: detectar duplicate owners, orphan integrations y contradicciones.
13. CERTIFY: continuar GAP-02/03/04/05 por child node no colisionante.
14. ACCEPT: browser E2E + real-platform acceptance.
15. GLOBAL: 167/167 + zero missing/contradiction/orphan + exact published SHA.
16. FINAL JUDGE: entry/exit goals + Council12 + refutaciones + handoff/recovery final.

## Política de integración por clase
- EDITOR/UI: React/Radix/shadcn/CodeMirror/XYFlow/Rete/Excalidraw/etc. -> donor/adapter; no segundo editor owner.
- MEMORY/DATA: Qdrant/pgvector/DuckDB/LanceDB/etc. -> un canonical write path por clase.
- AI/AGENTS/MCP: LiteLLM/MCP SDK/agents -> adapters; no segundo router/state engine.
- DOCUMENT: Docling/Tika/Anydoc/etc. -> FileImport -> Normalize -> Markdown/Artifact.
- SECURITY: Casbin/OPA/OpenFGA/OpenBao/SOPS/etc. -> policy/secret adapters sólo donde exista requirement.
- OBSERVABILITY: OTel/Prometheus/Grafana/Loki/etc. -> evidence/telemetry, no canonical state.
- TEST: pytest/Vitest/Playwright/MSW/etc. -> verificación exact-SHA.
- PLATFORM: QEMU/crosvm/Firecracker/gVisor/etc. -> sólo alcance soportado probado.
- FRONTEND DONORS: biblioteca `📂componentes open soure fromtend` -> reutilizar capacidad, no importar apps completas sin necesidad.

## Componentes solicitados 2026-09-17
- Codebase Memory MCP -> MCP code-intelligence.
- OmniRoute -> ProviderGateway; no reemplaza router canónico.
- Orca -> UI/agent-surface donor; primero completar adquisición.
- Omarchy -> ENVIRONMENT/OS DONOR; no dependencia frontend.
- Anydoc -> document->Markdown; excluido de copia Motor3 a `UI YAIWES interface`.

## 10 simulaciones fail-closed
HEAD cambiado; claim activo; source faltante; marker faltante; hash mismatch; destination collision; CI failure/pending; secreto detectado; exclusión Anydoc violada; gate global incompleto.
**Cualquiera de los 10 bloquea PASS.**

## Gate de cierre
No `VERIFIED_CLOSED` global sin:
S1 20/20; S2 14/14; S3 64/64; S4 69/69; TOTAL 167/167; missing_trace=0; contradiction=0; orphan=0; browser E2E PASS; aceptación real del alcance soportado; TESTED_SHA==PUBLISHED_SHA; 12 entry goals; 12 exit goals; Council12; 3 refutaciones; Final Judge VERIFIED_CLOSED.

## Bucle del watchdog
`READ_FRESH -> CLAIM_ONE -> VERIFY_RESEARCH -> EXECUTE_DELTA -> TEST_REPORT -> READBACK -> RELEASE -> NEXT`

El watchdog puede cerrar componentes no necesarios como `VERIFIED_NO_NEED`; no existe obligación de integrar cada repo descargado.
