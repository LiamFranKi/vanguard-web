# 🌐 Agregar Nuevo Dominio de GoDaddy al VPS de Hostinger

## ✅ Respuesta Rápida

**SÍ, se puede hacer sin conflictos.** Puedes tener múltiples dominios en el mismo VPS, cada uno apuntando a su propia carpeta/aplicación. Nginx maneja esto perfectamente con bloques `server` separados.

---

## 📋 Estructura Actual vs Nueva

**Actual:**
- `vanguardschools.com` → `/var/www/web/` → Puerto `3000` (Next.js)
- Subdominios → Otras carpetas/aplicaciones

**Nueva:**
- `nuevo-dominio.com` (de GoDaddy) → `/var/www/nueva-web/` → Nueva aplicación

**No hay conflicto** porque cada dominio tiene su propio bloque `server` en Nginx.

---

## 🔧 PASO 1: Configurar DNS en GoDaddy

### 1.1 Obtener la IP del VPS

Tu IP del VPS es: `72.60.172.101`

### 1.2 Configurar Registros A en GoDaddy

1. **Inicia sesión en** https://www.godaddy.com
2. **Ve a "Mis Productos"** → Selecciona tu dominio
3. **Ve a "DNS"** o "Administrar DNS"
4. **Agrega estos registros A:**

   **Registro 1: Dominio Raíz**
   - **Tipo:** `A`
   - **Nombre/Host:** `@` (o el dominio sin www)
   - **Valor:** `72.60.172.101`
   - **TTL:** `600` (o el valor por defecto)

   **Registro 2: Subdominio www**
   - **Tipo:** `A`
   - **Nombre/Host:** `www`
   - **Valor:** `72.60.172.101`
   - **TTL:** `600` (o el valor por defecto)

5. **Guarda los cambios**

⏱️ **Tiempo de propagación:** 1-4 horas

---

## 🔧 PASO 2: Crear Carpeta para la Nueva Web

### 2.1 Conectarte al VPS

```bash
ssh root@72.60.172.101
```

### 2.2 Crear la carpeta

```bash
# Crear carpeta para la nueva web
sudo mkdir -p /var/www/nueva-web

# Dar permisos (ajustar según tu usuario)
sudo chown -R $USER:$USER /var/www/nueva-web
# O si usas www-data:
# sudo chown -R www-data:www-data /var/www/nueva-web
```

**Nota:** Reemplaza `nueva-web` con el nombre que prefieras para tu carpeta.

---

## 🔧 PASO 3: Subir/Instalar la Nueva Web

Depende del tipo de aplicación:

### Si es una aplicación Node.js/Next.js:

```bash
cd /var/www/nueva-web
git clone <tu-repositorio> .
npm install
npm run build
```

### Si es PHP:

```bash
# Subir archivos con WinSCP o SCP a /var/www/nueva-web
```

### Si es HTML estático:

```bash
# Subir archivos con WinSCP o SCP a /var/www/nueva-web
```

---

## 🔧 PASO 4: Configurar Nginx para el Nuevo Dominio

### 4.1 Crear archivo de configuración

```bash
sudo nano /etc/nginx/sites-available/nuevo-dominio.com
```

**Reemplaza `nuevo-dominio.com` con tu dominio real de GoDaddy.**

### 4.2 Configuración para Aplicación Node.js/Next.js

Si es una aplicación Node.js que corre en un puerto (ej: 3001):

```nginx
# Bloque HTTPS
server {
    listen 443 ssl http2;
    server_name nuevo-dominio.com www.nuevo-dominio.com;

    # Certificados SSL (se configurarán con Certbot después)
    # ssl_certificate /etc/letsencrypt/live/nuevo-dominio.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/nuevo-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;  # Cambiar al puerto que uses
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Bloque HTTP - Redirige a HTTPS
server {
    listen 80;
    server_name nuevo-dominio.com www.nuevo-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

### 4.3 Configuración para PHP

```nginx
server {
    listen 80;
    server_name nuevo-dominio.com www.nuevo-dominio.com;

    root /var/www/nueva-web;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;  # Ajustar versión PHP
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### 4.4 Configuración para HTML Estático

```nginx
server {
    listen 80;
    server_name nuevo-dominio.com www.nuevo-dominio.com;

    root /var/www/nueva-web;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

### 4.5 Habilitar el sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/nuevo-dominio.com /etc/nginx/sites-enabled/

# Verificar sintaxis
sudo nginx -t

# Si está OK, recargar Nginx
sudo systemctl reload nginx
```

---

## 🔒 PASO 5: Configurar SSL con Let's Encrypt

**Espera a que los DNS se propaguen** (1-4 horas), luego:

```bash
sudo certbot --nginx -d nuevo-dominio.com -d www.nuevo-dominio.com
```

**Reemplaza `nuevo-dominio.com` con tu dominio real.**

Certbot:
- Creará el certificado SSL
- Actualizará automáticamente la configuración de Nginx

---

## ✅ Verificar que Funciona

### Verificar DNS

```bash
# Desde tu computadora
nslookup nuevo-dominio.com
nslookup www.nuevo-dominio.com
```

**Deberían mostrar:** `72.60.172.101`

### Verificar que Nginx responde

```bash
# Desde el servidor
curl -I -H "Host: nuevo-dominio.com" http://localhost
```

### Probar en el navegador

1. Visita: `http://nuevo-dominio.com` (debería redirigir a HTTPS)
2. Visita: `https://nuevo-dominio.com` (debería funcionar con SSL)

---

## 📊 Estructura Final

```
/var/www/
├── web/                    # vanguardschools.com → Puerto 3000
├── nueva-web/             # nuevo-dominio.com → Nueva aplicación
├── calendar/               # calendar.vanguardschools.com
└── ...                     # Otros subdominios
```

**Cada uno tiene su propio bloque `server` en Nginx, sin conflictos.**

---

## 🐛 Solución de Problemas

### Error: "Port already in use"

Si tu nueva aplicación necesita un puerto y está ocupado:

```bash
# Ver qué puertos están en uso
sudo netstat -tulpn | grep LISTEN

# Elegir un puerto libre (ej: 3001, 3002, 4000, etc.)
```

### Error: "Permission denied"

```bash
# Ajustar permisos
sudo chown -R www-data:www-data /var/www/nueva-web
sudo chmod -R 755 /var/www/nueva-web
```

### Los dominios no funcionan

- Verificar que los DNS se propagaron
- Verificar que el archivo está en `sites-enabled`
- Verificar logs: `sudo tail -f /var/log/nginx/error.log`

---

## 📝 Resumen

- ✅ **SÍ se puede** tener múltiples dominios en el mismo VPS
- ✅ **NO hay conflictos** - cada dominio tiene su propio bloque `server`
- ✅ **Configurar DNS en GoDaddy** apuntando a `72.60.172.101`
- ✅ **Crear carpeta** en `/var/www/`
- ✅ **Configurar Nginx** con nuevo bloque `server`
- ✅ **Configurar SSL** con Certbot

---

**Última actualización:** 2024-12-19






