# runtime/src/core

Raíz del núcleo de integración con **Stabilize CORE**.

Debe contener solo glue/configuración/compilación de workflow necesaria para UI YAIWES. No reimplementar DAG, queue, durable state, recovery o HITL ya resueltos por Stabilize.

Responsabilidades previstas:
- `workflow_definition.py`
- bootstrap/store/queue configuration
- lifecycle del runtime
- compilation de spec declarativo a stages/tasks

Owner del workflow: Stabilize CORE.
