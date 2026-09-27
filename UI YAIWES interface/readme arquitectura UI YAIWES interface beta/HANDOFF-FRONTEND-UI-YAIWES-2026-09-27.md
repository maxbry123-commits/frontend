# HANDOFF — Frontend UI YAIWES interface

Fecha: 2026-09-27  
Repo: `maxbry123-commits/frontend`  
Branch: `main`  
Scope: **FRONTEND ONLY**

## Punto de entrada

README arquitectura:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES%20interface/readme%20arquitectura%20UI%20YAIWES%20interface%20beta/README.md

Arquitectura frontend consolidada:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES%20interface/readme%20arquitectura%20UI%20YAIWES%20interface%20beta/ARQUITECTURA-FRONTEND-UI-YAIWES-V1.md

## Tres archivos nuevos leídos

1. Sistema de componentes/plugins de fábrica:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES%20interface/readme%20arquitectura%20UI%20YAIWES%20interface%20beta/actualizaciones%20arquitectura/sistema%20de%20componente%20tipo%20plugins%20para%20la%20f%C3%A1brica%20y%20yaiwes%F0%9F%9A%80%F0%9F%86%98%F0%9F%86%98con%20los%20componentes%20necesarios%20y%20como%20funciona%F0%9F%93%B2no%20tocar%20%E2%9A%A0%EF%B8%8F.md

2. Arquitectura completa backend + frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES%20interface/readme%20arquitectura%20UI%20YAIWES%20interface%20beta/actualizaciones%20arquitectura/%F0%9F%93%B2%F0%9F%93%8C%F0%9F%9A%80%F0%9F%93%B2%F0%9F%93%B2%20UI%20YAIWES%20INTERFACE%20VERSI%C3%93N%201.0%20FINAL%20%F0%9F%93%8C%F0%9F%9A%80%F0%9F%93%B2%20Con%20backend%20frontend%20y%20URL%20visible%20...a%20y%20dise%C3%B1o%20para%20backend%20y%20frontend%20todo%20%E2%9B%94no%20tocar%20%F0%9F%94%A8%F0%9F%93%8C.md

3. Plan ejecutable frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES%20interface/readme%20arquitectura%20UI%20YAIWES%20interface%20beta/actualizaciones%20arquitectura/%F0%9F%93%B2%F0%9F%93%B2%20UI%20YAIWES.%20fromtend%20plan%20de%20ejecuci%C3%B3n%20todo%20%20no%20tocar.md

Los tres archivos fuente quedan intactos. Este handoff no los reescribe.

## Qué se consolidó para frontend

- núcleo HTML/CSS/JS + manifiestos + tokens FROMTED;
- HostShell / `HOST.html`;
- `INDEX.json` + WindowRegistry;
- StateStore y router de paneles;
- Action Bus;
- bridge UI ↔ backend como frontera contractual;
- Panel A Command Center;
- Panel B Conversation & Canvas;
- CanvasOrchestrator + WindowRenderer + CanvasCore;
- chat y voz;
- CapabilityProjector;
- persistencia local, offline y CRDT;
- empaquetado PWA/Tauri/Capacitor;
- accesibilidad;
- i18n;
- Design System;
- QA frontend y pruebas E2E.

No se incorporan como tareas frontend:
- router de proveedores/modelos;
- scheduler del backend;
- memoria del backend;
- transformación Harness/Tool/Pool/Workflow;
- lógica interna de agentes;
- secretos/proveedores;
- orquestación interna.

## Estado físico ya existente

Ventanas FROMTED:
`UI YAIWES interface/Ui Yaiwes interface beta/02-fromted/`

Host:
`UI YAIWES interface/Ui Yaiwes interface beta/02-fromted/HOST.html`

Índice:
`UI YAIWES interface/Ui Yaiwes interface beta/02-fromted/INDEX.json`

Originales/fotos:
`UI YAIWES interface/Ui Yaiwes interface beta/01-original/`

## Evidencias visuales

Parte 1:
https://github.com/maxbry123-commits/frontend/commit/13f4e932866284fb5ddfaaf6ada5ce4809f82f46

Parte 2:
https://github.com/maxbry123-commits/frontend/commit/c50fc98d19debe1a85817cf1129b55a99c895c9f

Parte 3:
https://github.com/maxbry123-commits/frontend/commit/430809bd98c614435ad7597493ed46c16d6552a3

Nota: parte 1 se subió bajo `01-original/FOTOS-REF/`; partes 2 y 3 fueron cargadas mediante commits separados y se mantienen enlazadas como evidencia.

## Arquitectura operativa

`USUARIO -> PANEL A/B -> CONTRATO UI -> ACTION BUS -> BRIDGE -> BACKEND -> EVENTO/RESULTADO -> CANVAS/WINDOW`

El backend no se modifica desde este handoff.

## Orden de ejecución frontend

1. Fundación: contratos UI + HostShell + Registry + Store + Action Bus.
2. Panel A: observabilidad/operación visual.
3. Panel B: conversación + canvas + ventanas.
4. Cliente avanzado: voz + offline + persistencia + CRDT + dispositivos.
5. Empaque/cierre: PWA + desktop + móvil + a11y + i18n + Design System + QA.

## Conteo

Los documentos fuente declaran 5 salidas:
- 11 nodos;
- 10 nodos;
- 12 nodos;
- 10 nodos;
- 12 nodos.

Total matemático: **55 nodos**, no 45. La arquitectura consolidada usa 55 como cuenta correcta.

## Reglas de continuidad

- No tocar los tres archivos fuente marcados `no tocar`.
- No mover las fotos originales durante implementación.
- No inventar ventanas que ya existan.
- Reutilizar las 39 ventanas antes de crear otras.
- No mezclar tareas backend dentro del backlog frontend.
- Cada integración frontend debe terminar en wiring + test + evidencia.
- El README principal y esta arquitectura consolidada son los puntos de entrada para la siguiente sesión.

## Flujo de continuidad

`README -> ARQUITECTURA FRONTEND V1 -> FUENTES -> FOTOS -> IMPLEMENTACIÓN -> QA -> EVIDENCIA -> HANDOFF`
