# PIPE-06 — Composer + tool chips

Refs: LEY-Y-METODO | SHERIFF | DAG

## P06.N01
LEY: NO code desde 0. Solo source OS. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.
SOURCE:
  repo: https://github.com/assistant-ui/assistant-ui
  commit: b361de28783a7fa094910b5152684421e701ca80
  path: fromted/sources/assistant-ui
  uso: adaptar ComposerPrimitive (Thinking|model|send)
ACCIÓN: adaptar
VERIFY: [ ] no composer engine propio
NEXT: P06.N02
SHERIFF: FAIL si from-scratch

## P06.N02
LEY: (igual)
SOURCE: assistant-ui + lucide 4aec3f89… | chips Document/Website/Image/Audio
ACCIÓN: adaptar
VERIFY: [ ] iconos lucide
NEXT: P06.N03

## P06.N03
LEY: (igual)
SOURCE: lucide + assistant-ui actions | capsules anclas
ACCIÓN: adaptar
VERIFY: [ ] no command system from scratch
NEXT: P06.N04

## P06.N04
LEY: (igual)
SOURCE: inventory assistant-ui + lucide
ACCIÓN: VERIFY
VERIFY: [ ] composer OS [ ] chips lucide [ ] Sheriff
NEXT: P07.N01
