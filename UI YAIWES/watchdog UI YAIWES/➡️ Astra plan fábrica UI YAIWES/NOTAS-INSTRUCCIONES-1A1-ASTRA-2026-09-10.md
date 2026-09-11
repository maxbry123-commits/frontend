# NOTAS / REGISTRO 1 A 1 DE INSTRUCCIONES — ➡️ Astra plan fábrica UI YAIWES

Fecha: 2026-09-10
Propósito: ledger operativo de cada instrucción del Director vinculada a implementación/evidencia. Este archivo NO reemplaza el INPUT literal; lo referencia.

## I001 — Identidad exacta
Instrucción: usar identidad `➡️ Astra plan fábrica UI YAIWES`.
Estado: IMPLEMENTADO en perfil y Crazy Wall.
Evidencia requerida: Crazy Wall + archivos Astra.

## I002 — Watchdog horario
Instrucción: activar watchdog de tareas pendientes cada 1 hora.
Estado: ACTIVO mediante tarea programada de ChatGPT.
Regla: debe releer INPUT, main, Crazy Wall, STATE, CHECKPOINT y arquitectura antes de actuar.

## I003 — T1 gate absoluto
Instrucción: no iniciar T2_INTERFACE_YAIWES productivamente hasta T1_FACTORY_FRONTEND VERIFIED_CLOSED.
Estado: ACTIVO.

## I004 — Frontend objetivo principal
Instrucción: objetivo Astra = frontend; comprender backend para diseñar integración.
Estado: ACTIVO.

## I005 — No invadir backend Sol
Instrucción: revisar backend de Sol para contratos/compatibilidad pero no escribir rutas backend ajenas.
Estado: ACTIVO.

## I006 — Dos raíces permanentes
Instrucción: mantener `Frontend/` y `backend/`.
Estado: IMPLEMENTADO en staging Astra.
`backend/` = DONOR_STAGING_ONLY hasta handoff.

## I007 — Allowlist plugins/conectores
Instrucción: bloquear cualquier consulta/integración no autorizada excepto GitHub y Hugging Face.
Estado: ACTIVO.

## I008 — Cero fricción
Instrucción: diseñar fábrica con UX mínima, drag/drop, selector, pasos claros y salida UI/ventana.
Estado: ARQUITECTURA IMPLEMENTADA; cierre runtime pendiente.

## I009 — Inspiración OSS drag/drop
Instrucción: inspirarse en sistema open source de arrastrar/pegar si hace falta; primero revisar componentes locales.
Estado: ACTIVO; REUSE local primero.

## I010 — Revisar ambas raíces de componentes/fábrica
Instrucción: revisar fábrica y componentes OSS existentes en frontend/main.
Estado: PARCIALMENTE VERIFICADO; inventario >40 confirmado, integración real pendiente.

## I011 — Flujo por pasos de fábrica
Instrucción: 4/5/8 pasos; se decidió 5 pasos para reducir fricción.
Estado: DECISIÓN APROBADA OPERATIVAMENTE.
Pasos: CREAR -> COMPONER -> TRANSFORMAR -> IA/AUTOPILOT -> VALIDAR/SALIR.

## I012 — Módulo 1
Instrucción: crear ventana/botón/selector/segmento.
Estado: DISEÑADO; runtime E2E pendiente.

## I013 — Módulo 2
Instrucción: integrar todo, crear UI, abrirla y editarla.
Estado: DISEÑADO; runtime E2E pendiente.

## I014 — Módulo 3
Instrucción: recibir componente y transformarlo.
Estado: DISEÑADO como Component Transformer; donor OSS real pendiente de cierre trazable.

## I015 — Módulo 4
Instrucción: IA puede intervenir en cualquier paso, mejorar módulos y usar fábrica sin intervención humana en todos los pasos.
Estado: DISEÑADO como MANUAL | AI_ASSIST | AUTOPILOT con StateDelta reversible.

## I016 — Módulo 5 determinista
Instrucción: fábrica debe tener módulos deterministas listos/configurados.
Estado: DISEÑADO como Deterministic Toolbox; ampliar tests.

## I017 — 3 simulaciones
Instrucción: realizar 3 simulaciones para detectar mejoras.
Estado: DEFINIDAS; ejecución final completa pendiente.

## I018 — 3 refutaciones
Instrucción: refutar plan/tareas/LOOP.
Estado: DEFINIDAS; PASS final pendiente.

## I019 — GOALS12 entrada/salida
Instrucción: usar 12 goals.
Estado: REGISTRADOS en PLAN.

## I020 — Ask Council 12
Instrucción: usar 12 pasos de Council para decidir faltantes/mejoras.
Estado: REGISTRADOS en PLAN.

## I021 — LOOP cola 1x1
Instrucción: INPUT literal -> goals -> prioridades -> plan -> cola1x1 -> execute -> verify/refute...
Estado: CONTRATO ACTIVO.

## I022 — GAP research hasta 20 soluciones
Instrucción: ante GAP investigar hasta 20 maneras y usar StrategyDelta distinto.
Estado: ACTIVO cuando exista GAP real.

## I023 — FLAG no bloquea tareas seguras independientes
Instrucción: mantener flag pendiente con evidencia y continuar safe task.
Estado: ACTIVO.

## I024 — No monolito
Instrucción: separar contracts/adapters/plugins/registry/loader/guards/tests.
Estado: ACTIVO.

## I025 — Enchufe universal obligatorio
Instrucción: conexión sólo mediante enchufe universal/FABLES/contratos recibidos.
Estado: ARQUITECTURA ACTIVA; wiring runtime debe demostrarlo.

## I026 — Motores canónicos para adquisición/copy/move
Instrucción: reutilizar motores y skills existentes, no inventar downloader/extractor cuando aplique.
Estado: ACTIVO como regla; no tocar motores canónicos sin autorización.

## I027 — Persistencia por archivos
Instrucción: cada cambio actualiza BITACORA + STATE + CHECKPOINT + PLAN + RECOVERY + README/arquitectura según aplique.
Estado: AHORA EN REGULARIZACIÓN; se crean PLAN/HANDOFF/RECOVERY/INPUT/NOTAS y audit cross-check.

## I028 — No PASS por presencia
Instrucción: exigir ruta/diff/SHA/test/log/URL/read-back.
Estado: ACTIVO.

## I029 — UI tipo Work
Instrucción: YAIWES funciona como fusión Work + GrokBot + Claude Code/Work/Design.
Estado: PERFIL CANÓNICO DE PRODUCTO.

## I030 — Chat Jarvis/orquestador
Instrucción: chat principal YAIWES controla paneles/sistemas y orquesta múltiples trabajos/agentes.
Estado: PERFIL CANÓNICO DE PRODUCTO.

## I031 — Multiplataforma
Instrucción: Android/iOS/Windows/Linux/PC/web/smartphone.
Estado: REQUISITO ARQUITECTÓNICO.

## I032 — Almacenamiento local + conectores opcionales
Instrucción: local por defecto; usuario puede conectar plataforma elegida.
Estado: REQUISITO; conectores no autorizados no se usan en este worker salvo GitHub/HF.

## I033 — Operación parcial local
Instrucción: IA embebida/local y orquestador local parcial.
Estado: REQUISITO DE PRODUCTO; diseño detallado posterior T2.

## I034 — Seguridad/cifrado fuertes
Instrucción: máxima seguridad razonable; código propietario; SaaS no open source.
Estado: REQUISITO.

## I035 — Agentes/LLMs viven en web
Instrucción: agentes y LLMs se conectan y sirven al usuario desde web.
Estado: REQUISITO; frontend usa provider/model/secret_ref, no secrets reales.

## I036 — Código de componentes en web
Instrucción: code de componentes estará en web.
Estado: REQUISITO de despliegue/packaging.

## I037 — Usar fábrica para mejorar la propia UI
Instrucción: una vez fábrica esté lista, usarla para construir/corregir YAIWES y corregir defectos de fábrica sobre el camino.
Estado: GATEADO por T1 VERIFIED_CLOSED.

## I038 — Mejora progresiva continua
Instrucción: watchdog continúa con investigación/mejora, autoevaluación/refutación/goals/council/simulaciones.
Estado: ACTIVO como mantenimiento posterior, evitando actividad vacía.

## I039 — Cambios modulares y V+
Instrucción: cualquier cambio como ventana modular/nueva versión guardada en GitHub.
Estado: ACTIVO; V+ reversible.

## I040 — Backlog de propuestas
Instrucción: mantener lista de cambios/propuestas para aprobar/mejorar.
Estado: REQUISITO de mantenimiento.

## I041 — Investigar Grok Bot / Grok Build / Claude Work/Cowork / Claude Design
Instrucción: usar como referencias.
Estado: REFERENCIAS REGISTRADAS en arquitectura; no copiar code propietario.

## I042 — Buscar más de 40 componentes OSS locales
Instrucción: revisar >40 componentes en carpeta OSS.
Estado: 46 candidatos inventariados; presencia no equivale a integración.

## I043 — Plan de fusión frontend
Instrucción: crear plan de fusión por capacidades.
Estado: IMPLEMENTADO en arquitectura + PLAN.

## I044 — Backend OSS descubierto se separa y prepara
Instrucción: reciclar/copy/cablear donors backend y dejarlos listos para Sol/Astra backend.
Estado: backend/ staging definido; integración productiva backend prohibida sin handoff.

## I045 — Astra termina integrando frontend/backend por contrato
Instrucción: diseñar frontend sabiendo lo que hacen otros equipos y posteriormente integrar por frontera contractual.
Estado: OBJETIVO T2 posterior a gate.

## I046 — Instrucciones exactas 1 a 1
Instrucción: anotar INPUT literal, no reinterpretar.
Estado: IMPLEMENTADO en `INPUT-BLOCK-LITERAL-2026-09-10.md`; este ledger mapea cada orden a estado.

## I047 — Handoff + Recovery + Arquitectura + notas
Instrucción: crear todos los archivos de continuidad y dar enlaces.
Estado: EN EJECUCIÓN en este cierre documental.

## I048 — Auditoría chat 5 pasadas + cross-check final
Instrucción: revisar 5 veces y cruzar al final 1:1.
Estado: se materializa en `AUDITORIA-5-PASADAS-CROSSCHECK-2026-09-10.md`.

## I049 — No resumir plan/arquitectura
Instrucción: dejar plan y arquitectura completa, sin huecos.
Estado: PLAN completo separado del INPUT literal; arquitectura existente se mantiene como documento técnico base.

## I050 — Terminar fábrica antes de afirmar cierre
Instrucción: modo LOOP hasta terminar toda la fábrica.
Estado: ACTIVE_LOOP; no declarar VERIFIED_CLOSED hasta cumplir matriz de cierre.

## REGLA DE LECTURA

- Para literalidad: leer INPUT-BLOCK-LITERAL-2026-09-10.md.
- Para ejecución: leer PLAN-ASTRA-FABRICA-UI-YAIWES.md.
- Para arquitectura: leer ARQUITECTURA-PERFIL-TRABAJO-ASTRA-FABRICA-UI-YAIWES.md.
- Para continuidad: leer HANDOFF + RECOVERY + STATE + CHECKPOINT + Crazy Wall.
- Para auditoría: leer AUDITORIA-5-PASADAS-CROSSCHECK-2026-09-10.md.
