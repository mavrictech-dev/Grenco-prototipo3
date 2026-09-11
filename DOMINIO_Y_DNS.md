# Guía Técnica: Despliegue a Dominio Definitivo, DNS y Correos Corporativos GRENCO

Esta guía describe el procedimiento técnico para migrar la landing page de GRENCO desde el entorno de prototipo hacia el dominio definitivo (`grenco.pe` o `grenco.com`), apuntar las zonas DNS y configurar los correos institucionales de la empresa.

---

## 1. Despliegue de la Landing Page (Hosting)

El proyecto es una SPA optimizada con **Vite + React** que genera un bundle estático ultra ligero en la carpeta `dist/`.

### Comandos de Compilación
```bash
# Instalación limpia
npm install

# Compilación de producción
npm run build
```

* **Directorio de salida:** `dist/`
* **Comando de build:** `npm run build`

### Opciones de Hosting Recomendadas

#### Opción A: Vercel / Netlify / Cloudflare Pages (Recomendado)
1. Conectar el repositorio de GitHub/GitLab.
2. Configuración del proyecto:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. En la sección **Domains**, agregar:
   - `grenco.pe`
   - `www.grenco.pe`

#### Opción B: Hosting Tradicional / cPanel / Apache / Nginx
1. Ejecutar `npm run build` en local o servidor de CI/CD.
2. Subir el contenido de `dist/` a la carpeta raíz `public_html/`.
3. Asegurar la regla de reescritura en `.htaccess` (Apache):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 2. Configuración de Zona DNS (Dominio Definitivo)

En el panel del registrador del dominio (NIC.pe para `.pe` o Namecheap/GoDaddy para `.com`), configurar los siguientes registros en la zona DNS:

### Registros Web (Ejemplo para Vercel / Cloudflare)

| Tipo | Nombre (Host) | Valor / Destino | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (raíz) | `76.76.21.21` *(o la IP del servidor)* | Automático / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` *(o dominio hosting)* | Automático / 3600 |

> **Nota SSL:** Una vez apuntados los DNS, activar el certificado SSL/TLS gratuito para forzar HTTPS (`https://grenco.pe`).

---

## 3. Configuración de Correos Corporativos Institucionales

Para operar con correos oficiales como `contacto@grenco.pe`, `piura@grenco.pe` y `trujillo@grenco.pe`:

### Cuentas Institucionales Recomendadas
* `contacto@grenco.pe` (Recepción general y cotizaciones)
* `piura@grenco.pe` (Operaciones y logística sede Piura)
* `trujillo@grenco.pe` (Operaciones y residencia sede Trujillo)
* `administracion@grenco.pe` (Facturación y contratos)

---

### Proveedor Opción 1: Google Workspace (Gmail Corporativo)

Configurar estos registros en el panel DNS:

| Tipo | Host | Prioridad | Valor |
| :--- | :--- | :--- | :--- |
| **MX** | `@` | 1 | `ASPMX.L.GOOGLE.COM.` |
| **MX** | `@` | 5 | `ALT1.ASPMX.L.GOOGLE.COM.` |
| **MX** | `@` | 5 | `ALT2.ASPMX.L.GOOGLE.COM.` |
| **MX** | `@` | 10 | `ALT3.ASPMX.L.GOOGLE.COM.` |
| **MX** | `@` | 10 | `ALT4.ASPMX.L.GOOGLE.COM.` |

---

### Proveedor Opción 2: Microsoft 365 (Outlook Corporativo)

| Tipo | Host | Prioridad | Valor |
| :--- | :--- | :--- | :--- |
| **MX** | `@` | 0 | `grenco-pe.mail.protection.outlook.com.` |

---

### Proveedor Opción 3: Correo de Hosting Propio (cPanel / Webmail)

| Tipo | Host | Prioridad | Valor |
| :--- | :--- | :--- | :--- |
| **MX** | `@` | 0 | `mail.grenco.pe.` |
| **A** | `mail` | — | *(IP del servidor cPanel)* |

---

## 4. Seguridad y Entregabilidad de Correo (SPF, DKIM y DMARC)

Para garantizar que los correos enviados no caigan en SPAM ni sean rechazados por clientes públicos o privados:

### 1. Registro SPF (Sender Policy Framework)
Crear un registro **TXT** en `@`:
* **Para Google Workspace:**
  ```text
  v=spf1 include:_spf.google.com ~all
  ```
* **Para Microsoft 365:**
  ```text
  v=spf1 include:spf.protection.outlook.com ~all
  ```
* **Para cPanel:**
  ```text
  v=spf1 +a +mx +ip4:[IP_DEL_SERVIDOR] ~all
  ```

### 2. Registro DKIM (DomainKeys Identified Mail)
Generar la clave en la consola del proveedor (Google Admin / Microsoft 365 / cPanel) y agregar el registro **TXT** provisto (ejemplo: `google._domainkey.grenco.pe`).

### 3. Registro DMARC
Crear un registro **TXT** con nombre `_dmarc`:
```text
v=DMARC1; p=quarantine; rua=mailto:seguridad@grenco.pe; pct=100; sp=quarantine
```

---

## 5. Checklist de Verificación Final
- [ ] `npm run build` compila sin advertencias ni errores en local.
- [ ] Dominio `https://grenco.pe` y `https://www.grenco.pe` resuelven con certificado SSL válido.
- [ ] Barra de navegación: `Inicio ➔ Nosotros ➔ Servicios ➔ Maquinaria ➔ Proyectos ➔ Bitácora ➔ Galería`.
- [ ] Videos comprimidos y optimizados cargando en < 2 segundos sin saturar memoria.
- [ ] Botones de redes sociales en Galería y Footer redirigen a las cuentas oficiales.
- [ ] Formulario de contacto apunta a recepción por correo (`contacto@grenco.pe`) y WhatsApp oficial.
