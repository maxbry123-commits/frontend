# F-UI-066 — QA GAP REPORT / V1.9.3 → V1.9.5 RECONCILIATION

Fecha: 2026-09-14  
Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`  
Nodo: `F-FRONTEND-QA-066`

## Candidatos observados

### V1.9.3
- Entry: `index-v193.html`
- Entry blob: `2f42d309cef2c523180b030d4bc1d924cd280a20`
- Bootstrap blob: `73deb4432ddb3b40519984a6d85925e9c6cd21a2`
- Run base QA: `34829493699`
- Job: `103929216313`
- Artifact: `10340994638`
- Artifact SHA256: `3d38eac519fbac9ca773c6ddd2381774d3cb6cd6e6bc8711861e5ef8680de7b7`

### V1.9.5
- Entry: `index-v195.html`
- Entry blob: `1c407aec60d590a375f080c253010d25c926df2b`
- Bootstrap blob: `56a1883162c14030dfdf93a7c9bc7db5df11360f`
- Touch integration gate: run `34829818997` = `SUCCESS`
- Closure regression run: `34830387803`
- Closure regression job: `103932105765`
- Closure regression artifact: `10341712835`
- Artifact SHA256: `210282ca705a43f8c011b47d2f926c0679320cffadf52272a7964b5ac8e5095c`

## Harness corrections verified

Tres fallos inicialmente clasificados como posibles fallos de producto se reprodujeron como defectos del harness y fueron corregidos sin tocar el core de Factory.

1. **F-UI-054 tap en contexto desktop**  
   El test reducía el viewport a móvil pero seguía ejecutándose en un browser context sin `hasTouch=true`; `.tap()` producía un fallo del harness. Se sustituyó por `.click()` únicamente en esa refutación.  
   Commit: `6be3b3b86c6fe49480842078f2ffb85d629a138f`.

2. **Reload recovery falso negativo**  
   `page.addInitScript(()=>localStorage.clear())` se ejecutaba también al hacer `page.reload()`, borrando el proyecto justo antes del arranque y fabricando el supuesto fallo de recovery. Se eliminó ese init script en los tests que verifican reload.  
   Commits: `01e47da6d33d3fa32ddbc5ae61dad64440f87a45` y `19fd6fc0615e548d3ff5773141fc5b8b7af6353b`.

3. **Undo falso negativo por doble commit de edición**  
   El test hacía `fill()` + `dispatchEvent('change')` y luego movía el foco a Undo. La secuencia no representa el flujo humano y puede crear dos snapshots equivalentes. Se cambió a `fill() → blur() → undo`, usando el único evento `change` nativo que consume `app-v19.js`.  
   Commits: `838f9f3a33b83e1a1a4267d8213429a32f0008db` y `57917d8f2f0e7a2efb591a0447a2354e02ae87d9`.

## Resultado reproducido sobre V1.9.5

El run `34830387803` prueba el estado después de corregir los falsos negativos del harness.

| Capacidad | Resultado V1.9.5 | Evidencia |
|---|---|---|
| Undo/redo después de edición | **PASS** | desktop closure regression: pasó; el único fallo desktop fue command palette. |
| Reload recovery + repaint | **PASS** | desktop closure regression: pasó; el proyecto persistido reaparece con `[data-node]`. |
| Command palette / Ctrl+K | **GAP REAL** | `surfaces.count() = 0`; no existe superficie `data-command-palette`, quick actions ni dialog equivalente. |
| Mobile Escape / cierre drawers | **PASS** | test independiente pasó después de separar el assert de overflow. |
| Mobile library release → canvas | **PASS** | insert → close library → tap node → selected PASS. |
| Mobile horizontal fit | **GAP REAL** | viewport ≈412px; `body.scrollWidth = 604px`, requerido <=414px. |

## Estado de gates 051–061

### Ya demostrados
- `F-UI-051`: desktop controls PASS.
- `F-UI-053`: la hipótesis de core undo defectuoso queda refutada por V1.9.5; edición/undo/redo PASS con flujo humano.
- `F-UI-054`: reload recovery no es un GAP de producto; el falso negativo provenía del init script que borraba localStorage.
- `F-UI-056`: Escape del shell v2 pasa en V1.9.5 dentro del test aislado.
- `F-UI-059`: Router V1.9.3 PASS en suite previa; debe revalidarse en el candidato final, no heredarse.
- `F-UI-060`: HF Jobs V1.9.3 PASS en suite previa; debe revalidarse en el candidato final, no heredarse.
- `F-UI-061 desktop`: journey V1.9.3 PASS; debe revalidarse en el candidato final.

### GAPs reales que permanecen

#### GAP-A — Mobile horizontal overflow
- Owner requerido: `SEG-01-SHELL` / CSS responsive.
- Evidencia exacta: `body.scrollWidth=604` con viewport `412`, run `34830387803`, job `103932105765`.
- No se acepta `overflow:hidden` como único fix; el contenido debe caber y seguir siendo accionable.
- El próximo test debe localizar elementos causantes por bounding box/scroll width y probar drawers + canvas después del fix.

#### GAP-B — Command palette ausente
- Afecta: `F-UI-055`.
- Evidencia exacta: Ctrl+K produce `0` superficies de comando en V1.9.5.
- Debe reutilizar las acciones canónicas existentes; prohibido crear un segundo state/action engine.

## GAPs refutados / cerrados por evidencia

- `UNDO_PRODUCT_FAILURE` → **REFUTADO; TEST_HARNESS_FAILURE**.
- `RELOAD_RECOVERY_PRODUCT_FAILURE` → **REFUTADO; TEST_HARNESS_FAILURE**.
- `ESCAPE_DRAWER_PRODUCT_FAILURE` → **REFUTADO en V1.9.5; PASS**.
- `LIBRARY_INTERCEPT_AFTER_CLOSE` → **REFUTADO en test aislado V1.9.5; PASS**.

## Orden de cierre actualizado

1. Resolver overflow móvil en un nuevo delta versionado de `SEG-01-SHELL`.
2. Resolver command palette mediante adapter/surface pequeño conectado a acciones canónicas.
3. Integrar únicamente ambos deltas PASS en un nuevo candidato, sin modificar V1.9.3/V1.9.5 históricos.
4. Ejecutar `F-UI-051..061` completos contra **el mismo candidate SHA**.
5. Publicar exactamente `TESTED_SHA`.
6. Repetir web/mobile sobre `PUBLISHED_SHA`.
7. Ejecutar `F-UI-062` cross-review independiente.
8. Ejecutar `F-UI-063 FRONTEND_100`; cualquier GAP mantiene el proyecto abierto.

## Refutaciones de cierre

1. V1.9.5 no puede promoverse aunque undo/reload/drawers pasen: command palette y overflow siguen fallando.
2. PASS histórico de Router/HF/journey no se hereda al próximo candidato; debe probarse otra vez sobre su SHA exacto.
3. Un fix que sólo oculte el overflow o añada un botón decorativo no satisface los gates; debe existir efecto/runtime test reproducible.

## Veredicto

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`

`F-FRONTEND-QA-066 = GAP_RESOLVABLE`

Quedan **dos GAPs frontend reales reproducidos** para el cierre de este carril: mobile horizontal overflow y command palette. No se autoriza 100% ni promoción final todavía.
