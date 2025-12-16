# 🚀 Comandos para Ejecutar en PuTTY - Paso a Paso

## ✅ Estado Actual
- **Puerto 3000**: ✅ LIBRE (lo usaremos)
- **Puerto 80/443**: Nginx (ya configurado)
- **Otros puertos Node.js**: 5000-5006 (otros sistemas)

---

## 📥 PASO 1: Clonar desde GitHub

```bash
cd /var/www
git clone https://github.com/LiamFranKi/vanguard-web.git web
cd web
```

---

## 📦 PASO 2: Verificar e Instalar Node.js (si es necesario)

```bash
node --version
```

**Si la versión es menor a 18, instalar Node.js 18:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

---

## 📦 PASO 3: Instalar Dependencias

```bash
npm install
```

*(Esto puede tardar unos minutos)*

---

## ⚙️ PASO 4: Crear archivo .env

```bash
nano .env
```

**Pegar exactamente esto:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=walterlozanoalcalde@gmail.com
SMTP_PASS=ldvkcmqxshxdkupv
NEXT_PUBLIC_SITE_URL=https://www.vanguardschools.com
NODE_ENV=production
```

**Guardar:**
- Presionar `Ctrl+X`
- Presionar `Y`
- Presionar `Enter`

---

## 🔨 PASO 5: Construir la Aplicación

```bash
npm run build
```

*(Esto puede tardar 2-5 minutos)*

**Verificar que se creó correctamente:**

```bash
ls -la .next
```

---

## 🚀 PASO 6: Instalar e Iniciar PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar la aplicación en puerto 3000
PORT=3000 pm2 start npm --name "vanguard-web" -- start

# Verificar que está corriendo
pm2 status

# Ver los primeros logs
pm2 logs vanguard-web --lines 30
```

**Si todo está bien, deberías ver algo como:**
```
┌─────┬──────────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ status  │ restart │ uptime   │
├─────┼──────────────┼─────────┼─────────┼──────────┤
│ 0   │ vanguard-web │ online  │ 0       │ 0s       │
└─────┴──────────────┴─────────┴─────────┴──────────┘
```

**Guardar configuración de PM2:**

```bash
pm2 save

# Configurar para iniciar automáticamente al reiniciar
pm2 startup
```

**IMPORTANTE**: Copiar y ejecutar el comando que te muestre `pm2 startup` (será algo como `sudo env PATH=...`)

---

## 🎬 PASO 7: Subir Videos con WinSCP

**Ahora usa WinSCP:**

1. **Abrir WinSCP**
2. **Conectar a**: `72.60.172.101` (usuario: root)
3. **Navegar a**: `/var/www/web/public/`
4. **Subir estos archivos desde tu PC:**
   - `video-vanguard.mp4`
   - `mapa-vanguard.mp4`

5. **Después de subir, volver a PuTTY y ejecutar:**

```bash
cd /var/www/web/public
ls -lh *.mp4
chmod 644 video-vanguard.mp4 mapa-vanguard.mp4
```

**Deberías ver los archivos listados con sus tamaños.**

---

## 🌐 PASO 8: Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

**Buscar el bloque del servidor para `vanguardschools.com`** (o agregarlo si no existe).

**IMPORTANTE**: Si ya hay configuración para `vanguardschools.com`, **NO borrar nada**, solo agregar o modificar el `location /` para este proyecto.

**Configuración a agregar/modificar:**

```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;

    # Si ya tienes SSL, esta sección puede estar en otro bloque
    # NO modificar otros location blocks si existen (como /intranet, etc.)

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

    # NO modificar otros location blocks si existen
    # Ejemplo: location /intranet { ... } - DEJAR COMO ESTÁ
}
```

**Guardar:**
- `Ctrl+X`
- `Y`
- `Enter`

**Verificar y aplicar:**

```bash
sudo nginx -t
```

**Si dice "syntax is ok", entonces:**

```bash
sudo systemctl reload nginx
```

---

## ✅ PASO 9: Verificar que Todo Funciona

```bash
# 1. Verificar PM2
pm2 status

# 2. Verificar que la app responde localmente
curl http://localhost:3000

# 3. Ver logs en tiempo real (opcional)
pm2 logs vanguard-web
```

**Si `curl` muestra HTML, ¡está funcionando!**

---

## 🔒 PASO 10: Configurar SSL (si aún no está configurado)

**Solo si NO tienes SSL ya configurado:**

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com
```

**Seguir las instrucciones interactivas.**

---

## 🎉 ¡Listo!

**Abrir en navegador:**
- `http://vanguardschools.com` (o `https://` si ya tienes SSL)
- `http://www.vanguardschools.com`

---

## 🐛 Si Hay Problemas

### La app no inicia:

```bash
pm2 logs vanguard-web --lines 50
```

### Nginx da error 502:

```bash
# Verificar que PM2 está corriendo
pm2 status

# Verificar que responde localmente
curl http://localhost:3000

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

### Ver qué está usando el puerto 3000:

```bash
sudo lsof -i :3000
```

---

## 🔄 Para Actualizar en el Futuro

```bash
cd /var/www/web
git pull origin main
npm install
npm run build
pm2 restart vanguard-web
```

---

**¡Sigue estos pasos en orden y avísame si encuentras algún problema!**

