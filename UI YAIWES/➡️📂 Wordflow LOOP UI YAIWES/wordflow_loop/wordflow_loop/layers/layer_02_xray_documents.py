from __future__ import annotations

import re

from ..contracts import Evidence, LayerResult, NodeContract, Status, sha256


def run(node: NodeContract, payload: dict) -> LayerResult:
    documents = payload.get("documents", {})
    if not documents:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.INCONCLUSIVE,
            gaps=["no_documents"],
        )

    output: dict[str, dict] = {}
    evidence: list[Evidence] = []
    for name, text in documents.items():
        lines = str(text).splitlines()
        output[str(name)] = {
            "requirements": [
                line.strip()
                for line in lines
                if re.search(r"\b(debe|must|required|obligatorio|objetivo)\b", line, re.I)
            ],
            "headings": [line.strip() for line in lines if line.lstrip().startswith("#")],
            "code_anchors": [
                line.strip()
                for line in lines
                if re.search(r"`[^`]+`|\b[\w.-]+\.(py|ts|tsx|js|json|ya?ml|md)\b", line)
            ],
            "crosscheck_queue": [
                line.strip()
                for line in lines
                if re.search(r"\b(no|prohibid|excepto|sin)\b", line, re.I)
            ],
        }
        evidence.append(Evidence("document", str(name), sha256(str(text))))

    return LayerResult(
        node_id=node.node_id,
        layer=node.layer,
        status=Status.PASS,
        output={"documents": output},
        evidence=evidence,
    )
