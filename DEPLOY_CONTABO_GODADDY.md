# Despliegue continuo: GitHub → Contabo → GoDaddy

Esta landing es una SPA estatica. Docker compila Vite y Nginx sirve el resultado; Caddy publica la web por HTTPS y renueva el certificado TLS automaticamente. GitHub Actions se conecta al VPS cada vez que se actualiza `main`, descarga los cambios y reconstruye solo lo necesario.

## Antes de empezar

- Un VPS Contabo con Ubuntu 22.04/24.04, IP publica y acceso SSH como usuario con `sudo`.
- El dominio administrado desde GoDaddy.
- El repositorio `mavrictech-dev/Grenco-prototipo3` accesible desde GitHub.

## 1. Preparar el VPS (una sola vez)

Conectate al VPS y actualiza el sistema. Instala Git y Docker siguiendo el metodo oficial de Docker para Ubuntu; al final valida ambos comandos:

```bash
git --version
docker compose version
```

Crea un usuario de despliegue sin usar `root` y permitele administrar Docker:

```bash
sudo adduser deploy
sudo usermod -aG docker deploy
sudo mkdir -p /opt/grenco
sudo chown deploy:deploy /opt/grenco
```

Abre solo los puertos necesarios en el firewall del VPS/Contabo:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

No publiques los puertos del contenedor `app`: solo Caddy expone 80 y 443.

## 2. Permitir que el VPS lea el repositorio

Como usuario `deploy`, crea una clave SSH exclusiva de lectura para GitHub:

```bash
sudo -iu deploy
ssh-keygen -t ed25519 -C "grenco-vps-github" -f ~/.ssh/id_ed25519_github
cat ~/.ssh/id_ed25519_github.pub
```

En GitHub abre el repositorio → **Settings → Deploy keys → Add deploy key**, pega esa clave publica y deja desmarcada la opcion de escritura. Luego crea `~/.ssh/config` con esta entrada:

```sshconfig
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
```

Prueba `ssh -T git@github.com` y clona el proyecto:

```bash
git clone git@github.com:mavrictech-dev/Grenco-prototipo3.git /opt/grenco
cd /opt/grenco
cp .env.production.example .env
nano .env
```

En `.env` define el dominio real sin `https://` ni `www`, y un correo que pueda recibir alertas de certificados:

```dotenv
SITE_DOMAIN=grenco.pe
CADDY_EMAIL=administracion@grenco.pe
```

Si usas Formspree o Web3Forms, agrega tambien sus variables `VITE_*`. Son valores publicos del frontend, no secretos. Inicia por primera vez:

```bash
docker compose up -d --build
docker compose ps
```

## 3. Apuntar el dominio en GoDaddy

En **GoDaddy → Domains → DNS → Manage DNS**, elimina o sustituye los registros web que entren en conflicto y crea:

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| A | `@` | `IP_PUBLICA_DEL_VPS` | 600 o 1 hora |
| CNAME | `www` | `tu-dominio.com` | 600 o 1 hora |

No modifiques los registros MX/TXT existentes si el correo corporativo ya funciona. Espera la propagacion DNS; cuando ambos hostnames resuelvan a la IP del VPS, Caddy emitira el certificado HTTPS. Comprueba `https://tu-dominio` y `https://www.tu-dominio` (el segundo redirige al primero).

## 4. Autorizar a GitHub Actions a entrar al VPS

En tu computadora, crea otra clave diferente, exclusiva para GitHub Actions. Agrega su clave publica a `/home/deploy/.ssh/authorized_keys` en el VPS. Conserva la privada para GitHub.

En el repositorio: **Settings → Secrets and variables → Actions → New repository secret**, crea estos secretos:

| Secreto | Contenido |
|---|---|
| `CONTABO_HOST` | IP publica o hostname del VPS |
| `CONTABO_PORT` | `22` (o tu puerto SSH) |
| `CONTABO_USER` | `deploy` |
| `CONTABO_APP_DIR` | `/opt/grenco` |
| `CONTABO_SSH_PRIVATE_KEY` | clave privada completa de GitHub Actions |
| `CONTABO_SSH_KNOWN_HOSTS` | salida de `ssh-keyscan -H IP_PUBLICA_DEL_VPS` ejecutada desde una red de confianza |

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) ya esta configurado. Haz push de estos archivos a `main`; en la pestaña **Actions** podras ver el primer despliegue. Cada push posterior a `main` ejecuta `git pull --ff-only` y `docker compose up -d --build` en el VPS.

## Operacion y diagnostico

```bash
cd /opt/grenco
docker compose ps
docker compose logs -f --tail=100
docker compose logs -f caddy
```

Si una version falla, vuelve a un commit anterior desde GitHub o ejecuta en el VPS `git log --oneline`, selecciona un commit validado y despliega desde una rama/revision segura. El workflow no usa `git reset --hard`: se detiene si alguien modifico archivos versionados manualmente en el servidor, para evitar perder cambios.

## Checklist de cada lanzamiento

- [ ] La accion de GitHub termina correctamente.
- [ ] `docker compose ps` muestra `app` y `caddy` activos.
- [ ] La portada, videos, formulario y enlaces principales funcionan por HTTPS.
- [ ] `www` redirige al dominio principal y no hay advertencias de certificado.
