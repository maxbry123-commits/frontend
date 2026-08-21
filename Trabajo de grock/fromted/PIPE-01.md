# PIPE-01 — Materializar sources wave1

Refs: `LEY-Y-METODO.md` | `SHERIFF.md` | `DAG.md` | `inventory.json`

## P01.N01
LEY: NO code desde 0. Solo source OS. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.
SOURCE:
  repo: https://github.com/assistant-ui/assistant-ui
  commit: b361de28783a7fa094910b5152684421e701ca80
  path: fromted/sources/assistant-ui
  uso: descarga
ACCIÓN: descargar_determinista
VERIFY: [x] path existe (wave1 materializado) [x] SHA inventory [ ] no UI
NEXT: P01.N02
SHERIFF: FAIL si se escribe ChatPanel

## P01.N02
LEY: (igual texto fijo)
SOURCE:
  repo: https://github.com/lucide-icons/lucide
  commit: 4aec3f892fd6c23063bc2fead83c899b5d412b1c
  path: fromted/sources/lucide
  uso: descarga
ACCIÓN: descargar_determinista
VERIFY: [x] path existe
NEXT: P01.N03

## P01.N03
LEY: (igual)
SOURCE:
  dockview | https://github.com/mathuo/dockview | 3a47321bf7b7d5e6b981a15f6a06c49adb2fdde5 | fromted/sources/dockview | descarga
  i18next | https://github.com/i18next/i18next | e1c60d4dd28a16f91be7f55b3685ffcf9760619b | fromted/sources/i18next | descarga
  react-i18next | https://github.com/i18next/react-i18next | 274e2e60785514388495466137c195c72d6749fb | fromted/sources/react-i18next | descarga
ACCIÓN: descargar_determinista
VERIFY: [x] 3 paths
NEXT: P01.N04

## P01.N04
LEY: (igual)
SOURCE: fromted/inventory.json (wave1 SUCCESS 2026-07-29)
ACCIÓN: verificar tree archivos reales
VERIFY: [x] sources/* listables [x] inventory SUCCESS
NEXT: P02.N01
SHERIFF: FAIL → no PIPE-02
