#!/usr/bin/env python3
import json
import os
import pathlib
import subprocess
import sys
import time
from datetime import datetime, timezone

MOTOR_ROOT = pathlib.Path(__file__).resolve().parent
ENGINE = MOTOR_ROOT / "hf_zip_engine.py"
STATE_PATH = pathlib.Path(os.environ.get("STATE_PATH", str(MOTOR_ROOT / "watchdog-state.json")))
INTERVAL = max(30, int(os.environ.get("WATCHDOG_INTERVAL_SECONDS", "300")))
MAX_HISTORY = max(10, int(os.environ.get("WATCHDOG_MAX_HISTORY", "100")))
MAX_CYCLES = int(os.environ.get("WATCHDOG_MAX_CYCLES", "1"))
ENGINE_MODE = os.environ.get("WATCHDOG_ENGINE_MODE", "supervise")
HF_TOKEN = os.environ.get("HF_TOKEN", "")
STATE_MARKER = "WATCHDOG_STATE "


def now():
    return datetime.now(timezone.utc).isoformat()


def default_state(status="INITIALIZING"):
    return {
        "schema": "yaiwes.hf.zip-watchdog.state.v1",
        "cycle": 0,
        "created_at": now(),
        "history": [],
        "status": status,
    }


def recover_from_hf_logs():
    if not HF_TOKEN:
        return None
    try:
        from huggingface_hub import fetch_job_logs, list_jobs
        jobs = list(list_jobs(token=HF_TOKEN))
        jobs.sort(key=lambda j: j.created_at or datetime.min.replace(tzinfo=timezone.utc), reverse=True)
        for job in jobs:
            command = " ".join(str(x) for x in (getattr(job, "command", None) or []))
            if "watchdog.py" not in command:
                continue
            stage = str(getattr(getattr(job, "status", None), "stage", "")).upper()
            if stage not in {"COMPLETED", "ERROR", "CANCELED"}:
                continue
            lines = list(fetch_job_logs(job.id, token=HF_TOKEN, follow=False))
            for raw in reversed(lines):
                line = str(raw).strip()
                pos = line.find(STATE_MARKER)
                if pos < 0:
                    continue
                payload = line[pos + len(STATE_MARKER):].strip()
                state = json.loads(payload)
                state["recovered_from_job"] = job.id
                state["recovered_at"] = now()
                return state
    except Exception as exc:
        print(json.dumps({"watchdog_state_recovery_gap": str(exc)}, ensure_ascii=False), flush=True)
    return None


def load_state():
    if STATE_PATH.exists():
        try:
            local = json.loads(STATE_PATH.read_text(encoding="utf-8"))
            if int(local.get("cycle", 0)) > 0:
                local["recovery_source"] = "local"
                return local
        except Exception as exc:
            print(json.dumps({"local_state_gap": str(exc)}, ensure_ascii=False), flush=True)
    remote = recover_from_hf_logs()
    if remote is not None:
        remote["recovery_source"] = "hf_job_logs"
        return remote
    if STATE_PATH.exists():
        try:
            seed = json.loads(STATE_PATH.read_text(encoding="utf-8"))
            seed["recovery_source"] = "repo_seed"
            return seed
        except Exception:
            pass
    return default_state("STATE_RECOVERY")


def save_state(state):
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = STATE_PATH.with_suffix(STATE_PATH.suffix + ".tmp")
    tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    os.replace(tmp, STATE_PATH)
    print(STATE_MARKER + json.dumps(state, ensure_ascii=False, sort_keys=True), flush=True)


def last_json(stdout):
    for line in reversed(stdout.splitlines()):
        line = line.strip()
        if line.startswith("{"):
            try:
                return json.loads(line)
            except json.JSONDecodeError:
                pass
    return {"verdict": "ENGINE_OUTPUT_GAP", "raw_tail": stdout[-4000:]}


def run_cycle(state):
    env = dict(os.environ)
    env["MODE"] = ENGINE_MODE
    started = time.time()
    proc = subprocess.run([sys.executable, str(ENGINE)], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=env)
    result = last_json(proc.stdout)
    cycle = int(state.get("cycle", 0)) + 1
    record = {
        "cycle": cycle,
        "started_at": now(),
        "elapsed_seconds": round(time.time() - started, 2),
        "returncode": proc.returncode,
        "remaining_gaps": result.get("remaining_gaps"),
        "retryable_gaps": result.get("retryable_gaps"),
        "blocked_gaps": result.get("blocked_gaps"),
        "preflight_verdict": result.get("preflight_verdict", result.get("verdict")),
        "repair_verdict": (result.get("repair") or {}).get("verdict") if isinstance(result.get("repair"), dict) else None,
    }
    history = list(state.get("history", []))
    history.append(record)
    history = history[-MAX_HISTORY:]
    state.update({
        "schema": "yaiwes.hf.zip-watchdog.state.v1",
        "cycle": cycle,
        "heartbeat_at": now(),
        "status": "PASS" if proc.returncode == 0 and result.get("remaining_gaps", 0) == 0 else "GAPS_PENDING" if proc.returncode == 0 else "ENGINE_FAILURE",
        "last_result": result,
        "history": history,
    })
    save_state(state)
    print(json.dumps({"watchdog": record, "state_path": str(STATE_PATH)}, ensure_ascii=False, sort_keys=True), flush=True)
    return state


def main():
    state = load_state()
    cycles = 0
    while True:
        state = run_cycle(state)
        cycles += 1
        if MAX_CYCLES > 0 and cycles >= MAX_CYCLES:
            break
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
