# DELTA ARQUITECTÓNICO — DEBATE SOL1/SOL2/SOL3 — 2026-09-11

Contrato: `tel.workflow/v3`  
Estado: `ACTIVE_LOOP / NOT_GLOBAL_CLOSED`  
Padre: `ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md`

## 1. Decisiones consolidadas con evidencia

- `runner.py` y L01–L06 están materializados; L06 conserva `REUSE → PATCH_SMALL → ADAPTER → GENERATE_DELTA` y no puede promover `WIRED` por sí solo.
- Ledger del Wordflow persiste JSONL con hash-chain y escritura temporal + `fsync` + replace; esto es persistencia del runtime, no toda la memoria cognitiva del producto.
- L05 es frontera fail-closed `contrato → motor canónico → LayerResult`; no implementa downloader/extractor propio, no infiere destino y exige source ref inmutable + motor commit canónico + destino permitido + read-back.
- L05 conserva causas tipadas de adquisición: `SPECIAL_FILE_GAP` y `PROVIDER_GAP`; no repara ni sustituye fuente dentro de la capa.
- DuckDB: run `34565130195`, job `103155580176` evidencia `SOURCE_SPECIAL_FILE_GAP` por symlinks de la fuente oficial; no sanitizar ni modificar motor.
- AVF: fuente canónica `android.googlesource.com`; el engine canónico fijado en `ef0669...` normaliza proveedores no GitHub hacia `github.com`, por lo que el transporte actual tiene `PROVIDER_GAP`. Capability/permisos/guest boot son GAPs downstream separados.
- Fables: se materializó como contrato explícito `yaiwes.fables.v1` sobre el socket existente `PluginRegistry → MountGuard → PluginLoader`, sin duplicar esas piezas. Ruta: `runtime/src/plugins/fables.py`, blob observado `36ee0b1b184b709e292fd8c617f0e795e7e98451`.
- Fables sigue `TEST_PENDING`: presencia/path/contract no equivalen a `VERIFIED`. Gate GitHub más reciente: run `34570113308` tras optimizar sparse-checkout.
- Runtime recovery L06: run `34568696244`, job `103165989964`, `pytest -q`, `4 passed in 0.06s`; válido para ese snapshot, no para cierre global.

## 2. Fronteras arquitectónicas

`SOURCE_PRESENT != ACQUIRED_VERIFIED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`

`L06 decision/evidence → adapter/spec proposal → Fables explicit capability mount → component integration → runtime/vendor test → evidence graph/checkpoint → Judge`

Fables no es nuevo workflow owner ni nuevo registry. Es la identidad contractual del enchufe universal requerido por el Director y delega montaje al socket fail-closed ya existente.

## 3. Carriles activos

- **Sol1:** Vite/Supabase permanecen bloqueados por `DESTINATION_INPUT_GAP`; mientras tanto ejecuta cross-check local-first storage/restart recovery/memoria chat-proyecto vs memoria agente.
- **Sol2:** L05 typed gaps y tests publicados; mientras CI se valida, define contrato AVF capability-probe separando provider/host capability/permission/guest boot/fallback.
- **Sol3:** L06 boundary aceptada; 21–30 parcialmente testeados, con StrategyDelta abiertos #22/#25/#27/#28/#30; 31–40 siguen como fuente presente/no wired.
- **Sol Orquestador:** verifica CI, consolida evidencia, corrige sólo deltas concretos y no añade componentes sin GAP funcional deduplicado.

## 4. No-cierre

Este delta no certifica soporte multiplataforma completo ni 100% del proyecto. Windows/Linux/Android/iOS/Web requieren aceptación capability-driven y pruebas por backend real. El debate y el LOOP continúan hasta cubrir objetivos con evidencia trazable.
