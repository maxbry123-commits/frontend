# RECOVERY PATCH — UIYAIWES-V3-POST124-JSPDF-0020

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Owner único: `stabilize_core`
Arquitectura canónica: `UI YAIWES/readme arquitectura UI YAIWES/ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md`

## Recovery obligatorio

1. Leer arquitectura consolidada.
2. Leer STATE/CHECKPOINT/PLAN/BITACORA.
3. Consultar HEAD real de `main`.
4. Ejecutar búsquedas: componentes UI → frontend completo → agentes → router → osquestador.
5. Aplicar cuatro pasadas de arquitectura y cuatro pasadas de cada fuente de verdad antes de programar.
6. Ejecutar solo el delta 1×1 seguro.
7. Persistir evidencia y StrategyDelta ante GAP.

## Estado recuperado Action 124

Run `34060401131`: `completed/cancelled`; job `101559786309`; adquisición cancelada; verify final destino `failure`; fail-closed `failure`.
URL: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131

## Últimos deltas 1×1

`gVisor`: `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`, tree `fa6b9f1ca81285907f24d71ef100410ef48aac1f`, source `https://github.com/google/gvisor`, commit `0a1316b0d180600212bd607aa0ccfe2a9b09a899`, integración `NOT_WIRED`.

`gfxstream`: `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`, tree `e696264983a685fb44a7b9706bcf35383fd67159`, source `https://github.com/google/gfxstream`, commit `681d81edd2ec597b055c2fbe99a742d95545722a`, upstream tree `89e6b402afabac2ac63dd293da5c5b643c77c57b`, integración `NOT_WIRED`.

`jsPDF`:
- destino: `UI YAIWES/componentes open soure UI YAIWES/jsPDF`
- tree: `b85b001772c33639db82c4c0b64313a37522bbc0`
- source: `https://github.com/parallax/jsPDF`
- commit: `a3930ce03a585a26b2c76d12a0f413ce96f6d1a3`
- upstream tree: `baf4d90e2f5a40eb9f558f616b803dc3fd50f095`
- licencia: MIT; LICENSE blob `dc7d3a9fa305defebad6cb88ba4cd9776f26fcd3`
- candidate roots: `src`=`0d1aa3d5dd1af4349b757198f69ff892261d85f6`, `dist`=`26ba428becd4bc63059e091bf0a4aa2867fe650b`, `types`=`c6567c5a822bfcf0728665675b4f6c0a5b6d9d24`
- clasificación: `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`
- integración: `NOT_WIRED`

StrategyDelta: no copiar ni montar jsPDF al runtime. Conservar provenance y licencia. `.github`, docs, examples, test y build/release upstream quedan fuera del hot path. La presencia de `src/dist/types` no satisface contract→adapter→registry→loader→guard→test→read-back.

## Nodo recuperado

`P01_POST_124_INVENTORY_REVALIDATION`.
P01 conserva baseline histórico 14/14, pero sigue STALE hasta completar toda la reconciliación post-cancelación. P05 permanece bloqueado.

## Próximo paso seguro

Avanzar al siguiente componente físico después de `jsPDF` y repetir: manifest → SOURCE_URL/SOURCE_COMMIT → licencia → code-root/tree → classify → persist. Si un donor no tiene ruta universal verificable, marcarlo `DONOR_ONLY_UNMAPPED` y continuar sin copiarlo.

## Flags heredados

- `P01-FRESHNESS-STALE-POST-CANCELLED-124`
- `ACTION124-FINAL-DESTINATION-VERIFY-FAILED`
- `GVISOR-DONOR-ONLY-UNMAPPED-NOT-WIRED`
- `GFXSTREAM-DONOR-ONLY-UNMAPPED-NOT-WIRED`
- `JSPDF-DONOR-ONLY-UNMAPPED-NOT-WIRED`
- P02A real Stabilize vendor execution.
- P02B Pydantic/core exact-version mismatch.
- P02C Rule Engine real-vendor execution.
- P03 Starlette version mismatch.
- P04 Bulkman/resilient-circuit real-vendor execution.

## Concurrencia

Refrescar HEAD antes de cada escritura. Si otro commit toca el mismo estado, reconciliar y preservar ambos historiales. Nunca force `main`.

## Cierre

`SOURCE+SHA → adapter/factory → activation → registry → mount_guard → loader → test/health → read-back → STATE/CHECKPOINT/RECOVERY/BITACORA → JUDGE`.
Sin ruta/diff/SHA/log/test/URL no hay `VERIFIED_CLOSED`.
