# HANDOFF — WATCHDOG MOTORES CANÓNICOS UI YAIWES

Fecha: 2026-09-10
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP
Repo: maxbry123-commits/frontend
Branch: main

## 1. Regla operativa vigente

Para descargar, extraer, copiar o mover componentes/archivos, el Watchdog LOOP YAIWES sólo puede usar la raíz canónica fijada en el commit:

https://github.com/maxbry123-commits/frontend/tree/ef0669bbc753861bfc33b86548f3f90c0f3d8df9/%E2%9E%A1%EF%B8%8F%F0%9F%93%82motores%20de%20descarga%20extracci%C3%B3n%20copiado%20movimiento%20archivos%20fromtend

ALLOWLIST literal:

1. README/skill canónico
https://github.com/maxbry123-commits/frontend/blob/ef0669bbc753861bfc33b86548f3f90c0f3d8df9/%E2%9E%A1%EF%B8%8F%F0%9F%93%82motores%20de%20descarga%20extracci%C3%B3n%20copiado%20movimiento%20archivos%20fromtend/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20skills%20descargar%20extraer%20zip%20copiar%20mover%20archivos%20readme.md

2. motor_1_extract_only.py
https://github.com/maxbry123-commits/frontend/blob/ef0669bbc753861bfc33b86548f3f90c0f3d8df9/%E2%9E%A1%EF%B8%8F%F0%9F%93%82motores%20de%20descarga%20extracci%C3%B3n%20copiado%20movimiento%20archivos%20fromtend/motor_1_extract_only.py

3. motor_2_queue_download_extract.py
https://github.com/maxbry123-commits/frontend/blob/ef0669bbc753861bfc33b86548f3f90c0f3d8df9/%E2%9E%A1%EF%B8%8F%F0%9F%93%82motores%20de%20descarga%20extracci%C3%B3n%20copiado%20movimiento%20archivos%20fromtend/motor_2_queue_download_extract.py

4. motor_3_copy_batches.py
https://github.com/maxbry123-commits/frontend/blob/ef0669bbc753861bfc33b86548f3f90c0f3d8df9/%E2%9E%A1%EF%B8%8F%F0%9F%93%82motores%20de%20descarga%20extracci%C3%B3n%20copiado%20movimiento%20archivos%20fromtend/motor_3_copy_batches.py

5. motor_4_move_batches.py
https://github.com/maxbry123-commits/frontend/blob/ef0669bbc753861bfc33b86548f3f90c0f3d8df9/%E2%9E%A1%EF%B8%8F%F0%9F%93%82motores%20de%20descarga%20extracci%C3%B3n%20copiado%20movimiento%20archivos%20fromtend/motor_4_move_batches.py

6. motor_copy_root_to_repo.py
https://github.com/maxbry123-commits/frontend/blob/ef0669bbc753861bfc33b86548f3f90c0f3d8df9/%E2%9E%A1%EF%B8%8F%F0%9F%93%82motores%20de%20descarga%20extracci%C3%B3n%20copiado%20movimiento%20archivos%20fromtend/motor_copy_root_to_repo.py

7. hf_download_extract_engine.py
https://github.com/maxbry123-commits/frontend/blob/ef0669bbc753861bfc33b86548f3f90c0f3d8df9/%E2%9E%A1%EF%B8%8F%F0%9F%93%82motores%20de%20descarga%20extracci%C3%B3n%20copiado%20movimiento%20archivos%20fromtend/hf_download_extract_engine.py

Los motores son inmutables/COPY_ONLY. Queda prohibido usar o generar otro downloader, extractor, copier o mover; también Git LFS y force.

## 2. Watchdog actualizado

Nombre: Watchdog LOOP YAIWES — Motores Canónicos
Automation ID: 6aa237226ad48191b4dc2b1eb07c0400
Estado: ENABLED
Cadencia: cada 1 hora
Timezone: America/Bogota

El Watchdog quedó restringido a la allowlist anterior. Puede crear únicamente archivos de cola/configuración/estado soportados por los motores y un workflow mínimo que los invoque, sin reimplementar su lógica.

## 3. Tarea 1 pendiente

Objetivo: resolver los 14 componentes físicamente faltantes de la lista canónica de 124:

1. big-AGI — https://github.com/enricoros/big-AGI
2. Vite — https://github.com/vitejs/vite
3. Vercel AI SDK — https://github.com/vercel/ai
4. TanStack Query — https://github.com/TanStack/query
5. React Virtuoso — https://github.com/petyosi/react-virtuoso
6. shadcn-ui — https://github.com/shadcn-ui/ui
7. XYFlow / React Flow — https://github.com/xyflow/xyflow
8. Lucide — https://github.com/lucide-icons/lucide
9. Uppy — https://github.com/transloadit/uppy
10. Supabase — https://github.com/supabase/supabase
11. DuckDB — https://github.com/duckdb/duckdb
12. workerd — https://github.com/cloudflare/workerd
13. AVF — https://android.googlesource.com/platform/packages/modules/Virtualization/
14. Flutter — https://github.com/flutter/flutter

Flujo autorizado: copiar motores canónicos → cola exacta con URL/ref → descarga+extracción a raíz temporal única → hash/read-back/EXTRACTED_TREE → mover con motor_4_move_batches.py → read-back final 14/14.

Estado al crear este handoff: WATCHDOG actualizado; la ejecución física de los 14 no se declara iniciada ni cerrada en este documento sin run/commit/log de evidencia.

## 4. Tarea 2 pendiente

Sólo después de Tarea 1 = VERIFIED_CLOSED: conectar/cablear/integrar los componentes al runtime/arquitectura YAIWES. Presencia física no equivale a WIRED. Cierre exige evidencia por componente: ruta + SHA/diff + test/log + read-back.

## 5. Evidencia de este cambio

Este mismo archivo es la persistencia/handoff de la actualización del Watchdog. El commit SHA de creación debe usarse como evidencia de cierre del nodo documental.
