# P02A — Stabilize factory + dependency injection

Fecha: 2026-09-06
Contrato: `tel.workflow/v3`
Estado: `VERIFY_FINAL_PENDING`

## Objetivo
Conectar `stabilize_core` al enchufe universal sin crear monolito ni segundo scheduler. Stabilize continúa como único workflow owner.

## Búsquedas obligatorias ejecutadas
1. `UI YAIWES/componentes open soure UI YAIWES/`: se reutiliza el Stabilize centralizado y el vendor code-only existente.
2. Todas las raíces de `frontend`: no se encontró una factory Stabilize canónica anterior para reutilizar.
3. `agentes`: se reutiliza como patrón la separación `Agente Yaiwes principal/execution-engine-pool/adapter-layer/`; no se copia una factory inexistente.
4. `router-universal-router-inteligente-`: revisado; no se adopta scheduler alternativo.
5. `osquestador-auditor`: revisado; no se adopta workflow owner alternativo.

## Discrepancia de fuentes
La arquitectura consolidada enumera 4 documentos únicos efectivos —MAX-SYSTEM, Memoria Wordflow, Virtual Computer y Command Center— aunque una instrucción posterior menciona 3 enlaces. Se conserva como GAP documental; no se inventa una terna.

## Diseño real publicado
`catalog(inert) → activation allowlist → PluginRegistry → MountGuard → PluginLoader → stabilize_adapter.factory → StabilizeRuntime → health`

Archivos separados:
- `runtime/src/plugins/activation.py`
- `runtime/src/plugins/stabilize_adapter/dependencies.py`
- `runtime/src/plugins/stabilize_adapter/runtime.py`
- `runtime/src/plugins/stabilize_adapter/factory.py`
- `runtime/src/plugins/stabilize_adapter/README.md`
- `runtime/tests/test_stabilize_integration.py`
- `runtime/tests/test_stabilize_adapter_guards.py`

## Fuente fijada
- https://github.com/rodmena-limited/stabilize
- SOURCE_COMMIT `471b501e73a74affd504364c601e5cb7c6296c33`
- vendor tree `35c7f5b60ee6cf8fd5ae3187d6e92fe15012499b`
- API auditada: `Orchestrator(queue, store=None)`.

## Gates P02A
- catálogo estático debe continuar inerte;
- solo `stabilize_core` puede activarse en este nodo;
- donor/test no son production-mountable;
- Queue obligatoria;
- Queue/Store deben conservar identidad dentro del Orchestrator;
- vendor path fijo, sin imports arbitrarios;
- loader universal monta solo factory registrada;
- presencia de archivos no basta: read-back + prueba ejecutable + evidencia requerida.

## No monolito
Router, Memory, API, Pydantic, Rule Engine, resiliencia, observabilidad y UI permanecen fuera de P02A y conservan nodos/plugins independientes.
