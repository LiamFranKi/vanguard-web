# Guía de Despliegue - Vanguard Schools Web

## 📋 Configuración en VPS

### Situación Actual

Tienes un VPS con:
- Varios subdominios corriendo en carpetas dentro de la raíz
- Un dominio principal que debe abrir esta página web
- Otros sistemas en subdirectorios

### Opción Recomendada: Dominio Principal

Como este sitio debe ser el **dominio principal** (vanguardschools.com), la configuración es diferente a los subdominios.

## 🚀 Pasos de Despliegue

### 1. Preparar el Proyecto

```bash
# En tu máquina local o servidor de desarrollo
npm run build
```

Esto generará la carpeta `.next` con la aplicación optimizada.

### 2. Subir Archivos al VPS

```bash
# Opción A: Usar SCP
scp -r .next public package.json package-lock.json node_modules tu-usuario@tu-vps:/ruta/destino/

# Opción B: Usar Git (recomendado)
# Clonar el repositorio en el VPS
git clone <tu-repositorio> /var/www/vanguard-web
cd /var/www/vanguard-web
npm install --production
npm run build
```

### 3. Configurar Variables de Entorno

```bash
cd /var/www/vanguard-web
cp env.example .env
nano .env
```

Configurar con tus credenciales reales:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@vanguardschools.edu.pe
SMTP_PASS=tu-contraseña-de-aplicacion-gmail
SMTP_FROM=noreply@vanguardschools.edu.pe
CONTACT_EMAIL=admin@vanguardschools.edu.pe
NEXT_PUBLIC_SITE_URL=https://www.vanguardschools.com
```

### 4. Instalar PM2 (Gestor de Procesos)

```bash
npm install -g pm2
```

### 5. Iniciar la Aplicación con PM2

```bash
cd /var/www/vanguard-web
pm2 start npm --name "vanguard-web" -- start
pm2 save
pm2 startup
```

Esto iniciará la aplicación en el puerto 3000 (o el que Next.js asigne).

### 6. Configurar Nginx

Crear o editar el archivo de configuración de Nginx:

```bash
sudo nano /etc/nginx/sites-available/vanguard-schools
```

**Configuración para Dominio Principal:**

```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;

    # Redirección a HTTPS (después de configurar SSL)
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
        
        # Timeouts para evitar cortes
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache para archivos estáticos
    location /_next/static {
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

Habilitar el sitio:
```bash
sudo ln -s /etc/nginx/sites-available/vanguard-schools /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Configurar SSL con Let's Encrypt

```bash
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com
```

Esto actualizará automáticamente la configuración de Nginx para usar HTTPS.

### 8. Verificar el Despliegue

- Visitar: `https://www.vanguardschools.com`
- Verificar que todas las páginas carguen correctamente
- Probar el formulario de contacto

## 🔄 Actualizaciones Futuras

```bash
cd /var/www/vanguard-web
git pull
npm install
npm run build
pm2 restart vanguard-web
```

## 📁 Estructura en el VPS

```
/var/www/
├── vanguard-web/          # Este proyecto (dominio principal)
│   ├── .next/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── .env
├── sistema-1/             # Otro sistema (subdominio)
├── sistema-2/             # Otro sistema (subdominio)
└── ...
```

## ⚠️ Notas Importantes

1. **Puerto 3000**: Asegúrate de que el puerto 3000 esté disponible. Si no, cambia el puerto en el script de PM2:
   ```bash
   PORT=3001 pm2 start npm --name "vanguard-web" -- start
   ```

2. **Firewall**: Asegúrate de que el puerto 80 y 443 estén abiertos:
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   ```

3. **Logs**: Revisar logs de PM2:
   ```bash
   pm2 logs vanguard-web
   ```

4. **Reinicio Automático**: PM2 se configuró para iniciar automáticamente al reiniciar el servidor.

## 🐛 Solución de Problemas

### La aplicación no inicia
```bash
pm2 logs vanguard-web
# Verificar errores en los logs
```

### Nginx muestra error 502
- Verificar que la aplicación esté corriendo: `pm2 list`
- Verificar que el puerto sea correcto en la configuración de Nginx
- Revisar logs de Nginx: `sudo tail -f /var/log/nginx/error.log`

### Emails no se envían
- Verificar credenciales SMTP en `.env`
- Para Gmail, usar "Contraseña de aplicación" en lugar de la contraseña normal
- Verificar logs de la aplicación para errores de email

## 📞 Soporte

Si encuentras problemas durante el despliegue, revisa:
1. Logs de PM2: `pm2 logs vanguard-web`
2. Logs de Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Variables de entorno: `cat .env`

