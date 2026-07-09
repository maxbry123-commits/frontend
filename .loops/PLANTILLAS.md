# DSL_LOOPS · Plantillas del frontend NCT

> **Cómo se itera sobre el frontend.** Sistema versionado FRONT-vX.Y.
> Cada vez que se cierra un bloque, Mavis marca PASS y arranca el siguiente.

---

## Convenciones

- **Versión mayor**: cambio de arquitectura (ej v0 → v1)
- **Versión menor**: nueva pantalla (ej v0.1 → v0.2)
- **Estado**: `WIP`, `REVIEW` (esperando Max), `DONE`

## Plantilla de bloque

```yaml
id: MOCK_V0.1
version: 0.1.0
fecha: YYYY-MM-DD
estado: WIP | REVIEW | DONE
descripcion: |
  Qué hace este bloque
entradas:
  - fotos de referencia
  - deps del bloque anterior
salidas:
  - archivos creados en frontend/
  - commit hash
aprobado_por:
  - Max: pending | approved | changes
notas:
  - todo lo que se acuerde
```

## Bloques planeados (en orden)

1. **MOCK_V0.1** · Shell 3 columnas (Sidebar agentes + Centro debate + Right panel)
2. **MOCK_V0.2** · Vista chat con input pill Qwen-style
3. **MOCK_V0.3** · Vista proyectos/lista con thumbnails
4. **MOCK_V0.4** · Dashboard "Crazy Wall" con KPIs
5. **MOCK_V0.5** · Vista selector de modelo (modal)
6. **MOCK_V0.6** · Vista modal "Agregar al chat"
7. **MOCK_V0.7** · Vista sidebar proyectos (crear/eliminar)
8. **MOCK_V0.8** · Vista knowledge base + documentación
9. **MOCK_V0.9** · Vista panel API Health (router multi-key)
10. **MOCK_V1.0** · Dark mode + responsive + deploy CF

## Estados globales

```yaml
proyecto:
  nombre: NCT Frontend
  repo: maxbry123-commits/frontend
  hosting: cloudflare-pages
  tema: dual (light + dark)
  stack: html-css-js vanilla
version_actual: 0.0.0
bloque_actual: MOCK_V0.1
ultimo_commit: pending
deploy_url: pending
