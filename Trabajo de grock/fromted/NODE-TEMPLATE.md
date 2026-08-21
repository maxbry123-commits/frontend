# NODE TEMPLATE (DSL)

```
NODE_ID: Pxx.Nyy
SALIDA: n
LEY: NO code desde 0. Solo source OS fromted/sources|inventory.
     Acción ∈ {descargar_determinista, adaptar, fusionar, conectar, mejorar}.
     CSS ≠ source.
SOURCE:
  repo:
  commit:
  path: fromted/sources/...
  uso:
PLAN_TOKENS:
  1.
  2.
  3.
  4.
  5.
ACCIÓN:
VERIFY:
  [ ] source path existe o solo descarga
  [ ] acción permitida
  [ ] inventory SHA ok si aplica
NEXT:
SHERIFF: FAIL si falta SOURCE o acción ilegal
```

S3b: índice PIPE-01… en TAREAS.
