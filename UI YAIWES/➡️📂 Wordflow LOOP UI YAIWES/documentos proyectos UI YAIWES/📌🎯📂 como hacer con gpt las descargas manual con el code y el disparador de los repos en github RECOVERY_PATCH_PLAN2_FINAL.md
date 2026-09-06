# RECOVERY PATCH — RECICLAJE-CODE PLAN 2
## Manual ChatGPT + GitHub
## Núcleo Plan 1 completo + adaptación manual

> **Documento maestro de recuperación.**
>
> Al recibir este documento, ChatGPT debe reconocer y activar:
>
> `RECICLAJE-CODE / PLAN 2 / MANUAL_CHATGPT_GITHUB`
>
> Este parche contiene el protocolo de recuperación y **todo el código/contratos del Plan 1 que ya fue construido**, adaptado para que ChatGPT sea el controlador del trabajo manual.
>
> **Importante:** el código específico de un repositorio real NO se debe inventar desde este parche. Primero se investiga el repositorio fuente y después el repositorio destino; entonces ChatGPT adapta este núcleo y genera el paquete final.

---

# 1. ESTADO DE RECUPERACIÓN

```text
SYSTEM = RECICLAJE-CODE
PLAN = 2
MODE = MANUAL_CHATGPT_GITHUB

NO_LFS = TRUE
LARGE_FILE_POLICY = FAIL_CLOSED

PUSH_TARGET = ~1.5 GiB
PUSH_HARD_LIMIT = 2 GiB
FILE_HARD_LIMIT = 100 MiB
```

## Primera acción al recibir este documento

**No generar código específico todavía.**

Preguntar únicamente:

> **¿Qué repositorio quieres que investigue?**

---

# 2. OBJETIVO

Plan 2 es el mismo núcleo determinista de Reciclaje de Code del Plan 1, pero el controlador cambia:

```text
PLAN 1
Wordflow / Kernel
        ↓
Reciclaje de Code
        ↓
GitHub
```

```text
PLAN 2
Recovery Patch
        ↓
ChatGPT
        ↓
investiga fuente
        ↓
investiga destino
        ↓
adapta código
        ↓
genera ZIP/código
        ↓
usuario incorpora a GitHub
        ↓
COMMIT / PUSH
        ↓
ChatGPT guía y verifica
        ↓
siguiente batch
```

---

# 3. PROTOCOLO DE CHAT

## Paso 1 — RECOVER

Al recibir este documento:

```text
STATUS = RECOVERED
MODE = PLAN_2_MANUAL
```

ChatGPT reconoce el sistema y no asume ningún repositorio.

## Paso 2 — SOURCE

Preguntar:

> ¿Qué repositorio quieres que investigue?

Puede ser:

```text
owner/repo
```

o una URL.

## Paso 3 — INVESTIGATE SOURCE

Investigar el repositorio real:

```text
estructura
lenguaje
framework
package manager
dependencias
scripts
entrypoints
configuración
.gitignore
workflows
releases
licencia
tamaño
archivos grandes
SHA/tag/branch
método de adquisición
```

## Paso 4 — DESTINATION

Después de conocer la fuente, pedir:

```text
destination_repo
destination_branch
destination_path
```

si todavía no fueron proporcionados.

Investigar el destino cuando sea necesario.

## Paso 5 — PLAN

Resolver:

```text
source SHA
inventory
file gate
batch plan
trigger
archivos necesarios
commit/push sequence
verification
```

## Paso 6 — GENERATE

Generar código real adaptado al repositorio.

El ZIP contiene código y archivos necesarios, no un manual de instrucciones para el usuario.

## Paso 7 — MANUAL GITHUB LOOP

ChatGPT guía:

```text
BATCH 001
↓
usuario incorpora archivos
↓
COMMIT
↓
PUSH
↓
usuario informa resultado
↓
ChatGPT verifica
↓
BATCH 002
```

## Paso 8 — COMPLETE

Solo declarar:

```text
IMPORT_COMPLETE
```

después de la verificación final.

---

# 4. REGLAS FUNDAMENTALES

```text
NO Git LFS
NO inventar estructura
NO inventar archivos
NO inventar SHA
NO asumir branch inmutable
NO partir artificialmente blobs >100 MiB
NO marcar complete por push solamente
NO repetir batches confirmados
NO confundir tamaño descargado con tamaño de push
NO generar implementación específica antes de investigar
```

---

# 5. LÍMITES

```text
FILE_LIMIT = 100 MiB
PUSH_TARGET = ~1.5 GiB
PUSH_HARD_LIMIT = 2 GiB
```

El límite de archivo y el límite de push son independientes.

```text
2 GB de fuente
≠
2 GB por descarga
≠
2 commits obligatorios
```

El batch engine calcula los lotes.

---

# 6. FLUJO COMPLETO

```text
TRIGGER
 ↓
JOB
 ↓
RESOLVE_SOURCE_SHA
 ↓
ACQUIRE
 ↓
INVENTORY
 ↓
FILE_GATE
 ↓
BATCH_ENGINE
 ↓
BATCH 001
 ↓
COMMIT
 ↓
PUSH
 ↓
VERIFY
 ↓
CHECKPOINT
 ↓
BATCH 002
 ↓
...
 ↓
COMPLETE
```

En Plan 2, el usuario ejecuta/integra manualmente las operaciones de GitHub mientras ChatGPT controla la secuencia.

---

# 7. ARCHIVOS DEL PLAN 1 QUE SE CONSERVAN

El Plan 1 original contiene:

```text
recycle_code/__init__.py
recycle_code/models.py
recycle_code/inventory.py
recycle_code/policy.py
recycle_code/batcher.py
recycle_code/checkpoint.py
recycle_code/trigger.py
recycle_code/engine.py
recycle_code/cli.py

wordflow/recycle_code.workflow.json
wordflow/recycle_code.contract.json

tests/test_plan1.py
pyproject.toml
```

**Todos quedan representados en este Recovery Patch.**

Además, Plan 2 añade el concepto de recuperación/manualidad y un template de trigger GitHub Actions que se adapta al repositorio real.

---

# 8. CÓDIGO — recycle_code/__init__.py

```python
__version__ = "0.1.0"
```

---

# 9. CÓDIGO — recycle_code/models.py

```python
from dataclasses import dataclass, field
from enum import Enum


class Status(str, Enum):
    CREATED = "CREATED"
    RESOLVING_SOURCE = "RESOLVING_SOURCE"
    ACQUIRING = "ACQUIRING"
    INVENTORYING = "INVENTORYING"
    VALIDATING = "VALIDATING"
    BLOCKED_LARGE_FILE = "BLOCKED_LARGE_FILE"
    PLANNING_BATCH = "PLANNING_BATCH"
    BUILDING_BATCH = "BUILDING_BATCH"
    ESTIMATING_PACK = "ESTIMATING_PACK"
    COMMITTING = "COMMITTING"
    PUSHING = "PUSHING"
    VERIFYING = "VERIFYING"
    CHECKPOINTING = "CHECKPOINTING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


@dataclass(frozen=True)
class FileEntry:
    path: str
    size: int
    sha256: str
    mode: int
    kind: str = "file"


@dataclass
class Batch:
    id: int
    files: list[FileEntry] = field(default_factory=list)
    estimated_bytes: int = 0


@dataclass
class Policy:
    use_lfs: bool = False
    large_file_mode: str = "fail_closed"
    max_file_bytes: int = 100 * 1024 * 1024
    target_push_bytes: int = int(1.5 * 1024**3)
    hard_push_bytes: int = 2 * 1024**3


@dataclass
class Job:
    job_id: str
    source_repo: str
    source_ref: str
    destination_repo: str
    destination_branch: str
    destination_path: str
    source_sha: str | None = None
    inventory_hash: str | None = None
    status: Status = Status.CREATED
    completed_batches: int = 0
    last_remote_sha: str | None = None
```

---

# 10. CÓDIGO — recycle_code/inventory.py

```python
import hashlib
import json
from pathlib import Path

from .models import FileEntry


def sha256_file(path: Path, chunk: int = 1024 * 1024) -> str:
    h = hashlib.sha256()

    with path.open("rb") as f:
        while True:
            data = f.read(chunk)
            if not data:
                break
            h.update(data)

    return h.hexdigest()


def inventory(root: Path) -> list[FileEntry]:
    out = []

    for path in sorted(
        root.rglob("*"),
        key=lambda x: x.relative_to(root).as_posix(),
    ):
        if not path.is_file():
            continue

        relative = path.relative_to(root).as_posix()
        stat = path.stat()

        out.append(
            FileEntry(
                path=relative,
                size=stat.st_size,
                sha256=sha256_file(path),
                mode=stat.st_mode & 0o777,
            )
        )

    return out


def manifest_hash(entries: list[FileEntry]) -> str:
    payload = [
        {
            "path": entry.path,
            "size": entry.size,
            "sha256": entry.sha256,
            "mode": entry.mode,
            "kind": entry.kind,
        }
        for entry in entries
    ]

    raw = json.dumps(
        payload,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")

    return hashlib.sha256(raw).hexdigest()
```

---

# 11. CÓDIGO — recycle_code/policy.py

```python
from .models import Policy, FileEntry


class PolicyViolation(Exception):
    pass


def validate_files(
    entries: list[FileEntry],
    policy: Policy,
):
    if policy.use_lfs:
        raise PolicyViolation(
            "NO_LFS policy violated"
        )

    large = [
        entry
        for entry in entries
        if entry.size > policy.max_file_bytes
    ]

    if large:
        raise PolicyViolation(
            "BLOCKED_LARGE_FILE: "
            + ", ".join(
                f"{entry.path} ({entry.size} bytes)"
                for entry in large
            )
        )
```

---

# 12. CÓDIGO — recycle_code/batcher.py

```python
from .models import Batch, FileEntry, Policy


def plan_batches(
    entries: list[FileEntry],
    policy: Policy,
):
    # Deterministic first-pass planner.
    # Actual Git pack size must be checked before push.
    batches = []
    current = Batch(1)

    for entry in entries:
        if (
            current.files
            and current.estimated_bytes + entry.size
            > policy.target_push_bytes
        ):
            batches.append(current)
            current = Batch(len(batches) + 1)

        current.files.append(entry)
        current.estimated_bytes += entry.size

    if current.files:
        batches.append(current)

    return batches


def split_batch(batch: Batch):
    if len(batch.files) <= 1:
        raise ValueError(
            "Cannot split a single-file batch "
            "by file boundaries"
        )

    midpoint = len(batch.files) // 2

    left_files = batch.files[:midpoint]
    right_files = batch.files[midpoint:]

    left = Batch(
        batch.id,
        left_files,
        sum(x.size for x in left_files),
    )

    right = Batch(
        batch.id + 1,
        right_files,
        sum(x.size for x in right_files),
    )

    return left, right
```

---

# 13. CÓDIGO — recycle_code/checkpoint.py

```python
import json
from pathlib import Path


class CheckpointStore:

    def __init__(self, path: Path):
        self.path = path

    def load(self):
        if not self.path.exists():
            return {}

        return json.loads(
            self.path.read_text(
                encoding="utf-8"
            )
        )

    def save(self, state):
        self.path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        temporary = self.path.with_suffix(".tmp")

        temporary.write_text(
            json.dumps(
                state,
                indent=2,
                sort_keys=True,
            ),
            encoding="utf-8",
        )

        temporary.replace(self.path)
```

---

# 14. CÓDIGO — recycle_code/trigger.py

```python
def normalize_trigger(payload: dict) -> dict:
    required = (
        "source_repo",
        "source_ref",
        "destination_repo",
        "destination_branch",
        "destination_path",
    )

    missing = [
        item
        for item in required
        if not payload.get(item)
    ]

    if missing:
        raise ValueError(
            "Missing trigger fields: "
            + ", ".join(missing)
        )

    return {
        "action": "recycle_code",
        "source_repo": payload["source_repo"],
        "source_ref": payload["source_ref"],
        "destination_repo": payload["destination_repo"],
        "destination_branch": payload["destination_branch"],
        "destination_path": payload["destination_path"],
        "policy": payload.get("policy", {}),
    }
```

---

# 15. CÓDIGO — recycle_code/engine.py

```python
from pathlib import Path

from .models import Job, Policy, Status
from .inventory import inventory, manifest_hash
from .policy import validate_files, PolicyViolation
from .batcher import plan_batches


class RecycleEngine:

    def __init__(self, policy=None):
        self.policy = policy or Policy()

    def inspect_source(
        self,
        job: Job,
        source_dir: Path,
    ):
        job.status = Status.INVENTORYING

        entries = inventory(source_dir)

        job.inventory_hash = manifest_hash(entries)

        job.status = Status.VALIDATING

        try:
            validate_files(
                entries,
                self.policy,
            )
        except PolicyViolation:
            job.status = Status.BLOCKED_LARGE_FILE
            raise

        batches = plan_batches(
            entries,
            self.policy,
        )

        job.status = Status.PLANNING_BATCH

        return entries, batches

    def plan(
        self,
        job: Job,
        source_dir: Path,
    ):
        entries, batches = self.inspect_source(
            job,
            source_dir,
        )

        return {
            "job_id": job.job_id,
            "source_sha": job.source_sha,
            "inventory_hash": job.inventory_hash,
            "files": len(entries),
            "bytes": sum(
                entry.size
                for entry in entries
            ),
            "batches": [
                {
                    "id": batch.id,
                    "files": len(batch.files),
                    "estimated_bytes":
                        batch.estimated_bytes,
                }
                for batch in batches
            ],
        }
```

---

# 16. CÓDIGO — recycle_code/cli.py

```python
import argparse
import json
import uuid
from pathlib import Path

from .models import Job
from .engine import RecycleEngine


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--source-dir",
        required=True,
    )

    parser.add_argument(
        "--source-repo",
        required=True,
    )

    parser.add_argument(
        "--source-ref",
        required=True,
    )

    parser.add_argument(
        "--destination-repo",
        required=True,
    )

    parser.add_argument(
        "--destination-branch",
        default="main",
    )

    parser.add_argument(
        "--destination-path",
        default="vendor/source",
    )

    args = parser.parse_args()

    job = Job(
        job_id="RC-" + uuid.uuid4().hex[:12],
        source_repo=args.source_repo,
        source_ref=args.source_ref,
        destination_repo=args.destination_repo,
        destination_branch=args.destination_branch,
        destination_path=args.destination_path,
    )

    result = RecycleEngine().plan(
        job,
        Path(args.source_dir),
    )

    print(
        json.dumps(
            result,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
```

---

# 17. CÓDIGO — PLAN 1 WORDflow CONTRACT

Archivo:

```text
wordflow/recycle_code.contract.json
```

```json
{
  "action": "recycle_code",
  "required": [
    "source_repo",
    "source_ref",
    "destination_repo",
    "destination_branch",
    "destination_path"
  ],
  "optional": {
    "policy": {
      "use_lfs": false,
      "large_file_mode": "fail_closed"
    }
  }
}
```

En Plan 2 este contrato se usa como **contrato conceptual de entrada**, aunque el Wordflow/Kernel no sea quien opere el trabajo.

---

# 18. CÓDIGO — PLAN 1 WORDflow WORKFLOW

Archivo:

```text
wordflow/recycle_code.workflow.json
```

```json
{
  "name": "recycle_code",
  "version": "1.0",
  "trigger": {
    "type": "workflow_dispatch",
    "action": "recycle_code"
  },
  "steps": [
    "create_job",
    "resolve_source_sha",
    "acquire",
    "inventory",
    "validate_policy",
    "plan_batches",
    "execute_batches",
    "verify_remote",
    "checkpoint",
    "complete"
  ],
  "policy": {
    "use_lfs": false,
    "large_file_mode": "fail_closed",
    "max_file_bytes": 104857600,
    "target_push_bytes": 1610612736,
    "hard_push_bytes": 2147483648
  }
}
```

En Plan 2 este workflow sirve como **especificación de la secuencia**, y el código final puede transformarse/adaptarse a la infraestructura real del repositorio destino.

---

# 19. CÓDIGO — TRIGGER GITHUB ACTIONS ADAPTADO A PLAN 2

Este archivo es una plantilla de trigger para cuando la investigación confirme que GitHub Actions es apropiado:

```yaml
name: Recycle Code

on:
  workflow_dispatch:
    inputs:
      source_repo:
        description: "Source repository"
        required: true
        type: string

      source_ref:
        description: "Immutable source SHA, tag or branch"
        required: true
        type: string

      destination_path:
        description: "Destination path"
        required: true
        type: string

      job_id:
        description: "Recycle job identifier"
        required: true
        type: string

jobs:
  recycle-code:
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
      - name: Checkout destination
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run recycle engine
        env:
          SOURCE_REPO: ${{ inputs.source_repo }}
          SOURCE_REF: ${{ inputs.source_ref }}
          DESTINATION_PATH: ${{ inputs.destination_path }}
          JOB_ID: ${{ inputs.job_id }}
        run: |
          python -m recycle_code.cli \
            --source-repo "$SOURCE_REPO" \
            --source-ref "$SOURCE_REF" \
            --destination-repo "${GITHUB_REPOSITORY}" \
            --destination-branch "${GITHUB_REF_NAME}" \
            --destination-path "$DESTINATION_PATH"
```

**Regla:** no copiar este YAML a ciegas. ChatGPT debe adaptarlo después de estudiar el repositorio destino.

---

# 20. CÓDIGO — TESTS DEL PLAN 1

Archivo:

```text
tests/test_plan1.py
```

```python
from recycle_code.models import (
    Policy,
    FileEntry,
)

from recycle_code.batcher import (
    plan_batches,
)

from recycle_code.inventory import (
    inventory,
    manifest_hash,
)

from recycle_code.policy import (
    validate_files,
    PolicyViolation,
)


def test_deterministic_inventory(tmp_path):
    (tmp_path / "b.txt").write_text("b")
    (tmp_path / "a.txt").write_text("a")

    first = inventory(tmp_path)
    second = inventory(tmp_path)

    assert [
        entry.path for entry in first
    ] == [
        "a.txt",
        "b.txt",
    ]

    assert manifest_hash(first) == \
        manifest_hash(second)


def test_batching():
    policy = Policy(
        target_push_bytes=10
    )

    entries = [
        FileEntry(
            "a",
            6,
            "a",
            0o644,
        ),
        FileEntry(
            "b",
            5,
            "b",
            0o644,
        ),
    ]

    batches = plan_batches(
        entries,
        policy,
    )

    assert len(batches) == 2


def test_large_file_closed():
    policy = Policy(
        max_file_bytes=10
    )

    entries = [
        FileEntry(
            "big",
            11,
            "x",
            0o644,
        )
    ]

    try:
        validate_files(
            entries,
            policy,
        )
        assert False
    except PolicyViolation:
        pass
```

---

# 21. CÓDIGO — PYPROJECT DEL PLAN 1

Archivo:

```text
pyproject.toml
```

```toml
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "reciclaje-code"
version = "0.1.0"
description = "Deterministic Source Acquisition & Repository Import Engine"
requires-python = ">=3.10"

[project.scripts]
recycle-code = "recycle_code.cli:main"
```

---

# 22. ADAPTACIÓN MANUAL DEL MOTOR

Plan 2 conserva estas funciones:

```text
ACQUIRE
INVENTORY
FILE GATE
BATCH
COMMIT
PUSH
VERIFY
CHECKPOINT
```

Pero las acciones de GitHub se coordinan mediante el chat.

Ejemplo:

```text
CHATGPT
↓
BATCH 001 READY
↓
usuario incorpora el código
↓
COMMIT 001
↓
PUSH 001
↓
usuario informa:
"push 001 OK"
↓
ChatGPT verifica
↓
BATCH 002
```

---

# 23. REGLA DE COMMIT/PUSH POR BATCH

Cada batch lógico debe tener una frontera clara.

```text
BATCH 001
→ COMMIT 001
→ PUSH 001

BATCH 002
→ COMMIT 002
→ PUSH 002

BATCH 003
→ COMMIT 003
→ PUSH 003
```

No asumir:

```text
2 GB = 2 batches
```

El número real sale del batch planner y de la verificación del tamaño del pack.

---

# 24. VERIFICACIÓN

La verificación debe comparar:

```text
SOURCE MANIFEST
        ↓
DESTINATION TREE
        ↓
PATH
SIZE
SHA256
MODE
        ↓
MATCH
```

El push exitoso por sí solo no equivale a `COMPLETE`.

---

# 25. CHECKPOINT DE TRABAJO MANUAL

El estado conversacional puede representarse como:

```json
{
  "job_id": "RC-example",
  "source_repo": "owner/source",
  "source_ref": "SHA",
  "destination_repo": "owner/destination",
  "destination_branch": "main",
  "destination_path": "vendor/source",
  "inventory_hash": "HASH",
  "completed_batches": [],
  "current_batch": 1,
  "last_remote_sha": null,
  "status": "READY"
}
```

Después de cada batch:

```json
{
  "completed_batches": [1],
  "current_batch": 2,
  "status": "VERIFYING"
}
```

---

# 26. ERROR / RECUPERACIÓN

Si un push falla:

```text
FAILED_PUSH
```

ChatGPT no debe asumir que el remoto quedó sin cambios.

Primero se verifica.

Si el remoto confirma que el batch ya existe:

```text
BATCH = VERIFIED
```

Si no:

```text
BATCH = RETRY_REQUIRED
```

Si el problema es de tamaño:

```text
SPLIT_BATCH
```

Si el problema es un archivo >100 MiB:

```text
BLOCKED_LARGE_FILE
```

---

# 27. ESTADOS

```text
TRIGGERED
RECOVERED
WAITING_FOR_SOURCE
RESEARCHING_SOURCE
WAITING_FOR_DESTINATION
RESEARCHING_DESTINATION
RESOLVING_SOURCE_SHA
ACQUIRING
INVENTORYING
VALIDATING
BLOCKED_LARGE_FILE
PLANNING_BATCHES
GENERATING_CODE
READY_FOR_MANUAL_COMMIT
READY_FOR_MANUAL_PUSH
VERIFYING
CHECKPOINTING
NEXT_BATCH
COMPLETED
FAILED
```

---

# 28. QUÉ SIGNIFICA "GENERAR ZIP"

Cuando ChatGPT termine la investigación de un proyecto real, el ZIP final debe contener **los archivos reales adaptados a ese repositorio**.

No tiene que contener este Recovery Patch salvo que sea necesario.

No debe contener un manual genérico de uso.

La guía de ejecución se mantiene en el chat.

El ZIP puede contener:

```text
.github/workflows/...
recycle_code/...
scripts/...
config/...
tests/...
```

según lo que la investigación determine.

---

# 29. TRES SIMULACIONES DE REFERENCIA

## Simulación A — 2 GB, archivos pequeños

```text
SOURCE ≈ 2 GB
NINGÚN ARCHIVO >100 MiB

BATCH 001 ≈ 1.5 GiB
COMMIT 001
PUSH 001
VERIFY

BATCH 002 ≈ resto
COMMIT 002
PUSH 002
VERIFY

COMPLETE
```

## Simulación B — 5 GB

```text
SOURCE ≈ 5 GB

BATCH 001
BATCH 002
BATCH 003
BATCH 004
...

El número final depende de los tamaños reales
y del pack Git.
```

## Simulación C — archivo individual >100 MiB

```text
SOURCE
 ↓
INVENTORY
 ↓
large.bin = 120 MiB
 ↓
FILE GATE
 ↓
BLOCKED_LARGE_FILE
```

No usar LFS.

No fragmentar artificialmente el blob.

---

# 30. REGLA FINAL DE OPERACIÓN

Después de recuperar este parche, ChatGPT debe empezar exactamente aquí:

```text
STATUS = WAITING_FOR_SOURCE

Pregunta:
"¿Qué repositorio quieres que investigue?"
```

No debe:

```text
crear ZIP
inventar source
inventar destination
inventar SHA
inventar archivos
```

hasta tener la información necesaria y haber investigado el repositorio real.

---

# 31. CHECKLIST DE COMPLETITUD DEL PLAN 1 INCORPORADO

```text
[x] models.py
[x] inventory.py
[x] policy.py
[x] batcher.py
[x] checkpoint.py
[x] trigger.py
[x] engine.py
[x] cli.py
[x] __init__.py
[x] workflow contract
[x] workflow definition
[x] GitHub workflow_dispatch template
[x] tests
[x] pyproject
[x] deterministic inventory
[x] manifest hash
[x] 100 MiB file gate
[x] NO_LFS
[x] ~1.5 GiB target
[x] 2 GiB hard limit
[x] batch split
[x] checkpoint
[x] state machine
[x] manual commit/push loop
[x] verification concept
[x] recovery behavior
[x] 3 reference simulations
[x] Plan 2 recovery protocol
```

**END — RECOVERY PATCH PLAN 2**
