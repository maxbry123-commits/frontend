# frontend — staging Astra fábrica UI YAIWES

Propósito: raíz de staging para capacidades frontend OSS seleccionadas, adaptadas y probadas antes de promoción a rutas productivas.

Owner: `➡️ Astra plan fábrica UI YAIWES`

Reglas:
- no duplicar componente completo si basta una capacidad;
- registrar source URL + commit/ref + licencia + hash + destino propuesto;
- pasar por contrato universal + adapter + preview + tests;
- ningún secreto;
- no promocionar a `UI YAIWES/Fabrica UI YAIWES/` o `UI YAIWES/Interface YAIWES ui/` mientras exista owner conflict/handoff pendiente.

Estructura esperada:

```text
frontend/
├─ canvas/
├─ components/
├─ design-system/
├─ editor/
├─ layout/
├─ data-state/
├─ files-assets/
├─ workflow-ui/
├─ ai-controls/
├─ adapters/
├─ manifests/
├─ tests/
└─ evidence/
```
