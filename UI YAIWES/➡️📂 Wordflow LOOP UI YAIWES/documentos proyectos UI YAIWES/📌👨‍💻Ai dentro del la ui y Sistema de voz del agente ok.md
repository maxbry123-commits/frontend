UI Ai embebida 


Sí. Parakeet de NVIDIA es especialmente interesante para la arquitectura que estás diseñando, pero hay que aclarar que Parakeet es principalmente ASR (Automatic Speech Recognition): voz → texto, no un modelo conversacional completo ni TTS.

Lo importante actualmente

La familia Parakeet utiliza un encoder FastConformer con distintos decodificadores CTC, RNN-T o TDT. NVIDIA mantiene actualmente variantes de 0.6B, 1.1B y 110M parámetros, además de versiones en distintos idiomas. 

Una de las versiones más interesantes es:

Parakeet-TDT-0.6B-v3

~600 millones de parámetros.

ASR.

Timestamps.

Versión multilingüe.

La investigación de NVIDIA describe soporte para 25 idiomas en esta generación. 


También existe Parakeet-unified-en-0.6b, diseñado para combinar inferencia offline y streaming en un único modelo, con una latencia mínima reportada de 160 ms. 

¿Por qué me interesa para tu sistema?

Porque encaja muy bien como uno de los modelos especializados de los 10 modelos que hablábamos:

TU AI ENGINE
                     │
              ┌──────▼──────┐
              │ AI SCHEDULER│
              └──────┬──────┘
                     │
       ┌─────────────┼──────────────┐
       ▼             ▼              ▼
   LLM general    LLM código    PARakeet
                                  │
                              VOZ → TEXTO

No necesitas mantener Parakeet permanentemente cargado.

Por ejemplo:

Usuario habla
     ↓
Audio
     ↓
Carga Parakeet
     ↓
Transcripción
     ↓
Descarga/libera memoria
     ↓
LLM
     ↓
Respuesta

Eso es exactamente el tipo de arquitectura de cola que acabamos de diseñar.

Y hay algo todavía más interesante

En 2026 NVIDIA está separando su stack de Speech en un proyecto específico, NeMo Speech, y continúa publicando modelos de voz para inferencia local. El repositorio señala que la versión estable anterior estaba disponible mediante el contenedor NGC 26.02 y que el proyecto estaba en transición hacia su nuevo repositorio. 

Además, existen trabajos/implementaciones de Parakeet orientadas a ejecución sin Python/PyTorch, utilizando C++/ggml y formatos cuantizados, lo cual es mucho más interesante para tu objetivo de integrarlo dentro de una aplicación móvil/PC. Esto es especialmente relevante porque reduce la dependencia de un stack Python pesado. 

Para tu proyecto lo separaría así

┌─────────────────────────────────────┐
│              TU UI                  │
├─────────────────────────────────────┤
│           CONTROL LAYER             │
├─────────────────────────────────────┤
│          LOCAL AI SCHEDULER         │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────┐  ┌──────────┐         │
│  │ LLM      │  │ Parakeet │         │
│  │ texto    │  │ voz→texto│         │
│  └──────────┘  └──────────┘         │
│                                     │
│  ┌──────────┐  ┌──────────┐         │
│  │ Vision   │  │ TTS      │         │
│  │          │  │          │         │
│  └──────────┘  └──────────┘         │
│                                     │
└─────────────────────────────────────┘

Parakeet sería el módulo de entrada de voz, mientras otro modelo se ocuparía del razonamiento y otro del habla de salida.

Y esto tiene una ventaja enorme: no necesitas utilizar un LLM grande para transcribir audio. Parakeet hace específicamente esa tarea.

Si tu objetivo es construir una IA local embebida en Android/PC, yo investigaría ahora específicamente Parakeet-TDT-v3 + NeMo-Speech.cpp/GGUF + ejecución CPU/GPU/NPU, porque ahí está la posibilidad de convertirlo en uno de los módulos ligeros de tu motor local.

Sí. Es totalmente viable. De hecho, para tu objetivo hay una arquitectura mejor que simplemente "meter el binario dentro de la app".

La idea sería crear una UI instaladora/orquestadora que lleve o descargue de forma controlada un runtime local + modelo + configuración, y que después ejecute la IA localmente. Internet puede utilizarse para actualizar, buscar información o sincronizar, pero la inferencia puede permanecer en el dispositivo.

Arquitectura

┌─────────────────────────────────────────────┐
│              TU APP / UI                    │
│                                             │
│  Chat │ Agentes │ Configuración │ Memoria   │
└──────────────────────┬──────────────────────┘
                       │
                 Local AI API
                       │
             ┌─────────▼─────────┐
             │  LOCAL AI RUNTIME │
             │                   │
             │ llama.cpp /       │
             │ ONNX Runtime /    │
             │ MLX / etc.        │
             └─────────┬─────────┘
                       │
                ┌──────▼──────┐
                │ LOCAL MODEL │
                │ GGUF / ONNX │
                │ etc.        │
                └─────────────┘

Y paralelamente:

INTERNET
                │
        ┌───────▼────────┐
        │ Cloud Services │
        │ Search / APIs  │
        │ Updates        │
        │ Remote Models  │
        └────────────────┘

La aplicación decide qué se ejecuta localmente y qué se envía a Internet.

¿Puede ir el binario dentro de la aplicación?

Sí, pero hay varias modalidades.

1. Binario incluido

La aplicación contiene:

App
├── UI
├── AI runtime
└── model

Ventaja: puede funcionar inmediatamente sin descargar componentes.

Desventaja: el instalador puede ser enorme.

Por ejemplo, si tienes:

runtime       50–200 MB
modelo 1B    ~0.5–1.5 GB
modelo 3B    ~2–4 GB
modelo 7B    ~4–8 GB

la aplicación puede terminar ocupando varios GB.

2. Instalador + descarga del runtime/modelo

Es probablemente mejor:

Installer
   │
   ├── UI
   ├── Local AI Runtime
   └── Model Manager
              │
              ▼
       descarga modelo
              │
              ▼
        almacenamiento
              │
              ▼
        inferencia local

La primera instalación necesita Internet, pero posteriormente puede funcionar offline.

3. App + modelos opcionales

Esta es la arquitectura que más sentido tiene para un sistema que quieres hacer crecer:

MY-AI
│
├── Core
│
├── Local Runtime
│
├── Model Manager
│
├── Agent Runtime
│
├── Memory
│
└── Models
    ├── small
    ├── medium
    └── large

El usuario podría seleccionar:

> IA ligera — 1 GB
IA estándar — 3 GB
IA avanzada — 8 GB



y descargar solamente lo que necesite.

Lo interesante para tu proyecto

Puedes separar la aplicación de la IA.

La aplicación no necesita saber cómo funciona internamente cada modelo:

UI
 │
 ▼
AI API local
 │
 ▼
Model Router
 │
 ├── Model A → local
 ├── Model B → local
 ├── Model C → local
 └── Cloud → Internet

Por ejemplo:

POST http://127.0.0.1:xxxx/v1/chat/completions

La UI habla con una API local y el runtime decide qué modelo ejecutar.

Esto permite cambiar el modelo sin reconstruir toda la aplicación.

Incluso puedes hacer algo más potente

Puedes diseñar tu instalador como un Local AI Runtime Manager:

┌─────────────────────────────────┐
│          AI INSTALLER            │
├─────────────────────────────────┤
│ Runtime                          │
│ ✓ Installed                      │
│                                 │
│ Models                           │
│ ✓ Small                         │
│ ✓ Coding                        │
│ ○ Vision                        │
│ ○ Reasoning                     │
│                                 │
│ Compute                          │
│ CPU ✓                            │
│ GPU ✓                            │
│ NPU ✓                            │
│                                 │
│ Network                          │
│ Local-first ✓                   │
└─────────────────────────────────┘

Y el motor de decisión podría funcionar:

¿Internet disponible?
        │
    ┌───┴───┐
   NO      YES
   │         │
LOCAL      ¿Necesita
AI         servicio externo?
             │
          ┌──┴──┐
         NO    YES
         │       │
       LOCAL   CLOUD

Así tienes local-first, no simplemente offline.

La diferencia es importante:

Offline AI: no necesita Internet.

Local-first AI: intenta ejecutar primero en el dispositivo y utiliza Internet solamente cuando aporta algo que el dispositivo no tiene.

Para una aplicación que quieras distribuir en Android + Windows/Linux, esta segunda arquitectura es especialmente interesante porque puedes mantener una misma interfaz y cambiar el runtime/modelo según el hardware.



No exactamente. Hay una distinción importante:

GitHub no ejecuta el modelo para tu teléfono. GitHub solamente puede servir como lugar desde el cual tu aplicación descarga el código, binario, modelo o paquetes.

Si quieres que el cómputo sea local, finalmente los componentes necesarios tienen que estar en el dispositivo.

Hay 3 arquitecturas diferentes

1. IA completamente remota

TU UI
  │
  │ Internet
  ▼
Servidor
  │
  ▼
MODELO

Tu teléfono solamente manda prompts. El servidor hace la inferencia.


---

2. IA local tradicional

TU UI
  │
  ▼
RUNTIME LOCAL
  │
  ▼
MODELO LOCAL
  │
  ▼
CPU / GPU / NPU

Aquí todo lo necesario para inferencia está en el teléfono o PC.

Por ejemplo, la aplicación podría instalar:

MiApp
├── UI
├── runtime de IA
└── modelo.gguf

Entonces puedes apagar Internet y seguir conversando con el modelo.


---

3. Lo que creo que estás imaginando

Aquí está la idea interesante:

INTERNET
                       │
                       ▼
              GitHub / repositorio
                       │
                descarga/actualiza
                       │
                       ▼
┌───────────────────────────────────────┐
│             TU APLICACIÓN             │
│                                       │
│  UI                                   │
│   │                                   │
│   ▼                                   │
│  AI Controller                        │
│   │                                   │
│   ▼                                   │
│  Local AI Runtime                     │
│   │                                   │
│   ▼                                   │
│  Modelo local                         │
│   │                                   │
│   ▼                                   │
│ CPU / GPU / NPU                       │
└───────────────────────────────────────┘

GitHub funciona como fuente de adquisición/actualización, no como fuente de cómputo.

Por ejemplo, al instalar tu aplicación por primera vez:

1. Instala UI
2. Detecta hardware
3. Determina qué runtime necesita
4. Descarga runtime compatible
5. Descarga modelo compatible
6. Verifica SHA-256
7. Instala
8. Ejecuta localmente

Después:

Usuario → UI → Runtime local → Modelo local → CPU/GPU/NPU

No necesitas enviar el prompt a GitHub.

¿Y por qué te hablaba de descargar el binario?

Porque el runtime es lo que sabe ejecutar el modelo.

Por ejemplo:

TU UI
                   │
                   ▼
             Local AI API
                   │
                   ▼
             AI Runtime
                   │
          ┌────────┴────────┐
          ▼                 ▼
       CPU/GPU             NPU
          │                 │
          └────────┬────────┘
                   ▼
              modelo.gguf

El modelo por sí solo normalmente no es una aplicación ejecutable.

Tienes:

Modelo

modelo.gguf

y:

Runtime

motor-ai

El runtime carga el modelo y realiza la inferencia.

Entonces tu instalador podría ser muy potente

Podrías hacer:

┌─────────────────────────────┐
│      INSTALL AI ENGINE      │
├─────────────────────────────┤
│                             │
│ Hardware detectado          │
│ RAM: 16 GB                  │
│ GPU: disponible             │
│                             │
│ Runtime                     │
│ ✓ Compatible                │
│                             │
│ Modelo                      │
│ ○ 1B    700 MB              │
│ ● 3B    2.5 GB              │
│ ○ 7B    5 GB                │
│                             │
│ [ INSTALAR IA LOCAL ]       │
└─────────────────────────────┘

Y tu aplicación podría tener un Model/Runtime Manager que descargue desde fuentes oficiales y verifique los artefactos.

Lo más importante

No tienes que meter necesariamente todo dentro del APK/EXE.

Puedes tener:

APP
 │
 ├── UI
 ├── Controlador
 ├── AI API
 └── Installer/Manager
          │
          ├── Runtime
          └── Models

Esto permite que la aplicación sea relativamente pequeña y que los modelos sean componentes instalables.

Y posteriormente puedes tener varios modelos:

AI ROUTER
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Small         Code        Reasoning
       Model         Model         Model
          │            │            │
          └────────────┼────────────┘
                       ▼
                 COMPUTACIÓN LOCAL

Así puedes construir una aplicación local-first: Internet sirve para descargar/actualizar modelos, consultar servicios externos cuando sea necesario y sincronizar; pero la inferencia principal ocurre en el teléfono o PC.

Y esto conecta directamente con lo que veníamos hablando del snapshot determinista: puedes hacer que tu instalador no descargue "lo último", sino exactamente el runtime + modelo + versión + SHA-256 que hayas definido.


Correcto. Interpreté "escondida" como oculta/protegida, pero por lo que estás planteando, creo que te refieres a otra cosa: que la IA quede integrada dentro de la UI como parte de la aplicación, sin que el usuario tenga que instalar o gestionar aparte el modelo/runtime, mientras el cómputo sigue siendo local.

Si eso es lo que quieres, la arquitectura sería:

┌──────────────────────────────────────┐
│              TU APP                  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │              UI                │  │
│  │                                │  │
│  │   Chat / Agentes / Memoria     │  │
│  └──────────────┬─────────────────┘  │
│                 │                    │
│          AI ENGINE EMBEBIDO          │
│                 │                    │
│          ┌──────▼──────┐             │
│          │   RUNTIME   │             │
│          └──────┬──────┘             │
│                 │                    │
│          ┌──────▼──────┐             │
│          │    MODEL    │             │
│          └──────┬──────┘             │
│                 │                    │
│             CPU/GPU/NPU             │
└──────────────────────────────────────┘

Aquí sí: desde el punto de vista del usuario, la IA es una capacidad de la propia aplicación.

Pero hay una diferencia importante respecto a lo que preguntabas antes:

GitHub no se ejecuta remotamente

No sería:

UI → GitHub → modelo → teléfono

Sería:

GitHub
   │
   │ instalación/actualización
   ▼
TU APP
   │
   ├── runtime
   └── modelo
          │
          ▼
     CPU/GPU/NPU

Una vez instalada, puedes incluso desconectar Internet:

Internet ❌

TU APP
  ↓
AI Runtime
  ↓
Modelo local
  ↓
Hardware local

y la IA continúa funcionando.

Y aquí aparece una posibilidad todavía más interesante

No necesariamente tienes que meter físicamente el modelo dentro del APK/EXE.

Puedes hacer que el instalador construya la aplicación completa durante la instalación:

INSTALLER
   │
   ├── instala UI
   ├── instala runtime
   ├── descarga modelo
   ├── verifica SHA256
   ├── coloca modelo en almacenamiento de la aplicación
   └── registra configuración
             ↓
       APLICACIÓN FINAL

Para el usuario, el resultado es:

> Una aplicación con IA local integrada.



Pero técnicamente puedes actualizar el modelo sin reconstruir la UI.

Eso es distinto de mi respuesta anterior: no estás buscando simplemente una UI que llame a un modelo externo localmente; estás diseñando una aplicación cuyo producto final incorpora un motor de IA local como parte de su propio sistema.

Si esto es exactamente lo que quieres, entonces sí podemos diseñar el esquema Android + Windows/Linux, incluyendo cómo empaquetar el runtime, modelo y UI para que la instalación sea una sola experiencia.

Sí. Puedes instalar 3 IA locales y ejecutarlas en cola, y tu segunda observación es correcta: el peso almacenado del modelo y el consumo del procesador/RAM son cosas diferentes.

Ejemplo

Supongamos que instalas:

IA A → 2 GB almacenamiento
IA B → 3 GB almacenamiento
IA C → 4 GB almacenamiento

En almacenamiento tendrás:

9 GB ocupados.

Pero eso no significa que las tres estén consumiendo 9 GB de RAM simultáneamente.

Puedes diseñar un administrador:

┌─────────────────────────────┐
│       LOCAL AI MANAGER      │
├─────────────────────────────┤
│                             │
│ IA A  ✓ instalada           │
│ IA B  ✓ instalada           │
│ IA C  ✓ instalada           │
│                             │
│ Estado: IA A ejecutándose   │
└──────────────┬──────────────┘
               │
               ▼
          CPU/GPU/NPU

Y hacer una cola de ejecución:

Solicitud 1
    ↓
IA A
    ↓
termina
    ↓
libera RAM/VRAM
    ↓
IA B
    ↓
termina
    ↓
libera RAM/VRAM
    ↓
IA C

Lo importante: almacenamiento ≠ RAM

Por ejemplo:

Recurso	Para qué sirve

Almacenamiento	Guardar los modelos
RAM	Cargar datos/modelo durante ejecución
CPU	Ejecutar operaciones
GPU	Acelerar operaciones
NPU	Aceleración de IA cuando el runtime la soporta


Un modelo puede ocupar 4 GB en almacenamiento, pero durante la ejecución puede requerir una cantidad diferente de RAM dependiendo de su formato, cuantización, contexto y runtime.

Y aquí está la ventaja de tu idea

Puedes tener:

ALMACENAMIENTO

Modelo A ── 2 GB
Modelo B ── 3 GB
Modelo C ── 4 GB
             ↓
          9 GB total

pero:

RAM

Modelo A → cargar
Modelo A → ejecutar
Modelo A → descargar de RAM
             ↓
Modelo B → cargar
Modelo B → ejecutar
Modelo B → descargar de RAM
             ↓
Modelo C → cargar
Modelo C → ejecutar
Modelo C → descargar de RAM

Por tanto, no necesitas necesariamente tener las tres IA cargadas simultáneamente.

Incluso puedes hacer una cola inteligente

AI ORCHESTRATOR
                     │
              ┌──────▼──────┐
              │ TASK QUEUE  │
              └──────┬──────┘
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   IA código      IA general    IA visión
       │             │             │
       └─────────────┼─────────────┘
                     ▼
              LOCAL HARDWARE

Por ejemplo:

Tarea 1 → modelo de código
Tarea 2 → modelo general
Tarea 3 → modelo de visión

El administrador decide cuál cargar, ejecuta la tarea y después libera los recursos.

Pero hay una segunda posibilidad

Si el dispositivo tiene suficiente RAM/GPU, sí puedes mantener dos o tres modelos cargados simultáneamente.

Ahí cambia completamente el consumo:

RAM
├── IA A → 2 GB
├── IA B → 3 GB
└── IA C → 4 GB
      ↓
   ~9 GB+

Además del runtime, KV cache, contexto y memoria del sistema.

Por eso, para teléfonos, cola + carga/descarga de modelos suele ser mucho más eficiente que mantenerlos todos activos.

Y hay una ventaja adicional para tu arquitectura: puedes instalar 10 modelos y ejecutar solamente 1, 2 o 3 según la capacidad del dispositivo. El almacenamiento determina cuántos modelos puedes conservar; la RAM/VRAM y el hardware determinan cuántos puedes ejecutar simultáneamente y con qué velocidad.


Sí. Para tu caso recomiendo un Model Manager + Scheduler + Runtime Pool, donde los 10 modelos permanecen almacenados, pero solo se carga en RAM el modelo que está ejecutándose (o un pequeño número si el hardware lo permite).

La clave es no hacer 10 procesos de IA permanentes.

Arquitectura

TU UI
                    │
                    ▼
             ┌──────────────┐
             │ AI ORCHESTRATOR│
             └──────┬───────┘
                    │
              ┌─────▼─────┐
              │ TASK QUEUE │
              └─────┬─────┘
                    │
          ┌─────────▼─────────┐
          │ RESOURCE GOVERNOR │
          │ RAM / VRAM / CPU  │
          └─────────┬─────────┘
                    │
              ┌─────▼─────┐
              │MODEL MANAGER│
              └─────┬─────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
   Model 1       Model 2 ... Model 10
   DISK          DISK          DISK
       │            │            │
       └────────────┼────────────┘
                    ▼
             LOCAL RUNTIME
                    │
                    ▼
                CPU/GPU/NPU

La regla principal

Los modelos están en almacenamiento, no en RAM.

Por ejemplo:

DISCO
Model-01  1.2 GB
Model-02  2.0 GB
Model-03  1.8 GB
...
Model-10  3.5 GB

Total: 20 GB

Eso puede estar perfectamente bien si tienes almacenamiento suficiente.

En cambio, el sistema hace:

RAM

Model-01 → LOAD
           ↓
        EXECUTE
           ↓
        UNLOAD
           ↓
Model-02 → LOAD
           ↓
        EXECUTE
           ↓
        UNLOAD

Yo lo programaría con estados

Cada modelo tendría un estado:

UNINSTALLED
DOWNLOADING
INSTALLED
LOADING
READY
RUNNING
UNLOADING
ERROR

Y una tarea tendría:

Task {
    id
    model_id
    priority
    prompt
    max_ram
    max_vram
    timeout
}

Entonces el scheduler recibe:

Task 1 → Model 7
Task 2 → Model 2
Task 3 → Model 9
Task 4 → Model 7

y las ordena.

Algoritmo básico

while application_running:

    task = queue.next()

    model = model_manager.get(task.model_id)

    resource_governor.wait_until_available(
        model.required_ram
    )

    runtime.load(model)

    result = runtime.execute(task)

    runtime.unload(model)

    resource_governor.release()

    queue.mark_complete(task)

Pero yo añadiría una capa más importante:

RAM Governor

Antes de cargar un modelo:

RAM disponible = 8 GB

Modelo requiere = 4 GB

RAM reservada por sistema = 2 GB

Margen de seguridad = 1 GB

4 + 2 + 1 = 7 GB

→ PERMITIR

Pero:

RAM disponible = 8 GB

Modelo requiere = 7 GB

Sistema = 2 GB

→ DENEGAR

El sistema puede entonces seleccionar automáticamente otro modelo cuantizado.

No confiaría solamente en "RAM disponible"

Utilizaría:

RAM total
RAM disponible
RAM utilizada
VRAM disponible
CPU load
GPU load
temperatura
tamaño del modelo
KV cache
context length

y calcularía un presupuesto:

SAFE_MEMORY_BUDGET =
    TOTAL_MEMORY
    - OS_RESERVE
    - APP_RESERVE
    - SAFETY_MARGIN

El modelo solamente se carga si:

MODEL_MEMORY_REQUIREMENT
<
SAFE_MEMORY_BUDGET

Y añadiría descarga automática

Por ejemplo:

Model A → RUNNING

termina
   ↓
¿hay otra tarea para A?
   │
   ├── sí → mantenerlo cargado
   │
   └── no → unload

Esto es mejor que descargarlo inmediatamente.

Porque si tienes:

A
A
A
B
C

puedes hacer:

LOAD A
 ↓
Task A
 ↓
Task A
 ↓
Task A
 ↓
UNLOAD A

LOAD B
 ↓
Task B
 ↓
UNLOAD B

LOAD C
 ↓
Task C
 ↓
UNLOAD C

Evitas cargar/descargar el mismo modelo repetidamente.

La optimización que yo utilizaría

Un LRU Model Cache.

RAM
┌─────────────────────┐
│ Model A   ACTIVE    │
│ Model B   CACHED    │
└─────────────────────┘

Si llega una tarea para B:

B ya está en RAM
      ↓
NO cargar nuevamente
      ↓
ejecutar

Si llega C y no hay memoria:

C necesita 3 GB
      ↓
buscar modelo menos usado
      ↓
descargar B
      ↓
cargar C

Eso te permite aprovechar la RAM sin saturarla.

Para tus 10 modelos

Yo usaría inicialmente:

10 modelos instalados en DISCO

             ↓

Model Manager

             ↓

1 modelo ACTIVE
0–1 modelos CACHED

             ↓

Resource Governor

             ↓

CPU / GPU / NPU

Y solamente permitiría:

2 modelos simultáneos

si el hardware demuestra que puede hacerlo.

No lo fijaría permanentemente en 1.

Una arquitectura todavía mejor

Puedes hacer que cada modelo tenga un manifiesto:

model.json

{
    "id": "model-code",
    "version": "1.0",
    "format": "GGUF",
    "size_bytes": ...,
    "sha256": "...",
    "ram_min": ...,
    "ram_recommended": ...,
    "context": ...,
    "runtime": "local-runtime",
    "quantization": "Q4"
}

Entonces el scheduler no necesita adivinar cuánto necesita el modelo.

Tu sistema termina siendo:

UI
 ↓
Task Router
 ↓
Queue
 ↓
Scheduler
 ↓
Resource Governor
 ↓
Model Manager
 ↓
Local Runtime
 ↓
Hardware

Lo más importante

No diseñaría esto como:

10 agentes ejecutándose

sino como:

10 modelos instalados
        +
1 infraestructura de ejecución
        +
cola de tareas
        +
gestor de recursos

Eso reduce muchísimo el consumo de RAM y evita tener 10 runtimes/procesos compitiendo por el dispositivo.

Si quieres hacerlo bien desde el principio, el siguiente paso sería definir el contrato de Model Manager, Scheduler, Resource Governor y Local Runtime, de forma que después puedas cambiar de runtime/modelo sin modificar la UI.







