# Vendor code — code-only copies

Esta raíz contiene únicamente subárboles de código fuente seleccionados desde `UI YAIWES/componentes open soure UI YAIWES/` para adaptación/cableado. No se copian `.github`, changelogs, docs, ejemplos, release automation ni tests upstream al hot path. Licencia, URL y SHA permanecen trazados en el repositorio fuente y en la bitácora.

Regla: presencia en `vendor/` ≠ integrado. Cada componente requiere PluginSpec → adapter/factory → registry → mount guard → test → evidence.
