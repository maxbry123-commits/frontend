# NCT Frontend · FRONT v0.1.0

## Estado actual

**Bloque**: MOCK_V0.1 · Shell JARVIS-like 3 columnas
**Vista**: Dark por defecto · Light toggleable via `data-theme="light"` en `<html>`
**Stack**: HTML5 + CSS3 + JavaScript vanilla, sin frameworks

## Estructura

```
frontend/
├── .loops/
│   ├── PLANTILLAS.md      ← DSL de bloques
│   └── BITACORA.md        ← notas de parche
├── src/
│   ├── index.html         ← shell completo v0.1
│   ├── css/styles.css     ← tema dual
│   ├── js/app.js          ← agentes mock + clock
│   └── assets/avatar.svg
├── HISTORIAL.md           ← registro cronológico
├── README.md
└── .gitignore
```

## Vista previa

3 columnas con:
- **Izquierda**: Agentes activos (8) + Contextos abiertos + Terminal IA
- **Centro**: Crazy Wall con debate visual (grafo de 7 nodos) + interacción + progreso
- **Derecha**: Debate en vivo (feed) + Consenso 72% + Artefactos generados

## Próximos bloques

- v0.2.0: MOCK_V0.2 chat pill
- v0.3.0: MOCK_V0.3 lista proyectos
- v0.4.0: MOCK_V0.4 dashboard KPIs
