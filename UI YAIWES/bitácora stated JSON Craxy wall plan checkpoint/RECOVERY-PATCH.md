# RECOVERY PATCH — UIYAIWES-P01-PROVENANCE-0008

PRELUDE: component root tree `4318b69193b6ba0dedda81e601e174fefa3c5cf7`; socket commit `4960005c12668e9ef843e1a42b842989cca6e338`; concurrent sentinel commit `50342c5d60a78928a3cc6ef723bac66c915b629b`.

Estado: P01 inventario/code-root/provenance matrix 14/14 escrita; verify_final de read-back pendiente. Stabilize code-only está en vendor, no mounted.

Recovery:
1. Leer STATE/CHECKPOINT/COMPONENT-CODE-MAP.
2. Verificar que matriz tiene exactamente 14 componentes y cada fila URL+SOURCE_COMMIT+tree+destino+dedup.
3. Releer component root; confirmar 14 y no root duplicates.
4. Si PASS, cerrar P01 y abrir P02A.
5. P02A: adapter/factory explícito para `Orchestrator(queue, store=None)`; no modificar vendor.
6. MountGuard + health/test; solo entonces `enabled=True` para Stabilize.
7. Fallo → persistir evidencia + StrategyDelta distinto → mismo nodo.

Rollback: GitHub commit history; nunca force sobre cambios concurrentes.