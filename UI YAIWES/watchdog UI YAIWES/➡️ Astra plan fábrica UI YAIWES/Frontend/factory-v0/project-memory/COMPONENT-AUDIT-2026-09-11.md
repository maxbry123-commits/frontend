# Component Audit — YAIWES UI Factory — 2026-09-11

Owner: `➡️ Astra plan fábrica UI YAIWES`
Gate: `T1_FACTORY_FRONTEND`
Rule: SOURCE_PRESENT != INTEGRATED != RUNTIME_PASS.

## 1. Current physical fact

The local OSS inventory under `UI YAIWES/componentes open soure UI YAIWES/` is physically present and includes the previously indexed 46 families: Apache PyCasbin, Apache Tika, Apprise, Bulkman, Chart.js, CodeMirror 6, Cosign, Dagu, Debezium, Docling, Excalidraw, FastEmbed, Firecracker, Flutter, GSAP, Grafana, Grok Build, HTTPX, Hypothesis, Jan, LanceDB, LibreChat, LiteLLM, LiveKit, Loguru, Loki, Lucide, MCP Python SDK, MCP TypeScript SDK, MSW, Mammoth.js, Meilisearch, Mesa, Moby, NATS, Open WebUI, OpenBao, OpenTelemetry Python, Oxigraph, PDF.js, PGMQ, PGlite, ParadeDB, Piper, PixiJS, Playwright.

The recursive tree confirms provenance metadata files exist in donors such as `SOURCE_COMMIT.txt`, `SOURCE_LICENSE.txt`, `SOURCE_URL.txt` for some components. Physical presence alone is not integration.

## 2. Factory integration read-back

`Frontend/factory-v0/package.json` currently declares only `@playwright/test` as a dependency/devDependency. Therefore the present Factory V0 runtime does **not** prove that the other 40+ OSS components are wired into the factory. Playwright is currently verified as test harness, not a product runtime component.

Current status:
- Playwright: VERIFIED test harness.
- Backend adapter: local factory contract boundary, not an OSS donor integration.
- All other listed OSS families: INVENTORIED / CANDIDATE until adapter/import/runtime evidence exists.

## 3. 10x candidates for Factory T1

Frontend-first candidates to evaluate one node at a time:
1. Excalidraw — visual canvas/composition patterns.
2. CodeMirror 6 — code/config editor surface.
3. Lucide — icon system.
4. Chart.js — metrics/evidence visualization.
5. GSAP — controlled motion/interaction where justified.
6. PixiJS — high-density/high-performance canvas candidate.
7. PDF.js + Mammoth.js — artifact/document preview.
8. LibreChat / Open WebUI / Jan — chat/workspace interaction references; copy capability patterns only, not monolithic imports.
9. Flutter — cross-platform architecture/reference candidate, not immediate web runtime import.
10. MSW — frontend contract/mock testing candidate.

Backend/staging candidates for future `UI YAIWES interface/Backend/` after gate/handoff:
- LiteLLM — provider/router donor.
- HTTPX — transport donor.
- MCP Python/TypeScript SDK — MCP contracts/transports.
- NATS / PGMQ — events/queue donors.
- PGlite / LanceDB / Meilisearch / ParadeDB / Oxigraph — persistence/search donors.
- Apache Tika / Docling / FastEmbed — document/ingestion/search donors.
- PyCasbin / OpenBao / Cosign — policy/secrets/supply-chain donors.
- OpenTelemetry / Grafana / Loki / Loguru — observability donors.

## 4. Interface destination audit

`UI YAIWES interface/` exists, but the requested canonical roots `Fromtend/` and `Backend/` are not evidenced in the current top-level directory listing. Because T1 is still CLOSED_UNVERIFIED, do not start productive T2 writes there yet. Creation/promotion of those roots is queued immediately after T1 VERIFIED_CLOSED + product-path handoff.

## 5. GAPs created by this audit

- `OSS_40_PLUS_PRESENT_BUT_NOT_FACTORY_INTEGRATED`
- `FACTORY_TRANSFORMER_NEEDS_REAL_OSS_RUNTIME_DONOR`
- `FACTORY_10X_FRONTEND_CAPABILITY_SELECTION_PENDING`
- `INTERFACE_FROMTEND_BACKEND_ROOTS_PENDING_T1_GATE`
- Existing publish GAP remains: persistent Hugging Face web URL + deployed HTTP/E2E/reviewer.

## 6. Next queue1x1

Node F-OSS-01: integrate one minimal, traceable frontend donor capability into Factory V0 using REUSE > COPY > PATCH > ADAPT > GENERATE; require source/ref/license + adapter + test + read-back before adding the next donor.
