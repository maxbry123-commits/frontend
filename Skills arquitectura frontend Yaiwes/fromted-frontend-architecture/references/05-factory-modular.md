---
description: "Internal UI factory. End user never sees it. Add/remove windows and buttons like Office Web 2007-2013."
connections: [06-extract-zips, 08-bibliotecas, 07-nine-html]
---

# Fabrica UI INTERFACE (interna)

Path: `Skills-arquitectura-frontend-Yaiwes/fabrica-ui-interface/componentes/`

## Two functions

1. Builder can create interfaces from segments.
2. Config is **internal only**. The end-user product is a template: add buttons, modules, windows, connections with 0 friction.

## Model (Office 2007 web)

- Ribbon/menu of templates: button, selector, window, chat block.
- Insert/remove without rewriting the whole chat.
- Each piece has inbound/outbound connectors (custom events + `localStorage` keys `FROMTED_*`).
- Rename labels via i18n keys. Change letter color/size. Toggle on/off colors.

## Chat block (first product segment)

- Input window hide/show
- Output window hide/show
- Model selector
- Buttons above and below composer (not inside the textarea)
- Theme matte/little/blanco
- Orange only on Cargar/Descargar

## Forbidden

- Monolithic single HTML as the library
- Mock static panels
- Exposing factory to end users
