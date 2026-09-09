# Plan fábrica · DSL DAG (otro chat: NO inventar)

Ley: 1 ventana = 1 archivo. Tokens Matte/Little/Blanco. Naranja solo Cargar/Descargar.
Original en `01-original`. FROMTED en `02-fromted`. Producto en `03-producto` solo tras OK.

## Cómo ejecutarlo (IA)
1. Leer `PLAN-DAG-DETERMINISTA.json`.
2. Ejecutar nodos en orden F0…F12. Si un nodo falla, STOP.
3. No crear HTML nuevo si el ID ya está en INDEX.json.
4. Cada botón: JS en ese HTML → ABS → kernel.
5. Fábrica ≠ producto.

## Fases
- Fase A (hecho en este commit): 39 HTML + fichas + HOST + ABS + security + connectors + runtime lote-01.
- Fase B: PWA zip + Action validate-39.
- Fase C: Tauri/Capacitor wrappers (repos ya en fábrica).
- Fase D: OK por ID → copiar a 03-producto sin Factory.
- Fase E: conector GitHub/HF/Drive vía kernel nativo.

## 50 mejoras
1. Ribbon XML (Office 2007) como manifiesto de botones, no HTML soldado.
2. FlutterFlow: Page = ventana, Component = botón reutilizable.
3. WeWeb: clases CSS reutilizables FROMTED (hover/focus).
4. Retool: query por botón; UI no conoce SQL/API.
5. Appsmith: JS en acción, Git sync de manifiestos.
6. ToolJet: módulos UI+lógica exportables.
7. Budibase: iframe embed + frame-ancestors.
8. Google Cloud Console: microfrontends por iframe (Big Tech).
9. SDK postMessage tipado (no postMessage crudo).
10. qiankun/wujie: sandbox JS+CSS entre ventanas.
11. ABS fail-closed si no hay handler (ya).
12. BroadcastChannel para tema entre iframes.
13. Tauri deny-default fs.
14. Capacitor Secure Storage / Keychain.
15. FLAG_SECURE / privacy screen en fábrica.
16. AES-256-GCM + PBKDF2 wires (ya en security.js).
17. Secure Enclave firma del kernel.
18. Tree-shake Factory fuera del build producto.
19. PWA Workbox offline del host.
20. PWABuilder → TWA Android.
21. Capacitor+Tauri un web dos marcos.
22. Dexie persistencia de manifiestos.
23. browser-fs-access para Cargar/Descargar local.
24. JSONForms para ficha de botón.
25. Node-RED/n8n solo en fábrica para recetas.
26. Directus/NocoDB backend local SEPARADO.
27. GrapesJS/Puck canvas de fábrica.
28. Fluent Ribbon host.
29. dockview (ya en OSS) paneles split.
30. MaoMao window manager ventanas flotantes.
31. lucide iconos blancos recoloreables.
32. assistant-ui bloques chat (OSS).
33. i18next es/en/fr/pt.
34. XState/DAG determinista (este schema).
35. React Flow mapa de 39 nodos.
36. CSP frame-src self.
37. Integrity hash de cada HTML en INDEX.
38. Canary 10% al unir host.
39. Snapshot visual por ID (5 clicks).
40. Feature flags por ventana.
41. Rate-limit ABS.
42. Audit log cifrado.
43. Offline queue si nube cae.
44. User-picked connector (GitHub/HF/Drive/DB/local/web).
45. Sandbox iframe por nodo (ya RUN).
46. Schema JSON de ficha obligatorio.
47. Host no carga ID sin ficha.
48. 03-producto lock distinto de 02-fromted.
49. GitHub Action valida 39 archivos + hashes.
50. Crazy Wall fábrica: 1 nodo DAG = 1 paso bitácora.
