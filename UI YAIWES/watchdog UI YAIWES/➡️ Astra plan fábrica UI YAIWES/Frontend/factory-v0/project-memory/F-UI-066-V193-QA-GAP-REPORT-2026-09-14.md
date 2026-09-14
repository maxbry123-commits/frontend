# F-UI-066 — V1.9.3 QA GAP REPORT

Fecha: 2026-09-14  
Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`  
Nodo: `F-FRONTEND-QA-066`  
Candidate: `index-v193.html`  
Candidate blob: `2f42d309cef2c523180b030d4bc1d924cd280a20`  
Bootstrap blob: `73deb4432ddb3b40519984a6d85925e9c6cd21a2`  
Harness-fix commit: `6be3b3b86c6fe49480842078f2ffb85d629a138f`  
Harness-fix blob (`f-ui-054-sol6-refutation.spec.mjs`): `1e4eabc2a295016194c02a954389058f1a95962e`  
Workflow: `Factory V1.9.3 QA 051-061 Local`  
Run: `34829493699`  
Job: `103929216313`  
Artifact: `10340994638`  
Artifact SHA256: `3d38eac519fbac9ca773c6ddd2381774d3cb6cd6e6bc8711861e5ef8680de7b7`

## Resultado

Estado: `GAP_REPRODUCED_FAIL_CLOSED`

La suite no autoriza promoción ni 100%. El run reprodujo fallos de producto reales y separó un fallo de harness que ya fue corregido.

| Gate | Resultado | Evidencia / GAP |
|---|---|---|
| F-UI-051 desktop control matrix | PASS | 2/2 tests PASS; botones base producen efectos canónicos. |
| F-UI-052 mobile controls | GAP | El centro del toggle Inspector está cubierto/interceptado por otro elemento. |
| F-UI-053 component journey desktop | GAP | `#undo` no revierte el label `Botón editado V193`; el DOM y estado permanecen editados. |
| F-UI-053 component journey mobile | PASS | Insert/select/edit móvil PASS en su proyecto móvil. |
| F-UI-054 simulations/refutations | PARTIAL 5/6 | desktop/compact/mobile simulations PASS; drawer repeated transitions PASS; responsive state PASS; reload recovery FAIL porque localStorage conserva el proyecto pero después de reload `[data-node]` queda en 0. |
| F-UI-055 shortcuts | PASS_PARTIAL | duplicate/delete shortcut PASS. |
| F-UI-055 command palette | GAP | Ctrl+K no presenta superficie real de command palette/quick actions. |
| F-UI-056 desktop a11y | PASS | nombres accesibles + navegación de focus del core PASS. |
| F-UI-056 mobile a11y | GAP | Escape deja focus dentro de `.library-pane`; focus trap funcional. |
| F-UI-058 desktop visual | PASS | canvas dominante; sin clipping horizontal crítico. |
| F-UI-058 mobile visual | GAP | overflow horizontal masivo; topbar/studio ~604px en viewport móvil ~412px y múltiples elementos fuera de viewport. |
| F-UI-059 Router V193 | PASS | healthy/degraded/error/reconnect readback PASS sobre V1.9.3. |
| F-UI-060 HF Jobs V193 | PASS | run/status/logs/complete/cancel sincronizados sin secretos PASS. |
| F-UI-061 full journey desktop | PASS | create→compose→edit→save→reload→export→remote visible UI PASS. |
| F-UI-061 full journey mobile | GAP | `.library-pane` permanece abierta e intercepta click sobre `[data-node]`; timeout 30s. |

## Harness correction already applied

El test F-UI-054 usaba `tap()` dentro del proyecto `chromium-desktop` después de reducir el viewport a dimensiones móviles. Ese contexto no tiene `hasTouch=true`; era un `TEST_HARNESS_FAILURE`. Se sustituyó únicamente por `click()` para la refutación responsive. En el rerun el test de transiciones de drawer pasó, demostrando que ese fallo concreto era del harness, no del producto.

## GAP clusters deduplicados

### GAP-A — Mobile shell / viewport / drawer

Afecta: `F-UI-052`, `F-UI-056 mobile`, `F-UI-058 mobile`, `F-UI-061 mobile`.

Síntomas reproducidos:
- inspector toggle cubierto,
- Escape no libera/cierra el drawer,
- ancho de documento excede viewport,
- library drawer intercepta interacción del canvas.

Owner requerido: `SEG-01-SHELL`/integración posterior. No parchear desde QA.

### GAP-B — Undo de edición

Afecta: `F-UI-053 desktop`.

El reducer tiene acción UNDO, pero el recorrido real tras editar propiedades no revierte la etiqueta visible. Requiere diagnóstico de `SEG-03-EDITOR-CORE`, no un cambio al test.

### GAP-C — Reload recovery / repaint

Afecta: `F-UI-054 refutation 1`.

El proyecto persiste en localStorage antes y después de reload, pero el canvas no repinta los nodos (`[data-node]=0`). Requiere diagnóstico de bootstrap/state/render/IO. No se debe ocultar con espera o test relajado.

### GAP-D — Command palette ausente

Afecta: `F-UI-055`.

Ctrl+K no abre una superficie de comandos auditable. Debe implementarse como adapter/surface pequeño sobre acciones canónicas; no segundo action/state engine.

## Closure order

1. Cerrar GAP-A en una nueva versión del shell y volver a integrar en candidato aislado.
2. Cerrar GAP-B en nodo `SEG-03-EDITOR-CORE` separado.
3. Cerrar GAP-C sin duplicar persistencia/state engine.
4. Cerrar GAP-D reutilizando acciones existentes.
5. Integrar únicamente segmentos liberados en un candidato único posterior a V1.9.3.
6. Reejecutar 051–061 completos sobre ese mismo candidate SHA.
7. Publicar exactamente el SHA probado.
8. Ejecutar 062 cross-review independiente.
9. Ejecutar 063 FRONTEND_100 gate; cualquier GAP mantiene el proyecto abierto.

## Refutaciones de cierre

1. `F-UI-051 PASS` no implica que el frontend esté cerrado: existen fallos móviles y de recovery.
2. `F-UI-059/060/061-desktop PASS` no autoriza heredar PASS a otro candidate: cualquier V1.9.4+ debe revalidarse sobre su SHA exacto.
3. Un segmento aislado PASS no puede promoverse si el candidato integrado falla móvil, reload, undo o command palette.

## Veredicto

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`

`F-FRONTEND-QA-066 = GAP_REPRODUCED_FAIL_CLOSED`

No promover V1.9.3. Los GAPs están reproducidos, deduplicados y asignables a segmentos sin colisión.
