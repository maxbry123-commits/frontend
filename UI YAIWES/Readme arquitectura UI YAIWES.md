# 📱 YAIWES — Arquitectura IA Local WebGPU + Hugging Face Remoto

## 1. OBJETIVO

YAIWES ejecuta IA desde móvil, PWA o navegador usando aceleración local cuando sea posible y Hugging Face remoto cuando sea necesario.

REGLA PRINCIPAL:

> WebGPU, WebNN y WASM NO son aplicaciones de chat.
> Son tecnologías de ejecución/aceleración.
>
> WebLLM, Transformers.js, ONNX Runtime Web, wllama y LiteRT
> son motores/librerías integrados DENTRO de YAIWES.
>
> YAIWES es la aplicación final.

## 2. ARQUITECTURA GENERAL

                    📱 YAIWES APP
                         │
                         ▼
                  🧠 LOCAL ROUTER
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       WebLLM      Transformers.js    wllama
          │              │              │
          └──────────────┼──────────────┘
                         ▼
              ONNX Runtime / LiteRT
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
            WebGPU     WebNN       WASM
              │          │          │
             GPU        NPU        CPU
                         │
                         ▼
               SI LOCAL NO ALCANZA
                         │
                         ▼
                  YAIWES ROUTER
                         │
                         ▼
                  FastAPI Gateway
                         │
                         ▼
                   HF1 → HF2 → HF3
                         │
                         ▼
              HUGGING FACE REMOTO

## 3. COMPONENTES

- WebGPU: API del navegador para utilizar GPU.
- WebNN: API de aceleración de redes neuronales/NPU cuando exista soporte.
- WASM: runtime web y fallback CPU.
- MLC WebLLM: LLM directamente en navegador.
- Transformers.js: modelos de texto, embeddings, clasificación, visión/audio compatibles desde JavaScript.
- ONNX Runtime Web: inferencia ONNX mediante backends web.
- wllama: llama.cpp/GGUF en entorno web.
- LiteRT.js: inferencia on-device con WebGPU/WebNN/WASM según dispositivo.
- LocalMode: abstracción para evitar dependencia de un único motor.

## 4. REGLA DE DISEÑO

Incorrecto: YAIWES UI → WebLLM

Correcto:

~~~text
YAIWES UI
    ↓
AI ROUTER
    ↓
ENGINE ADAPTER
    ├── WebLLM
    ├── Transformers.js
    ├── ONNX Runtime Web
    ├── wllama
    └── LiteRT
    ↓
WebGPU / WebNN / WASM
~~~

## 5. ROUTER LOCAL

Antes de Internet: modelo local → hardware → WebGPU/WebNN → RAM.
Si no alcanza, escalar al router remoto.

## 6. HUGGING FACE REMOTO

No duplicar pesos públicos por defecto. Conservar principalmente model_id, repo_id,
dataset_id, revision, commit SHA, hf URI, endpoint, capacidades y requisitos.

## 7. HF1 / HF2 / HF3

Workers de procesamiento, no tres almacenes duplicados.
HF1 principal → HF2 secundario → HF3 respaldo.
Política de escalado por recursos y sleep/wake cuando no haya petición.

## 8. FASTAPI GATEWAY

Interfaz común:
/v1/chat
/v1/models
/v1/embeddings
/v1/audio
/v1/vision

El router decide motor/proveedor.

## 9. GITHUB ↔ HUGGING FACE

GitHub: código, workflows, adaptadores, contratos, manifests, configuración, pruebas e infraestructura.
Hugging Face: biblioteca remota de modelos/datasets, Jobs, inferencia, procesamiento y resultados.

Puentes compatibles:
01. Frontend
02. Orquestador
03. Orquestador Auditor Memoria
04. Agentes
05. Motor Agentes Workflow YAIWES
06. Router Inteligente Universal
07. MAXBRY AGI
08. NCT Core

NO construir ocho sistemas HF independientes.

## 10. PRINCIPIO INMUTABLE

1. No tratar WebGPU como aplicación completa.
2. No descargar pesos por defecto.
3. No duplicar modelos entre HF1/HF2/HF3.
4. Preferir referencias remotas.
5. Mantener UI separada de motores.
6. Usar adapters intercambiables.
7. Intentar local cuando sea apropiado.
8. Escalar a remoto cuando local no alcance.
9. GitHub es fuente de código; HF biblioteca/procesamiento.
10. Excepciones de almacenamiento de pesos requieren autorización explícita.

## 🔌 PLUGIN / CABLEADO DE DOCUMENTOS

Añadir enlaces relativos únicamente entre estos marcadores.

<!-- PLUGIN_DOC_LINKS_START -->
- Índice de componentes: ../📂 Indice fromtend componentes.md
<!-- PLUGIN_DOC_LINKS_END -->
