# Skills instalados

Fecha de instalación: 2026-10-24. Origen: GitHub, archivos `SKILL.md` reales (no el comando `/plugin` de Claude Code: aquí no existe).

No se avanzó a diseño ni a auditoría. Esto solo confirma qué quedó en disco y qué se leyó.

## Orden cuando haya que usarlos

1. Mensaje tuyo y ley FROMTED (`skills/maxbry-yaiwes/fromted-frontend-architecture/`). Gana sobre cualquier skill genérico.
2. `systematic-debugging` antes de proponer un arreglo. Sin causa raíz no hay parche.
3. `frontend-safety` en cualquier edición de UI: no se tocan props, eventos, tipos ni rutas de API.
4. `test-driven-development` si el cambio es de comportamiento: primero el test que falla.
5. `verification-before-completion` antes de decir que algo quedó bien. Sin salida real del comando, no hay PASS.
6. Diseño visual solo después, y solo dentro de matte | little | blanco. `frontend-design` no puede inventar una cuarta paleta.

## Ley FROMTED (leída)

Temas cerrados: `matte` | `little` | `blanco`. Azul `#2563eb` solo selección. Naranja `#ff5500` solo texto Cargar/Descargar en matte. Terracota `#C65D3B` solo CTA de little. Prohibido el lima `#d9ff43`. Una ventana = un archivo. Un control que no dispara evento se rechaza. `windows/_index.md` y `functions/_index.md` están vacíos a propósito: el puntero dice que las 39 piezas viven en `UI YAIWES interface/` del mismo repo. Esa carpeta no se copió.

## Confirmación

| Skill | Estado | Leído |
|---|---|---|
| superpowers (14 skills) | Instalado en `skills/superpowers/` | Enteros: using-superpowers, systematic-debugging, verification-before-completion, test-driven-development (ley RED). Los otros 10: archivo en disco y mapa de secciones, no línea por línea |
| frontend-design (Anthropic) | Instalado. `SKILL.md` autocontenido | Entero. Queda subordinado a FROMTED |
| ui-ux-pro-max | PARCIAL. Solo `SKILL.md`. Falta `scripts/search.py` y los CSV (79 estilos, 192 paletas) | Reglas 1–10 y el contrato de búsqueda. La base no está local, así que no se consulta |
| agent-browser | `SKILL.md` instalado. Binario sí: `/usr/bin/agent-browser` | Inicio. El archivo pide `agent-browser skills get core` antes de usarlo |
| playwright-cli | PARCIAL. `SKILL.md` sí. Binario `playwright-cli` no está en PATH | Inicio, no la referencia completa de comandos |
| browser-use | PARCIAL. Solo `SKILL.md`. El binario `browser-use` no se instaló | Inicio |
| frontend-safety | Instalado | Entero |
| frontend-ui-engineering | Instalado | Arquitectura de componentes y cuándo usarlo. Resto en disco |
| redesign | FAIL-CLOSED. Solo `SKILL.md`. El kit (workflows, tokens, scripts) no está. El propio skill dice parar y no adivinar | Entero, incluida la parada |
| ECC (affaan-m/ECC) | NO instalado. El repo lista cientos de skills de otros dominios (HIPAA, red, DeFi, homelab). Meterlos aquí mezclaría reglas que no son de este frontend | Inventario de nombres, cuerpos no descargados |
| Maxbry / FROMTED | Instalado el paquete de instrucciones (54 markdown). No se copiaron los 2475 archivos de `lote-zips-extraidos` | Ley, protocolo de agente, tokens matte, puntero, schema, índices. Catálogo de componentes e interacción: en disco, no línea por línea |

## Qué no cuenta como instalado

- `/plugin install` de Claude Code. Eso solo corre en el Claude de tu máquina, no en este chat.
- Las 192 paletas de UI/UX Pro Max. Sin el script y los CSV, citarlas sería inventar.
- Redesign & Audit como flujo completo. Kit ausente: no se usa.
- Las ventanas de `UI YAIWES interface/`. El skill de esta carpeta dice que no se duplican aquí.

## Siguiente paso, todavía no hecho

La trazabilidad del diff de Claude. Cuando la pases: primero `systematic-debugging` y `frontend-safety`. Cero edición hasta cerrar la causa. Un archivo por cambio.
