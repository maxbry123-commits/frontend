# MODELO B — AUDITORÍA XRAY RUNTIME + SEGURIDAD + RELIABILITY

## MISIÓN
Intentar romper YAIWES desde runtime, state machine, recovery, permisos, supply chain, CI y concurrencia. No agregar arquitectura nueva salvo gap único probado. Verificar que `THE MODEL THINKS; THE RUNTIME CONTROLS` sea cierto en código y tests.

## 12 GOALS DE ENTRADA
1. Leer HEAD/raíz/READ-FIRST/Crazy Wall+N34/N35/Handoff/arquitecturas.
2. Leer S1–S4 y extraer sólo requisitos de runtime/seguridad/recovery.
3. Inventariar `runtime/src`, `runtime/tests`, Wordflow governance y adapters.
4. Verificar Stabilize como único workflow owner.
5. Auditar Sheriff/Validator/Supervisor/Policy/Judge antes y después de efectos.
6. Auditar StateDelta: LLM nunca escribe canonical memory/state directamente.
7. Auditar checkpoint bytes/hash, ledger, idempotencia, retry y rollback.
8. Auditar API/control auth, cancel/status/streaming y bypasses.
9. Auditar sandbox/VM/guest install/mirror/network/filesystem boundaries.
10. Auditar secretos, auth/RBAC/policy, provenance, firmas/SBOM/updates según implementación real.
11. Auditar CI, tests cancelados, flakiness, exact-blob parity y claims concurrentes.
12. Auditar observabilidad/correlation IDs como evidencia, no autoridad.

## 12 GOALS DE SALIDA
1. Threat/boundary map con trust zones.
2. Lista de efectos posibles y gate que los autoriza.
3. Lista de bypasses reales o `NONE_OBSERVED` con evidencia.
4. Recovery matrix crash/restart/failover/cancel/network partition/tamper.
5. Estado real de N16/N21/N26/N28/N29/N32/N33 y dependencias.
6. CI reliability report: success/cancel/pending/flaky y cobertura exacta.
7. Supply-chain gap report: source→build→SBOM→scan→provenance→signature→update.
8. Security gap report por severidad y exploit preconditions.
9. Concurrency/idempotency/DLQ/outbox gaps sólo si requisitos y carga lo justifican.
10. Tests negativos faltantes con destino exacto.
11. Recomendaciones 10x medibles de reliability/MTTR/test throughput/safety.
12. Verdict de runtime: `VERIFIED_CLOSED|GAP|INCONCLUSIVE` por capability.

## ASK COUNCIL — 12 PASOS
1. Control owner.
2. State integrity.
3. Pre-effect authorization.
4. Post-effect evidence.
5. Secret/auth boundaries.
6. Sandbox/guest isolation.
7. Checkpoint/recovery integrity.
8. Idempotency/replay.
9. Network/mirror/API attack surface.
10. CI/test trustworthiness.
11. Supply-chain/release integrity.
12. Minimal hardening sequence.

## DEBATE INTERNO
- **Red Team:** busca bypass, replay, race, forged evidence, tamper, stale claim, secret leakage y host contamination.
- **Reliability Engineer:** defiende la arquitectura con invariantes, recovery, idempotency y tests reproducibles.
- **Judge:** exige evidencia exacta; riesgo sin prueba = hypothesis, PASS sin test = reject.

## 3 REFUTACIONES OBLIGATORIAS
R1. Intentar demostrar que un agente/LLM puede producir efecto o estado canónico sin autorización.
R2. Intentar demostrar que checkpoint/replay/failover puede duplicar efectos o aceptar bytes alterados.
R3. Intentar demostrar que un CI verde no prueba los bytes actuales (descendant drift, skipped tests, cancelled concurrency, fixtures sintéticos).

## 4 SIMULACIONES
S1 Security: input malicioso solicita filesystem/network/secret fuera de scope → cero efecto + evidencia de bloqueo.
S2 Recovery: crash entre pending/commit de efecto → restart → mismo idempotency key → exactamente un efecto físico.
S3 Supply chain: artifact/source/hash/signature/arch inválido en guest install → reject antes de contaminar host/guest; rollback si fallo post-snapshot.
S4 Swarm concurrency: 10 workers hacen claims/commits/CI simultáneos → sin doble claim, sin overwrite del Wall, cancelaciones reconciliadas por exact blob parity.

## RECOMENDACIONES 10X
Buscar 10x sólo en métricas reales: tiempo de recuperación, tiempo de feedback CI, reducción de flaky/cancelled runs, throughput de tests, tasa de incidentes evitables, costo por run. Cada propuesta: `baseline→target→instrumentación→delta→test→rollback→riesgo`. Sin baseline, `HYPOTHESIS`.

## FORMATO
`Finding | Severity | Attack/failure path | Invariant | Path/blob | Test/run | Reproduction | Minimal fix | Metric | Verdict`.
Top 10 únicamente; deduplicar contra nodos actuales antes de proponer uno nuevo.
