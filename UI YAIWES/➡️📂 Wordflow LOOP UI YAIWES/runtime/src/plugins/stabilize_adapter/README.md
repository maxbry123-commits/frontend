# Stabilize Adapter — UI YAIWES

Nodo: `P02A_STABILIZE_FACTORY_DEPENDENCY_INJECTION`
Contrato: `tel.workflow/v3`

Este bloque conecta únicamente `stabilize_core` al enchufe universal. No contiene Router, Memory, API, policy, observability ni UI.

## Archivos
- `dependencies.py`: contrato de inyección `queue + store + orchestrator_type`.
- `runtime.py`: wrapper mínimo y health por identidad de dependencias.
- `factory.py`: bootstrap del vendor local + factory `stabilize.orchestrator`.
- `../activation.py`: allowlist explícita; el catálogo estático permanece inerte.

## Fuente fijada
- URL: https://github.com/rodmena-limited/stabilize
- SOURCE_COMMIT: `471b501e73a74affd504364c601e5cb7c6296c33`
- vendor code tree: `35c7f5b60ee6cf8fd5ae3187d6e92fe15012499b`
- API confirmada: `Orchestrator(queue, store=None)`.

## Invariantes
1. Stabilize es el único workflow owner.
2. `vendor present != integrated`.
3. Activación requiere allowlist + `factory_key` + MountGuard + PluginLoader.
4. Queue es obligatoria; WorkflowStore es inyectado explícitamente cuando exista.
5. No se aceptan rutas de import arbitrarias; el vendor está fijado en `runtime/vendor`.
6. Health exige identidad exacta de Queue/Store dentro del Orchestrator.
7. Ningún otro componente se incorpora dentro de este bloque; cada capability conserva adapter/plugin propio.
