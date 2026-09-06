import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.httpx_adapter import (
    EXPECTED_HTTPX_VERSION,
    HttpxDependencies,
    HttpxVersionError,
    create_httpx_runtime,
)
from plugins.starlette_adapter import (
    EXPECTED_STARLETTE_VERSION,
    StarletteDependencies,
    StarletteVersionError,
    create_starlette_runtime,
)


class FakeClient:
    def __init__(self, **kwargs): self.kwargs = kwargs
    def __enter__(self): return self
    def __exit__(self, *args): return False
    def request(self, method, url, **kwargs): return {"method": method, "url": url, "kwargs": kwargs}


class FakeAsyncClient:
    def __init__(self, **kwargs): self.kwargs = kwargs
    async def __aenter__(self): return self
    async def __aexit__(self, *args): return False
    async def request(self, method, url, **kwargs): return {"method": method, "url": url, "kwargs": kwargs}


class FakeApp:
    def __init__(self, **kwargs): self.kwargs = kwargs


class TransportAdapterTests(unittest.TestCase):
    def test_httpx_expected_version_passes(self):
        runtime = create_httpx_runtime(HttpxDependencies(FakeClient, FakeAsyncClient, EXPECTED_HTTPX_VERSION))
        self.assertTrue(runtime.healthy)
        self.assertEqual(runtime.request("GET", "https://example.test")["method"], "GET")

    def test_httpx_wrong_version_fails_closed(self):
        with self.assertRaises(HttpxVersionError):
            create_httpx_runtime(HttpxDependencies(FakeClient, FakeAsyncClient, "0.0.0"))

    def test_starlette_expected_version_passes(self):
        runtime = create_starlette_runtime(StarletteDependencies(FakeApp, EXPECTED_STARLETTE_VERSION))
        self.assertTrue(runtime.healthy)
        self.assertTrue(runtime.create_app(debug=True).kwargs["debug"])

    def test_starlette_wrong_version_fails_closed(self):
        with self.assertRaises(StarletteVersionError):
            create_starlette_runtime(StarletteDependencies(FakeApp, "0.50.0"))


if __name__ == "__main__":
    unittest.main()
