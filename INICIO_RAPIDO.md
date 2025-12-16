# 🚀 Inicio Rápido - Despliegue Vanguard Web

## 📋 Información de Conexión

**PuTTY / WinSCP:**
- Host: `72.60.172.101`
- Puerto: `22`
- Usuario: `root`
- Contraseña: (la que tienes)

**Ruta del proyecto:** `/var/www/web/`

---

## ⚡ Comandos Iniciales (Copiar y Pegar en PuTTY)

### 1️⃣ Verificar Puertos Disponibles

```bash
sudo netstat -tulpn | grep LISTEN | grep -E ':(300[0-9]|3010)'
```

**O ver todos los puertos:**

```bash
sudo ss -tulpn | grep LISTEN
```

**Anota qué puerto está libre** (ejemplo: 3000, 3001, 3002, etc.)

---

### 2️⃣ Clonar desde GitHub

```bash
cd /var/www
git clone https://github.com/LiamFranKi/vanguard-web.git web
cd web
```

---

### 3️⃣ Instalar Dependencias

```bash
# Verificar Node.js (debe ser 18+)
node --version

# Si no tienes Node.js o es versión antigua:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar dependencias
npm install
```

---

### 4️⃣ Configurar .env

```bash
nano .env
```

**Pegar esto y guardar (Ctrl+X, Y, Enter):**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=walterlozanoalcalde@gmail.com
SMTP_PASS=ldvkcmqxshxdkupv
NEXT_PUBLIC_SITE_URL=https://www.vanguardschools.com
NODE_ENV=production
```

---

### 5️⃣ Construir la Aplicación

```bash
npm run build
```

---

### 6️⃣ Iniciar con PM2

**Reemplazar `PUERTO` con el que esté libre (ej: 3000, 3001, etc.)**

```bash
# Instalar PM2 si no está
sudo npm install -g pm2

# Iniciar aplicación
PORT=PUERTO pm2 start npm --name "vanguard-web" -- start

# Verificar
pm2 status
pm2 logs vanguard-web --lines 20

# Guardar y configurar auto-inicio
pm2 save
pm2 startup
# (Seguir instrucciones que aparezcan)
```

---

### 7️⃣ Subir Videos con WinSCP

1. Abrir WinSCP
2. Conectar a `72.60.172.101` (usuario root)
3. Ir a: `/var/www/web/public/`
4. Subir: `video-vanguard.mp4` y `mapa-vanguard.mp4`
5. En PuTTY ejecutar:

```bash
cd /var/www/web/public
chmod 644 *.mp4
ls -lh *.mp4
```

---

### 8️⃣ Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

**Buscar o agregar este bloque** (reemplazar `PUERTO` con el que uses):

```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;

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
    }
}
```

**Aplicar:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 9️⃣ Configurar SSL

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com
```

---

### ✅ Verificar

```bash
# Ver PM2
pm2 status

# Ver logs
pm2 logs vanguard-web

# Probar localmente
curl http://localhost:PUERTO
```

**Abrir en navegador:** `https://www.vanguardschools.com`

---

## 📚 Documentación Completa

Ver `COMANDOS_DESPLIEGUE.md` para detalles completos y solución de problemas.

---

## 🔄 Actualizar en el Futuro

```bash
cd /var/www/web
git pull origin main
npm install
npm run build
pm2 restart vanguard-web
```

