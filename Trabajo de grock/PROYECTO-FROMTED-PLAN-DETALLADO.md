# FROMTED — PLAN DETALLADO DE DISEÑO Y PROGRAMACIÓN

Fecha: 2026-07-27 22:30 -05  
Estado: PROPUESTO — para aprobación  
Formato exigido por usuario: 2 métodos · pasos detallados enumerados (no resumen) · 2 idiomas · tiempos · cómo se diseña · download OS code

---

## MÉTODO 1 — Documento de proyecto FROMTED (spec cerrada)

Fuente de verdad de producto:
- Solo INTERFACE (paneles + clientes de conexión).
- Módulos: Config · Chat · +/Skills · Automatización (canvas UI) · Router (fichas UI) · Auditor docs.
- Visual: fondo negro mate / grises · letras blanco · cargar/descargar naranja · seleccionado azul eléctrico · notificaciones verde · chat 5 colores (default 2 grises).
- Capacidades chat: stream · stop · loop output continuo · AI Council · tags · historial con lupa · sandbox code filtros · audio · MD artefactos · anclas.
- 61 funciones = checklist; muchas solo UI dispara a EXT.
- No kernels OpenClaw/LiteLLM/Graphiti dentro del bundle UI.

## MÉTODO 2 — Arquitectura híbrida (PARTE-2)

- Web = orquestador + agentes potentes + tools deterministas + APIs (plan pago).
- App = complemento local Gemma 1B Q4 (offload preguntas cortas).
- Session Controller: simple→local · escala→web.
- Modelo y agente intercambiables.
- v1 programa primero WEB; app es fase posterior.

---

## CÓMO SE DISEÑA (no a ciegas)

### Lenguaje básico
1. Miro las fotos que diste (chat, selectores, connectors, kanban, OpenClaw).
2. Saco lista de botones y paneles reales de esas fotos.
3. Aplico tu paleta (negro mate, naranja, azul eléctrico, verde).
4. No invento layout nuevo: copio estructura de assistant-ui / reachat / openclaw-web y cambio theme.
5. Diseño visual final (imágenes) = PASO 2, después de tener sources en disco.

### Léxico programación
1. `sources/` = vendor read-only (sparse clone).
2. `src/` = adaptaciones (theme tokens, wiring SessionController, hooks API).
3. Component composition: import primitives from sources → wrap in FromtedShell.
4. No fork masivo: path alias + thin adapters.
5. State: un store mínimo (Zustand o equivalente) para chat + settings; no Redux enterprise.
6. Data flow: UI event → controller → local engine OR HTTPS orchestrator.

### Método ahorro tokens / tiempo
1. Primero DOWNLOAD determinista de repos (igual que agentes).
2. Copiar solo archivos de UI que se usan.
3. Editar theme + wire; no reescribir librerías.
4. Un módulo terminado y usable antes del siguiente.
5. Checklist 61: implementar UI de las críticas primero; EXT se mockea o se conecta después.

### Tiempo máximo objetivo
- Download sources web: 0.5–1 h (Actions).
- Shell dark + chat stream + selector + stop: 3–5 h trabajo enfocado.
- Historial + config + MD + attach: 2–3 h.
- Preview Vercel usable: objetivo **mismo día / pocas horas**, no “un sprint de semanas”.
- Módulos B (files, router, canvas): días siguientes, no bloquean demo chat.
- App Flutter+Gemma: fase separada (no mezcla el día 1).

---

## ÍNDICE DE TAREAS (lista enumerada)

### BLOQUE 0 — Preparación repo y manifest (tareas 1–15)

1. Crear repo GitHub `fromted` (o carpeta raíz en trabajo-grok/fromted) si no existe.  
   *Básico: carpeta del proyecto en GitHub.*  
   *Prog: `git init` / create repo; branch main.*

2. Crear estructura fija:  
   `fromted/sources/` · `fromted/src/` · `fromted/public/` · `fromted/inventory.json` · `fromted/manifest.sources.json`.

3. Escribir `manifest.sources.json` con entradas web prioritarias (assistant-ui, reachat, openclaw-web-interface, xyflow, svar-filemanager, mcp-ui, mdx-editor, react-web-speech, chatcn o shadcn-chatbot-kit).

4. Cada entrada del manifest debe tener: `id`, `official_repository`, `commit` o `branch` default a fijar en primera clone, `destination_path`, `paths[]` sparse.

5. Añadir workflow GitHub Actions `deterministic-sources.yml` (mismo patrón que agentes): clone → sparse → checkout → copy → verify → inventory.

6. No usar main/master ciego en updates posteriores: fijar SHA en inventory tras primer éxito.

7. Documentar en bitácora: “manifest web escrito”.

8. Ejecutar RUN INSTALL sources (Actions, no clone local sandbox Grok).

9. Verificar que `inventory.json` lista cada repo con SHA y estado SUCCESS/FAILED.

10. Si un repo opcional falla: LOG y NEXT (no abortar todo).

11. Si un repo crítico (assistant-ui o shell chat) falla: STOP y reportar error exacto.

12. Confirmar que OpenClaw / LiteLLM / Graphiti / Graphify / filebrowser **no** se re-clonan; solo referencias a inventory Command Center / agents.

13. Crear `fromted/src/styles/tokens.css` con variables: `--bg-matte`, `--text-primary`, `--accent-orange`, `--accent-blue`, `--accent-green`, `--chat-user`, `--chat-assistant`.

14. Crear `fromted/src/app` scaffold (Vite+React+TS **o** Next app router — elegir uno y no cambiar a mitad).

15. Checkpoint: structure + inventory OK → pasar Bloque 1.

**Tiempo bloque 0:** ~1 h.

---

### BLOQUE 1 — Shell visual base (tareas 16–35)

16. Aplicar fondo negro mate global en layout root.  
    *Básico: toda la app se ve oscura desde el primer pixel.*

17. Tipografía legible blanco/gris; no grises bajos ilegibles en móvil.

18. Layout principal: zona chat centro · sidebar izquierda (historial/agentes) · panel derecho colapsable (config/router después).

19. Top bar mínima: logo/texto FROMTED · estado conexión · botón settings.

20. Bottom input bar placeholder (aún sin wire API).

21. Botones primarios naranja solo en “Cargar / Descargar / Enviar” según tu regla.

22. Estado seleccionado = azul eléctrico (item activo historial o modelo).

23. Toast/notificación verde para éxito.

24. Responsive: sidebar colapsa en móvil (drawer).

25. No animaciones pesadas; transitions cortas.

26. Copiar de sources (openclaw-web o reachat) el layout de mensajes si existe; no redibujar a mano.

27. Mapear botones de tus fotos a componentes vacíos: New chat · Search historial · Attach · Voice · Stop · Model selector · Agent selector · Settings · Share · Copy.

28. Lista de botones documentada en `fromted/docs/BUTTONS.md` (trazabilidad fotos).

29. Dark class única; no dual light en v1 salvo toggle simple después.

30. Verificar contraste texto sobre fondo en viewport móvil 390px.

31. Commit: `shell: dark layout + tokens + button placeholders`.

32. Preview local `npm run dev`.

33. Screenshot checkpoint (para ti) antes de chat logic.

34. No implementar canvas ni router aún.

35. Checkpoint bloque 1 OK → Bloque 2.

**Tiempo bloque 1:** ~1–1.5 h.

---

### BLOQUE 2 — Chat funcional mínimo (tareas 36–70)

36. Integrar primitives de **assistant-ui** o **reachat** desde `sources/` (Message, Thread, Composer).

37. Wire Composer → estado mensaje usuario.

38. Render lista mensajes user/assistant con burbujas.

39. Markdown en respuestas (react-markdown o el del source).

40. Syntax highlight code blocks.

41. Streaming: consumir ReadableStream / SSE desde endpoint configurable.

42. Token a token append al mensaje assistant en curso.

43. Botón **Stop**: AbortController; cancela fetch y marca mensaje interrumpido.

44. Flag UI “procesando…” mientras stream activo.

45. Permitir escribir en input mientras procesa (no bloquear teclado) — interruptible UX.

46. Hook `useChatController` (nombre interno): send / stop / reset.

47. Variable entorno o settings: `ORCHESTRATOR_URL` / `LITELLM_URL`.

48. Request body mínimo: model, messages[], temperature, stream=true.

49. Error de red → toast rojo/neutro + mensaje en hilo “error de conexión”.

50. Empty state: texto corto “Escribe para empezar” sin ilustraciones pesadas.

51. Copy button por mensaje assistant (Clipboard API).

52. Copy fragmento selección (user-select + botón).

53. IDs estables por mensaje (uuid) para tags después.

54. No AI Council aún (solo un modelo stream).

55. No loop continuo aún (solo stream normal + stop).

56. Test manual: enviar “hola” contra mock o LiteLLM si hay key.

57. Commit: `chat: stream + stop + markdown + copy`.

58. Checklist 61 marcados UI: #1 #6 #7 #18 #23.

59. No Supabase obligatorio en v1: historial puede ser localStorage primero.

60. localStorage save mensajes por sessionId.

61. Cargar historial al montar.

62. Botón “nueva conversación” limpia hilo y nuevo sessionId.

63. Skeleton loading al reabrir historial largo (opcional corto).

64. Input multilínea Enter=enviar · Shift+Enter=nueva línea.

65. inputmode / enterkeyhint para móvil.

66. Commit: `chat: local history + new session`.

67. Checklist #3 parcial (persist local), #16 responsive ya de bloque 1.

68. Preview Vercel deploy preview branch.

69. URL preview enviada para tu prueba en móvil.

70. Checkpoint: chat usable de punta a punta → Bloque 3.

**Tiempo bloque 2:** ~2–3 h.

---

### BLOQUE 3 — Selector modelos / agentes / config (tareas 71–95)

71. Componente ModelSelector dropdown/lista.

72. Datos modelos: array config local + opcional GET `/registry` o LiteLLM `/models`.

73. Modelo activo en store; se envía en cada request.

74. UI seleccionado = azul eléctrico.

75. AgentSelector lateral (lista agentes desde config JSON).

76. Agente activo solo cambia system prompt o header `X-Agent` — no ejecuta kernel en UI.

77. Panel Settings: temperature slider · max tokens · toggle stream · tamaño texto 14/16/18.

78. Persist settings en localStorage.

79. System prompt editor modal (textarea) guardado por agente/modelo.

80. Checklist 61: #2 #5 #8 #10 #11 #46 parcial.

81. Integración “LiteLLM router” = URL base en settings (61 #15 UI).

82. Botones placeholder Claude Code / OpenRouter / HF = fichas deshabilitadas o deep link (61 #12–14 UI mínima).

83. Commit: `selectors: models agents settings`.

84. No implementar OAuth GitHub aún.

85. Health indicator simple: ping `/health` si existe → punto verde/gris (61 #31 UI).

86. Reconnect: reintento 3x en error stream (61 #29).

87. ErrorBoundary React alrededor del chat (61 #27).

88. Commit: `resilience: boundary health retry`.

89. Attach file button → guarda File en estado mensaje (aún sin upload server) (61 #36 parcial).

90. Voice button → react-web-speech transcript al input (61 #38).

91. Commit: `multimodal: attach voice stubs`.

92. Tags por mensaje: chips editables bajo burbuja (custom) (historial tags).

93. Search historial: input filtra session list por texto (61 #24 UI local).

94. Commit: `history: tags + search local`.

95. Checkpoint bloque 3 → demo interna completa web v1 mínima.

**Tiempo bloque 3:** ~2 h.

---

### BLOQUE 4 — Deploy y cierre web v1 (tareas 96–110)

96. Build production sin errores TypeScript críticos.

97. Env vars en Vercel: URLs API, no secrets en client si evitables.

98. Deploy producción o preview estable.

99. Probar en Android Chrome y desktop.

100. Lista de bugs UI en `fromted/docs/BUGS-V1.md`.

101. Actualizar TAREAS-EN-CURSO: Fase A cerrada.

102. Bitácora: referencia commit + URL preview.

103. NO empezar canvas hasta tu OK explícito post-demo.

104. Documentar qué 61 están UI-done vs pending EXT.

105. Freeze scope v1: chat+selector+settings+history+attach/voice stub.

106. Backup inventory.json en repo.

107. Tag git `fromted-web-v1`.

108. Tiempo total objetivo A0–A9 / bloques 0–4: **aprox 6–10 horas trabajo neto** repartidas, no “semanas”.

109. Si se atrasa: cortar tags/voice; priorizar stream+stop+selector.

110. Checkpoint usuario: aprobación para Bloque 5 (módulos) o correcciones v1.

---

### BLOQUE 5 — Módulos siguientes web (tareas 111–150) — solo tras OK v1

111. Panel archivos: montar svar-filemanager o Chonky desde sources; theme dark.

112. Anclar archivo → id en mensaje chat.

113. Panel router UI: lista conexiones + ficha (origen/destino campos).

114. Guardar fichas en localStorage/JSON; no ejecutar tools en UI.

115. Canvas: montar `@xyflow/react` desde sources; nodos placeholder.

116. Serializar grafo a JSON (export); motor fuera.

117. MCP panel: hooks use-mcp / mcp-ui; list tools remotos.

118. MD artifact: mdx-editor en drawer.

119. Kanban simple para cola visual (dnd-kit).

120. Pyodide panel: load runtime + run snippet + capturar stdout (filtro whitelist después).

121–150. Subtareas de wire theme, tests manuales, commits atómicos por módulo, actualización checklist 61, sin fusionar motores Graphiti en frontend.

*(Detalle fino 121–150 se expande al abrir bloque 5; no se ejecuta en paralelo a v1.)*

**Tiempo bloque 5:** por módulo 1–3 h.

---

### BLOQUE 6 — App local complemento (tareas 151–180) — fase separada

151. Flutter project `fromted_app`.

152. Integrar fllama o lib_llama_cpp.

153. Model Manager: download Gemma 1B Q4 GGUF + checksum.

154. AIEngine interface load/generate/stop/unload.

155. Session Controller: heuristic simple vs scale-to-web.

156. Chat UI flutter_chat_ui stream local.

157. OpenClaw Agent interface (lib), no HTTP interno.

158. Resource Governor básico (context size por RAM).

159. Event bus DI.

160–180. Memoria SQLite, plugins sandbox stubs, tests dispositivo real, store listing.

**Tiempo bloque 6:** días dedicados aparte; no cuenta en “horas web v1”.

---

### BLOQUE 7 — Diseño visual PASO 2 (tareas 181–200)

181. Re-leer fotos usuario.

182. Generar/ajustar mockups alineados a shell ya construido (no al revés).

183. Ajustar spacing/iconos a lista botones.

184. Documentar en PROYECTO-FROMTED-PASO-2.md.

185–200. Iteraciones visuales con tu feedback; sin reescribir lógica chat.

---

## TRAZABILIDAD

| Entregable | Doc |
|-------------|-----|
| Spec producto | PROYECTO-FROMTED.md |
| Catálogo URLs | PARTE-1-CATALOGO-SOURCES.md |
| Híbrido web/app | PARTE-2-HIBRIDO.md |
| 61 funciones | FROMTED-CHAT-61-FUNCIONES.md |
| Research | INVESTIGACION-1..5 |
| Este plan | PROYECTO-FROMTED-PLAN-DETALLADO.md |

---

## QUÉ PRESENTO PARA QUE APRUEBES

1. Métodos 1 y 2 aplicados.  
2. Cómo se diseña (fotos → tokens → copy sources → thin adapters).  
3. Tiempo (web v1 objetivo 6–10 h neto; demo chat en pocas horas tras download).  
4. Lista enumerada de tareas (1–110 ejecutables v1; 111+ diferidas).  
5. Bilingüe en cada bloque.  
6. Download OS primero.  
7. Sin sobreingeniería: v1 = chat+selector+settings+history.

**Espero corrección o “aprobado” para iniciar tarea 1.**
