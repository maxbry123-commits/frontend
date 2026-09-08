# RECOVERY PATCH MAESTRO — UI YAIWES — V5

**Checkpoint objetivo:** `UIYAIWES-V5-XRAY-ACTION124-0025`
**Contrato runtime:** `tel.workflow/v3`
**Modo:** `FAIL_CLOSED_LOOP`
**Owner:** `stabilize_core`

Este parche permite que otro chat Sol retome desde el estado real sin reconstruir 48 horas de historia.

---

# 1. BOOT EXACTO

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

Mensaje operativo esperado:
`Estado recuperado → P01 post124 activo → artifact 124 diagnosticado → CURRENT=A02/A03 recovery queue → inicio delta`.

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
pytest/Hypothesis TEST_ONLY. pytest tiene provenance mismatch; Hypothesis no fue intentado por Action124 porque index 9 aparece al final del array.

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

## No repetir
- no rerun completo ciego;
- no borrar directorios que ya tengan evidencia;
- no force;
- no cambiar fuentes por mirrors sin registrar supersede;
- no convertir checkpoint del writer en auditoría independiente.

## StrategyDelta
Crear una recovery queue derivada de:
`QUEUE original + artifact checkpoints + gaps.tsv + destination HEAD actual`.

### Recovery class C1
50 complete/no-gap → auditor read-only, luego preservar.

### C2
10 complete+repair gap → investigar exit code y gates, no redownload automático.

### C3
20 partial → continuar faltantes únicamente.

### C4
6 provider gaps → adapters para googlesource/GitLab.

### C5
38 unattempted → procesar; ordenar director_index.

### C6
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
5. si es independiente: rebase/recrear tree encima;
6. si colisiona: merge lógico por blob/read-back;
7. nunca force.

Si aparece alias:
`nombre parecido` NO es suficiente. Comparar source URL, source commit, source tree, code-root, licencia y destino.

---

# 6. RECOVERY DE STALL

Si un Sol realiza 5 lecturas sin delta:
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

Aplicable a Pydantic/core, Starlette, OTel y cualquier vendor versionado.

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

No borrar originales. Registrar ContradictionRecord con source refs, timestamps y decisión.

Si LLM propone memory update:
`proposal → normalizer → schema → auditor → StateDelta → canonical store`.

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

CURRENT después de publicar este patch:
`P01_POST124_RECOVERY_QUEUE_BUILD`.

Delta siguiente:
1. materializar clasificación 124 desde artifact + QUEUE;
2. validar indices 1..124 y ordenar;
3. generar recovery queue sin reintentar C1;
4. validar recovery queue con Sheriff/Validator;
5. ejecutar por clases y persistir checkpoint por componente.

Si ese delta queda bloqueado, siguiente tarea independiente segura: completar documentación/source map de C1/C2/C3, NO saltar a afirmar P05 cerrado.

---

# 14. FINAL RECOVERY CHECKLIST

- [ ] master contract leído
- [ ] HEAD fresco
- [ ] Actions revisadas
- [ ] STATE/CHECKPOINT coherentes
- [ ] CURRENT único
- [ ] evidence expected definido
- [ ] no-force
- [ ] rollback definido
- [ ] strategy fingerprint distinto si retry
- [ ] source provenance preservada
- [ ] read-back real
- [ ] Judge honesto
- [ ] bitácora/plan/recovery actualizados

Cualquier casilla crítica ausente → no `VERIFIED_CLOSED`.
