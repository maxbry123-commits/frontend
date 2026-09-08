# RECOVERY PATCH MAESTRO — UI YAIWES — V5

**Checkpoint objetivo:** `UIYAIWES-V5-XRAY-ACTION124-0026`
**Contrato runtime:** `tel.workflow/v3`
**Modo:** `FAIL_CLOSED_LOOP`
**Owner:** `stabilize_core`
**Handoff vivo:** `UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-MAESTRO-OPERATIVO-UI-YAIWES-V5.md`

Este parche permite retomar desde el estado real sin reconstruir el historial.

---

# 1. BOOT EXACTO

0. Leer `HANDOFF-MAESTRO-OPERATIVO-UI-YAIWES-V5.md` para obtener el punto de entrada y la ruta de recuperación viva.
1. Leer `CONTRATO-MAESTRO-FORENSE-XRAY-50-GOALS-UI-YAIWES.md`.
2. Leer `CROSSCHECK-FUENTES-VERDAD-XRAY-UI-YAIWES.md`.
3. Leer `STATE.json`.
4. Leer `CHECKPOINT.json`.
5. Leer `PLAN-TAREAS.md`.
6. Leer `BITACORA-CRAZY-WALL.md`.
7. Leer `GOALS-50-ENTRADA-SALIDA-V5.md`.
8. Leer `GAPS-ACTION124-RECOVERY-V5.md`.
9. Refrescar HEAD real.
10. Revisar Actions concurrentes antes de escribir.

---

# 2. ESTADO RECUPERADO

## P01
Baseline inicial 14 fue históricamente VERIFIED. Ya no es fresh porque Action124 modificó/intentó modificar la raíz de componentes y terminó cancelada.

## P02A
Stabilize adapter + Queue/Store DI. No duplicar. Recovery: ejecutar vendor real en entorno compatible y probar identidad/health/loader.

## P02B
Pydantic adapter + vendor. Recovery: resolver par exacto Pydantic/pydantic-core; no quitar version gate.

## P02C
Rule Engine adapter. Recovery: vendor 5.0.3 real; no reescribir wrapper.

## P03
HTTPX 0.28.1 real local PASS. Starlette version flag. Recovery: conservar HTTPX evidence, resolver Starlette exact runtime y luego streaming/cancel API.

## P04
Bulkman 2.0.3 + resilient-circuit 0.7.0. Injection/read-back PASS, vendor real pendiente.

## P05
Structlog + OpenTelemetry preparados. Recovery: no publicar como integrado hasta confirmar provenance/versions y tests read-only.

## P06
pytest/Hypothesis TEST_ONLY. pytest tiene provenance mismatch; Hypothesis no fue intentado por Action124 porque index 9 aparece al final del array histórico.

## P07
Dagu/redun DONOR_ONLY. redun revalidado post124; nunca owner.

## P08
PyCasbin preparado; recovery exige deps + real allow/deny + ToolPermissionBroker.

---

# 3. ACTION124 — RECOVERY EXACTO

Run `34060401131` = completed/cancelled.
Artifact id `10002484616`.
Digest `sha256:680861bb0f9b48dae398ccd56c95add5d44bd0bc45510a9a7cab17a55ee10683`.

Cifras recuperadas:
- expected 124;
- attempted 86;
- unattempted 38;
- 80 checkpoints;
- 36 gaps.tsv;
- 60 complete checkpoint shape;
- 50 complete-shape sin gap.tsv;
- 10 complete-shape con repair gap;
- 20 partial checkpoints;
- 6 provider gaps sin checkpoint.

## A02 classification — DONE
`ACTION124-RECOVERY-CLASSIFICATION-V5.json` cubre 124 índices únicos en C1/C2/C3/C4/C5; C6 es flag secundario.

## A03 queue integrity — DONE
`ACTION124-QUEUE-INTEGRITY-V5.json` registra queue blob `f8283c50395a63d5f8d5d3e127d86c2be75a0176`, set esperado `1..124`, 124 índices primarios únicos y anomalía histórica: Hypothesis index9 después de 124.
La cola histórica NO se modifica. Recovery usa vista ordenada `director_index ASC`.

## No repetir
- no rerun completo ciego;
- no borrar directorios que ya tengan evidencia;
- no force;
- no cambiar fuentes por mirrors sin registrar supersede;
- no convertir checkpoint del writer en auditoría independiente.

## Recovery class C1
50 complete/no-gap → auditor read-only, luego preservar.

## C2
10 complete+repair gap → investigar exit code y gates, no redownload automático.

## C3
20 partial → continuar faltantes únicamente.

## C4
6 provider gaps → paths específicos por proveedor preservando fuente original.

## C5
38 unattempted → procesar desde recovery view ordenada; incluye Hypothesis index9.

## C6
pytest provenance → exact snapshot forensic.

---

# 4. RECOVERY DE PROVEEDORES

## GitHub
Mantener método actual de pin HEAD/commit, NO-LFS, hashes, trace files.

## android.googlesource
Resolver commit/ref mediante git protocol/HTTP soportado por git; clonar sin LFS; preservar URL original; generar SOURCE_COMMIT/SHA256SUMS.

## GitLab
Clonar URL original GitLab con commit pin; mismo contrato de sums/provenance. No exigir prefijo github.com.

Provider resolver:
`URL → provider → resolver_ref → clone/fetch → pin → plan → extract → readback`.

---

# 5. RECOVERY DE CONCURRENCIA

Si HEAD cambia:
1. fetch HEAD;
2. inspeccionar commit;
3. comparar rutas tocadas;
4. si contiene nuestro delta correcto: adoptarlo;
5. si es independiente: reconciliar encima sin borrar historia;
6. si colisiona: merge lógico por blob/read-back;
7. nunca force.

Si aparece alias:
`nombre parecido` NO es suficiente. Comparar source URL, source commit, source tree, code-root, licencia y destino.

---

# 6. RECOVERY DE STALL

Si una ejecución realiza 5 lecturas sin delta:
- declarar `STALL_DETECTED`;
- CURRENT en 1 frase;
- escoger el menor delta seguro;
- ejecutar;
- verificar;
- persistir.

No responder con otro plan largo.

---

# 7. RECOVERY DE VERSION MISMATCH

1. registrar expected vs actual;
2. mantener fail-closed;
3. no modificar source pin silenciosamente;
4. decidir: provisionar runtime compatible o aprobar actualización de source como nuevo nodo;
5. ejecutar test real;
6. Judge.

---

# 8. RECOVERY DE MOCK/INJECTION

`PASS_INJECTION` demuestra wiring, no ejecución del vendor.

Para promover:
1. import real;
2. instantiate real;
3. execute representative operation;
4. test failure path;
5. loader/guard route;
6. evidence read-back.

---

# 9. RECOVERY DE MEMORY/STATE

Si hay contradicción entre documentos:
`real state > STATE/CHECKPOINT > source authority > summary`.

No borrar originales. Registrar ContradictionRecord con source refs y decisión.

---

# 10. RECOVERY DE TASK DAG

Si una tarea falla:
1. conservar Task ID;
2. crear Attempt nuevo;
3. FailureAnalysis;
4. strategy fingerprint;
5. StrategyDelta distinto;
6. rerun solo WorkUnit afectada;
7. consolidar sin duplicar artifacts ya válidos.

---

# 11. RECOVERY DE COMMAND CENTER / UI

UI nunca se usa para inferir backend listo. Cada función UI debe enlazar endpoint/contract/state mutation/test.

Si un componente visual existe sin backend: `UI_SHELL_ONLY`.
Si backend existe sin UI: `BACKEND_READY_UI_PENDING`.
Solo ambos + E2E: `FUNCTION_VERIFIED`.

---

# 12. RECOVERY VIRTUAL COMPUTER

No asumir backend universal único.
CapabilityProbe decide AVF/crosvm/KVM/WHPX/HVF/QEMU.

Si una plataforma no soporta feature:
- capability=false;
- fallback explícito si existe;
- nunca fake success.

iOS queda capability-driven.

---

# 13. NEXT EXACT

CURRENT=`P01_POST124_C1_INDEPENDENT_AUDIT`.

Delta siguiente:
1. tomar solo los 50 índices C1 de `ACTION124-RECOVERY-CLASSIFICATION-V5.json`;
2. auditar destino actual read-only, sin redownload;
3. verificar URL/SOURCE_COMMIT/SOURCE_SHA256SUMS/licencia/tree por componente;
4. registrar PASS/GAP por índice;
5. no promover P01 hasta completar C1–C6 y auditor independiente 124/124.

Si C1 queda bloqueado, continuar únicamente una tarea independiente segura documentada por FAIL_CLOSED_LOOP.

---

# 14. FINAL RECOVERY CHECKLIST

- [x] master contract reconciliado
- [x] handoff V5 vivo publicado
- [x] queue anomaly evidenciada
- [x] A02 124-index classification
- [x] A03 deterministic recovery ordering
- [ ] A04 C1 independent audit
- [ ] C2 repair investigation
- [ ] C3 partial resume
- [ ] C4 provider paths
- [ ] C5 unattempted
- [ ] C6 provenance
- [ ] final read-back real
- [ ] independent 124/124 auditor
- [ ] P01 fresh Judge

Cualquier casilla crítica ausente → no `VERIFIED_CLOSED`.
