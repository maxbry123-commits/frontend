# GUÍA COMPLETA — VPS Oracle + Control Total Grok (solo smartphone)

Fecha: 2026-07-27  
Repo: maxbry123-commits/trabajo-grok  
Estado: Documento vivo — no resumir, no omitir pasos.

---

## 0. SALIDA DE 10 LÍNEAS (obligatoria antes de la guía)

1. Canal principal: self-hosted GitHub Actions runner instalado en el VPS Oracle.
2. Grok no usa SSH; dispara workflows por la API de GitHub (herramienta que sí tiene).
3. El runner ejecuta cualquier comando en el VPS (root/sudo): editar, instalar, programar, docker.
4. Solo tráfico saliente HTTPS del VPS → GitHub; no hace falta abrir puertos.
5. Bootstrap único: cloud-init al crear la instancia en la consola Oracle desde el móvil.
6. Ese cloud-init registra el runner solo; tú no pegas comandos largos.
7. Respaldo 1: segundo runner con otra label en el mismo VPS.
8. Respaldo 2: workflow de autoreparación del runner si cae.
9. Respaldo 3: Oracle Cloud Shell + Console Connection (rescate humano, no operativo diario).
10. Estrategia rápida: crear VPS con cloud-init → runner online → Grok escribe y lanza workflows → control total sin tu terminal.

---

## 1. SISTEMA DE RAZONAMIENTO COMPLETO (pasos que diste)

### 1.1 Auditar inputs × 4 pasadas

**Pasa 1**  
Objetivo exacto: Grok debe tener acceso total al VPS Oracle (shell, archivos, docker, red, paquetes) y poder editar/programar al 100% sin intervención humana después del bootstrap.

**Pasa 2**  
Limitante real de Grok: no tiene SSH persistente hacia IPs arbitrarias del usuario. Sí tiene herramientas conectadas de GitHub (crear archivos, disparar workflow_dispatch, listar runs, leer logs). Por tanto el canal de control debe ser GitHub Actions.

**Pasa 3**  
Fallos históricos Contabo: SSH con password, VNC, reset de clave, teclado móvil que rompe comandos largos, copia/pega defectuoso, IP cambiante, firewall. Cualquier diseño que dependa de pegar comandos largos en terminal móvil está prohibido para operación diaria.

**Pasa 4**  
Restricción de dispositivo: solo smartphone (Android/iPad). Una sola acción humana permitida en bootstrap: crear instancia en consola Oracle y pegar un bloque cloud-init. Después de eso, cero terminal.

### 1.2 6 goals de entrada

1. Acceso total (shell, archivos, docker, red, root/sudo).
2. Cero dependencia de terminal móvil en operación diaria.
3. Comandos y código inmunes a teclado móvil y a fallos de copia/pega.
4. Mínimo 5 rutas de respaldo (ideal 10) para intervención humana si hace falta.
5. Bootstrap en un solo paso desde el teléfono.
6. Verificación automática de que Grok ya tiene control (3 checks).

### 1.3 Refutación + experto × 9

1. SSH directo desde Grok → imposible de forma estable y persistente.
2. HTTP control-plane propio en el VPS → Grok no dispone de cliente HTTP libre hacia IPs arbitrarias del usuario de forma fiable.
3. Solo cloudflared / tunnel → da acceso web o SSH a un humano; no da a Grok capacidad de ejecutar comandos programáticamente.
4. Solo Oracle Instance Connect / Bastion → requiere humano en consola o CLI con clave.
5. Self-hosted GitHub Actions runner en el VPS → sí: Grok escribe YAML, dispara workflow; el runner ejecuta en el VPS con privilegios locales.
6. cloud-init al crear la instancia → elimina la necesidad de pegar comandos de instalación del runner.
7. Oracle Quick Start (oci-github-actions-runner) → alternativa de bootstrap con Resource Manager / Terraform.
8. Múltiples labels de runner + workflow de health-check → resiliencia y autorreparación.
9. SSH / Console Connection / apps móviles → solo como sistema de respaldo humano, nunca como canal operativo de Grok.

### 1.4 Council × 12 (síntesis)

1. El único canal que da a Grok poder real de ejecución en el VPS es un self-hosted runner.
2. SSH queda como rescate humano, no como operación diaria.
3. cloud-init es el puente de mínima fricción desde smartphone.
4. El registration token de GitHub es de un solo uso / corta vida; debe generarse justo antes de crear la instancia.
5. El runner debe instalarse como servicio systemd para sobrevivir reinicios.
6. Labels obligatorias: `self-hosted`, `oracle-vps`, `linux`.
7. Repo de control dedicado (o el repo trabajo-grok) para workflows de ejecución.
8. Workflow genérico `exec` con input de comando libre.
9. Workflow de salud del runner que reporta hostname, uptime, disk, docker.
10. Tres verificaciones antes de declarar “control listo”.
11. Documentar 10 métodos de intervención humana desde teléfono.
12. Prohibir operación diaria por SSH; si se usa SSH es emergencia.

### 1.5 12 goals de salida

1. Bloque cloud-init listo para pegar en Oracle (Ubuntu 22.04/24.04).
2. Runner online en ≤15 minutos tras el boot.
3. Repo de control en GitHub con workflows.
4. Workflow `exec.yml` (comando libre vía workflow_dispatch).
5. Workflow `health.yml` (salud del runner).
6. Label `oracle-vps`.
7. Secrets mínimos (registration token solo en bootstrap).
8. 3 verificaciones automáticas post-boot.
9. Lista de 10 respaldos móviles documentados.
10. Criterio de “control listo” = Grok lanza un job que ejecuta `hostname` y recibe salida.
11. Notas de seguridad (no abrir puerto 22 al mundo si no es necesario).
12. Actualización de bitácora y README en trabajo-grok.

### 1.6 Conclusión operativa

Método elegido: **self-hosted GitHub Actions runner + cloud-init**.  
Estrategia: tú creas el VPS en Oracle con el script; el runner se registra solo; a partir de ahí Grok toma el control por workflows sin que vuelvas a la terminal.

---

## 2. FUENTES DE LA INVESTIGACIÓN (URL completas)

### Capacidades Oracle / acceso
- https://docs.oracle.com/en-us/iaas/oracle-linux/oci/gs-access-instance.htm
- https://docs.oracle.com/iaas/Content/Compute/Tasks/troubleshooting-ssh-connection.htm
- https://docs.oracle.com/iaas/Content/Bastion/Concepts/bastionoverview.htm
- https://docs.oracle.com/iaas/Content/Compute/References/serialconsole.htm
- https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/mobile.htm
- https://tm-apex.hashnode.dev/three-ways-to-connect-to-your-compute-instance
- https://www.ateam-oracle.com/secure-access-using-oci-bastion
- https://ubuntu.com/docs/oracle/oracle-how-to/use-bastion-to-access-VM/

### Self-hosted GitHub Actions runner + cloud-init
- https://github.com/oracle-quickstart/oci-github-actions-runner
- https://runs-on.com/blog/1-how-to-setup-github-hosted-runner-with-a-simple-cloud-init-script/
- https://rdp.sh/en/blog/how-to-set-up-a-self-hosted-github-actions-runner-on-your-vps
- https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners
- https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job
- https://stackoverflow.com/questions/75195474/cloud-init-file-skip-github-registration
- https://stackoverflow.com/questions/74556707/how-to-set-and-use-variables-in-cloud-init
- https://dev.to/sangwoo_rhie/eliminating-ssh-dependencies-migrating-to-self-hosted-github-actions-runners-for-secure-blue-green-m02
- https://medium.com/@subhashchandra.b/terraform-execution-using-github-actions-with-self-hosted-runners-on-oracle-cloud-infrastructure-7bedfc31df20
- https://facsiaginsa.com/devops/self-hosted-github-actions-runner-on-ubuntu

### Túneles / cero puertos
- https://1vps.com/cloudflare-tunnel-vps-guide
- https://community.cloudflare.com/t/cloudflared-tunnel-not-working-in-github-action-runner/639186
- https://github.com/NX1X/cloudflare-tunnel-ssh-action
- https://dev.to/rihdusr/github-actions-to-vps-zero-trust-with-tailscale-2omf

### Clientes SSH / intervención desde teléfono
- https://termai.sh/blog/best-ssh-app-android
- https://termai.sh/blog/best-ssh-client-iphone
- https://termai.sh/blog/best-ssh-client
- https://getmoshi.app/articles/blink-vs-termius
- https://elmlabs.dev/en/blog/best-mobile-ssh-app-2026
- https://hostingviet.vn/cach-ket-noi-vps-tren-dien-thoai
- https://www.zdnet.com/article/my-favorite-ssh-clients-for-android-and-why-you-need-them/

### Experiencia Oracle Free Tier / fallos
- https://community.n8n.io/t/ssh-connection-refused-on-oracle-cloud-free-tier-while-installing-n8n/170406
- https://lucaberton.com/blog/hermes-agent-oracle-cloud-free-tier-deployment/
- https://www.infoq.com/news/2026/07/oracle-cloud-free-tier-limits/

### Docker (para el cloud-init)
- https://docs.docker.com/engine/install/ubuntu/

---

## 3. ARQUITECTURA FINAL

```
Smartphone (tú)
    │
    │  (una sola vez)
    ▼
Oracle Cloud Console (móvil / navegador)
    │  crea instancia + pega cloud-init
    ▼
VPS Oracle (Ubuntu)
    │  cloud-init instala Docker + runner
    │  runner se registra en GitHub
    ▼
GitHub (repo de control)
    │
    │  Grok escribe workflows + dispara workflow_dispatch
    ▼
Self-hosted runner (en el VPS)
    │  ejecuta comandos locales (root/sudo)
    ▼
Control total del VPS (editar, instalar, programar, docker)
```

Canal de operación diaria de Grok = GitHub Actions API.  
Canal de emergencia humana = las 10 opciones de la sección 7.

---

## 4. PREPARACIÓN EN GITHUB (antes de crear el VPS)

### 4.1 Repo de control

Usar el repo existente `trabajo-grok` o crear uno dedicado (ej. `vps-control`).  
En esta guía se usa: `maxbry123-commits/trabajo-grok`.

### 4.2 Generar registration token (caduca en ~1 hora)

1. Abrir en el navegador del teléfono:  
   `https://github.com/maxbry123-commits/trabajo-grok/settings/actions/runners/new`
2. Sistema operativo: Linux  
   Arquitectura: x64 (o ARM64 si eliges Ampere A1)
3. GitHub muestra comandos y un **token** del estilo `XXXXXXXXXXXXXXXXXXXXXXXXXXXX`.
4. Copiar solo el token. No copiar aún los comandos de instalación (los pone el cloud-init).

Nota: el token expira. Generarlo justo antes de crear la instancia.

### 4.3 (Opcional) PAT de larga duración para re-registro automático

Si quieres workflows de autoreparación que re-registren el runner sin token manual:
- Crear PAT clásico con scope `repo` (o fine-grained con Administration: Read and write en el repo).
- Guardarlo como secret del repo: `RUNNER_REGISTRATION_PAT`.

---

## 5. BLOQUE CLOUD-INIT COMPLETO (pegar en Oracle)

### 5.1 Notas previas

- Imagen recomendada: **Ubuntu 22.04** o **Ubuntu 24.04** (x86_64 o aarch64).
- Shape Always Free típica: `VM.Standard.A1.Flex` (Ampere) o `VM.Standard.E2.1.Micro`.
- En el formulario de creación de instancia, sección **Initialization script** / **Cloud-init script** / **User data**, pegar el bloque de abajo.
- Sustituir los tres valores marcados con `CAMBIAR_`.

### 5.2 Script cloud-init (Ubuntu x64)

```yaml
#cloud-config
package_update: true
package_upgrade: true

packages:
  - curl
  - jq
  - git
  - ca-certificates
  - gnupg
  - lsb-release
  - ufw

runcmd:
  # --- Docker ---
  - curl -fsSL https://get.docker.com | sh
  - systemctl enable --now docker

  # --- Usuario del runner ---
  - useradd -m -s /bin/bash gha || true
  - usermod -aG docker gha
  - usermod -aG sudo gha
  - echo "gha ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/gha
  - chmod 440 /etc/sudoers.d/gha

  # --- Instalar runner ---
  - mkdir -p /home/gha/actions-runner
  - chown -R gha:gha /home/gha/actions-runner
  - |
    su - gha -c 'cd /home/gha/actions-runner && \
      curl -o actions-runner-linux-x64-2.323.0.tar.gz -L \
      https://github.com/actions/runner/releases/download/v2.323.0/actions-runner-linux-x64-2.323.0.tar.gz && \
      tar xzf actions-runner-linux-x64-2.323.0.tar.gz'

  # --- Registrar runner (UNATTENDED) ---
  # CAMBIAR_TOKEN = token de la UI de GitHub (Settings → Actions → Runners → New)
  # CAMBIAR_REPO_URL = https://github.com/maxbry123-commits/trabajo-grok
  - |
    su - gha -c 'cd /home/gha/actions-runner && \
      ./config.sh --unattended \
        --url CAMBIAR_REPO_URL \
        --token CAMBIAR_TOKEN \
        --name oracle-vps-1 \
        --labels self-hosted,oracle-vps,linux,x64 \
        --work _work \
        --replace'

  # --- Servicio systemd ---
  - cd /home/gha/actions-runner && ./svc.sh install gha
  - cd /home/gha/actions-runner && ./svc.sh start

  # --- Firewall mínimo (solo salida; SSH opcional) ---
  - ufw default deny incoming
  - ufw default allow outgoing
  - ufw allow 22/tcp || true
  - ufw --force enable

  # --- Marca de bootstrap ---
  - echo "BOOTSTRAP_OK $(date -u +%Y-%m-%dT%H:%M:%SZ)" > /home/gha/BOOTSTRAP_OK
  - chown gha:gha /home/gha/BOOTSTRAP_OK
```

### 5.3 Variante ARM64 (Ampere A1)

Cambiar solo la descarga del runner:

```text
https://github.com/actions/runner/releases/download/v2.323.0/actions-runner-linux-arm64-2.323.0.tar.gz
```

y la label `x64` por `arm64`.

### 5.4 Comandos equivalentes (referencia, NO pegar a mano en móvil)

Estos son los mismos pasos si algún día se instalara a mano (solo para documentación):

```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker

# Usuario
sudo useradd -m -s /bin/bash gha
sudo usermod -aG docker gha
sudo usermod -aG sudo gha
echo "gha ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/gha

# Runner
sudo -u gha -i
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o actions-runner-linux-x64-2.323.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.323.0/actions-runner-linux-x64-2.323.0.tar.gz
tar xzf actions-runner-linux-x64-2.323.0.tar.gz
./config.sh --unattended \
  --url https://github.com/maxbry123-commits/trabajo-grok \
  --token TOKEN_AQUI \
  --name oracle-vps-1 \
  --labels self-hosted,oracle-vps,linux,x64 \
  --work _work \
  --replace
exit

# Servicio
cd /home/gha/actions-runner
sudo ./svc.sh install gha
sudo ./svc.sh start
sudo ./svc.sh status
```

Flag clave: `--unattended` evita prompts interactivos (Enter, nombre, etc.).

---

## 6. PASO A PASO — CREAR EL VPS DESDE EL TELÉFONO

1. Abrir Oracle Cloud Console en el navegador del teléfono (o app Oracle Cloud Infrastructure).
2. Compute → Instances → Create Instance.
3. Nombre: `oracle-vps-1`.
4. Imagen: Ubuntu 22.04 o 24.04.
5. Shape: Always Free disponible (A1 Flex o E2.1 Micro).
6. Networking: VCN por defecto, asignar IP pública.
7. SSH keys: puedes subir una clave pública de rescate (opcional pero recomendado para las 10 vías de emergencia).
8. Advanced / Cloud-init / User data: pegar el bloque de la sección 5.2 con `CAMBIAR_REPO_URL` y `CAMBIAR_TOKEN` sustituidos.
9. Create.
10. Esperar estado RUNNING (2–5 min) + cloud-init (hasta ~10 min más).
11. En GitHub → Settings → Actions → Runners: debe aparecer `oracle-vps-1` en verde (Idle).

Si no aparece en 15 minutos: usar sistema de respaldo de la sección 7 (Cloud Shell o SSH app).

---

## 7. SISTEMA DE RESPALDO — 10 FORMAS DE INTERVENCIÓN HUMANA DESDE TELÉFONO

Usar solo si el runner no registra o se rompe. No son el canal de Grok.

### 7.1 Termius (Android + iOS)
- App: Termius (gratis básico / Pro opcional).
- Añadir host: IP pública del VPS, usuario `ubuntu` o `opc`, autenticación por clave o password.
- Fuente: https://termai.sh/blog/best-ssh-client

### 7.2 Blink Shell (iPhone / iPad)
- App: Blink Shell.
- Mejor experiencia de teclado hardware y Mosh.
- Fuente: https://getmoshi.app/articles/blink-vs-termius

### 7.3 TermAI (Android + iOS)
- App con asistente AI para generar comandos en la sesión SSH.
- Fuente: https://termai.sh/blog/best-ssh-app-android

### 7.4 JuiceSSH (Android)
- Clásico, compra única. En mantenimiento pero usable.
- Fuente: https://www.zdnet.com/article/my-favorite-ssh-clients-for-android-and-why-you-need-them/

### 7.5 ConnectBot (Android, gratis / open source)
- SSH simple sin cuenta.
- Fuente: https://termai.sh/blog/best-free-ssh-client

### 7.6 Termux (Android) + cliente SSH embebido
- Entorno Linux en el teléfono; puedes instalar `openssh` y conectar.
- Fuente: https://termai.sh/blog/best-ssh-app-android

### 7.7 Oracle Cloud Shell (navegador del teléfono)
- En la consola OCI → icono Cloud Shell.
- Desde ahí: `ssh -i clave ubuntu@IP` si subiste la clave, o usar Instance Console Connection.
- Fuente: https://docs.oracle.com/iaas/Content/Compute/References/serialconsole.htm

### 7.8 Oracle Instance Console Connection (Serial)
- Instance → Resources → Console connection → Create → Connect with Cloud Shell.
- Sirve aunque SSH esté roto (rescate de boot, authorized_keys, etc.).
- Fuente: https://docs.oracle.com/iaas/Content/Compute/References/serialconsole.htm

### 7.9 Oracle Mobile App (start/stop/reboot)
- App “Oracle Cloud Infrastructure” (Play Store / App Store).
- Permite arrancar, parar, reiniciar instancias sin SSH.
- Fuente: https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/mobile.htm

### 7.10 Bastion Service + Cloud Shell
- Si la instancia está en subnet privada: crear Bastion session (Managed SSH) y conectar desde Cloud Shell.
- Fuente: https://docs.oracle.com/iaas/Content/Bastion/Concepts/bastionoverview.htm

### Comandos cortos de emergencia (copiar uno a uno, no bloques largos)

```bash
hostname
```

```bash
sudo systemctl status actions.runner.*
```

```bash
sudo -u gha -i
```

```bash
cd ~/actions-runner && ./run.sh
```

```bash
cat /home/gha/BOOTSTRAP_OK
```

```bash
sudo journalctl -u actions.runner.* -n 50
```

---

## 8. WORKFLOWS QUE GROK USARÁ (control total)

### 8.1 health.yml

```yaml
name: VPS Health
on:
  workflow_dispatch:
  schedule:
    - cron: "0 */6 * * *"
jobs:
  health:
    runs-on: [self-hosted, oracle-vps]
    steps:
      - name: Report
        run: |
          echo "HOST=$(hostname)"
          echo "DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
          echo "UPTIME=$(uptime -p)"
          echo "DISK=$(df -h / | tail -1)"
          echo "DOCKER=$(docker --version 2>/dev/null || echo none)"
          test -f /home/gha/BOOTSTRAP_OK && cat /home/gha/BOOTSTRAP_OK
```

### 8.2 exec.yml (comando libre)

```yaml
name: VPS Exec
on:
  workflow_dispatch:
    inputs:
      command:
        description: "Shell command to run on VPS"
        required: true
        type: string
jobs:
  exec:
    runs-on: [self-hosted, oracle-vps]
    steps:
      - name: Run
        run: |
          set -e
          echo "CMD: ${{ inputs.command }}"
          bash -lc "${{ inputs.command }}"
```

### 8.3 Cómo Grok toma control

1. Grok crea/actualiza el workflow en el repo vía API GitHub.
2. Grok dispara `workflow_dispatch` con el input `command`.
3. El runner en el VPS ejecuta el comando.
4. Grok lee el log del run y confirma el resultado.

Ejemplo de verificación de control listo:

- Disparar `exec` con `command: hostname`
- Esperar conclusion `success`
- Leer el log → debe mostrar el hostname del VPS

Tres verificaciones recomendadas:
1. `hostname`
2. `whoami && id`
3. `docker ps && cat /home/gha/BOOTSTRAP_OK`

---

## 9. CRITERIO DE ÉXITO (control listo)

- [ ] Instancia Oracle en estado RUNNING
- [ ] Runner `oracle-vps-1` visible en GitHub → Idle (verde)
- [ ] Workflow `health` o `exec` con `hostname` termina SUCCESS
- [ ] Log muestra hostname real del VPS
- [ ] Archivo `/home/gha/BOOTSTRAP_OK` existe

Cuando los 5 puntos se cumplen: Grok tiene control total. Tú no vuelves a la terminal salvo emergencia (sección 7).

---

## 10. NOTAS DE SEGURIDAD Y OPERACIÓN

- No dejar password SSH; solo clave.
- Preferir no abrir 22/tcp al 0.0.0.0/0; si se abre, restringir a tu IP o usar solo Console Connection.
- El runner tiene poder de root vía sudo NOPASSWD del usuario `gha`. Tratar el repo de control como zona crítica.
- No poner secrets de producción en logs de workflows.
- Registration token de la UI caduca ~1h; no reutilizar tokens viejos.
- Versión del runner en el cloud-init (2.323.0) debe actualizarse cuando GitHub publique releases nuevas: https://github.com/actions/runner/releases
- Free Tier Oracle: vigilar límites Ampere (hubo reducción de 4 OCPU/24GB a 2 OCPU/12GB en cuentas free-only en 2026). Fuente: https://www.infoq.com/news/2026/07/oracle-cloud-free-tier-limits/

---

## 11. CHECKLIST SOLO-MÓVIL (orden exacto)

1. Generar registration token en GitHub (Runners → New).
2. Copiar token + URL del repo.
3. Sustituir en el cloud-init de esta guía.
4. Crear instancia Oracle con ese cloud-init.
5. Esperar runner verde en GitHub.
6. Pedir a Grok: “lanza health en oracle-vps”.
7. Confirmar SUCCESS + hostname en el log.
8. Guardar IP y clave de rescate en un sitio seguro (no en el chat).
9. Instalar al menos una app de la sección 7 (Termius o equivalente).
10. No usar SSH para operación diaria.

---

## 12. QUÉ NO HACER (evitar repetir Contabo)

- No depender de password SSH.
- No depender de VNC.
- No pegar bloques de 20 líneas en terminal móvil como flujo normal.
- No usar main/master de repos ajenos sin pin de commit cuando el flujo sea determinista de código.
- No mezclar esta guía de conectividad con la instalación de agentes (OpenClaw, etc.): son tareas separadas.

---

**Firma:** Grok · 2026-07-27 · Guía completa VPS Oracle + control Grok  
**Siguiente acción humana:** generar token + crear instancia con cloud-init.
