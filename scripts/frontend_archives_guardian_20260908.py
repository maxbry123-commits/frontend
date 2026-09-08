#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import stat
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

ROOT = Path("📂componentes open soure fromtend")
ARCHIVES = ROOT / "archives"
MANIFEST = ARCHIVES / "RESEARCH_DOWNLOAD_MANIFEST.jsonl"
CONTROL = ROOT / "control" / "watchdog-20260908"
LFS_MARKER = b"version https://git-lfs.github.com/spec/v1"
MAX_MEMBER = 256 * 1024 * 1024
MAX_TOTAL = 4 * 1024 * 1024 * 1024
MAX_RATIO = 250
SAFE_GARBAGE_NAMES = {".DS_Store", "Thumbs.db"}
SAFE_GARBAGE_DIRS = {"__MACOSX", "__pycache__", ".pytest_cache"}

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def read_manifest() -> list[dict]:
    if not MANIFEST.is_file():
        raise RuntimeError(f"MANIFEST_GAP:{MANIFEST}")
    rows = []
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        if line.strip():
            row = json.loads(line)
            for key in ("slug", "source", "source_commit", "parts", "status"):
                if key not in row:
                    raise RuntimeError(f"MANIFEST_SCHEMA_GAP:{key}:{row}")
            rows.append(row)
    if not rows:
        raise RuntimeError("MANIFEST_EMPTY")
    return rows

def safe_member(info: zipfile.ZipInfo) -> tuple[bool, str]:
    raw = info.filename
    if "\x00" in raw or "\\" in raw:
        return False, "UNSAFE_NAME"
    p = PurePosixPath(raw)
    if p.is_absolute() or ".." in p.parts:
        return False, "UNSAFE_PATH"
    mode = (info.external_attr >> 16) & 0o170000
    if mode in {stat.S_IFLNK, stat.S_IFCHR, stat.S_IFBLK, stat.S_IFIFO, stat.S_IFSOCK}:
        return False, "UNSAFE_TYPE"
    if info.file_size > MAX_MEMBER:
        return False, "MEMBER_BUDGET"
    compressed = max(1, info.compress_size)
    if info.file_size / compressed > MAX_RATIO:
        return False, "EXPANSION_RATIO"
    return True, ""

def normalize_payload(stage: Path, slug: str) -> Path:
    candidate = stage / slug
    if candidate.is_dir():
        return candidate
    entries = [p for p in stage.iterdir() if p.name not in {".DS_Store"}]
    dirs = [p for p in entries if p.is_dir()]
    files = [p for p in entries if p.is_file()]
    if len(dirs) == 1 and not files:
        return dirs[0]
    return stage

def extract_stage(parts: list[Path], slug: str) -> tuple[tempfile.TemporaryDirectory, Path, dict]:
    td = tempfile.TemporaryDirectory(prefix=f"rdc-{slug[:24]}-")
    stage = Path(td.name)
    seen: dict[str, str] = {}
    total_uncompressed = 0
    part_evidence = []
    try:
        for part in parts:
            with zipfile.ZipFile(part) as zf:
                bad = zf.testzip()
                if bad:
                    raise RuntimeError(f"CRC_FAIL:{part.name}:{bad}")
                infos = zf.infolist()
                part_total = sum(x.file_size for x in infos)
                total_uncompressed += part_total
                if total_uncompressed > MAX_TOTAL:
                    raise RuntimeError(f"TOTAL_BUDGET:{slug}:{total_uncompressed}")
                for info in infos:
                    ok, reason = safe_member(info)
                    if not ok:
                        raise RuntimeError(f"{reason}:{part.name}:{info.filename}")
                    if info.is_dir():
                        continue
                    rel = PurePosixPath(info.filename)
                    dst = stage.joinpath(*rel.parts)
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    with zf.open(info) as src:
                        data = src.read()
                    digest = hashlib.sha256(data).hexdigest()
                    key = rel.as_posix()
                    if key in seen and seen[key] != digest:
                        raise RuntimeError(f"COLLISION_BLOCKED:archive_parts:{key}")
                    seen[key] = digest
                    if not dst.exists():
                        dst.write_bytes(data)
                part_evidence.append({
                    "name": part.name,
                    "bytes": part.stat().st_size,
                    "sha256": sha256_file(part),
                    "members": len(infos),
                    "uncompressed": part_total,
                })
        payload = normalize_payload(stage, slug)
        files = sorted(p for p in payload.rglob("*") if p.is_file())
        if not files:
            raise RuntimeError(f"EMPTY_EXTRACTION:{slug}")
        lfs = []
        for p in files:
            if p.stat().st_size <= 2048 and p.read_bytes().startswith(LFS_MARKER):
                lfs.append(p.relative_to(payload).as_posix())
        if lfs:
            raise RuntimeError(f"SOURCE_LFS_POINTER_GAP:{slug}:{','.join(lfs[:20])}")
        return td, payload, {"parts": part_evidence, "payload_files": len(files)}
    except Exception:
        td.cleanup()
        raise

def compare_payload(payload: Path, target: Path) -> dict:
    missing = []
    collision = []
    hashes = []
    for src in sorted(p for p in payload.rglob("*") if p.is_file()):
        rel = src.relative_to(payload)
        digest = sha256_file(src)
        hashes.append(f"{digest}  {rel.as_posix()}")
        dst = target / rel
        if not dst.exists():
            missing.append(rel.as_posix())
        elif not dst.is_file() or sha256_file(dst) != digest:
            collision.append(rel.as_posix())
    tree = hashlib.sha256("\n".join(hashes).encode()).hexdigest()
    return {"missing": missing, "collision": collision, "tree_sha256": tree, "payload_files": len(hashes)}

def check_target_lfs(target: Path) -> list[str]:
    bad = []
    if not target.exists():
        return bad
    for p in target.rglob("*"):
        if not p.is_file():
            continue
        try:
            if p.stat().st_size <= 2048 and p.read_bytes().startswith(LFS_MARKER):
                bad.append(p.relative_to(target).as_posix())
        except OSError:
            pass
    return bad

def scan_safe_garbage() -> list[Path]:
    found: list[Path] = []
    if not ROOT.exists():
        return found
    for p in ROOT.rglob("*"):
        if p == ARCHIVES or ARCHIVES in p.parents:
            continue
        if p.is_file() and p.name in SAFE_GARBAGE_NAMES:
            found.append(p)
        elif p.is_dir() and p.name in SAFE_GARBAGE_DIRS:
            found.append(p)
    return sorted(set(found), key=lambda p: (len(p.parts), p.as_posix()), reverse=True)

def remove_safe_garbage(paths: list[Path]) -> list[str]:
    removed = []
    for p in paths:
        rel = p.relative_to(ROOT).as_posix()
        if not p.exists():
            continue
        if p.is_dir():
            shutil.rmtree(p)
        else:
            p.unlink()
        removed.append(rel)
    return removed

def audit_or_repair(mode: str) -> dict:
    rows = read_manifest()
    all_zips = sorted(ARCHIVES.glob("*.zip"))
    expected_names = set()
    components = []
    changed_files = 0
    for row in rows:
        slug = str(row["slug"])
        parts_n = int(row["parts"])
        expected = [ARCHIVES / f"{slug}_{i:04d}.zip" for i in range(1, parts_n + 1)]
        expected_names.update(p.name for p in expected)
        missing_parts = [p.name for p in expected if not p.is_file()]
        item = {
            "slug": slug,
            "source": row["source"],
            "source_commit": row["source_commit"],
            "manifest_status": row["status"],
            "expected_parts": parts_n,
            "state": None,
        }
        if row["status"] != "COMPLETE":
            item.update(state="ARCHIVE_INCOMPLETE", missing_parts=missing_parts)
            components.append(item)
            continue
        if missing_parts:
            item.update(state="ARCHIVE_GAP", missing_parts=missing_parts)
            components.append(item)
            continue
        target = ROOT / slug
        try:
            td, payload, evidence = extract_stage(expected, slug)
            try:
                cmp = compare_payload(payload, target)
                lfs_target = check_target_lfs(target)
                if lfs_target:
                    item.update(state="TARGET_LFS_POINTER_GAP", lfs_pointers=lfs_target[:50], **evidence, **cmp)
                elif cmp["collision"]:
                    item.update(state="COLLISION_BLOCKED", **evidence, **cmp)
                elif target.exists() and not cmp["missing"]:
                    src_commit = target / "SOURCE_COMMIT.txt"
                    if src_commit.exists() and src_commit.read_text(encoding="utf-8").strip() != row["source_commit"]:
                        item.update(state="SOURCE_COMMIT_MISMATCH", **evidence, **cmp)
                    else:
                        item.update(state="VERIFY_EXISTING", **evidence, **cmp)
                else:
                    before = len(cmp["missing"])
                    if mode == "repair":
                        target.mkdir(parents=True, exist_ok=True)
                        for rel in cmp["missing"]:
                            src = payload.joinpath(*PurePosixPath(rel).parts)
                            dst = target.joinpath(*PurePosixPath(rel).parts)
                            dst.parent.mkdir(parents=True, exist_ok=True)
                            if dst.exists():
                                raise RuntimeError(f"COLLISION_BLOCKED:late:{slug}:{rel}")
                            shutil.copy2(src, dst)
                            changed_files += 1
                        su = target / "SOURCE_URL.txt"
                        sc = target / "SOURCE_COMMIT.txt"
                        if not su.exists():
                            su.write_text(str(row["source"]).removesuffix(".git") + "\n", encoding="utf-8")
                            changed_files += 1
                        if not sc.exists():
                            sc.write_text(str(row["source_commit"]) + "\n", encoding="utf-8")
                            changed_files += 1
                        cmp2 = compare_payload(payload, target)
                        if cmp2["missing"] or cmp2["collision"]:
                            item.update(state="REPAIR_VERIFY_GAP", before_missing=before, **evidence, **cmp2)
                        else:
                            item.update(state="EXTRACT_ONLY_REPAIRED", before_missing=before, **evidence, **cmp2)
                    else:
                        item.update(state="EXTRACT_ONLY_PENDING", **evidence, **cmp)
            finally:
                td.cleanup()
        except Exception as e:
            item.update(state="GAP", error=str(e))
        components.append(item)

    unmanaged = [p for p in all_zips if p.name not in expected_names]
    safe_garbage = scan_safe_garbage()
    removed = remove_safe_garbage(safe_garbage) if mode == "repair" else []
    changed_files += len(removed)

    retryable = [x for x in components if x["state"] == "EXTRACT_ONLY_PENDING"]
    hard_gaps = [x for x in components if x["state"] not in {"VERIFY_EXISTING", "EXTRACT_ONLY_REPAIRED", "EXTRACT_ONLY_PENDING"}]
    verified = [x for x in components if x["state"] in {"VERIFY_EXISTING", "EXTRACT_ONLY_REPAIRED"}]
    report = {
        "schema": "tel.workflow/v3",
        "mode": "FAIL_CLOSED_LOOP",
        "skill_ref": "c789e5fe635e220230ffc759d86dc3bbb8e261d4",
        "operation": mode,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "root": str(ROOT),
        "xray": {
            "physical_zip_count": len(all_zips),
            "manifest_component_count": len(rows),
            "managed_zip_count": len([p for p in all_zips if p.name in expected_names]),
            "expected_managed_zip_count": len(expected_names),
            "unmanaged_zip_count": len(unmanaged),
            "unmanaged_archives": [
                {
                    "name": p.name,
                    "bytes": p.stat().st_size,
                    "sha256": sha256_file(p),
                    "state": "CLASSIFICATION_GAP",
                    "action": "NO_DELETE_NO_EXTRACT_WITHOUT_AUTHORITY",
                }
                for p in unmanaged
            ],
            "safe_garbage_detected": [p.relative_to(ROOT).as_posix() for p in safe_garbage],
            "safe_garbage_removed": removed,
        },
        "components": components,
        "totals": {
            "verified_components": len(verified),
            "retryable_component_gaps": len(retryable),
            "hard_component_gaps": len(hard_gaps),
            "classification_flags": len(unmanaged),
            "changed_files": changed_files,
        },
    }
    report["status"] = "VERIFIED_CLOSED" if not retryable and not hard_gaps and not unmanaged else "ACTIVE_LOOP"
    return report

def write_persistence(report: dict) -> None:
    CONTROL.mkdir(parents=True, exist_ok=True)
    (CONTROL / "STATE.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    checkpoint = {
        "generated_at": report["generated_at"],
        "status": report["status"],
        "xray": report["xray"],
        "totals": report["totals"],
        "next": "classify unmanaged archives; repair only manifest-governed retryable gaps",
    }
    (CONTROL / "CHECKPOINT.json").write_text(json.dumps(checkpoint, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (CONTROL / "PLAN.md").write_text(
        "# PLAN — Frontend archives watchdog\n\n1. VERIFY_EXISTING for manifest-governed components.\n2. EXTRACT_ONLY only when a manifest-governed target is missing/incomplete.\n3. Never overwrite collisions; never redownload existing valid archives.\n4. Unmanaged archives remain CLASSIFICATION_GAP until authority/destination is proven.\n5. Watchdog audits hourly; Repair Guardian is the only writer.\n",
        encoding="utf-8",
    )
    (CONTROL / "RECOVERY.md").write_text(
        "# RECOVERY\n\n"
        f"- Skill ref: `{report['skill_ref']}`\n- Root: `{report['root']}`\n- Status: `{report['status']}`\n"
        f"- Physical ZIPs: {report['xray']['physical_zip_count']}\n- Unmanaged archives: {report['xray']['unmanaged_zip_count']}\n"
        "- Resume by running the read-only auditor, then dispatch Repair Guardian only for retryable manifest-governed gaps.\n",
        encoding="utf-8",
    )
    (CONTROL / "README_ARQUITECTURA.md").write_text(
        "# Arquitectura — Repair Guardian + Watchdog Auditor\n\nEl Repair Guardian es el único escritor para esta raíz. El Watchdog Auditor es independiente y de solo lectura sobre el repositorio; únicamente puede solicitar un repair cuando no existe otro supervisor/escritor activo. El contrato prohíbe Git LFS, redescarga de ZIP válidos existentes, overwrite de colisiones y borrado de archivos sin clasificación demostrada.\n",
        encoding="utf-8",
    )
    bit = CONTROL / "BITACORA.md"
    previous = bit.read_text(encoding="utf-8") if bit.exists() else "# BITÁCORA\n"
    line = (
        f"\n- {report['generated_at']} | {report['status']} | ZIP={report['xray']['physical_zip_count']} "
        f"| managed={report['xray']['managed_zip_count']}/{report['xray']['expected_managed_zip_count']} "
        f"| unmanaged={report['xray']['unmanaged_zip_count']} | changed={report['totals']['changed_files']}\n"
    )
    bit.write_text(previous + line, encoding="utf-8")

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=("audit", "repair"), required=True)
    ap.add_argument("--report")
    args = ap.parse_args()
    report = audit_or_repair(args.mode)
    if args.mode == "repair":
        write_persistence(report)
    text = json.dumps(report, ensure_ascii=False, indent=2)
    print(text)
    if args.report:
        Path(args.report).write_text(text + "\n", encoding="utf-8")
    return 2 if report["totals"]["hard_component_gaps"] else 0

if __name__ == "__main__":
    raise SystemExit(main())
