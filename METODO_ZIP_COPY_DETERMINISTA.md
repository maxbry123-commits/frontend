# METODO_ZIP_COPY_DETERMINISTA

**Método de trabajo obligatorio** para Grok / GPT / cualquier AI al copiar desde ZIP a repos GitHub **sin reescribir** el contenido, con verificación cruzada y raíz organizada.

**Fuente canónica:** https://github.com/maxbry123-commits/agentes/blob/main/METODO_ZIP_COPY_DETERMINISTA.md  
**Repo:** frontend

---

## 0. Principio fijo (fail-closed)

```text
ZIP bytes  →  extract (sin modificar)  →  blob/content exacto  →  commit  →  verify SHA/content
```

- **Nunca** regenerar, formatear ni “mejorar” el texto.
- Si el hash del archivo en destino ≠ hash del ZIP → **FAIL**.
- Token solo por ref (`env:` / `secret://`). Nunca PAT en claro.
- Sin force-push. Usar `expected_head` cuando exista.

---

## 1. Diez maneras de copiar sin reescribir

| # | Método | Cuándo |
|---|--------|--------|
| 1 | Local unzip + git | Máquina local |
| 2 | GitHub Actions unzip + commit | CI |
| 3 | Contents API PUT | 1 archivo ≤ 1 MB |
| 4 | **Git Data API** blob→tree→commit→ref | Multi-archivo (recomendado AI) |
| 5 | zip-deployer | ZIP completo |
| 6 | PyGithub / ghapi / Octokit | Scripts |
| 7 | gh CLI | Terminal |
| 8 | curl + base64 | Mínimo |
| 9 | Clone vacío + unzip + push | Repo limpio |
| 10 | Marketplace Unzip Action | Solo CI |

---

## 2. Schema (orden fijo)

EXTRACT → MANIFEST (path+sha256) → RESOLVE TOKEN → GET HEAD → WRITE (Git Data) → VERIFY sha256 → EVIDENCE

---

## 3. Verificación cruzada

Por cada archivo del ZIP: `sha256(content_destino) == sha256(content_zip)`. Si no → FAIL.

---

## 4. Sin romper código

Bytes exactos del ZIP. No pretty-print. Tras write → verify_file. Paths protegidos → HOLD.

---

## 5. Raíz main (paralelo)

```text
apps/  packages/  tools/  docs/  .github/  CODEOWNERS
```

---

## 6. Checklist PASS

Manifest · token por ref · expected_head · commit sin force · paths existen · sha256 match · evidence · no protected · dry_run primero.

**Una línea:** Extrae bytes del ZIP → blobs → un commit → ref → verifica sha256. Si no coincide, FAIL.
