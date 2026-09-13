# UI YAIWES — SWARM NEXT ACTIVATION — 2026-09-13 00:07 America/Bogota

Contract: `tel.workflow/v3`
Mode: `FAIL_CLOSED_LOOP`
Authority: current `main` + `CRAZY-WALL-TASK-NODES-DYNAMIC-V5-2026-09-12.json` + fresh CI/logs.

## Rule

Do not create new architecture, schedulers, recovery engines or components unless a current requirement proves a unique capability gap. Prefer evidence reconciliation and reuse over code generation.

## Wave A — keep current claims, do not duplicate

- N07 Vite — CLAIMED
- N10 AVF — CLAIMED
- N11 big-AGI — CLAIMED
- N13 Vercel AI SDK — CLAIMED
- N25 Resource Brain — CLAIMED
- N29 Global Recovery — CLAIMED

N09 DuckDB is `VERIFIED_CLOSED`; do not touch it again.

## Wave B — activate as soon as a worker becomes free

N20 is `VERIFIED_CLOSED`, therefore these dependency-only blocks are logically satisfied and may be reconciled to claimable state after fresh readback:

1. N21 WORKER ADAPTER
   - Step 1 VERIFY: dedup Stabilize worker primitives and existing adapter code.
   - Step 2 EXECUTE: add only missing YAIWES boundary; no second scheduler.
   - Step 3 TEST/REPORT: task→worker→output/evidence + global regression.

2. N32 GUEST INSTALLER
   - Step 1 VERIFY: requirement + existing artifact/hash/arch/snapshot primitives.
   - Step 2 EXECUTE: minimal guest-only installer/verifier/rollback glue.
   - Step 3 TEST/REPORT: hash/signature/format/arch/dependency failure + rollback; no host contamination.

3. N33 MIRROR TRANSPORT
   - Step 1 VERIFY: LAN-first mirror requirement + existing transports/codecs.
   - Step 2 EXECUTE: minimal display/audio/input/clipboard/control runtime boundary; no disk/RAM continuous sync.
   - Step 3 TEST/REPORT: pairing/auth/session/control/clipboard + negative disk/RAM mirror test.

## Wave C — highest leverage evidence closure

Next free worker should prefer N03 `GAP_RESOLVABLE` before generating more architecture.

N30 established:
- 100 source rows
- 98 implementable requirements
- 98/98 mapped
- current persisted production certification: 0/98
- exact residual class: `missing_trace` for 98 requirements

N03 closure delta must therefore reuse existing `audit.five_pass`, `RequirementMatrix`, evidence verifier and N01/N02 mapping to materialize the production `RequirementTrace` inventory with exact source/implementation/test/evidence hashes and independent trusted CI references. No new auditor framework.

After N03 PASS, N04 state reconciliation becomes actionable.

## Wave D — close stale GAPs by evidence first

For N14, N16, N18, N22, N24, N26 and N28:

1. Compare their committed implementation/test blobs against current main.
2. Find a trusted descendant global CI run that executed the exact tests/blobs.
3. If exact and PASS, update node to `VERIFIED_CLOSED` without code changes.
4. Only patch code when blob/test evidence shows a real current failure.

This avoids overengineering because most of these nodes already have specific PASS evidence and were left GAP only because the global CI queue had not executed at report time.

## Dependency release order

- N21/N32/N33: N20 already closed → reconcile to claimable.
- N27: wait for N26 closure; N23 already closed.
- N17: wait for N18 + N26 + N28 + N29; N20 already closed.
- N12: wait for N07.
- N31: wait for N17.

## Current audit balance

- 33 total nodes tracked.
- 11 currently `VERIFIED_CLOSED`: N01,N02,N05,N06,N08,N09,N15,N19,N20,N23,N30.
- 6 current claims: N07,N10,N11,N13,N25,N29.
- 8 GAP nodes: N03,N14,N16,N18,N22,N24,N26,N28.
- 8 blocked nodes: N04,N12,N17,N21,N27,N31,N32,N33; three of these (N21,N32,N33) have their only listed dependency already closed and should be reconciled first.

Node closure ratio = 11/33 = 33.3%. This is not product completion percentage. N30 proves mapping completeness 98/98 but global product closure remains false until production RequirementTrace/evidence and runtime dependency chain close.