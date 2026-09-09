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


def now():
    return datetime.now(timezone.utc).isoformat()


def load_state():
    if not STATE_PATH.exists():
        return {
            "schema": "yaiwes.hf.zip-watchdog.state.v1",
            "cycle": 0,
            "created_at": now(),
            "history": [],
            "status": "INITIALIZING",
        }
    try:
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except Exception as exc:
        return {
            "schema": "yaiwes.hf.zip-watchdog.state.v1",
            "cycle": 0,
            "created_at": now(),
            "history": [],
            "status": "STATE_RECOVERY",
            "state_error": str(exc),
        }


def save_state(state):
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = STATE_PATH.with_suffix(STATE_PATH.suffix + ".tmp")
    tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    os.replace(tmp, STATE_PATH)


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
