# PIPE-04 — Panel documentos

Refs: LEY-Y-METODO | SHERIFF | DAG | GAPS-OS-S2b

## P04.N01
LEY: NO code desde 0. Solo source OS. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.
SOURCE:
  repo: https://github.com/filebrowser/filebrowser
  commit: (pin en inventory al descargar wave2)
  path: fromted/sources/filebrowser
  uso: descarga
ACCIÓN: descargar_determinista
VERIFY: [ ] manifest wave2 + SHA antes clone
NEXT: P04.N02
SHERIFF: FAIL si panel without source

## P04.N02
LEY: (igual)
SOURCE:
  repo: https://github.com/urfdvw/react-local-file-system
  commit: (pin inventory wave2)
  path: fromted/sources/react-local-file-system
  uso: descarga
ACCIÓN: descargar_determinista
NEXT: P04.N03

## P04.N03
LEY: (igual)
SOURCE: filebrowser UI patterns + local-fs FolderView | uso: fusionar
ACCIÓN: fusionar
VERIFY: [ ] no file manager from scratch
NEXT: P04.N04

## P04.N04
LEY: (igual)
SOURCE: assistant-ui b361de28… + panel docs OS | uso: conectar anclaje
ACCIÓN: conectar
NEXT: P04.N05

## P04.N05
LEY: (igual)
SOURCE: inventory wave2
ACCIÓN: VERIFY
VERIFY: [ ] wave2 inventory [ ] panel OS [ ] Sheriff
NEXT: P05.N01
