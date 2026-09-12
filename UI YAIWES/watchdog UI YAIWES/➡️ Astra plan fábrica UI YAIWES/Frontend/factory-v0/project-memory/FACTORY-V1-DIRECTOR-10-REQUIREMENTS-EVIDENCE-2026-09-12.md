# Factory V1 — evidencia Director 10 requisitos — 2026-09-12

Estado: VERIFIED_CLOSED para los controles de fábrica solicitados.

Source probado: `68353b77356b667356827748bade0fe7207e134a`.
Space: `COMAND-CENTER-1/yaiwes-ui-factory`.
HF Space commit: `8288eb11ddabf48b82353a5cad2783e7f1142253`.
Web: `https://comand-center-1-yaiwes-ui-factory.static.hf.space/`.
Workflow: `https://github.com/maxbry123-commits/frontend/actions/runs/34707684548` = success, OIDC publish PASS, HTTP read-back PASS.
Local/runtime E2E candidate: `https://huggingface.co/jobs/COMAND-CENTER-1/6aa588635527934177ed0d20` = 28/28 PASS.
Deployed E2E: `https://huggingface.co/jobs/COMAND-CENTER-1/6aa588d15527934177ed0d42` = 28/28 PASS desktop/mobile.
Independent reviewer: `https://huggingface.co/jobs/COMAND-CENTER-1/6aa588fc5527934177ed0d5c` = PASS.

## 10 gates cubiertos
1. Router multi-IA: modelos, endpoint, secret_ref, roles y team modes single/race/quorum/sequence.
2. Remoto: MCP_HTTP/HTTP/WEBSOCKET/API, URL, secret_ref, save/probe.
3. Skills: principal/referencia con source URL/GitHub/ruta.
4. Entradas: file/image/media, HTML inline, URL, GitHub source.
5. Destinos: DOWNLOAD/GITHUB/HUGGINGFACE/VERCEL/MCP/SHARE/CUSTOM_HTTP + ruta + secret_ref + output plan.
6. Réplicas: múltiples URL de referencia persistentes.
7. Web: creador de página landing/dashboard/saas/portfolio/blank que agrega componente al canvas.
8. Media: upload image/video/audio/3D y job IA para image/video/audio/3D.
9. Diseño: fondo/panel/texto/acento/radius aplicables y persistentes.
10. Micro-kernel: validator/versioner/evidence/queue1x1 con ejecución y resultado observable.

## Seguridad / límites honestos
- El frontend estático NO almacena API keys crudas; usa `secret_ref`.
- Ejecución IA remota real requiere que el usuario/configuración proporcione un endpoint Router/MCP/HTTP válido y que el backend/router resuelva el `secret_ref`.
- Generación media real usa el mismo boundary; sin modelo/router configurado el job queda `BLOCKED_NO_MODEL` o `QUEUED_LOCAL_NO_REMOTE`, nunca falso PASS.
- Los 28 E2E verifican interacción, persistencia, validaciones, descarga/export y responsive en desktop/mobile.
