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
`src/stabilize/` tree `35c7f5b60ee6cf8fd5ae3187d6e92fe15012499b` está copiado a `runtime/vendor/stabilize/` sin basura upstream. El API real expone `Orchestrator(queue, store=None)`; por eso queda `VENDORED_NOT_MOUNTED` hasta factory/dependency injection y health test.

## Concurrencia protegida
El sentinela escribió `50342c5d60a78928a3cc6ef723bac66c915b629b` durante el nodo. No se hizo force; este delta se reinyecta encima y completa el GAP que el sentinela detectó (URL/SHA/destino/dedup 14/14).

## Siguiente gate
Read-back independiente de la matriz P01. Solo si pasa: `P02A_STABILIZE_FACTORY_DEPENDENCY_INJECTION`.