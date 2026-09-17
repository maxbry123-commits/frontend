# README — Arquitectura Fábrica UI

## Integración Meta 2026

La Fábrica UI usa las capacidades Meta como patrones de trabajo complementarios:

- **Muse Code** — programación/orquestación: `PLAN → CODE → RUN → TEST → FIX → VERIFY`.
- **Muse Glimmer** — loop de decisión/herramientas: `REASON → TOOL → RESULT → CORRECT → NEXT`.
- **MetaCua** — interacción visual: `SCREENSHOT → REASON → CLICK/TYPE → SCREENSHOT → VERIFY`.
- **CUA + MCP** — computer-use aislado: `AGENT → MCP → SANDBOX → BROWSER → ACTION → VERIFY`.
- **GitHub Repo Agent** — trabajo sobre repositorio: `EVENT → READ REPO → CODE/REVIEW → TEST → PR/RESULT`.
- **Multi-Agent Product Studio** — coordinación: `GOAL → KANBAN → PM + BACKEND + FRONTEND → INTEGRATE → TEST`.

## Loop de Fábrica UI

`GOAL → READ STATE → CLAIM → DISCOVER → READ CODE → PLAN → EDIT → RUN → SCREENSHOT → VERIFY VISUAL → TEST → FIX → RETEST → EVIDENCE → PASS`

### Captura de pantalla

La captura de pantalla es una evidencia esencial del frontend: permite observar el resultado renderizado, compararlo con el objetivo, detectar errores de layout/interacción y alimentar el ciclo de corrección. No sustituye tests funcionales; los complementa.

## Fuentes materializadas

- `fabrica de UI INTERFACE fromtend/Meta Agents 2026/`
- `UI YAIWES/Meta Agents integration sources/`

## Cableado

`Muse/Glimmer → decisión y código → CUA/MCP → navegador/sandbox → screenshot → verificación → test → corrección → evidencia`


## GAP — Skills frontend materializados 2026-09-17
- Impeccable (`pbakaus/impeccable`, source commit `f2c7051853848826aac2f4646581d62a732155ad`) — `GAP: COMPONENTE DESCARGADO/COPIADO. INTEGRACIÓN PENDIENTE.`
- Anthropic Frontend Design (`anthropics/skills`) — `GAP: COMPONENTE DESCARGADO/COPIADO. INTEGRACIÓN PENDIENTE.`
- Anthropic Skill Creator / Skills Design (`anthropics/skills`) — `GAP: COMPONENTE DESCARGADO/COPIADO. INTEGRACIÓN PENDIENTE.`
