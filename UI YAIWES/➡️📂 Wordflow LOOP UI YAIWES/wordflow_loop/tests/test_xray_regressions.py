from wordflow_loop.contracts import NodeContract, Status
from wordflow_loop.layers import layer_02_xray_documents as documents
from wordflow_loop.layers import layer_03_xray_code as code


def node():
    return NodeContract.build(node_id="XRAY", layer="AUDIT", literal="Validate source audit")


def test_blank_and_invalid_documents_cannot_pass():
    result = documents.run(node(), {"documents": {"empty.md": "\n", "bad.md": None}})
    assert result.status == Status.INCONCLUSIVE
    assert len(result.gaps) == 2
    assert not result.evidence


def test_mixed_documents_preserve_valid_evidence_and_gap():
    result = documents.run(node(), {"documents": {"valid.md": "# Goal\nDebe validar", "empty.md": " "}})
    assert result.status == Status.INCONCLUSIVE
    assert list(result.output["documents"]) == ["valid.md"]
    assert [e.ref for e in result.evidence] == ["valid.md"]


def test_stub_inventory_includes_async_docstrings_and_ellipsis():
    source = 'def a():\n pass\nasync def b():\n "doc"\n ...\ndef c():\n "doc"\ndef real():\n return 1\n'
    result = code.run(node(), {"files": {"sample.py": source}})
    assert result.output["files"]["sample.py"]["stubs"] == ["a", "b", "c"]
    assert "real" in result.output["files"]["sample.py"]["symbols"]


def test_syntax_failure_is_not_promoted_with_valid_file():
    result = code.run(node(), {"files": {"valid.py": "value = 1", "broken.py": "def :"}})
    assert result.status == Status.INCONCLUSIVE
    assert result.gaps == ["syntax_error:broken.py"]
