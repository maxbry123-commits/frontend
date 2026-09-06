# UI YAIWES — Integración runtime P02→P08

Fecha: 2026-09-06
Contrato: `tel.workflow/v3`
Rama de integración segura: `yaiwes-runtime-staging-20260906`

## Invariantes congelados
1. `stabilize_core` es el único workflow owner.
2. Adapters, policy, observability, resilience, TEST y DONOR no poseen el workflow.
3. Código presente ≠ integrado; integrated ≠ VERIFIED_CLOSED.
4. Toda activación requiere catalog + allowlist + factory + MountGuard + Loader + test/evidence.
5. TEST/DONOR no son production-mountable.
6. Observabilidad es read-only respecto al canonical state.
7. Ningún flag de runtime real se convierte en PASS con pruebas por fake/inyección.
8. Mientras run `34060401131` muta `main`, no hay merge ni dedup destructivo.

## Flujo modular vigente
`Component source + SOURCE_COMMIT/tree → code-only vendor → adapter/dependencies → runtime/version|provenance gate → factory → activation allowlist → PluginRegistry → MountGuard → PluginLoader → health/test → evidence → STATE/CHECKPOINT`.

## P02A — Stabilize CORE
- Rol: único owner del workflow.
- Factory: `stabilize.orchestrator`.
- Wiring principal: commit `88b424424d62db798da8ea2406992d043e3a23fc`.
- Adapter tests: PASS por fake/orchestrator inyectado.
- Estado: `CLOSED_UNVERIFIED_WITH_FLAG`.
- GAP: ejecución contra vendor real no probada por bloqueo DNS del entorno ejecutor.

## P02B — Pydantic
- Rol: contratos/validación tipada.
- Factory: `pydantic.contracts`.
- Source fijada: Pydantic `2.14.0b1`, pydantic-core `2.48.0`.
- Runtime local auditado: Pydantic `2.13.4`, core `2.46.4`.
- Estado: `CLOSED_UNVERIFIED_WITH_VERSION_FLAG`.
- Regla: mismatch debe fallar cerrado.

## P02C — Rule Engine
- Rol: `policy.rules`; no scheduler.
- Source: https://github.com/zeroSteiner/rule-engine
- SOURCE_COMMIT: `c166666f66acabfa42856639812a3c20ae04da60`.
- Versión: `5.0.3`.
- Factory: `rule_engine.policy`.
- Main commit: `a1e6e4a4ac595a7c29e04bbdb150e3c226d116f5`.
- Estado: `CLOSED_UNVERIFIED_WITH_FLAG`; adapter/read-back PASS, vendor real pendiente.

## P03 — HTTPX + Starlette
### HTTPX
- Source: https://github.com/encode/httpx
- SOURCE_COMMIT: `b5addb64f0161ff6bfe94c124ef76f6a1fba5254`.
- Source/runtime version compatible: `0.28.1`.
- Factory: `httpx.transport`.
- Estado: runtime local probado; PASS del adapter real local.

### Starlette
- Source canónica auditada en component root; versión fuente `1.6.0`.
- Runtime local: `0.50.0`.
- Factory: `starlette.asgi`.
- Estado: `CLOSED_UNVERIFIED_WITH_VERSION_FLAG`.
- Main commit P03: `85a3f758a4a6228e0d5d030a544365ccdef0a198`.

## P04 — resilient-circuit + Bulkman
### resilient-circuit
- Source: https://github.com/rodmena-limited/resilient-circuit
- SOURCE_COMMIT: `c9d80c845df771a9b9d63f9a48e6f24e6ed0b94a`.
- Version: `0.7.0`.
- Factory: `resilient_circuit.breaker`.
- Adapter: PASS por inyección; vendor real no probado.

### Bulkman
- Source: https://github.com/rodmena-limited/bulkman
- SOURCE_COMMIT: `99607f7e1b881a68cc99305ab233299c57469414`.
- Version: `2.0.3`.
- Factory: `bulkman.bulkhead`.
- Dependencia fijada por upstream: `resilient-circuit>=0.5,<0.8`; seleccionado `0.7.0`.
- Adapter: PASS por inyección; vendor real no probado.
- Main commit P04: `b7545ca41ae0012e658d3ab8334cbe5aa98c077b`.

## P05 — Structlog + OpenTelemetry
### Structlog
- Source: https://github.com/hynek/structlog
- SOURCE_COMMIT: `73393f34b40c15688b3fdd0982889b225f11b59b`.
- Code tree: `d64c15da142a3dae10dd1559661c53dd70a521e2`.
- Factory: `structlog.logging`.
- Gate: provenance commit/tree; no versión inventada desde VCS source.
- Estado staging: adapter + vendor code-only + loader test PASS por inyección; ejecución vendor real bloqueada por DNS.

### OpenTelemetry API
- Source: https://github.com/open-telemetry/opentelemetry-python
- SOURCE_COMMIT: `96df63add12f6e0453b265ac34c5c07ec7b9267e`.
- API source version: `1.45.0.dev`.
- Factory: `opentelemetry.api`.
- Estado staging: adapter PASS por inyección; runtime local no coincide.

### OpenTelemetry SDK
- SDK source version: `1.45.0.dev`.
- Semantic conventions: `0.66b0.dev`.
- Factory preparada: `opentelemetry.sdk`.
- Importante: SDK vive en adapter separado y NO está allowlisted.
- Observability nunca escribe canonical state.

## P06 — pytest + Hypothesis
- Tipo: `TEST_ONLY`.
- Production mount: rechazado por `MountGuard`.
- Test explícito del gate: PASS determinista.
- No se crea adapter de producción.

## P07 — Dagu + redun
- Tipo: `DONOR_ONLY`.
- Production mount: rechazado por `MountGuard`.
- Dagu no puede convertirse en scheduler paralelo.
- redun aporta patrones/provenance, no ownership.
- Test explícito del gate: PASS determinista.

## P08 — PyCasbin
- Source: https://github.com/apache/casbin-pycasbin
- SOURCE_COMMIT: `bf5a94be899c3eb14e9d9509904a3b38d9f2cf71`.
- Version: `2.6.1`.
- Code tree: `ec2e719085272a06bc13a275c226f767f2202682`.
- Factory: `casbin.authorization`.
- Dependencies upstream: `simpleeval>=1.0.3`, `wcmatch>=10.1`.
- Estado staging: adapter/enforcement/version gate PASS por inyección; ejecución vendor real no probada porque el entorno local no tiene `casbin`, `simpleeval`, `wcmatch`.

## Verificación staged
- Core staging code commit: `c16100b7c340dcd437cbd7495f2af319e7a2f4ce`.
- `catalog + activation + registry + loader + mount_guard + adapters`: `PASS_6_OF_6_LOCAL_DETERMINISTIC`.
- Evidencia intento vendor real: `runtime/evidence/P05-P08-real-vendor-attempt-20260906.md`.
- Reconcile manifest: `runtime/evidence/P05-P08-reconcile-manifest.json`.
- CHECKPOINT actual: `UIYAIWES-P05-P08-STAGING-0018`.

## Bloqueo externo vigente
Workflow run: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131
El run continúa descargando/extrayendo la cola de 124 componentes y mutando `main`; por contrato no se fusiona staging ni se deduplican carpetas mientras permanezca `in_progress`.

## Cierre
P03–P08 no se declaran globalmente `VERIFIED_CLOSED`. El cierre requiere: terminar adquisición 124 → reconciliar final `main`↔staging → aplicar solo delta faltante sin force → read-back → ejecutar vendors reales → repetir checks dependientes → actualizar STATE/CHECKPOINT → `VERIFIED_CLOSED` solo con evidencia.
