import hashlib
import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path("fabrica de UI INTERFACE fromtend").resolve()
WORK = Path("_work/fabrica-full-repos-v1").resolve()
MANIFEST = ROOT / "FULL_REPOS_EMPAQUE_LOCAL_MANIFEST.jsonl"
LFS_PREFIX = b"version https://git-lfs.github.com/spec/v1"
MAX_BLOB = 100 * 1024 * 1024

REPOS = [
    ("01", "Tauri-2", "https://github.com/tauri-apps/tauri", "dev"),
    ("02", "Capacitor", "https://github.com/ionic-team/capacitor", "main"),
    ("03", "PWABuilder", "https://github.com/pwa-builder/PWABuilder", "main"),
    ("04", "Workbox", "https://github.com/GoogleChrome/workbox", "v7"),
    ("05", "Neutralino", "https://github.com/neutralinojs/neutralinojs", "main"),
    ("06", "Wails", "https://github.com/wailsapp/wails", "v3-alpha"),
    ("07", "Bubblewrap-TWA", "https://github.com/GoogleChromeLabs/bubblewrap", "main"),
    ("08", "Dexie", "https://github.com/dexie/Dexie.js", "master"),
    ("09", "localForage", "https://github.com/localForage/localForage", "master"),
    ("10", "PouchDB", "https://github.com/pouchdb/pouchdb", "master"),
    ("11", "browser-fs-access", "https://github.com/GoogleChromeLabs/browser-fs-access", "main"),
    ("12", "Filesystem", "https://github.com/ionic-team/capacitor-filesystem", "main"),
    ("13", "capacitor-plugins", "https://github.com/ionic-team/capacitor-plugins", "main"),
    ("14", "capacitor-file-sharer", "https://github.com/Cap-go/capacitor-file-sharer", "main"),
]


def run(cmd, cwd=None, capture=False):
    kwargs = {"cwd": cwd, "check": True, "text": True}
    if capture:
        kwargs["stdout"] = subprocess.PIPE
    return subprocess.run(cmd, **kwargs)


def retry(cmd, cwd=None, attempts=3):
    last = None
    for n in range(1, attempts + 1):
        try:
            return run(cmd, cwd=cwd, capture=True)
        except subprocess.CalledProcessError as exc:
            last = exc
            if n == attempts:
                raise
            time.sleep(n * 5)
    raise last


def resolve_sha(url, ref):
    repo = url + ".git"
    probes = [f"refs/heads/{ref}", f"refs/tags/{ref}^{{}}", f"refs/tags/{ref}"]
    for probe in probes:
        p = subprocess.run(["git", "ls-remote", repo, probe], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if p.returncode == 0 and p.stdout.strip():
            return p.stdout.split()[0]
    raise RuntimeError(f"SOURCE_REF_GAP {url} ref={ref}")


def clone_exact(url, sha, out):
    shutil.rmtree(out, ignore_errors=True)
    out.parent.mkdir(parents=True, exist_ok=True)
    retry(["git", "clone", "--no-checkout", "--filter=blob:none", "--no-tags", url + ".git", str(out)])
    retry(["git", "fetch", "--depth", "1", "origin", sha], cwd=out)
    run(["git", "checkout", "--detach", sha], cwd=out)
    got = run(["git", "rev-parse", "HEAD"], cwd=out, capture=True).stdout.strip()
    if got != sha:
        raise RuntimeError(f"SHA_MISMATCH expected={sha} got={got}")
    shutil.rmtree(out / ".git", ignore_errors=True)


def files(root):
    return sorted(p for p in root.rglob("*") if p.is_file())


def validate_source(root):
    fs = files(root)
    if not fs:
        raise RuntimeError("EMPTY_SOURCE_TREE")
    lfs = []
    oversized = []
    for p in fs:
        size = p.stat().st_size
        if size >= MAX_BLOB:
            oversized.append((str(p.relative_to(root)), size))
        if size <= 1024:
            try:
                if p.read_bytes().startswith(LFS_PREFIX):
                    lfs.append(str(p.relative_to(root)))
            except OSError:
                pass
    if lfs:
        raise RuntimeError("SOURCE_LFS_POINTER_GAP: " + "; ".join(lfs[:20]))
    if oversized:
        raise RuntimeError("GIT_BLOB_LIMIT_GAP: " + "; ".join(f"{n}={s}" for n, s in oversized[:20]))
    return fs


def sha256_file(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def tree_records(root):
    rec = []
    for p in files(root):
        rel = p.relative_to(root).as_posix()
        rec.append((rel, p.stat().st_size, sha256_file(p)))
    return rec


def tree_hash(records):
    h = hashlib.sha256()
    for rel, size, digest in records:
        h.update(f"{digest}  {size}  {rel}\n".encode())
    return h.hexdigest()


def license_note(src, url, sha):
    candidates = []
    for p in src.iterdir():
        if p.is_file() and p.name.lower().startswith(("license", "licence", "copying")):
            candidates.append(p.name)
    return json.dumps({"source": url, "commit": sha, "license_files": sorted(candidates)}, sort_keys=True) + "\n"


def install_atomic(slug, src, url, ref, sha):
    source_records = tree_records(src)
    source_hash = tree_hash(source_records)
    target = ROOT / slug
    incoming = WORK / "incoming" / slug
    backup = WORK / "backup" / slug
    shutil.rmtree(incoming, ignore_errors=True)
    shutil.rmtree(backup, ignore_errors=True)
    incoming.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(src, incoming, symlinks=True)

    (incoming / "SOURCE_URL.txt").write_text(url + "\n")
    (incoming / "SOURCE_COMMIT.txt").write_text(sha + "\n")
    (incoming / "SOURCE_REF.txt").write_text(ref + "\n")
    (incoming / "SOURCE_LICENSE.txt").write_text(license_note(src, url, sha))
    (incoming / "SOURCE_SHA256SUMS.txt").write_text("".join(f"{digest}  {rel}\n" for rel, _, digest in source_records))
    (incoming / "SOURCE_TREE_SHA256.txt").write_text(source_hash + "\n")

    # Verify every source file exists byte-identically before publishing.
    for rel, size, digest in source_records:
        q = incoming / rel
        if not q.is_file() or q.stat().st_size != size or sha256_file(q) != digest:
            raise RuntimeError(f"STAGING_READBACK_FAIL {slug}/{rel}")

    # User explicitly authorized delete+remount for incomplete copies; swap only after full staging PASS.
    if target.exists():
        backup.parent.mkdir(parents=True, exist_ok=True)
        target.rename(backup)
    incoming.rename(target)
    shutil.rmtree(backup, ignore_errors=True)

    # Final destination read-back against entire source tree.
    for rel, size, digest in source_records:
        q = target / rel
        if not q.is_file() or q.stat().st_size != size or sha256_file(q) != digest:
            raise RuntimeError(f"DESTINATION_READBACK_FAIL {slug}/{rel}")

    return len(source_records), sum(x[1] for x in source_records), source_hash


def manifest_done(slug, sha):
    if not MANIFEST.exists():
        return False
    for line in MANIFEST.read_text().splitlines():
        if not line.strip():
            continue
        try:
            d = json.loads(line)
        except json.JSONDecodeError:
            continue
        if d.get("slug") == slug and d.get("source_commit") == sha and d.get("status") == "EXTRACTED_VERIFIED":
            target = ROOT / slug
            if target.exists() and (target / "SOURCE_COMMIT.txt").read_text().strip() == sha:
                return True
    return False


def commit_push(slug):
    run(["git", "add", "--", str(ROOT.relative_to(Path.cwd()))])
    if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
        return
    run(["git", "config", "user.name", "github-actions[bot]"])
    run(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])
    run(["git", "commit", "-m", f"build(fabrica): mount complete repository {slug}"])
    for attempt in range(1, 4):
        try:
            run(["git", "fetch", "origin", "main"])
            run(["git", "rebase", "--autostash", "origin/main"])
            run(["git", "push", "--no-verify", "origin", "HEAD:main"])
            return
        except subprocess.CalledProcessError:
            if attempt == 3:
                raise
            time.sleep(attempt * 3)


def main():
    ROOT.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    run(["git", "config", "--local", "filter.lfs.clean", "cat"])
    run(["git", "config", "--local", "filter.lfs.smudge", "cat"])
    run(["git", "config", "--local", "filter.lfs.process", ""])
    run(["git", "config", "--local", "filter.lfs.required", "false"])

    failures = []
    for number, slug, url, ref in REPOS:
        print(f"===== {number}/14 {slug} =====", flush=True)
        try:
            sha = resolve_sha(url, ref)
            if manifest_done(slug, sha):
                print(f"VERIFIED_EXISTING {slug} {sha}")
                continue
            src = WORK / "src" / slug
            clone_exact(url, sha, src)
            validate_source(src)
            count, total, thash = install_atomic(slug, src, url, ref, sha)
            rec = {
                "number": int(number), "slug": slug, "source": url, "source_ref": ref,
                "source_commit": sha, "files": count, "bytes": total,
                "source_tree_sha256": thash, "status": "EXTRACTED_VERIFIED"
            }
            with MANIFEST.open("a") as f:
                f.write(json.dumps(rec, sort_keys=True) + "\n")
            commit_push(slug)
            shutil.rmtree(src, ignore_errors=True)
            print(f"PASS {slug} files={count} bytes={total} sha={sha}")
        except Exception as exc:
            failures.append({"slug": slug, "error": str(exc)})
            print(f"GAP {slug}: {exc}", file=sys.stderr, flush=True)
            # Never leave a staged or partial target from a failed install attempt.
            shutil.rmtree(WORK / "incoming" / slug, ignore_errors=True)
            continue

    report = ROOT / "FULL_REPOS_EMPAQUE_LOCAL_GAPS.json"
    report.write_text(json.dumps({"expected_components": 14, "gaps": failures}, indent=2, sort_keys=True) + "\n")
    commit_push("audit-report")
    if failures:
        raise SystemExit(f"GAPS_REMAIN={len(failures)}")
    print("VERIFIED_CLOSED expected_components=14 verified_components=14 gaps=0")


if __name__ == "__main__":
    main()
