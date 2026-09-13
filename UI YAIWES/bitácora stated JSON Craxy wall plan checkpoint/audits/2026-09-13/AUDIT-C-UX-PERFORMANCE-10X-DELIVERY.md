# MODELO C — AUDITORÍA XRAY UX + PERFORMANCE + ENTREGA 10X

## MISIÓN
Auditar si YAIWES funciona como producto usable —no sólo runtime correcto— y si sus promesas de local-first, multi-dispositivo, AI routing, fábrica UI y mejora 10x son medibles. Prioridad: experiencia completa, latencia, recursos, empaquetado, operabilidad y coste.

## 12 GOALS DE ENTRADA
1. Leer HEAD/raíz/READ-FIRST/Crazy Wall+extensión/Handoff/arquitecturas.
2. Leer S1–S4 con foco en Command Center, UI, ventanas, trabajo y multi-dispositivo.
3. Inventariar frontend/factory/Interface YAIWES/components/runtime API y entrypoints reales.
4. Verificar journeys Chat/Work/Artifacts/Files/Terminal/Tasks/Trace/Windows.
5. Verificar local inference router y fallback remoto sin promesas no demostradas.
6. Verificar model/tool/project/health selectors y estados observable/cancel/retry.
7. Verificar persist/reopen/export/import/history/checkpoint desde experiencia de usuario.
8. Verificar Android/Linux/Windows y mirror/guest flows según capability real.
9. Medir o localizar baseline de startup, interaction latency, build/test, memory/CPU y task throughput.
10. Auditar packaging/deploy/update/offline/local-first y costos operativos.
11. Revisar OSS/componentes: donor presente ≠ UI integrada; detectar redundancia/bloat.
12. Cruce de UX contra requisitos, tests browser/E2E, screenshots/runs y evidencia actual.

## 12 GOALS DE SALIDA
1. Mapa de journeys críticos y estado PASS/GAP.
2. Lista de controles UI que realmente modifican estado vs decoración/no-op.
3. Estado de streaming/stop/cancel/retry/recovery visible al usuario.
4. Estado de Work/Artifacts/Files/Terminal/Task Trace.
5. Estado de Virtual Computer/windows/guest/mirror por plataforma.
6. Estado de router local/remoto y fallback/error handling.
7. Performance scorecard con baseline existente o `NO_BASELINE`.
8. Lista de bloat/duplicados/dead surfaces sin borrar evidencia.
9. Lista de packaging/deployment/update gaps.
10. Top recomendaciones de UX/operabilidad/coste.
11. Recomendaciones 10x sólo donde exista método de medición reproducible.
12. Plan mínimo de E2E final hasta N17/N31/N35/Final Judge.

## ASK COUNCIL — 12 PASOS
1. User objective.
2. First-run/onboarding.
3. Core chat loop.
4. Work/artifact loop.
5. Files/terminal/task trace.
6. AI model/tool routing.
7. Local-first/offline/fallback.
8. Multi-window/virtual-computer/mirror.
9. Recovery/reopen/history.
10. Performance/resource/cost.
11. Packaging/update/maintainability.
12. Final product proof and highest-leverage delta.

## DEBATE INTERNO
- **Product Advocate:** defiende que el producto ya cubre la experiencia necesaria con piezas existentes.
- **User/SRE Skeptic:** intenta encontrar no-op controls, rutas rotas, estados invisibles, latencia/bloat y experiencias que sólo existen en README.
- **Judge:** puntúa exclusivamente journeys reproducibles y evidencia; maqueta ≠ producto.

## 3 REFUTACIONES OBLIGATORIAS
R1. Intentar demostrar que una capability marcada presente no puede completarse desde la UI real.
R2. Intentar demostrar que local-first/fallback/stop/recovery falla o engaña al usuario en degradación real.
R3. Intentar demostrar que “10x” es marketing: exigir baseline, candidate, misma carga y repetibilidad antes de aceptarlo.

## 4 SIMULACIONES
S1 First user journey: abrir YAIWES → proyecto → prompt → streaming → artifact → file → reopen; cero paso manual oculto.
S2 Heavy task: fan-out/batching/multi-worker con progreso visible, cancel, checkpoint y recuperación; medir latencia/throughput/recursos.
S3 Device journey: móvil ↔ Linux/Android guest ↔ mirror/control; disconnect/reconnect sin perder estado ni copiar disk/RAM continuamente.
S4 Delivery: clean install/update → restore project → run workflow → rollback update/error; verificar provenance, compatibilidad y coste.

## RECOMENDACIONES 10X
Campos: UX speed, build/test feedback, model routing latency/cost, resource utilization, task throughput, recovery time, packaging size/startup y operator effort. Una recomendación válida contiene `baseline`, `candidate`, `same workload`, `median/p95`, `sample count`, `expected gain`, `implementation delta`, `risk`, `test`, `rollback`. Si no hay baseline: `HYPOTHESIS`, no 10x validado.

## FORMATO
`Journey/Metric | Current evidence | Gap | User impact | Existing owner/component | Minimal delta | Test | Baseline | Target | Verdict`.
Terminar con máximo 10 mejoras rankeadas y separar `MUST CLOSE / SHOULD IMPROVE / DO NOT BUILD`.
