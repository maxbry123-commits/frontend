#!/usr/bin/env python3
import hashlib, json, os, shutil, subprocess, sys, time
from pathlib import Path

ROOT = Path.cwd()
QUEUE = ROOT / "scripts/ui-yaiwes-43-full-repo-reentry-20260908/QUEUE.json"
WORK = ROOT / ".work/ui-yaiwes-43-full-repo-reentry-20260908"
DEST_ROOT = ROOT / "UI YAIWES/componentes open soure UI YAIWES"
MANIFEST = DEST_ROOT / "REENTRY_43_MANIFEST.jsonl"
CHECKPOINT = DEST_ROOT / "REENTRY_43_CHECKPOINT.json"
MAX_BLOB = 100 * 1024 * 1024
LFS_PREFIX = b"version https://git-lfs.github.com/spec/v1\n"
PROV = {"SOURCE_URL.txt", "SOURCE_COMMIT.txt", "SOURCE_LICENSE.txt", "SOURCE_SHA256SUMS.txt"}
ALLOWED = ("https://github.com/", "https://gitlab.freedesktop.org/", "https://gitlab.com/", "https://android.googlesource.com/")


def run(args, cwd=None, capture=False):
    p = subprocess.run(args, cwd=cwd, text=True, stdout=subprocess.PIPE if capture else None,
                       stderr=subprocess.STDOUT if capture else None, check=True)
    return p.stdout.strip() if capture else ""


def retry(fn, attempts=3):
    last = None
    for i in range(1, attempts + 1):
        try:
            return fn()
        except Exception as e:
            last = e
            if i == attempts:
                break
            time.sleep(i * 5)
    raise last


def sha256_file(p):
    h = hashlib.sha256()
    with p.open("rb") as f:
        for b in iter(lambda: f.read(1024 * 1024), b""):
            h.update(b)
    return h.hexdigest()


def payload_files(root):
    for p in sorted(root.rglob("*"), key=lambda x: x.as_posix()):
        if not p.is_file() or p.name in PROV:
            continue
        if ".git" in p.parts:
            continue
        yield p


def tree_hash(root):
    h = hashlib.sha256()
    for p in payload_files(root):
        rel = p.relative_to(root).as_posix().encode()
        h.update(len(rel).to_bytes(8, "big")); h.update(rel)
        with p.open("rb") as f:
            for b in iter(lambda: f.read(1024 * 1024), b""):
                h.update(b)
    return h.hexdigest()


def remove_git_metadata(root):
    for p in sorted(root.rglob(".git"), key=lambda x: len(x.parts), reverse=True):
        if p.is_dir(): shutil.rmtree(p, ignore_errors=True)
        else: p.unlink(missing_ok=True)


def source_guards(root):
    pointers, oversized, specials = [], [], []
    count = total = 0
    for p in sorted(root.rglob("*"), key=lambda x: x.as_posix()):
        if p.name == ".git" or ".git" in p.parts:
            continue
        if p.is_symlink():
            try:
                resolved = p.resolve(strict=False)
                resolved.relative_to(root.resolve())
            except Exception:
                specials.append(p.relative_to(root).as_posix())
            continue
        if not p.is_file():
            continue
        count += 1; size = p.stat().st_size; total += size
        if size >= MAX_BLOB:
            oversized.append(f"{p.relative_to(root).as_posix()}:{size}")
        if size <= 1024:
            try:
                with p.open("rb") as f:
                    if f.read(1024).startswith(LFS_PREFIX): pointers.append(p.relative_to(root).as_posix())
            except OSError:
                pass
    if pointers: raise RuntimeError("SOURCE_LFS_POINTER_GAP: " + ";".join(pointers[:20]))
    if oversized: raise RuntimeError("GIT_BLOB_LIMIT_GAP: " + ";".join(oversized[:20]))
    if specials: raise RuntimeError("UNSAFE_LINK_GAP: " + ";".join(specials[:20]))
    if count == 0: raise RuntimeError("EMPTY_SOURCE_TREE_GAP")
    return count, total


def license_trace(root):
    candidates = []
    for p in root.rglob("*"):
        if not p.is_file() or ".git" in p.parts: continue
        n = p.name.lower()
        if n.startswith(("license", "licence", "copying", "copyright", "notice")):
            candidates.append(p)
    if not candidates:
        return "NO_LICENSE_FILE_DETECTED; manual license review required\n"
    lines = []
    for p in sorted(candidates, key=lambda x: x.as_posix())[:50]:
        lines.append(f"{p.relative_to(root).as_posix()} sha256={sha256_file(p)}")
    return "\n".join(lines) + "\n"


def write_provenance(root, url, sha, license_text):
    (root / "SOURCE_URL.txt").write_text(url + "\n")
    (root / "SOURCE_COMMIT.txt").write_text(sha + "\n")
    (root / "SOURCE_LICENSE.txt").write_text(license_text)
    sums = []
    for p in payload_files(root):
        sums.append(f"{sha256_file(p)}  {p.relative_to(root).as_posix()}")
    (root / "SOURCE_SHA256SUMS.txt").write_text("\n".join(sums) + "\n")
    for line in sums:
        digest, rel = line.split("  ", 1)
        if sha256_file(root / rel) != digest: raise RuntimeError("SHA_CHECK_GAP:" + rel)


def resolve_head(url):
    out = retry(lambda: run(["git", "ls-remote", url, "HEAD"], capture=True))
    if not out: raise RuntimeError("SOURCE_HEAD_GAP")
    sha = out.split()[0]
    if len(sha) != 40: raise RuntimeError("SOURCE_SHA_GAP:" + sha)
    return sha


def acquire(url, sha, stage):
    shutil.rmtree(stage, ignore_errors=True); stage.mkdir(parents=True)
    run(["git", "init", "-q"], cwd=stage)
    run(["git", "remote", "add", "origin", url], cwd=stage)
    retry(lambda: run(["git", "fetch", "--depth", "1", "origin", sha], cwd=stage))
    run(["git", "checkout", "-q", "--detach", "FETCH_HEAD"], cwd=stage)
    # Submodules are part of the complete checkout when declared by the source repository.
    if (stage / ".gitmodules").exists():
        retry(lambda: run(["git", "-c", "filter.lfs.smudge=cat", "-c", "filter.lfs.process=", "submodule", "update", "--init", "--recursive", "--depth", "1"], cwd=stage))


def git_push(label):
    run(["git", "config", "user.name", "github-actions[bot]"])
    run(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])
    for attempt in range(1, 4):
        try:
            run(["git", "fetch", "origin", "main"])
            run(["git", "rebase", "--autostash", "origin/main"])
            run(["git", "push", "--no-verify", "origin", "HEAD:main"])
            return
        except Exception:
            if attempt == 3: raise
            time.sleep(attempt * 3)


def append_manifest(rec):
    DEST_ROOT.mkdir(parents=True, exist_ok=True)
    with MANIFEST.open("a") as f: f.write(json.dumps(rec, sort_keys=True) + "\n")


def checkpoint(records):
    states = {"COMPLETE":0,"VERIFIED_EXISTING":0,"GAP":0}
    for r in records: states[r["status"]] = states.get(r["status"],0)+1
    CHECKPOINT.write_text(json.dumps({"expected":43,"processed":len(records),"states":states,"records":records}, indent=2, sort_keys=True) + "\n")


def fresh_readback(dest_rel, expected_hash):
    verify = WORK / "readback"
    shutil.rmtree(verify, ignore_errors=True)
    run(["git", "clone", "-q", "--depth", "1", "--branch", "main", "https://github.com/maxbry123-commits/frontend.git", str(verify)])
    target = verify / dest_rel
    if not target.is_dir(): raise RuntimeError("READ_BACK_MISSING_GAP")
    got = tree_hash(target)
    if got != expected_hash: raise RuntimeError(f"READ_BACK_HASH_GAP:{got}!={expected_hash}")


def main():
    q = json.loads(QUEUE.read_text()); comps = q["components"]
    if len(comps) != 43: raise SystemExit("QUEUE_COUNT_GAP")
    DEST_ROOT.mkdir(parents=True, exist_ok=True); WORK.mkdir(parents=True, exist_ok=True)
    records = []
    for idx, c in enumerate(comps, 1):
        name, url, folder = c["name"], c["source_url"], c["destination"]
        rec = {"index":idx,"n":c["n"],"name":name,"source_url":url,"destination":folder,"status":"GAP"}
        print(f"===== {idx}/43 {name} =====", flush=True)
        try:
            if not url.startswith(ALLOWED): raise RuntimeError("SOURCE_PROVIDER_GAP:" + url)
            sha = resolve_head(url); rec["source_commit"] = sha
            stage = WORK / "stage" / folder
            acquire(url, sha, stage)
            count, total = source_guards(stage)
            lic = license_trace(stage)
            remove_git_metadata(stage)
            source_hash = tree_hash(stage)
            write_provenance(stage, url, sha, lic)
            dest = DEST_ROOT / folder
            if dest.exists():
                old_url = (dest / "SOURCE_URL.txt").read_text().strip() if (dest / "SOURCE_URL.txt").exists() else ""
                old_sha = (dest / "SOURCE_COMMIT.txt").read_text().strip() if (dest / "SOURCE_COMMIT.txt").exists() else ""
                try: old_hash = tree_hash(dest)
                except Exception: old_hash = ""
                if old_url == url and old_sha == sha and old_hash == source_hash:
                    rec.update(status="VERIFIED_EXISTING", files=count, bytes=total, tree_sha256=source_hash)
                    records.append(rec); append_manifest(rec); checkpoint(records); continue
                shutil.rmtree(dest)
            shutil.copytree(stage, dest, symlinks=True)
            if tree_hash(dest) != source_hash: raise RuntimeError("LOCAL_COPY_HASH_GAP")
            rec.update(status="COMPLETE", files=count, bytes=total, tree_sha256=source_hash)
            append_manifest(rec); checkpoint(records)
            run(["git", "add", "--", str(dest.relative_to(ROOT)), str(MANIFEST.relative_to(ROOT)), str(CHECKPOINT.relative_to(ROOT))])
            if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode != 0:
                run(["git", "commit", "-m", f"build(ui-yaiwes): mount complete repo {folder}"])
                git_push(folder)
            fresh_readback(dest.relative_to(ROOT), source_hash)
            rec["read_back"] = "PASS"
        except Exception as e:
            rec["status"] = "GAP"; rec["error"] = str(e)[:2000]
            print(f"GAP {name}: {e}", flush=True)
        records.append(rec); append_manifest(rec); checkpoint(records)
        run(["git", "add", "--", str(MANIFEST.relative_to(ROOT)), str(CHECKPOINT.relative_to(ROOT))])
        if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode != 0:
            run(["git", "commit", "-m", f"chore(ui-yaiwes): checkpoint 43 reentry {idx:02d}"])
            git_push(f"checkpoint-{idx:02d}")
    gaps = [r for r in records if r["status"] == "GAP"]
    print(json.dumps({"expected":43,"complete_or_existing":43-len(gaps),"gaps":len(gaps)}, sort_keys=True))
    if gaps: raise SystemExit(20)

if __name__ == "__main__": main()
