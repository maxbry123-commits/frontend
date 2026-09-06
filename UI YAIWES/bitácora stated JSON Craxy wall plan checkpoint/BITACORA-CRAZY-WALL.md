# BITÁCORA CRAZY WALL — Integración modular UI YAIWES

## UI-PLUG-0001 — INPUT DIRECTOR
- Revisar componentes dispersos en `UI YAIWES/`.
- Centralizar componentes en `UI YAIWES/componentes open soure UI YAIWES/`.
- Reutilizar solo código necesario en el Wordflow; no copiar basura upstream.
- Prohibido código monolítico; dividir por archivos, contratos, adapters, plugins y registry.
- Crear enchufe/plugin universal.
- Registrar cada cambio en arquitectura y en esta raíz operativa.
- Replicar el método de `maxbry123-commits/agentes/➡️📂 Wordflow LOOP Yaiwes` sin inventar rutas ausentes.

## UI-PLUG-0002 — INVENTARIO RAÍZ
Read-back actual de `UI YAIWES/`: Interface, README arquitectura legado, `_adquisicion`, `componentes open soure UI YAIWES`, `readme arquitectura UI YAIWES`, documentos y Wordflow. No se observaron carpetas de componentes sueltas en la raíz.
`_adquisicion/ui-yaiwes-grupo-a-14-20260906/` contiene `batch-001.json` y `batch-002.json`; son datos/manifiestos de adquisición, no código de componente y no se moverán a la carpeta de componentes.

## UI-PLUG-0003 — INVENTARIO COMPONENTES CENTRALIZADOS
Tree SHA carpeta: `4318b69193b6ba0dedda81e601e174fefa3c5cf7`.
14 componentes presentes: Apache PyCasbin, Bulkman, Dagu, HTTPX, Hypothesis, OpenTelemetry Python, Pydantic, Rule Engine, Stabilize CORE, Starlette, pytest, redun, resilient-circuit, structlog.
Veredicto P01a: `PASS_ROOT_CENTRALIZATION_ALREADY_TRUE`.

## UI-PLUG-0004 — XRAY RUNTIME
`runtime/plugin-manifest.yaml` existe pero referencia módulos aún no materializados como `src.core.kernel`.
`runtime/src/core`, `runtime/src/adapters`, `runtime/src/integration` y `runtime/tests` contienen solo README en el read-back actual.
Veredicto: `GAP_PLUGIN_MANIFEST_DECLARED_NOT_WIRED`.
Siguiente delta: crear plugin universal modular mínimo + registry + mount guard + adapter contract + tests; después integrar componentes uno por uno.