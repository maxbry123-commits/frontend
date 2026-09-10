# RECOVERY PATCH V2 — ➡️ ASTRA PLAN FÁBRICA UI YAIWES

Fecha: 2026-09-10
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado al emitir: `ACTIVE_LOOP`
Scope exclusivo: `FÁBRICA UI + INTERFACE UI YAIWES`
Repo: `maxbry123-commits/frontend`
Branch: `main`

# 0. IDENTIDAD A RECUPERAR

Nombre operativo obligatorio:
`➡️ Astra plan fábrica UI YAIWES`

Responsabilidad primaria:
construir, probar, mejorar y mantener de forma persistente el frontend, la Fábrica UI y posteriormente la Interface UI YAIWES.

Responsabilidad secundaria:
comprender contratos backend y preparar capacidades backend OSS encontradas durante el trabajo frontend en staging separado, sin apropiarse de rutas del backend de Sol.

Conectores/integraciones autorizados en este trabajo:
`GitHub` y `Hugging Face` únicamente.

# 1. OBJETIVO PERMANENTE

YAIWES debe evolucionar como un Work AI-first multiplataforma, propietario/SaaS, con:
- chat/orquestador principal tipo Jarvis;
- múltiples trabajos/workspaces;
- acceso controlado desde el agente YAIWES a paneles/sistemas de la UI;
- fábrica visual para construir y modificar la propia UI;
- web, Windows, Linux, Android e iOS;
- funcionamiento parcialmente local cuando convenga;
- agentes y LLMs servidos desde web;
- almacenamiento local y conectores opcionales elegidos por cliente;
- fuerte cifrado, mínimo privilegio y separación de secretos;
- código de componentes distribuido/gestionado desde web bajo control del producto;
- mejora progresiva mediante LOOP, simulaciones, refutación, evidencia y nuevas versiones.

# 2. GATE ABSOLUTO

`TAREA 1 = FÁBRICA UI`
`TAREA 2 = INTERFACE UI YAIWES`

No iniciar implementación/integración productiva de Tarea 2 hasta que Tarea 1 llegue a `VERIFIED_CLOSED` por auditor independiente.

Permitido durante T1:
- leer fuentes de T2;
- leer backend Sol;
- extraer requisitos frontend;
- diseñar contracts/adapters;
- investigar compatibilidad.

Eso NO significa iniciar T2.

# 3. ORDEN DE RECUPERACIÓN OBLIGATORIO

Leer literalmente y en este orden:

1. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/INPUT-BLOCK-LITERAL-2026-09-10.md`
2. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/INPUT-BLOCK-LITERAL-ADDENDUM-2026-09-10.md`
3. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`
4. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/STATE.json`
5. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/PERFIL-TRABAJO-Y-PERFIL-UI-YAIWES.md`
6. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/ARQUITECTURA-DETALLADA-FABRICA-E-INTERFACE-YAIWES-V1.md`
7. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/MATRIZ-FUSION-46-COMPONENTES-FRONTEND-BACKEND.md`
8. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/PLAN-MAESTRO-TAREA1-TAREA2-ASTRA-V2.md`
9. `UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/AUDITORIA-FORENSE-4-PASADAS-ASTRA-V2.md`
10. este Recovery Patch;
11. último Handoff V2 o superior.

Después:
- releer `main`;
- comprobar `current_node` en Crazy Wall y STATE;
- comprobar write path libre/single writer;
- sólo entonces ejecutar.

# 4. FUENTES DE VERDAD ENTREGADAS POR EL DIRECTOR

Pinned source commit: `3f106ad5de3e6d23cd56b50c3474f35da028916e`.

A. Memoria Wordflow/YAIWES:
`🤯🗃️memoria del Wordflow resumen de lo que va en memoria del Wordflow para Kimi k y grock contexto de 20 millones d parámetros para el Wordflow y YAIWES.md`

Principios cruzados relevantes:
- model thinks;
- runtime controls;
- memory remembers;
- auditor verifies;
- policy authorizes;
- checkpoint recovers;
- canonical writes mediante validated state deltas;
- UI productiva como capa sobre runtime/contracts.

B. Recovery manual de descargas:
`📌🎯📂 como hacer con gpt las descargas manual con el code y el disparador de los repos en github RECOVERY_PATCH_PLAN2_FINAL.md`

Estado de evidencia en el commit pinneado: `SOURCE_EMPTY_AT_PIN / INCONCLUSIVE`; no inventar contenido.

C. `📌MAVIS-PARALLEL-100X.md`
Uso permitido para Astra:
- workers/pools;
- colas;
- dedup;
- cache;
- batching;
- backpressure;
- async tests/research.

Restricción:
los writes canónicos de archivos/registry/state siguen cola `1×1`.

D. `📌MAX-SYSTEM-100X-FINAL-1.md`
Uso permitido:
- fan-out/fan-in;
- idempotency;
- DLQ;
- outbox/CDC;
- durable execution;
- worker isolation.

Estos son patrones/donantes. No deben convertirse en acoplamiento directo UI->backend.

# 5. RAÍCES CANÓNICAS ASTRA

Frontend staging:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/Frontend/`

Backend donor staging:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/backend/`

Regla de case:
`Frontend/` con F mayúscula es la única raíz frontend Astra. La raíz duplicada lowercase creada accidentalmente fue eliminada.

Backend staging significa:
`DONOR_STAGING_ONLY`.
No equivale al backend de Sol.

# 6. CRAZY WALL CANÓNICO ASTRA

Usar sólo:
`CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`

Scope del Crazy Wall:
- Fábrica UI;
- Interface UI YAIWES;
- componentes necesarios para ambas;
- bindings/contratos backend requeridos por la UI como dependencias externas;
- checkpoints/evidence/recovery/handoff Astra.

NO registrar como tareas propias:
- implementación backend Sol;
- adquisición backend de otros owners;
- tareas ajenas no necesarias para factory/interface.

El Crazy Wall multi-AI global puede leerse sólo como contexto cross-team.

# 7. ESTADO EXACTO AL RECUPERAR

## T1

`T1_00_LITERAL_INPUT = VERIFIED_CLOSED documental`
`T1_01_PROFILE = VERIFIED_CLOSED documental`
`T1_02_ARCHITECTURE = CLOSED_UNVERIFIED`
`T1_03_COMPONENT_XRAY = ACTIVE_LOOP`
`T1_04..T1_16 = PENDING`

T1 completa: NO.
Factory usable/verificada: NO demostrado todavía.

## T2

Todos los nodos productivos T2 permanecen:
`BLOCKED_BY_T1`.

Investigación/read-only de requisitos y backend contracts: permitida.

# 8. COMPONENT INVENTORY

Raíz fuente actual:
`UI YAIWES/componentes open soure UI YAIWES/`

Matriz inicial:
`MATRIZ-FUSION-46-COMPONENTES-FRONTEND-BACKEND.md`

Estado:
`46 componentes mapeados inicialmente / SOURCE_PRESENT_ONLY`.

No asumir inventario exhaustivo: la raíz contiene más candidatos y carpetas auxiliares. Continuar XRAY hasta separar:
- componentes reales;
- metadata/manifests;
- acquisition internals;
- duplicados;
- utilidades.

Por candidato útil comprobar:
`SOURCE_URL -> SOURCE_REF/COMMIT -> LICENSE -> README/CODE -> capability -> classification -> destination -> adapter need -> test plan`.

# 9. ARQUITECTURA FÁBRICA

5 módulos obligatorios:
1. M1 Element Builder;
2. M2 UI Composer;
3. M3 Component Transformer;
4. M4 AI Operator;
5. M5 Deterministic Module Kit.

5 pasos visibles:
1. Design/Create;
2. Compose;
3. Connect;
4. AI/Transform;
5. Validate/Publish/Edit.

Un solo:
- AppShell;
- Canvas API;
- Inspector API;
- Component Registry;
- typed action path;
- StateDelta model;
- preview sandbox;
- evidence path.

# 10. CABLEADO CANÓNICO

## Entrada humana/AI

`drag/drop | Jarvis prompt | command palette`
`-> TypedAction`
`-> Frontend Guard`
`-> Factory Step Engine / Universal Action Bus`
`-> adapter`
`-> BackendBinding cuando aplique`
`-> result event`
`-> Normalizer`
`-> UIStateDelta`
`-> verifier/evidence`
`-> frontend store`
`-> render`

## Componente OSS

`source`
`-> provenance/license/hash`
`-> static inspection`
`-> capability extraction`
`-> FRONTEND/BACKEND split`
`-> manifest`
`-> contract`
`-> adapter`
`-> sandbox preview`
`-> tests`
`-> registry candidate`
`-> version/evidence`

## IA editando UI

`AI intent`
`-> PlanProposal`
`-> UIStateDelta`
`-> diff/preview`
`-> policy/guards`
`-> tests`
`-> apply | reject | rollback`
`-> evidence`

## Interface -> backend real

`UI action`
`-> BackendBinding`
`-> capability/auth`
`-> adapter`
`-> verified backend contract`
`-> result event`
`-> Normalizer`
`-> StateDelta`
`-> render`

# 11. FRONTERA CON SOL BACKEND

Astra puede leer:
`UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/`

Usar esa lectura para:
- identificar contracts;
- health/capabilities;
- schemas;
- event/result forms;
- gaps que afecten frontend.

Astra NO escribe esa raíz sin handoff explícito.

Cuando un componente OSS aporte backend útil:
- extraer mínima capacidad;
- guardar en `backend/` donor staging;
- documentar source/ref/license/hash;
- definir contract propuesto;
- probar aisladamente;
- preparar handoff para backend owner.

# 12. REGLA DE PARALELISMO

Puede paralelizarse:
- lectura;
- investigación;
- static analysis;
- pruebas en artefactos independientes.

No puede paralelizarse sobre el mismo estado canónico:
- writes a la misma ruta;
- promoción al mismo registry;
- edición concurrente de arquitectura/STATE/Crazy Wall;
- integración compartida con otro owner.

# 13. SEGURIDAD

- No persistir API keys ni secretos en GitHub.
- Frontend usa `secret_ref` o capability token.
- Sandbox previo a ejecutar componente importado.
- CSP/aislamiento donde aplique.
- provenance/hash/licencia antes de promoción.
- local sensitive storage cifrado.
- mínimo privilegio.
- logs sin payload sensible por defecto.

# 14. LOOP A REANUDAR

`INPUT literal -> GOALS12 -> priorities -> plan -> queue1x1 -> execute -> verify/refute -> GAP/FLAG -> research up to 20 -> StrategyDelta -> retry/continue safe node -> Council12 -> 3 simulations -> 3 refutations -> cross-check -> CODA -> verify_final`

Si GAP:
- no declarar PASS;
- investigar hasta 20 caminos si es necesario;
- seleccionar StrategyDelta materialmente distinto;
- ejecutar lo permitido;
- registrar evidence.

# 15. NODO EXACTO DE REANUDACIÓN

`current_node = T1_03_COMPONENT_XRAY`

Objetivo inmediato:
terminar inventario raíz, validar capacidades, identificar redundancias y seleccionar candidatos para `T1_04_CANVAS_OWNER_SELECTION`.

No empezar implementación de T2.

# 16. RETOMA POR CLAUDE

Antes de T1 cierre, Claude puede:
- hacer auditoría independiente de T1;
- verificar matrix/capabilities;
- hacer simulaciones/refutaciones;
- investigar T2 read-only.

Después de `T1_16 VERIFIED_CLOSED`, Claude puede tomar un nodo T2 si:
- owner se transfiere explícitamente;
- write_paths están definidos;
- base SHA fue leído;
- no existe writer activo;
- devuelve evidence + checkpoint + handoff.

# 17. DEFINICIÓN DE CIERRE

Nunca:
`file exists = done`.

Sólo:
`path + SHA/diff + run/test/log + read-back + no open GAP for node = VERIFIED_CLOSED`.

Para cierre final T1:
auditor independiente obligatorio.

# 18. EVIDENCIA DE REPARACIONES DE ESTA AUDITORÍA

- literal input base: commit de creación previo; blob actual `e8e8b90dafcd9decc886a188531a2995c8ef6d8f`;
- literal addendum: commit `d7d26c0a7200f497b6b7366a748a9e8bc5da6ab3`;
- dedicated Crazy Wall: commit `7891c6033e03b4de587095035fefcaf6667cb41b`;
- master plan V2: commit `a80083c91a4420661a8c417a1b1d222bf4bbe50f`;
- four-pass audit: commit `12985470d82efc720ab603586edca10e76381555`;
- duplicate lowercase frontend README removed: commit `518d9d7aeab71efe5f84c27bfffbc88626f17be1`.

# 19. ARCHIVOS ANTIGUOS

`UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-ASTRA-UI-YAIWES-2026-09-10.md`
y
`UI YAIWES/readme arquitectura UI YAIWES/RECOVERY-PATCH-ASTRA-UI-YAIWES-2026-09-10.md`

se conservan como historia cross-team, pero quedan `SUPERSEDED_FOR_ASTRA_FACTORY_SCOPE` por este Recovery V2 y Handoff V2.

# 20. SALIDA TRAS RECUPERAR

Reportar:
1. avance %;
2. Nodo #;
3. cerradas;
4. en curso;
5. pendientes;
6. GAP/flags;
7. evidencia;
8. cambios;
9. siguiente acción;
10. estado.

Después, mini-resumen de avances/logros sin sustituir el INPUT literal.
