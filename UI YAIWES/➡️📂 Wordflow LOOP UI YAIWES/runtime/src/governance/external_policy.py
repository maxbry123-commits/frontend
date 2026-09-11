from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

from plugins.contract import PluginKind, PluginSpec
from plugins.fables import FablesSocket
from plugins.registry import PluginRegistry

JsonTransport = Callable[[str, str, dict[str, Any]], dict[str, Any]]

OPA_SOURCE_TREE_SHA = "fb7e06d9db3f00cbb717e5f736854b71b16442d6"
OPENFGA_SOURCE_TREE_SHA = "580c75ed920df3c035e26ef425f1798de626f65a"
OPA_CAPABILITY = "policy.decision.opa"
OPENFGA_CAPABILITY = "policy.authz.rebac"


class PolicyDecisionError(RuntimeError):
    """Fail-closed policy decision error."""


@dataclass(frozen=True)
class PolicyDecision:
    allowed: bool
    provider: str
    raw: dict[str, Any]


class OpaPolicyAdapter:
    def __init__(self, transport: JsonTransport, base_url: str = "http://127.0.0.1:8181") -> None:
        self.transport = transport
        self.base_url = base_url.rstrip("/")

    def decide(self, input_document: dict[str, Any], decision_path: str = "yaiwes/allow") -> PolicyDecision:
        path = decision_path.strip("/")
        if not path:
            raise PolicyDecisionError("OPA decision path is required")
        try:
            response = self.transport("POST", f"{self.base_url}/v1/data/{path}", {"input": input_document})
        except Exception as exc:
            raise PolicyDecisionError("OPA transport failure") from exc
        if not isinstance(response, dict):
            raise PolicyDecisionError("OPA response must be an object")
        result = response.get("result")
        if isinstance(result, bool):
            allowed = result
        elif isinstance(result, dict) and isinstance(result.get("allow"), bool):
            allowed = result["allow"]
        else:
            raise PolicyDecisionError("OPA response has no boolean decision")
        return PolicyDecision(allowed=allowed, provider="opa", raw=response)


class OpenFgaPolicyAdapter:
    def __init__(self, transport: JsonTransport, base_url: str = "http://127.0.0.1:8080") -> None:
        self.transport = transport
        self.base_url = base_url.rstrip("/")

    def check(
        self,
        store_id: str,
        tuple_key: dict[str, str],
        *,
        authorization_model_id: str | None = None,
        contextual_tuples: dict[str, Any] | None = None,
    ) -> PolicyDecision:
        if not store_id.strip():
            raise PolicyDecisionError("OpenFGA store_id is required")
        payload: dict[str, Any] = {"tuple_key": tuple_key}
        if authorization_model_id:
            payload["authorization_model_id"] = authorization_model_id
        if contextual_tuples:
            payload["contextual_tuples"] = contextual_tuples
        try:
            response = self.transport("POST", f"{self.base_url}/stores/{store_id}/check", payload)
        except Exception as exc:
            raise PolicyDecisionError("OpenFGA transport failure") from exc
        if not isinstance(response, dict) or not isinstance(response.get("allowed"), bool):
            raise PolicyDecisionError("OpenFGA response has no boolean allowed field")
        return PolicyDecision(allowed=response["allowed"], provider="openfga", raw=response)


def build_external_policy_socket(
    transport: JsonTransport,
    *,
    opa_base_url: str = "http://127.0.0.1:8181",
    openfga_base_url: str = "http://127.0.0.1:8080",
) -> FablesSocket:
    """Build a Fables socket without changing the Stabilize workflow owner."""
    registry = PluginRegistry()
    registry.register(
        PluginSpec(
            "opa",
            PluginKind.ADAPTER,
            (OPA_CAPABILITY,),
            "UI YAIWES/componentes open soure UI YAIWES/OPA/code",
            OPA_SOURCE_TREE_SHA,
            "runtime/src/governance/opa",
            enabled=True,
            workflow_owner=False,
            factory_key="opa.policy",
        )
    )
    registry.register(
        PluginSpec(
            "openfga",
            PluginKind.ADAPTER,
            (OPENFGA_CAPABILITY,),
            "UI YAIWES/componentes open soure UI YAIWES/OpenFGA/code",
            OPENFGA_SOURCE_TREE_SHA,
            "runtime/src/governance/openfga",
            enabled=True,
            workflow_owner=False,
            factory_key="openfga.policy",
        )
    )
    factories = {
        "opa.policy": lambda: OpaPolicyAdapter(transport, opa_base_url),
        "openfga.policy": lambda: OpenFgaPolicyAdapter(transport, openfga_base_url),
    }
    return FablesSocket(registry, factories)
