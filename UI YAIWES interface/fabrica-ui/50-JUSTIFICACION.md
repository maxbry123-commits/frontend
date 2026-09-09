# 50 componentes · nombre + URL + qué aporta a YAIWES

Leyenda: **F1** fábrica (tú) · **F2** producto usuario · **K** kernel · **S** sandbox · **E** empaque.

| # | Nombre | URL | Aporta |
|---|--------|-----|--------|
| 1 | GrapesJS | https://github.com/GrapesJS/grapesjs | Canvas F1: armar página con bloques JSON. No se sirve al usuario. |
| 2 | Puck | https://github.com/measuredco/puck | Editor visual React; registra componentes FROMTED como bloques. |
| 3 | Craft.js | https://github.com/prevwong/craft.js | Toolkit para que el canvas **parezca** FROMTED, no Craft. |
| 4 | Onlook | https://github.com/onlook-dev/onlook | Edita JSX real en F1. Nunca runtime F2. |
| 5 | Penpot | https://github.com/penpot/penpot | Design tokens / componentes UI de diseño. No sustituye skill 01. |
| 6 | JSONForms | https://github.com/eclipsesource/jsonforms | Ficha de cada botón = schema → form de config F1. |
| 7 | RJSF | https://github.com/rjsf-team/react-jsonschema-form | Igual, si el panel es React. |
| 8 | Blockly | https://github.com/RaspberryPiFoundation/blockly | Recetas visuales (lego de workflow) en F1. |
| 9 | Node-RED | https://github.com/node-red/node-red | Wires F1. F2 solo dispara action id. |
| 10 | n8n | https://github.com/n8n-io/n8n | Igual, recetas. No UI de usuario. |
| 11 | Directus | https://github.com/directus/directus | Backend local **separado** (07). No mezclar con ventanas. |
| 12 | NocoDB | https://github.com/nocodb/nocodb | Tablas locales tipo Airtable, lote-BACKEND. |
| 13 | PocketBase | https://github.com/pocketbase/pocketbase | API+auth+SQLite en un binario. Buen kernel local. |
| 14 | Appwrite | https://github.com/appwrite/appwrite | BaaS self-host si hace falta cloud propia. |
| 15 | RxDB | https://github.com/pubkey/rxdb | Sync local-first de manifiestos entre dispositivos. |
| 16 | libsodium.js | https://github.com/jedisct1/libsodium.js | Cifrado wires (además de WebCrypto AES-GCM). |
| 17 | OpenPGP.js | https://github.com/openpgpjs/openpgpjs | Firmar paquetes `03-producto` antes de empaque. |
| 18 | Ory Kratos | https://github.com/ory/kratos | Identidad si hay multi-usuario director. |
| 19 | simple-webauthn | https://github.com/MasterKale/SimpleWebAuthn | Clave fábrica = passkey, no string en git. |
| 20 | single-spa | https://github.com/single-spa/single-spa | Orquestar N ventanas si no usamos iframe. |
| 21 | qiankun | https://github.com/umijs/qiankun | Sandbox JS/CSS entre Legos. |
| 22 | wujie | https://github.com/Tencent/wujie | Iframe fuerte (Big Tech). Aísla Factory. |
| 23 | Shoelace | https://github.com/shoelace-style/shoelace | Web components: botón/select listos, re-tema FROMTED. |
| 24 | Ark UI | https://github.com/chakra-ui/ark | Headless: comportamiento sin su paleta. |
| 25 | Base UI | https://github.com/mui/base-ui | Igual, accesible, sin Material look. |
| 26 | cmdk | https://github.com/dip/cmdk | Paleta comando 0 fricción (añadir ventana). |
| 27 | TanStack Table | https://github.com/TanStack/table | WALL-09 lista archivos grande. |
| 28 | XState | https://github.com/statelyai/xstate | DAG determinista (LOOP S0–S8) ejecutable. |
| 29 | xyflow | https://github.com/xyflow/xyflow | Mapa de 39 nodos + wires visibles. |
| 30 | dockview | https://github.com/mathuo/dockview | Split paneles host (ya en OSS fromted-sources). |
| 31 | lucide | https://github.com/lucide-icons/lucide | 1000 iconos blancos recoloreables Little. |
| 32 | assistant-ui | https://github.com/assistant-ui/assistant-ui | Bloques chat OSS (composer, thread). |
| 33 | i18next | https://github.com/i18next/i18next | es/en/fr/pt. Nada hardcode. |
| 34 | Workbox | https://github.com/GoogleChrome/workbox | PWA offline del HOST. **Ya en fábrica.** |
| 35 | Tauri | https://github.com/tauri-apps/tauri | Linux/Windows/Android/iOS. **Ya en fábrica.** |
| 36 | Capacitor | https://github.com/ionic-team/capacitor | Mismo HTML a tiendas. **Ya.** |
| 37 | PWABuilder | https://github.com/pwa-builder/PWABuilder | Zip web → TWA Android. **Ya.** |
| 38 | Dexie | https://github.com/dexie/Dexie.js | IndexedDB manifiestos. **Ya.** |
| 39 | browser-fs-access | https://github.com/GoogleChromeLabs/browser-fs-access | Cargar/Descargar archivos reales. **Ya.** |
| 40 | SQLCipher | https://github.com/sqlcipher/sqlcipher | DB local cifrada del kernel. |
| 41 | Keycloak | https://github.com/keycloak/keycloak | SSO director si hay equipo. |
| 42 | Casdoor | https://github.com/casdoor/casdoor | SSO más liviano self-host. |
| 43 | Lit | https://github.com/lit/lit | Web components 1 archivo = 1 ventana. |
| 44 | Zag | https://github.com/chakra-ui/zag | Máquinas de estado de select/menu. |
| 45 | Floating UI | https://github.com/floating-ui/floating-ui | Dropdowns anclados (Office ribbon). |
| 46 | Zustand | https://github.com/pmndrs/zustand | Estado host mínimo (no Redux). |
| 47 | Prefect | https://github.com/PrefectHQ/prefect | Orquestar recetas pesadas (opcional nube). |
| 48 | Dagster | https://github.com/dagster-io/dagster | DAG de datos si el wall crece. |
| 49 | Airflow | https://github.com/apache/airflow | Igual, solo si hay batch. Preferir XState in-app. |
| 50 | Luigi | https://github.com/spotify/luigi | Pipelines Spotify-style. Referencia, no runtime. |
