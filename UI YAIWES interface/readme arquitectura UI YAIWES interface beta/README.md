# Arquitectura UI YAIWES interface · beta

Repo: [maxbry123-commits/frontend](https://github.com/maxbry123-commits/frontend) · branch `main`  
Raíz viva: `UI YAIWES interface/`  
Skill padre: `Skills arquitectura frontend Yaiwes/`

**Aprobado 2026-09-08:** anotar primero. **No fabricar las 39** hasta `OK` por ID.  
**5 partes.** Una ventana por salida.

## Tokens FROMTED (ley)

| Token | Valor | Uso |
|-------|--------|-----|
| Matte bg | `#000000` / `#0a0a0d` / `#141417` | superficie |
| Little | `#2563eb` | selección / acento UI |
| Blanco | `#ffffff` | texto primario |
| Naranja | `#ff5500` | **solo Cargar / Descargar** |

Fotos HUD naranja (Anthropic/grafos) = referencia de **layout**, no paleta.

## Cuenta 39 (forense, 16 pasadas)

| Grupo | N | Source HTML | Estado |
|-------|---|-------------|--------|
| Fotos lote | 14 (+1 dup Marte) | NO | motivos, no ventanas |
| Grok Bot | 1 | NO (app x.ai/bot) | réplica-cáscara |
| Run.html | 8 | SÍ | partir 1:1 |
| Crazy Wall v4 | 16 | SÍ | partir + simplificar |
| **Suma** | **39** | **24 con HTML** | |

**Fuera de los 39 (archivos extra):** mini-anim agentes (20), anim estados (12), fondos animados, pensamiento.

## 5 partes (orden aprobado)

1. **P1 Run 8** — HTML tuyo, cero invención. IDs `RUN-01`…`RUN-08`.
2. **P2 Crazy Wall 16** — HTML tuyo, menos fricción. IDs `WALL-01`…`WALL-16`.
3. **P3 Grok Bot 1** — cáscara FROMTED, no binario xAI. ID `GBOT-01`.
4. **P4 14 fotos** — motivos metidos en ventanas ya aprobadas. No 14 apps.
5. **P5 Anims** — archivos aparte, se enchufan. No van pegados.

## Método anti-alucinación

1. Tú subes HTML / zip / foto.  
2. `01-original/` = **idéntico**, sin tocar.  
3. `02-fromted/` = el mismo, **solo colores/estética FROMTED**.  
4. Te muestro original vs FROMTED.  
5. Tú `OK <ID>`.  
6. Entonces GitHub + foto + línea README + Crazy Wall `state.json`.  
7. **1 ID por mensaje** (máx 2 si lo pides).

Si no hay archivo subido → **no invento** esa ventana.

## Cableado

- Fábrica UI (interna, 0 fricción, usuario no entra): `Skills arquitectura frontend Yaiwes/fabrica-ui-interface/`
- Biblioteca FE: `Skills arquitectura frontend Yaiwes/biblioteca code frontend Maxbry Yaiwes/`
- Biblioteca BE: `Skills arquitectura frontend Yaiwes/biblioteca-backend/`
- Este proyecto UI: `UI YAIWES interface/`

## Run 8

| ID | Ventana |
|----|---------|
| RUN-01 | CASCADE |
| RUN-02 | TREN |
| RUN-03 | AUDITOR |
| RUN-04 | VENTANAS V-01…V-04 |
| RUN-05 | ORQUESTA |
| RUN-06 | panel Sandbox |
| RUN-07 | panel Codigo YAML |
| RUN-08 | panel nodo / input / out |

## Crazy Wall 16

| ID | Superficie |
|----|------------|
| WALL-01 | Tab Bloques |
| WALL-02 | Tab Árbol |
| WALL-03 | Tab Archivos |
| WALL-04 | Modo Preguntar |
| WALL-05 | Modo Tap archivo |
| WALL-06 | Modo Tap bloque |
| WALL-07 | 6 raíces |
| WALL-08 | Grid bloques (`00`–`25` = **26** claves; UI dice 25, off-by-one) |
| WALL-09 | Lista archivos |
| WALL-10 | Sheet bloque |
| WALL-11 | Sheet archivo |
| WALL-12 | Sheet raíz |
| WALL-13 | Sheet extra |
| WALL-14 | Añadir raíz |
| WALL-15 | Barra Guardar / Share |
| WALL-16 | `state.json` bitácora |

## IDs aprobados para fabricar

**Ninguno.** Aprobado: método + carpeta + 5 partes + conteo 39.

Siguiente: `1 CASCADE` o `OK RUN-01`.


## 39 ventanas SUBIDAS (2026-09-09)

Carpeta: `Ui Yaiwes interface beta/02-fromted/` (39 HTML + HOST).
Fichas: `02-fromted/FICHAS/<ID>.json`.
Índice: `02-fromted/INDEX.json`.
Host Lego: `02-fromted/HOST.html`.
Plan: `PLAN-39-Y-FABRICA.md`.
Fábrica DAG: `fabrica de UI INTERFACE fromtend/componentes para fabrica de interface/PLAN-DAG-DETERMINISTA.json`.
Seguridad: `UI YAIWES interface/seguridad/`.
Empaque: `UI YAIWES interface/empaque/`.

Estado: **SUBIDO-FROMTED-SPLIT**. `03-producto` vacío hasta `OK <ID>`.
Original intacto en `01-original/`.
