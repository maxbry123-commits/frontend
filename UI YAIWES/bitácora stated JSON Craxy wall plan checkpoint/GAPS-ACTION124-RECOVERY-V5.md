# GAPS ACTION 124 + RECOVERY DELTA — UI YAIWES

**Run:** https://github.com/maxbry123-commits/frontend/actions/runs/34060401131
**Run ID:** `34060401131`
**Job:** `101559786309`
**Artifact:** `10002484616`
**Artifact digest:** `sha256:680861bb0f9b48dae398ccd56c95add5d44bd0bc45510a9a7cab17a55ee10683`
**Estado:** `completed / cancelled / FAIL_CLOSED`

---

# 1. CONTABILIDAD FORENSE

- queue expected: 124
- attempted before cancellation: 86
- unattempted: 38
- checkpoint JSON produced: 80
- provider gaps without checkpoint: 6
- total `gaps.tsv`: 36
- complete checkpoint shape: 60
- complete checkpoint shape without `gaps.tsv`: 50
- complete checkpoint shape but repair gap: 10
- partial/incomplete checkpoint: 20
- no final 124/124 verification available

**No interpretar 50 o 60 como “componentes VERIFIED_CLOSED”.** Son estados del artifact del writer, no auditoría independiente final.

---

# 2. GAP CLASSES

## C1 — COMPLETE_SHAPE_NO_GAP (50)
Los archivos del checkpoint tienen conteo esperado y estados `VERIFIED_EXISTING/PUBLISHED_READ_BACK`, y el componente no aparece en gaps.tsv.

Acción: auditor read-only independiente sobre destino actual: SOURCE_URL, SOURCE_COMMIT, sums, hashes, license/provenance y tree. Si PASS, clasificar `ACQUISITION_VERIFIED`; eso todavía NO significa `INTEGRATED`.

## C2 — COMPLETE_SHAPE_WITH_REPAIR_GAP (10)
Índices: `1, 4, 7, 11, 52, 58, 64, 65, 68, 80`.

Acción: inspeccionar el motivo exacto del `repair_rc` aunque el checkpoint muestre read-back completo. Repetir solo el gate que falló; no redownload ciego.

## C3 — PARTIAL_CHECKPOINT (20)
Índices: `2, 3, 8, 10, 12, 13, 14, 18, 19, 21, 22, 24, 31, 35, 40, 46, 49, 56, 63, 67`.

Acción: comparar expected_files vs checkpoint files y reanudar únicamente faltantes/`PREPARED`.

## C4 — PROVIDER_GAP (6)
- 66 AVF → android.googlesource.com
- 70 Wayland → gitlab.freedesktop.org
- 71 Weston/libweston → gitlab.freedesktop.org
- 72 Mesa → gitlab.freedesktop.org
- 74 virglrenderer → gitlab.freedesktop.org
- 75 virtiofsd → gitlab.com

Acción: adapter/provider de adquisición específico. El workflow actual bloquea cualquier URL que no comience `https://github.com/`.

## C5 — UNATTEMPTED (38)
- índices 88–124 = 37 entradas;
- Hypothesis index 9 = 1 entrada colocada al final del array.

Acción: queue recovery ordenada por director_index.

## C6 — PROVENANCE_MISMATCH
pytest tiene SOURCE_COMMIT declarado que no explica todo el contenido físico observado.

Acción: encontrar snapshot físico exacto antes de dedup/claim; mantener TEST_ONLY/NOT_WIRED.

---

# 3. 36 ENTRADAS gaps.tsv

1 Stabilize CORE — repair_rc=2
2 Pydantic — repair_rc=2
3 Starlette — repair_rc=2
4 HTTPX — repair_rc=2
7 OpenTelemetry Python — repair_rc=2
8 pytest — repair_rc=2
10 Dagu — repair_rc=2
11 redun — repair_rc=2
12 LibreChat — repair_rc=1
13 big-AGI — repair_rc=1
14 Open WebUI — repair_rc=1
18 Vite — repair_rc=1
19 Vercel AI SDK — repair_rc=1
21 TanStack Query — repair_rc=1
22 React Virtuoso — repair_rc=1
24 shadcn-ui — repair_rc=1
31 XYFlow React Flow — repair_rc=1
35 Lucide — repair_rc=1
40 Uppy — repair_rc=1
46 Supabase — repair_rc=1
49 Qdrant — repair_rc=2
52 Oxigraph — repair_rc=2
56 DuckDB — repair_rc=1
58 PGlite — repair_rc=2
63 workerd — repair_rc=1
64 QEMU — repair_rc=2
65 crosvm — repair_rc=2
66 AVF — SOURCE_PROVIDER_GAP
67 Flutter — repair_rc=1
68 flutter_rust_bridge — repair_rc=2
70 Wayland — SOURCE_PROVIDER_GAP
71 Weston/libweston — SOURCE_PROVIDER_GAP
72 Mesa — SOURCE_PROVIDER_GAP
74 virglrenderer — SOURCE_PROVIDER_GAP
75 virtiofsd — SOURCE_PROVIDER_GAP
80 libdatachannel — repair_rc=2

---

# 4. BUG/DEFICIENCIA DE PREFLIGHT

El preflight verifica `expected_components == 124`, pero no demuestra explícitamente:
- `len(components)==124`;
- índices únicos;
- set exacto `1..124`;
- orden de ejecución por `director_index`;
- provider soportado para todas las URLs.

La QUEUE actual contiene Hypothesis index 9 al final, después de index 124. Aunque el set pueda contener 1..124, el orden físico del array altera la ejecución secuencial.

Patch lógico requerido:
```python
assert q['expected_components'] == 124
assert len(q['components']) == 124
indices=[c['director_index'] for c in q['components']]
assert len(set(indices)) == 124
assert set(indices) == set(range(1,125))
q['components'].sort(key=lambda c:c['director_index'])
```

Además: provider resolver antes del loop largo.

---

# 5. RECOVERY DAG

```text
READ ARTIFACT
  ↓
CLASSIFY 124 ENTRIES
  ├─ C1 audit-only
  ├─ C2 investigate repair_rc
  ├─ C3 resume missing files
  ├─ C4 provider adapter
  ├─ C5 process unattempted
  └─ C6 provenance forensic
  ↓
QUEUE_RECOVERY sorted unique 1..124
  ↓
PROCESS DELTAS
  ↓
GENERATE verify-final even on partial/cancel
  ↓
INDEPENDENT READ-BACK AUDITOR
  ↓
124/124 acquisition PASS?
  ├─ NO → GAP reinjection
  └─ YES → dedup/classify → P01 FRESH
```

---

# 6. 3 SIMULACIONES DE RECOVERY

### S1 — run vuelve a cancelarse en index 103
El artifact debe permitir reanudar 104–124 + cualquier gap anterior. No repetir 1–102 si sus hashes/provenance ya pasan auditoría.

### S2 — provider GitLab falla
No cambiar URL por un mirror no probado. Registrar provider gap, usar adapter GitLab con commit pin, preservar fuente original y verificar hashes.

### S3 — carpeta ya existe pero SOURCE_COMMIT difiere
No overwrite. Comparar canonical id/URL/tree; crear provenance conflict; decidir adopt/supersede/dedup solo con evidencia y rollback.

---

# 7. ACCEPTANCE FINAL ACTION124

Solo cerrar cuando:
1. 124/124 director indices presentes y únicos;
2. 124/124 destination dirs esperados o clasificación explícita autorizada;
3. SOURCE_URL/COMMIT/traces válidos;
4. sums/hash read-back PASS;
5. no unresolved gaps.tsv;
6. provider adapters cubren fuentes reales;
7. independent auditor PASS;
8. no alias conflict sin resolver;
9. artifact final guardado;
10. STATE/CHECKPOINT/PLAN/RECOVERY/BITACORA sincronizados.
