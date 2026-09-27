# HANDOFF — UI YAIWES BACKEND TODO CABLEADO

Fecha: 2026-09-27  
Repo: `maxbry123-commits/frontend`  
Branch: `main`  
Raíz: `UI YAIWES/`  
Scope: **BACKEND / RUNTIME / AGENTIC**

## Punto de entrada

Arquitectura backend V1:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/ARQUITECTURA-BACKEND-UI-YAIWES-V1-2026-09-27.md

Arquitectura consolidada histórica:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md

README arquitectura / gaps:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES.md

Catálogo OSS:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/README.md

## Fuentes nuevas preservadas

1. https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/actualizaciones%20arquitectura%20backend/sistema%20de%20componente%20tipo%20plugins%20para%20la%20f%C3%A1brica%20y%20yaiwes%F0%9F%9A%80%F0%9F%86%98%F0%9F%86%98con%20los%20componentes%20necesarios%20y%20como%20funciona%F0%9F%93%B2no%20tocar%20%E2%9A%A0%EF%B8%8F.md
2. https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/actualizaciones%20arquitectura%20backend/%F0%9F%93%B2%F0%9F%93%8C%F0%9F%9A%80%F0%9F%93%B2%F0%9F%93%B2%20UI%20YAIWES%20INTERFACE%20VERSI%C3%93N%201.0%20FINAL%20%F0%9F%93%8C%F0%9F%9A%80%F0%9F%93%B2%20Con%20backend%20frontend%20y%20URL%20visible%20...a%20y%20dise%C3%B1o%20para%20backend%20y%20frontend%20todo%20%E2%9B%94no%20tocar%20%F0%9F%94%A8%F0%9F%93%8C.md
3. https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/actualizaciones%20arquitectura%20backend/%F0%9F%93%B2%F0%9F%93%B2%20UI%20YAIWES.%20fromtend%20plan%20de%20ejecuci%C3%B3n%20todo%20%20no%20tocar.md

Los tres archivos originales permanecen sin modificar.

## Decisiones congeladas

1. Stabilize CORE sigue siendo el único dueño del DAG/LOOP/recovery.
2. Los nuevos frameworks entran por adapters; ninguno crea una segunda verdad de ejecución.
3. Action Registry es la frontera estable para UI/chat/comandos.
4. Capability Registry es la frontera estable para Tools/Pools/Harnesses/Skills.
5. Component-IR es la representación neutral de componentes.
6. Contract Gate + OPA + Sandbox + Verifier controlan promoción y ejecución.
7. La memoria no es canonical state.
8. YAIWES ModelRouter conserva la decisión; LiteLLM/OmniRoute/otros son gateways/adapters.
9. Autoevolución solo genera candidatos; no autopromueve cambios.
10. `no tocar` significa preservar las fuentes y extender arquitectura de forma aditiva.

## Mapa operativo

`INPUT -> ROUTE/CACHE/RETRIEVE -> STABILIZE CORE -> ACTION REGISTRY -> CAPABILITY REGISTRY -> EXECUTOR -> POLICY/SANDBOX -> VERIFY -> CHECKPOINT/STATE -> RESULT`

Integración de software:

`REPO -> ACQUISITION -> QUARANTINE -> ANALYZER -> COMPONENT-IR -> TRANSFORM PLANNER -> COMPILER -> GATES -> TEST -> CAPSULE -> REGISTRY`

## Familias cableadas en arquitectura

- Harness: DeepSeek Harness, CLI-Anything.
- Durable/schedule: Prefect, Temporal, Trigger.dev, APScheduler, Huey.
- Workers: Dramatiq, Taskiq, Celery.
- FSM: transitions.
- Watchdog: watchfiles / watchdog.
- Event bus: NATS JetStream.
- Policy: OPA.
- Retry: Tenacity.
- Memory/retrieval: Qdrant, Mem0, Memanto.
- Cache/context/router: GPTCache, RedisVL, Semantic Router, LLMLingua, RouteLLM, LiteLLM, Portkey, Haystack, txtai, vLLM, LMCache.
- Skills: Agent Skills, Ponytail, Prompt Master.
- Evolution: Continual Harness, Meta-Harness, Life-Harness, MemRL, Bayesian-Agent, MetaClaw, SCOPE, ZERA, MOSS reference.
- Web: Obscura, Scrapling, Just-Scrape, Agent Reach, Playwright.
- Channels: OpenWA.
- Specialized engine: Compositor.

## Estado real

Este handoff documenta **arquitectura y cableado lógico**. No declara que todos los repositorios anteriores estén descargados, instalados o en runtime.

Estado por defecto para nuevos componentes:
`CANDIDATE/REFERENCE`

Solo cambia a `VERIFIED_CLOSED` después de:
`acquisition -> provenance -> adapter -> contract -> wiring -> focused test -> evidence -> readback`.

## Frontera con frontend

Frontend consolidado:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES%20interface/readme%20arquitectura%20UI%20YAIWES%20interface%20beta/ARQUITECTURA-FRONTEND-UI-YAIWES-V1.md

Contrato:
`UI action_id / NodePlan -> backend Action Registry -> runtime -> event/result -> UI`

El frontend no llama directamente a implementaciones internas.

## Siguiente trabajo backend

1. Materializar schemas de Component-IR / Action / Capability.
2. Implementar Action Registry.
3. Implementar Capability Registry.
4. Crear adapters del Micro-Kernel.
5. Integrar CLI-Anything como primer compiler/harness generator.
6. Conectar Policy/Sandbox/Verifier.
7. Conectar event bus/pools.
8. Conectar memory/retrieval y router pipeline.
9. Conectar DeepSeek Harness bajo HarnessAdapter.
10. Probar end-to-end y registrar evidencia.

## Regla de cierre

No declarar componente integrado por estar citado en arquitectura.

`PRESENT != ACQUIRED != WIRED != TEST_PASS != VERIFIED_CLOSED`
