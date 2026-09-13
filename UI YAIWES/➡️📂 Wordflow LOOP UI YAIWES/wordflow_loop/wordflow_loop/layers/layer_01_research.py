from __future__ import annotations

from datetime import datetime, timezone
import re
from urllib.parse import urlparse

from ..contracts import Evidence, LayerResult, NodeContract, Status, sha256

RANK = {"code_official": 0, "official_docs": 1, "chat_skill": 2, "community": 3}
_SHA256 = re.compile(r"^[0-9a-fA-F]{64}$")


def _parse_timestamp(value: object) -> datetime | None:
    text = str(value or "").strip()
    if not text:
        return None
    if text.endswith("Z"):
        text = f"{text[:-1]}+00:00"
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return None
    return parsed.astimezone(timezone.utc)


def _verification_policy(payload: dict) -> tuple[datetime, int] | None:
    as_of = _parse_timestamp(payload.get("as_of"))
    max_age_seconds = payload.get("max_age_seconds")
    if as_of is None:
        return None
    if isinstance(max_age_seconds, bool) or not isinstance(max_age_seconds, int):
        return None
    if max_age_seconds < 0:
        return None
    return as_of, max_age_seconds


def _verified_candidate(
    candidate: dict,
    *,
    as_of: datetime,
    max_age_seconds: int,
) -> dict | None:
    url = str(candidate.get("url", "")).strip()
    snippet = str(candidate.get("snippet", "")).strip()
    source_class = str(candidate.get("source_class", "")).strip()
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return None
    if not snippet or source_class not in RANK:
        return None

    verification = candidate.get("verification")
    if not isinstance(verification, dict):
        return None
    if verification.get("status") != "VERIFIED":
        return None
    if str(verification.get("checked_url", "")).strip() != url:
        return None

    retrieved_at = _parse_timestamp(verification.get("retrieved_at"))
    adapter = str(verification.get("adapter", "")).strip()
    content_sha256 = str(verification.get("content_sha256", "")).strip()
    if retrieved_at is None or not adapter or not _SHA256.fullmatch(content_sha256):
        return None

    age_seconds = (as_of - retrieved_at).total_seconds()
    if age_seconds < 0 or age_seconds > max_age_seconds:
        return None

    return {
        "url": url,
        "snippet": snippet,
        "source_class": source_class,
        "verification": {
            "status": "VERIFIED",
            "checked_url": url,
            "retrieved_at": retrieved_at.isoformat(),
            "adapter": adapter,
            "content_sha256": content_sha256.lower(),
        },
    }


def run(node: NodeContract, payload: dict) -> LayerResult:
    policy = _verification_policy(payload)
    if policy is None:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.INCONCLUSIVE,
            gaps=["research_verification_policy_gap"],
        )
    as_of, max_age_seconds = policy

    clean: list[dict] = []
    seen: set[str] = set()
    for candidate in payload.get("candidates", []):
        if not isinstance(candidate, dict):
            continue
        verified = _verified_candidate(
            candidate,
            as_of=as_of,
            max_age_seconds=max_age_seconds,
        )
        if verified is None or verified["url"] in seen:
            continue
        seen.add(verified["url"])
        clean.append(verified)

    clean.sort(key=lambda item: (RANK[item["source_class"]], item["url"]))
    if not clean:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.INCONCLUSIVE,
            gaps=["verified_source_evidence_required"],
        )

    return LayerResult(
        node_id=node.node_id,
        layer=node.layer,
        status=Status.PASS,
        output={"results": clean},
        evidence=[Evidence("research_snapshot", "verified-candidate-set", sha256(clean))],
    )
