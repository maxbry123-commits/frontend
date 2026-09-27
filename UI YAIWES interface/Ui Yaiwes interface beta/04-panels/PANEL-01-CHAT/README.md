# PANEL-01 — Chat operativo

## Estado

`PROTOTYPE / FRONTEND FUNCTIONAL / BACKEND BOUNDARY`

## Salidas normativas

Este panel se entrega siempre en dos formas:

1. `index.html` autocontenido: snapshot funcional, respaldo y referencia desplegable directa en Chrome.
2. `src/`: fuente separada y editable para seguir desarrollando sin romper otras piezas.

Flujo obligatorio:

```text
Diseño en Manus → HTML funcional → código fuente modular → versión → siguiente pieza
```

## Cómo abrir

Abrir `index.html` directamente en Chrome, Edge o Firefox. No usa `<canvas>` ni dependencias externas.

## Funciones frontend reales

- crear chat local;
- cambiar conversación;
- renombrar chat;
- escribir y enviar mensajes al hilo local;
- abrir selector real de archivos;
- abrir selector real de imágenes;
- previsualizar adjuntos;
- retirar adjuntos;
- grabar audio mediante `MediaRecorder` cuando el navegador concede permiso;
- cambiar tema Matte/Glass;
- exportar JSON;
- limpiar conversación con confirmación;
- mostrar estados y bitácora local;
- responsive móvil/escritorio;
- navegación sin `<canvas>`.

## Frontera backend

La UI no inventa respuestas de IA cuando el bridge no existe. En ese caso registra `BRIDGE_REQUIRED`.

### Comandos que debe existir detrás

| Comando | Entrada mínima | Resultado esperado |
|---|---|---|
| `send_message` | `conversationId`, `text`, `attachments`, `mode` | eventos `run.started`, `run.delta`, `run.completed` o `run.failed` |
| `upload_file` | `conversationId`, `fileRef`, `mime`, `size` | `file.accepted` o `file.rejected` |
| `transcribe_audio` | `conversationId`, `audioRef`, `mime` | `transcription.completed` o `transcription.failed` |
| `cancel_run` | `conversationId`, `runId` | `run.cancelled` |

### Contrato de eventos

```json
{"type":"YAIWES_EVENT","panelId":"PANEL-01","windowId":"CHAT-01","event":"run.delta","runId":"...","payload":{}}
```

El frontend debe recibir eventos y actualizar `StateStore`. No debe llamar proveedores directamente.

## Componentes y referencias usadas

- HostShell visual del proyecto.
- Tokens Matte/Little/Blanco de FROMTED.
- Patrones observados en las 158 imágenes actuales: chat móvil oscuro, composer persistente, selector de modo, adjuntos, menús, estados, tarjetas de archivo y paneles técnicos.
- `assistant-ui` queda como candidato de integración futura; este primer corte usa HTML/CSS/JS nativo para mantener el prototipo portable.

## Próximas pruebas

- [ ] conectar `Action Bus` real;
- [ ] conectar `WindowRegistry`;
- [ ] validar manifest con `Manifest Schema`;
- [ ] integrar eventos backend reales;
- [ ] pruebas Playwright;
- [ ] auditoría `axe-core`;
- [ ] aprobar con `OK PANEL-01-CHAT`.

## No tocar

- originales de `01-original/`;
- fotos de referencia;
- backend;
- router;
- memoria interna backend;
- proveedores.
