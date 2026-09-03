# 📂 Índice frontend componentes — X-Ray funcional

## Leyenda de estado

- **ZIP_ONLY**: el componente llegó, tiene ZIP/partes y manifest, pero NO existe todavía como árbol de código extraído.
- **EXTRACTED**: existe como archivos y carpetas reales navegables en GitHub.
- **CODE_REAL**: código propio/heredado ya materializado.
- **ARCHIVE_ONLY**: archivo histórico comprimido; no se ha demostrado equivalencia completa con una extracción.
- **COMPLETE**: presencia verificada contra árbol + manifest/ubicación.

## Resumen forense actual

- Los **27 componentes antes ZIP_ONLY están extraídos y verificados**.
- `Fromtend code/`: **22 carpetas reales** + manifest; **0 ZIP de empaquetado**.
- `UI YAIWES/`: **5 carpetas reales** + manifest; **0 ZIP de empaquetado**.
- `UI YAIWES/Interface YAIWES ui/ENGINE ADAPTER/`: 5 engines extraídos; **0 ZIP de empaquetado**.
- `📂 skills de fromtend/📂 archivos skills fromtend/`: **8 repos de skills extraídos**.
- `fromted-sources/`: 5 componentes ya extraídos previamente.
- `codigo real frontend/`: código propio/heredado materializado.
- Quedan dos ZIP de naturaleza distinta: `archives/trabajo-grok-main.zip` (archivo histórico aún no demostrado como redundante) y `PracticalSwan-agent-skills/deploy-to-vercel/Archive.zip` (archivo que pertenece al upstream oficial, mismo SHA que el repositorio fuente).

---

# 1. Componentes open source — función detallada

## 1. OpenPencil
**Qué es:** editor de diseño AI-native y alternativa open source a Figma. Está construido para edición visual, colaboración y flujos de diseño asistidos por IA.

**Qué aporta a FROMTED:** patrones de canvas de diseño, selección/movimiento de elementos, edición visual, inspección de propiedades, interacción tipo Figma y una referencia para construir un diseñador nativo dentro de la UI.

**Fuente:** https://github.com/open-pencil/open-pencil  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 18 partes, no extraído.

## 2. OpenDesign
**Qué es:** aplicación de diseño local-first que usa agentes/coding CLIs como motor de diseño. Puede trabajar con prototipos, landing pages, dashboards, slides, imágenes y video y exportar archivos reales.

**Qué aporta a FROMTED:** referencia fuerte para un workspace donde un agente modifica diseño real, exporta HTML/PDF/PPTX/MP4 y conecta herramientas como Claude Code, Codex, Cursor u otros agentes BYOK.

**Fuente:** https://github.com/nexu-io/open-design  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 21 partes, no extraído.

## 3. Onlook
**Qué es:** herramienta AI-first para editar visualmente aplicaciones React. Permite seleccionar elementos en una app, cambiar estilos/layout y combinar edición visual con generación/modificación de código.

**Qué aporta a FROMTED:** puente diseño↔código, inspector visual de React, modificación de estilos/componentes desde una UI y patrón de “Cursor para diseñadores”.

**Fuente:** https://github.com/onlook-dev/onlook  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 2 partes.

## 4. Penpot
**Qué es:** plataforma open source de diseño y prototipado colaborativo para equipos de producto.

**Qué aporta a FROMTED:** canvas profesional, componentes reutilizables, prototipos, colaboración, sistemas de diseño y patrones UX equivalentes a una herramienta de diseño completa.

**Fuente:** https://github.com/penpot/penpot  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 18 partes.

## 5. Webstudio
**Qué es:** constructor visual open source de sitios web, alternativa a Webflow, con control amplio de CSS, conexión a CMS headless y despliegue portable.

**Qué aporta a FROMTED:** editor visual web, propiedades CSS, layout responsive, componentes web y patrón de publicación sin quedar atado a un único hosting.

**Fuente:** https://github.com/webstudio-is/webstudio  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 6 partes.

## 6. Silex
**Qué es:** constructor visual/no-code para sitios estáticos con datos dinámicos.

**Qué aporta a FROMTED:** edición visual de páginas, composición drag-and-drop y una referencia ligera para generar interfaces web desde un editor.

**Fuente:** https://github.com/silexlabs/Silex  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 7. Frappe Builder
**Qué es:** constructor visual low-code para crear y publicar sitios responsivos.

**Qué aporta a FROMTED:** bloques visuales, edición responsive, flujo diseño→publicación y referencia para constructor de páginas dentro de la interfaz.

**Fuente:** https://github.com/frappe/builder  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 8. BESSER
**Qué es:** plataforma Python low-code/model-driven con generación de código, DSL, UML, state machines y asistencia de IA.

**Qué aporta a FROMTED:** modelado de software, transformación de modelos en código, state machines y piezas útiles para un diseñador de workflows que produzca software ejecutable.

**Fuente:** https://github.com/BESSER-PEARL/BESSER  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 6 partes.

## 9. tldraw
**Qué es:** SDK React para construir pizarras y aplicaciones de canvas infinito, con formas, dibujo, interacción y colaboración.

**Qué aporta a FROMTED:** Crazy Wall, pizarra infinita, diagramas libres, anotaciones, nodos visuales y paneles colaborativos.

**Fuente:** https://github.com/tldraw/tldraw  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 4 partes.

## 10. draw.io
**Qué es:** editor JavaScript client-side para diagramas generales.

**Qué aporta a FROMTED:** diagramas de arquitectura, flujos, redes, organigramas y edición visual avanzada dentro de navegador.

**Fuente:** https://github.com/jgraph/drawio  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 7 partes.

## 11. xyflow
**Qué es:** librería para interfaces basadas en nodos, principalmente React Flow y Svelte Flow.

**Qué aporta a FROMTED:** canvas de automatización, nodos conectables, handles, edges, zoom/pan, selección y edición de workflows visuales.

**Fuente:** https://github.com/xyflow/xyflow  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 12. Craft.js
**Qué es:** framework React extensible para construir editores de páginas drag-and-drop.

**Qué aporta a FROMTED:** construcción visual por componentes, reordenamiento, inspector de propiedades y edición WYSIWYG sin reescribir un page builder desde cero.

**Fuente:** https://github.com/prevwong/craft.js  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 13. Mermaid
**Qué es:** motor diagrams-as-code que convierte texto en flowcharts, sequence diagrams, mindmaps y otros diagramas.

**Qué aporta a FROMTED:** artefactos de diagramas generados por IA, documentación visual y render de workflows/arquitecturas desde texto.

**Fuente:** https://github.com/mermaid-js/mermaid  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 14. PlantUML
**Qué es:** motor Java de diagrams-as-code/UML desde descripciones textuales.

**Qué aporta a FROMTED:** diagramas UML, secuencia, clases, componentes y arquitectura generados automáticamente desde prompts/código.

**Fuente:** https://github.com/plantuml/plantuml  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 5 partes.

## 15. anthropic-skills
**Qué es:** repositorio público de Agent Skills de Anthropic.

**Qué aporta a FROMTED:** ejemplos de cómo empaquetar instrucciones, herramientas y conocimiento reusable para agentes; útil como biblioteca de capacidades instalables.

**Fuente:** https://github.com/anthropics/skills  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 16. microsoft-skills
**Qué es:** colección de Skills, MCP servers, Custom Agents y archivos de grounding para SDKs y coding agents.

**Qué aporta a FROMTED:** skills de programación, MCP, configuración de agentes y patrones para conectar herramientas externas al sistema.

**Fuente:** https://github.com/microsoft/skills  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 17. ui-ux-pro-max-skill
**Qué es:** skill de inteligencia de diseño UI/UX para múltiples plataformas.

**Qué aporta a FROMTED:** reglas y conocimiento reutilizable para generar interfaces, landing pages, mobile UI, React/Tailwind y decisiones de diseño más consistentes.

**Fuente:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 18. wordpress-agent-skills
**Qué es:** skills para que agentes creen temas y sitios WordPress.

**Qué aporta a FROMTED:** capacidades especializadas de generación/edición WordPress y ejemplo de skill orientado a producto concreto.

**Fuente:** https://github.com/Automattic/wordpress-agent-skills  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 19. frontend-audit-skill
**Qué es:** skill de auditoría visual/regresión para comparar renders reales con diseños PNG.

**Qué aporta a FROMTED:** gate automático para detectar diferencias visuales entre lo diseñado y lo renderizado; útil para verificación de UI antes de aprobar un build.

**Fuente:** https://github.com/colbymchenry/frontend-audit-skill  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 20. nolly-agent-skills
**Qué es:** colección de skills para coding agents; incluye bootstrap de AGENTS.md y documentación de agente.

**Qué aporta a FROMTED:** patrones para inicializar repositorios y dar instrucciones persistentes a agentes de programación.

**Fuente:** https://github.com/nolly-studio/agent-skills  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 21. PracticalSwan-agent-skills
**Qué es:** colección de skills usados con Claude Code, Codex y Copilot.

**Qué aporta a FROMTED:** ejemplos de capacidades portables entre varios coding agents y material para una biblioteca común de skills.

**Fuente:** https://github.com/PracticalSwan/agent-skills  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 22. accessibility-skills
**Qué es:** colección de skills centrados en accesibilidad y revisión a11y.

**Qué aporta a FROMTED:** checks de accesibilidad, reglas WCAG/ARIA y capacidad de revisar interfaces para usuarios con distintas necesidades.

**Fuente:** https://github.com/mgifford/accessibility-skills  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 23. Transformers.js
**Qué es:** librería de Hugging Face para ejecutar modelos Transformers directamente en navegador/JavaScript sin servidor obligatorio.

**Qué aporta a FROMTED/YAIWES:** embeddings, clasificación, NLP, visión/audio compatibles y procesamiento local en navegador; sirve como engine generalista de ML web.

**Fuente:** https://github.com/huggingface/transformers.js  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 24. MLC WebLLM
**Qué es:** motor de inferencia LLM de alto rendimiento dentro del navegador, orientado a WebGPU.

**Qué aporta a FROMTED/YAIWES:** chat local, streaming de tokens y ejecución de modelos LLM usando GPU del dispositivo sin depender siempre de una API remota.

**Fuente:** https://github.com/mlc-ai/web-llm  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 25. ONNX Runtime
**Qué es:** runtime multiplataforma de alto rendimiento para inferencia y aceleración de modelos ONNX.

**Qué aporta a FROMTED/YAIWES:** backend común para ejecutar modelos exportados a ONNX; en web permite usar backends como WebGPU/WASM según disponibilidad.

**Fuente:** https://github.com/microsoft/onnxruntime  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 25 partes.

## 26. wllama
**Qué es:** binding WebAssembly para llama.cpp que permite inferencia LLM en navegador con modelos GGUF.

**Qué aporta a FROMTED/YAIWES:** engine alternativo para modelos llama.cpp/GGUF locales; útil como fallback o runtime separado de WebLLM.

**Fuente:** https://github.com/ngxson/wllama  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 1 ZIP.

## 27. LiteRT
**Qué es:** framework on-device de Google, sucesor de TensorFlow Lite, para desplegar ML/GenAI en edge con conversión, runtime y optimización.

**Qué aporta a FROMTED/YAIWES:** runtime on-device adicional; LiteRT.js permite una ruta web que puede usar WebGPU, WebNN o WASM según plataforma.

**Fuente:** https://github.com/google-ai-edge/LiteRT  
**Estado local:** **EXTRACTED_VERIFIED / COMPLETE** — 18 partes.

## 28. assistant-ui
**Qué es:** librería TypeScript/React para construir interfaces de chat con IA.

**Qué aporta a FROMTED:** mensajes, composer/input, streaming, estados de conversación, markdown y componentes reutilizables para chat/agent UI.

**Fuente:** https://github.com/assistant-ui/assistant-ui  
**Estado local:** **EXTRACTED / COMPLETE** — 350 archivos, 334 code-like.

## 29. Dockview
**Qué es:** librería de layout para paneles acoplables, pestañas y workspaces tipo IDE.

**Qué aporta a FROMTED:** ventanas que se pueden abrir/cerrar/acoplar, paneles Chat/Artifact/Files/Router y experiencia tipo VSCode.

**Fuente:** https://github.com/mathuo/dockview  
**Estado local:** **EXTRACTED / COMPLETE** — 39 archivos.

## 30. i18next
**Qué es:** framework de internacionalización JavaScript.

**Qué aporta a FROMTED:** traducciones, namespaces, carga de idiomas y cambio de locale sin hardcodear cada cadena.

**Fuente:** https://github.com/i18next/i18next  
**Estado local:** **EXTRACTED / COMPLETE** — 280 archivos.

## 31. react-i18next
**Qué es:** integración React del ecosistema i18next.

**Qué aporta a FROMTED:** hooks/componentes para traducir directamente las vistas React, cambiar idiomas y mantener la UI sincronizada con el locale.

**Fuente:** https://github.com/i18next/react-i18next  
**Estado local:** **EXTRACTED / COMPLETE** — 604 archivos.

## 32. Lucide
**Qué es:** toolkit comunitario de iconos SVG consistentes.

**Qué aporta a FROMTED:** iconografía uniforme para barras laterales, botones, toolbars, estados, navegación y command palette.

**Fuente:** https://github.com/lucide-icons/lucide  
**Estado local:** **EXTRACTED / COMPLETE** — 57 archivos.

---

# 2. Código real propio/heredado encontrado

## 33. Fromted React Vite
Aplicación real React + Vite + TypeScript. Contiene App, AppShell, ChatPanel, selector de idioma, selector de tema, mobile tabs, i18n, estilos y configuración de build.

**Uso:** es la base funcional más cercana a una UI FROMTED moderna que ya existe en este repo.  
**Estado:** **CODE_REAL / COMPLETE** — 23 archivos code/config.

## 34. HTML Grok
Archivo HTML ejecutable de diseño FROMTED creado por Grok.

**Uso:** referencia visual/funcional inmediata que puede abrirse como página estática y reutilizarse para extraer layout y estilos.  
**Estado:** **CODE_REAL / COMPLETE** — 1 HTML.

## 35. Frontend static legacy
Frontend HTML/CSS/JS anterior, junto con configuración Vercel y assets.

**Uso:** shell histórico desplegable y fuente de piezas que pueden rescatarse o compararse con Fromted React Vite.  
**Estado:** **CODE_REAL / COMPLETE** — 5 archivos.

## 36. Router Universal UI
Interfaz HTML/CSS/JS del router universal con app, inspector y lógica de router.

**Uso:** panel visual para estado/operación del router que puede incorporarse al módulo Router de FROMTED.  
**Estado:** **CODE_REAL / COMPLETE** — 5 archivos.

## 37. API router
Proxy JavaScript/serverless del frontend hacia el router.

**Uso:** puente fino entre UI y servicio Router; evita meter el kernel del router dentro del frontend.  
**Estado:** **CODE_REAL / COMPLETE** — 1 archivo.

## 38. Herramientas de descarga
Scripts Python y workflow histórico usados para clonar, empaquetar y materializar repos open source.

**Uso:** trazabilidad del método que creó los ZIP y de los repos originales.  
**Estado:** **CODE_REAL / COMPLETE**.

## 39. Reception schema
Schema YAML de recepción de documentos.

**Uso:** define estructura/validación para entradas de documentos del frontend.  
**Estado:** **CODE_REAL/config / COMPLETE**.

## 40. Infra Grok htpasswd
Utilidad Python heredada para htpasswd.

**Uso:** herramienta de infraestructura, no UI. Debe mantenerse aislada y revisarse antes de reutilizarse.  
**Estado:** **CODE_REAL / COMPLETE**.

## 41. trabajo-grok-main.zip
Archivo histórico comprimido de trabajo-grok.

**Uso:** respaldo/archivo fuente. No se ha demostrado todavía que TODO su contenido tenga una copia extraída equivalente en el árbol actual.

**Estado:** **ARCHIVE_ONLY** — no borrar todavía sin comparación completa.

---

# 3. ENGINE ADAPTER YAIWES

~~~text
ENGINE ADAPTER
├── ✅ MLC WebLLM
├── ✅ Transformers.js
├── ✅ ONNX Runtime Web
├── ✅ wllama
└── ✅ LiteRT
     ↓
WebGPU / WebNN / WASM
~~~

**Estado X-Ray:** los cinco engines están extraídos, navegables y verificados. Los ZIP de empaquetado fueron eliminados. LiteRT conserva un registro `LFS_POINTERS_SKIPPED.json` con 23 punteros Git LFS de binarios precompilados que nunca fueron descargados por el workflow original.

---

# 4. Skills FROMTED

Raíz creada:

~~~text
main/
└── 📂 skills de fromtend/
    └── 📂 archivos skills fromtend/
~~~

La raíz está creada y contiene una segunda copia navegable de **8 repos de skills**: anthropic-skills, microsoft-skills, ui-ux-pro-max-skill, wordpress-agent-skills, frontend-audit-skill, nolly-agent-skills, PracticalSwan-agent-skills y accessibility-skills.

---

# 5. Conclusión forense ZIP

## Empaquetado creado por nuestros workflows

**CERRADO ✅**

- 100 ZIP de `Fromtend code` → extraídos y eliminados tras verificación.
- 46 ZIP de `UI YAIWES` → extraídos y eliminados tras verificación.
- 46 ZIP duplicados del ENGINE ADAPTER → eliminados tras crear la segunda copia extraída.
- **0 ZIP de empaquetado de componentes permanecen** en esas tres ubicaciones.

## ZIP que permanecen por otra razón

1. `📂componentes open soure fromtend/archives/trabajo-grok-main.zip`  
   Estado: **ARCHIVE_ONLY**. No se elimina hasta demostrar equivalencia completa con contenido extraído.

2. `PracticalSwan-agent-skills/deploy-to-vercel/Archive.zip`  
   Estado: **UPSTREAM_SOURCE_FILE**. Existe también en el repositorio oficial PracticalSwan con el mismo SHA; no fue creado por nuestra descarga. Se conserva hasta comprobar el contenido interno del ZIP y confirmar que sea redundante.

---

# 6. Extracción final — contrato de cierre

**GitHub Action:** `Frontend extract verified components`

Para cada uno de los 27 componentes:

1. comprobar que existen todas las partes ZIP esperadas;
2. rechazar cualquier ZIP de 0 bytes;
3. ejecutar prueba CRC con `unzip -tq`;
4. rechazar rutas inseguras/relative traversal;
5. extraer todas las partes sobre el mismo árbol del componente;
6. verificar que cada entrada archivada exista materializada;
7. verificar que la carpeta extraída tenga archivos reales;
8. copiar los 8 skills a `📂 skills de fromtend/📂 archivos skills fromtend/`;
9. copiar los 5 engines a `UI YAIWES/Interface YAIWES ui/ENGINE ADAPTER/`;
10. eliminar ZIP únicamente en el mismo commit que introduce el árbol extraído verificado;
11. push por componente;
12. generar `EXTRACTION_XRAY_REPORT.json`.

**Estado final:** **EXTRACTED_VERIFIED 27/27 ✅**

Run de extracción: `33720787285` — segundo intento SUCCESS.

Verificación final:
- 22/22 componentes Frontend extraídos.
- 5/5 engines YAIWES extraídos.
- 8/8 repos de skills copiados a la raíz de Skills.
- 0 ZIP de empaquetado en Fromtend code.
- 0 ZIP de empaquetado en UI YAIWES.
- 0 ZIP de empaquetado en ENGINE ADAPTER.
- reporte: `📂componentes open soure fromtend/EXTRACTION_XRAY_REPORT.json`.
- workflow temporal de extracción retirado después del cierre.


---

# 7. Conteo X-Ray de archivos extraídos

| Componente | Archivos reales verificados |
|---|---:|
| OpenPencil | 3.506 |
| OpenDesign | 13.141 |
| Onlook | 1.695 |
| Penpot | 6.162 |
| Webstudio | 4.192 |
| Silex | 575 |
| Frappe-Builder | 628 |
| BESSER | 959 |
| tldraw | 4.502 |
| drawio | 3.472 |
| xyflow | 700 |
| Craft.js | 373 |
| Mermaid | 3.130 |
| PlantUML | 6.649 |
| anthropic-skills | 417 |
| microsoft-skills | 2.100 |
| ui-ux-pro-max-skill | 668 |
| wordpress-agent-skills | 58 |
| frontend-audit-skill | 17 |
| nolly-agent-skills | 16 |
| PracticalSwan-agent-skills | 2.135 |
| accessibility-skills | 208 |
| Transformers.js | 702 |
| MLC-WebLLM | 275 |
| ONNX-Runtime | 10.177 |
| wllama | 122 |
| LiteRT | 6.992 |

**LiteRT:** se registraron 23 punteros Git LFS omitidos porque el downloader original usó `GIT_LFS_SKIP_SMUDGE`; no eran binarios reales descargados sino referencias LFS.
