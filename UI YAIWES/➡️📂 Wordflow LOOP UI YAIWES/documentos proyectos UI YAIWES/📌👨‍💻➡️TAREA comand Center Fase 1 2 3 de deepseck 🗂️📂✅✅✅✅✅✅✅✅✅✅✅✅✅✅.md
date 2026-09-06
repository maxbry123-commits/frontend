# 💬 UI YAIWES — ESPECIFICACIÓN FUNCIONAL DEL CHAT

Documento depurado por auditoría forense X-Ray. Este archivo conserva únicamente funciones implementables en el chat y software no-agente que aporta capacidades directas al chat. Se eliminó información de cuentas, fases administrativas, laboratorios, entrenamiento, despliegues y arquitectura no funcional para la interfaz conversacional.

## BLOQUE A — CHAT BASE

1. **Chat de texto con input multilínea** — Campo principal para escribir mensajes, prompts e instrucciones extensas en varias líneas. Implementación prevista: componente `ChatInput`.
2. **Selector visual de modelos** — Permite escoger el modelo usado por la conversación y mantener la selección en estado global. Implementación: `ModelSelector` + Zustand.
3. **Historial persistente** — Guarda conversaciones y mensajes para recuperarlos después de cerrar o recargar el chat. Implementación: Supabase.
4. **Selección y copia de respuestas del asistente** — Permite seleccionar texto de las respuestas y copiarlo directamente sin bloquear la selección.
5. **System Prompt personalizable** — Editor para definir instrucciones permanentes del modelo y persistirlas. Implementación: `SystemPromptEditor` + Supabase.
6. **Streaming token por token** — Muestra la respuesta progresivamente mientras llega desde el backend. Implementación: `fetch` + `ReadableStream`.
7. **Botón Stop de generación** — Cancela una respuesta que todavía se está generando. Implementación: `AbortController`.

## BLOQUE B — CONFIGURACIÓN DEL CHAT

8. **Panel de parámetros de generación** — Configura streaming, idioma, máximo de tokens y temperatura desde la interfaz. Implementación: `ChatSettings` + Zustand.
9. **Modo oscuro/claro** — Alterna la apariencia visual del chat. Implementación: Tailwind `darkMode: class`.
10. **Idioma de respuesta** — Envía al backend el idioma seleccionado para controlar la respuesta del modelo.
11. **Tamaño de texto configurable** — Permite seleccionar tamaños de 14, 16 o 18 px mediante estado global y clases dinámicas.

## BLOQUE C — CONECTIVIDAD DEL CHAT

12. **Conexión con Claude Code** — Acceso desde el chat mediante botón de enlace externo según el diseño original.
13. **Conexión con OpenRouter** — Permite utilizar modelos de OpenRouter mediante proxy backend.
14. **Conexión con Hugging Face Spaces** — Permite enviar solicitudes desde el chat a servicios desplegados en HF Spaces mediante proxy.
15. **Conexión con LiteLLM Router** — Permite que el chat use LiteLLM como capa de ruteo entre diferentes proveedores/modelos.

## BLOQUE D — UI/UX DEL CHAT

16. **Responsive mobile-first** — Adapta automáticamente el chat a móvil, tablet y escritorio mediante breakpoints de Tailwind.
17. **Loading states con skeleton** — Muestra estados visuales mientras se cargan respuestas, datos o paneles.
18. **Markdown + syntax highlighting** — Renderiza Markdown y código con resaltado de sintaxis. Implementación: `react-markdown` + `prismjs`.
19. **Teclado virtual optimizado** — Ajusta `inputmode`, `enterkeyhint` y comportamiento de Enter para móvil.
20. **Sistema visual centralizado** — Mantiene estética, espaciado, tipografía y estados visuales desde configuración Tailwind.
21. **Burbujas usuario/asistente** — Diferencia visualmente mensajes enviados por el usuario y respuestas del asistente.
22. **Input negro mate con glow cyan** — Efecto visual previsto para el cuadro de entrada mediante PixiJS/CSS.
23. **Botones de copia** — Copia respuestas completas o fragmentos concretos usando Clipboard API.

## BLOQUE E — HISTORIAL Y DOCUMENTOS

24. **Búsqueda en historial** — Localiza conversaciones o mensajes persistidos mediante consultas Supabase `ilike`.
25. **Exportar conversación a Markdown/PDF** — Genera archivos reutilizables a partir del historial. Implementación: Markdown + jsPDF.
26. **Auto-save cada 30 segundos** — Guarda automáticamente estado y contenido del chat mediante temporizador + Supabase.

## BLOQUE F — ERRORES, CONECTIVIDAD Y DISPONIBILIDAD

27. **Error handler global** — Evita que un fallo de un componente derribe toda la aplicación. Implementación: React `ErrorBoundary`.
28. **Rate-limit handler** — Detecta límites de proveedor y permite aplicar una respuesta controlada desde el backend proxy.
29. **Reconexión automática** — Reintenta conexión cuando el backend o proveedor falla temporalmente.
30. **Keep-alive de servicios HF** — Mantiene disponibles servicios utilizados por el chat mediante UptimeRobot.
31. **Health check propio** — Endpoint `/health` para verificar disponibilidad del backend conectado al chat.
32. **Logs centralizados** — Registra errores y eventos del chat/backend en un punto común. Implementación prevista: Loguru.
33. **CORS configurado** — Controla comunicación entre frontend y backend mediante middleware de FastAPI.

## BLOQUE G — SEGURIDAD

34. **Acceso sin autenticación tradicional mediante URL privada** — Política prevista en el diseño original para acceso público limitado por URL/configuración HF.
35. **Variables de entorno seguras** — Mantiene API keys y secretos fuera del frontend utilizando HF Secrets/variables de entorno.

## BLOQUE H — MULTIMODAL Y ARCHIVOS

36. **Input de imágenes** — Permite adjuntar imágenes desde el chat. Implementación: `react-dropzone`.
37. **Input de audio** — Permite adjuntar archivos de audio. Implementación: `react-dropzone`.
38. **Entrada de voz en vivo** — Captura audio directamente del micrófono. Implementación: MediaRecorder API.
39. **Anclar archivos a tareas** — Relaciona archivos concretos con tareas/mensajes y los conserva mediante Supabase Storage.
40. **Output PDF/DOCX/Markdown** — Permite generar documentos desde resultados del chat. Implementación: jsPDF + `docx`.

## BLOQUE I — KNOWLEDGE BASE

41. **Base de conocimiento** — Permite almacenar y consultar conocimiento desde el chat usando Supabase + pgvector.
42. **Embeddings automáticos** — Convierte contenido en vectores para búsqueda semántica. Implementación prevista: LangChain.
43. **Recuperación semántica** — Recupera fragmentos relacionados por significado mediante Supabase RPC/pgvector.

## BLOQUE J — CONFIGURACIÓN DE IA Y AGENTES DESDE EL CHAT

44. **Ventana “Agregar AI” sin código** — Modal para registrar/configurar una IA sin editar archivos manualmente.
45. **Agregar agentes vía API** — Modal para registrar servicios/agentes accesibles mediante API.
46. **Selector lateral de agentes** — Permite elegir desde la interfaz qué agente o servicio utilizar. Implementación: React + Zustand.

## BLOQUE K — EJECUCIÓN Y VERIFICACIÓN EN CADENA

47. **Verificación en cadena DSL/JSON** — Ejecuta y valida tareas siguiendo una cadena estructurada.
48. **Configuración mediante `langgraph.json`** — Permite definir la cadena de ejecución mediante un archivo JSON de configuración.
49. **Botón Ejecutar Tareas en Cadena** — Inicia el flujo desde el chat y consulta su estado mediante polling.

## BLOQUE L — COLA DE TAREAS

50. **Cola persistente de tareas** — Conserva tareas en Supabase incluso si el chat se recarga.
51. **Prioridades y reintentos** — Cada tarea puede incluir nivel de prioridad y política de reintento.
52. **Notificaciones Telegram** — Envía avisos externos sobre estado/resultados de tareas iniciadas desde el chat.
53. **Scraping con Playwright** — Permite delegar desde el chat tareas de navegación/scraping a un servicio separado basado en Playwright.
54. **Dependencias entre tareas** — Permite representar relaciones y bloqueos entre tareas mediante JSONB.
55. **Supervisor de cola** — Revisa tareas pendientes, bloqueadas o reintentables desde un proceso de backend.

## BLOQUE M — TAREAS, PROYECTOS Y ESTADO

56. **Ventana de tarea con formato preestablecido** — Formulario para crear tareas siguiendo una estructura definida.
57. **Motor Python + DSL + JSON** — Procesa órdenes estructuradas con FastAPI + Pydantic.
58. **Ventana global de tareas pendientes** — Muestra todas las tareas abiertas con filtros.
59. **Selector de proyectos GitHub** — Permite elegir el repositorio/proyecto sobre el que se trabajará.
60. **Conectar repositorios GitHub** — Vincula repositorios mediante GitHub OAuth/API.
61. **Blocs de notas + carpetas + pizarra `state.json`** — Mantiene tres blocs de notas, carpetas de proyecto y estado operativo persistente en Supabase.

## BLOQUE N — API HEALTH Y FAILOVER

62. **Estado visual de salud por API key** — Muestra la salud de cada key con estados y barra visual.
63. **Key activa por plataforma** — Indica qué key está atendiendo actualmente las solicitudes.
64. **Contador de requests por key** — Muestra cuántas peticiones procesa cada key.
65. **Failover manual** — Botón “Forzar failover” para cambiar manualmente de una key a otra.
66. **Último error registrado** — Expone en el panel el error más reciente de cada API/key.
67. **Actualización de salud cada 30 segundos** — Refresca el panel automáticamente mediante polling a `GET /api/health/keys`.
68. **Selector dinámico de modelos** — Obtiene la lista de modelos desde Model Registry en lugar de una lista hardcodeada.
69. **Modelos agrupados por proveedor** — Organiza el selector por proveedor para facilitar navegación y selección.
70. **Modo AUTO de selección de modelo** — Permite que el router seleccione automáticamente el modelo según el tipo de tarea.

## BLOQUE O — CAPACIDADES ADICIONALES DE SOFTWARE NO-AGENTE

71. **Lienzo visual de nodos** — React Flow aporta un canvas interactivo para representar flujos, conexiones y nodos vinculados a tareas del chat.
72. **Editor visual de JSON/flujo** — Rete.js aporta edición visual de estructuras y conexiones relacionadas con tareas/configuración.
73. **Efectos visuales acelerados** — PixiJS aporta glow, partículas y efectos de interfaz para estados activos del chat.
74. **Animaciones avanzadas de interfaz** — GSAP permite transiciones y animaciones controladas en paneles, mensajes y estados.
75. **Sistema de iconos del dashboard** — Lucide Icons aporta iconografía consistente para acciones, estados y controles.
76. **Notificaciones internas tipo toast** — Toastify permite mostrar confirmaciones, errores, avisos y estados sin interrumpir la conversación.
77. **Drag & drop de tareas** — SortableJS permite reordenar visualmente la cola de tareas mediante arrastrar y soltar.
78. **Gráficas de salud y estado** — Chart.js representa métricas del panel API Health y otros estados del sistema.
79. **Actualización manual del catálogo de modelos** — El Model Registry expone `POST /refresh` para refrescar el catálogo sin reiniciar el chat.
80. **Filtrado del catálogo por proveedor** — El endpoint `GET /registry/{provider}` permite consultar únicamente modelos de un proveedor.
81. **Scoring automático de salud 0–100** — El API Health Predictor calcula salud usando latencia, errores, reintentos e inestabilidad.
82. **Failover automático por umbral** — El router cambia automáticamente de key cuando la salud cae por debajo del umbral configurado.
83. **Round Robin multi-key** — Permite distribuir solicitudes entre varias keys disponibles y pasar a otra cuando una falla.
84. **Registry normalizado y cacheado** — Unifica modelos de distintos proveedores en un JSON común para que el selector trabaje con un formato estable.
85. **Aislamiento de datos mediante RLS** — Las políticas Row Level Security de Supabase protegen tablas de conversaciones, mensajes, prompts, tareas, pizarra, notas y carpetas utilizadas por el chat.

## SOFTWARE NO-AGENTE CONSERVADO PORQUE APORTA FUNCIONES DIRECTAS AL CHAT

- **React + ReactDOM** — motor de la interfaz.
- **Vite** — entorno/build del frontend.
- **Zustand** — estado global del chat, modelos y configuración.
- **Tailwind CSS** — responsive, dark mode y estilos dinámicos.
- **Supabase JS** — historial, mensajes, prompts, cola, notas, carpetas, pizarra y storage.
- **Supabase pgvector** — base de conocimiento y recuperación semántica.
- **React Flow** — lienzo de nodos y flujos.
- **Rete.js** — editor visual de estructuras JSON/flujo.
- **PixiJS** — efectos visuales y glow.
- **GSAP** — animaciones avanzadas.
- **Lucide Icons** — iconos del dashboard/chat.
- **Toastify** — notificaciones internas.
- **SortableJS** — drag & drop de tareas.
- **Chart.js** — gráficas del panel API Health.
- **react-markdown + PrismJS** — Markdown y resaltado de código.
- **react-dropzone** — carga de imágenes/audio/archivos.
- **MediaRecorder API** — captura de voz en vivo.
- **Clipboard API** — copia de respuestas y fragmentos.
- **jsPDF + docx** — generación de PDF/DOCX.
- **FastAPI + Pydantic** — backend tipado para DSL/JSON y endpoints del chat.
- **Cloudflare Workers** — proxy, enrutamiento, autenticación ligera y CORS entre frontend y backend.
- **LiteLLM** — ruteo unificado de proveedores/modelos.
- **UptimeRobot** — keep-alive de servicios usados por el chat.
- **Loguru** — logs centralizados del backend.
- **GitHub OAuth/API** — conexión y selección de repositorios desde la interfaz.

## RESULTADO DE LA DEPURACIÓN

**Total funcional documentado: 85 capacidades del chat.**

Este archivo queda limitado exclusivamente a funcionalidades del chat, sus mecanismos de implementación y software no-agente que aporta directamente una capacidad a la interfaz conversacional.