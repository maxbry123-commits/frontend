# Readme arquitectura frontend yaiwes

Bitácora viva del skill de arquitectura frontend YAIWES.  
Repo: https://github.com/maxbry123-commits/frontend  
Rama: `main`  
Carpeta: `Skills arquitectura frontend Yaiwes/`  
Este archivo: `Skills arquitectura frontend Yaiwes/Readme arquitectura frontend yaiwes.md`

Enlace directo de este README:

https://github.com/maxbry123-commits/frontend/blob/main/Skills%20arquitectura%20frontend%20Yaiwes/Readme%20arquitectura%20frontend%20yaiwes.md

Enlace de la carpeta:

https://github.com/maxbry123-commits/frontend/tree/main/Skills%20arquitectura%20frontend%20Yaiwes

Validación de esta salida (2026-09-07): este archivo se creó en `main` y contiene las instrucciones 1 a 1, la arquitectura modular y los enlaces de investigación.

---

## 0. Cómo se usa este archivo

- Cada mensaje del Director se anota aquí como instrucción numerada, texto casi literal.
- Cada hallazgo de investigación se anota con enlace.
- El skill de arquitectura NO es un bloque monolítico.
- Un archivo por ventana o función.
- Confirmar en cada salida: qué se anotó aquí + enlace de este README.

Arquitectura UI ya existente (no se borra):

https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/Readme%20arquitectura%20UI%20YAIWES.md

Código / interfaz existente:

https://github.com/maxbry123-commits/frontend/tree/main/UI%20YAIWES

---

## 1. Instrucciones del Director (anotadas 1 a 1)

### I01 — Objetivo original del skill

1. Crear un skill de alto nivel de arquitectura para fabricar el frontend.
2. El Director sube modelos UI. El agente convierte eso en segmentos de información, cambia colores y detalles estéticos, conserva todo el code de la interface (paneles, conexión). Devuelve archivo actualizado. Mantiene todos los archivos originales. Cambia solo estética y colores.
3. Investigar skills de Claude, Grok y GPT. Dar enlaces. El Director los descarga, los sube, se repite.
4. Al terminar, actualizar el skill markdown.
5. Antes de comenzar: investigar cómo se hace un skill de alto nivel de arquitectura y confirmar que está claro.
6. Usar skill-creator.

### I02 — Dejar de emitir contratos YAML en bucle

Orden posterior: dejar de hacer contrato. Seguir el trabajo real.

### I04 — Biblioteca de code modular, lotes de 10, no monolítico

Orden literal:

- No puedes hacer bloques monolíticos. Divides y conectas. 1 ventana = 1 archivo. 1 función = 1 archivo.
- Todo en archivos con code descargable.
- Si se usan repos open source: 1) enlace empaquetado ZIP para descargar; 2) el Director lo sube; 3) el agente convierte, divide, extrae, solo cambia diseño y color.
- Crear lotes de archivos separados. Lotes de 10. Al final de cada lote, enlace.
- Crear raíz dentro de Skills arquitectura frontend Yaiwes / llamada biblioteca code frontend Maxbry Yaiwes/
- Al final de cada salida, enlace para que el Director suba lo creado.
- No resumir ni omitir. Escribir code primero en sandbox, verificación cruzada con la fuente en LOOP hasta que el archivo esté completo.
- Archivos listos para desplegar: si mañana se copian o mueven, solo hay que cablear. Sirven como biblioteca del panel de configuración del sistema modular.

Ejecutado 2026-09-07:

- Carpeta: `Skills arquitectura frontend Yaiwes/biblioteca code frontend Maxbry Yaiwes/`
- Lote 01 (10 archivos núcleo host): `.../lote-01-nucleo-host/`
- ZIP open source Ribbon 2010 (NO extraído hasta que el Director lo suba): https://github.com/OkGoDoIt/Office-Ribbon-2010/archive/refs/heads/master.zip
- ZIP skills Anthropic (NO extraído hasta que el Director lo suba): https://github.com/anthropics/skills/archive/refs/heads/main.zip

### I05 — Backend que venga dentro de la UI: incluirlo, separado, identificado

Orden literal:

> Anota también si hay backend en la ui la incluyes pero me la pones separada identificada

Regla operativa:

- Si un modelo UI, ZIP o repo trae backend (API, FastAPI, Starlette, workers, Stabilize, router, memory, DB, WS), **no se omite**.
- **No se mezcla** con ventanas ni botones.
- Se coloca en carpeta propia, nombre que identifique BACKEND, 1 servicio/archivo o 1 endpoint = 1 archivo.
- El chrome UI solo cablea URLs. No se funde handler de servidor dentro de `yaiwes-button` / ventanas.
- Restyle (colores) no aplica a backend. Backend se copia fiel; solo se etiqueta y se separa.

Ruta canónica:

```text
Skills arquitectura frontend Yaiwes/biblioteca code frontend Maxbry Yaiwes/
├── lote-NN-ventanas/          ← UI, 1 ventana = 1 archivo
├── lote-NN-funciones/         ← UI, 1 función/botón = 1 archivo
└── lote-NN-BACKEND/           ← BACKEND, identificado
    ├── 00-IDENTIFICADO-BACKEND.md
    └── <servicio o endpoint>.py|.js|.ts
```

En cada archivo de backend, cabecera obligatoria:

```text
IDENTIFICADO: BACKEND
Origen: <ruta o repo fuente>
No es ventana. No es botón. No restyle.
```

Lote 01 (núcleo host) **no** es backend y **no** es UI extraída del Director. Es kernel de cableado escrito por el agente. Las ventanas/backend reales salen de lo que el Director suba.

### I06 — Pack FROMTED Design Skills (fuente del Director, 2026-09-07)

Orden: “Este es el skills.”

Inventario de adjuntos (clasificados, no omitidos):

**UI / skill (producto FROMTED — Matte · Little · Blanco):**

1. `01-DESIGN-TOKENS-THEMES-IMMUTABLE.md` — tokens locked
2. `02-UI-COMPONENT-CATALOG-SKILL.md` — 15 componentes
3. `03-FUNCTIONAL-INTERACTION-SKILL.md` — JS ejecutable
4. `04-AGENT-PROTOCOL-SKILL.md` — protocolo agentes
5. `README.md` — índice pack
6. `FROMTED-ARCHITECTURE-AND-DESIGN-BASE.md` — módulos 1–7 + i18n es/en/fr/pt
7. `FROMTED-FRONTEND-IMMUTABLE-LAW.json` — ley máquina

**IDENTIFICADO BACKEND / OPS (I05 — no mezclar con ventanas):**

8. `GUIA_CUENTA_B_REMOTE.md`
9. `GUIA_CUENTAS_REMOTE.md`
10. `GUIA-DESPLIEGUE-ZIP-UNIVERSAL.md`
11. `METODO-DE-TRABAJO.md`

Reglas tomadas de la fuente (no inventadas):

- Temas inmutables: `matte` | `little` | `blanco`. Cuarta paleta = REJECT.
- Lime `#d9ff43` / Operator = paneles internos, no chrome producto FROMTED.
- Matte: azul solo selección; naranja solo texto Descargar/Cargar.
- Little: terracota `#C65D3B` solo CTA primario.
- Blanco: azul selección + link Descargar; body no `#000000`.
- Geometría: 24 / 12 / 10 / 28.
- Lote 01 paleta `#3ddc97` **no es FROMTED**. Superada por Lote 02.

Ejecutado:

- Lote 02 (10 archivos tokens FROMTED): `biblioteca code frontend Maxbry Yaiwes/lote-02-tokens-FROMTED/`
- HEX cruzado vs skill 01: PASS
- BACKEND de esta subida: pendiente copiar fiel a `lote-BACKEND/` (siguiente lote, no mezclado aquí)

### I07 — HTML de chats Grok Build previos (NO GitHub)

Orden 2: “busca en los otros chat unos archivos html… No busques en Github porque no fue desplegado. Solo me lo hiciste en el chat y me diste los archivos lo hiciste con grok build.”

Idea de diseño: SÍ (pack FROMTED I06). Phone 390, header, tabs, cards, sheet, bottom-nav. Matte / Little / Blanco. 24/12/10/28. Sin lime.

Búsqueda 2026-09-07 (sin GitHub):

| Dónde | Resultado |
| --- | --- |
| Este sandbox | 0 `.html` de producto |
| `/workspace/attachments` | solo skills MD/JSON |
| `/tmp/sessions` | logs de **esta** sesión |
| Vercel `maxbry123-8833s-projects` | 0 proyectos |
| Otros chats Grok Build | **no accesibles** desde este sandbox |

Estado: **NO ENCONTRADO**. No se inventa el HTML previo. El Director re-sube esos archivos del chat.

### I08 — Recuperar diseño desde MD previos + skills (el Director sube)

Orden: los HTML no aparecen. El Director pasa los MD que el agente hizo antes, más el skills. Con eso se recupera el diseño. Empieza a subir archivos.

Regla:

- Fuente de estructura = MD que suba el Director (no inventar pantallas).
- Fuente de color = pack FROMTED I06 (Matte / Little / Blanco).
- 1 ventana = 1 archivo. 1 función = 1 archivo. Lotes de 10.
- Si un MD trae backend → `lote-BACKEND/` identificado (I05).
- No generar HTML “recuperado” hasta que el archivo MD esté en este chat.

Estado: **ESPERANDO SUBIDA**.


### I10 — Vista previa no abre

Orden literal: “Esa vista previa no funciona no abre”

Causa (no es el HTML vacío):

1. Un `.html` en el chat o en GitHub blob **no se ejecuta** como página. GitHub muestra código.
2. Abrir `file://` bloquea `crypto.subtle` (hace falta HTTPS).
3. El CSS original ocultaba rail + inspect bajo 1100px, así que en el preview estrecho parecía “no abre”.
4. El iframe `./01-ventana-chat-p01.html` falla si se abre solo el host.

Corrección 2026-09-07:

- Rail visible en móvil.
- Clave `YAIWES-CONFIG` también en texto plano si no hay SubtleCrypto.
- Preview live Vercel (abre en el navegador):
  - https://fromted-yaiwes-review-ejiyk6vlt-maxbry123-8833s-projects.vercel.app
  - Alias: https://fromted-yaiwes-review-maxbry123-8833s-projects.vercel.app
- HTML local descargable: `FROMTED-GROK-BUILD-REVIEW.html`
- ZIP lote-03: `lote-03-ventanas-FROMTED-review.zip`

Cómo abrir si no usas Vercel: descarga el HTML y ábrelo con un servidor local (`python3 -m http.server`), no con doble clic file://.

### I09 — Revisa y usando el skills crea un diseño con Grok Build para revisarlo

Orden literal del Director (2026-09-07):

> Revisa y usando el skills crea un diseño con usando build grock para revisarlo

Fuente usada (subida en este chat, no inventada):

- Pack tokens: `01-DESIGN-TOKENS-THEMES-IMMUTABLE.md` → lote-02
- Mockups HTML: `FROMTED-UI-SOURCE-CODES.md` → lote-03 (10 ventanas 1:1)
- Código funcional extra: FROMTED / YAIWES / MAXBRY / CASCADE / ROUTER MD — **no mezclado** en este preview de producto. Queda en biblioteca para lotes siguientes. Bridges Python = IDENTIFICADO BACKEND (I05).

Qué se construyó para revisar:

1. Host Grok Build (chrome + teléfono 390 + temas + clave):
   - `biblioteca-code-frontend-Maxbry-Yaiwes/lote-03-ventanas-FROMTED-review/00-host-review.html`
   - Copia de revisión en raíz artifacts: `FROMTED-GROK-BUILD-REVIEW.html`
2. Diez ventanas ya extraídas (p01, p02, p03, p04, p05, p06, p08, p09, v2-01, v2-03).
3. ZIP lote-03: `lote-03-ventanas-FROMTED-review.zip`
4. Panel config: clave default `YAIWES-CONFIG` (lote-01). Fail-closed. Añade botón a slot de la ventana activa sin reescribir handlers.

HEX cruzado host vs skill 01:

| Token | Skill 01 | Host |
| --- | --- | --- |
| Matte bg | `#0a0a0d` | `#0a0a0d` PASS |
| Matte orange text | `#ff5500` | `#ff5500` PASS |
| Matte blue selection | `#2563eb` | `#2563eb` PASS |
| Little accent | `#C65D3B` | `#C65D3B` PASS |
| Blanco bg | `#f4f4f5` | `#f4f4f5` PASS |
| Lime `#d9ff43` en chrome producto | prohibido | ausente PASS |

No hecho en este lote (siguiente, no omitido):

- Copiar guías ops a `lote-BACKEND/` fiel (I05): GUIA_CUENTA_B, GUIA_CUENTAS, GUIA-DESPLIEGUE, METODO-DE-TRABAJO.
- Extraer paneles operativos MAXBRY / YAIWES / CASCADE a lotes 04+ (1 panel = 1 archivo), restyle tokens FROMTED, no lime de Operator en chrome producto.
- Push GitHub solo si el Director aprueba path.

---


- El Director va a pasar lo ya hecho (arquitectura, diseño, colores, parte de la tarea).
- La parte final del diseño del skill no debe ser un bloque monolítico.
- Debe ser un archivo por cada ventana o función.
- Construir un diseño modular.

Modular, definición del Director:

> Que yo en configuración con una clave puedo acceder al panel de configuración de la ui y añadir en las mismas ventanas ventanas y botones nuevos con el mismo diseño.

Referencia de producto:

> Como funcionaba hace muchos años Microsoft Office web en los años 2007 a 2013.

Tareas pedidas:

- Investigar y estudiarlo.
- Investigar todo lo necesario para lograrlo.
- Crear en el repo frontend, rama main, raíz:
  - `Skills arquitectura frontend Yaiwes/`
  - `Readme arquitectura frontend yaiwes.md`
- Meter en el README los enlaces.
- Anotar 1 a 1 las instrucciones, la arquitectura que vamos haciendo y la información recopilada.
- Confirmar y validar en cada salida que se anotó en este archivo.
- Dar el enlace del README.
- Token de arranque: Inicia.

---

## 2. Qué significa modular aquí (contrato de producto)

No es “varios componentes React en un solo JS”. Es un **shell + catálogo + manifiesto**.

Modelo objetivo (Office Fluent + RibbonX + Apps for Office):

1. La UI base es un host (ribbon / tabs / groups / panels).
2. Las ventanas y botones no se hardcodean todos en un único archivo.
3. Cada ventana o función vive en su propio manifiesto + módulo.
4. En Configuración, con una clave, se abre el panel de configuración de la UI.
5. Desde ese panel se pueden añadir, a las mismas ventanas existentes, ventanas nuevas y botones nuevos.
6. Los nuevos controles heredan el mismo diseño (tokens de color, tipografía, tamaño, iconografía, estados).
7. El host pinta controles declarados. El módulo solo declara id, slot, label, icon, action.
8. Cambiar estética no reescribe handlers, rutas, ids de paneles ni data-flow.

Analogía Office 2007–2013:

| Office | YAIWES |
| --- | --- |
| `customUI.xml` / RibbonX | manifiesto por ventana/función |
| tab / group / button | ventana / grupo / botón |
| `id` vs `idMso` | id nuevo vs anclar a control existente |
| callback `onAction` | action id → handler registrado |
| Customize the Ribbon (Office 2010+) | panel Configuración UI (clave) |
| Quick Access Toolbar | barra rápida de YAIWES |
| Apps for Office 2013 (HTML+JS+manifest) | módulo web de una función |
| tema / Fluent chrome | design tokens YAIWES |

---

## 3. Arquitectura del skill (no monolítico)

```text
Skills arquitectura frontend Yaiwes/
├── Readme arquitectura frontend yaiwes.md    ← este archivo (bitácora humana)
├── SKILL.md                                  ← índice + reglas (corto)
├── host/                                     ← shell, router visual, theme
│   └── ui-shell.md
├── config/
│   ├── access-key.md                         ← clave → panel configuración UI
│   └── ui-config-panel.md
├── tokens/
│   └── design-tokens.md                      ← colores / tipografía / radios
├── windows/                                  ← UN archivo por ventana
│   └── _index.md
├── functions/                                ← UN archivo por función / botón
│   └── _index.md
└── manifests/
    └── schema.md                             ← JSON/YAML de extensión
```

Regla de corte:

- `SKILL.md` = navegación + prohibiciones + flujo.
- `windows/<ventana>.md` = layout, slots, paneles, conexiones de ESA ventana.
- `functions/<funcion>.md` = un control o una capacidad.
- Prohibido meter todas las ventanas en un solo markdown.

Flujo de extensión (como Ribbon Customize):

```text
CLAVE
  → panel Configuración UI
    → elegir ventana destino (slot existente)
      → añadir ventana | añadir grupo | añadir botón
        → mismo design token
          → persistir manifiesto
            → host re-render sin tocar código original de la ventana
```

---

## 4. Investigación Office Web / Fluent 2007–2013

Hallazgo central: Office no pintaba botones “a mano” en código de cada app. Declaraba la UI en XML y el host la materializaba con el mismo chrome.

### 4.1 RibbonX 2007 — UI declarativa

Con pocas líneas de XML se añade tab + group + button al ribbon existente. El diseño lo pone Office. El add-in solo declara y registra callbacks.

- Customize Ribbon UI con OOXML (Office 2007):  
  https://learn.microsoft.com/en-us/previous-versions/office/developer/office-2007/aa434077(v=office.12)
- Overview Fluent Ribbon (2010, mismo modelo):  
  https://learn.microsoft.com/en-us/previous-versions/office/developer/office-2010/ff862537(v=office.14)
- Deploy 2007 Office con Ribbon custom:  
  https://learn.microsoft.com/en-us/previous-versions/office/office-2007-resource-kit/cc178959(v=office.12)
- MSDN Magazine — Ribbon tabs and controls:  
  https://learn.microsoft.com/en-us/archive/msdn-magazine/2007/february/extend-office-2007-with-your-own-ribbon-tabs-and-controls
- VBA Fluent Ribbon overview:  
  https://github.com/MicrosoftDocs/VBA-Docs/blob/main/Library-Reference/Concepts/overview-of-the-office-fluent-ribbon.md

Patrón técnico a copiar:

```xml
<customUI xmlns="http://schemas.microsoft.com/office/2006/01/customui">
  <ribbon>
    <tabs>
      <tab id="CustomTab" label="My Tab">
        <group id="SampleGroup" label="Sample Group">
          <button id="Button" label="Insert Company Name"
                  size="large" onAction="InsertCompanyName" />
        </group>
      </tab>
    </tabs>
  </ribbon>
</customUI>
```

Separación: markup (forma) ≠ callback (función). El chrome es del host.

### 4.2 Office 2010 — personalización por UI, no solo por XML

Office 2010 añadió “Customize the Ribbon”: el usuario crea tab, grupo y añade comandos existentes o custom. Eso es exactamente “en configuración añado botones a las mismas ventanas con el mismo diseño”.

- TechRadar — Customize Ribbon 2010:  
  https://www.techradar.com/news/software/applications/get-the-microsoft-office-ribbon-exactly-how-you-want-it-1085259
- Adding a button to the Ribbon (RibbonX 2007 vs 2010+ customUI14):  
  https://www.thevbahelp.com/post/adding-a-button-to-the-ribbon
- Customize Ribbon (Greg Maxey):  
  https://gregmaxey.com/word_tip_pages/customize_ribbon_main.html

### 4.3 SharePoint 2010 Server Ribbon (versión web del mismo modelo)

El ribbon de SharePoint 2010 se ve y se comporta como el de Office. Se extiende con `CommandUIDefinition` + `Location` (slot) + `TemplateAlias` (posición en la plantilla del grupo). Eso es el anclaje a ventanas existentes.

- Customizing SharePoint 2010 Server Ribbon:  
  https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/gg552606(v=office.14)

### 4.4 Office Web Apps 2010 → Office Web Apps Server 2013

Office en el navegador 2010/2013 no era un “Office distinto”. 2013 separa el servidor OWA y habla WOPI con el host (SharePoint, Exchange). La lección de arquitectura: host vs motor vs chrome.

- Anatomy of apps for Office (2013): webpage + manifest + Office.js, tres formas (content, task pane, mail):  
  https://learn.microsoft.com/en-us/archive/blogs/officeapps/anatomy-of-apps-for-office
- Office 2013 abraza HTML/CSS/JS + XML manifest:  
  https://www.infoworld.com/article/2293514/microsoft-office-2013-embraces-web-development-2.html
- Office Web Apps Server 2013 / WOPI:  
  https://sharepoint360.de/sharepoint-2013-feature-fokus-office-web-apps-neue-serverrolle-erweiterte-funktionen/
- Open XML SDK + Fluent UI extensibility:  
  https://learn.microsoft.com/en-us/archive/blogs/brian_jones/the-open-xml-sdk-and-fluent-ui-extensibility
- VSTO IRibbonExtensibility (Office pide XML, parsea, crea controles unmanaged, callback):  
  https://learn.microsoft.com/en-us/archive/blogs/andreww/the-evolution-of-vsto-v3

### 4.5 Réplica web del ribbon 2010 (HTML/CSS/JS)

Implementación pública del ribbon Office 2010 en web: tabs, groups, botones large/small, temas, backstage.

- https://github.com/OkGoDoIt/Office-Ribbon-2010

### 4.6 Qué hay que construir en YAIWES para lograrlo

1. **Host chrome** — tabs, groups, panels, QAT. Un solo motor de pintura.
2. **Design tokens** — colores, tipo, radios, icon size. Todo botón nuevo los usa.
3. **Slot registry** — cada ventana publica slots (`ventana.home.toolbar`, `ventana.chat.composer`).
4. **Manifest schema** — JSON/YAML por función: `id`, `targetSlot`, `kind`, `label`, `icon`, `action`, `acl`.
5. **Config panel + clave** — sin clave no se abre. Con clave: add window / add button to existing window.
6. **Action bus** — `onAction` no vive dentro del CSS. El módulo registra handler por id.
7. **Persistencia** — manifiestos versionados. Originales de cada ventana no se reescriben.
8. **Fail-closed** — botón sin slot válido o sin action registrada no se pinta.

---

## 5. Enlaces de skills (Claude / Grok / formato Agent Skills)

Descargar, subir, integrar en `references/` del skill. No reescribir esos skills.

Formato:

- https://code.claude.com/docs/en/skills
- https://support.claude.com/en/articles/12512198-how-to-create-custom-skills
- https://support.claude.com/en/articles/12599426-how-to-create-a-skill-with-claude-through-conversation
- https://claude.com/blog/complete-guide-to-building-skills-for-claude
- https://github.com/anthropics/skills/raw/main/skills/skill-creator/SKILL.md
- https://github.com/mstrokin/grok-root-skills/blob/main/skills/skill-creator/SKILL.md
- https://skillwright.app/blog/claude-code-skills-guide

Frontend:

- https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
- https://github.com/AlexPEClub/ai-coding-starter-kit/blob/main/.claude/skills/frontend/SKILL.md

Reglas skill-creator Grok (sesión):

- Carpeta persistente de skills de usuario: `/home/workdir/.grok/skills/<name>/`
- `name` = kebab-case = nombre de carpeta
- `description` = qué + cuándo
- Cuerpo corto; detalle en `references/`
- Un archivo por variación / ventana (progressive disclosure)

---

## 6. Relación con la arquitectura YAIWES ya documentada

Del README existente `UI YAIWES/Readme arquitectura UI YAIWES.md`:

- YAIWES es la app. WebGPU/WebNN/WASM son aceleración, no la UI.
- UI → AI ROUTER → ENGINE ADAPTER → motores.
- UI separada de motores. Adapters intercambiables.
- Chat no gobierna el workflow; consume API.

Este skill de frontend se encarga solo del **chrome modular y la estética**. No sustituye el router ni Stabilize CORE.

Puente:

```text
UI HOST (este skill)
  → ventanas/funciones por manifiesto
    → paneles / conexiones (intocables en restyle)
      → API chat / router (arquitectura ya escrita)
```

---

## 7. Reglas de restyle (cuando suban modelos UI)

Permitido:

- tokens de color
- tipografía
- radios, sombras, spacing visual
- iconografía de cromo

Prohibido:

- reescribir handlers
- cambiar rutas
- cambiar ids de paneles
- cambiar data-flow / conexiones
- borrar archivos originales
- fundir ventanas en un solo archivo del skill

Entrega:

- original intacto
- copia actualizada (solo estética)
- nota en este README

---

## 8. Pendiente del Director

- Subir modelos UI / código / paleta ya hecha.
- Confirmar stack exacto de la UI pintable (HTML, JS, C++, mixto).
- Definir la clave del panel de configuración (formato, dónde se guarda).
- Decidir nombre kebab del skill agente: propuesto `frontend-architecture-yaiwes`.

---

## 9. Log de anotación

| Fecha | Qué se anotó | Validado |
| --- | --- | --- |
| 2026-09-07 | I01 I02 I03, definición modular, investigación Office 2007–2013, enlaces skills, mapa de carpetas, puente con README UI YAIWES | SÍ — este archivo en main |
| 2026-09-07 | I04 biblioteca code, lote-01 10 archivos núcleo, ZIP OSS pendientes de subida | SÍ — carpeta en main |
| 2026-09-07 | I05 backend en la UI se incluye, carpeta lote-NN-BACKEND identificada, no mezclar con ventanas | SÍ — este archivo |
| 2026-09-07 | I06 pack FROMTED skills; lote-02 tokens Matte/Little/Blanco extraídos de skill 01; HEX PASS | SÍ — lote-02 en main |
| 2026-09-07 | I07 HTML de otros chats Grok Build: no accesibles; 0 html en sandbox; Vercel 0 proyectos | SÍ — este archivo |
| 2026-09-07 | I10 preview no abre; Vercel live URL; CSS móvil + clave file:// | SÍ — este archivo |
| 2026-09-07 | I09 host Grok Build `00-host-review.html` + copia `FROMTED-GROK-BUILD-REVIEW.html`; lote-03 zip; HEX PASS vs skill 01 | SÍ — este archivo |

