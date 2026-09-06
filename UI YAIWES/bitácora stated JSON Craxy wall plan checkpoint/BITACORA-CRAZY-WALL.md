# BITÁCORA CRAZY WALL — Integración modular UI YAIWES

## UI-PLUG-0001 — INPUT DIRECTOR
Centralizar componentes, reutilizar solo código útil, prohibir monolito, crear plugin universal, registrar arquitectura/STATE/CHECKPOINT/plan/recovery y replicar método Wordflow.

## UI-PLUG-0002 — INVENTARIO RAÍZ
Read-back `UI YAIWES/`: 0 carpetas de componentes sueltas observadas. `_adquisicion` contiene JSON/manifiestos y no se mueve como código.

## UI-PLUG-0003 — COMPONENTES CENTRALIZADOS
Tree SHA `UI YAIWES/componentes open soure UI YAIWES/`: `4318b69193b6ba0dedda81e601e174fefa3c5cf7`. Contiene 14 componentes.

## UI-PLUG-0004 — GAP RUNTIME HISTÓRICO
`runtime/plugin-manifest.yaml` declaraba módulos no materializados; presencia de manifest ≠ wiring.

## UI-PLUG-0005 — REVISIÓN 14/14 + PROVENANCE
`COMPONENT-CODE-MAP.md` contiene para los 14: SOURCE_URL, SOURCE_COMMIT, tree SHA físico, code-root, destino y dedup.

## UI-PLUG-0006 — SOCKET UNIVERSAL
Commit `4960005c12668e9ef843e1a42b842989cca6e338`. Socket dividido en contract/catalog/registry/mount_guard/loader; donor/test no production mount; Stabilize único owner.

## UI-PLUG-0007 — STABILIZE CODE-ONLY
Vendor `runtime/vendor/stabilize/` tree `35c7f5b60ee6cf8fd5ae3187d6e92fe15012499b`; API real auditada `Orchestrator(queue, store=None)`.

## UI-PLUG-0008 — P01 VERIFIED_CLOSED
Inventario/provenance/dedup 14/14 con read-back independiente PASS.

## UI-PLUG-0009 — P02A REUSE SEARCH
Ejecutadas 5 búsquedas: componentes UI → frontend completo → agentes → router inteligente universal → osquestador auditor. En `agentes` se reutiliza como patrón `execution-engine-pool/adapter-layer`; no se encontró factory Stabilize lista para copiar.

## UI-PLUG-0010 — P02A FACTORY WIRING
Commit `88b424424d62db798da8ea2406992d043e3a23fc`: `activation.py` + `stabilize_adapter/dependencies.py|factory.py|runtime.py` + `test_stabilize_integration.py`. Catálogo estático permanece inerte y solo `stabilize_core` entra en allowlist de este nodo.

## UI-PLUG-0011 — P02A TESTS + HARDENING
FakeOrchestrator suite 5/5 PASS para allowlist, rechazo no autorizado, Queue obligatoria, identidad Queue/Store y montaje por PluginLoader. Guard adicional `test_stabilize_adapter_guards.py` publicado en commit `2887aa1db2c8d7e21213931b55181969581c1b52`; README local del adapter en `4ce6ae36e6a15a12f3adc20e9f78217abc7332f4`; delta arquitectura en `27cae7621cdd8f444d81fad469310e4a35a98c72`.

## UI-PLUG-0012 — P02A FLAG REAL-VENDOR
Intento independiente de materializar/ejecutar el runtime real mediante sparse clone falló por entorno: `Could not resolve host: github.com`. No es evidencia de fallo del adapter, pero bloquea `verify_final` contra `stabilize.Orchestrator` real. P02A queda `CLOSED_UNVERIFIED_WITH_FLAG`, nunca PASS. Recovery: repetir el mismo adapter cuando exista entorno ejecutable; prohibido duplicarlo.

## UI-PLUG-0013 — CONTINUACIÓN SEGURA
Aplicando la regla del Director para flags/bloqueos, la cola continúa a `P02B_PYDANTIC_CONTRACT_PLUGIN` únicamente como plugin aislado/deshabilitado que no requiere un Stabilize vivo. P02A queda visible en STATE/CHECKPOINT hasta resolver su verificación real.
