# RESEARCH — P08 MEMORY / P09 RETRIEVAL / P10 CONTEXT FABRIC

Fecha: 2026-09-12
Contrato: `tel.workflow/v3`
Estado: `RESEARCH_ONLY_NO_DOWNLOAD_AUTHORIZED`
Regla: `REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.

## GAP confirmado

El X-Ray first-party no localizó implementación completa de Memory/Audit, retrieval/context fabric ni Agent↔Memory boundary bajo runtime. `runtime/src/agent` y `runtime/src/storage` permanecen vacíos; no se localizó por code-search interno una implementación Graphiti/pgvector/Mem0/Letta equivalente.

## Candidatos oficiales actuales

### 1. Graphiti — `getzep/graphiti`
URL: https://github.com/getzep/graphiti
Capacidad útil: temporal context graph, provenance por episodios/raw source, historial temporal, hybrid retrieval semantic+keyword+graph.
Encaje: P09/P10 y relaciones `SUPPORTS/CONTRADICTS/DEPENDS_ON/DERIVED_FROM` de la fuente de verdad.
Riesgo: añade graph storage/dependencies; no debe convertirse en workflow owner ni escribir memoria canónica sin gate YAIWES.
Veredicto: `CANDIDATE_DONOR_ADAPTER`, no descarga automática.

### 2. Mem0 — `mem0ai/mem0`
URL: https://github.com/mem0ai/mem0
Capacidad útil: persistent memory layer para agentes/aplicaciones.
Encaje: P08 long-term memory si se encapsula detrás de `MemoryContract`.
Riesgo: su política interna de memoria no sustituye el pipeline YAIWES `NORMALIZER→SCHEMA→AUDIT→STATE_DELTA→MEMORY_UPDATE`.
Veredicto: `CANDIDATE_MEMORY_BACKEND`, sólo después de contrato determinista.

### 3. LlamaIndex OSS — `run-llama/llama_index`
URL: https://github.com/run-llama/llama_index
Capacidad útil: retrieval/context, parsing/index integrations, memory abstractions.
Encaje: donor para P09/P10; preferir componentes core/integrations concretos, no adoptar su orchestration/agent loop.
Riesgo: varias estrategias son agentic/LLM-driven; cualquier uso debe pasar gate LLM<=4%.
Veredicto: `CANDIDATE_RETRIEVAL_DONOR`, no segundo orquestador.

### 4. Letta — `letta-ai/letta` / active `letta-ai/letta-code`
URL: https://github.com/letta-ai/letta
Capacidad útil: stateful agents con memoria persistente.
Encaje: referencia/donor de boundaries de identidad/memory/session.
Riesgo: adopción completa duplicaría Agent/runtime/owner y chocaría con Stabilize + arquitectura YAIWES.
Veredicto: `REFERENCE_ONLY_OR_SMALL_DONOR`, no runtime replacement.

## Decisión

No montar motores todavía. Sol1 debe primero ejecutar `WF-G08-MEMORY`: definir el contrato YAIWES mínimo, canonical-write gate y tests. Sólo si una capability queda realmente ausente después de ese delta se elige UN backend/donor con provenance pinneado y destino literal.

## Nodo siguiente

`WF-G08-MEMORY` → contrato first-party determinista → test → medir capability residual → decidir REUSE/ADAPT/NEW_DOWNLOAD.
