# PIPE-09 — 61 funciones chat → nodos UI

Fuente literal: `FROMTED-CHAT-61-FUNCIONES.md`  
Plan: `PROYECTO-FROMTED-PLAN-DETALLADO.md`  
Refs: LEY-Y-METODO | SHERIFF | DAG

LEY fija cada nodo: NO code desde 0. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.

## P09.N01 — Bloque A (#1–7)
SOURCE: assistant-ui b361de28… | fromted/sources/assistant-ui | adaptar/conectar  
Fn: input multi · models · historial · copy · system prompt · stream · stop  
VERIFY: [ ] primitives OS [ ] no motor custom  
NEXT: P09.N02

## P09.N02 — Bloque B (#8–11)
SOURCE: assistant-ui + tokens fromted | adaptar  
Fn: toggles stream/idioma/temp · tema · tamaño texto  
NEXT: P09.N03

## P09.N03 — Bloque C (#12–15) routers UI only
SOURCE: settings URL config (LiteLLM/OpenRouter as **connection fields** not kernels)  
ACCIÓN: conectar UI→URL  
VERIFY: [ ] no kernel in bundle  
NEXT: P09.N04

## P09.N04 — Bloque D (#16–23) estética/responsive
SOURCE: lucide 4aec3f89… + assistant-ui + tokens | adaptar  
Fn: mobile · skeleton · MD · teclado · dark mate · burbujas · input · copy btns  
NEXT: P09.N05

## P09.N05 — Bloque E (#24–26) historial
SOURCE: store local (adaptar) + assistant-ui thread | conectar  
Fn: search · export MD · autosave  
NEXT: P09.N06

## P09.N06 — Bloque F–G (#27–35) resilience/auth UI
SOURCE: UI toasts/boundary only | EXT fuera  
ACCIÓN: adaptar ErrorBoundary · health dot · reconnect UI  
VERIFY: [ ] EXT not embedded  
NEXT: P09.N07

## P09.N07 — Bloque H (#36–40) multimodal stubs
SOURCE: assistant-ui attach + lucide | adaptar stubs  
Fn: image · audio · voz · anclar · export  
NEXT: P09.N08

## P09.N08 — Bloque I–M (#41–61) UI triggers only
SOURCE: panel hooks → EXT/API | conectar fichas  
Fn: KB/embeddings UI · add agent · selector · chains UI · cola UI · presets · github selector · notas  
VERIFY: [ ] kernels fuera | Sheriff  
NEXT: P10 (S8 memoria) o exec P02.N01 primero

## Orden vs exec app
Implementación real sigue DAG: **P02 primero** (wire). P09 = mapa checklist al adaptar features.
