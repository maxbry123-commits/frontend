# Bulkman Adapter — UI YAIWES

P04 · `tel.workflow/v3`
Fuente: https://github.com/rodmena-limited/bulkman
Commit: `99607f7e1b881a68cc99305ab233299c57469414` · versión `2.0.3` · tree `c964f8b80bb8e9f5492c5a87a3eeb0bdc43f21af`.
Responsabilidad: Bulkhead para aislamiento/concurrencia. Factory `bulkman.bulkhead`; usa `BulkheadThreading` + `BulkheadConfig`, tal como recomienda la fuente para sync workloads.
Dependencia fuente: `resilient-circuit>=0.5,<0.8`; vendor fijado en P04 es 0.7.0. No workflow ownership.
