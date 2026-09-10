# HANDOFF ASTRA — UI YAIWES

Fecha: 2026-09-10
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP
Estado de relevo: ACTIVE_LOOP

## Backend que Astra debe revisar
Raíz backend: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/`
Código backend: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/`
Capas existentes: contracts, ledger, llm_gate, runner, governance, layers y component_registry.
Estado declarado por el propio README: backend modular inicial, todavía no conectado a GitHub Actions/proveedor LLM real.

## Arquitectura y control
Leer primero:
1. `UI YAIWES/readme arquitectura UI YAIWES/CONTRATO-MAESTRO-FORENSE-XRAY-50-GOALS-UI-YAIWES.md`
2. `UI YAIWES/readme arquitectura UI YAIWES/CROSSCHECK-FUENTES-VERDAD-XRAY-UI-YAIWES.md`
3. `UI YAIWES/readme arquitectura UI YAIWES/ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md`
4. `UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-MAESTRO-OPERATIVO-UI-YAIWES-V5.md`
5. `UI YAIWES/readme arquitectura UI YAIWES/RECOVERY-PATCH-ASTRA-UI-YAIWES-2026-09-10.md`
6. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/STATE.json`
7. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-MULTIAI-CABLEADO-2026-09-10.json`
8. `UI YAIWES/watchdog UI YAIWES/CHECKPOINT-ASTRA-UI-YAIWES-2026-09-10.md`

## Fuentes funcionales adjuntas
Confirmadas en File Library: `MAX-SYSTEM-100X-FINAL-1.md` y `🤯🗃️memoria del Wordflow resumen de lo que va en memoria del Wordflow para Kimi k y grock contexto de 20 millones d parámetros para el Wordflow y YAIWES.md`.
STATE también enumera `Virtual Computer YAIWES` y `Command Center Chat YAIWES`; no se localizó un adjunto exacto con esos títulos durante esta pasada. Mantener `SOURCE_REFERENCE_GAP` hasta resolverlos.

## Trabajo coordinado
- SOL: backend/adapters/cableado de capacidades; no monolito.
- ASTRA: auditoría independiente, detección de GAP, revisión de integración y pruebas.
- GROK: frontend/visual; no editar backend salvo nodo explícitamente transferido.
- CLAUDE: nodo independiente asignado; no tocar archivos con owner activo.

## Regla anti-colisión
Cada nodo tiene `owner`, `paths`, `base_sha`, `status` y `evidence`. Una AI sólo escribe dentro de sus `paths`; antes del commit relee `main`. Si `main` o el archivo cambió respecto de `base_sha`, no fuerza: marca `STALE_LOCK_GAP`, relee y reconstruye el delta. Un nodo no cambia de owner sin registrar handoff.

## Cola actual
T1: adquirir/extractar/mover los 14 faltantes con motores canónicos únicamente y cerrar 14/14 con read-back.
T2: tras T1, clasificar por capacidad, cablear 1x1 mediante contratos/adapters existentes, probar y registrar evidencia.
T3: reconciliar STATE/CHECKPOINT/HANDOFF/Crazy Wall con la realidad final y ejecutar verificación independiente.

## Cierre
No usar carpeta presente como prueba de integración. No usar workflow success como prueba funcional. Sólo `VERIFIED_CLOSED` con ruta + SHA/diff + test/log/run + read-back y ausencia de GAP abierto del nodo.
