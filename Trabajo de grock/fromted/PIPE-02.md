# PIPE-02 — Wire chat (assistant-ui + lucide)

Refs: `LEY-Y-METODO.md` | `SHERIFF.md` | `DAG.md`  
Pre: P01.N04 PASS (sources wave1 OK)

## P02.N01
LEY: NO code desde 0. Solo source OS. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.
SOURCE:
  repo: https://github.com/assistant-ui/assistant-ui
  commit: b361de28783a7fa094910b5152684421e701ca80
  path: fromted/sources/assistant-ui
  uso: conectar Thread/Composer/Message primitives (o npm @assistant-ui/react mismo origin)
ACCIÓN: conectar
VERIFY: [ ] imports desde source/package [ ] no motor mensajes propio
NEXT: P02.N02
SHERIFF: FAIL si ChatPanel from-scratch

## P02.N02
LEY: (igual)
SOURCE:
  repo: https://github.com/lucide-icons/lucide
  commit: 4aec3f892fd6c23063bc2fead83c899b5d412b1c
  path: fromted/sources/lucide
  uso: adaptar iconos 2D
ACCIÓN: adaptar
VERIFY: [ ] iconos lucide [ ] no set de iconos inventado como motor
NEXT: P02.N03

## P02.N03
LEY: (igual)
SOURCE:
  repo: assistant-ui
  commit: b361de28783a7fa094910b5152684421e701ca80
  path: fromted/sources/assistant-ui (ComposerPrimitive, ThreadPrimitive)
  uso: adaptar layout composer MiniMax sobre OS
ACCIÓN: adaptar
VERIFY: [ ] Composer del package [ ] no textarea engine propio
NEXT: P02.N04

## P02.N04
LEY: (igual). CSS≠source.
SOURCE: tokens tema fromted (solo style sobre primitives OS)
ACCIÓN: adaptar
VERIFY: [ ] solo CSS vars [ ] primitives intactas
NEXT: P02.N05

## P02.N05
LEY: (igual)
SOURCE: inventory + fromted app + https://fromted.vercel.app
ACCIÓN: verificar imports + VISUAL-CK
VERIFY: [ ] P01.N04 [ ] imports OS [ ] preview URL
NEXT: P03.N01
SHERIFF: FAIL → no PIPE-03
