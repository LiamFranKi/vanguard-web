# 🚀 Guía de Despliegue en VPS Hostinger

## ⚠️ IMPORTANTE - ANTES DE EMPEZAR

- **Dominio Principal**: Este proyecto se desplegará en el dominio principal `vanguardschools.com` (NO es un subdominio)
- **Otros Sistemas**: Hay otros sistemas corriendo en el VPS con puertos definidos. **NO modificar** configuraciones de otros sistemas.
- **Puerto**: Este proyecto usará el puerto **3000** (o el que indiques)

---

## 📋 Checklist Pre-Despliegue

- [ ] Confirmar nombre de la carpeta donde se instalará
- [ ] Verificar que el puerto 3000 (o el elegido) no esté en uso
- [ ] Tener acceso SSH al VPS
- [ ] Tener credenciales SMTP configuradas
- [ ] Videos grandes listos para subir directamente (no van en Git)

---

## 📁 Paso 1: Preparar Carpeta en el VPS

**IMPORTANTE**: Confirma el nombre de la carpeta antes de continuar.

```bash
# Ejemplo (cambiar por el nombre real que uses):
cd /var/www
# o
cd /home/usuario/public_html
# o donde corresponda según tu estructura

# Crear carpeta (EJEMPLO - cambiar nombre):
mkdir -p vanguard-web
# o
mkdir -p web-vanguard
# o el nombre que prefieras
cd vanguard-web  # (o el nombre que uses)
```

---

## 📥 Paso 2: Clonar desde GitHub

```bash
# Clonar el repositorio
git clone https://github.com/LiamFranKi/vanguard-web.git .

# O si la carpeta ya existe:
git clone https://github.com/LiamFranKi/vanguard-web.git temp
mv temp/* temp/.* . 2>/dev/null
rmdir temp
```

---

## 📦 Paso 3: Instalar Dependencias

```bash
# Instalar Node.js si no está instalado (verificar versión 18+)
node --version

# Instalar dependencias
npm install

# O si usas yarn:
yarn install
```

---

## ⚙️ Paso 4: Configurar Variables de Entorno

```bash
# Crear archivo .env
nano .env
# o
vim .env
```

**Contenido del `.env`**:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=walterlozanoalcalde@gmail.com
SMTP_PASS=ldvkcmqxshxdkupv

# Site URL
NEXT_PUBLIC_SITE_URL=https://www.vanguardschools.com

# Node Environment
NODE_ENV=production
```

**Guardar y salir** (Ctrl+X, luego Y, luego Enter en nano)

---

## 🎬 Paso 5: Subir Videos Grandes

Los videos NO están en GitHub porque son muy grandes. Subirlos directamente:

```bash
# Opción 1: Usando SCP desde tu máquina local
scp public/video-vanguard.mp4 usuario@tu-vps:/ruta/a/vanguard-web/public/
scp public/mapa-vanguard.mp4 usuario@tu-vps:/ruta/a/vanguard-web/public/

# Opción 2: Usando SFTP o FileZilla
# Subir a: /ruta/a/vanguard-web/public/

# Opción 3: Desde el VPS, descargar desde un servidor temporal
# (si los tienes en otro lugar)
```

**Verificar que los videos estén en:**
- `public/video-vanguard.mp4`
- `public/mapa-vanguard.mp4`

---

## 🔨 Paso 6: Construir la Aplicación

```bash
# Construir para producción
npm run build

# Verificar que se creó la carpeta .next
ls -la .next
```

---

## 🚀 Paso 7: Configurar PM2 (Process Manager)

```bash
# Instalar PM2 globalmente (si no está)
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "vanguard-web" -- start

# O con configuración específica:
pm2 start npm --name "vanguard-web" -- start -- --port 3000

# Guardar configuración
pm2 save

# Configurar para iniciar automáticamente al reiniciar el servidor
pm2 startup
# (Seguir las instrucciones que aparezcan)

# Verificar que está corriendo
pm2 status
pm2 logs vanguard-web
```

---

## 🌐 Paso 8: Configurar Nginx (Dominio Principal)

**IMPORTANTE**: Este es el dominio principal, NO un subdominio.

### Opción A: Si es el ÚNICO sitio en el dominio

```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;

    # Redirigir HTTP a HTTPS (después de configurar SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Opción B: Si hay OTROS sistemas en el mismo dominio

**CUIDADO**: No modificar configuraciones de otros sistemas.

```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;

    # Ruta principal para este proyecto
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Si hay otros sistemas en subdirectorios, mantener sus configuraciones
    # Ejemplo (NO modificar si existen):
    # location /intranet {
    #     proxy_pass http://localhost:PUERTO_OTRO_SISTEMA;
    #     ...
    # }
}
```

**Aplicar configuración:**

```bash
# Verificar sintaxis
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
# o
sudo service nginx reload
```

---

## 🔒 Paso 9: Configurar SSL (Let's Encrypt)

```bash
# Instalar Certbot si no está
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com

# Seguir las instrucciones interactivas
# Certbot modificará automáticamente la configuración de Nginx
```

**Después de SSL, Nginx debería tener algo como:**

```nginx
server {
    listen 443 ssl http2;
    server_name vanguardschools.com www.vanguardschools.com;

    ssl_certificate /etc/letsencrypt/live/vanguardschools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vanguardschools.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        # ... resto de configuración proxy
    }
}

server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;
    return 301 https://$server_name$request_uri;
}
```

---

## ✅ Paso 10: Verificar Funcionamiento

1. **Verificar que PM2 está corriendo:**
   ```bash
   pm2 status
   pm2 logs vanguard-web --lines 50
   ```

2. **Verificar que Nginx está corriendo:**
   ```bash
   sudo systemctl status nginx
   ```

3. **Probar la aplicación:**
   - Abrir en navegador: `https://www.vanguardschools.com`
   - Verificar que carga correctamente
   - Probar formularios
   - Verificar que el chat funciona

4. **Verificar logs si hay problemas:**
   ```bash
   # Logs de PM2
   pm2 logs vanguard-web

   # Logs de Nginx
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

---

## 🔄 Actualizaciones Futuras

```bash
# Entrar a la carpeta del proyecto
cd /ruta/a/vanguard-web

# Obtener últimos cambios
git pull origin main

# Reinstalar dependencias si hay cambios
npm install

# Reconstruir
npm run build

# Reiniciar PM2
pm2 restart vanguard-web
```

---

## 🐛 Solución de Problemas

### La aplicación no inicia

```bash
# Ver logs
pm2 logs vanguard-web

# Verificar puerto
netstat -tulpn | grep 3000
# o
lsof -i :3000

# Si el puerto está ocupado, cambiar en package.json o usar otro puerto
```

### Nginx da error 502

- Verificar que PM2 está corriendo: `pm2 status`
- Verificar que la app responde: `curl http://localhost:3000`
- Verificar logs de Nginx: `sudo tail -f /var/log/nginx/error.log`

### Los videos no se ven

- Verificar que los archivos existen: `ls -lh public/*.mp4`
- Verificar permisos: `chmod 644 public/*.mp4`
- Verificar que las rutas en el código son correctas

### Emails no se envían

- Verificar variables de entorno: `cat .env`
- Probar conexión SMTP
- Verificar logs: `pm2 logs vanguard-web | grep -i email`

---

## 📝 Notas Importantes

1. **Puertos**: Verificar que el puerto 3000 (o el que uses) no esté en conflicto con otros sistemas
2. **Permisos**: Asegurar que Node.js tiene permisos para leer/escribir en la carpeta
3. **Logs**: Los logs se guardan en `logs/` - verificar permisos de escritura
4. **Backups**: Hacer backup de `.env` y `config/` antes de actualizaciones importantes
5. **Otros Sistemas**: NO modificar configuraciones de otros sistemas en Nginx

---

## 📞 Información de Contacto

Si hay problemas durante el despliegue, revisar:
- Logs de PM2: `pm2 logs vanguard-web`
- Logs de Nginx: `/var/log/nginx/error.log`
- Logs de la aplicación: `logs/` en el proyecto

---

**Última actualización**: 2025-01-XX

