# runtime/src/adapters

Adaptadores entre Stabilize CORE y sistemas existentes.

Previstos:
- `memory_adapter.py`
- `router_adapter.py`
- `agent_adapter.py`
- transporte HTTPX solo cuando el servicio sea remoto.

Reglas:
- no duplicar Memory;
- no duplicar Router;
- preservar contratos tipados;
- registrar source/version/route/evidence refs;
- no convertir un adapter en un segundo orquestador.
