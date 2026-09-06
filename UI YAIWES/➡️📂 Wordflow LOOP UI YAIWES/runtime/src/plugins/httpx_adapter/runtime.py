from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

EXPECTED_HTTPX_VERSION = "0.28.1"


class HttpxVersionError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class HttpxRuntime:
    client_type: type[Any]
    async_client_type: type[Any]
    version: str
    client_kwargs: dict[str, Any] = field(default_factory=dict)

    @property
    def healthy(self) -> bool:
        return self.version == EXPECTED_HTTPX_VERSION

    def build_client(self, **kwargs: Any) -> Any:
        merged = dict(self.client_kwargs)
        merged.update(kwargs)
        return self.client_type(**merged)

    def build_async_client(self, **kwargs: Any) -> Any:
        merged = dict(self.client_kwargs)
        merged.update(kwargs)
        return self.async_client_type(**merged)

    def request(self, method: str, url: str, **kwargs: Any) -> Any:
        with self.build_client() as client:
            return client.request(method, url, **kwargs)

    async def async_request(self, method: str, url: str, **kwargs: Any) -> Any:
        async with self.build_async_client() as client:
            return await client.request(method, url, **kwargs)
