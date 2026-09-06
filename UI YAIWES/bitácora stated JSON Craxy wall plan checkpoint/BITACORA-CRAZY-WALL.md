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
`COMPONENT-CODE-MAP.md` contiene para los 14: SOURCE_URL leído del propio componente, SOURCE_COMMIT fijado, tree SHA físico, code-root SHA/estructura, destino y dedup. Se corrigieron procedencias que no debían inferirse: PyCasbin=`apache/casbin-pycasbin`, Dagu=`dagucloud/dagu`, Starlette=`Kludex/starlette` según sus SOURCE_URL almacenados.

## UI-PLUG-0006 — SOCKET UNIVERSAL
Commit `4960005c12668e9ef843e1a42b842989cca6e338`. `runtime/src/plugins/` dividido en contract/catalog/registry/mount_guard/loader; no import arbitrario; todos `enabled=False`; donor/test no production mount; Stabilize único workflow owner. Test determinista local previo: 5/5 PASS; read-back GitHub de archivos PASS. No equivale a CI/deploy.

## UI-PLUG-0007 — STABILIZE CODE-ONLY
`src/stabilize/` tree `35c7f5b60ee6cf8fd5ae3187d6e92fe15012499b` copiado a `runtime/vendor/stabilize/`, sin `.github`, docs, examples, tests ni changelog. API real: `Orchestrator(queue, store=None)`; estado `VENDORED_NOT_MOUNTED`.

## UI-PLUG-0008 — CONCURRENCIA RECONCILIADA
Durante el registro, `main` avanzó a `50342c5d60a78928a3cc6ef723bac66c915b629b` por el sentinela `reconcile P01 physical inventory evidence`. No se hizo force. Ese delta pidió URL/SHA/destino/dedup 14/14; esta bitácora y `COMPONENT-CODE-MAP.md` satisfacen ese GAP con datos físicos.

## UI-PLUG-0009 — GATE
P01 evidencia 14/14 preparada; requería read-back independiente antes de PASS final.

## UI-PLUG-0010 — VERIFY_FINAL P01 PASS
Read-back independiente ejecutado sobre `COMPONENT-INVENTORY.md`, `COMPONENT-CODE-MAP.md`, `STATE.json`, `CHECKPOINT.json` y raíz física. Coinciden 14 filas físicas y 14 filas de provenance con SOURCE_URL/SOURCE_COMMIT/tree/code-root/destino/dedup; P01 pasa a `VERIFIED_CLOSED`. STATE actualizado en commit `acd82ef941ae8c6ce46d91dce456c3c74f7c03f3`; CHECKPOINT actualizado en `54f843d5b7a6f7ef1460697ab527368e8db888ad`.

## UI-PLUG-0011 — BÚSQUEDA REUSE PRE-P02A
Se revisaron obligatoriamente: (1) raíz central de componentes UI; (2) raíces de frontend; (3) raíz de `agentes`; (4) raíz de `router-universal-router-inteligente-`; (5) raíz de `osquestador-auditor`. Hallazgo seguro: no reutilizar nada todavía sin inspeccionar el code-root exacto del nodo P02A; Stabilize ya está vendorizado y sigue siendo el único owner.

## UI-PLUG-0012 — SIGUIENTE NODO
`P02A_STABILIZE_FACTORY_DEPENDENCY_INJECTION` queda READY. Gate: factory separada + Queue/WorkflowStore inyectados + registry/mount/health con evidencia ejecutable. `vendor present ≠ integrated`; no se marca PASS hasta prueba real.

## UI-PLUG-0013 — P02A FACTORY WIRING
Commit `88b424424d62db798da8ea2406992d043e3a23fc`: se añadió `activation.py` con allowlist explícita, `stabilize_adapter/` separado en dependencies/factory/runtime y `test_stabilize_integration.py`. El catálogo base permanece inerte (`enabled=False`) y Stabilize sigue siendo el único workflow owner.

## UI-PLUG-0014 — P02A TEST EXECUTION
Suite determinista del adapter ejecutada: 5/5 PASS para activación explícita, rechazo fail-closed de componente no autorizado, Queue obligatoria, identidad Queue/Store y montaje por `PluginLoader` con health positivo. Read-back GitHub de factory y test: PASS.

## UI-PLUG-0015 — GAP VERIFY_FINAL P02A
No se declara `VERIFIED_CLOSED`: los tests de esta iteración usan `FakeOrchestrator` para probar el enchufe/DI. Falta ejecutar el mismo factory/loader contra el `stabilize.Orchestrator` vendorizado real y verificar `runtime.health`. CHECKPOINT `UIYAIWES-P02A-FACTORY-WIRING-0010`; el mismo nodo continúa ACTIVE_LOOP.
