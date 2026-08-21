# PIPE-08 — Wave2 diseño (opcional)

Refs: GAPS-OS-S2b | SHERIFF | DAG

## P08.N01
LEY: NO code desde 0. Solo source OS. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.
SOURCE:
  repo: https://github.com/chatscope/chat-ui-kit-react
  commit: (pin inventory antes clone)
  path: fromted/sources/chat-ui-kit-react
  uso: descarga ref layout
ACCIÓN: descargar_determinista
VERIFY: [ ] SHA en manifest wave2
NEXT: P08.N02
SHERIFF: FAIL sin pin

## P08.N02
LEY: (igual)
SOURCE:
  repo: https://github.com/leonickson1/chatcn
  path: fromted/sources/chatcn
  uso: descarga ref temas
ACCIÓN: descargar_determinista
NEXT: P08.N03

## P08.N03
LEY: (igual)
SOURCE: manifest.sources.json + inventory.json | uso: pin SHA wave2
ACCIÓN: descargar_determinista (actualizar pins)
VERIFY: [ ] commits en inventory
NEXT: P08.N04

## P08.N04
LEY: (igual)
SOURCE: wave2 refs | uso: verificar no sustituye assistant-ui core
ACCIÓN: VERIFY
VERIFY: [ ] core sigue assistant-ui [ ] Sheriff
NEXT: P09 (S7 PARTES) o exec P02.N01
