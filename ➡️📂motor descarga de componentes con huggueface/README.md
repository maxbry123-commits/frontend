# Motor descarga de componentes con huggueface

Motor determinista para adquirir repositorios GitHub en Hugging Face sin Git LFS y preparar artefactos publicables por GitHub sin superar el límite de blob.

Flujo:

SOURCE_REPO + SOURCE_REF
→ shallow/partial fetch
→ checkout exacto
→ rechazo de punteros Git LFS
→ ZIP determinista
→ fragmentación binaria en partes <= 12 MiB
→ SHA-256 de bundle y partes
→ manifest.json
→ publicación GitHub opcional si GITHUB_TOKEN existe
→ read-back/rehash

Reglas:
- NO LFS.
- No se publica ningún blob >= 95 MiB.
- Tamaño de parte por defecto: 12 MiB.
- La descarga fuente puede superar 100 MiB; el límite se aplica a cada blob que se pretende almacenar en GitHub.
- Las partes usan extensión `.zip.part-XXXX`; NO son ZIP independientes. Para reconstruir: concatenar en orden y validar SHA-256 del bundle antes de extraer.
- Sin credencial GitHub de escritura el motor termina con `WRITE_AUTH_GAP` solo en la fase publish; la adquisición/empaquetado puede validarse aparte.
