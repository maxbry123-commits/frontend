# 📌 UI YAIWES — Integración modular de componentes y plugin universal

Contrato: `tel.workflow/v3` — aditivo, no reescribe arquitectura previa.

## P01 — realidad física
`UI YAIWES/` no muestra carpetas de componentes sueltas; `UI YAIWES/componentes open soure UI YAIWES/` contiene 14 componentes, tree `4318b69193b6ba0dedda81e601e174fefa3c5cf7`. `_adquisicion` son JSON, no código.

## Provenance 14/14
La matriz operativa conserva para cada componente SOURCE_URL leído del componente, SOURCE_COMMIT, tree físico, code-root, destino y dedup. Procedencias almacenadas: Apache PyCasbin→https://github.com/apache/casbin-pycasbin ; Bulkman→https://github.com/rodmena-limited/bulkman ; Dagu→https://github.com/dagucloud/dagu ; HTTPX→https://github.com/encode/httpx ; Hypothesis→https://github.com/HypothesisWorks/hypothesis ; OpenTelemetry→https://github.com/open-telemetry/opentelemetry-python ; Pydantic→https://github.com/pydantic/pydantic ; Rule Engine→https://github.com/zeroSteiner/rule-engine ; Stabilize→https://github.com/rodmena-limited/stabilize ; Starlette→https://github.com/Kludex/starlette ; pytest→https://github.com/pytest-dev/pytest ; redun→https://github.com/insitro/redun ; resilient-circuit→https://github.com/rodmena-limited/resilient-circuit ; structlog→https://github.com/hynek/structlog .

## Code-only / no monolito
Repos fuente permanecen centralizados con provenance. Runtime solo recibe subárbol code-only cuando el nodo lo necesita. Dagu/redun DONOR; pytest/Hypothesis TEST_ONLY; ninguno se monta como workflow owner.

## Universal Plugin Socket
Commit `4960005c12668e9ef843e1a42b842989cca6e338` materializa `runtime/src/plugins/{contract,catalog,registry,mount_guard,loader}.py` y manifest separado. Factories explícitas, no import arbitrario, componentes `enabled=False` por defecto, donor/test bloqueados en producción, Stabilize único owner. Prueba determinista local: 5/5 PASS; GitHub file read-back PASS; no se afirma CI/deploy.

## Stabilize code-only
`src/stabilize/` tree `35c7f5b60ee6cf8fd5ae3187d6e92fe15012499b` está copiado a `runtime/vendor/stabilize/` sin basura upstream. El API real expone `Orchestrator(queue, store=None)`.

## P02A — factory + dependency injection
Commit `88b424424d62db798da8ea2406992d043e3a23fc` añade una capa separada, no monolítica: `activation.py` conserva el catálogo inerte y habilita solo factories aprobadas; `stabilize_adapter/dependencies.py` define Queue/WorkflowStore; `factory.py` construye el único owner; `runtime.py` verifica identidad de dependencias; tests separados prueban loader/health/fail-closed. Suite determinista: 5/5 PASS y read-back GitHub PASS.

Estado de integración: `P02A_ACTIVE_LOOP_VERIFY_FINAL_PENDING`. Los tests de wiring usan un `FakeOrchestrator` para demostrar el contrato de enchufe e inyección sin fingir que el runtime vendorizado ya ejecutó. Falta montar el `stabilize.Orchestrator` real vendorizado mediante el mismo `PluginLoader` y verificar health ejecutable antes de `VERIFIED_CLOSED`.

## Concurrencia protegida
No se usa force sobre `main`. Cada delta se reconcilia sobre el HEAD vigente y conserva historial/evidencia.

## Siguiente gate
`P02A`: ejecutar el factory contra el `Orchestrator(queue, store=None)` vendorizado real, verificar `queue/store` + health + read-back independiente; si falla, persistir GAP y aplicar StrategyDelta distinto. Solo después puede cerrarse P02A y avanzar al siguiente nodo autorizado.
