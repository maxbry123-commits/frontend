# GUIA MAESTRA DE EJECUCION LOOP — UI YAIWES

> Contrato operativo: `tel.workflow/v4`
> Modo: `FAIL_CLOSED_EXECUTION_LOOP`
> Propósito: permitir que cualquier chat Sol recupere el proyecto desde evidencia real, ejecute deltas pequeños, verifique, persista el estado y continúe sin quedarse pensando ni rehacer trabajo ya cerrado.

---

# 0. LEY PRINCIPAL

Este documento NO es una explicación conceptual del proyecto. Es una **máquina de trabajo reproducible**.

La regla principal es:

`ENTENDER LO MÍNIMO NECESARIO → EJECUTAR UN DELTA REAL → VERIFICAR → PERSISTIR → SIGUIENTE NODO`

Prohibiciones absolutas:

- no quedarse en análisis repetitivo;
- no reconstruir el proyecto desde cero si existe STATE/CHECKPOINT;
- no declarar `PASS` por presencia de archivos;
- no confundir mock con ejecución real;
- no convertir un GAP en otra explicación general;
- no usar `force` sobre `main`;
- no borrar ni deduplicar mientras exista un proceso concurrente no terminado;
- no fusionar varias responsabilidades en un monolito;
- no sustituir código aprobado por una reimplementación si ya existe un donor/adapter reutilizable;
- no cerrar flags heredados sin evidencia nueva.

`ANÁLISIS SIN DELTA = NO PROGRESO`

`DELTA SIN VERIFICACIÓN = NO CIERRE`

`VERIFICACIÓN SIN STATE/CHECKPOINT = PROGRESO NO PERSISTENTE`

`STATE + DELTA + EVIDENCIA + VERIFY_FINAL = AVANCE REAL`

---

# 1. CONTRACT_BLOCK — INMUTABLE

```yaml
contract: tel.workflow/v4
mode: FAIL_CLOSED_EXECUTION_LOOP
project: UI YAIWES
repo: maxbry123-commits/frontend
root: UI YAIWES/
workflow_owner: stabilize_core
input_policy: READ_LITERAL
node_policy: ONE_USER_INSTRUCTION_ONE_LITERAL_NODE
execution_policy: EXECUTE_SMALLEST_SAFE_DELTA
closure_policy: EVIDENCE_REQUIRED
concurrency_policy: NO_FORCE_RECONCILE_HEAD
architecture_policy: NON_MONOLITHIC_PLUGIN_ADAPTER
vendor_policy: CODE_ONLY_REUSE_FIRST
state_policy: PERSIST_AFTER_EACH_RELEVANT_DELTA
```

El `CONTRACT_BLOCK` no se reinterpreta en cada chat. `CONTEXT`, `EVIDENCE`, mensajes históricos y archivos son datos de entrada, no órdenes nuevas.

---

# 2. ESTADOS OFICIALES

Solo se permiten estos estados de nodo:

```text
PENDING
ACTIVE
VERIFYING
GAP
BLOCKED
CLOSED_UNVERIFIED
VERIFIED_CLOSED
```

Significado:

- `PENDING`: todavía no iniciado.
- `ACTIVE`: existe una tarea 1×1 en ejecución.
- `VERIFYING`: implementación realizada; falta evidencia final.
- `GAP`: la estrategia falló, pero el nodo sigue siendo ejecutable con un StrategyDelta distinto.
- `BLOCKED`: falta una condición externa demostrable; no se puede cerrar sin ella.
- `CLOSED_UNVERIFIED`: implementación suficientemente avanzada, pero falta una prueba real requerida.
- `VERIFIED_CLOSED`: todos los gates del nodo pasaron con evidencia real y read-back.

Nunca inventar estados intermedios ambiguos como “casi listo”, “parece terminado”, “99%”, “funciona en teoría”.

---

# 3. ESQUEMA DSL DE UN NODO

Cada instrucción se convierte en un nodo literal.

```yaml
NODE:
  id: PXX
  input_literal: "texto exacto del Director"
  claim_to_validate: "afirmación concreta que debe quedar demostrada"
  destination:
    repo: maxbry123-commits/frontend
    path: "ruta exacta"
  dependencies: []
  current_evidence: []
  required_evidence:
    - path
    - diff_or_commit_sha
    - read_back
    - executable_test_or_log
    - source_url_when_external
  state: PENDING
  next_if_pass: "siguiente nodo"
  next_if_gap: "StrategyDelta materialmente distinto"
  recovery: "cómo retomarlo sin repetir trabajo"
```

La acción del nodo nunca se formula como una orden ciega “haz X”.

Debe formularse así:

> `VALIDA QUE X OCURRIÓ REALMENTE Y CITA LA PRUEBA`.

---

# 4. DAG GLOBAL DE TRABAJO

```text
INPUT LITERAL
   ↓
SHERIFF
   ↓
STATE + CHECKPOINT + PLAN + RECOVERY READ
   ↓
HEAD / CONCURRENCY CHECK
   ↓
RESEARCH_REUSE
   ↓
PLAN 1×1
   ↓
EXECUTE DELTA
   ↓
VALIDATOR
   ↓
VERIFY_REAL
   ↓
JUDGE
   ├── PASS → PERSIST → NEXT NODE
   ├── GAP → STRATEGY_DELTA → EXECUTE AGAIN
   └── BLOCKED → FLAG + RECOVERY → NEXT SAFE INDEPENDENT NODE
```

El DAG no autoriza saltarse nodos dependientes. Sí autoriza continuar con un nodo independiente si el actual queda bloqueado por una condición externa demostrada.

---

# 5. BOOT OBLIGATORIO DE CUALQUIER CHAT SOL

Un chat nuevo NO empieza investigando todo el proyecto.

Secuencia exacta:

1. Leer `STATE.json`.
2. Leer `CHECKPOINT.json`.
3. Leer `PLAN-TAREAS.md`.
4. Leer `RECOVERY-PATCH.md`.
5. Leer `BITACORA-CRAZY-WALL.md`.
6. Leer esta guía maestra.
7. Consultar `main` HEAD real.
8. Comprobar procesos concurrentes activos relevantes.
9. Identificar último `VERIFIED_CLOSED`.
10. Identificar nodo `ACTIVE`, `GAP` o `BLOCKED` más próximo.
11. Recuperar únicamente la evidencia necesaria para ese nodo.
12. Ejecutar el siguiente delta seguro.

Mensaje operativo esperado:

```text
Estado recuperado.
Último VERIFIED_CLOSED: <nodo>.
Nodo actual: <nodo>.
Flags heredados: <resumen>.
Proceso concurrente relevante: <sí/no + evidencia>.
Siguiente delta exacto: <acción>.
Inicio ejecución.
```

Después de ese mensaje debe empezar el uso de herramientas. No producir otra arquitectura general.

---

# 6. SHERIFF — GATE DE ENTRADA

El Sheriff responde antes de modificar nada:

1. ¿Cuál es el nodo literal?
2. ¿Cuál es el destino exacto?
3. ¿Qué ya está `VERIFIED_CLOSED`?
4. ¿Qué evidencia real existe?
5. ¿Qué falta exactamente?
6. ¿Hay un Action/watchdog/chat escribiendo concurrentemente?
7. ¿El siguiente delta es seguro frente a esa concurrencia?
8. ¿Existe código reutilizable antes de escribir código nuevo?
9. ¿La acción cambia arquitectura o solo integra una capacidad?
10. ¿Hay una dependencia externa que obligue a `BLOCKED`?

Si no hay destino claro: `FAIL_CLOSED`.

Si destino y nodo están claros: prohibido seguir planificando indefinidamente.

---

# 7. RESEARCH_REUSE — FUNNEL OBLIGATORIO

Antes de programar CADA nodo:

1. revisar el chat/checkpoint actual;
2. revisar `UI YAIWES/componentes open soure UI YAIWES/`;
3. buscar en todas las raíces del repo `frontend`;
4. buscar en repo `agentes`;
5. buscar en repo `router-universal-router-inteligente-`;
6. buscar en repo `osquestador-auditor`;
7. filtrar resultados no relacionados;
8. deduplicar capacidades equivalentes;
9. rankear:
   - código aprobado ya integrado;
   - código fuente oficial fijado por SHA;
   - código interno reutilizable;
   - implementación mínima nueva solo si no existe reusable;
10. registrar URL/SHA/licencia/destino cuando corresponda.

Resultado obligatorio:

```text
REUSE_FOUND
```

o

```text
NO_REUSE_FOUND
```

La investigación no puede transformarse en un ciclo infinito. Si ya existe evidencia suficiente para escoger una estrategia, ejecutar.

---

# 8. REGLA ANTI-STALL / ANTI-PARÁLISIS

Síntoma de parálisis:

- muchas lecturas;
- muchas explicaciones;
- muchas listas;
- ningún commit/test/read-back/delta.

Regla:

> Después de 1–3 lecturas útiles debe aparecer una acción física o una clasificación `BLOCKED` sustentada.

Si ocurren 5 operaciones seguidas de análisis/lectura sin delta:

```text
STALL_DETECTED
→ resumir el GAP en 1 frase
→ escoger el delta seguro más pequeño
→ ejecutarlo
→ verificarlo
```

No se permite responder al STALL con “haré un plan mejor”.

---

# 9. PLAN 1×1

El plan operativo siempre muestra UNA tarea ejecutable en primer plano.

```yaml
CURRENT:
  node: PXX
  task: "una sola tarea"
DELTA:
  path: "ruta exacta"
  action: "cambio exacto"
EXPECTED_EVIDENCE:
  - "prueba concreta"
NEXT_IF_PASS: "PYY"
NEXT_IF_FAIL: "StrategyDelta distinto"
```

Los pasos futuros pueden existir en el PLAN general, pero nunca deben impedir ejecutar `CURRENT`.

---

# 10. EXECUTOR — PRIORIDAD SOBRE ANÁLISIS

Si existe una acción segura autorizada, se ejecuta ahora.

Ejemplos válidos:

- leer archivo objetivo;
- comparar SHA;
- crear adapter;
- copiar code-root fijado;
- modificar manifest/allowlist;
- ejecutar test;
- consultar GitHub Action;
- leer logs;
- hacer read-back;
- actualizar checkpoint.

No es progreso:

- volver a explicar la arquitectura;
- enumerar 20 posibles soluciones sin probar ninguna;
- producir un nuevo plan que sustituya otro plan todavía no ejecutado.

---

# 11. ARQUITECTURA DE CÓDIGO OBLIGATORIA

Prohibido monolito.

Patrón:

```text
component source
→ vendor/code-root (si hace falta)
→ dependencies / contracts
→ adapter runtime
→ factory
→ activation allowlist
→ registry
→ mount_guard
→ loader
→ health/test
→ evidence
```

Separación recomendada:

```text
runtime/src/plugins/<capability>/
    __init__.py
    dependencies.py
    compatibility.py     # cuando haya version gate
    runtime.py
    factory.py
    README.md

runtime/tests/
    test_<capability>.py
```

El vendor no se modifica salvo necesidad demostrada. Se prefiere adapter externo.

---

# 12. VALIDATOR

Después de ejecutar un delta comprobar:

```yaml
schema_ok: bool
imports_ok: bool
destination_ok: bool
source_provenance_ok: bool
no_monolith: bool
no_duplicate_owner: bool
workflow_owner_unchanged: bool
factory_key_explicit: bool
activation_fail_closed: bool
mount_guard_ok: bool
concurrency_safe: bool
test_defined: bool
```

Si falla uno: `GAP`.

La corrección debe limitarse al delta fallido; no reiniciar la arquitectura global.

---

# 13. VERIFIER — JERARQUÍA DE EVIDENCIA

Orden de evidencia:

1. ruta publicada;
2. blob/tree SHA o commit SHA;
3. read-back del archivo publicado;
4. test determinista;
5. test contra loader/registry/guard reales;
6. integración real del vendor/package cuando sea posible;
7. logs/Actions/health runtime;
8. destino físico final;
9. repetición si el comportamiento puede ser flaky.

Clasificación de prueba:

```text
PASS_REAL
PASS_INJECTION
PASS_MOCK_ONLY
BLOCKED_EXTERNAL
FAIL
```

`PASS_MOCK_ONLY` y `PASS_INJECTION` son evidencia útil, pero no sustituyen `PASS_REAL` cuando el contrato exige ejecución del vendor.

---

# 14. JUDGE

El Juez decide exclusivamente desde evidencia:

```text
VERIFIED_CLOSED
```

Solo si todos los gates requeridos pasaron.

```text
CLOSED_UNVERIFIED
```

Si el código está correctamente cableado pero falta una prueba real obligatoria.

```text
BLOCKED
```

Si existe dependencia externa demostrable.

```text
GAP
```

Si el intento falló y existe una estrategia alternativa ejecutable.

El Juez nunca usa “debería”, “parece”, “probablemente”.

---

# 15. GAP + STRATEGY DELTA

Cuando una estrategia falla:

```yaml
FAILED_STRATEGY: "qué se intentó"
EVIDENCE: "error/log/resultado"
DO_NOT_REPEAT: "lo que no debe repetirse"
ROOT_CAUSE: "causa demostrada o hipótesis marcada"
NEW_STRATEGY: "delta materialmente distinto"
EXPECTED_EVIDENCE: "cómo probar que la nueva estrategia funciona"
```

Regla de las 20 soluciones:

- investigar hasta 20 candidatos si es necesario;
- rankearlos;
- ejecutar primero el mejor;
- detener la búsqueda cuando uno funcione;
- no generar 20 ideas teóricas antes de ejecutar la primera.

Un StrategyDelta debe cambiar materialmente respecto del intento fallido.

---

# 16. BLOCK / FLAG

Un bloqueo NO debe paralizar todo el proyecto.

Proceso:

```text
BLOCK DETECTED
→ registrar evidencia
→ crear recovery exacto
→ mantener el nodo visible
→ evaluar dependencia del siguiente nodo
→ si el siguiente nodo es independiente: continuar
→ si depende del bloqueado: detener esa rama
```

Ejemplos reales del proyecto:

- P02A: adapter Stabilize cableado pero ejecución real pendiente por entorno.
- P02B: Pydantic/core version mismatch; fail-closed.
- P02C: Rule Engine cableado, ejecución real vendor pendiente.
- P03: HTTPX probado localmente; Starlette con version mismatch.
- P04: Bulkman/resilient-circuit cableados por injection/read-back; ejecución real pendiente.

Estos flags permanecen hasta evidencia nueva.

---

# 17. SENTINEL / WATCHDOG

Cada watchdog ejecuta:

```text
READ STATE
→ READ CHECKPOINT
→ READ PLAN
→ READ RECOVERY
→ CHECK HEAD
→ CHECK CONCURRENT ACTIONS
→ IDENTIFY CURRENT NODE
→ EXECUTE ONE SAFE DELTA
→ VERIFY
→ WRITE STATE/CHECKPOINT/BITACORA/PLAN/RECOVERY
→ REPORT 10 LINES
```

El watchdog no es un cron que solo informa. Si existe un delta seguro, lo ejecuta.

Si no puede ejecutar, debe dejar evidencia exacta de por qué.

---

# 18. SUPERVISOR — VIGILA AL PROPIO AGENTE

Detecta:

```text
STALL_ANALYSIS
REPEATED_RESEARCH
DUPLICATE_IMPLEMENTATION
FAKE_PASS
STALE_STATE
CONCURRENT_WRITE
MONOLITH_DRIFT
UNVERIFIED_CLOSURE
DESTRUCTIVE_DEDUP_DURING_ACTIVE_ACTION
```

Respuestas:

- `STALL_ANALYSIS` → forzar delta mínimo.
- `REPEATED_RESEARCH` → reutilizar evidencia anterior.
- `DUPLICATE_IMPLEMENTATION` → adoptar existente, no duplicar.
- `FAKE_PASS` → degradar a CLOSED_UNVERIFIED/GAP.
- `STALE_STATE` → reconciliar con repo real.
- `CONCURRENT_WRITE` → refrescar HEAD, no force, reinyectar encima.
- `MONOLITH_DRIFT` → dividir responsabilidades.
- `DESTRUCTIVE_DEDUP_DURING_ACTIVE_ACTION` → no borrar hasta que la Action termine.

---

# 19. GUARDIAN — PROTECCIONES ABSOLUTAS

1. Nunca force-push.
2. Nunca borrar sin comparar destino/SHA/code-root.
3. Nunca deduplicar una carpeta mientras una Action activa todavía puede estar escribiendo esa raíz.
4. Nunca inventar URL/SHA/log/test.
5. Nunca afirmar ejecución que no ocurrió.
6. Nunca tratar file presence como integración.
7. Nunca tratar staging como main.
8. Nunca tratar tests con fake como runtime real.
9. Nunca convertir flag en PASS por presión de avance.
10. Nunca cambiar workflow owner: `stabilize_core` es único owner salvo nueva orden explícita del Director.
11. Nunca permitir que observabilidad gobierne decisiones.
12. Nunca montar donor/test como producción.
13. Nunca introducir archivos temporales de prueba en `main`.
14. Si se comete un error operativo, revertirlo con evidencia y registrarlo en Recovery/Bitácora.

---

# 20. CONCURRENCIA GITHUB

Antes de escribir:

1. leer HEAD;
2. identificar Actions/watchdogs activos;
3. confirmar que el delta no pisa el mismo archivo/ruta;
4. ejecutar;
5. si GitHub rechaza fast-forward o SHA quedó stale: volver a leer HEAD;
6. inspeccionar el commit concurrente;
7. deduplicar;
8. adoptar código equivalente ya publicado;
9. reinyectar solo lo que falte;
10. nunca force.

Caso real ya ocurrido: otros watchdogs publicaron P02C/P03/P04 mientras el LOOP trabajaba. La respuesta correcta fue adoptar esos commits y evitar adapters duplicados.

---

# 21. ACTION 124 — REGLA ESPECIAL

Workflow observado:

`/.github/workflows/ui-yaiwes-124-download-extract-20260906.yml`

Run:

`https://github.com/maxbry123-commits/frontend/actions/runs/34060401131`

Job:

`queue-124`

Última evidencia comprobada durante esta guía: el job estaba `in_progress`, con pasos 1–3 completados y el paso 4 `Process 124 components sequentially with pinned source SHA` todavía activo; la verificación final del destino seguía pendiente.

Mientras siga activo:

- NO deduplicar destructivamente `UI YAIWES/componentes open soure UI YAIWES/`;
- NO asumir 124/124 completados;
- sí puede continuarse con runtime/plugins en rutas independientes;
- cualquier conteo de componentes es `PROVISIONAL` hasta finalizar el step de verify/read-back.

Al terminar:

1. comprobar conclusion del run;
2. leer jobs/steps/log;
3. verificar destino físico;
4. contar componentes realmente materializados;
5. comparar SOURCE_URL/SOURCE_COMMIT;
6. detectar aliases/duplicados;
7. deduplicar solo con code-root/SHA equivalentes;
8. actualizar COMPONENT-INVENTORY/CODE-MAP;
9. revalidar P01 porque el inventario original 14/14 quedó stale tras la adquisición masiva;
10. registrar nuevo checkpoint.

---

# 22. PERSISTENCIA — CRAZY WALL

Después de cada delta relevante actualizar en este orden lógico:

```text
BITACORA-CRAZY-WALL.md
STATE.json
CHECKPOINT.json
PLAN-TAREAS.md
RECOVERY-PATCH.md
ARQUITECTURA / delta docs cuando cambie diseño
```

## STATE.json

Debe responder “qué es verdad ahora”.

```json
{
  "contract": "tel.workflow/v4",
  "current_node": "",
  "status": "",
  "verified_closed": [],
  "implemented_unverified": [],
  "active": [],
  "pending": [],
  "flags": [],
  "concurrent_processes": [],
  "last_evidence_commit": "",
  "next_delta": ""
}
```

## CHECKPOINT.json

Debe permitir que otro chat continúe sin historia conversacional.

Debe incluir:

- checkpoint id;
- nodo actual;
- último nodo cerrado;
- evidencia commits;
- flags;
- proceso concurrente;
- siguiente delta exacto;
- regla de cierre.

## RECOVERY-PATCH.md

Debe contestar:

- qué falló/bloqueó;
- qué NO repetir;
- qué evidencia existe;
- qué StrategyDelta queda autorizado;
- cómo continuar sin destruir trabajo previo.

---

# 23. PROGRESO — TRES PORCENTAJES

Nunca reportar un único porcentaje ambiguo.

Reportar:

```text
VERIFIED_CLOSED %
IMPLEMENTED_OR_STAGED_BUT_UNVERIFIED %
PHYSICAL_TOTAL_PROGRESS %
```

`VERIFIED_CLOSED` solo cuenta cierres completos.

Staging, mocks, adapters preparados y vendors sin ejecución real se contabilizan como avance físico, no como cierre verificado.

---

# 24. SALIDA WATCHDOG — EXACTAMENTE 10 LÍNEAS

1. Progreso físico total: X%.
2. Progreso VERIFIED_CLOSED: X%.
3. Nodo actual: PXX.
4. Tareas cerradas: N.
5. Tareas en curso: N.
6. Tareas pendientes: N.
7. GAP/flags: resumen.
8. Evidencia nueva: SHA/test/run/ruta.
9. Siguiente delta exacto.
10. Estado global: ACTIVE_LOOP | VERIFIED_CLOSED | CLOSED_UNVERIFIED | BLOCKED.

Si no hay evidencia nueva, decirlo. No inflar porcentaje.

---

# 25. RUTA REAL DEL PROYECTO — LO YA HECHO

## P01 — Inventario físico / provenance

Estado histórico: `VERIFIED_CLOSED` para el conjunto inicial de 14 componentes.

Evidencia central:

- COMPONENT-INVENTORY;
- COMPONENT-CODE-MAP;
- SOURCE_URL;
- SOURCE_COMMIT;
- code-root/tree SHA;
- dedup inicial.

Advertencia: después comenzó la Action 124 y aparecieron nuevas carpetas/aliases, por tanto el cierre P01 debe **revalidarse** cuando termine la adquisición masiva. No borrar mientras siga activa.

## Socket universal

Publicado y separado en:

- contract;
- catalog;
- registry;
- mount_guard;
- loader;
- activation.

Invariante: presence != mounted; all fail-closed; Stabilize único workflow owner.

## P02A — Stabilize

Hecho:

- vendor code-only;
- adapter/factory;
- Queue/WorkflowStore dependency injection;
- activation allowlist;
- guard tests;
- read-back.

Estado: `CLOSED_UNVERIFIED_WITH_FLAG` hasta ejecución real requerida.

Recovery: no crear segundo adapter; repetir mount real sobre el mismo bloque cuando el entorno lo permita.

## P02B — Pydantic

Hecho:

- source/core audit;
- adapter modular;
- version gate;
- vendor code-only;
- loader test/read-back.

Flag:

Fuente fijada `Pydantic 2.14.0b1 / pydantic-core 2.48.0`; runtime local observado `2.13.4 / 2.46.4`.

Recovery: no saltar gate; ejecutar con pareja compatible.

## P02C — Rule Engine

Hecho:

- source 5.0.3 auditado;
- adapter policy;
- code-only vendor;
- activation/factory;
- tests/read-back.

Estado: `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG` hasta ejecución real requerida.

## P03 — HTTPX + Starlette

HTTPX:

- fuente 0.28.1;
- adapter publicado;
- prueba local real con MockTransport PASS.

Starlette:

- fuente 1.6.0;
- runtime local observado 0.50.0;
- version gate fail-closed.

P03 global: parcial; HTTPX con evidencia real local, Starlette con flag.

## P04 — Bulkman + resilient-circuit

Hecho:

- resilient-circuit 0.7.0;
- Bulkman 2.0.3;
- compatibilidad declarada Bulkman `resilient-circuit>=0.5,<0.8` satisfecha por 0.7.0;
- adapters separados;
- injection tests/read-back.

Estado: `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAGS` hasta vendors reales.

## P05 — Structlog + OpenTelemetry

Investigación avanzada:

- Structlog separado de OTel;
- OTel API y SDK separados;
- observabilidad estrictamente read-only respecto al workflow;
- diferencias de runtime/version identificadas;
- adapters/gates preparados en trabajo de staging durante el LOOP.

Regla: antes de afirmar publicado en `main`, comprobar branch/commit/read-back actual. `staging != main`.

## P06 — pytest + Hypothesis

Clasificación: `TEST_ONLY`.

No necesitan plugin de producción. Debe existir gate explícito que pruebe que MountGuard rechaza su montaje production.

## P07 — Dagu + redun

Clasificación: `DONOR_ONLY`.

No deben convertirse en segundo scheduler/workflow owner. Se reutilizan ideas/código donor cuando proceda; MountGuard debe impedir production mount como owner.

## P08 — PyCasbin

Investigación avanzada:

- fuente canónica auditada;
- adapter de policy/autorización preparado;
- dependencias externas identificadas;
- no asumir ejecución real si faltan dependencias;
- alias/copia creada por Action 124 debe deduplicarse solo después de terminar la Action.

---

# 26. RUTA DE TRABAJO PENDIENTE

Orden operativo recomendado:

```text
A. esperar/verificar cierre Action 124
B. revalidar destino + inventario + aliases/dedup
C. actualizar P01 con inventario fresco
D. reconciliar main vs cualquier staging útil
E. verificar/publicar P05 sin duplicados
F. cerrar gates explícitos P06/P07
G. verificar/publicar P08 sin duplicados
H. volver a flags P02A/P02B/P02C/P03/P04 y resolverlos con entorno real compatible
I. consolidar contratos de dominio UI YAIWES
J. cablear chat API / stream / cancel / status
K. cablear workflow Stabilize completo
L. integrar Router/Memory mediante adapters, nunca como owner
M. health + observability read-only
N. integración E2E
O. repetición de checks reales para flakiness
P. verify_final global
```

Cada letra se descompone otra vez en nodos 1×1. Nunca ejecutar todo como una mega-tarea.

---

# 27. OBJETIVOS DE CALIDAD 12/12

Cada nodo debe intentar satisfacer:

1. input literal preservado;
2. destino exacto;
3. provenance trazable;
4. reuse-first;
5. no monolito;
6. no duplicate owner;
7. fail-closed;
8. concurrency-safe;
9. tests/gates;
10. read-back;
11. state persistido;
12. recovery definido.

Si falta uno necesario para el nodo, no se declara `VERIFIED_CLOSED`.

---

# 28. COUNCIL 12 — SIN CADENA DE PENSAMIENTO

Council es una lista de checks externos, no exposición de razonamiento privado:

1. ¿el nodo sigue literal?
2. ¿existe evidencia anterior reusable?
3. ¿el delta es mínimo?
4. ¿hay duplicado?
5. ¿hay write concurrente?
6. ¿se preserva owner?
7. ¿se preserva fail-closed?
8. ¿la prueba es real o fake?
9. ¿el destino es correcto?
10. ¿STATE refleja repo real?
11. ¿Recovery permite handoff?
12. ¿la siguiente acción está definida?

---

# 29. TRES REFUTACIONES ANTES DE CERRAR

Antes de `VERIFIED_CLOSED`, intentar refutar:

1. “El archivo existe, pero ¿realmente está cableado?”
2. “El test pasa, pero ¿es mock/injection en vez de vendor real?”
3. “El commit existe, pero ¿el destino/HEAD actual realmente lo contiene?”

Si cualquiera refuta el cierre: degradar estado.

---

# 30. INCIDENTES Y DESVIACIONES — CÓMO RESPONDER

## Archivo temporal accidental en main

Si una prueba operativa crea archivos basura/temporales:

1. detener nuevas escrituras;
2. leer el blob real;
3. borrar con SHA correcto;
4. registrar commit de limpieza;
5. añadir el incidente a Bitácora/Recovery;
6. prohibir repetir la técnica.

Lección permanente: nunca probar permisos/escritura creando archivos temporales en `main`.

## Código equivalente publicado por otro watchdog

1. no duplicar;
2. leer archivos publicados;
3. comparar diseño/SHAs;
4. adoptar si cumple contrato;
5. añadir solo gates faltantes;
6. actualizar State.

## Inventario cambia durante adquisición

1. marcar evidencia anterior `STALE_BY_CONCURRENT_ACQUISITION`;
2. no borrar;
3. seguir nodos independientes;
4. revalidar al terminar la Action.

---

# 31. DEFINICIÓN DE “TERMINAR EL PROYECTO”

El proyecto no termina porque existan todos los archivos.

Cierre global requiere:

```text
component inventory fresh
+ provenance complete
+ no uncontrolled duplicates
+ universal socket active
+ single workflow owner
+ plugins/adapters wired
+ version/dependency gates resolved
+ test/donor isolation
+ State/Checkpoint/Recovery consistent
+ real integration tests
+ E2E chat workflow
+ failure/recovery tests
+ repeated real checks where flaky
+ final read-back
```

Solo entonces:

`VERIFIED_CLOSED`.

---

# 32. PROMPT DE ARRANQUE PARA OTRO CHAT SOL

Copiar este bloque al iniciar un nuevo chat cuando sea necesario:

```text
INICIA tel.workflow/v4 FAIL_CLOSED_EXECUTION_LOOP para UI YAIWES.

Repositorio: maxbry123-commits/frontend
Raíz: UI YAIWES/

Primero lee, en este orden:
1. readme arquitectura UI YAIWES/GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md
2. bitácora stated JSON Craxy wall plan checkpoint/STATE.json
3. CHECKPOINT.json
4. PLAN-TAREAS.md
5. RECOVERY-PATCH.md
6. BITACORA-CRAZY-WALL.md
7. HEAD real de main
8. Actions/watchdogs concurrentes relevantes

No reconstruyas el proyecto desde cero.
No repitas investigación ya cerrada.
Una instrucción = un nodo literal.
Después de 1–3 lecturas útiles ejecuta el delta seguro más pequeño.
Si haces 5 lecturas/análisis sin delta: STALL_DETECTED → ejecuta.
Antes de programar haz el funnel de reuse obligatorio.
No monolito; usa contracts/dependencies/adapter/runtime/factory/activation/registry/guard/loader/tests.
No force.
No falsos PASS.
Mock/injection != vendor real.
Si GAP: StrategyDelta distinto y retry.
Si BLOCK externo: flag + recovery + continúa solo con nodo independiente.
Después de cada delta actualiza BITACORA, STATE, CHECKPOINT, PLAN y RECOVERY.
Cierre únicamente con ruta + SHA/diff + read-back + test/log + URL/provenance cuando aplique.

Salida watchdog: exactamente 10 líneas con progreso físico, VERIFIED %, nodo actual, cerradas, en curso, pendientes, flags, evidencia, siguiente delta y estado global.
```

---

# 33. CODA

El sistema debe comportarse como un ejecutor persistente con memoria documental, no como un chat que vuelve a pensar el proyecto en cada turno.

```text
RECOVER
→ EXECUTE
→ VERIFY
→ PERSIST
→ REINJECT
→ NEXT
```

Si falla:

```text
GAP
→ DIFFERENT STRATEGY
→ EXECUTE
→ VERIFY
```

Si se bloquea externamente:

```text
BLOCK
→ EVIDENCE
→ RECOVERY
→ NEXT SAFE NODE
```

La métrica principal no es cuántas páginas de análisis produjo el modelo. Es cuántos nodos quedaron físicamente implementados, verificados y recuperables por otro agente.
