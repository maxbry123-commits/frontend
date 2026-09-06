# P04 — Bulkman + resilient-circuit

Contrato `tel.workflow/v3` · estado `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAGS` · code commit `b7545ca41ae0012e658d3ab8334cbe5aa98c077b`.

## resilient-circuit
Fuente https://github.com/rodmena-limited/resilient-circuit · commit `c9d80c845df771a9b9d63f9a48e6f24e6ed0b94a` · versión `0.7.0` · code tree `61ada5ed0ecf9bad6059645264c9fd5549669715` · factory `resilient_circuit.breaker`.
API reutilizada: `CircuitProtectorPolicy` como `ProtectionPolicy` callable/decorator. Adapter solo `build_policy/protect/execute`.

## Bulkman
Fuente https://github.com/rodmena-limited/bulkman · commit `99607f7e1b881a68cc99305ab233299c57469414` · versión `2.0.3` · code tree `c964f8b80bb8e9f5492c5a87a3eeb0bdc43f21af` · factory `bulkman.bulkhead`.
API reutilizada: `BulkheadConfig + BulkheadThreading.execute`; la propia fuente recomienda `BulkheadThreading` para sync workloads.

## Compatibilidad
Bulkman declara `resilient-circuit>=0.5,<0.8`; el vendor seleccionado `0.7.0` entra en ese rango. Se cablea circuit primero y bulkhead después.

## Límite
Ningún adapter posee workflow, DAG o State. Los paquetes no están instalados en el ejecutor local: read-back/logic gates PASS, ejecución del vendor real queda flag hasta prueba ejecutable.
