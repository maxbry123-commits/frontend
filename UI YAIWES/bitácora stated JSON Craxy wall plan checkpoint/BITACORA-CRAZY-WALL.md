# BITÁCORA CRAZY WALL — Integración modular UI YAIWES

## UI-PLUG-0001 — P01 VERIFIED_CLOSED
Inventario/provenance/dedup 14/14 con read-back independiente.

## UI-PLUG-0002 — SOCKET UNIVERSAL
Commit `4960005c12668e9ef843e1a42b842989cca6e338`: contract/catalog/registry/mount_guard/loader separados; Stabilize único workflow owner.

## UI-PLUG-0003..0010 — P02A→P04
P02A/P02B/P02C/P04 conservan flags de ejecución/versionado; P03 es PARTIAL_VERIFIED. Sin falso cierre.

## UI-PLUG-0011 — P05 PREFLIGHT
Cinco búsquedas obligatorias completadas; provenance Structlog/OpenTelemetry confirmado; sin adapter canónico alternativo encontrado.

## UI-PLUG-0012 — P05 STAGING
Branch `ui-yaiwes-p05-observability-20260906`, base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`, código `f26b1c87c6e4f873fdade6e14959e882d4704142`; code-only Structlog `d64c15da142a3dae10dd1559661c53dd70a521e2`, OTel API `6b978f11923255b723f51a93168fa5c2d9752b4d`; licencias preservadas; adapters/factories separados; keys `structlog.logging` + `opentelemetry.observability`; read-back PASS.

## UI-PLUG-0013 — P05 INJECTION/SOCKET CHECK
Chequeo determinista local de contrato equivalente: Structlog emit/delegation, OpenTelemetry tracer+meter delegation y mount por registry/loader conservando `stabilize_core` como único workflow owner: `3/3 PASS`. Este chequeo no se usó como sustituto de vendor real.

## UI-PLUG-0014 — P05 WATCHDOG / STRATEGYDELTA
Intento local anterior bloqueado por DNS. StrategyDelta aplicado: workflow repo-resident con sparse checkout runtime-only y `lfs:false`, sin tocar main.

## UI-PLUG-0015 — P05 REAL VENDOR EXECUTION PASS
Workflow `.github/workflows/ui-yaiwes-p05-observability-verify.yml` commit `de6c819f53f74f71b193f331be605b92590008af`; run `34076616213`, job `101603870455`: checkout sparse PASS + ejecución real de vendors PASS. Tests: `test_opentelemetry_injection_is_read_only`, `test_real_vendored_opentelemetry_api_bootstrap`, `test_real_vendored_structlog_bootstrap`, `test_structlog_injection_is_read_only`, `test_universal_socket_mounts_only_registered_factories` = `5/5 PASS`, 0.553s. Se retiran flags DNS/vendor-not-executed de P05. Main observado `66145a1ab53b78b3d03618fc2f3e919de685c19c`; staging sigue divergido `ahead 11 / behind 28`, merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`; no merge/rebase/force ejecutado. Próximo gate: reconciliar historiales preservando ambos y repetir read-back/tests post-integración antes de VERIFIED_CLOSED.
