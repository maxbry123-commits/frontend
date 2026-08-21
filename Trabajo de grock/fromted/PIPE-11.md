# PIPE-11 — Vercel / portabilidad / PWA

Fuente: `PROYECTO-FROMTED-PARTE-3-VERCEL-HOSTING.md`  
Refs: LEY-Y-METODO | SHERIFF | DAG

LEY fija: NO code desde 0. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.

## P11.N01 — static host
SOURCE: fromted Vite build + vercel.json | uso: conectar deploy
ACCIÓN: conectar
VERIFY: [ ] dist portable CF/Netlify [ ] no Vercel-only KV
NEXT: P11.N02

## P11.N02 — env URLs
SOURCE: settings ORCHESTRATOR_URL / LITELLM_URL (config) | uso: adaptar
ACCIÓN: adaptar
VERIFY: [ ] no secrets en client
NEXT: P11.N03

## P11.N03 — PWA install
SOURCE: web manifest + SW (adaptar patrón OS PWA) | uso: adaptar
ACCIÓN: adaptar
VERIFY: [ ] instalable móvil/PC
NEXT: P11.N04

## P11.N04 — SÍ/NO gate
SOURCE: PARTE-3 lista
VERIFY: [ ] UI chat/docs/router-fichas en Vercel [ ] Graphiti/orquestador NO en Vercel
NEXT: P12 (S10 diseño) o exec P02
SHERIFF: FAIL si se mete kernel Graphiti en bundle Vercel
