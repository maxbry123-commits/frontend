from __future__ import annotations

import hashlib
import posixpath
from dataclasses import asdict, dataclass
from typing import Iterable

MIN_FILES = 1
MAX_FILES = 100


@dataclass(frozen=True)
class InputFile:
    path: str
    content: bytes
    kind: str = "UNKNOWN"


@dataclass(frozen=True)
class ManifestEntry:
    path: str
    sha256: str
    size: int
    kind: str


def _safe_path(path: str) -> str:
    if not path or "\\" in path:
        raise ValueError("unsafe_input_path")
    normalized = posixpath.normpath(path)
    if normalized in ("", ".", "..") or normalized.startswith("../") or normalized.startswith("/"):
        raise ValueError("unsafe_input_path")
    return normalized


def build_file_manifest(files: Iterable[InputFile]) -> dict:
    """Build a deterministic, side-effect-free manifest for 1..100 project files.

    This adapter validates intake only. It does not schedule work, own queues,
    persist STATE/CHECKPOINT, or replace Stabilize CORE.
    """
    items = tuple(files)
    if not MIN_FILES <= len(items) <= MAX_FILES:
        raise ValueError("file_count_must_be_between_1_and_100")

    entries: list[ManifestEntry] = []
    seen: set[str] = set()
    for item in items:
        path = _safe_path(item.path)
        if path in seen:
            raise ValueError(f"duplicate_input_path:{path}")
        seen.add(path)
        kind = item.kind.strip() if item.kind and item.kind.strip() else "UNKNOWN"
        entries.append(
            ManifestEntry(
                path=path,
                sha256=hashlib.sha256(item.content).hexdigest(),
                size=len(item.content),
                kind=kind,
            )
        )

    entries.sort(key=lambda entry: entry.path)
    payload = [asdict(entry) for entry in entries]
    digest_source = "\n".join(
        f"{entry.path}\0{entry.sha256}\0{entry.size}\0{entry.kind}" for entry in entries
    ).encode("utf-8")
    return {
        "schema": "yaiwes.file-intake/v1",
        "file_count": len(entries),
        "files": payload,
        "manifest_sha256": hashlib.sha256(digest_source).hexdigest(),
    }
