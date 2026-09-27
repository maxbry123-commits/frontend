# UI YAIWES — Plan maestro de trabajo frontend

**Estado:** `ACTIVE / RECEPCIÓN → PLANIFICACIÓN`
**Versión:** `1.0.0`
**Fecha:** `2026-09-27`
**Alcance:** frontend de UI YAIWES; el backend solo aparece como frontera de contrato.

> Regla central: **mostrar primero, discutir por pieza, aprobar por ID, integrar después**.

## 1. Cómo trabajaremos

Cada entrega sigue este ciclo:

1. **Recepción:** leer archivo, foto, commit o instrucción; no modificar originales.
2. **Auditoría:** consultar arquitectura, índices, skills, componentes, historial y dependencias.
3. **Ficha:** declarar objetivo, fuente, zonas, estados, acciones, datos y límites.
4. **Canvas:** construir una muestra local, pequeña y reversible.
5. **Revisión:** explicar qué es real, qué es stub y qué queda fuera.
6. **Aprobación:** recibir `OK <ID>` o registrar cambios solicitados.
7. **Integración:** cablear la pieza aprobada con HostShell, WindowRegistry, StateStore y Action Bus.
8. **Verificación:** revisar visual, accesibilidad, responsive, manifest y trazabilidad.
9. **Handoff:** actualizar `CRAZY-WALL-BITACORA-STATE.json`, `HANDOFF-...json` y `memoria.md`.

No se construye una aplicación monolítica ni se integran varias ventanas sin revisión intermedia.

## 2. Fuentes que se consultan antes de cada pieza

### Arquitectura y contrato

- `readme arquitectura UI YAIWES interface beta/README.md`.
- `HANDOFF-FRONTEND-UI-YAIWES-2026-09-27.md`.
- `ARQUITECTURA-FRONTEND-UI-YAIWES-V1.md`.
- `actualizaciones arquitectura/`.
- `Ui Yaiwes interface beta/02-fromted/INDEX.json`.
- Fichas de ventana y `HOST.html`.

### Referencias visuales

- `01-original/FOTOS-REF/`.
- `Run.html` y demás ventanas originales.
- Índices de fotografías y descripciones.

Las fotos son referencia de composición, densidad y jerarquía; no son contrato funcional.

### Fábrica y skills

Se consulta el índice de fábrica adjunto y el catálogo en:

- `fabrica de UI INTERFACE fromtend/`.
- `📂componentes open soure fromtend/`.
- `Skills arquitectura frontend Yaiwes/`.
- `UI YAIWES interface/fabrica-ui/runtime/`.

La lista de componentes se trata como catálogo de candidatos, no como permiso para instalar todo. Cada componente debe tener una ficha de procedencia, licencia, referencia, hash/versión, función y estado.

## 3. Arquitectura de ejecución

```text
Usuario
  ↓
Panel A / Panel B
  ↓
WindowRenderer / CanvasOrchestrator
  ↓
UI Contract
  ↓
Action Bus
  ↓
Bridge
  ↓
Backend (solo frontera)
  ↓
Eventos / resultados
  ↓
StateStore → Canvas / Window
```

### Núcleo frontend

- `HostShell`: chrome, rail, topbar, canvas e inspector.
- `WindowRegistry`: registro canónico de las 39 ventanas.
- `StateStore`: estado visual y local, sin duplicar memoria backend.
- `Action Bus`: única salida de acciones de UI; fail-closed.
- `Manifest Schema`: valida antes de pintar.
- `CanvasOrchestrator`: abrir, enfocar, actualizar y cerrar ventanas.
- `CapabilityProjector`: mostrar capacidades registradas.

### Backend fuera de alcance

No implementar aquí proveedores, router de modelos, memoria interna, scheduler, secretos, pools, orquestación ni lógica de agentes. El frontend solo envía acciones tipadas y representa resultados recibidos.

## 4. Orden de construcción por capas

### Fase 0 — Gobierno y seguridad

- congelar originales;
- establecer `no tocar`;
- usar IDs y manifests;
- activar bitácora, memoria y handoff;
- definir criterios de aprobación.

### Fase 1 — HostShell mínimo

- rail;
- topbar;
- canvas;
- inspector;
- footer de estado;
- tokens Matte/Little/Blanco;
- responsive básico.

### Fase 2 — Registro y contratos

- `WindowRegistry`;
- `Manifest Schema`;
- `StateStore` local;
- `Action Bus`;
- logger de eventos;
- render seguro de ventanas.

### Fase 3 — Primer vertical slice

Orden recomendado:

1. `RUN-01` CASCADE.
2. `RUN-08` inspector de nodo/input/output.
3. `RUN-03` AUDITOR.
4. `WALL-01` bloques.
5. `WALL-02` árbol.
6. `WALL-03` archivos.
7. `GBOT-01` cáscara conversacional.
8. ventanas FOTO como referencias y no como duplicados.

### Fase 4 — Componentes de la fábrica

Usar solo cuando la pieza lo justifique:

- `dockview`: split/tabs del Host.
- `lucide`: iconos.
- `assistant-ui`: thread/composer.
- `xyflow`: DAG/workflow.
- `tldraw`: Crazy Wall libre.
- `TanStack Table`: tablas grandes.
- `Monaco` o `CodeMirror`: código/YAML.
- `Dexie`: persistencia local posterior.
- `i18next`: idiomas.
- `axe-core`, Playwright y Vitest: verificación.

El uso de cada componente se registra en la bitácora antes del montaje.

### Fase 5 — Pulido

- accesibilidad;
- keyboard navigation;
- densidad;
- responsive;
- performance;
- motion solo con propósito;
- cristal/holográfico como material opcional, nunca como sustituto de contraste.

## 5. Paleta y dirección visual

### Matte base

- fondo `#0a0a0d`;
- surface `#141417`;
- panel `#1a1a1e`;
- card `#202025`;
- líneas `#2a2a33` y `#3f3f4e`;
- texto blanco y grises;
- Little azul `#2563eb` para selección, foco y estados;
- naranja `#ff5500` solo para Cargar/Descargar.

La versión holográfica usa transparencias blancas/azules de baja opacidad, blur con fallback sólido y glow azul reducido. No usar lima, neon verde ni morado como marca.

## 6. Qué se muestra en cada canvas

Cada canvas debe explicar:

- ID y objetivo;
- fuente visual y fuente de arquitectura;
- componentes usados;
- zona de interacción;
- estados disponibles;
- acciones simuladas o reales;
- datos de ejemplo;
- frontera backend;
- decisión que el usuario debe aprobar.

## 7. Estados estándar

`idle`, `selected`, `queued`, `running`, `done`, `failed`, `blocked`, `review`, `verified`.

Siempre comunicar el estado con texto, estructura e icono además de color.

## 8. Criterios de aceptación de una pieza

- no modifica originales;
- tiene ID único;
- tiene ficha y manifest válido;
- usa componentes existentes o justifica uno nuevo;
- no duplica HostShell, Action Bus o StateStore;
- tiene interacción local demostrable;
- funciona en pantalla pequeña y grande;
- tiene foco y etiquetas accesibles;
- registra eventos importantes;
- tiene handoff para otra IA;
- recibe `OK <ID>` antes de integrarse.

## 9. Cómo participa otro equipo o IA

El equipo entrante debe leer, en este orden:

1. este plan;
2. `CRAZY-WALL-BITACORA-STATE.json`;
3. `HANDOFF-FRONTEND-UI-YAIWES.json`;
4. `memoria.md`;
5. la ficha de la ventana asignada;
6. las fuentes y componentes indicados en el handoff.

Debe actualizar primero el handoff y la bitácora antes de modificar código. Si existe una contradicción, debe marcar `BLOCKED` y no inventar una decisión.

## 10. Primer trabajo recomendado

Empezamos con **`RUN-01 / CASCADE`**, no con las 39 ventanas a la vez:

1. aprobar Modelo A Matte como base;
2. separar su vista en HostShell, canvas, inspector y eventos;
3. validar manifest de `RUN-01`;
4. demostrar selección de nodo y dispatch local;
5. revisar responsive y accesibilidad;
6. obtener `OK RUN-01`;
7. recién entonces integrar la siguiente pieza.

## 11. Estado inicial

- Plan maestro: `ACTIVE`.
- Originales: `LOCKED / no tocar`.
- Prototipo visual: `REVIEW`.
- Primer ID: `RUN-01`.
- Backend: `BOUNDARY ONLY`.
- Próxima decisión: aprobar dirección Matte / Holographic / Little.
