from __future__ import annotations

from urllib.parse import urlparse

from ..contracts import Evidence, LayerResult, NodeContract, Status, sha256

RANK = {"code_official": 0, "official_docs": 1, "chat_skill": 2, "community": 3}


def run(node: NodeContract, payload: dict) -> LayerResult:
    clean: list[dict] = []
    seen: set[str] = set()
    for candidate in payload.get("candidates", []):
        url = str(candidate.get("url", ""))
        snippet = str(candidate.get("snippet", ""))
        source_class = str(candidate.get("source_class", ""))
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            continue
        if not snippet or not source_class or url in seen:
            continue
        seen.add(url)
        clean.append({"url": url, "snippet": snippet, "source_class": source_class})

    clean.sort(key=lambda item: (RANK.get(item["source_class"], 99), item["url"]))
    if not clean:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.INCONCLUSIVE,
            gaps=["insufficient_evidence"],
        )

    return LayerResult(
        node_id=node.node_id,
        layer=node.layer,
        status=Status.PASS,
        output={"results": clean},
        evidence=[Evidence("research_snapshot", "candidate-set", sha256(clean))],
    )
