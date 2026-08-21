# PIPE-03 — Tema warm + i18n

Refs: LEY-Y-METODO | SHERIFF | DAG

## P03.N01
LEY: NO code desde 0. Solo source OS. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.
SOURCE:
  repo: https://github.com/i18next/i18next
  commit: e1c60d4dd28a16f91be7f55b3685ffcf9760619b
  path: fromted/sources/i18next
  uso: conectar
SOURCE2:
  repo: https://github.com/i18next/react-i18next
  commit: 274e2e60785514388495466137c195c72d6749fb
  path: fromted/sources/react-i18next
  uso: conectar
ACCIÓN: conectar
VERIFY: [ ] no framework i18n inventado
NEXT: P03.N02
SHERIFF: FAIL si falta SOURCE

## P03.N02
LEY: (igual)
SOURCE: catálogos fromted (adaptar textos) | uso: adaptar en/es/fr/pt
ACCIÓN: adaptar
VERIFY: [ ] keys mínimas app/settings/chat
NEXT: P03.N03

## P03.N03
LEY: (igual). CSS≠source.
SOURCE: tokens warm #1A1A19 / #BCBCB0 sobre primitives OS
ACCIÓN: adaptar data-theme
VERIFY: [ ] i18n OS [ ] solo CSS vars [ ] no motor chat nuevo
NEXT: P04.N01
