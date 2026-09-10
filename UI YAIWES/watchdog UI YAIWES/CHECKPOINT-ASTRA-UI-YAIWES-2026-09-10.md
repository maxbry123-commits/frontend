# CHECKPOINT ASTRA — UI YAIWES

Fecha: 2026-09-10
Estado: ACTIVE / FAIL_CLOSED
Regla: no sobrescribir ventanas ni versiones previas. Toda mejora crea versión adicional y exige evidencia.

## Estado reconstruido
- Handoff backend canónico leído: `HANDOFF-WATCHDOG-MOTORES-CANONICOS-2026-09-10.md`.
- Motores de descarga/extracción/copia/movimiento: COPY_ONLY e inmutables; no crear motores paralelos equivalentes.
- Antes de declarar integración cerrada: verificar presencia física de los 14 componentes pendientes y después cableado con ruta + SHA/diff + test/log + read-back.
- Fábrica actual leída: `fabrica de UI INTERFACE fromtend/`.
- Cableado vigente preserva: fábrica separada de runtime; 1 ventana=1 archivo; 1 función=1 archivo; backend fuera de `yaiwes-button`; GrapesJS/Puck no entran al runtime final.
- Documentos Wordflow LOOP históricos localizados en el commit de referencia `56a7e066722b2391b25e3f1a04ec1235489817ad` para perfilar chat/multitarea.

## GOALS 12 de esta fase
1. Preservar V1 y crear solo V+.
2. Reutilizar OSS antes de escribir código nuevo.
3. Separar Frontend / Backend / Plugin-Adapter.
4. Backend nunca monolítico.
5. Cada bloque backend con contrato estable y enchufe universal.
6. Fábrica interna separada del producto final.
7. Work UI soporta múltiples ventanas, tareas, agentes y workflows paralelos.
8. Chat tiene workflow propio y puede emitir/recibir acciones mediante bus/manifest, no acoplamiento directo.
9. Configuración/secrets no viven en la ventana de usuario.
10. Cada integración exige test y evidencia reproducible.
11. Checkpoint permite relevo Astra/Sol/Grok/Claude sin reinterpretar el estado.
12. Ningún DONE se acepta sin read-back y prueba.

## Ask Council 12 — decisión obligatoria por cambio
1. ¿Qué problema concreto resuelve?
2. ¿Ya existe capacidad equivalente en la biblioteca/OSS descargado?
3. ¿Se integra en fábrica o como capacidad de ventana/runtime?
4. ¿Cuál es el límite mínimo del módulo?
5. ¿Qué parte es frontend?
6. ¿Qué parte es backend?
7. ¿Qué contrato/plugin los conecta?
8. ¿Qué estado necesita persistir?
9. ¿Qué permisos/secrets necesita y dónde viven?
10. ¿Qué test demuestra funcionamiento real?
11. ¿Cómo se revierte sin romper V1?
12. ¿Qué evidencia y checkpoint deja para el siguiente agente?

## Refutación 3x
- Factual: presencia física de un repo no prueba que esté integrado.
- Estructural: juntar +40 componentes en un único backend físico produciría el monolito que el contrato prohíbe; la fusión correcta es por capacidades bajo contratos/plugins comunes.
- Adversarial: un agente no puede declarar DONE por texto; requiere SHA/diff + test/log + read-back.

## Plan de 5 pasos sin sobre-ingeniería
1. Inventariar y clasificar componentes existentes por capacidad: FABRICA o RUNTIME/VENTANA, sin duplicarlos.
2. Definir un único contrato de plugin universal y adaptadores pequeños para frontend/backend.
3. Perfilar WORK multitarea: ventanas + tareas + agentes + workflow/chat sobre registry/action-bus/manifest existentes.
4. Integrar por lotes pequeños usando OSS existente y motores canónicos; test por integración; siempre V+.
5. Evaluar trabajo de Astra/Sol/Grok/Claude, registrar evidencia, checkpoint y siguiente cola 1x1.

## Cola 1x1 vigente
P0: verificar físicamente los 14 componentes pendientes del handoff canónico antes de cablearlos.
P1: construir matriz de capacidades de los componentes existentes: `Fábrica | Runtime/Ventana | Backend | Plugin/Adapter | No usar`.
P2: fijar contrato mínimo `plugin-manifest + action-bus + backend-adapter` reutilizando el cableado ya presente.
P3: crear primera integración V+ demostrable y testearla sin modificar las 39 ventanas actuales.
P4: perfilar el workflow especial de chat y multitarea desde los documentos históricos, conectándolo al mismo bus/manifest.

## Reparto multiagente
- ASTRA: auditoría, integración, mejoras V+, gaps, pruebas, checkpoints y ayuda de código modular.
- SOL: backend y adapters/bloques backend; Astra revisa y ayuda sin reescribir monolíticamente.
- GROK: frontend/diseño y composición visual; Astra evalúa e integra mediante nueva versión.
- CLAUDE: tareas independientes de implementación/revisión asignadas desde checkpoint.

## Gate siguiente
No tocar las 39 ventanas existentes. No declarar los 14 componentes integrados hasta verificar primero presencia física y luego WIRED. Próxima acción segura: auditoría física 14/14 + matriz de capacidades.
