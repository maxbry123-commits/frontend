# PROYECTO FROMTED — ESPECIFICACIÓN (CERRADA)

Fecha inicio: 2026-07-27  
Cerrada: 2026-07-27 20:45 -05  
Estado: **CERRADA / APROBADA** — no modificar salvo corrección explícita del usuario

Secuencia activa:
- PASO 1 (en curso): `PROYECTO-FROMTED-PASO-1.md` — investigación OS + sources deterministas
- PASO 2 (pendiente): `PROYECTO-FROMTED-PASO-2.md` — diseño visual / imágenes post-investigación

---

## 1. INPUT BLOCKS LITERALES (leer sin resumir)

### 1.1 Input arquitectura UI-only (usuario)

```
La idea es que el sistema sea solo una INTERFACE no mezclar en backend con la ui porque el router y un sistema de auditoría de Documentos y el sistema de automatizacion cada uno funcionara como un orquestador como un micro servicio que se conecta a la INTERFACE no es parte de la interface

Módulo principales

1. Panel de configuración
2. Chat de Ai y agentes que te doy lo que lleva
3. Módulos para agregar funciones
4. Panel de automatizacion va ser una fusión entre graphiti y grapify y obsidian y sistema de loop y n8n que vamos a fusionar y diseñar
5. Panel de el router
6. Paneles de orquestador de auditoria

7. Usa ui de Open claw y módulos de anthropy y fotos para descargar la ui que se pueda convertir y funcionar en Android iOS y Windows y linux la ui debe poder tener un creador de sandbox personalizados debe poder tener selector de agente y modelos y debe poder correr Gemma 4 e2b embebida dentro del ui respondiendo como MAXBRY debes buscar la manera que pueda correr Linux dentro de la misma ui y el sandbox y que pueda procesar python ejecutable dentro de la misma ui

De hay puedes tomar de ese archivo algunos sistema para diseñar parte del fromted

Recuerda tu misión es crear el fromted como INTERFACE no es crear los sistema que operan la UI es como una interface con mínimo backend porque todo los sistemas y micro servicios corren fuera nada corre dentro del UI todo solo se conecta con API MCP code puentes o lo que sea pero los kernel y el workflow vive fuera de la UI
```

### 1.2 Input explicación proyecto FROMTED (usuario — 7 puntos)

```
1. Es una interface independiente que sirve como router como puente para todos los proyectos — sistema independiente, solo conexiones, sin backend extenso.
2. Web y uso móvil como app.
3. UI descargable tipo Anthropic / Grok / OpenClaw; Android iOS Windows Linux.
4. Modular: + añade botón; + selector crea ventana con funciones marcadas + code + conexiones.
5. Automatización: fusión Graphiti+Graphify+Obsidian+loops+n8n; anclar docs e instrucciones; 10 loops; 3–30 hasta 1000 pasos; hasta 50 procesos.
6. Router en 3 paneles: lista conectados; ficha N orígenes → N destinos (AI, API key, token, LiteLLM, HTTPS, MCP…).
7. Auditor docs: panel estilo Anthropic + ventana archivos estilo iOS; anclar y compartir con chat y automatización.
```

### 1.3 Visual + funciones

Fondo negro mate / grises; letras blanco; cargar/descargar naranja; seleccionado azul eléctrico; notificaciones verde; chat 5 colores (default 2 grises). Historial con buscador, tags, lupa AI/humano, copiar/compartir/editar/seleccionar. Loop output continuo. Interrupt mientras se escribe. AI Council. Sandbox code con filtro in/out. Audio. Subida docs. MD + artefactos.

### 1.4 Método

Plan con 2 métodos (doc proyecto + arquitectura). Pasos detallados. Código OS fuerte, no desde 0. Ahorro tokens. Fotos antes de diseñar. ≥20 repos. Plan bilingüe. Aprobación antes de construir.

---

## 2. DEFINICIÓN

FROMTED = solo INTERFACE (paneles + cliente API/MCP/HTTPS). Router, auditoría, automatización y kernels = microservicios externos.

## 3–9. Módulos, visual, botones, capacidades, OS strategy

Ver versión completa histórica en commit de especificación; reglas de producto no cambian. Construcción sigue PASO 1 → PASO 2.

## 10. Trazabilidad

| Doc | Rol |
|------|-----|
| PROYECTO-FROMTED.md | Spec cerrada |
| PROYECTO-FROMTED-PASO-1.md | Investigación + sources (activo) |
| PROYECTO-FROMTED-PASO-2.md | Diseño visual post-investigación |
| TAREAS-EN-CURSO.md | Solo lo en curso |
| BITACORA-RESUMEN.md | Referencias hitos |
