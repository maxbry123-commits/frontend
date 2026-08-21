# trabajo-grok

Workspace de trabajo Grok / MAXBRY. **Repo privado.**

## Raíz
| Archivo | Uso |
|---------|-----|
| `TAREAS-EN-CURSO.md` | Lista de tareas / plan activo |
| `BITACORA-RESUMEN.md` | Memoria acumulada / historial |
| `MAPA.md` | Mapa repos ↔ proyectos |
| `GUIA-VPS-ORACLE-GROK-CONTROL.md` | **Guía completa** VPS Oracle + control total Grok (runner + cloud-init + 10 respaldos móvil) |

## `infra/` — almacenamiento VPS + puentes + vault
| Carpeta | Contenido |
|---------|-----------|
| `infra/vault/` | MASTER_VAULT_150_KEYS (SSH, Contabo, PATs, misc) — **solo este repo privado** |
| `infra/bridges/` | CONEXIONES_UNIVERSAL_v3.0 + UNIVERSAL v4 + parches |
| `infra/control-layer/` | Reportes AUTH/COMPLETE/CONTABO/AUDIT control layer |
| `infra/nginx/` | maxbry-bridge confs |
| `infra/scripts/` | backup_minio, grafana_setup, indexar_qdrant, buscar, limpiar, htpasswd |
| `infra/compose/` | docker-compose.memory.yml |

## Reglas
- TAREAS solo lista de trabajo.
- Secretos viven en `infra/vault/` de **este** repo privado; no duplicar en repos públicos.
- Rotar keys si el repo se filtra.
- Control VPS nuevo: seguir `GUIA-VPS-ORACLE-GROK-CONTROL.md` (self-hosted runner, no SSH diario).
- Contabo legacy: control layer `maxbry1.duckdns.org:8443` (histórico).
