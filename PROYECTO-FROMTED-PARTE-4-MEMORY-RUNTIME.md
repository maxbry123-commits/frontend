# PROYECTO FROMTED — PARTE 4: MEMORY RUNTIME

Fecha: 2026-07-28 00:45 -05  
Estado: ACTIVO — investigación + arquitectura (no build aún)  
Integra: input Memory Runtime del usuario + todo lo Vercel-posible de PARTE-3

---

## 0. INPUT USUARIO (literal sentido)

Memory Runtime con motores especializados; UI solo consume API local.

Componentes nombrados: Memory Manager · Context Builder · Cache Manager · Index Manager · Vector Engine · Storage Adapter · Transaction Log · Snapshot Manager · Sync Manager.

Pipeline escritura: store → Transaction → Validate → Index → Vectorize → Commit → Return ID.  
StorageProvider interface (SQLite, DuckDB, File, Xata, Drive, S3).  
Memory Record + Chunk Engine.  
Índices múltiples.  
Cache L1/L2.  
Context Builder multi-paso.  
Relation Graph.  
Snapshot + Transaction Log.  
Sync por diff.  
Memory API pública a la UI.  
Búsqueda paralela keyword+vector+graph+time.

Pide: investigar y mejorar 100× · plan de investigación · pasar por pasos de razonamiento · mostrar.

---

## 1. RAZONAMIENTO (flujo usuario)

### Audit3
1. UI no toca storage directo.  
2. Debe poder vivir en **Vercel/browser** lo máximo posible (PARTE-3).  
3. No reimplementar Graphiti/Graphify dentro del frontend como motores pesados.

### 6 goals in
G1 API estable `memory.*` hacia la UI  
G2 Storage intercambiable  
G3 Chunk + embedding + search en cliente cuando quepa  
G4 Pipeline escritura determinista  
G5 Sync opcional cloud sin mandar DB entera  
G6 Cero sobreingeniería en v1 (subset que corre en browser)

### Refut + experto
- **Refut:** montar 9 managers + DuckDB + S3 + graph completo el día 1 = sobreingeniería y no cabe en Vercel.  
- **Experto:** v1 browser = IndexedDB + HNSW JS + transformers.js en Worker + API facade.  
- **Refut:** embeddings siempre en servidor = rompe “local” y mete latencia/coste.  
- **Experto:** embeddings locales pequeños (MiniLM) en Worker; cloud embedding solo si el usuario lo elige.  
- **Refut:** relation graph tipo Neo4j en browser = frágil.  
- **Experto:** grafo ligero (adjacency list en IDB) o diferir grafo pesado a Graphiti en VPS.

### Council (síntesis)
Memory Runtime se parte en **2 tiers**:

| Tier | Dónde | Qué |
|------|-------|-----|
| **M0 Browser** (Vercel static) | Cliente | IDB storage, chunk, embed local, HNSW, cache RAM, Memory API, transaction log simple, snapshot JSON |
| **M1 Server** (VPS/cloud después) | Fuera | Graphiti/Graphify, pgvector, sync multi-device, DuckDB analítico, S3 cold |

UI siempre habla solo con Memory API; el tier se elige por config.

### 12 goals out (plan investigación → luego build)
1. Inventariar libs browser vector/RAG (abajo).  
2. Definir Memory API surface mínima v1.  
3. StorageProvider: IndexedDBProvider primero.  
4. Chunker determinista (token/size).  
5. Vector engine: mememo / veclite / entity-db.  
6. Embeddings: transformers.js Worker.  
7. Context Builder v1: search → rank → top-k → string context.  
8. Transaction log append-only en IDB.  
9. Snapshot export/import JSON.  
10. Sync Manager: stub (export diff); real en M1.  
11. Relation graph: ids + edges ligeros en M0; Graphiti en M1.  
12. Criterios de aceptación + manifest sources memoria.

---

## 2. MEJORAS ×100 (respecto al diseño crudo)

| # | Idea original | Mejora |
|---|---------------|--------|
| 1 | Un solo runtime monolítico | **2 tiers** M0 browser / M1 server |
| 2 | SQLite en UI | Interface; M0 = IndexedDB, no SQLite WASM obligado día 1 |
| 3 | DuckDB/S3 día 1 | Providers M1; no bloquean Vercel |
| 4 | Vector engine abstracto | Anclar a **mememo / VecLite / EntityDB** (OS real) |
| 5 | Embeddings sin especificar | **transformers.js** MiniLM en Web Worker |
| 6 | 5 búsquedas paralelas siempre | M0: keyword (IDB) + vector; graph/time en M1 o ligero |
| 7 | Relation graph pesado | Adjacency list M0; Graphiti M1 |
| 8 | Sync DB completa | Solo **transaction diff** (ya lo dijiste) + opcional |
| 9 | Snapshot genérico | JSON + checksum; restore = clear+replay log |
| 10 | Cache L1/L2/L3 genérico | L1 Map en RAM; L2 IDB; sin “SSD” inventado en browser |
| 11 | Memory Record gigante | Obligar **chunks**; doc = metadata + chunk_ids |
| 12 | UI conoce paths | **Prohibido**; solo `memory.store/search/...` |
| 13 | Un pipeline de escritura | Idempotente + dedupe por hash contenido |
| 14 | Context al LLM | Límite tokens configurable; compress = truncate+summary stub |
| 15 | Todo en un proceso | Embed + search en **Worker** para no freeze UI |
| 16 | Portable Vercel→CF | Memory M0 100% cliente = cero lock-in host |
| 17 | OpenClaw | Memory API como tool/MCP después; no mezclar kernel |
| 18 | Multi-device | Sync M1; M0 single-device primero |
| 19 | Seguridad | Sin secrets en IDB; datos usuario local |
| 20 | Observabilidad | tx log consultable desde panel Diagnóstico UI |

(Principio: cada “manager” es un módulo con interface; v1 implementa 4–5, el resto stub.)

---

## 3. QUÉ DE MEMORY CORRE EN VERCEL (SÍ/NO)

| Componente | ¿Vercel/browser M0? |
|------------|---------------------|
| Memory API facade | SÍ |
| Memory Manager pipeline | SÍ (simplificado) |
| Storage IndexedDB | SÍ |
| Storage SQLite WASM | Opcional después |
| Storage Xata/S3/Postgres | NO (M1) |
| Chunk Engine | SÍ |
| Vector HNSW JS / WASM | SÍ |
| Embeddings transformers.js | SÍ (Worker; modelo ~20–30MB) |
| Cache L1 RAM | SÍ |
| Transaction log | SÍ |
| Snapshot JSON | SÍ |
| Sync multi-device real | NO (M1) |
| Graphiti full | NO (M1 / ya en programs) |
| Context Builder top-k | SÍ |
| Keyword search | SÍ |
| Graph search pesado | NO / mínimo edges M0 |

---

## 4. SOURCES OS PARA MEMORY (investigación)

| # | Repo | URL | Uso M0 |
|---|------|-----|--------|
| 1 | poloclub/mememo | https://github.com/poloclub/mememo | HNSW + IndexedDB browser |
| 2 | thealpha93/VecLite | https://github.com/thealpha93/VecLite | Vector WASM + RAG pipeline browser |
| 3 | babycommando/entity-db | https://github.com/babycommando/entity-db | IDB + transformers.js |
| 4 | stevenic/vectra | https://github.com/stevenic/vectra | Local vector; browser entry |
| 5 | kyrillosishak/Domicile (Haven) | https://github.com/kyrillosishak/Haven | Stack privado browser RAG |
| 6 | transformers.js | Hugging Face | Embeddings cliente |
| 7 | OpenMemory | https://github.com/CaviraOSS/OpenMemory | Memoria agentes local-first (M1 ref) |
| 8 | graph-memory (OpenClaw plugin) | https://github.com/adoresever/graph-memory | Grafo conversación (M1/ref) |
| 9 | MemMachine | https://github.com/MemMachine/MemMachine | Capa memoria agentes (M1) |
| 10 | activegraph | activegraph.ai / yoheinakajima | Event log → graph (M1 ideas) |

---

## 5. PLAN DE INVESTIGACIÓN (pasos)

### I-MEM-1 — Browser vector (hecho preliminar arriba)
- Comparar mememo vs VecLite vs EntityDB: API, tamaño, IDB, licencia.  
- Elegir **1** primario + 1 backup.

### I-MEM-2 — Embeddings cliente
- Modelo default: `Xenova/all-MiniLM-L6-v2` o equivalente quant.  
- Worker lifecycle: load once, queue embed, unload policy.

### I-MEM-3 — Schema Memory Record + Chunk
- JSON schema exacto (zod) alineado a tu propuesta.  
- Hash contenido para dedupe.

### I-MEM-4 — Transaction + Snapshot
- Formato tx log.  
- Restore procedure testable en unit test sin UI.

### I-MEM-5 — Context Builder contratos
- Input query + limits.  
- Output `{ context: string, citations: id[] }`.

### I-MEM-6 — Límites móvil
- Cuotas IDB.  
- Max chunks / max vectors en device gama media.

### I-MEM-7 — Puente M1
- Cómo el mismo Memory API apunta a Graphiti/OpenMemory después sin cambiar UI.

**Criterio cierre investigación memoria:**  
1 lib vector elegida · schema congelado · API `memory.*` congelada · lista sources en manifest FROMTED.

---

## 6. MEMORY API v1 (contrato UI)

```ts
// Solo esto ve la UI
memory.store(recordInput) -> id
memory.load(id) -> record
memory.search({ q, limit, tags? }) -> hits[]
memory.update(id, patch) -> void
memory.delete(id) -> void
memory.history({ sessionId? }) -> ids[]
memory.snapshot() -> blob
memory.restore(blob) -> void
memory.sync() -> { status } // stub M0
memory.buildContext(query, opts) -> { context, citations }
```

---

## 7. INTEGRACIÓN CON FROMTED EN VERCEL

```
FROMTED UI (Vercel)
  ├─ Chat → provider cloud + memory.buildContext(query)
  ├─ Panel docs → memory.store / search (chunks)
  ├─ Historial → memory.history + load
  ├─ Diagnóstico → tx log / snapshot download
  └─ Config → elegir embed local ON/OFF

Memory Runtime M0 (mismo bundle JS, Workers)
  └─ IndexedDB + Vector lib + transformers.js

M1 futuro (VPS)
  └─ Graphiti / Graphify / OpenMemory ← misma API
```

---

## 8. QUÉ NO HACER

- No DuckDB/S3 en v1 web.  
- No Graphiti embebido en el bundle Vercel.  
- No escribir SQLite desde componentes React.  
- No sync completo de DB.  
- No bloquear chat por carga de modelo embed (Worker + lazy).

---

## 9. TRAZABILIDAD

| Doc | Rol |
|-----|-----|
| PARTE-3 | Vercel sí/no general |
| **PARTE-4** | Memory Runtime + research + mejoras |
| PLAN-DETALLADO | Pasos UI; memoria se inserta tras chat v1 o en paralelo panel docs |

---

## 10. SIGUIENTE

1. Cerrar I-MEM-1 (elegir lib vector) en una pasada corta.  
2. Congelar schema + Memory API.  
3. Añadir al manifest sources: mememo/veclite/entity-db + transformers.  
4. Implementación M0 **después** de chat shell en Vercel (o en paralelo al panel docs).

FIN PARTE 4.
