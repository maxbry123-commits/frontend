# Vault upload

Los HTML grandes (MASTER_VAULT ~85KB, CONEXIONES ~84KB) deben quedar en:

- `infra/vault/MASTER_VAULT_150_KEYS.html`
- `infra/bridges/CONEXIONES_UNIVERSAL_v3.0.html`

**Desde el movil (GitHub app / web):**
1. Abre repo `trabajo-grok` (privado)
2. Add file → Upload → elige los 2 HTML del chat/attachments
3. Path: `infra/vault/...` y `infra/bridges/...`

Grok ya dejo indices + reportes control-layer + scripts + nginx confs.

Tokens de control layer operativos estan en el VPS:
`/workspace/maxbry-control-layer/.env.grok`
(documentados en `infra/control-layer/` reports)
