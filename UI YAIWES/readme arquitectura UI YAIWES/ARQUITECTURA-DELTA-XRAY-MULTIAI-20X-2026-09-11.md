# ARQUITECTURA DELTA — X-RAY MULTI-AI + 20X — 2026-09-11

**Contrato:** `tel.workflow/v3`  
**Estado global:** `ACTIVE_LOOP` — este delta NO reemplaza ni cierra el Handoff Maestro V5.  
**Base observada antes del delta:** `83a730cbdc61f6aa81fb80fd0ae59bc55f6b2b71` (`audit(yaiwes): reconcile G11 G12 runtime durability subgates`).

## 1. Verificación cruzada de fuentes de verdad

Fuentes cruzadas: `HANDOFF-MAESTRO-OPERATIVO-UI-YAIWES-V5.md`, `CROSSCHECK-FUENTES-VERDAD-XRAY-UI-YAIWES.md`, `STATE.json`, `CRAZY-WALL-ROLES-5-2026-09-10.json`, `AUDIT-GAP-LEDGER-4AI-2026-09-11.json`, roles state y árbol físico actual de componentes.

Hallazgos fail-closed:
1. `STATE.json` blob `6e9ba8cd30279fab0fca79381af31e2d55f64f54` sigue siendo snapshot 2026-09-10 (120/124); no debe usarse como progreso vivo sin revalidación física.
2. Crazy Wall anterior blob `2404928bd332e2abb1466c9a4095bd52bd24acea` conserva colas/progreso antiguos y se mantiene sólo como historial; el overlay operativo actual es `CRAZY-WALL-STATE-HANDOFF-XRAY-2026-09-11.json`.
3. Ledger vivo blob `d710eba168a55ef489236833c6429c1100ee6079` contiene `G01..G19`; ninguna seed gap está `VERIFIED_CLOSED`. G01 y G14 tienen gates TESTED, G11 contiene subgates de durabilidad TESTED y G12 sigue matriz global incompleta.
4. G18 y G19 son bloqueos de publicación (Pages/Hugging Face credential), no fallos de componentes ni evidencia de wiring.
5. `roles/ASTRA2-GPT-BACKEND-STATE.json` no existía en la lectura previa a este delta; se crea como state explícito separado, sin fingir una respuesta de otro modelo.
6. El X-Ray V5 mantiene 25 capacidades de cierre como denominador arquitectónico. La actividad reciente (event schema/replay, durability, plugin CI) sólo cierra subgates; `G12_GLOBAL_GOALS_COVERAGE` debe mapear cada capacidad `requisito→capa→archivo→test→evidencia` antes de afirmar que “no falta nada”.

**Veredicto literal:** `NOT_VALIDATED_NO_MISSING`; todavía existen GAPs y cobertura global incompleta. No se permite convertir presencia de archivos, componentes o CI parcial en cierre global.

## 2. Arquitectura de coordinación multi-entorno

```text
SOURCE_TRUTH/HANDOFF
  -> CRAZY_WALL_STATE
  -> NODE_CLAIM(role, base_sha, write_scope)
  -> [1 RESEARCH|VERIFY] -> [2 AUTHORIZED_DELTA] -> [3 VERIFY|REPORT]
  -> EVIDENCE(path|URL + SHA/blob + test/log)
  -> next FREE node
```

Reglas: **1 tarea = 1 nodo**, máximo **3 pasos** por nodo, ningún rol comparte write-scope, `GAP` bloquea sólo su nodo salvo dependencia demostrada, y REQUEST/PENDING nunca cuenta como respuesta real. El Orquestador consolida archivos compartidos sólo después de read-back fresco.

Roles separados: Astra1 = drift/fuentes verdad; Astra2 = investigación/dedup componentes; Sol1 = Agent/Memory boundary; Sol2 = platform/sandbox capability; Sol3 = Fables/integration; Sol Orquestador = consolidación/G11/G12/20X. Cada uno debe reclamar nodo antes de escribir y reportar evidencia después.

## 3. Mejoras 20X y componentes

El inventario actual ya contiene, entre otros, Firecracker, gVisor, nsjail, bubblewrap, NATS, Prometheus, Grafana, Loki, Playwright, Trivy, Cosign, Syft, Toxiproxy, k6, Wasmtime, Valkey, Qdrant, PGlite, pgvector, Meilisearch, Tantivy, SOPS, SQLCipher, Python-TUF, in-toto, Ray y otros; se **reutilizan**, no se descargan de nuevo.

### 11 candidatos nuevos/condicionales verificados como ausentes del inventario consultado

| Nodo | Componente | Función objetivo | URL oficial | Gate |
|---|---|---|---|---|
| IMP02 | Open Policy Agent | policy decision point | https://github.com/open-policy-agent/opa | comparar con rule-engine/PyCasbin |
| IMP03 | OpenFGA | ReBAC/ABAC fino | https://github.com/openfga/openfga | probar capacidad única |
| IMP04 | Litestream | DR/replicación SQLite | https://github.com/benbjohnson/litestream | sólo si store/checkpoint usa SQLite |
| IMP05 | rqlite | SQLite multi-host/consenso | https://github.com/rqlite/rqlite | condicional; no duplicar Litestream |
| IMP06 | OpenTelemetry Collector | OTLP receive/process/export | https://github.com/open-telemetry/opentelemetry-collector | distinto de OTel Python existente |
| IMP07 | Grafana Tempo | backend de trazas | https://github.com/grafana/tempo | revisar AGPL antes de adquirir |
| IMP08 | Testcontainers Python | entornos E2E efímeros | https://github.com/testcontainers/testcontainers-python | sólo CI Docker-capable |
| IMP09 | Schemathesis | fuzz/stateful API | https://github.com/schemathesis/schemathesis | complementar Hypothesis, no duplicar |
| IMP10 | Kata Containers | aislamiento OCI con VM | https://github.com/kata-containers/kata-containers | comparar Firecracker/gVisor |
| IMP11 | Grype | segundo scanner vulnerabilidades | https://github.com/anchore/grype | condicional frente a Trivy |
| IMP12 | ORAS | transporte OCI artifacts | https://github.com/oras-project/oras | sólo si se aprueba lane OCI |

### 9 mejoras por reutilización
IMP01 SourceAuthoritySet con in-toto/TUF/Cosign; IMP13 replay con Stabilize+Debezium; IMP14 Evidence Graph con Oxigraph; IMP15 DLQ/outbox con NATS+PGMQ+Debezium; IMP16 Context Fabric con Qdrant+FastEmbed+Meilisearch+Tantivy; IMP17 resource router con LiteLLM+sysinfo; IMP18 reconstruction test con Playwright+pytest+Hypothesis; IMP19 supply-chain con Syft+Cosign+TUF+in-toto+Trivy; IMP20 fault injection con Stabilize+Toxiproxy+k6.

## 4. Plan de adquisición — NO EJECUTADO

Cada candidato nuevo debe pasar exactamente: **(1) provenance oficial + licencia + dedup + gap**, **(2) pin exacto + destino planificado `UI YAIWES/componentes open soure UI YAIWES/<ComponentName>` + compatibilidad motor**, **(3) adquisición por motor canónico `COPY_ONLY_IMMUTABLE_NO_LFS_NO_FORCE` + read-back/test**. Si cualquier gate falla, `GAP` y no se descarga.

No se autoriza un nuevo scheduler/orquestador/core paralelo. Stabilize sigue owner del workflow; los componentes 20X son adaptadores/capacidades alrededor de contratos existentes.

## 5. Criterio de cierre

El proyecto no puede declararse terminado mientras `G01..G19`, la matriz G12, las 25 capacidades X-Ray y los objetivos del Handoff no tengan trazabilidad `requisito→implementación→test→evidencia→verify_final`. Los 20 nodos de mejora son backlog controlado y no alteran ese denominador hasta ser aceptados.
