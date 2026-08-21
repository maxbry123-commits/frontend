# PIPE-07 — VISUAL-CK + Sheriff

Refs: SHERIFF.md | DAG.md | inventory

## P07.N01
LEY: NO code desde 0. Solo source OS. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.
SOURCE: inventory.json + LEY-Y-METODO.md + PIPE-01…06 | uso: validar
ACCIÓN: verificar (checklist SHERIFF)
VERIFY: [ ] cada nodo con SOURCE [ ] sin from-scratch en plan
NEXT: P07.N02

## P07.N02
LEY: (igual)
SOURCE: https://fromted.vercel.app | fromted app | uso: VISUAL-CK post-wire OS
ACCIÓN: verificar preview
VERIFY: [ ] solo tras P02 wire [ ] no sustituye sources
NEXT: P07.N03

## P07.N03
LEY: (igual)
SOURCE: TAREAS-EN-CURSO + HANDOFF | uso: cierre gate
ACCIÓN: VERIFY
VERIFY: [ ] sources wave1 OK [ ] EN CURSO=P02.N01 [ ] Sheriff
NEXT: P08.N01 (opcional) o fin base → exec P02
