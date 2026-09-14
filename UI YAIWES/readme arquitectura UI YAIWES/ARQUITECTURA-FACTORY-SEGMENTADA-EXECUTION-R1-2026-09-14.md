# ARQUITECTURA FACTORY SEGMENTADA — EXECUTION R1 — 2026-09-14

Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`  
Repo: `maxbry123-commits/frontend`  
Branch: `main`

## Autoridad

1. Código + tests + logs/readback actuales.
2. `FACTORY-SEGMENTED-SWARM-RECONCILIATION-R1-2026-09-14.json`.
3. `FACTORY-CRAZY-WALL-SEGMENTED-FE-BE-V1-2026-09-14.json`.
4. `ARQUITECTURA-FACTORY-SEGMENTADA-SWARM-V1-2026-09-14.md`.
5. Documentación histórica.

La cola padre no se borra. R1 aplica deltas de estado aditivos para preservar historia y evitar que un worker sobrescriba un claim concurrente.

## Invariante de separación

`READ_FRESH -> IDENTIFY_FREE/GAP_RESOLVABLE -> CLAIM_ONE_NODE -> VERIFY_RESEARCH -> EXECUTE_DELTA -> TEST_REPORT -> READBACK -> RELEASE -> NEXT`

- 1 chat = 1 nodo activo.
- 1 path concreto = 1 writer.
- `index-v19.html` y `index-v192.html` quedan congelados.
- Un worker frontend nunca modifica un archivo backend fuera de su `write_scope`.
- Un worker backend nunca modifica UI visual/entrypoint.
- Sólo `SEG-11-INTEGRATOR` compone/promueve un entrypoint canónico.
- Cada mejora frontend se hace como `v+1`; la versión anterior permanece disponible.

## Segmentos frontend operativos

| Segmento | Nodo | Scope de nueva versión | Estado R1 |
|---|---|---|---|
| SEG-01-SHELL | F-FE-066 | `workspace-shell-v2.js`, `workspace-shell-v2.css` | FREE |
| SEG-02-BROWSER | F-FE-067 | `component-browser-v2.js` | FREE |
| SEG-04-TOUCH | F-FE-068 | `touch-dnd-v193.js` | FREE |
| SEG-05-CONTROLS | F-FE-069 | `controls-suite-v2.js` | FREE |
| SEG-06-IO | F-FE-070 | `json/version/destination-*-v2.js` | FREE |
| SEG-07-IMPORT | F-FE-071 | `file-import-*-v2.js` | FREE |
| SEG-08-AI-ROUTER | F-FE-072 | frontend bridge/remote/skill `v2` | FREE |
| SEG-09-HF-JOBS | F-FE-073 | `hf-jobs-panel-v2.js` | FREE |
| SEG-11-INTEGRATOR | F-INT-065 | `index-v193.html` + bootstrap + canonical tests | GAP_RESOLVABLE |

Frontend producer rule: **no producer touches `index-v193.html`**. The worker writes only its versioned segment. Integration happens after segment tests/readback.

## Candidato V1.9.3

`index-v193.html` composes a single bootstrap instead of independently loading two historical entrypoints.

A real defect was found after the first static composition: `src/bootstrap/candidate-v193.js` used `./module.js` specifiers even though the bootstrap itself lives in `src/bootstrap/`; therefore the browser would resolve them under `src/bootstrap/` instead of `src/`.

R1 corrected every Factory module specifier to `../...` and hardened `canonical-v193-static.test.mjs` to check actual filesystem resolution, not only a mocked importer list.

Added runtime gate: `tests/e2e/canonical-v193-runtime.spec.mjs`.

This gate requires:

- `index-v193.html` HTTP success;
- canvas visible;
- candidate boot evidence present;
- all expected v19 + v192 capabilities loaded together;
- no bootstrap error;
- no browser page errors;
- no console errors.

State remains `GAP_RESOLVABLE`, not PASS, until a trusted runner executes desktop+mobile Playwright and the exact tested SHA is previewed/read back from Hugging Face.

## Backend / auto-evolution micro-kernel

### F-BE-074 — acquisition wrapper — VERIFIED_CLOSED

Reuses canonical acquisition/download/extract/copy infrastructure. It does not create an alternative downloader. Acquisition is fail-closed and requires a proven capability gap, local dedup/research, license and pinned source ref.

### F-BE-075 — provenance — VERIFIED_CLOSED

Promotion requires provenance fields including source/ref/hash/license/destination/capability/adapter/test/readback. Presence alone never promotes a component.

### F-BE-076 — Fables capability bus — CLAIMED

Owned by another worker. Scope is isolated under `src/bus/**`, `src/plugins/fables-factory/**` and matching tests/project-memory. No other worker may touch it while claim is fresh.

### F-BE-077 — MCP + Router API boundary — VERIFIED_CLOSED

New deterministic backend boundary:

`CAPABILITY REQUEST -> CAPABILITY ROUTER -> REGISTERED TRANSPORT -> NORMALIZED RESULT`

Router behavior:

- contract `tel.workflow/v3`;
- route kinds `api | mcp | model`;
- deterministic selection by explicit capability/provider/model, route priority and stable route id;
- caller-supplied `request_id` required;
- unregistered capability fails closed;
- duplicate route ids rejected;
- raw `token`, `api_key`, `authorization`, `password`, `secret` fields rejected;
- only `secret_ref` crosses the boundary.

MCP behavior:

- explicit tool registry;
- each tool must map to a registered capability;
- unregistered tool fails closed;
- MCP and direct API use the same router rather than separate routing engines.

Frontend does not import this backend implementation directly. `F-FE-072` must build its versioned frontend bridge against this typed contract.

## Blender research — F-BE-078 — VERIFIED_CLOSED

Blender is used as an architectural pattern donor, not copied into Factory.

Mapped patterns:

`WORKSPACES/AREAS -> SEG-01`

`CONTEXT PROPERTIES -> SEG-03`

`ASSET BROWSER/CATALOGS -> SEG-02`

`OPERATOR/ACTION TRACEABILITY -> SEG-05`

`UNDO/VERSIONS/RECOVERY -> SEG-06`

`EXTENSION ISOLATION -> SEG-10/Fables`

`ONLINE ACCESS POLICY -> SEG-08`

No Blender source-tree download is authorized because the valuable capabilities already map to existing Factory segments.

## Top 10 OSS design/app systems — F-BE-079 — VERIFIED_CLOSED

Research/dedup result:

1. Penpot — local ZIP -> REUSE/ADAPT.
2. Webstudio — local ZIP -> REUSE patterns.
3. Craft.js — DONOR_ACTIVE -> keep existing donor.
4. Puck — conditional external candidate.
5. GrapesJS — conditional external candidate.
6. Onlook — local ZIP -> REUSE patterns.
7. Silex — extracted -> REUSE.
8. Appsmith — local tree -> reference only.
9. ToolJet — no acquisition now; monolith overlap.
10. Plasmic — reference only; mixed license/platform complexity.

`F-BE-080` must not download software just to reach a requested count. Puck or GrapesJS may be acquired only when a residual capability gap survives the existing local donors and passes provenance policy. A third external component remains intentionally unselected until a third independent residual gap is demonstrated.

## Deterministic auto-evolution boundary

Final intended chain remains:

`CAPABILITY_REQUEST -> LOCAL_REGISTRY_DEDUP -> GAP_CLASSIFY -> BOUNDED_RESEARCH -> SOURCE/LICENSE/REF -> CANONICAL_ACQUISITION -> EXTRACT/HASH -> PROVENANCE_GATE -> FABLES_CAPABILITY_BUS -> MCP/ROUTER -> ISOLATED_TEST -> FACTORY_TEST -> INDEPENDENT_REVIEW -> PROMOTE|REJECT`

Deterministic responsibilities:

- state;
- claims/ownership;
- permissions;
- source/ref/license policy;
- acquisition;
- hashes/provenance;
- routing contracts;
- tests;
- review gate;
- promotion.

LLM may only assist bounded research, semantic ranking and ambiguity resolution. It cannot self-authorize download, mutate ownership, bypass tests, invent provenance or promote a component.

## Work allocation after R1

Grok/SOL frontend workers may claim one of `F-FE-066..073` after a fresh collision check. The recommended first Grok node is `F-FE-066` while it remains FREE.

Backend workers must not touch `F-BE-076` while its claim is active. `F-BE-081` waits for Fables completion plus frontend wiring.

`F-INT-065` is only for the integrator/runtime gate or incorporation of already-tested versioned segments.

## Final closure

The Factory is **not yet globally accredited**.

After versioned frontend work and backend wiring converge into one candidate, the same candidate must execute `F-UI-051..061`, then independent `F-UI-062`, then `F-UI-063`.

Only `F-UI-063` can assert frontend 100, and only when:

`TESTED_SHA == PUBLISHED_SHA`

plus desktop/mobile/touch/keyboard/reload/reopen/export/router/HF, all discovered controls have real effects, and console/network critical errors are zero.
