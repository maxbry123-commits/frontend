# COMPONENT INVENTORY V5 — BASELINE + POST124 + RECOVERY

**Destino:** `UI YAIWES/componentes open soure UI YAIWES/`
**Tree raíz observado:** `4be4e359804da7fe59e8874c057a45a0a2967f63`
**Regla:** `physical != integrated`; `checkpoint != final audit`; `name match != dedup`.

---

# 1. BASELINE 14 HISTÓRICO

| Componente | Rol | Estado integración resumido |
|---|---|---|
| Apache PyCasbin | Policy | P08 PREPARED; real deps/policy test pending |
| Bulkman | Resilience | P04 adapter/read-back; real vendor pending |
| Dagu | Donor | DONOR_ONLY; no scheduler mount |
| HTTPX | Transport | P03 real local transport PASS |
| Hypothesis | Test | TEST_ONLY; Action124 no lo intentó por order anomaly |
| OpenTelemetry Python | Observability | P05 prepared; version/runtime gates pending |
| Pydantic | Contracts | P02B adapter; exact core version flag |
| Rule Engine | Deterministic policy | P02C adapter/read-back; real vendor pending |
| Stabilize CORE | Workflow owner | P02A wired; real vendor execution flag |
| Starlette | ASGI/API | P03 version flag |
| pytest | Test | PROVENANCE_MISMATCH; TEST_ONLY |
| redun | Donor/provenance | DONOR_ONLY; post124 revalidated |
| resilient-circuit | Resilience | P04 adapter; real vendor pending |
| structlog | Logging | P05 prepared |

Baseline fue VERIFIED para su snapshot inicial, pero `freshness=STALE` tras Action124.

---

# 2. POST124 YA REVALIDADO 1×1

- gVisor → MATERIALIZED_OK / DONOR_ONLY_UNMAPPED / NOT_WIRED.
- gfxstream → MATERIALIZED_OK / DONOR_ONLY_UNMAPPED / NOT_WIRED.
- jsPDF → MATERIALIZED_OK / DONOR_ONLY_UNMAPPED / NOT_WIRED.
- libdatachannel → MATERIALIZED_OK / DONOR_ONLY_UNMAPPED / NOT_WIRED.
- pgvector → MATERIALIZED_OK / DONOR_ONLY_UNMAPPED / NOT_WIRED.
- pytest → PARTIAL_PROVENANCE_MISMATCH_TEST_ONLY / NOT_WIRED.
- redun → MATERIALIZED_OK / DONOR_ONLY_UNMAPPED / NOT_WIRED.

---

# 3. ACTION124 ARTIFACT INVENTORY

Artifact `10002484616` demuestra:
- 86 intentados;
- 80 checkpoints;
- 36 gaps.tsv;
- 60 complete checkpoint shape;
- 50 complete/no-gap;
- 10 complete/repair-gap;
- 20 partial;
- 6 provider gaps;
- 38 no intentados.

No existe `verify-final.json` en el ZIP recuperado; por tanto este artifact no permite cerrar 124/124.

---

# 4. CLASES DE RECOVERY

- C1 complete/no-gap: auditoría independiente antes de preservar.
- C2 complete+repair gap: root cause del exit code.
- C3 partial: completar faltantes.
- C4 provider gap: provider adapter.
- C5 unattempted: procesar recovery queue.
- C6 provenance conflict: forensic exact snapshot.

---

# 5. DEDUP

Canonical identity mínima:
`source_url_normalized + source_commit + source_tree/code_root + license/provenance`.

Solo si identidad coincide se puede deduplicar. Si nombre coincide pero snapshot difiere: mantener ambos hasta decisión `SUPERSEDES/MIGRATE/KEEP` con rollback.

---

# 6. CIERRE P01 FRESH

P01 solo vuelve a `VERIFIED_CLOSED` fresh cuando:
1. 124 entries reconciliadas;
2. acquisition gaps resueltos/clasificados;
3. provenance exacta;
4. aliases/dedup resueltos;
5. current destination read-back;
6. COMPONENT-CODE-MAP actualizado;
7. independent Judge PASS.
