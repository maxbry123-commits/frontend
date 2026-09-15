from __future__ import annotations

import pytest

from runtime.src.adapters.bounded_file_intake import InputFile, build_file_manifest


def _files(count: int):
    return [InputFile(f"src/file-{i:03d}.txt", f"payload-{i}".encode()) for i in range(count)]


def test_accepts_one_file():
    manifest = build_file_manifest(_files(1))
    assert manifest["file_count"] == 1
    assert len(manifest["files"][0]["sha256"]) == 64


def test_accepts_one_hundred_files():
    assert build_file_manifest(_files(100))["file_count"] == 100


@pytest.mark.parametrize("count", [0, 101])
def test_rejects_out_of_bounds(count):
    with pytest.raises(ValueError, match="file_count_must_be_between_1_and_100"):
        build_file_manifest(_files(count))


@pytest.mark.parametrize("path", ["../secret.txt", "/etc/passwd", "a/../../secret", "a\\b.txt", ".."])
def test_rejects_unsafe_paths(path):
    with pytest.raises(ValueError, match="unsafe_input_path"):
        build_file_manifest([InputFile(path, b"x")])


def test_rejects_duplicate_normalized_paths():
    with pytest.raises(ValueError, match="duplicate_input_path"):
        build_file_manifest([InputFile("src/a.txt", b"a"), InputFile("src/./a.txt", b"b")])


def test_preserves_unknown_kind():
    manifest = build_file_manifest([InputFile("src/a.bin", b"x")])
    assert manifest["files"][0]["kind"] == "UNKNOWN"


def test_manifest_is_deterministic_independent_of_input_order():
    first = [InputFile("b.txt", b"b", "text"), InputFile("a.txt", b"a", "text")]
    second = list(reversed(first))
    assert build_file_manifest(first) == build_file_manifest(second)
