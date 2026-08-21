# PROYECTO FROMTED — PASO 1

Fecha: 2026-07-27  
Estado: EN CURSO  
Depende de: `PROYECTO-FROMTED.md` (CERRADO / aprobado)

---

## Objetivo del paso

1. Investigar ≥20 repos open source alineados al wireframe de FROMTED.
2. Construir manifest determinista (`url + commit + paths[]` sparse).
3. Ejecutar download determinista → `fromted/sources/` + `inventory.json`.

Al cerrar este paso → abrir PASO 2 (diseño visual / imágenes).

---

## Estrategia sources mejorada (exacta)

Misma lógica que descarga de agentes, optimizada para UI:

| Mejora | Acción |
|--------|--------|
| Sparse checkout | Solo carpetas útiles (`src/components`, `packages/ui`, etc.) |
| Manifest por path | Cada entrada: `url + commit + paths[]` — no clonar basura |
| Idempotencia | Si `inventory.json` ya tiene el SHA → skip |
| Copia selectiva | De `sources/X` a `src/` solo archivos a usar |
| Paralelo Actions | Varios clones en un workflow |
| Prioridad módulos | Primero shell + chat + selector; resto después |
| Prohibir reescribir | Si existe en `sources/`, se adapta; no se genera de nuevo |
| Un objetivo por turno | No mezclar investigación con diseño final ni con build |

Estructura objetivo:

```
fromted/
├── sources/          # clones read-only (vendor)
├── src/              # código adaptado (vacío en PASO 1)
└── inventory.json    # url, commit, paths, fecha, estado
```

Pipeline: LOAD manifest → CLONE sparse → CHECKOUT SHA → COPY paths → VERIFY → inventory.json → FINISH.

---

## Áreas mínimas de investigación (≥20)

1. Chat UI open source (streaming, multi-model)
2. Connector / integrations panel
3. Kanban / workflow canvas (React Flow, n8n UI patterns)
4. File browser iOS-like
5. Plugin/skill directory
6. Sandbox WASM / Pyodide / WebContainers
7. Multi-agent chat UI
8. Dark minimal design systems
9. Capacitor / Tauri wrappers
10. LiteLLM UI o proxies
11. Graph visualization
12. Obsidian-like panes
13. Auth + secrets UX
14. Voice input/output web
15. Artifact / markdown editors
16. Tagging + search historial
17. Interruptible streaming clients
18. Model selector components
19. MCP client UIs
20. PWA offline shells

---

## Qué NO hacer en PASO 1

- No imágenes de diseño finales (eso es PASO 2).
- No editar/fusionar código de producto todavía.
- No plan bilingüe de construcción completo (después de sources + visual).
- No mezclar con T1 VPS salvo bloqueo real.

---

## Criterio de cierre PASO 1

- [ ] ≥20 repos revisados documentados (nombre, url, por qué sirve a qué módulo)
- [ ] Manifest determinista escrito
- [ ] Sources descargados o listos para RUN INSTALL
- [ ] inventory.json con SHAs
- [ ] Entrada en bitácora: PASO 1 cerrado → abrir PASO 2

---

## Siguiente

`PROYECTO-FROMTED-PASO-2.md` = diseño visual / imágenes sobre sources ya conocidos.
