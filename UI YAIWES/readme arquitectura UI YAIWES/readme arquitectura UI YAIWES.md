# UI YAIWES — README ARQUITECTURA / GAPS DE INTEGRACIÓN

Fecha de auditoría: 2026-09-17
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Documento base relacionado: `ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md`

## Regla de cierre

`SOURCE_PRESENT != ACQUISITION_VERIFIED != COPIED != WIRED != TEST_PASS != VERIFIED_CLOSED`

La presencia de un directorio o de código descargado no autoriza a declararlo integrado. Para integración runtime se exige adapter/contract explícito, wiring, focused tests, evidencia, CI y readback.

## Componentes investigados y validados

### 1. Codebase Memory MCP
- Fuente validada: `https://github.com/DeusData/codebase-memory-mcp`
- Licencia declarada upstream: MIT.
- Rol correcto: MCP local de code-intelligence / knowledge graph para agentes.
- Capacidad útil: indexación estructural del codebase, consultas MCP, grafo persistente, navegación de arquitectura/impacto.
- Estado físico observado en UI YAIWES: directorio materializado y `SOURCE_COMMIT.txt` presente (`59a05eb1bf9e11deb060d782cd7d3a29f2ae2866`).
- GAP-INTEGRATION-CBM-01: falta adapter MCP canónico bajo el contrato YAIWES.
- GAP-INTEGRATION-CBM-02: limitar roots/permisos; el componente puede leer código y modificar configuración de clientes/agentes.
- GAP-INTEGRATION-CBM-03: test real de handshake MCP + query estructural + cierre/cleanup.
- No convertirlo en segundo owner del estado/workflow.

### 2. OmniRoute
- Fuente validada: `https://github.com/diegosouzapw/OmniRoute`
- Licencia declarada upstream: MIT.
- Rol correcto: gateway/router de proveedores/modelos IA con fallback y estrategias de routing.
- Corrección conceptual: no garantiza cuota infinita; el fallback sólo funciona mientras existan rutas/proveedores utilizables.
- Estado físico observado: árbol `OmniRoute/` presente, pero en la auditoría 2026-09-17 no se encontró `SOURCE_COMMIT.txt` en la raíz publicada.
- La adquisición muestra batches `02/001..003`, por lo que `directory present` no se toma como cierre.
- GAP-ACQUISITION-OMNI-01: completar/readback de adquisición y materializar trazas `SOURCE_URL`, `SOURCE_COMMIT`, `SOURCE_SHA256SUMS`, `SOURCE_LICENSE`.
- GAP-INTEGRATION-OMNI-02: adapter `ProviderGateway` sin sustituir el router/state owner canónico de YAIWES.
- GAP-INTEGRATION-OMNI-03: `SECRET_REF_ONLY`; ninguna API key/OAuth/cookie dentro del repo.
- GAP-INTEGRATION-OMNI-04: contract tests de routing, fallback, timeout, quota exhaustion y provider unavailable.

### 3. Orca
- Fuente validada: `https://github.com/stablyai/orca`
- Licencia declarada upstream: MIT.
- Rol correcto: superficie gráfica/orquestador de CLI agents (Codex, Claude Code, OpenCode y otros), worktrees, terminales, Chromium/Design Mode, SSH y companion móvil.
- Estado físico observado: directorio `Orca/` materializado en el destino de adquisición y lote `_adquisicion/ui-yaiwes-user-components-5-03` presente.
- Adquisición reparada 2026-09-17: source `https://github.com/stablyai/orca`, commit fijado `1cd2964501acd5c0bc736323f09205d272664f09`, tree `0a197784e2ef1c880d23ea673108cba84663f1c7`, 27,344 archivos / 235,134,345 bytes, estado `ACQUISITION_TRACE_PRESENT`.
- GAP-INTEGRATION-ORCA-02: reutilizar como UI/agent-surface o donor; prohibido introducir un segundo runtime/state engine.
- GAP-INTEGRATION-ORCA-03: evaluar Design Mode como capacidad de captura HTML/CSS/screenshot con permisos explícitos.
- GAP-INTEGRATION-ORCA-04: test de worktree/agent adapter aislado y no destructivo.

### 4. Omarchy
- Fuente validada: `https://github.com/omacom/omarchy`
- Licencia declarada upstream: MIT.
- Rol correcto: distribución Linux agentic de DHH; NO es una librería frontend.
- Estado físico observado: directorio materializado y `SOURCE_COMMIT.txt` presente (`9c5482c58dbe4974de337450754885083c91eada`).
- GAP-INTEGRATION-OMARCHY-01: clasificar como `ENVIRONMENT/OS DONOR`, no dependencia runtime del frontend.
- GAP-INTEGRATION-OMARCHY-02: extraer sólo patrones/configuración/capabilities necesarias.
- GAP-INTEGRATION-OMARCHY-03: nunca ejecutar el instalador de distro durante adquisición o tests del frontend.

### 5. Anydoc
- Fuente validada: `https://github.com/firecrawl/anydoc`
- Licencia declarada upstream: MIT.
- Rol correcto: librería Rust de ingestión documento -> Markdown con bindings Node/Python/WASM.
- Estado físico observado: directorio materializado y `SOURCE_COMMIT.txt` presente (`261fc257d17c3eab0f673be31c408fd9fdc2171a`).
- GAP-INTEGRATION-ANYDOC-01: adapter `FileImport -> Normalize -> Markdown -> AI/Editor`.
- GAP-INTEGRATION-ANYDOC-02: preferir conversión local/WASM para formatos soportados.
- GAP-INTEGRATION-ANYDOC-03: OCR remoto Firecrawl debe ser capability opcional y explícita; no asumirse local.
- EXCLUSIÓN DE COPIA: por instrucción del Director, Anydoc NO se copia a `UI YAIWES interface` en la operación Motor 3 descrita abajo.

## Resultado de adquisición observado

| Componente | Directorio | SOURCE_COMMIT | Estado fail-closed |
|---|---|---|---|
| Codebase Memory MCP | sí | sí | `ACQUISITION_TRACE_PRESENT` |
| OmniRoute | sí | no observado | `GAP_ACQUISITION_INCOMPLETE` |
| Orca | sí | sí | `ACQUISITION_TRACE_PRESENT` |
| Omarchy | sí | sí | `ACQUISITION_TRACE_PRESENT` |
| Anydoc | sí | sí | `ACQUISITION_TRACE_PRESENT` |

Orca queda resuelto en adquisición. No declarar `5/5 ACQUISITION_READBACK_PASS` hasta resolver el GAP restante de OmniRoute y verificar hashes/manifiestos finales.

## Copia hacia UI YAIWES interface

Destino de copia autorizado:
`UI YAIWES interface/componentes open soure UI YAIWES/user-requested-workflow-2026-09-17/`

Motor autorizado:
`maxbry123-commits/agentes/Motores/➡️📂motor de copiar archivos/motor_3_copy_batches.py`
Schema del motor: `yaiwes.frontend.copy-batches.v1`.

Conjunto pedido para copia:
- Codebase Memory MCP
- OmniRoute
- Orca
- Omarchy

Excluido explícitamente:
- Anydoc

Política de la copia:
- preflight por componente;
- sólo copiar fuente con trazas mínimas de adquisición;
- Motor 3 por componente;
- SHA-256 source/destination readback;
- no borrar;
- no sobrescribir contenido diferente silenciosamente;
- registrar GAPS por componente ausente/incompleto;
- una copia física NO equivale a wiring/runtime integration.

## Flujo objetivo

`ACQUISITION VERIFIED -> MOTOR3 COPY -> HASH READBACK -> ADAPTER -> CONTRACT/WIRING -> FOCUSED TEST -> EVIDENCE -> TRUSTED CI -> READBACK -> VERIFIED_CLOSED`


## X-Ray de componentes y plan de cierre V3

Autoridad de ejecución añadida 2026-09-17:
- `../bitácora stated JSON Craxy wall plan checkpoint/XRAY-COMPONENT-INVENTORY-V1-2026-09-17.json`
- `../bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-XRAY-COMPONENT-INTEGRATION-CLOSURE-V1-2026-09-17.json`
- `PLAN-ACCION-CIERRE-XRAY-V3-2026-09-17.md`
- Recovery enlazado: `CRAZY-WALL-RECOVERY-ACTION-PLAN-V2-2026-09-14.json`

Hallazgo físico: 207 directorios en 5 raíces, 196 identidades normalizadas y 10 grupos duplicados/repetidos. La integración se decide por requisito/capacidad; un donor no necesario cierra `VERIFIED_NO_NEED`. Ningún componente se considera integrado por presencia física.

Flujo: `INVENTORY -> DEDUP/PROVENANCE -> CAPABILITY -> REQUIREMENT -> ADAPTER/WIRING -> FOCUSED TEST -> EVIDENCE -> TRUSTED CI -> FIVE-PASS -> READBACK -> VERIFIED_CLOSED|VERIFIED_NO_NEED`.
