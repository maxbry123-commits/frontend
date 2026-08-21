# PROYECTO FROMTED — PARTE 4: MEMORIA LOCAL + PROTECCIÓN IP DE NUESTRA UI

Fecha: 2026-07-28 02:15 -05  
Estado: ACTIVO — tarea repetida según corrección del usuario

---

## CORRECCIÓN DE ALCANCE (obligatoria)

| Tema | Qué es | Qué NO es |
|------|--------|-----------|
| **Memoria / storage del usuario** | 100% en su PC/móvil o nube **que él elija** | No la hospedamos nosotros |
| **Seguridad de esta sección** | Proteger **nuestro** sistema cerrado: lógica interna, agente, pipeline, secretos de producto, IP de la UI | No es “proteger los datos del usuario” (eso es su vault local) |
| **Producto** | UI **cerrada** (no open source) que el usuario **descarga**; paga servicio (modelos/orquestador/cloud) | No publicamos el código interno del agente/UI |

Límite real (tu input): **nadie impide al 100%** a quien controla el dispositivo analizar código/RAM. Se **eleva el costo** del ataque con capas.

---

## PASOS DE RAZONAMIENTO (sistema de trabajo)

### Audit3
1. Memoria usuario = local device.  
2. IP a proteger = runtime y lógica **nuestra** empaquetada en la UI/app.  
3. Modelo de negocio = descarga UI + pago por servicio (como Kimi Work / Claude Desktop), código **cerrado**.

### 6 goals in
G1 Memoria usuario solo en device / su nube.  
G2 UI descargable móvil-first (apuesta tipo “el móvil es el PC”).  
G3 Shell UI puede ser web/PWA; **núcleo sensible en binario nativo protegido**.  
G4 Capas anti-RE: obfuscación, bytecode/VM, cifrado en reposo del módulo, anti-tamper, integrity.  
G5 Firmas de instalación + updates firmados.  
G6 Comparar con Kimi / Claude Desktop / Cursor-class y extraer patrón.

### Refut + experto
- **Refut:** “encriptar la memoria del usuario” como foco de *nuestra* seguridad de producto → mal.  
- **Refut:** dejar toda la lógica del agente en JS legible en un asar/Electron sin más → IP débil (Cursor/Electron es atacable).  
- **Experto:** separar **UI presentation** (menos crítica) de **motor de ejecución** (compilado + protegido).  
- **Experto mobile:** Tauri/Flutter + Rust/C++ para motor; no solo SPA web para el núcleo.

### Council
- Memoria datos usuario → local-first (PARTE ya definida).  
- Protección IP → stack multi-capa sobre el **binario/módulo nuestro**.  
- Distribución → instaladores firmados Android/iOS/desktop + PWA secundaria.  
- Inferencia → cloud de pago y/o GGUF local; el **orquestador/agente cerrado** no se publica.

### 12 goals out
1. Catálogo sistemas similares (abajo).  
2. Patrón “UI local + pay service + closed core”.  
3. Arquitectura UI vs motor protegido.  
4. Stack protección IP (tus 10 capas + tooling real).  
5. Mobile-first packaging.  
6. Qué va en JS vs nativo.  
7. Integrity + signing.  
8. Anti-debug/anti-tamper realista.  
9. Modelo de amenazas (qué sí/no se logra).  
10. Plan de investigación seguridad continua.  
11. Cómo programar sin mezclar vault usuario con IP nuestra.  
12. Criterios de aceptación auditables.

---

## 1. SISTEMAS SIMILARES (usuario descarga UI + paga servicio)

| Sistema | Qué descarga el usuario | Dónde corre el “agente” | Open source? | Notas |
|---------|-------------------------|-------------------------|--------------|-------|
| **Kimi Work / Kimi Desktop** (Moonshot) | App desktop macOS/Windows | Acciones locales (files, browser); modelo a menudo **cloud** Kimi | Core cerrado; hay mirrors/unofficial | “Local” = herramientas en PC, no = pesos offline siempre; suscripción por tiers/agentes |
| **Claude Desktop** (Anthropic) | App desktop (+ móvil web/app) | Chat cloud; Cowork/Code pueden trabajar carpetas **locales**; historial puede ser local en modos 3P | Cerrado | UI empaquetada; inferencia API; conectores local vs remote |
| **Cursor / Windsurf** | IDE desktop (Electron) | Agente + index; mucho cloud; datos locales en disco a veces cifrados de forma imperfecta | Cerrado | Electron = superficie grande; ASAR legible si no se endurece |
| **DeviceAI / on-device assistants** | SDK/app móvil | Inferencia **on-device** | Mixto | Apuesta móvil; privacidad datos; no es el mismo problema que IP del vendor |
| **Flutter GGUF apps** | APK/IPA | Modelo local | A menudo OS | Útil para pattern mobile; no para “nuestro código cerrado” |

**Patrón que nos sirve:**

```
Usuario instala app (móvil prioritario + desktop)
    → UI (nuestra, cerrada)
    → Motor local de orquestación/agente (nuestro, protegido)
    → Memoria/archivos del USUARIO en su disco (no nuestro servicio)
    → Pago: API modelos / orquestador cloud / features premium
```

Diferencia MAXBRY/FROMTED: **código cerrado**; no publicamos el motor.

---

## 2. MEMORIA (solo recordatorio correcto)

- Primary copy: **dispositivo del usuario**.  
- OPFS / SQLite-WASM / app sandbox.  
- Cifrado del **vault del usuario** = para **él** (passphrase suya), no es la “seguridad de producto MAXBRY”.  
- Nosotros no operamos su base de memorias.

---

## 3. PROTECCIÓN IP DE NUESTRA UI / AGENTE (extremo a extremo)

### 3.1 Modelo de amenazas

| Atacante | Objetivo | Realidad |
|----------|----------|----------|
| Script kiddie | Copiar UI/agente | Se frena con ofuscación + binario |
| RE profesional | Extraer pipeline/prompts/lógica | Se **retrasa** semanas/meses; no se garantiza imposibilidad |
| Usuario root del device | Dump memoria / hook | Límite físico; TEE/Keystore ayudan en claves |
| Modificar APK/instalador | Piratear features | Firma + anti-tamper + server-side license checks |

### 3.2 Arquitectura recomendada (alineada a tu lista)

```
UI (Flutter/React en WebView o nativo)
    │  mensajes acotados
    ▼
Motor de ejecución (binario nativo: Rust/C++/Kotlin/Swift)
    │
    ▼
Sandbox / proceso aislado
    │
    ▼
Módulos sensibles (bytecode VM / cifrados en disco)
    │
    ▼
Descifrado justo-in-time en RAM → ejecutar → wipe buffers
```

- **UI:** presentación FROMTED; poco secreto.  
- **Motor:** planner agente, reglas, pipeline, license client, anti-tamper — **compilado y protegido**.  
- Comunicación: IPC/schema fijo; la UI no contiene el cerebro.

### 3.3 Capas (tu lista + tooling investigado)

| # | Capa | Aplicación práctica FROMTED |
|---|------|------------------------------|
| 1 | Compilar a nativo | Motor en **Rust** (Tauri) o **C++/JNI** (Android) / **Swift** (iOS); evitar lógica crítica solo en JS |
| 2 | Ofuscación avanzada | JS restante: javascript-obfuscator (control flow, string encryption); nativo: obfuscator-llvm |
| 3 | VM personalizada | VMProtect / Code Virtualizer / JS VM Protection en funciones de licencia y pipeline |
| 4 | Cifrado del código | Módulo `.so`/`.dll` cifrado en disco; loader descifra en memoria |
| 5 | Protección memoria | No loguear secretos; borrar buffers de claves; minimizar tiempo de plaintext en RAM |
| 6 | Anti-debugging | Detectar ptrace/Frida/debugger; degradar features (no solo “exit”) |
| 7 | Anti-tamper | Hash de binario; **ASAR integrity** si Electron; firmas Play/App Store; Play Integrity / DeviceCheck |
| 8 | Protección modelo | Si hay GGUF/pesos propios: no dejar pack completo siempre mapeado; trocear; preferir cloud para IP del modelo grande |
| 9 | Módulos aislados | Proceso separado motor ↔ UI |
| 10 | Hardware-backed | Android Keystore/StrongBox; iOS Secure Enclave; TPM en PC para claves de licencia |

### 3.4 Si el shell es Electron (no ideal para IP máxima)

- ASAR **no** es secreto.  
- Usar **V8 bytecode** + **ASAR integrity fuses** (`EnableEmbeddedAsarIntegrityValidation`, `OnlyLoadAppFromAsar`).  
- Aun así: preferir **Tauri (Rust)** o **Flutter** para reducir superficie tipo Cursor.

### 3.5 License / features de pago

- Validación **server-side** de suscripción (nuestro backend).  
- Cliente solo guarda token; features premium fallan cerradas si el servidor niega.  
- No confiar solo en if (licensed) en JS.

---

## 4. MOBILE-FIRST (apuesta “móvil como PC”)

| Decisión | Motivo |
|----------|--------|
| Priorizar **Android/iOS** en packaging | Usuario trabaja sin PC |
| UI responsive ya diseñada para web | Misma marca visual en PWA |
| Motor nativo móvil | CPU/NPU del teléfono = 80% procesamiento local posible |
| Gestos, teclado, background limits | Diseñar Session Controller consciente de OS móvil |
| Desktop = mismo motor, ventana grande | No al revés (desktop-first) |

Referencia de mercado: Kimi/Claude en móvil + desktop; DeviceAI on-device; Gemini Nano en AICore — el valor está en **llevar el agente al bolsillo**.

---

## 5. CÓMO PROGRAMAR SIN MEZCLAR CONCEPTOS

```
Repo / producto
├── ui/                    # FROMTED interface (puede ofuscarse; poco secreto)
├── engine/                # NUESTRA IP (Rust/C++) — protectores comerciales en release
├── memory-client/         # API memoria → storage del USUARIO en device
├── license-client/        # habla con NUESTRO billing (protegido)
└── installers/            # firmados, Play/App Store, MSIX/DMG
```

- `memory-client` no contiene secretos MAXBRY; solo adapta OPFS/SQLite local del usuario.  
- `engine` nunca se publica en GitHub público.  
- Release pipeline: build → obfuscate/protect → sign → store.

---

## 6. PLAN DE INVESTIGACIÓN SEGURIDAD (continuo)

| Paso | Qué |
|------|-----|
| S1 | Elegir shell: **Tauri vs Flutter** vs Electron (recomendación: Tauri o Flutter por IP) |
| S2 | Spike: módulo Rust “engine stub” + IPC desde UI |
| S3 | Evaluar obfuscator-llvm / cargo protectors en Android JNI |
| S4 | Electron solo si se exige: bytecode + integrity fuses (documentar límites) |
| S5 | Play Integrity + App Attest flujos de license |
| S6 | Threat model escrito + test de extracción amateur (¿se lee el pipeline en 1 hora?) |
| S7 | Política de updates firmados y kill-switch server-side |

---

## 7. CRITERIOS DE ACEPTACIÓN (auditoría)

**Memoria usuario**  
- Guardar nota → sin POST a nuestro storage de memorias.  

**IP nuestra**  
- Release de motor no es un `.js` legible con el planner completo.  
- Integrity: binario alterado → no arranca o pierde features.  
- License: sin servidor válido no hay premium (prueba con MITM rechazado por pin/cert si aplica).  

**Honestidad**  
- Documentación interna admite: protección = costo de ataque ↑, no invulnerabilidad.

---

## 8. RESUMEN EN UNA FRASE

**Memoria del usuario en su dispositivo; cerebro e IP de MAXBRY/FROMTED en motor nativo cerrado, ofuscado y anti-tamper; UI descargable móvil-first; cobro por servicio cloud/orquestador — no por hospedar su disco.**

FIN PARTE 4 (memoria local + seguridad IP UI).
