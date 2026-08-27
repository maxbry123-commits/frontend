# PLATFORM INTEGRATION

Runtime route:
frontend -> universal router -> APIs / Hugging Face
frontend -> universal router -> memory service (osquestador-auditor)

Required deployment variables:
- ROUTER_BASE_URL
- MEMORY_BASE_URL
- ROUTER_AUTH_REF

No API/HF/memory secrets belong in this repository.

Canonical router: maxbry123-commits/router-universal-router-inteligente-
Canonical memory/storage: maxbry123-commits/osquestador-auditor
