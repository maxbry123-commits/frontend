#!/usr/bin/env python3
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

REPO = os.environ.get("REPO", "maxbry123-commits/frontend")
BRANCH = os.environ.get("BRANCH", "main")
MODE = os.environ.get("MODE", "supervise").strip().lower()
LIMIT = int(os.environ.get("LIMIT", "10"))
TOKEN = os.environ.get("GITHUB_TOKEN", "")
ROOT1 = "📂componentes open soure fromtend/Fromtend code"
ROOT2 = "UI YAIWES/Interface YAIWES ui/ENGINE ADAPTER"
EXTRACTOR = "scripts/extract_guardian_repair_20260903.py"
MOTOR_ROOT = "➡️📂motor extracción de zip con huggueface"


def run(cmd, cwd=None, env=None, check=True, capture=False):
    kwargs = {"cwd": cwd, "env": env, "text": True, "check": check}
    if capture:
        kwargs.update(stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    p = subprocess.run(cmd, **kwargs)
    if capture:
        return p.stdout
    return ""


def parse_last_json(text):
    for line in reversed(text.splitlines()):
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            return json.loads(line)
        except json.JSONDecodeError:
            pass
    raise RuntimeError("AUDIT_JSON_MISSING")


def askpass_env(base_env, root):
    env = dict(base_env)
    if not TOKEN:
        return env
    askpass = pathlib.Path(root) / "git-askpass.sh"
    askpass.write_text(
        '#!/bin/sh\ncase "$1" in\n*Username*) echo x-access-token ;;\n*Password*) echo "$GITHUB_TOKEN" ;;\nesac\n',
        encoding="utf-8",
    )
    askpass.chmod(0o700)
    env["GIT_ASKPASS"] = str(askpass)
    env["GIT_TERMINAL_PROMPT"] = "0"
    env["GITHUB_TOKEN"] = TOKEN
    return env


def sparse_checkout(work):
    repo = pathlib.Path(work) / "repo"
    repo.mkdir()
    env = askpass_env(os.environ, work)
    run(["git", "init"], cwd=repo, env=env)
    run(["git", "remote", "add", "origin", f"https://github.com/{REPO}.git"], cwd=repo, env=env)
    run(["git", "config", "filter.lfs.clean", "cat"], cwd=repo, env=env)
    run(["git", "config", "filter.lfs.smudge", "cat"], cwd=repo, env=env)
    run(["git", "config", "--unset-all", "filter.lfs.process"], cwd=repo, env=env, check=False)
    run(["git", "config", "filter.lfs.required", "false"], cwd=repo, env=env)
    run(["git", "sparse-checkout", "init", "--no-cone"], cwd=repo, env=env)
    patterns = [
        f"/{EXTRACTOR}",
        f"/{ROOT1}/",
        f"/{ROOT2}/",
        "/forensics/extraction/",
        f"/{MOTOR_ROOT}/",
    ]
    (repo / ".git/info/sparse-checkout").write_text("\n".join(patterns) + "\n", encoding="utf-8")
    run(["git", "fetch", "--depth=1", "--filter=blob:none", "origin", BRANCH], cwd=repo, env=env)
    run(["git", "checkout", "-B", BRANCH, "FETCH_HEAD"], cwd=repo, env=env)
    return repo, env


def patched_extractor(repo, work):
    src = repo / EXTRACTOR
    if not src.exists():
        raise RuntimeError("EXTRACTOR_MISSING")
    dst = pathlib.Path(work) / "extract_guardian_repair.py"
    text = src.read_text(encoding="utf-8")
    maps = (
        'MAPS = ['
        '{"src":"📂componentes open soure fromtend/Fromtend code",'
        '"dst":"📂componentes open soure fromtend/Fromtend code","layout":"flat"},'
        '{"src":"UI YAIWES/Interface YAIWES ui/ENGINE ADAPTER",'
        '"dst":"UI YAIWES/Interface YAIWES ui/ENGINE ADAPTER","layout":"flat"}'
        ']'
    )
    text, n = re.subn(r"^MAPS = .*?$", maps, text, count=1, flags=re.MULTILINE)
    if n != 1:
        raise RuntimeError("MAPS_PATCH_GAP")
    dst.write_text(text, encoding="utf-8")
    return dst


def audit(repo, extractor):
    out = run([sys.executable, str(extractor), "--audit-only"], cwd=repo, capture=True)
    print(out, end="")
    return parse_last_json(out)


def staged_policy_gate(repo, env):
    names = run(["git", "diff", "--cached", "--name-only", "-z"], cwd=repo, env=env, capture=True)
    bad_pointer = []
    oversized = []
    for raw in names.split("\x00"):
        if not raw:
            continue
        p = repo / raw
        if not p.is_file():
            continue
        size = p.stat().st_size
        if size >= 100 * 1024 * 1024:
            oversized.append(raw)
        with p.open("rb") as f:
            if f.read(1024).startswith(b"version https://git-lfs.github.com/spec/v1\n"):
                bad_pointer.append(raw)
    if bad_pointer:
        raise RuntimeError("SOURCE_LFS_POINTER_GAP:" + ",".join(bad_pointer[:20]))
    if oversized:
        raise RuntimeError("GIT_BLOB_LIMIT_GAP:" + ",".join(oversized[:20]))


def repair(repo, extractor, env):
    if not TOKEN:
        return {"verdict": "WRITE_AUTH_GAP", "detail": "GITHUB_TOKEN secret is not available in the Hugging Face Job"}
    out = run([sys.executable, str(extractor), "--limit", str(LIMIT)], cwd=repo, capture=True)
    print(out, end="")
    result = parse_last_json(out)
    run(["git", "add", "-A", "--", ".", ":(exclude).github/workflows"], cwd=repo, env=env)
    staged_policy_gate(repo, env)
    diff_rc = subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=repo, env=env).returncode
    if diff_rc == 0:
        result["publish"] = "NO_CHANGES"
        return result
    run(["git", "config", "user.name", "hf-yaiwes-zip-engine"], cwd=repo, env=env)
    run(["git", "config", "user.email", "hf-yaiwes-zip-engine@users.noreply.github.com"], cwd=repo, env=env)
    run(["git", "commit", "-m", "fix(extraction): publish verified EXTRACT_ONLY batch from HF engine"], cwd=repo, env=env)
    local = run(["git", "rev-parse", "HEAD"], cwd=repo, env=env, capture=True).strip()
    parent = run(["git", "rev-parse", "HEAD^"], cwd=repo, env=env, capture=True).strip()
    run(["git", "fetch", "--depth=1", "origin", BRANCH], cwd=repo, env=env)
    remote = run(["git", "rev-parse", "FETCH_HEAD"], cwd=repo, env=env, capture=True).strip()
    if parent != remote:
        raise RuntimeError(f"NON_FAST_FORWARD_GAP:parent={parent}:remote={remote}")
    run(["git", "push", "--no-verify", "origin", f"HEAD:{BRANCH}"], cwd=repo, env=env)
    run(["git", "fetch", "--depth=1", "origin", BRANCH], cwd=repo, env=env)
    remote2 = run(["git", "rev-parse", "FETCH_HEAD"], cwd=repo, env=env, capture=True).strip()
    if remote2 != local:
        raise RuntimeError(f"READ_BACK_CONTENT_MISMATCH:local={local}:remote={remote2}")
    result["publish"] = "PASS"
    result["commit"] = local
    return result


def main():
    started = __import__("time").time()
    with tempfile.TemporaryDirectory(prefix="yaiwes-hf-zip-") as work:
        repo, env = sparse_checkout(work)
        extractor = patched_extractor(repo, work)
        before = audit(repo, extractor)
        counts = before.get("counts", {})
        retryable = counts.get("retryable", len(before.get("retryable_gaps", [])))
        blocked = counts.get("blocked", len(before.get("blocked_gaps", [])))
        remaining = counts.get("remaining", len(before.get("remaining_gaps", [])))
        summary = {
            "schema": "yaiwes.hf.zip-engine.v1",
            "mode": MODE,
            "repository": REPO,
            "branch": BRANCH,
            "remaining_gaps": remaining,
            "retryable_gaps": retryable,
            "blocked_gaps": blocked,
            "preflight_verdict": before.get("verdict"),
        }
        if MODE == "repair" and retryable > 0:
            summary["repair"] = repair(repo, extractor, env)
            summary["post_audit"] = audit(repo, extractor)
        elif MODE == "repair" and remaining > 0 and retryable == 0:
            summary["repair"] = {"verdict": "GAPS_PENDING_NONRETRYABLE", "blocked": blocked}
        else:
            summary["repair"] = {"verdict": "SUPERVISE_ONLY"}
        summary["elapsed_seconds"] = round(__import__("time").time() - started, 2)
        print(json.dumps(summary, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({"schema": "yaiwes.hf.zip-engine.v1", "verdict": "ENGINE_FAILURE", "error": str(exc)}, ensure_ascii=False))
        raise
