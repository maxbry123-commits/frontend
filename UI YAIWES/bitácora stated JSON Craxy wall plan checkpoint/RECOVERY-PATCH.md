# RECOVERY PATCH — UIYAIWES-PLUGIN-INTEGRATION-0007

## PRELUDE fijo
- INPUT literal: centralizar componentes, copiar solo código útil, no monolítico, plugin universal, registrar cambios.
- Component root: `UI YAIWES/componentes open soure UI YAIWES/`.
- Component tree SHA: `4318b69193b6ba0dedda81e601e174fefa3c5cf7`.
- Wordflow runtime: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/runtime/`.

## Estado recuperable
P01A cerrado: no hay componentes sueltos visibles en la raíz; 14 repos están centralizados. `_adquisicion` no es código de componente.
P01B activo: revisar código 1×1 y montar plugin universal mínimo.

## GAP actual
`runtime/plugin-manifest.yaml` declara entrypoint/capas que no están materializadas en los directorios read-back. No declarar wiring.

## Estrategia de recuperación
1. Leer este checkpoint y STATE.
2. Revalidar tree SHA del component root.
3. Revisar el código fuente del siguiente componente.
4. Aplicar un delta pequeño en módulo/plugin propio; nunca reescribir arquitectura completa.
5. Ejecutar/verificar tests disponibles; si no hay ejecución real, marcar `CLOSED_UNVERIFIED`/`INCONCLUSIVE` según evidencia.
6. Persistir diff/SHA/test y continuar al siguiente componente solo si el gate pasa.

Rollback: historial GitHub por commit.