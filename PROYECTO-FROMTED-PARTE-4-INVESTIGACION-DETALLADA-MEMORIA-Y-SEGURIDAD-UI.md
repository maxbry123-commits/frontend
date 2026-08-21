# FROMTED PARTE 4 — INVESTIGACIÓN DETALLADA: MEMORIA LOCAL DEL USUARIO + SEGURIDAD IP DE NUESTRA UI

Fecha: 2026-07-28 02:20 -05  
Estado: DOCUMENTO LARGO DE TRABAJO — no es un resumen ejecutivo  
Propósito: auditable y refutable punto por punto

---

# BLOQUE A — ALINEACIÓN CON TU INPUT (SIN ACORTAR EL SENTIDO)

## A.1 Memoria

Tú definiste un Memory Runtime con motores especializados. La UI no escribe en SQLite ni en archivos a mano: consume una API local (`memory.store`, `memory.load`, `memory.search`, `memory.update`, `memory.delete`, `memory.history`, `memory.snapshot`, `memory.restore`, `memory.sync`, y en la práctica también `memory.buildContext`).

El pipeline de escritura que diste es determinista:

store → Transaction → Validate → Index → Vectorize → Commit → Return ID

El Storage Adapter se programa contra una interfaz `StorageProvider` con open, close, read, write, update, delete, search, list, transaction, snapshot. Las implementaciones posibles que listaste (SQLite, DuckDB, File, Xata, Drive, S3) existen como **adapters**. En nuestro producto la decisión de producto es:

- El adaptador por defecto escribe en el **dispositivo del usuario**.
- Xata/Drive/S3 solo si el **usuario** conecta **su** cuenta; nosotros no operamos un servicio de “memoria hospedada MAXBRY” como producto de almacenamiento.

Cada memoria es un objeto tipado (id, type, title, created, updated, tags, summary, embedding, relations, chunks). Los documentos grandes no se guardan enteros: el Chunk Engine parte en trozos con chunk_id, document_id, tokens, embedding, offset. 

## A.2 Dónde corre la memoria (regla de producto)

La UI que el usuario **descarga o instala** ejecuta el Memory Runtime **en su smartphone o PC**. El almacenamiento de **sus** datos es 100% en su dispositivo o en una nube **que él elija**. Nosotros no ofrecemos el servicio de guardar su memoria en nuestro VPS como producto central.

## A.3 Seguridad que pediste (no confundir con el vault del usuario)

La seguridad de esta investigación **no** es “proteger los datos del cliente en nuestros servidores”. Es proteger **nuestro sistema cerrado**: la programación interna de la UI, el agente, el pipeline de decisión, la propiedad intelectual del producto que el usuario descarga pero **no** puede (fácilmente) copiar, modificar o extraer para clonar MAXBRY/FROMTED.

Y el límite técnico: no existe protección 100% frente a alguien con control total del dispositivo; el objetivo es elevar el costo del ataque combinando capas.

---

# BLOQUE B — SISTEMAS COMERCIALES PARECIDOS

## B.1 Kimi Work / Kimi Desktop

Kimi ofrece aplicaciones de escritorio descargables. El cliente puede manipular archivos locales y tareas. La inferencia grande puede ir a la API cloud. Implicación: UI + runtime local de herramientas; inteligencia premium como servicio.

## B.2 Claude Desktop

Claude Desktop empaqueta chat y modos de trabajo en aplicación de escritorio, con acceso autorizado a carpetas locales y conectores.

## B.3 Cursor / Windsurf

Aplicaciones desktop con agentes y backend cloud. Electron/ASAR no debe considerarse secreto por sí solo.

## B.4 On-device mobile

La línea on-device refuerza privacidad, latencia, coste y operación offline.

## B.5 Patrón común

1. Usuario instala cliente.
2. UI es de marca.
3. Herramientas y memoria de sus archivos viven en su dispositivo.
4. Modelo grande/orquestación premium = servicio de pago.
5. Código del planner/agente comercial no se publica.

---

# BLOQUE C — SISTEMA DE MEMORIA

El Memory Runtime se entrega dentro del paquete que instala el usuario. En web instalable puede usar OPFS/SQLite WASM; en app nativa usa almacenamiento SQLite nativo. Los proveedores de nube son destinos elegidos por el usuario.

### Pipeline de escritura

1. Validate.
2. Transaction open.
3. Chunk.
4. Vectorize.
5. Index.
6. Commit.
7. Return ID.

### Lectura

Cache → keyword search → vector search → relations → merge/dedupe → ranking → carga de chunks → compresión → contexto.

El modelo LLM nunca accede directamente al StorageProvider.

---

# BLOQUE D — SEGURIDAD IP

La UI y el Engine deben estar separados. La lógica crítica puede compilarse a Rust/C++/Swift/Kotlin; pueden aplicarse ofuscación, integridad, sandboxing y hardware-backed keys. Estas capas aumentan el coste de extracción, pero no prometen imposibilidad absoluta.

## Licencia y pago

Las funciones premium se habilitan con tokens firmados por el backend. Nunca poner el único gate de cobro en un booleano JS.

## Límite técnico

Con control root del dispositivo y tiempo ilimitado, un laboratorio puede instrumentar RAM y reconstruir comportamiento. La defensa busca impedir una extracción trivial.

---

# BLOQUE E — MOBILE-FIRST

Packaging prioritario Android/iOS, UI táctil, engine nativo ARM64, memoria local y escalado al servicio cloud cuando el razonamiento lo requiera.

---

# BLOQUE F — PLAN DE PROGRAMACIÓN

1. Definir tipos MemoryRecord y Chunk.
2. Implementar Worker de memoria.
3. Implementar store/search/buildContext.
4. Conectar panel docs y chat.
5. Añadir snapshot/export.
6. Portar contrato a Flutter/Tauri.
7. Extraer lógica crítica a engine nativo.
8. Implementar IPC mínimo.
9. Pipeline release y firmas.
10. License client + attestation.

---

# BLOQUE G — CRITERIOS DE ACEPTACIÓN

Memoria: no subir silenciosamente el vault; restore verificable; buildContext con citas existentes.

IP: no dejar el grafo completo de decisión del agente en texto claro; integridad del binario; rechazo de rutas premium sin licencia válida.

---

# BLOQUE H — FUENTES TÉCNICAS

OPFS, SQLite WASM, búsqueda vectorial browser, Web Crypto, Electron ASAR integrity, protección nativa y referentes comerciales Kimi/Claude/Cursor/on-device.

FIN DEL DOCUMENTO DETALLADO.