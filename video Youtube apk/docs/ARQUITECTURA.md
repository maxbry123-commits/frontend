# Arquitectura

Una raíz: video Youtube apk.

- Frontend: React de la sala. Habla con /api/studio y /api/mcp. No llama al router externo.
- Backend: repos cerrados por el motor, bajo backend/. El frontend no los importa en caliente.
- Vídeo de archivo: no se versiona en Git.
- Cola: IndexedDB del navegador. No es Room.
- Android: no hay proyecto Gradle. G04, G05, G07 y G11 quedan BLOCKED.
