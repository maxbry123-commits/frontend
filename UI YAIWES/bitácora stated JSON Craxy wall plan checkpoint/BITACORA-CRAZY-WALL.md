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
P01 evidencia 14/14 preparada; requiere read-back independiente del nuevo commit antes de PASS final. P02A no se ejecuta hasta ese read-back.