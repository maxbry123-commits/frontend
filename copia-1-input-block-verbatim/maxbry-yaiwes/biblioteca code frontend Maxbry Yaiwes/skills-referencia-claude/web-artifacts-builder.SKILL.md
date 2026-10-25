---
name: web-artifacts-builder
description: Suite of tools for creating elaborate multi-component HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.
license: Complete terms in LICENSE.txt
---

# Web Artifacts Builder

To build frontend artifacts:
1. Initialize the frontend repo using scripts/init-artifact.sh
2. Develop by editing generated code
3. Bundle into a single HTML file using scripts/bundle-artifact.sh
4. Display artifact to user
5. Optional test

Stack: React 18 + TypeScript + Vite + Parcel + Tailwind CSS + shadcn/ui

Scripts live in the official OSS zip (not copied here):
https://github.com/anthropics/skills/archive/refs/heads/main.zip

Design note: avoid purple gradients, Inter, uniform rounded cards. FROMTED tokens still win for YAIWES chrome.
