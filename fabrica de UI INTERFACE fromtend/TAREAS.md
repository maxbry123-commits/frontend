# Tareas vivas — fábrica UI FROMTED

Estado 2026-09-08.

Hecho:
- Raíz `fabrica de UI INTERFACE fromtend/` en main
- Destino `componentes para fabrica de interface/`
- Catálogo inicial 28 + ampliación
- Kernel lote-01 (slots, bus, manifiesto, clave)
- Tokens lote-02 FROMTED
- Advertencia dos funciones

NO hecho:
- Slots reales en p01-p10 extraídos 1:1
- Host que carga 1 ventana = 1 archivo (sin fundir)
- Panel fábrica separado del runtime (oculto sin clave)
- Copiar guías + bridges a lote-BACKEND
- Extraer Puck o GrapesJS (espera ZIP subido por el Director)
- Sandbox JS/Python cableado
- Skill markdown final

Orden bloqueado:
1. Subes ZIP al destino (Puck o GrapesJS + Node-RED + JSONForms + Pyodide)
2. Se parte 1 función = 1 archivo, solo restyle FROMTED
3. Se publican slots en ventanas reales
4. Se cablea lote-01 + lote-02 al host runtime
5. Fábrica F1 queda en ruta /fabrica, no en /
6. Backend y sandbox al final, no al principio
7. Retoque visual DESPUÉS del cableado, no antes
