# PIPE-12 — Diseño visual MiniMax / paleta

Fuentes input: fotos usuario + tokens warm + `PROYECTO-FROMTED` visual  
Refs: LEY-Y-METODO | SHERIFF | DAG | PIPE-02/03

LEY fija: NO code desde 0. CSS≠source. Acción∈{adaptar,conectar,mejorar}. Solo style sobre OS.

## P12.N01 — paleta
SOURCE: tokens fromted (adaptar)
  bg warm charcoal #1A1A19 · text #BCBCB0 / #A8A59C
  azul eléctrico títulos/selección · naranja load/download · verde notif
ACCIÓN: adaptar CSS vars
VERIFY: [ ] no motor chat [ ] solo tokens
NEXT: P12.N02

## P12.N02 — layout MiniMax
SOURCE: assistant-ui primitives + fotos ref | adaptar hero/composer/chips
ACCIÓN: adaptar estructura OS
VERIFY: [ ] Composer/Thread del package
NEXT: P12.N03

## P12.N03 — iconos 2D
SOURCE: lucide 4aec3f89… | fromted/sources/lucide | adaptar
ACCIÓN: adaptar iconos mono; emoji 2D blanco on-active
VERIFY: [ ] lucide only icons engine
NEXT: P12.N04

## P12.N04 — config colores chat
SOURCE: settings UI | adaptar 5 colores input/output (default 2 grises)
ACCIÓN: adaptar
VERIFY: [ ] configurable [ ] Sheriff
NEXT: P12.N05

## P12.N05 — VISUAL-CK
SOURCE: https://fromted.vercel.app post-wire
ACCIÓN: VERIFY simetría 8px · no full-bleed clutter
NEXT: S11 mapa PARTES→PIPE | exec sigue P02.N01
