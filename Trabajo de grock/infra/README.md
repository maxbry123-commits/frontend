# infra/

Almacenamiento de infraestructura VPS + vault + puentes.

- `vault/` — claves (SSH ed25519, Contabo API, GitHub PATs, providers)
- `bridges/` — CONEXIONES_UNIVERSAL, MAXBRY UNIVERSAL, parches estado real
- `control-layer/` — reportes deploy/auth/docker/contabo (tokens Grok documentados en reportes AUTH)
- `nginx/` — confs bridge
- `scripts/` — utilidades VPS
- `compose/` — memory stack compose

**No copiar vault a repos públicos.**
