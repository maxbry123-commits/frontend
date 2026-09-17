# PLAN DE CIERRE UI YAIWES — WATCHDOG V2
Fecha: 2026-09-17
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP

## Objetivo
Cerrar primero los GAPS de adquisición/copia de los componentes solicitados y después continuar el cierre global de UI YAIWES sin falsos PASS.

## Orden
1. READ_FRESH + HEAD_GUARD + claims.
2. Resolver adquisición: OmniRoute trazas incompletas y Orca/03 ausente.
3. Verificar 5/5 acquisition readback. Anydoc permanece adquirido pero EXCLUIDO de copia a UI YAIWES interface.
4. Ejecutar Motor3 para copiar a UI YAIWES interface: Codebase Memory MCP, OmniRoute, Orca, Omarchy.
5. Exigir hash readback 4/4 antes de COPIED.
6. Integrar sólo por necesidad probada: CBM=MCP code-intelligence; OmniRoute=ProviderGateway; Orca=UI/agent-surface donor; Omarchy=ENVIRONMENT/OS DONOR; Anydoc=document->Markdown.
7. Focused tests -> evidence -> trusted CI completed/success -> five-pass -> readback.
8. Retomar Crazy Wall/Recovery Action Plan: siguiente child libre/no colisionante.
9. Recalcular S1/S2/S3/S4 y 167 requisitos desde trazas/evidencia, no desde contadores guardados.
10. Final Judge sólo cuando todos los gates globales estén demostrados.

## Simulación 10x
1. HEAD cambia -> re-read, no escribir scope obsoleto.
2. Claim activo -> no colisionar; seleccionar nodo libre.
3. Fuente ausente -> GAP, no copiar.
4. Marker SOURCE_* ausente -> GAP, no copiar.
5. SHA/hash mismatch -> FAIL, reparar/reextraer.
6. Colisión destino -> FAIL_CLOSED; no overwrite silencioso.
7. CI failure/pending -> no certificar.
8. Secret/API key detectado -> bloquear commit; SECRET_REF_ONLY.
9. Anydoc entra en copia interface -> bloquear por exclusión explícita.
10. Gates globales incompletos -> no VERIFIED_CLOSED global.

Resultado de simulación: 10/10 escenarios preservan FAIL_CLOSED; ninguno permite falso PASS.

## Estado inicial 2026-09-17
- Codebase Memory MCP: acquisition trace presente.
- OmniRoute: directorio presente; cierre de trazas/readback pendiente.
- Orca: acquisition 03 ausente; upstream stablyai/orca accesible, repo grande; causa exacta de fallo aún por evidenciar.
- Omarchy: acquisition trace presente.
- Anydoc: acquisition trace presente; no copiar a UI YAIWES interface.
- Watchdog: ejecutar este plan cada hora con salida mínima.

## Gate global final
No VERIFIED_CLOSED sin S1 20/20, S2 14/14, S3 64/64, S4 69/69, 167/167, missing_trace=0, contradiction=0, orphan=0, browser E2E PASS, real-platform acceptance soportada, TESTED_SHA==PUBLISHED_SHA, 12 entry goals, 12 exit goals, Council12, 3 refutaciones y Final Judge.

## X-Ray de componentes
- Autoridad: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-XRAY-COMPONENT-INTEGRATION-CLOSURE-V1-2026-09-17.json`.
- Inventario observado: 24 entradas en raíz UI YAIWES; 142 entradas en biblioteca OSS; 140 directorios OSS; 8 componentes YAIWES canónicos.
- Política: ningún componente se integra por presencia. Cada selección exige Requirement/GAP -> adapter -> wiring -> focused test -> evidence -> trusted CI -> readback.
- Los 8 YAIWES/CODA se reutilizan como capacidades existentes; no crear runtimes paralelos.
- Grupos de cierre: frontend/UI, contratos/policy, workflow/state, AI/MCP/gateway, memory/data/search, documentos, sandbox/plataforma, seguridad, observabilidad/tests, media/notificaciones, requested-5.
- Bulkman permanece REVIEW_UNCLASSIFIED hasta evidencia funcional suficiente.
- El X-Ray alimenta GAP-02/03/04/05; XRAY-12/13 alimentan GAP-08; XRAY-14 sólo aporta evidencia a GAP-09 Final Judge.
