import os, pathlib, subprocess

COMPONENTS = "📂componentes open soure fromtend"
INDEX = "📂 Indice fromtend componentes.md"
ARCH_ROOTS = [
    "Maxbry web",
    "UI YAIWES",
    "UI Osquestador Maxbry",
    "UI Osquestador auditor memoria",
    "UI router inteligente universal",
    "NCT neuronas code turbo",
    "Maxbry AGI",
]

def out(args, env=None):
    return subprocess.check_output(args, env=env, text=True).strip()

def run(args, env=None, data=None):
    return subprocess.run(args, env=env, input=data, check=True,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE)

base = out(["git", "rev-parse", "HEAD"])
subprocess.run(["git", "fetch", "origin", "main"], check=True)
if out(["git", "rev-parse", "origin/main"]) != base:
    raise SystemExit("FAIL_CLOSED: main changed before cleanup")

raw = subprocess.check_output(["git", "ls-tree", "-r", "-z", base])
entries = {}
for rec in raw.split(b"\0"):
    if not rec:
        continue
    meta, path = rec.split(b"\t", 1)
    mode, typ, sha = meta.decode().split(" ")
    if typ == "blob":
        entries[path.decode()] = (mode, sha)

idx = pathlib.Path(os.environ["RUNNER_TEMP"]) / "frontend-final.index"
idx.unlink(missing_ok=True)
env = os.environ.copy()
env["GIT_INDEX_FILE"] = str(idx)
run(["git", "read-tree", base], env=env)

zero = "0" * 40
ops = bytearray()
moved = []
copied = []
deleted = set()

def add_existing(src, dst, remove=True):
    if src not in entries:
        return
    mode, sha = entries[src]
    ops.extend((mode + " " + sha + "\t" + dst).encode() + b"\0")
    if remove:
        ops.extend(("0 " + zero + "\t" + src).encode() + b"\0")
        deleted.add(src)
        moved.append((src, dst))
    else:
        copied.append((src, dst))

def add_blob(path, content, mode="100644"):
    p = subprocess.run(
        ["git", "hash-object", "-w", "--stdin"],
        input=content.encode(),
        stdout=subprocess.PIPE,
        check=True,
    )
    sha = p.stdout.decode().strip()
    ops.extend((mode + " " + sha + "\t" + path).encode() + b"\0")

# 1. Move complete real-code roots byte-for-byte.
for src_prefix, dst_prefix in [
    ("src/", COMPONENTS + "/codigo real frontend/Frontend static legacy/"),
    ("software/router-universal-ui/", COMPONENTS + "/codigo real frontend/Router Universal UI/"),
]:
    for p in sorted(entries):
        if p.startswith(src_prefix):
            add_existing(p, dst_prefix + p[len(src_prefix):])

# 2. Move only code/config from Grok FROMTED; markdown notes are not preserved.
code_ext = {
    ".html", ".htm", ".json", ".jsonl", ".js", ".jsx", ".ts", ".tsx",
    ".css", ".scss", ".py", ".sh", ".yaml", ".yml", ".toml"
}
grok_prefix = "Trabajo de grock/fromted/"
for p in sorted(entries):
    if p.startswith(grok_prefix) and pathlib.PurePosixPath(p).suffix.lower() in code_ext:
        add_existing(
            p,
            COMPONENTS + "/codigo real frontend/Fromted React Vite/" + p[len(grok_prefix):],
        )

# 3. Explicit real-code/config/archive moves.
explicit = {
    "Trabajo de grock/fromted-design/fromted-design-01-chat.html":
        COMPONENTS + "/codigo real frontend/HTML Grok/fromted-design-01-chat.html",
    "Trabajo de grock/.github/workflows/fromted-sources.yml":
        COMPONENTS + "/herramientas descarga/fromted-sources.yml",
    "Trabajo de grock/infra/scripts/htpasswd_gen.py":
        COMPONENTS + "/codigo real heredado/Infra Grok/htpasswd_gen.py",
    "api/router.js":
        COMPONENTS + "/codigo real frontend/API router/router.js",
    "reception/DOC_UPLOAD_SCHEMA.yaml":
        COMPONENTS + "/codigo real frontend/Reception schema/DOC_UPLOAD_SCHEMA.yaml",
    "scripts/research_download_frontend_a.py":
        COMPONENTS + "/herramientas descarga/research_download_frontend_a.py",
    "scripts/research_download_frontend_b.py":
        COMPONENTS + "/herramientas descarga/research_download_frontend_b.py",
    "scripts/research_download_ui_yaiwes_03.py":
        COMPONENTS + "/herramientas descarga/research_download_ui_yaiwes_03.py",
    "vercel.json":
        COMPONENTS + "/codigo real frontend/Frontend static legacy/vercel.json",
    "trabajo-grok-main.zip":
        COMPONENTS + "/archives/trabajo-grok-main.zip",
}
for s, d in explicit.items():
    add_existing(s, d)

# 4. Delete every original main-root file except canonical components and .github.
for p in sorted(entries):
    top = p.split("/", 1)[0]
    if top in {COMPONENTS, ".github"}:
        continue
    if p not in deleted:
        ops.extend(("0 " + zero + "\t" + p).encode() + b"\0")
        deleted.add(p)

# 5. Second copy of every YAIWES engine adapter using identical blob SHAs.
adapter_prefix = COMPONENTS + "/UI YAIWES/"
adapter_dest = "UI YAIWES/Interface YAIWES ui/ENGINE ADAPTER/"
adapter_count = 0
for p in sorted(entries):
    if p.startswith(adapter_prefix):
        rel = p[len(adapter_prefix):]
        add_existing(p, adapter_dest + rel, remove=False)
        adapter_count += 1

empty_sha = subprocess.run(
    ["git", "hash-object", "-w", "--stdin"],
    input=b"",
    stdout=subprocess.PIPE,
    check=True,
).stdout.decode().strip()

def keep(path):
    ops.extend(("100644 " + empty_sha + "\t" + path).encode() + b"\0")

components = [
("OpenPencil","Editor de diseño/vectorial open source.","https://github.com/open-pencil/open-pencil","Fromtend code"),
("OpenDesign","Editor/plataforma open source para diseño visual.","https://github.com/nexu-io/open-design","Fromtend code"),
("Onlook","Editor visual de aplicaciones React/Next.js.","https://github.com/onlook-dev/onlook","Fromtend code"),
("Penpot","Diseño y prototipado colaborativo open source.","https://github.com/penpot/penpot","Fromtend code"),
("Webstudio","Constructor visual open source de sitios web.","https://github.com/webstudio-is/webstudio","Fromtend code"),
("Silex","Website builder open source/no-code.","https://github.com/silexlabs/Silex","Fromtend code"),
("Frappe Builder","Constructor low-code de páginas/sitios.","https://github.com/frappe/builder","Fromtend code"),
("BESSER","Plataforma low-code/model-driven para construir software.","https://github.com/BESSER-PEARL/BESSER","Fromtend code"),
("tldraw","SDK/editor de lienzo infinito y pizarra.","https://github.com/tldraw/tldraw","Fromtend code"),
("drawio","Aplicación open source para diagramas.","https://github.com/jgraph/drawio","Fromtend code"),
("xyflow","Librerías de nodos/grafos, incluida React Flow.","https://github.com/xyflow/xyflow","Fromtend code"),
("Craft.js","Framework React para editores drag-and-drop.","https://github.com/prevwong/craft.js","Fromtend code"),
("Mermaid","Genera diagramas desde texto.","https://github.com/mermaid-js/mermaid","Fromtend code"),
("PlantUML","Genera UML y diagramas desde texto.","https://github.com/plantuml/plantuml","Fromtend code"),
("anthropic-skills","Colección de skills reutilizables para agentes.","https://github.com/anthropics/skills","Fromtend code"),
("microsoft-skills","Colección de skills reutilizables de Microsoft.","https://github.com/microsoft/skills","Fromtend code"),
("ui-ux-pro-max-skill","Skill orientado a diseño UI/UX.","https://github.com/nextlevelbuilder/ui-ux-pro-max-skill","Fromtend code"),
("wordpress-agent-skills","Skills de agentes para WordPress.","https://github.com/Automattic/wordpress-agent-skills","Fromtend code"),
("frontend-audit-skill","Skill especializado en auditoría frontend.","https://github.com/colbymchenry/frontend-audit-skill","Fromtend code"),
("nolly-agent-skills","Colección de skills para agentes de desarrollo.","https://github.com/nolly-studio/agent-skills","Fromtend code"),
("PracticalSwan-agent-skills","Colección reutilizable de skills para agentes.","https://github.com/PracticalSwan/agent-skills","Fromtend code"),
("accessibility-skills","Skills para accesibilidad y revisión a11y.","https://github.com/mgifford/accessibility-skills","Fromtend code"),
("Transformers.js","Inferencia Transformers desde JavaScript.","https://github.com/huggingface/transformers.js","UI YAIWES"),
("MLC WebLLM","LLM en navegador con WebGPU.","https://github.com/mlc-ai/web-llm","UI YAIWES"),
("ONNX Runtime","Runtime de inferencia; incluye ejecución web de ONNX.","https://github.com/microsoft/onnxruntime","UI YAIWES"),
("wllama","Binding web de llama.cpp/GGUF con WASM y WebGPU.","https://github.com/ngxson/wllama","UI YAIWES"),
("LiteRT","Runtime on-device de Google; LiteRT.js usa WebGPU/WebNN/WASM.","https://github.com/google-ai-edge/LiteRT","UI YAIWES"),
("assistant-ui","Componentes/runtime React para interfaces de IA.","https://github.com/assistant-ui/assistant-ui","fromted-sources"),
("Dockview","Paneles, pestañas y layouts acoplables.","https://github.com/mathuo/dockview","fromted-sources"),
("i18next","Framework de internacionalización JavaScript.","https://github.com/i18next/i18next","fromted-sources"),
("react-i18next","Bindings React para i18next.","https://github.com/i18next/react-i18next","fromted-sources"),
("Lucide","Biblioteca open source de iconos SVG.","https://github.com/lucide-icons/lucide","fromted-sources"),
]
local_code = [
("Fromted React Vite","Aplicación React/Vite/TypeScript creada en trabajo de Grok; shell, chat, temas e i18n.",COMPONENTS + "/codigo real frontend/Fromted React Vite/"),
("HTML Grok","HTML ejecutable de diseño FROMTED creado por Grok.",COMPONENTS + "/codigo real frontend/HTML Grok/"),
("Frontend static legacy","Frontend HTML/CSS/JS raíz anterior y configuración Vercel.",COMPONENTS + "/codigo real frontend/Frontend static legacy/"),
("Router Universal UI","Interfaz HTML/CSS/JS del router universal.",COMPONENTS + "/codigo real frontend/Router Universal UI/"),
("API router","Proxy/API JavaScript del frontend hacia el router.",COMPONENTS + "/codigo real frontend/API router/"),
("Herramientas de descarga","Scripts Python/workflow usados para materializar componentes.",COMPONENTS + "/herramientas descarga/"),
("Reception schema","Schema YAML de recepción; configuración del flujo.",COMPONENTS + "/codigo real frontend/Reception schema/"),
("Infra Grok htpasswd","Utilidad Python heredada; revisar seguridad antes de reutilizar.",COMPONENTS + "/codigo real heredado/Infra Grok/"),
("Archivo trabajo-grok","ZIP histórico que contiene código del repo trabajo-grok.",COMPONENTS + "/archives/trabajo-grok-main.zip"),
]

lines = ["# 📂 Índice frontend componentes", "", "## Lista simple enumerada", ""]
n = 1
for name, function, url, group in components:
    lines.append(f"{n}. **{name}** — {group}")
    n += 1
for name, function, path in local_code:
    lines.append(f"{n}. **{name}** — código real propio/heredado")
    n += 1

lines += [
    "",
    "## Índice con nombre y función",
    "",
    "| # | Componente | Función simple | Fuente / ubicación | Grupo |",
    "|---:|---|---|---|---|",
]
n = 1
for name, function, url, group in components:
    lines.append(f"| {n} | {name} | {function} | {url} | {group} |")
    n += 1
for name, function, path in local_code:
    lines.append(f"| {n} | {name} | {function} | {path} | código real |")
    n += 1

lines += [
    "",
    "## ENGINE ADAPTER YAIWES",
    "",
    "~~~text",
    "ENGINE ADAPTER",
    "├── ✅ MLC WebLLM",
    "├── ✅ Transformers.js",
    "├── ✅ ONNX Runtime Web",
    "├── ✅ wllama",
    "└── ✅ LiteRT",
    "     ↓",
    "WebGPU / WebNN / WASM",
    "~~~",
    "",
    "WebGPU, WebNN y WASM son tecnologías de ejecución/aceleración, no aplicaciones independientes.",
    "",
    "## Rutas canónicas",
    "",
    "- " + COMPONENTS + "/Fromtend code/",
    "- " + COMPONENTS + "/UI YAIWES/",
    "- " + COMPONENTS + "/fromted-sources/",
    "- " + COMPONENTS + "/codigo real frontend/",
    "- " + COMPONENTS + "/herramientas descarga/",
]
add_blob(INDEX, "\n".join(lines) + "\n")

yaiwes = """# 📱 YAIWES — Arquitectura IA Local WebGPU + Hugging Face Remoto

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
"""
add_blob("UI YAIWES/Readme arquitectura UI YAIWES.md", yaiwes)

def generic(title):
    return (
        "# " + title + "\n\n"
        "Raíz de arquitectura solicitada. El código reutilizable vive en ../"
        + COMPONENTS + "/.\n\n"
        "## 🔌 Plugins / documentos enlazados\n"
        "<!-- PLUGIN_DOC_LINKS_START -->\n"
        "- Índice de componentes: ../📂 Indice fromtend componentes.md\n"
        "<!-- PLUGIN_DOC_LINKS_END -->\n"
    )

for root, readme, docs, dl, interface in [
    ("Maxbry web","Readme arquitectura Maxbry web.md","Documentos proyecto Maxbry web","download code Maxbry web",None),
    ("UI Osquestador Maxbry","Readme arquitectura UI osquestador Maxbry.md","Documentos proyecto UI osquestador Maxbry","download code UI osquestador Maxbry","Interface osquestador Maxbry ui"),
    ("UI Osquestador auditor memoria","Readme arquitectura UI osquestador auditor memoria.md","Documentos proyecto osquestador auditor memoria","download code UI osquestador auditor memoria","Interface osquestador auditor memoria ui"),
    ("UI router inteligente universal","Readme arquitectura UI router inteligente universal.md","Documentos proyecto UI router inteligente universal","download code UI router inteligente universal","Interface UI router inteligente universal"),
    ("NCT neuronas code turbo","Readme arquitectura UI nct neuronas code turbo.md","Documentos proyecto UI nct neuronas code turbo","download code UI nct neuronas code turbo",None),
    ("Maxbry AGI","Readme arquitectura UI Maxbry AGI.md","Documentos proyecto UI Maxbry AGI","download code UI Maxbry AGI",None),
]:
    add_blob(root + "/" + readme, generic(readme.rsplit(".", 1)[0]))
    keep(root + "/" + docs + "/.gitkeep")
    keep(root + "/" + dl + "/.gitkeep")
    if interface:
        keep(root + "/" + interface + "/.gitkeep")

keep("UI YAIWES/Documentos proyecto UI YAIWES/.gitkeep")
keep("UI YAIWES/download code UI YAIWES/.gitkeep")

if ops:
    run(["git", "update-index", "-z", "--index-info"], env=env, data=bytes(ops))

tree = out(["git", "write-tree"], env=env)
final_raw = subprocess.check_output(["git", "ls-tree", "-r", "-z", tree])
final_paths = {
    rec.split(b"\t", 1)[1].decode()
    for rec in final_raw.split(b"\0")
    if rec
}

allowed_top = {".github", COMPONENTS, INDEX, *ARCH_ROOTS}
final_top = {p.split("/", 1)[0] for p in final_paths}
extra = sorted(final_top - allowed_top)
if extra:
    raise SystemExit("VERIFY_FAIL extra roots: " + repr(extra))

required = [
    INDEX,
    "UI YAIWES/Readme arquitectura UI YAIWES.md",
    COMPONENTS + "/codigo real frontend/Fromted React Vite/index.html",
    COMPONENTS + "/codigo real frontend/HTML Grok/fromted-design-01-chat.html",
    COMPONENTS + "/codigo real frontend/Frontend static legacy/index.html",
    COMPONENTS + "/codigo real frontend/Router Universal UI/src/index.html",
    COMPONENTS + "/codigo real frontend/API router/router.js",
]
for p in required:
    if p not in final_paths:
        raise SystemExit("VERIFY_FAIL missing " + p)

adapter_paths = [p for p in final_paths if p.startswith(adapter_dest)]
for token in ["Transformers.js_", "MLC-WebLLM_", "ONNX-Runtime_", "wllama_", "LiteRT_"]:
    if not any(token in p for p in adapter_paths):
        raise SystemExit("VERIFY_FAIL adapter missing " + token)

subprocess.run(["git", "config", "user.name", "github-actions[bot]"], check=True)
subprocess.run(
    ["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"],
    check=True,
)
ce = os.environ.copy()
ce.update({
    "GIT_AUTHOR_NAME": "github-actions[bot]",
    "GIT_AUTHOR_EMAIL": "41898282+github-actions[bot]@users.noreply.github.com",
    "GIT_COMMITTER_NAME": "github-actions[bot]",
    "GIT_COMMITTER_EMAIL": "41898282+github-actions[bot]@users.noreply.github.com",
})
msg = (
    "chore(frontend): deterministic final architecture "
    + f"[moved={len(moved)} copied={len(copied)} adapters={adapter_count}]"
)
commit = run(
    ["git", "commit-tree", tree, "-p", base],
    env=ce,
    data=(msg + "\n").encode(),
).stdout.decode().strip()

subprocess.run(["git", "fetch", "origin", "main"], check=True)
if out(["git", "rev-parse", "origin/main"]) != base:
    raise SystemExit("FAIL_CLOSED: main changed during cleanup")

subprocess.run(["git", "push", "origin", commit + ":refs/heads/main"], check=True)
print("FINAL_COMMIT", commit)
print("MOVED_REAL_CODE", len(moved))
print("COPIED_ADAPTER_ENTRIES", len(copied))
print("ADAPTER_SOURCE_ENTRIES", adapter_count)
print("FINAL_TOP_LEVEL", sorted(final_top))
