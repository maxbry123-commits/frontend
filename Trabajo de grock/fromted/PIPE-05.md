# PIPE-05 — Shell + dockview

Refs: LEY-Y-METODO | SHERIFF | DAG | inventory

## P05.N01
LEY: NO code desde 0. Solo source OS. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.
SOURCE:
  repo: https://github.com/mathuo/dockview
  commit: 3a47321bf7b7d5e6b981a15f6a06c49adb2fdde5
  path: fromted/sources/dockview
  uso: conectar paneles
ACCIÓN: conectar
VERIFY: [x] path wave1 existe
NEXT: P05.N02
SHERIFF: FAIL si layout manager from-scratch

## P05.N02
LEY: (igual)
SOURCE: dockview | 3a47321b… | fromted/sources/dockview | conectar shell
ACCIÓN: conectar
NEXT: P05.N03

## P05.N03
LEY: (igual)
SOURCE: dockview tabs/panels | uso: adaptar Chat/Docs/Settings
ACCIÓN: adaptar
VERIFY: [ ] no tab system from scratch
NEXT: P05.N04

## P05.N04
LEY: (igual)
SOURCE: inventory dockview SUCCESS
ACCIÓN: VERIFY
VERIFY: [ ] shell usa OS [ ] Sheriff
NEXT: P06.N01
