# runtime/tests

Pruebas del backend Wordflow UI YAIWES.

Frameworks:
- pytest
- Hypothesis

Suites mínimas:
- unit
- contract/schema
- integration
- recovery
- stateful/invariants
- E2E

Invariantes obligatorias:
1. invalid output no canonical commit;
2. claim sin evidencia no VERIFIED;
3. critical GAP bloquea cierre;
4. retry cognitivo exige StrategyDelta distinto;
5. crash/recovery no duplica side effects;
6. suspend/resume sobrevive restart;
7. coverage incompleta no COMPLETE;
8. Final Judge no acepta auto-declaración de la LLM.
