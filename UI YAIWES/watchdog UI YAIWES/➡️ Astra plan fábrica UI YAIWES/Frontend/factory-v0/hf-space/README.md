---
title: YAIWES Factory V0
emoji: 🏭
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# YAIWES Factory V0 — Hugging Face Space bundle

Deployment target for the verified Factory V0 static frontend.

Required payload at Space repo root:
- `index.html`
- `styles.css`
- `src/`
- this `Dockerfile`

Source of truth:
`maxbry123-commits/frontend` → `UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/Frontend/factory-v0/`

This bundle does not embed secrets. The current ChatGPT Hugging Face connection can execute Jobs/read repos but does not expose write/create-Space permission; therefore publishing the Space remains a deployment GAP until write permission is available.
