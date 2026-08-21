# METODO DE TRABAJO — PLANTILLA v3 (APROBADA + mejoras OK 2026-07-28)

## 0. Leyes
1. Input literal. Orden → ejecuto.
2. Un objetivo por turno.
3. Razonamiento completo ANTES del plan (Audit×3 → G-IN6 → Refut → Experto9 → Council12 → G-OUT12 → autoanálisis).
4. Cada paso interno registra Resultado; **al usuario en ejecución solo:** `Tarea N terminada` (+ VISUAL-CK si aplica).
5. Detalle de PASO/Resultado → **BITÁCORA**, no al chat de ejecución.
6. Continuidad = TAREAS-EN-CURSO (índice), no memoria del modelo.
7. Micro-lotes: 1 salida = 1–3 tareas del índice (límite Grok).
8. OS determinista: manifest + SHA + inventory.
9. **Cursor rule:** tokens → componente → preview. Nunca app entera en un turno.
10. Ahorro tokens: no re-pegar PARTES; link + ID tarea; un archivo por tarea.
11. **LEY-CODIGO.md:** NUNCA code desde 0. Solo adaptar/fusionar/conectar/mejorar. Sin source materializado → solo descarga determinista.
12. **Cada salida confirmar:** (1) SOURCE+path+trazabilidad+uso (2) no-from-scratch (3) ≤5 líneas plan tokens.
13. **Cada 5 salidas** → BITACORA historial de pasos.
14. Memoria MD: no grabar más reglas de código fuera de LEY-CODIGO.

## Formato salida EJECUCIÓN (usuario)
```
SOURCE: <repo/path/commit> | uso: <adaptar|fusionar|conectar|mejorar|descarga>
no-desde-0: SÍ
Plan tokens (5 líneas):
1. ...
2. ...
3. ...
4. ...
5. ...
Tarea <id> terminada
[VISUAL-CK <id>: preview <url> — responde OK para seguir]
Siguiente: <id>
```

## Formato BITÁCORA (checkpoint)
```
CK-xx | fecha | tareas id-id | DONE|BLOCKED | nota 1 línea | doc/ref
```

## Estilo Cursor (obligatorio cada segmento)
1. Tokens CSS / tipos / contract mínimo
2. Un componente o un archivo
3. Preview Vercel o HTML
4. OK usuario → siguiente ID

## Micro-lote
Salida Grok = ejecutar solo IDs marcados EN EJECUCIÓN en TAREAS. Al cerrar segmento → CK en bitácora.

FIN v3
