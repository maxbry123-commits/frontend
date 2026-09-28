# Método de trabajo · UI YAIWES interface

Actualizado 2026-09-27 · ACTIVE / FAIL_CLOSED / EVIDENCE_FIRST.

## Propósito
Cualquier IA/modelo puede retomar el proyecto sin historial del chat.

## Lectura
`AGENTS -> EXECUTION-CONTRACT -> arquitectura -> plan -> handoff skills -> SKILL -> DESIGN_SYSTEM -> COMPONENT_INDEX -> ACCEPTANCE -> handoff frontend -> referencias`.

## Fórmula
`REFERENCE + CONTEXT + SKILLS + BROWSER + VERIFIER`.
`VER -> USAR -> COMPARAR -> CORREGIR -> VERIFICAR`.

## Staff
Director; Codex executor/improver; v0 bootstrap visual; Meta Visual Reviewer; Sheriff; Validator; Verifier; Sentinel; Guardian. Ver `TEAM-UI-YAIWES.md`.

## Skills como Schema/Contract/Sheriff
`TASK -> SkillResolver -> SkillInvocation Schema -> Task Contract -> Sheriff -> Implement -> Validator -> Verifier -> Sentinel -> Guardian`.

## DSL/DAG
- `workflow/UI-YAIWES-FRONTEND.dsl.yaml`
- `workflow/UI-YAIWES-FRONTEND-DAG.json`
- `workflow/UI-YAIWES-CONTRACT.schema.json`
- `workflow/SHERIFF-POLICY.yaml`
- `workflow/VALIDATOR-VERIFIER.md`
- `workflow/SENTINEL-WEB-AUDIT.md`
- `workflow/GUARDIAN.md`

## Mini workflow
```text
READ references
READ project files
READ skills
BUILD CONTRACT
SHERIFF
IMPLEMENT
START application
OPEN browser
TEST interactions
CAPTURE desktop
CAPTURE mobile
COMPARE references
FIX differences
META REVIEW if available
SENTINEL WEB AUDIT
VERIFY
GUARDIAN
LOOP UNTIL ACCEPTANCE == 100%
```

## Browser
`CODE -> localhost/file target -> BROWSER -> DOM -> computedStyle -> console -> network -> screenshot`.

## Source priority
Director -> visual reference -> design system -> existing components -> project files -> SKILL/AGENTS -> inference last.

## Diseño != comportamiento != verificación
Apariencia, acciones/estado y prueba son capas distintas.

## FIFA
`Diseño/Manus -> HTML funcional -> código modular -> assets -> dependencies -> version -> seguir editando`.
Nunca solo HTML para una pieza evolutiva.

## QA
11/11 de `ACCEPTANCE.md` + AC01..AC15.

## LOOP legado
L0-L10 sigue protegiendo IDs/originales y queda contenido dentro del DAG nuevo.

## Evidencia
Registrar task/surface ID, sources, skills, componentes, cambios, tests, screenshots, Sentinel report, PASS/FAIL/BLOCKED, commit SHA.

## Referencias
Imágenes:
https://github.com/maxbry123-commits/frontend/tree/39a614b9b098a8a932d8923b861af790959118b8/UI%20YAIWES%20interface/Ui%20Yaiwes%20interface%20beta/01-original/FOTOS-REF

Handoff skills:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES%20interface/readme%20arquitectura%20UI%20YAIWES%20interface%20beta/actualizaciones%20arquitectura/HANDOFF-SKILLS-UI-YAIWES-2026-09-27.md

## Done
`11/11 PASS + AC01..AC15 PASS + dead_controls=0 + console_errors=0 + missing_assets=0 + evidence + handoff`.
