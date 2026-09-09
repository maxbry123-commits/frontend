#!/usr/bin/env python3
"""Deterministic GitHub component acquisition engine for Hugging Face Jobs.

Downloads an exact Git ref, rejects Git LFS pointers/special files, creates a
reproducible ZIP, splits it into GitHub-safe parts, optionally publishes parts
to a destination GitHub repository, and performs remote read-back verification.
"""
from __future__ import annotations

import base64
import hashlib
import json
import os
import pathlib
import shutil
import stat
import subprocess
import tempfile
import time
import zipfile

SCHEMA = "yaiwes.hf.component-download.v1"
LFS_POINTER = b"version https://git-lfs.github.com/spec/v1\n"
PART_SIZE = int(os.getenv("PART_SIZE_MIB", "12")) * 1024 * 1024
MAX_GITHUB_BLOB = int(os.getenv("MAX_GITHUB_BLOB_MIB", "95")) * 1024 * 1024
SOURCE_REPO = os.getenv("SOURCE_REPO", "").strip()
SOURCE_REF = os.getenv("SOURCE_REF", "HEAD").strip() or "HEAD"
SLUG = os.getenv("SLUG", "").strip()
DEST_REPO = os.getenv("DEST_REPO", "maxbry123-commits/frontend").strip()
DEST_BRANCH = os.getenv("DEST_BRANCH", "main").strip() or "main"
DEST_ROOT = os.getenv("DEST_ROOT", "").strip().strip("/")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
PUBLISH = os.getenv("PUBLISH", "0").lower() in {"1", "true", "yes"}


def run(argv, cwd=None, env=None, check=True):
    p = subprocess.run(argv, cwd=cwd, env=env, text=True,
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    if check and p.returncode:
        raise RuntimeError(f"COMMAND_FAILED:{argv[0]}:{p.returncode}:{p.stdout[-2000:]}")
    return p.stdout.strip()


def sha256(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def repo_url(repo: str) -> str:
    if repo.startswith("https://github.com/"):
        return repo[:-4] if repo.endswith(".git") else repo
    return f"https://github.com/{repo[:-4] if repo.endswith('.git') else repo}"


def default_slug(repo: str) -> str:
    return repo.rstrip("/").removesuffix(".git").split("/")[-1]


def git_no_lfs(repo_dir: pathlib.Path):
    run(["git", "config", "filter.lfs.clean", "cat"], repo_dir)
    run(["git", "config", "filter.lfs.smudge", "cat"], repo_dir)
    run(["git", "config", "--unset-all", "filter.lfs.process"], repo_dir, check=False)
    run(["git", "config", "filter.lfs.required", "false"], repo_dir)


def acquire(work: pathlib.Path) -> tuple[pathlib.Path, str]:
    src = work / "source"
    src.mkdir()
    run(["git", "init", "-q"], src)
    run(["git", "remote", "add", "origin", repo_url(SOURCE_REPO) + ".git"], src)
    git_no_lfs(src)
    # Exact requested ref; shallow + partial clone keeps history/network bounded.
    run(["git", "fetch", "--depth=1", "--filter=blob:none", "origin", SOURCE_REF], src)
    run(["git", "checkout", "-q", "--detach", "FETCH_HEAD"], src)
    commit = run(["git", "rev-parse", "HEAD"], src)
    return src, commit


def scan_tree(src: pathlib.Path):
    files = []
    pointers = []
    specials = []
    total = 0
    for p in sorted(src.rglob("*"), key=lambda x: x.as_posix()):
        if ".git" in p.parts:
            continue
        try:
            mode = p.lstat().st_mode
        except OSError:
            continue
        rel = p.relative_to(src).as_posix()
        if stat.S_ISLNK(mode) or not (stat.S_ISREG(mode) or stat.S_ISDIR(mode)):
            specials.append(rel)
            continue
        if not p.is_file():
            continue
        size = p.stat().st_size
        total += size
        if size <= 1024:
            with p.open("rb") as f:
                if f.read(1024).startswith(LFS_POINTER):
                    pointers.append(rel)
        files.append((p, rel, mode))
    if pointers:
        raise RuntimeError("SOURCE_LFS_POINTER_GAP:" + ",".join(pointers[:30]))
    if specials:
        raise RuntimeError("SOURCE_SPECIAL_FILE_GAP:" + ",".join(specials[:30]))
    if not files:
        raise RuntimeError("EMPTY_SOURCE_TREE")
    return files, total


def deterministic_zip(files, bundle: pathlib.Path):
    # Fixed timestamps/order/permissions make the ZIP reproducible for the same tree.
    with zipfile.ZipFile(bundle, "w", compression=zipfile.ZIP_DEFLATED,
                         compresslevel=6, allowZip64=True) as z:
        for p, rel, mode in files:
            info = zipfile.ZipInfo(rel, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            perms = 0o755 if (mode & stat.S_IXUSR) else 0o644
            info.external_attr = (perms & 0xFFFF) << 16
            with p.open("rb") as f:
                z.writestr(info, f.read(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=6)
    with zipfile.ZipFile(bundle) as z:
        bad = z.testzip()
        if bad:
            raise RuntimeError(f"ZIP_CRC_FAIL:{bad}")


def split_bundle(bundle: pathlib.Path, out: pathlib.Path, slug: str):
    out.mkdir(parents=True, exist_ok=True)
    rows = []
    with bundle.open("rb") as f:
        i = 1
        while True:
            data = f.read(PART_SIZE)
            if not data:
                break
            name = f"{slug}.bundle.zip.part-{i:04d}"
            p = out / name
            p.write_bytes(data)
            if p.stat().st_size >= MAX_GITHUB_BLOB:
                raise RuntimeError(f"GIT_BLOB_LIMIT_GAP:{name}:{p.stat().st_size}")
            rows.append({"name": name, "bytes": p.stat().st_size, "sha256": sha256(p)})
            i += 1
    if not rows:
        raise RuntimeError("EMPTY_BUNDLE")
    return rows


def reconstruct(parts_dir: pathlib.Path, rows, expected_sha: str):
    rebuilt = parts_dir / "_reconstructed.bundle.zip"
    with rebuilt.open("wb") as w:
        for row in rows:
            p = parts_dir / row["name"]
            if sha256(p) != row["sha256"]:
                raise RuntimeError(f"PART_HASH_MISMATCH:{row['name']}")
            with p.open("rb") as r:
                shutil.copyfileobj(r, w, 1024 * 1024)
    if sha256(rebuilt) != expected_sha:
        raise RuntimeError("BUNDLE_RECONSTRUCTION_HASH_MISMATCH")
    with zipfile.ZipFile(rebuilt) as z:
        bad = z.testzip()
        if bad:
            raise RuntimeError(f"RECONSTRUCTED_ZIP_CRC_FAIL:{bad}")
    rebuilt.unlink()


def auth_env(token: str):
    env = dict(os.environ)
    raw = base64.b64encode(f"x-access-token:{token}".encode()).decode()
    env.update({
        "GIT_CONFIG_COUNT": "1",
        "GIT_CONFIG_KEY_0": "http.https://github.com/.extraheader",
        "GIT_CONFIG_VALUE_0": f"AUTHORIZATION: basic {raw}",
        "GIT_TERMINAL_PROMPT": "0",
    })
    return env


def publish(work: pathlib.Path, parts_dir: pathlib.Path, manifest_path: pathlib.Path, slug: str):
    if not GITHUB_TOKEN:
        return {"verdict": "WRITE_AUTH_GAP", "detail": "GITHUB_TOKEN is not available in the Hugging Face Job"}
    if not DEST_ROOT:
        return {"verdict": "DESTINATION_GAP", "detail": "DEST_ROOT is required for publish mode"}

    dst = work / "destination"
    env = auth_env(GITHUB_TOKEN)
    run(["git", "clone", "--depth=1", "--branch", DEST_BRANCH,
         f"https://github.com/{DEST_REPO}.git", str(dst)], env=env)
    run(["git", "config", "user.name", "yaiwes-hf-download-engine"], dst)
    run(["git", "config", "user.email", "yaiwes-hf-download-engine@users.noreply.github.com"], dst)
    target = dst / DEST_ROOT / slug
    if target.exists():
        raise RuntimeError(f"DESTINATION_EXISTS:{DEST_ROOT}/{slug}")
    target.mkdir(parents=True)
    for p in sorted(parts_dir.iterdir()):
        if p.is_file() and not p.name.startswith("_"):
            shutil.copy2(p, target / p.name)
    shutil.copy2(manifest_path, target / "DOWNLOAD_MANIFEST.json")

    for p in target.rglob("*"):
        if p.is_file() and p.stat().st_size >= MAX_GITHUB_BLOB:
            raise RuntimeError(f"GIT_BLOB_LIMIT_GAP:{p.relative_to(dst)}:{p.stat().st_size}")
    run(["git", "add", "--", str((pathlib.Path(DEST_ROOT) / slug).as_posix())], dst)
    run(["git", "commit", "-m", f"build(hf-download): publish {slug} deterministic bundle"], dst)

    # NO_FORCE_GIT: rebase on any concurrent main advancement or fail closed.
    run(["git", "fetch", "origin", DEST_BRANCH], dst, env=env)
    reb = run(["git", "rebase", f"origin/{DEST_BRANCH}"], dst, env=env, check=False)
    if "CONFLICT" in reb:
        run(["git", "rebase", "--abort"], dst, check=False)
        raise RuntimeError("NON_FAST_FORWARD_CONFLICT")
    run(["git", "push", "origin", f"HEAD:{DEST_BRANCH}"], dst, env=env)
    commit = run(["git", "rev-parse", "HEAD"], dst)

    # Remote read-back using a new checkout and rehash every published part.
    rb = work / "readback"
    run(["git", "clone", "--depth=1", "--branch", DEST_BRANCH,
         f"https://github.com/{DEST_REPO}.git", str(rb)], env=env)
    remote_target = rb / DEST_ROOT / slug
    remote_manifest = json.loads((remote_target / "DOWNLOAD_MANIFEST.json").read_text())
    for row in remote_manifest["parts"]:
        rp = remote_target / row["name"]
        if not rp.exists() or sha256(rp) != row["sha256"]:
            raise RuntimeError(f"READBACK_HASH_GAP:{row['name']}")
    return {"verdict": "PUBLISHED_READBACK_VERIFIED", "commit": commit}


def main():
    started = time.time()
    if not SOURCE_REPO:
        raise SystemExit(json.dumps({"schema": SCHEMA, "verdict": "INPUT_GAP", "detail": "SOURCE_REPO is required"}))
    slug = SLUG or default_slug(SOURCE_REPO)
    with tempfile.TemporaryDirectory(prefix="yaiwes-hf-download-") as td:
        work = pathlib.Path(td)
        src, commit = acquire(work)
        files, source_bytes = scan_tree(src)
        bundle = work / f"{slug}.bundle.zip"
        deterministic_zip(files, bundle)
        bundle_hash = sha256(bundle)
        parts_dir = work / "parts"
        parts = split_bundle(bundle, parts_dir, slug)
        reconstruct(parts_dir, parts, bundle_hash)
        manifest = {
            "schema": SCHEMA,
            "source_repo": SOURCE_REPO,
            "source_ref": SOURCE_REF,
            "source_commit": commit,
            "slug": slug,
            "source_files": len(files),
            "source_bytes": source_bytes,
            "bundle_bytes": bundle.stat().st_size,
            "bundle_sha256": bundle_hash,
            "part_size_limit_bytes": PART_SIZE,
            "max_github_blob_bytes": MAX_GITHUB_BLOB,
            "parts": parts,
            "no_lfs": True,
            "reconstruction_verified": True,
        }
        manifest_path = parts_dir / "DOWNLOAD_MANIFEST.json"
        manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
        pub = {"verdict": "DRY_RUN_VERIFIED"}
        if PUBLISH:
            pub = publish(work, parts_dir, manifest_path, slug)
        result = {
            **manifest,
            "publish": pub,
            "elapsed_seconds": round(time.time() - started, 2),
            "verdict": "VERIFIED" if pub["verdict"] in {"DRY_RUN_VERIFIED", "PUBLISHED_READBACK_VERIFIED"} else pub["verdict"],
        }
        print(json.dumps(result, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
