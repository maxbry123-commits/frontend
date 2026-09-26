# HANDOFF — T-3000 MOTOR AUTOEVOLUTION 👾
Actualizado: 2026-09-26 por Opus. Estado: RECEPCIÓN TERMINADA, SIN CÓDIGO. El Director pidió discutir el micro kernel antes de construirlo.

## Qué es (resumen fiel del Director)
Micro kernel determinista de autoevolución: recibe URL visible + nombre de un componente → lo descarga con los motores de descarga y extracción → lo clasifica (plugin, pool, tool, agente, software…) → lo convierte en contrato/esquema + código ejecutable (no skill informativo) con CLI-Anything y el estilo de plugins de DeepSeek Harness (Cordis) → lo prueba → solo si pasa lo registra y actualiza el sistema. Bloque independiente y copiable; conectado a la Fábrica UI pero FUERA de su runtime; activable desde el chat o por una IA con URL + nombre.

## Fuentes (en este orden)
1. Archivo del Director (NO TOCAR, 3.571 líneas) en `00-ENTRADA/` de esta carpeta.
2. Repo router-universal-router-inteligente-: `chat router/INPUT-BLOCK-VERBATIM-CHAT-Y-PANEL-PARTE-3.md` (docs 11–13) y `-PARTE-4.md` (docs 14–19): Capability Engine, 15 motores deterministas, registro obligatorio, cobertura, recetas, CLI-Anything.
3. Fábrica UI: `UI YAIWES/` y `fabrica de UI INTERFACE fromtend/` de este repo.
4. Nivel de planificación: repo agentes, `Claude notas/PLAN-DSL-DAG-00-CONTRATO.yaml`, `-01-NODOS.yaml`, `-4-OBJETIVOS.yaml`.

## Reglas del Director
Segmentos separados (nunca monolítico), "segmento X listo" + enlace; plan DSL DAG antes de ejecutar; releer instrucciones en cada ejecución; Crazy Wall/state JSON/handoff siempre al día.

## Pendiente
1. Leer 00-ENTRADA completo. 2. Proponer plan DSL DAG por segmentos y DISCUTIRLO con el Director. 3. Descargar CLI-Anything y DeepSeek Harness (bloqueados: el motor rechaza enlaces simbólicos). 4. Construir por segmentos con pruebas.

```json
{"proyecto":"T-3000","actual":"recepcion_terminada","siguiente":"leer_00-ENTRADA_y_proponer_plan","codigo":"ninguno","bloqueos":["motor_rechaza_symlinks"],"aprobado_por_director":false}
```
