from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from .contracts import sha256


def append_event(ledger: list[dict[str, Any]], event: dict[str, Any]) -> dict[str, Any]:
    prev_hash = ledger[-1]["hash"] if ledger else "0" * 64
    row = {"seq": len(ledger) + 1, "prev_hash": prev_hash, "event": event}
    row["hash"] = sha256(row)
    ledger.append(row)
    return row


def verify_ledger(ledger: list[dict[str, Any]]) -> bool:
    prev_hash = "0" * 64
    for expected_seq, row in enumerate(ledger, start=1):
        raw = {k: v for k, v in row.items() if k != "hash"}
        if row.get("seq") != expected_seq:
            return False
        if row.get("prev_hash") != prev_hash:
            return False
        if row.get("hash") != sha256(raw):
            return False
        prev_hash = row["hash"]
    return True


def load_ledger(path: str | Path) -> list[dict[str, Any]]:
    target = Path(path)
    if not target.exists():
        return []
    rows = [
        json.loads(line)
        for line in target.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    if not verify_ledger(rows):
        raise ValueError("ledger_integrity_failure")
    return rows


def save_ledger(path: str | Path, ledger: list[dict[str, Any]]) -> None:
    if not verify_ledger(ledger):
        raise ValueError("ledger_integrity_failure")
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_suffix(target.suffix + ".tmp")
    with temporary.open("w", encoding="utf-8") as handle:
        for row in ledger:
            handle.write(
                json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
                + "\n"
            )
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, target)
