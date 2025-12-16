# 🚀 Comandos de Despliegue - Vanguard Web

## 📍 Información del Proyecto
- **Carpeta**: `/var/www/web/`
- **Nombre del proyecto**: `web`
- **Dominio**: `vanguardschools.com` (principal)
- **Servidor**: 72.60.172.101 (Puerto 22 SSH)

---

## 🔍 Paso 1: Verificar Puertos en Uso

Ejecuta estos comandos en PuTTY para ver qué puertos están ocupados:

```bash
# Ver todos los puertos en uso (más común)
sudo netstat -tulpn | grep LISTEN

# O usar ss (más moderno)
sudo ss -tulpn | grep LISTEN

# Ver solo puertos específicos comunes (3000-3010)
sudo netstat -tulpn | grep -E ':(300[0-9]|3010)' | grep LISTEN

# Ver procesos de Node.js corriendo
ps aux | grep node

# Ver procesos de PM2
pm2 list
```

**Interpretación:**
- Busca líneas que muestren `:3000`, `:3001`, `:3002`, etc.
- Si ves `:3000` ocupado, prueba `:3001`, `:3002`, etc.
- Anota qué puerto está libre para usar

---

## 📥 Paso 2: Clonar desde GitHub

```bash
# Ir a la carpeta padre
cd /var/www

# Si la carpeta 'web' ya existe y tiene contenido, hacer backup primero
# (Opcional, solo si hay contenido importante)
mv web web.backup.$(date +%Y%m%d)

# Clonar el repositorio
git clone https://github.com/LiamFranKi/vanguard-web.git web

# Entrar a la carpeta
cd web
```

---

## 📦 Paso 3: Instalar Dependencias

```bash
# Verificar Node.js (debe ser 18+)
node --version

# Si no tienes Node.js o es versión antigua, instalar Node.js 18+
# (Solo si es necesario)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar dependencias del proyecto
npm install
```

---

## ⚙️ Paso 4: Configurar Variables de Entorno

```bash
# Crear archivo .env
nano .env
```

**Pegar este contenido:**

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

**Guardar**: `Ctrl+X`, luego `Y`, luego `Enter`

---

## 🎬 Paso 5: Subir Videos con WinSCP

1. **Abrir WinSCP**
   - **Host Name**: 72.60.172.101
   - **Port**: 22
   - **Connection Type**: SFTP
   - **Login as**: root
   - **Password**: (usar tu contraseña)

2. **Conectarte al VPS**

3. **Navegar a**: `/var/www/web/public/`

4. **Subir estos archivos**:
   - `video-vanguard.mp4`
   - `mapa-vanguard.mp4`

5. **Después de subir, verificar en PuTTY:**

```bash
cd /var/www/web/public
ls -lh *.mp4
chmod 644 video-vanguard.mp4 mapa-vanguard.mp4
```

---

## 🔨 Paso 6: Construir la Aplicación

```bash
# Asegurarse de estar en la carpeta del proyecto
cd /var/www/web

# Construir para producción
npm run build

# Verificar que se creó .next
ls -la .next
```

---

## 🚀 Paso 7: Iniciar con PM2

**IMPORTANTE**: Usar el puerto que esté libre (ejemplo: 3000, 3001, 3002, etc.)

```bash
# Instalar PM2 globalmente (si no está)
sudo npm install -g pm2

# Iniciar la aplicación (CAMBIAR EL PUERTO según lo que esté libre)
# Ejemplo con puerto 3000:
PORT=3000 pm2 start npm --name "vanguard-web" -- start

# O si prefieres especificar en package.json, puedes modificar el script "start"
# Por ahora, PM2 usará el puerto por defecto de Next.js (3000)

# Verificar que está corriendo
pm2 status
pm2 logs vanguard-web --lines 50

# Guardar configuración de PM2
pm2 save

# Configurar para iniciar automáticamente al reiniciar
pm2 startup
# (Seguir las instrucciones que aparezcan)
```

**Si necesitas usar otro puerto**, puedes hacerlo así:

```bash
# Opción 1: Variable de entorno
PORT=3001 pm2 start npm --name "vanguard-web" -- start

# Opción 2: Modificar package.json temporalmente
# Agregar al script "start": "next start -p 3001"
```

---

## 🌐 Paso 8: Configurar Nginx

**IMPORTANTE**: Este es el dominio principal, NO un subdominio.

```bash
# Editar configuración de Nginx
sudo nano /etc/nginx/sites-available/vanguardschools.com
# O si usas default:
sudo nano /etc/nginx/sites-available/default
```

**Configuración para dominio principal** (reemplazar `PUERTO` con el puerto que uses, ej: 3000):

```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;

    # Redirigir HTTP a HTTPS (después de configurar SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:PUERTO;
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

    # Si tienes otros sistemas en subdirectorios, mantener sus configuraciones
    # NO modificar las siguientes líneas si existen:
    # location /intranet { ... }
    # location /otro-sistema { ... }
}
```

**Aplicar configuración:**

```bash
# Verificar sintaxis
sudo nginx -t

# Si hay errores, corregirlos antes de continuar
# Si está OK, recargar Nginx
sudo systemctl reload nginx
```

---

## 🔒 Paso 9: Configurar SSL

```bash
# Instalar Certbot (si no está)
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com

# Seguir las instrucciones interactivas
# Certbot modificará automáticamente Nginx para HTTPS
```

---

## ✅ Paso 10: Verificar Todo

```bash
# 1. Verificar PM2
pm2 status
pm2 logs vanguard-web --lines 20

# 2. Verificar que la app responde localmente
curl http://localhost:PUERTO
# (Reemplazar PUERTO con el que uses)

# 3. Verificar Nginx
sudo systemctl status nginx

# 4. Ver logs de Nginx si hay problemas
sudo tail -f /var/log/nginx/error.log
```

**Probar en navegador:**
- `http://vanguardschools.com` (debería redirigir a HTTPS después de SSL)
- `https://www.vanguardschools.com`

---

## 🔄 Comandos Útiles para Mantenimiento

```bash
# Ver logs en tiempo real
pm2 logs vanguard-web

# Reiniciar aplicación
pm2 restart vanguard-web

# Detener aplicación
pm2 stop vanguard-web

# Ver estado de todos los procesos PM2
pm2 list

# Actualizar código desde GitHub
cd /var/www/web
git pull origin main
npm install  # Solo si hay cambios en package.json
npm run build
pm2 restart vanguard-web
```
```

---

## 🐛 Solución de Problemas

### Ver qué está usando un puerto específico:

```bash
# Ver qué proceso usa el puerto 3000
sudo lsof -i :3000
# o
sudo netstat -tulpn | grep :3000
```

### Si el puerto está ocupado:

```bash
# Ver todos los procesos Node.js
ps aux | grep node

# Ver procesos PM2
pm2 list

# Detener un proceso específico si es necesario
pm2 stop nombre-del-proceso
# o
kill -9 PID_DEL_PROCESO
```

### Verificar permisos:

```bash
# Verificar permisos de la carpeta
ls -la /var/www/web

# Dar permisos si es necesario (cuidado con esto)
sudo chown -R $USER:$USER /var/www/web
```

---

## 📝 Notas Importantes

1. **Puerto**: Usar el que esté libre (3000, 3001, 3002, etc.)
2. **Carpeta**: `/var/www/web/`
3. **Dominio Principal**: `vanguardschools.com` (NO subdominio)
4. **Otros Sistemas**: NO modificar configuraciones existentes de otros sistemas
5. **Videos**: Subir manualmente con WinSCP a `/var/www/web/public/`
6. **Conexión SSH**: Usar PuTTY con Host 72.60.172.101, Puerto 22, usuario root

---

**Listo para empezar!** Ejecuta primero los comandos del Paso 1 para ver qué puertos están libres.


