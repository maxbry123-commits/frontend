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

Index Manager mantiene índices separados (hash, path, date, project, conversation, embedding, keyword, tag). Cache Manager usa capas (RAM LRU, luego disco del dispositivo). Context Builder hace search → ranking → relations → merge → dedupe → compress → context para el modelo. Relation Graph enlaza conversation/project/code/document/task/decision. Snapshot Manager y Transaction Log permiten recuperar estado. Sync Manager no sube la base entera: solo diffs de transacciones, y en nuestro diseño ese sync hacia **nuestra** infra está apagado por defecto.

## A.2 Dónde corre la memoria (regla de producto)

La UI que el usuario **descarga o instala** ejecuta el Memory Runtime **en su smartphone o PC**. El almacenamiento de **sus** datos es 100% en su dispositivo o en una nube **que él elija**. Nosotros no ofrecemos el servicio de guardar su memoria en nuestro VPS como producto central.

El ~80% del procesamiento asociado a indexar, embeber, buscar y cifrar/descifrar su vault ocurre en **su** hardware (CPU/NPU/GPU del device), en Web Workers o en procesos nativos de la app, no en un cluster nuestro de “memoria SaaS”.

## A.3 Seguridad que pediste (no confundir con el vault del usuario)

La seguridad de esta investigación **no** es “proteger los datos del cliente en nuestros servidores”. Es proteger **nuestro sistema cerrado**: la programación interna de la UI, el agente, el pipeline de decisión, la propiedad intelectual del producto que el usuario descarga pero **no** puede (fácilmente) copiar, modificar o extraer para clonar MAXBRY/FROMTED.

Tú listaste capas industriales:

1. Compilar lógica crítica a nativo (C/C++, Rust, Swift, Kotlin), no dejar el cerebro en JavaScript plano.  
2. Ofuscación avanzada (rename, control-flow flattening, virtualización, cifrado de strings, código auto-modificable).  
3. VM personalizada (bytecode propio + intérprete; VMProtect-class).  
4. Cifrado del módulo en disco; descifrado en RAM solo al ejecutar.  
5. Protección de memoria (wipe de secretos, no dejar claves/modelos enteros).  
6. Anti-debugging (debugger, hooks, Frida-class).  
7. Anti-tamper (integridad del binario; si se modifica, se degradan funciones).  
8. Protección del modelo de IA si hay pesos propios (cifrar, cargar por partes).  
9. Módulos aislados (proceso sandbox; UI solo mensajes).  
10. Hardware-backed keys (Keystore/StrongBox, Secure Enclave, TPM).

Y el límite que tú mismo marcaste: **no existe protección 100%** frente a alguien con control total del dispositivo; el objetivo es **elevar el costo** del ataque de horas a semanas/meses combinando capas.

Arquitectura que diste:

UI → Motor de ejecución → Sandbox → VM personalizada → Código cifrado → Memoria protegida

La parte crítica (motor de agentes, lógica de decisión, pipeline interno) se distribuye como módulo compilado y protegido; la UI es interfaz.

---

# BLOQUE B — SISTEMAS COMERCIALES PARECIDOS (INVESTIGACIÓN)

## B.1 Kimi Work / Kimi Desktop (Moonshot)

Kimi ofrece aplicaciones de escritorio descargables (macOS Apple Silicon, Windows). El usuario instala un cliente. Ese cliente puede manipular archivos locales, navegador, tareas programadas. La inferencia del modelo grande a menudo sigue yendo a la API cloud de Moonshot; “local” significa sobre todo **donde ocurren las acciones y herramientas**, no necesariamente que el modelo de un billón de parámetros viva offline en el portátil. Cobran por suscripción y por capacidad de enjambres de agentes en tiers altos. El núcleo del producto no se publica como open source de verdad para clonar el negocio.

Implicación para nosotros: el usuario descarga una **app**; paga por **servicio** (modelos, agentes, cuota); el código del orquestador comercial es **cerrado**; los archivos del usuario se tocan en **su** máquina con permisos explícitos.

## B.2 Claude Desktop (Anthropic)

Claude Desktop empaqueta una experiencia de chat y modos de trabajo (Cowork/Code) en aplicación de escritorio. Puede trabajar sobre carpetas locales que el usuario autoriza. La inferencia es de pago vía API Anthropic (o despliegues enterprise en cloud del cliente). En modos documentados, el historial puede residir en el dispositivo. Hay conectores locales vs remotos. Producto cerrado.

Implicación: UI + runtime local de herramientas; inteligencia de modelo en cloud de pago; datos de proyecto del usuario en su disco cuando trabaja “local”.

## B.3 Cursor / Windsurf (IDE agentes)

Son aplicaciones desktop basadas en stack tipo VS Code/Electron. El usuario descarga el IDE. El agente indexa y razona con mucho backend cloud. En disco local aparecen bases, trayectorias, a veces cifradas de forma que la comunidad ha llegado a documentar debilidades (claves globales, protobufs). Electron empaqueta JavaScript en ASAR: **ASAR no es secreto**; sin bytecode/integrity, extraer lógica es barato. Hay literatura de ataques de inyección y de integridad incompleta en el ecosistema Electron.

Implicación para nosotros: **no** copiar el modelo “todo el cerebro en JS dentro de ASAR” si queremos IP seria. Si algún día hubiera capa Electron, haría falta V8 bytecode + fuses de ASAR integrity, y aun así el motor crítico debería estar fuera de JS.

## B.4 On-device mobile (Gemini Nano / DeviceAI / apps GGUF Flutter)

Existe una línea de producto donde el teléfono ejecuta modelos pequeños on-device (privacidad de **datos del usuario**, latencia, coste). Eso refuerza la apuesta “el móvil es el PC de trabajo”, pero resuelve otro problema: privacidad de datos y offline. Nosotros además necesitamos **cerrar** el código del agente comercial.

## B.5 Patrón común que adoptamos

1. Usuario **instala** cliente (prioridad móvil, también desktop).  
2. UI es de la marca (cerrada).  
3. Herramientas y memoria de **sus** archivos viven en **su** dispositivo.  
4. Modelo grande / orquestación premium = **servicio de pago**.  
5. El código del planner/agente comercial **no** se publica.

---

# BLOQUE C — MEMORIA: QUÉ VAMOS A HACER EN DETALLE

## C.1 Principio de implementación

El Memory Runtime se entrega **dentro del paquete que el usuario instala**. No es un microservicio nuestro con disco multi-tenant de memorias de clientes.

Flujo físico:

1. Usuario instala FROMTED (PWA instalada o app nativa).  
2. Al primer uso, el runtime crea un almacén en el sandbox del sistema (OPFS en web, o directorio de aplicación en Android/iOS/desktop).  
3. Todas las llamadas `memory.*` se resuelven en proceso local (main + Worker o proceso nativo).  
4. Si el usuario quiere backup, exporta un vault cifrado o conecta **su** proveedor; nosotros no somos el destino por defecto.

## C.2 StorageProvider — implementación concreta

### C.2.1 Interfaz (igual a tu contrato mental)

Se define TypeScript/Rust trait con: open, close, read, write, update, delete, search, list, transaction, snapshot.

### C.2.2 Provider por defecto en PWA/web instalable

**OpfsSqliteProvider** (o IDB cifrado en una v0 más corta):

- Se usa `@sqlite.org/sqlite-wasm` o `wa-sqlite` con backend **OPFS**.  
- Corre dentro de un **Web Worker** porque los handles síncronos de OPFS y el motor SQLite no deben bloquear el hilo de UI.  
- El hilo principal solo hace RPC (Comlink o postMessage tipado) hacia el worker: `memory.store(...)`.
- Headers de aislamiento cruzado (COOP/COEP) pueden ser necesarios según el build de SQLite OPFS; eso se configura en el host que **sirve el instalable** (Vercel/CF solo sirven estáticos; el dato sigue en el browser del usuario).

Por qué OPFS y no solo localStorage: localStorage es pequeño y síncrono en main thread; OPFS permite archivos grandes y acceso por offsets; SQLite encima da índices, transacciones y queries que tu Index Manager necesita sin inventar un motor SQL a mano.

### C.2.3 Provider en app nativa (móvil prioritario)

En Android/iOS/desktop nativo el mismo `StorageProvider` se implementa con SQLite nativo (Room/GRDB/sqlx) sobre el directorio privado de la app. La API `memory.*` no cambia; solo cambia el adapter. Eso es lo que permite “programar una vez el contrato” y no reescribir el chat cada vez.

### C.2.4 Providers de nube del usuario

`DriveProvider`, `S3Provider`, `XataProvider` se implementan como destinos de **Sync Manager / export**, no como store primario obligatorio. Credenciales = del usuario. Nuestro código solo habla el protocolo; no guardamos una copia maestra en nuestro VPS.

## C.3 Pipeline de escritura (detalle de programación)

Cuando la UI llama `memory.store(input)`:

1. **Validate** — schema (zod o equivalente): type, title, tags, tamaño máximo, tipos MIME permitidos.  
2. **Transaction open** — se escribe una entrada en el transaction log local con status `pending` y un tx id.  
3. **Chunk** — si hay documento, se parte por tamaño de tokens objetivo (por ejemplo 512) con overlap opcional; cada chunk recibe chunk_id y offset.  
4. **Vectorize** — en Worker, transformers.js con un modelo pequeño (p.ej. MiniLM) genera embedding por chunk; el modelo vive en caché del **dispositivo** tras la primera descarga.  
5. **Index** — se actualizan tablas/índices: keyword (FTS de SQLite si aplica), embedding (tabla de vectores o estructura HNSW en lib tipo mememo/VecLite), tags, dates, project ids.  
6. **Commit** — se marca la tx `committed`; se actualiza updated_at del record padre.  
7. **Return ID** — la UI solo recibe el id; no recibe handles de archivo.

Si falla a mitad, se marca `aborted` y se compensa (no dejar chunks huérfanos sin record, o se limpian en recovery).

## C.4 Pipeline de lectura y Context Builder

`memory.buildContext(query, opts)` en Worker:

1. Consulta cache L1 (Map en RAM del worker con LRU y techo en MB).  
2. Keyword search en FTS/local.  
3. Vector search (HNSW/cosine).  
4. Opcional: expansión por relations (ids vecinos en tabla edges).  
5. Merge + dedupe por document_id/chunk_id.  
6. Ranking por score y recencia.  
7. Carga solo los chunks necesarios desde OPFS/SQLite (no el corpus entero en RAM).  
8. Compress/truncate al presupuesto de tokens de opts.  
9. Devuelve `{ context: string, citations: id[] }` al hilo UI para inyectar en el prompt del chat.

El modelo LLM (cloud o local) **nunca** ve el StorageProvider; solo el string de contexto.

## C.5 Cache, RAM y CPU (detalle)

**RAM**

- No se mapea toda la biblioteca de documentos en memoria.  
- Embeddings y textos viven en disco local; RAM solo para: página de resultados, LRU de chunks calientes, tensores temporales del embedder.  
- Resource Governor lee señales del device (`navigator.deviceMemory` donde exista, nivel de batería en app nativa) y reduce: tamaño de LRU, batch de embed, frecuencia de reindex.

**CPU**

- Main thread: layout, input, pintar tokens del stream.  
- Worker(s): embed, index, search, chunk, crypto del vault del usuario.  
- Objetivo de producto: la mayor parte del trabajo de memoria (~80% del procesamiento de esa función) ocurre en el device; nosotros no montamos un farm de embedding para sus documentos privados.

## C.6 Snapshot, recover, sync

- **Snapshot:** serializar metadata + rutas/blobs necesarios a un archivo vault; checksum; opcionalmente cifrado con clave del usuario.  
- **Restore:** verificar checksum; reaplicar; o replay del transaction log desde último snapshot bueno.  
- **Sync:** por defecto no envía nada a MAXBRY. Si el usuario activa “backup a mi S3”, el Sync Manager sube **diffs cifrados con su clave**; el plaintext no debe existir en claro en tránsito hacia un servicio nuestro de almacenamiento de memorias (porque ese servicio no es el diseño).

## C.7 Qué no se programará en memoria

- No base multi-tenant de memorias de clientes en nuestro VPS como feature central.  
- No que la UI React abra handles SQLite en el hilo UI.  
- No sync silencioso de todo el vault a nuestros servidores.

---

# BLOQUE D — SEGURIDAD IP DE NUESTRA UI / AGENTE (DETALLE)

## D.1 Separación radical de dos problemas

1. **Vault del usuario** — cifrado opcional con **su** passphrase; nos importa como buena ingeniería local-first, no como “secreto MAXBRY”.  
2. **IP MAXBRY** — el código del motor de agentes, prompts de sistema internos, reglas de orquestación, validación de licencia, heurísticas de Session Controller premium: eso **no** debe viajar como TypeScript legible en un repo público ni en un ASAR trivialmente extraíble.

## D.2 Arquitectura de procesos

**Proceso UI**  
- Render FROMTED (chat, paneles, temas).  
- No contiene el planner completo ni tablas de decisión secretas.  
- Habla un protocolo IPC estable: “execute_turn”, “cancel”, “get_status”.

**Proceso / módulo Engine (nativo)**  
- Implementa el agente cerrado, políticas, enlace a tools, client de licencia.  
- Compilado a biblioteca nativa (.so / .dylib / .dll) o binario auxiliar.  
- Cargado por la app host (Flutter/Tauri/Android service).

**Sandbox**  
- El engine no expone filesystem arbitrario a cualquier prompt sin política.  
- Tools del usuario (leer carpeta X) pasan por permisos explícitos de la plataforma.

## D.3 Capas de protección — cómo las aplicamos una a una

### D.3.1 Compilación nativa

La lógica crítica se escribe en Rust (preferible con Tauri o FFI hacia Flutter) o en C++ con JNI en Android y en Swift/ObjC++ en iOS donde haga falta.  
Motivo: el atacante ya no abre un `.js` y lee el pipeline; tiene que descompilar binario ARM64/x86_64.

### D.3.2 Ofuscación

- **JS/TS de la UI:** javascript-obfuscator en build de release (control flow flattening, string array, dead code); no es la defensa principal.  
- **Nativo:** obfuscator-llvm o flags de strip + protección comercial sobre funciones de licencia y de decisión.

### D.3.3 Virtualización / VM Protect

Funciones de: validación de licencia, descifrado de blobs internos, comprobaciones anti-tamper, se marcan para virtualización (VMProtect, Themida, Code Virtualizer, o VM bytecode en herramientas JS solo para stubs de license en capas JS residuales).  
Efecto: el desensamblado no muestra el grafo de control original; hay que atacar la VM.

### D.3.4 Cifrado del módulo en reposo

El `.so` crítico puede almacenarse cifrado en el paquete. Un loader pequeño (más expuesto) deriva o recupera una clave de sesión (idealmente atada a hardware) y descifra en memoria anónima. Tras uso, se intenta liberar páginas.  
No es perfecto (el código descifrado existe un tiempo en RAM), pero evita copia trivial del archivo en disco.

### D.3.5 Protección de memoria

- No loguear prompts de sistema internos.  
- API de engine que no devuelve a la UI el “system prompt maestro” completo.  
- Borrado de buffers de claves tras uso.  
- Si hay pesos propios: cargar capas bajo demanda; no mapear un único archivo gigante siempre.

### D.3.6 Anti-debugging

En release: detección de depurador, de frameworks de instrumentación comunes en móvil (Frida), de emuladores no autorizados en builds que lo requieran.  
Respuesta: no solo `exit()` (fácil de noppear); degradar a modo “solo chat cloud sin tools premium” y telemetría de integridad hacia el servidor de licencia.

### D.3.7 Anti-tamper e integridad

- Firmas de Play App Signing / Apple code sign / Authenticode.  
- Comprobación de hash de segmentos críticos al arranque.  
- Si Electron fuera inevitable: `EnableEmbeddedAsarIntegrityValidation` + `OnlyLoadAppFromAsar` (y aun así no confiar en eso como única línea).  
- Server-side: el backend de suscripción puede exigir attestation (Play Integrity API, App Attest).

### D.3.8 Protección de modelo

Si el diferencial es un fine-tune propio embebido: cifrar GGUF, no documentar rutas, preferir que el modelo **flagship** viva en API de pago (más alineado a “paga el servicio”). El modelo 1B local puede ser commodity; el valor cerrado está en el **agente/orquestación**.

### D.3.9 Aislamiento

UI y Engine en procesos distintos. Compromiso de XSS en una WebView no debería igualar lectura lineal de toda la lógica del engine si el IPC está tipado y mínimo.

### D.3.10 Hardware-backed

Claves de licencia o de descifrado de módulo envueltas con Android Keystore (StrongBox si existe) o Secure Enclave. La clave privada no es exportable a userspace en claro.

## D.4 License y pago (parte de la seguridad de producto)

Features premium se habilitan con tokens firmados por **nuestro** backend.  
El cliente puede tener un cache de entitlement; si alguien parchea el binario para saltarse el if local, el servidor sigue pudiendo rechazar llamadas al orquestador de pago.  
**Nunca** poner el único gate de cobro solo en un booleano en JS.

## D.5 Por qué no “solo ofuscar la PWA web”

Una PWA servida desde Vercel entrega JavaScript al browser. Cualquier usuario puede formatear el bundle. Por eso:

- La PWA es válida para **pulir UI** y chat visual.  
- El **motor cerrado** de producción móvil/desktop va en **binario protegido**.  
- La web puede hablar con APIs de pago; no debe ser el único contenedor del agente propietario.

## D.6 Límite ético/técnico (texto explícito para auditoría)

Con control root del teléfono y tiempo ilimitado, un laboratorio puede instrumentar la RAM y eventualmente reconstruir comportamiento. Las capas anteriores no prometen imposibilidad; prometen que clonar MAXBRY no sea abrir un zip y copiar tres carpetas.

---

# BLOQUE E — MOBILE-FIRST (DETALLE DE PRODUCTO)

La apuesta es que el trabajo diario ocurra en el smartphone con la misma seriedad que en PC:

- Packaging prioritario: Android y iOS.  
- UI táctil primero (botones, drawers, input); desktop hereda layout ancho.  
- Engine nativo compilado para ARM64.  
- Memoria y documentos del usuario en almacenamiento interno de la app o tarjeta que el SO permita.  
- Sesiones largas conscientes de kill en background (checkpoints locales).  
- Cuando el razonamiento escala, la UI dispara el servicio de pago cloud; cuando es corto, puede quedarse en on-device.

Esto alinea con clientes tipo Kimi/Claude en móvil y con la línea “on-device AI”, pero manteniendo **nuestro** motor cerrado.

---

# BLOQUE F — PLAN DE PROGRAMACIÓN CONCRETO (ORDEN)

## F.1 Memoria (cliente)

1. Definir tipos MemoryRecord y Chunk en un módulo compartido.  
2. Implementar Worker `memory.worker` con OpfsSqlite o IDB.  
3. Implementar `memory.store/search/buildContext` end-to-end con un documento de prueba.  
4. Conectar panel docs y chat para inyectar `buildContext`.  
5. Añadir snapshot/export.  
6. Portar el mismo contrato a Flutter/Tauri storage nativo.

## F.2 Seguridad IP (release)

1. Extraer de la UI cualquier planner “de verdad” a crate Rust `fromted-engine`.  
2. IPC mínimo.  
3. Pipeline de release: strip + obfuscation + (opcional) VMProtect en símbolos críticos.  
4. Firmas de tienda.  
5. License client + attestation.  
6. Prueba interna: “¿un dev junior extrae el system prompt maestro en <2 h desde el APK de release?” — si sí, subir capa.

## F.3 UI distribución

1. PWA/Vercel para iterar diseño y chat visual.  
2. App stores para el producto con engine protegido.  
3. Mismo diseño visual (tokens) en ambos.

---

# BLOQUE G — CRITERIOS DE ACEPTACIÓN DETALLADOS

**Memoria**

- Captura de red al guardar 50 memorias: no hay POST a un endpoint nuestro de “upload memory blob”.  
- Tras “Clear site data” / desinstalar app, los datos locales del vault desaparecen del sandbox.  
- buildContext devuelve citations que existen en el store local.

**IP**

- En el artefacto de release, no existe un archivo de texto con el grafo completo de decisión del agente en claro.  
- Modificar un byte del binario firmado impide instalación o activa fallo de integridad.  
- Sin token de licencia válido, las rutas premium del orquestador responden rechazo.

**Separación**

- Documentación de producto dice en lenguaje claro: los documentos y la memoria del usuario viven en su dispositivo; el software del agente es propietario.

---

# BLOQUE H — FUENTES TÉCNICAS USADAS EN ESTA INVESTIGACIÓN

- OPFS y SQLite WASM (Chrome developers, sqlite-wasm, wa-sqlite).  
- Vector search en browser (mememo, VecLite, entity-db, transformers.js).  
- Web Crypto / secure stores (web-crypto-storage, secure-webstore, dexie-encrypted).  
- Electron ASAR integrity y límites de protección JS.  
- VMProtect/Themida como clase de protección industrial; literatura de deobfuscación (no invulnerables).  
- Kimi Work / Claude Desktop / Cursor como referentes de “app descargable + servicio de pago”.  
- On-device mobile AI (Gemini Nano / AICore, DeviceAI) como referente de apuesta móvil.

---

FIN DEL DOCUMENTO DETALLADO.  
Este archivo es la salida completa pedida: memoria + seguridad IP + investigación + cómo se programa, sin reducir a un párrafo de cierre.
