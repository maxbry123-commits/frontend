# LEY-Y-METODO — FROMTED

Actualizado: 2026-07-28 22:17 -05  
Doc separado. No es índice de tareas. No es código de app.

---

## 1. LEY (inmutable — se repite en cada nodo)

### Prohibido
1. Escribir código de aplicación **desde 0**.
2. Inventar chat/runtime/mensajes/orquestación sin base OS.
3. Programar UI si `fromted/sources/<id>/` no tiene **archivos reales**.
4. Tratar **CSS** como código fuente.
5. Cambiar URL/rama/commit del manifest sin orden.
6. Usar main/master si hay **commit SHA** en inventory.
7. Resolver conflictos a criterio; fallo descarga → STOP + error exacto.
8. Mezclar diseño pipeline + code app + investigación abierta en la misma salida.

### Obligatorio
1. Acciones solo: `descargar_determinista` | `adaptar` | `fusionar` | `conectar` | `mejorar`.
2. Cada nodo/salida declara **SOURCE** (repo, commit, path, uso).
3. Releer: `TAREAS-EN-CURSO` + `BITACORA-RESUMEN` + este + `inventory.json`.
4. Sin source materializado → solo descarga; no UI.
5. Preview (Vercel) antes de cerrar tarea visual.

### Texto fijo nodo
> LEY: NO code desde 0. Solo source OS en fromted/sources|inventory.  
> Acción ∈ {descargar_determinista, adaptar, fusionar, conectar, mejorar}. CSS ≠ source.

---

## 2. MANUAL DESCARGA DETERMINISTA

### Wave 1 (YA materializado 2026-07-29 — no repetir si paths OK)

| id | url | commit | path |
|----|-----|--------|------|
| assistant-ui | https://github.com/assistant-ui/assistant-ui | b361de28783a7fa094910b5152684421e701ca80 | fromted/sources/assistant-ui |
| lucide | https://github.com/lucide-icons/lucide | 4aec3f892fd6c23063bc2fead83c899b5d412b1c | fromted/sources/lucide |
| dockview | https://github.com/mathuo/dockview | 3a47321bf7b7d5e6b981a15f6a06c49adb2fdde5 | fromted/sources/dockview |
| i18next | https://github.com/i18next/i18next | e1c60d4dd28a16f91be7f55b3685ffcf9760619b | fromted/sources/i18next |
| react-i18next | https://github.com/i18next/react-i18next | 274e2e60785514388495466137c195c72d6749fb | fromted/sources/react-i18next |

Verdad: `manifest.sources.json` + `inventory.json`.

### Pasos fijos (wave2+ o re-materializar)
1. Leer manifest.sources.json  
2. Clone URL oficial (sparse si aplica)  
3. Checkout commit pin  
4. Verificar HEAD == pin  
5. Borrar `.git` del clone  
6. Actualizar inventory.json  
7. Commit+push trabajo-grok  
8. FAIL → STOP `FAILED|repo|paso|error`

### Ejecutor
`.github/workflows/fromted-sources.yml` — workflow_dispatch o push manifest.  
No VPS. No sandbox Grok para clone masivo.

---

## 3. GITHUB / VERCEL
- Repo: `maxbry123-commits/trabajo-grok`
- App: `fromted/` | Sources: `fromted/sources/`
- Preview: https://fromted.vercel.app (Vite+React)

---

## 4. INVESTIGACIÓN (solo si falta source)
1. README/docs oficiales  
2. Reddit/HN/SO/Discussions/DEV (ventana corta)  
3. Solo repos oficiales manifest/gap  
4. No sustituir sin nodo  
5. Resultado → manifest+inventory+TAREAS; **no** code app misma salida

---

## 5. RAZONAMIENTO (solo diseño/gaps — no code app)
1 Audit×3 → 2 G-IN6 → 3 Refutación → 4 Experto/Council → 5 G-OUT12 → 6 Autoanálisis no-desde-0

---

## 6. CURSOR / FORMATO SALIDA
Plan ≤5 líneas · un scope · verify explícito  
```
SOURCE: repo|commit|path|uso
no-desde-0: SÍ
Plan: 1..5
Tarea id terminada | VISUAL-CK | Siguiente
```

---

## 7. BITÁCORA
`BITACORA-RESUMEN.md` — al cerrar tarea completa; cada 5 salidas batch.

---

## 8. SCHEMA NODO
NODE_ID | LEY | SOURCE | PLAN_TOKENS | ACCIÓN | VERIFY | NEXT | SHERIFF

---

## 9. LECTURA
1 LEY-Y-METODO → 2 TAREAS → 3 inventory/manifest → 4 BITACORA → 5 PIPE activo

FIN
