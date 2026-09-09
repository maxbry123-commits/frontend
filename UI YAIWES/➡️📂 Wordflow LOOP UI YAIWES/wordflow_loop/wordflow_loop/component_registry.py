from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path

@dataclass(frozen=True)
class ComponentSpec:
    id: int
    name: str
    slug: str
    role: str
    mode: str
    status: str

_ROWS = [(1, 'Stabilize CORE', 'stabilize', 'WORKFLOW_OWNER', 'ACTIVE', 'WIRED'), (2, 'Pydantic', 'pydantic', 'TYPED_CONTRACTS', 'ACTIVE', 'WIRED'), (3, 'Starlette', 'starlette', 'ASGI_TRANSPORT', 'ACTIVE', 'WIRED'), (4, 'HTTPX', 'httpx', 'HTTP_CONNECTOR', 'ACTIVE', 'WIRED'), (5, 'rule-engine', 'rule_engine', 'DETERMINISTIC_RULES', 'ACTIVE', 'WIRED'), (6, 'PyCasbin', 'pycasbin', 'POLICY_AUTHZ', 'ACTIVE', 'WIRED'), (7, 'OpenTelemetry Python', 'opentelemetry_python', 'OBSERVABILITY', 'ACTIVE', 'WIRED'), (8, 'pytest', 'pytest', 'TEST_TOOL', 'TEST_ONLY', 'WIRED'), (9, 'Hypothesis', 'hypothesis', 'PROPERTY_TEST_TOOL', 'TEST_ONLY', 'WIRED'), (10, 'Dagu', 'dagu', 'WORKFLOW_PATTERNS', 'DONOR_ONLY', 'WIRED'), (11, 'redun', 'redun', 'PROVENANCE_HASHING', 'DONOR_ONLY', 'WIRED'), (12, 'LibreChat', 'librechat', 'CHAT_WORKSPACE', 'DONOR_ONLY', 'PENDING_SOURCE'), (13, 'big-AGI', 'big_agi', 'MULTIMODEL_CHAT_UI', 'DONOR_ONLY', 'PENDING_SOURCE'), (14, 'Open WebUI', 'open_webui', 'CHAT_ADMIN_UI', 'REFERENCE_ONLY', 'WIRED'), (15, 'Jan', 'jan', 'LOCAL_CHAT_DESKTOP', 'DONOR_ONLY', 'WIRED'), (16, 'Grok Build', 'grok_build', 'WORKSPACE_BUILD', 'DONOR_ONLY', 'WIRED'), (17, 'React', 'react', 'COMMAND_CENTER_UI', 'ACTIVE', 'WIRED'), (18, 'Vite', 'vite', 'WEB_BUILD', 'ACTIVE', 'PENDING_SOURCE'), (19, 'Vercel AI SDK', 'vercel_ai_sdk', 'STREAMING_PROVIDER_UI', 'ACTIVE', 'PENDING_SOURCE'), (20, 'Zustand', 'zustand', 'CLIENT_STATE', 'ACTIVE_CLIENT_ONLY', 'WIRED')]
COMPONENTS = {row[0]: ComponentSpec(*row) for row in _ROWS}

def vendor_root() -> Path:
    return Path(__file__).resolve().parents[2] / "runtime" / "vendor"

def component_path(component_id: int) -> Path:
    spec = COMPONENTS[component_id]
    path = vendor_root() / spec.slug
    if spec.status != "WIRED" or not path.is_dir() or not any(path.iterdir()):
        raise RuntimeError(f"component {component_id} not mounted: {spec.status}")
    return path

def active_components():
    return tuple(spec for spec in COMPONENTS.values() if spec.status == "WIRED")
