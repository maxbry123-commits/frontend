#!/usr/bin/env python3
import hashlib, json, os, shutil, stat, subprocess, time
from pathlib import Path

ROOT = Path.cwd()
QUEUE = ROOT / "scripts/ui-yaiwes-43-full-repo-reentry-20260908/QUEUE.json"
DEST_ROOT = ROOT / "UI YAIWES/componentes open soure UI YAIWES"
BASE_CHECKPOINT = DEST_ROOT / "REENTRY_43_CHECKPOINT.json"
REPAIR_CHECKPOINT = DEST_ROOT / "REENTRY_43_REPAIR_02_CHECKPOINT.json"
WORK = ROOT / ".work/ui-yaiwes-43-repair-02-skill"
PROV = {"SOURCE_URL.txt", "SOURCE_COMMIT.txt", "SOURCE_LICENSE.txt", "SOURCE_SHA256SUMS.txt"}
LFS_PREFIX = b"version https://git-lfs.github.com/spec/v1\n"
MAX_BLOB = 100 * 1024 * 1024


def run(args, cwd=None, capture=False, check=True):
    p = subprocess.run(args, cwd=cwd, text=True,
                       stdout=subprocess.PIPE if capture else None,
                       stderr=subprocess.STDOUT if capture else None,
                       check=check)
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


def payload_entries(root):
    for p in sorted(root.rglob("*"), key=lambda x: x.as_posix()):
        if ".git" in p.parts or p.name in PROV:
            continue
        if p.is_symlink() or p.is_file():
            yield p


def entry_bytes(p):
    if p.is_symlink():
        return os.readlink(p).encode()
    return p.read_bytes()


def deterministic_tree_hash(root):
    h = hashlib.sha256()
    for p in payload_entries(root):
        rel = p.relative_to(root).as_posix().encode()
        mode = b"120000" if p.is_symlink() else (b"100755" if (p.stat().st_mode & stat.S_IXUSR) else b"100644")
        data = entry_bytes(p)
        h.update(len(rel).to_bytes(8, "big")); h.update(rel)
        h.update(mode); h.update(len(data).to_bytes(8, "big")); h.update(data)
    return h.hexdigest()


def sha256_file(p):
    h = hashlib.sha256()
    with p.open("rb") as f:
        for b in iter(lambda: f.read(1024 * 1024), b""):
            h.update(b)
    return h.hexdigest()


def resolve_head(url):
    out = retry(lambda: run(["git", "ls-remote", url, "HEAD"], capture=True))
    if not out:
        raise RuntimeError("SOURCE_HEAD_GAP")
    sha = out.split()[0]
    if len(sha) != 40:
        raise RuntimeError("SOURCE_SHA_GAP:" + sha)
    return sha


def acquire(url, sha, stage):
    shutil.rmtree(stage, ignore_errors=True)
    stage.mkdir(parents=True)
    run(["git", "init", "-q"], cwd=stage)
    run(["git", "remote", "add", "origin", url], cwd=stage)
    retry(lambda: run(["git", "-c", "filter.lfs.smudge=cat", "-c", "filter.lfs.process=", "fetch", "--depth", "1", "origin", sha], cwd=stage))
    run(["git", "checkout", "-q", "--detach", "FETCH_HEAD"], cwd=stage)
    if (stage / ".gitmodules").exists():
        retry(lambda: run(["git", "-c", "filter.lfs.smudge=cat", "-c", "filter.lfs.process=", "submodule", "update", "--init", "--recursive", "--depth", "1"], cwd=stage))


def source_guards(root):
    pointers, oversized, unsafe = [], [], []
    files = total = 0
    for p in sorted(root.rglob("*"), key=lambda x: x.as_posix()):
        if ".git" in p.parts:
            continue
        if p.is_symlink():
            target = os.readlink(p)
            try:
                (p.parent / target).resolve(strict=False).relative_to(root.resolve())
            except Exception:
                unsafe.append(p.relative_to(root).as_posix() + " -> " + target)
            continue
        if not p.is_file():
            continue
        files += 1; size = p.stat().st_size; total += size
        if size >= MAX_BLOB:
            oversized.append(f"{p.relative_to(root).as_posix()}:{size}")
        if size <= 1024:
            try:
                if p.read_bytes().startswith(LFS_PREFIX):
                    pointers.append(p.relative_to(root).as_posix())
            except OSError:
                pass
    if pointers:
        raise RuntimeError("SOURCE_LFS_POINTER_GAP:" + ";".join(pointers[:20]))
    if oversized:
        raise RuntimeError("GIT_BLOB_LIMIT_GAP:" + ";".join(oversized[:20]))
    if unsafe:
        raise RuntimeError("UNSAFE_LINK_GAP:" + ";".join(unsafe[:20]))
    if files == 0:
        raise RuntimeError("EMPTY_SOURCE_TREE_GAP")
    return files, total


def remove_git_metadata(root):
    for p in sorted(root.rglob(".git"), key=lambda x: len(x.parts), reverse=True):
        if p.is_dir():
            shutil.rmtree(p, ignore_errors=True)
        else:
            p.unlink(missing_ok=True)


def license_trace(root):
    out = []
    for p in sorted(root.rglob("*"), key=lambda x: x.as_posix()):
        if not p.is_file() or ".git" in p.parts:
            continue
        n = p.name.lower()
        if n.startswith(("license", "licence", "copying", "copyright", "notice")):
            out.append(f"{p.relative_to(root).as_posix()} sha256={sha256_file(p)}")
        if len(out) >= 50:
            break
    return ("\n".join(out) + "\n") if out else "NO_LICENSE_FILE_DETECTED; manual license review required\n"


def write_provenance(root, url, sha, license_text):
    (root / "SOURCE_URL.txt").write_text(url + "\n")
    (root / "SOURCE_COMMIT.txt").write_text(sha + "\n")
    (root / "SOURCE_LICENSE.txt").write_text(license_text)
    sums = []
    for p in payload_entries(root):
        if p.is_symlink():
            digest = hashlib.sha256(os.readlink(p).encode()).hexdigest()
        else:
            digest = sha256_file(p)
        sums.append(f"{digest}  {p.relative_to(root).as_posix()}")
    (root / "SOURCE_SHA256SUMS.txt").write_text("\n".join(sums) + "\n")


def blob_for_path(p):
    if p.is_symlink():
        proc = subprocess.run(["git", "hash-object", "-w", "--stdin"], input=os.readlink(p).encode(), stdout=subprocess.PIPE, check=True)
        return "120000", proc.stdout.decode().strip()
    mode = "100755" if (p.stat().st_mode & stat.S_IXUSR) else "100644"
    blob = run(["git", "hash-object", "-w", "--no-filters", str(p)], capture=True)
    return mode, blob


def stage_exact(dest):
    rel_dest = dest.relative_to(ROOT).as_posix()
    run(["git", "rm", "-r", "--cached", "--ignore-unmatch", "--", rel_dest], check=False)
    for p in sorted(dest.rglob("*"), key=lambda x: x.as_posix()):
        if not (p.is_symlink() or p.is_file()):
            continue
        mode, blob = blob_for_path(p)
        rel = p.relative_to(ROOT).as_posix()
        run(["git", "update-index", "--add", "--cacheinfo", mode, blob, rel])
    grep = subprocess.run(["git", "grep", "-l", "-F", "version https://git-lfs.github.com/spec/v1", "--cached", "--", rel_dest], stdout=subprocess.PIPE, text=True)
    if grep.returncode == 0 and grep.stdout.strip():
        raise RuntimeError("STAGED_LFS_POINTER_GAP:" + grep.stdout.strip().replace("\n", ";")[:1500])
    if grep.returncode not in (0, 1):
        raise RuntimeError("STAGED_INDEX_GUARD_GAP")


def publish_component(dest, stage, label):
    rel = dest.relative_to(ROOT).as_posix()
    for attempt in range(1, 4):
        run(["git", "fetch", "origin", "main"])
        run(["git", "reset", "--hard", "origin/main"])
        shutil.rmtree(dest, ignore_errors=True)
        shutil.copytree(stage, dest, symlinks=True)
        stage_exact(dest)
        if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
            return "NO_CHANGE"
        run(["git", "config", "user.name", "github-actions[bot]"])
        run(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])
        run(["git", "commit", "-m", f"fix(ui-yaiwes): repair-02 exact bytes {label}"])
        p = subprocess.run(["git", "push", "--no-verify", "origin", "HEAD:main"])
        if p.returncode == 0:
            return "PUSH_PASS"
        if attempt == 3:
            raise RuntimeError("PUSH_GAP")
        time.sleep(attempt * 3)
    raise RuntimeError("PUSH_GAP")


def read_back(rel_dest, expected_hash):
    verify = WORK / "readback"
    shutil.rmtree(verify, ignore_errors=True)
    run(["git", "clone", "-q", "--depth", "1", "--branch", "main", "https://github.com/maxbry123-commits/frontend.git", str(verify)])
    target = verify / rel_dest
    if not target.is_dir():
        raise RuntimeError("READ_BACK_MISSING_GAP")
    got = deterministic_tree_hash(target)
    if got != expected_hash:
        raise RuntimeError(f"READ_BACK_CONTENT_MISMATCH:{got}!={expected_hash}")


def write_repair_checkpoint(records):
    REPAIR_CHECKPOINT.write_text(json.dumps({
        "repair": "repair-02-skill",
        "records": records,
        "remaining_component_gaps": sum(1 for r in records if r.get("status") == "GAP"),
        "repaired": sum(1 for r in records if r.get("status") == "REPAIRED"),
        "blocked_nonretryable": sum(1 for r in records if r.get("status") == "BLOCKED_NONRETRYABLE")
    }, indent=2, sort_keys=True) + "\n")
    run(["git", "fetch", "origin", "main"])
    run(["git", "reset", "--hard", "origin/main"])
    REPAIR_CHECKPOINT.parent.mkdir(parents=True, exist_ok=True)
    REPAIR_CHECKPOINT.write_text(json.dumps({
        "repair": "repair-02-skill",
        "records": records,
        "remaining_component_gaps": sum(1 for r in records if r.get("status") == "GAP"),
        "repaired": sum(1 for r in records if r.get("status") == "REPAIRED"),
        "blocked_nonretryable": sum(1 for r in records if r.get("status") == "BLOCKED_NONRETRYABLE")
    }, indent=2, sort_keys=True) + "\n")
    run(["git", "add", "--", REPAIR_CHECKPOINT.relative_to(ROOT).as_posix()])
    if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode != 0:
        run(["git", "config", "user.name", "github-actions[bot]"])
        run(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])
        run(["git", "commit", "-m", "chore(ui-yaiwes): publish repair-02 checkpoint"])
        run(["git", "push", "--no-verify", "origin", "HEAD:main"])


def main():
    os.environ["GIT_TERMINAL_PROMPT"] = "0"
    WORK.mkdir(parents=True, exist_ok=True)
    queue = json.loads(QUEUE.read_text())["components"]
    base = json.loads(BASE_CHECKPOINT.read_text()) if BASE_CHECKPOINT.exists() else {"records": []}
    prior = {r.get("name"): r for r in base.get("records", [])}
    results = []
    for idx, c in enumerate(queue, 1):
        old = prior.get(c["name"])
        if old and old.get("status") in ("COMPLETE", "VERIFIED_EXISTING") and old.get("read_back") == "PASS":
            continue
        rec = {"index": idx, "n": c["n"], "name": c["name"], "source_url": c["source_url"], "destination": c["destination"], "status": "GAP"}
        if old and str(old.get("error", "")).startswith("UNSAFE_LINK_GAP"):
            rec.update(status="BLOCKED_NONRETRYABLE", error=old["error"], reason="skill unsafe-link fail-closed")
            results.append(rec)
            continue
        try:
            sha = (old or {}).get("source_commit") or resolve_head(c["source_url"])
            rec["source_commit"] = sha
            stage = WORK / "stage" / c["destination"]
            acquire(c["source_url"], sha, stage)
            files, total = source_guards(stage)
            lic = license_trace(stage)
            remove_git_metadata(stage)
            expected_hash = deterministic_tree_hash(stage)
            write_provenance(stage, c["source_url"], sha, lic)
            dest = DEST_ROOT / c["destination"]
            publish_component(dest, stage, c["destination"])
            read_back(dest.relative_to(ROOT), expected_hash)
            rec.update(status="REPAIRED", files=files, bytes=total, tree_sha256=expected_hash, read_back="PASS")
        except Exception as e:
            rec.update(status="GAP", error=str(e)[:2000])
        results.append(rec)
    write_repair_checkpoint(results)
    remaining = [r for r in results if r["status"] in ("GAP", "BLOCKED_NONRETRYABLE")]
    print(json.dumps({"repair":"repair-02-skill","records":len(results),"remaining":len(remaining)}, sort_keys=True))
    if remaining:
        raise SystemExit(20)

if __name__ == "__main__":
    main()
