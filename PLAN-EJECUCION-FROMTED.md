# PLAN DE EJECUCIÓN FROMTED

Fecha: 2026-07-28 17:50 -05  
Método: METODO-TRABAJO-PLANTILLA-v3  
Fuente docs: PARTE-1…7 + 7B + paneles p01–p10 + v3 themes

---

## Estrategia (ahorro tokens + tiempo)

1. **Cursor loop en cada tarea UI:** tokens → 1 componente → preview → OK.  
2. **Copy OS** (assistant-ui, dockview, i18next, lucide) vía manifest; no reescribir chat/dock.  
3. **Retintar** HTML p01–p10 a warm; no rediseñar layout.  
4. **1 salida Grok = 1–3 IDs**; usuario responde solo OK.  
5. **Usuario ve:** `Tareas terminadas: x,y | Siguiente: z`. Detalle CK solo bitácora.  
6. **VISUAL-CK** bloquea fase siguiente hasta OK preview Vercel.  
7. Archivo **uno a uno**; sin PRs masivos.

---

## Estimación global

| Métrica | Valor aprox |
|---------|-------------|
| Total salidas (micro-lotes) | **42** |
| Horas ejecución (agente+preview) | **18–26 h** |
| LOC producto (UI FROMTED, sin node_modules) | **4.5k–7k** |
| LOC extra si wire OpenClaw+tools | **+1.5k–2.5k** |
| VISUAL-CK Vercel | **8** |
| Fases | I0…I5 + CLOSE |

---

## Índice de salidas y tareas

Leyenda: **S-nn** = una salida/chat cycle | tareas = IDs | al cerrar S → CK bitácora | Cursor = tokens→comp→preview

### FASE I0 — Fundación (repo, tokens, i18n, shell)
| Salida | Tareas | Contenido | Cursor | Preview |
|--------|--------|-----------|--------|--------|
| S-01 | I0-01 I0-02 | Repo `fromted/` scaffold Vite React TS + estructura carpetas | tokens base | — |
| S-02 | I0-03 I0-04 | `manifest.sources.json` oleada1 + Action determinista | — | — |
| S-03 | I0-05 | RUN install sources → inventory.json | — | — |
| S-04 | I0-06 I0-07 | `tokens.css` warm + data-theme/title/chat | tokens | — |
| S-05 | I0-08 | ThemeSwitcher + i18n skeleton 4 locales | tokens→comp | — |
| S-06 | I0-09 | App shell layout (sidebar slot + main) | comp | — |
| S-07 | I0-10 | **VISUAL-CK-1** deploy Vercel shell+theme | preview | **SÍ** |

**CK-I0** bitácora al cerrar S-07.

### FASE I1 — Chat + UICommand
| Salida | Tareas | Contenido | Cursor | Preview |
|--------|--------|-----------|--------|--------|
| S-08 | I1-01 | Wire assistant-ui stream mínimo | tokens→comp | — |
| S-09 | I1-02 | Stop + historial local stub | comp | — |
| S-10 | I1-03 I1-04 | UICommand types + Router | tokens→comp | — |
| S-11 | I1-05 | Capacidades sheet toggles → commands | comp | — |
| S-12 | I1-06 | Composer MiniMax-style (retinte p01) | tokens→comp | — |
| S-13 | I1-07 | **VISUAL-CK-2** chat usable | preview | **SÍ** |

**CK-I1** al cerrar S-13.

### FASE I2 — Files, Artifact, Paralelas
| Salida | Tareas | Contenido | Cursor | Preview |
|--------|--------|-----------|--------|--------|
| S-14 | I2-01 | Files móvil (p02 warm) | tokens→comp | — |
| S-15 | I2-02 | Files iPad split (p03) | comp | — |
| S-16 | I2-03 | Artifact list + host (p08) | tokens→comp | — |
| S-17 | I2-04 I2-05 | TaskManager + cola max20 | tokens→comp | — |
| S-18 | I2-06 | Panel Paralelas drawer | comp | — |
| S-19 | I2-07 | Resource Governor básico | comp | — |
| S-20 | I2-08 | **VISUAL-CK-3** files+artifact+paralelas | preview | **SÍ** |

**CK-I2** al cerrar S-20.

### FASE I3 — Integraciones (nativas chrome FROMTED)
| Salida | Tareas | Contenido | Cursor | Preview |
|--------|--------|-----------|--------|---------|
| S-21 | I3-01 | YoutubePanel IFrame API | tokens→comp | — |
| S-22 | I3-02 | Search tool client → Perplexica/MCP stub | comp | — |
| S-23 | I3-03 | Search results artifact UI | tokens→comp | — |
| S-24 | I3-04 | Telegram tool + panel Conectores row | comp | — |
| S-25 | I3-05 | Gmail OAuth tool stub | comp | — |
| S-26 | I3-06 | WhatsApp Cloud tool stub | comp | — |
| S-27 | I3-07 | CallPanel Telnyx stub | tokens→comp | — |
| S-28 | I3-08 | **VISUAL-CK-4** paneles integraciones | preview | **SÍ** |

**CK-I3** al cerrar S-28.

### FASE I4 — Local + Cloud adapters + memoria device
| Salida | Tareas | Contenido | Cursor | Preview |
|--------|--------|-----------|--------|--------|
| S-29 | I4-01 | SettingsPort + theme/locale persist IDB | tokens→comp | — |
| S-30 | I4-02 | OPFS file adapter básico | comp | — |
| S-31 | I4-03 | Memory API stub store/load/search local | tokens→comp | — |
| S-32 | I4-04 | CloudAdapter WS/SSE stub | comp | — |
| S-33 | I4-05 | Feature flag local\|cloud | comp | — |
| S-34 | I4-06 | **VISUAL-CK-5** persistencia theme+chat refresh | preview | **SÍ** |

**CK-I4** al cerrar S-34.

### FASE I5 — OpenClaw + Config Apariencia + cierre
| Salida | Tareas | Contenido | Cursor | Preview |
|--------|--------|-----------|--------|--------|
| S-35 | I5-01 | Configuración → Apariencia (temas/títulos/chat colors) | tokens→comp | — |
| S-36 | I5-02 | Configuración → Idioma 4 locales | comp | — |
| S-37 | I5-03 | OpenClaw → UICommand bridge | tokens→comp | — |
| S-38 | I5-04 | Voice STT stub → command | comp | — |
| S-39 | I5-05 | **VISUAL-CK-6** config+agente command | preview | **SÍ** |
| S-40 | I5-06 | PWA manifest + sw mínimo | tokens→comp | — |
| S-41 | I5-07 | **VISUAL-CK-7** install PWA smoke | preview | **SÍ** |
| S-42 | I5-08 | **VISUAL-CK-8** checklist 61-funciones mapa parcial + CLOSE | preview | **SÍ** |

**CK-I5** + **CK-CLOSE** al cerrar S-42.

---

## Integraciones cubiertas en plan

i18n 4 · themes warm · UICommand · chat stream · files móvil/iPad · artifact · paralelo 20 · YT · search Perplexica · Telegram · Gmail · WhatsApp Cloud · Call Telnyx · IDB/OPFS memoria device · CloudAdapter · OpenClaw bridge · PWA · Vercel previews

---

## Cómo ejecutar una salida (estrategia)

1. Leer TAREAS-EN-CURSO (solo bloque EN EJECUCIÓN).  
2. Cursor: definir tokens necesarios → implementar **un** componente/archivo → commit.  
3. Si la salida tiene Preview: deploy y poner URL.  
4. Usuario: `Tareas terminadas: … | Siguiente: …`.  
5. Bitácora: CK solo al **cerrar segmento** (fin de fase o VISUAL-CK).  
6. Esperar OK.

---

## Fuera de este plan (no mezclar)
VPS Oracle · motor Graphiti/Obsidian 90% · fine-tune modelos · backend full producción

FIN PLAN
