from __future__ import annotations

import ast

from ..contracts import Evidence, LayerResult, NodeContract, Status, sha256

DANGEROUS = {"exec", "eval", "compile", "__import__"}


def run(node: NodeContract, payload: dict) -> LayerResult:
    files = payload.get("files", {})
    if not files:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.INCONCLUSIVE,
            gaps=["no_code"],
        )

    output: dict[str, dict] = {}
    evidence: list[Evidence] = []
    gaps: list[str] = []
    for path, source in files.items():
        try:
            tree = ast.parse(str(source), filename=str(path))
        except SyntaxError:
            gaps.append(f"syntax_error:{path}")
            continue

        symbols: list[str] = []
        imports: list[str] = []
        dangerous: list[str] = []
        stubs: list[str] = []
        for item in ast.walk(tree):
            if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                symbols.append(item.name)
            elif isinstance(item, ast.Import):
                imports.extend(alias.name for alias in item.names)
            elif isinstance(item, ast.ImportFrom):
                imports.append(item.module or "")
            elif (
                isinstance(item, ast.Call)
                and isinstance(item.func, ast.Name)
                and item.func.id in DANGEROUS
            ):
                dangerous.append(item.func.id)
            elif (
                isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef))
                and len(item.body) == 1
                and isinstance(item.body[0], ast.Pass)
            ):
                stubs.append(item.name)

        output[str(path)] = {
            "symbols": sorted(set(symbols)),
            "imports": sorted(set(imports)),
            "stubs": sorted(set(stubs)),
            "dangerous_calls": sorted(set(dangerous)),
        }
        evidence.append(Evidence("code", str(path), sha256(str(source))))

    status = Status.PASS if evidence and not gaps else Status.INCONCLUSIVE
    return LayerResult(
        node_id=node.node_id,
        layer=node.layer,
        status=status,
        output={"files": output},
        evidence=evidence,
        gaps=gaps,
    )
