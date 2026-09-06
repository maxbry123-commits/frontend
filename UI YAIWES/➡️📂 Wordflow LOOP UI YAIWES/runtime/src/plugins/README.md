# Universal Plugin Socket — UI YAIWES

Arquitectura modular, fail-closed y sin imports arbitrarios.

Flujo:
`Component source → PluginSpec/capability passport → PluginRegistry → MountGuard → explicit factory → mounted capability → health/test/evidence`.

Archivos:
- `contract.py`: contrato/capability passport.
- `catalog.py`: inventario 14 componentes con source tree SHA y raíz de código.
- `registry.py`: nombres/capabilities + único workflow owner.
- `mount_guard.py`: gate fail-closed; donor/test no se montan en producción.
- `loader.py`: factories explícitas; no acepta import strings provenientes del usuario.

Estado inicial: todos los componentes quedan `enabled=False` hasta que su adapter/factory y test real sean cableados. `stabilize_core` es el único `workflow_owner=True`. El código fuente Stabilize se conserva separado bajo `runtime/vendor/stabilize/`; presencia física no equivale a plugin montado.
