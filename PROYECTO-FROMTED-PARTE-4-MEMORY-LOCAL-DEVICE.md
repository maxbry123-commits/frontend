# PROYECTO FROMTED — PARTE 4 (CORREGIDA): MEMORIA Y ALMACENAMIENTO EN EL DISPOSITIVO DEL USUARIO

Fecha: 2026-07-28 01:00 -05  
Estado: ACTIVO — re-análisis según input corregido  
Anula la interpretación errónea de “Memory en nuestro servidor/Vercel como servicio nuestro”.

---

## INPUT CORRECTO (sentido literal)

- La UI que **descarga el usuario** ejecuta memoria, almacenamiento y gran parte del procesamiento **en su smartphone o PC**, o en **la nube que él elija**.
- **Nosotros no ofrecemos** el servicio de hospedar su memoria/almacenamiento.
- Diseño: memoria y storage se manejan **local en el dispositivo del usuario**, no en “nuestra web” ni en “nuestro VPS” como almacén de datos del usuario.
- 80% del procesador de la experiencia local ocurre en su dispositivo.
- 100% del almacenamiento de sus datos ocurre en su dispositivo o en nube **que él configure** (Drive, S3 propio, etc.), no en infra MAXBRY por defecto.
- Investigar seguridad/encriptación de la INTERFACE.
- Estrategia detallada de RAM local, CPU, storage, para auditar y refutar.

---

## PASOS DE RAZONAMIENTO (sistema de trabajo del usuario)

### 1. Audit3
A1. ¿Quién es dueño de los datos? → **El usuario**, en su dispositivo.  
A2. ¿Qué entregamos nosotros? → **UI descargable/instalable** (PWA/app) + código que corre **allí**.  
A3. ¿Qué no hacemos? → No operar un backend de memoria/archivos del usuario como producto hospedado por nosotros.

### 2. 6 goals in
G1. UI instalable (PWA y/o app nativa).  
G2. Storage 100% en dispositivo (o destino que el usuario elija).  
G3. ~80% compute local (UI, index, embed, search, cifrado).  
G4. Memory Runtime **dentro del cliente**, no como API nuestra.  
G5. Cifrado en reposo en el dispositivo.  
G6. Portabilidad: mismo modelo en PWA web y en app PC/móvil.

### 3. Refut + experto
- **Error previo:** tratar Memory como servicio en Vercel/VPS nuestro.  
- **Refutación:** eso convierte a MAXBRY en host de datos del usuario; contradice el input.  
- **Corrección:** Vercel/CF solo **sirven el paquete de UI** (HTML/JS). Al abrir/instalar, el JS usa OPFS/IDB/SQLite-WASM **en el dispositivo**.  
- **Experto:** local-first PWA + Workers + OPFS + Web Crypto; opcional File System Access / cloud del usuario como StorageProvider que **él** conecta.

### 4. Council
Consenso:  
- **Primary copy de datos = dispositivo usuario.**  
- Nuestro cloud (Vercel) = CDN del frontend, no base de datos de memoria.  
- Nuestro VPS futuro = orquestador/agentes **opcionales** a los que la UI llama; no el disco duro del usuario.  
- Memory Manager / Storage Adapter corren **en el cliente**.

### 5. 12 goals out (resultado operativo)
1. Definir “UI descargable” = PWA + builds nativos futuros.  
2. Storage path: OPFS + SQLite-WASM en Worker (o IDB para v0).  
3. Encryption at rest: Web Crypto AES-GCM + clave derivada de passphrase usuario o KEK dispositivo.  
4. CPU: Workers para embed, index, search, crypto — UI thread liviano.  
5. RAM: no cargar corpus entero; chunks + mmap-like vía OPFS; LRU cache acotada.  
6. Memory API **in-process** en el cliente (misma API que propusiste, implementación local).  
7. StorageProvider: LocalOPFS / LocalSQLite / UserCloud (SDK que el usuario configura).  
8. Sync a “nuestra” infra = **apagado por defecto**; export/import manual o destino usuario.  
9. Seguridad interface: CSP, HTTPS, COOP/COEP si SQLite OPFS, no secrets en código.  
10. Estrategia programación por capas (abajo).  
11. Sources OS a descargar para local-first.  
12. Criterios de aceptación auditables.

---

## RESULTADO DEL ANÁLISIS (qué es FROMTED en este punto)

```
Usuario descarga / instala FROMTED UI
        │
        ▼
┌─────────────────────────────────────┐
│  DISPOSITIVO DEL USUARIO (PC/móvil) │
│  ┌─────────┐  ┌──────────────────┐  │
│  │ UI      │  │ Memory Runtime   │  │
│  │ (React) │◄─┤ local in-process │  │
│  └─────────┘  │ Storage cifrado  │  │
│       │       │ Workers (CPU)    │  │
│       │       └──────────────────┘  │
│       │  OPFS / SQLite-WASM / IDB   │
│       │  (100% disco del usuario)   │
└───────┼─────────────────────────────┘
        │ HTTPS opcional
        ▼
  APIs de modelos (OpenRouter etc.)     ← solo inferencia LLM si no hay GGUF local
  VPS orquestador (opcional)            ← NO almacena memoria del usuario por defecto
  Nube del usuario (Drive/S3 propio)    ← si ÉL lo configura como provider
```

Nosotros **no** vendemos ni operamos el disco de memoria del usuario.

---

## INVESTIGACIÓN: CÓMO SE HACE EN EL DISPOSITIVO

### A. Almacenamiento (100% dispositivo o nube del usuario)

| Tecnología | Rol | Notas |
|------------|-----|-------|
| **OPFS** (Origin Private File System) | FS sandbox del origen en disco del usuario | GB-scale; sync handles en Worker; ideal archivos/DB |
| **SQLite WASM + OPFS** (`@sqlite.org/sqlite-wasm`, wa-sqlite) | DB relacional local persistente | Corre en Worker; no hay servidor nuestro |
| **IndexedDB** | Metadata, colas, keyval | Más simple; menos ideal para GB |
| **File System Access API** | Usuario elige carpeta visible en su PC | Opt-in; él ve/controla archivos |
| **StorageProvider UserCloud** | Adapter a Drive/S3/Xata **cuenta del usuario** | Credenciales suyas; nosotros no hospedamos |

**Programación storage:**
1. Interface `StorageProvider` (open/read/write/search/transaction) como en tu input.  
2. Implementación default: `OpfsSqliteProvider` en Web Worker.  
3. UI nunca importa sqlite ni paths; solo `memory.*`.  
4. Headers deploy (COOP/COEP) si se usa SQLite OPFS cross-origin isolation.

### B. RAM y CPU (~80% local)

| Trabajo | Dónde | Cómo |
|---------|-------|------|
| Render UI | Main thread | React liviano |
| Cifrado/descifrado | Worker o SubtleCrypto async | No bloquear input |
| Embeddings (MiniLM) | **Web Worker** + transformers.js | Modelo en caché del dispositivo |
| Vector search HNSW | Worker | mememo / VecLite |
| Chunking documentos | Worker | Stream desde OPFS, no cargar todo a RAM |
| LLM local (Gemma GGUF) | App nativa / llama.cpp (fase app) | 80%+ CPU/NPU del device |
| LLM cloud | Red | Solo tokens; no storage nuestro |

**Estrategia RAM:**
- Límite duro de cache en memoria (LRU MB configurables).  
- Documentos en OPFS; se leen por chunks.  
- Embeddings persistidos en OPFS/IDB; no recalcular siempre.  
- Al cerrar sesión: liberar tensores/modelos de Worker si política de Governor lo pide.

**Estrategia CPU:**
- Todo cómputo pesado fuera del main thread.  
- Resource Governor (tu diseño): reduce contexto, pausa indexación si batería/RAM bajas.  
- UI permanece responsive → sensación de app nativa.

### C. Memory Runtime (en el cliente, no servicio nuestro)

Misma forma que tu diseño, **ubicada en el device**:

- Memory Manager → pipeline store local  
- Chunk Engine → OPFS  
- Vector Engine → lib browser  
- Index Manager → tablas SQLite local / estructuras IDB  
- Cache Manager → RAM acotada + disco local  
- Context Builder → output al chat (main thread solo recibe string + ids)  
- Transaction Log + Snapshot → archivos locales cifrados  
- Sync Manager → **solo** si el usuario activa destino (su nube o export); default OFF hacia nosotros  

### D. Seguridad / encriptación de la INTERFACE

| Capa | Mecanismo |
|------|-----------|
| Tránsito | HTTPS obligatorio (Vercel/CF) |
| En reposo (disco device) | **AES-GCM** via **Web Crypto API** |
| Clave | (1) Passphrase del usuario → PBKDF2/Argon2id → KEK  **o** (2) KEK no exportable en IDB (device-bound) |
| Integridad | Auth tag GCM; opcional checksum snapshot |
| Libs ref | web-crypto-storage, secure-webstore, dexie-encrypted, secure-local-storage |
| UI | No loguear plaintext; pantalla bloqueo si passphrase; wipe local |
| CSP | Restringir orígenes; no eval innecesario |
| Aislamiento | Datos en OPFS del origen; borrar sitio = borrar datos (usuario informado) |

**Regla:** la clave maestra **no** viaja a nuestros servidores. Si no hay passphrase, device-bound key no sale del origen del browser.

---

## CÓMO SE PIENSA PROGRAMAR (estrategia detallada)

### Capa 0 — Entrega de UI
- Build static (Vite/React) → Vercel/CF **solo distribuye bytes de la app**.  
- PWA: service worker cachea shell; datos **no** van al SW cache como “nuestra DB”.

### Capa 1 — Bootstrap local
1. Al primer uso: pedir passphrase o generar device key.  
2. Abrir Worker `memory.worker.ts`.  
3. Init OPFS dir `fromted-memory/`.  
4. Init SQLite-WASM OpfsDb **o** IDB stores cifrados.  
5. Exponer Comlink/RPC: `memory.store/search/...`.

### Capa 2 — Escritura
`UI → memory.store(input) → Worker: validate → encrypt payload → chunk → embed (worker) → index → commit tx log → return id`  
Nada de esto hace POST a nuestro VPS.

### Capa 3 — Lectura / contexto
`UI → memory.buildContext(q) → Worker: cache → keyword+vector → merge → decrypt chunks needed → compress → return {context, citations}`  
Main thread solo pinta.

### Capa 4 — CPU/RAM Governor
- Lee `navigator.deviceMemory`, batería si existe.  
- Ajusta batch embed, tamaño cache, pausa indexación background.

### Capa 5 — Export / nube del usuario
- Botón “Exportar vault cifrado”.  
- Provider opcional: el usuario pega token de **su** S3/Drive; Sync Manager sube **diffs cifrados**; nosotros no vemos plaintext ni operamos el bucket.

### Capa 6 — App nativa (fase posterior)
- Mismo contrato Memory API.  
- Storage: SQLite nativo / archivos app sandbox.  
- Gemma GGUF + llama.cpp = más % CPU local.

---

## SOURCES OS A USAR (download determinista)

| Pieza | Repo / tech |
|-------|-------------|
| SQLite en browser | https://github.com/sqlite/sqlite-wasm · https://github.com/rhashimoto/wa-sqlite |
| Vector browser | mememo · VecLite · entity-db |
| Embeddings | @huggingface/transformers |
| Crypto storage | web-crypto-storage · secure-webstore · dexie-encrypted |
| OPFS patterns | MDN OPFS · Chrome SQLite+OPFS guides |

---

## CRITERIOS DE ACEPTACIÓN (para que puedas refutar)

1. Con DevTools Network: **cero** requests a nuestro backend al guardar una memoria (salvo load de JS inicial).  
2. Application → OPFS/IDB: existen datos en el origen; al “Clear site data” desaparecen del device.  
3. Sin passphrase correcta no se leen records (prueba de cifrado).  
4. Main thread no supera umbral de bloqueo al indexar doc mediano (trabajo en Worker).  
5. Documentación de producto dice explícito: “ Tus datos viven en tu dispositivo; no los alojamos nosotros.”

---

## QUÉ QUEDA EN NUESTRO VERCEL / VPS

| Nuestro | No nuestro |
|---------|------------|
| Hosting del **código UI** | Memoria del usuario |
| (Opcional) orquestador agentes | Archivos del usuario |
| (Opcional) APIs propias de routing | Claves de cifrado del vault |

---

## TRAZABILIDAD

Este documento **corrige** PARTE-4 anterior orientada a “Memory como tier en nuestra infra”.  
Válido junto a PARTE-3 (UI en Vercel como **distribución**, no como DB).

FIN — listo para tu auditoría y refutación.
