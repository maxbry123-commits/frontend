# PIPE-10 — Memoria local dispositivo

Fuente: `PROYECTO-FROMTED-PARTE-4-MEMORY-LOCAL-DEVICE.md`  
Refs: LEY-Y-METODO | SHERIFF | DAG

LEY fija: NO code desde 0. Acción∈{descargar_determinista,adaptar,fusionar,conectar,mejorar}. CSS≠source.

## P10.N01 — sqlite-wasm
SOURCE:
  repo: https://github.com/sqlite/sqlite-wasm
  path: fromted/sources/sqlite-wasm (pin inventory al descargar)
  uso: descarga
ACCIÓN: descargar_determinista
VERIFY: [ ] SHA inventory
NEXT: P10.N02

## P10.N02 — wa-sqlite alt
SOURCE: https://github.com/rhashimoto/wa-sqlite | path sources/wa-sqlite | descarga
ACCIÓN: descargar_determinista
NEXT: P10.N03

## P10.N03 — Memory API client
SOURCE: sqlite-wasm/wa-sqlite + Web Crypto | uso: conectar Worker memory.*
ACCIÓN: conectar
VERIFY: [ ] no backend nuestro para store [ ] UI solo llama memory API
NEXT: P10.N04
SHERIFF: FAIL si POST memoria a nuestro VPS por defecto

## P10.N04 — cifrado reposo
SOURCE: Web Crypto AES-GCM (platform) | libs ref web-crypto-storage si se pinna
ACCIÓN: adaptar encrypt pipeline
VERIFY: [ ] clave no sale a nuestros servers
NEXT: P10.N05

## P10.N05 — VERIFY
SOURCE: PARTE-4 criterios
VERIFY: [ ] Network sin store a nuestro backend [ ] OPFS/IDB local [ ] Sheriff
NEXT: P11 (S9 Vercel) o exec P02 primero
