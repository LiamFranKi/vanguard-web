# 🌐 Configurar vanguardschools.edu.pe para apuntar al VPS de Hostinger

Esta guía te ayudará a configurar el dominio `vanguardschools.edu.pe` (registrado en punto.pe) para que apunte al mismo VPS donde está alojado `vanguardschools.com`.

---

## 📋 Paso 1: Obtener la IP del VPS de Hostinger

Necesitas la IP pública de tu VPS de Hostinger. Puedes obtenerla de dos formas:

### Opción A: Desde el panel de Hostinger
1. Inicia sesión en tu cuenta de Hostinger
2. Ve a **VPS** → Selecciona tu VPS
3. Busca la sección **"IP Address"** o **"Dirección IP"**
4. Copia la IP (ejemplo: `72.60.172.101`)

### Opción B: Desde el servidor (SSH)
```bash
# Conectarte al VPS
ssh root@TU_IP_VPS

# Ver la IP
curl ifconfig.me
# o
hostname -I
```

**Anota esta IP, la necesitarás en el siguiente paso.**

---

## 🔧 Paso 2: Configurar DNS en punto.pe

El dominio `vanguardschools.edu.pe` está registrado en **punto.pe** y actualmente tiene DNS personalizados (`ns1.zarkiel.com`, `ns2.zarkiel.com`, `ns3.zarkiel.com`).

### Opción A: Usar DNS de Hostinger (Recomendado)

1. **Obtener los nameservers de Hostinger:**
   - Inicia sesión en Hostinger
   - Ve a **Domains** → **Domain portfolio**
   - Selecciona `vanguardschools.com`
   - Busca la sección **"Nameservers"** o **"Servidores DNS"**
   - Anota los nameservers (ejemplo: `ns1.dns-parking.com`, `ns2.dns-parking.com`)

2. **Cambiar nameservers en punto.pe:**
   - Inicia sesión en https://punto.pe
   - Ve a **Dominios** → Selecciona `vanguardschools.edu.pe`
   - Busca la opción **"Cambiar DNS"** o **"Nameservers"**
   - Reemplaza los DNS actuales (`ns1.zarkiel.com`, etc.) con los de Hostinger
   - Guarda los cambios

   ⏱️ **Tiempo de propagación:** 24-48 horas

### Opción B: Configurar registros A directamente (Más rápido)

Si punto.pe te permite editar registros DNS directamente:

1. **Inicia sesión en punto.pe**
2. **Ve a la gestión del dominio `vanguardschools.edu.pe`**
3. **Busca la sección "DNS" o "Zona DNS" o "Administrar DNS"**
4. **Edita o crea estos registros:**

   ```
   Tipo: A
   Nombre: @ (o vanguardschools.edu.pe)
   Valor: [IP_DEL_VPS] (la IP que obtuviste en el Paso 1)
   TTL: 3600 (o el valor por defecto)

   Tipo: A
   Nombre: www
   Valor: [IP_DEL_VPS] (la misma IP)
   TTL: 3600
   ```

5. **Guarda los cambios**

   ⏱️ **Tiempo de propagación:** 1-4 horas

---

## 🖥️ Paso 3: Actualizar Nginx en el VPS

Ahora necesitas configurar Nginx para que acepte también el dominio `.edu.pe`.

### 3.1 Conectarte al VPS

```bash
ssh root@TU_IP_VPS
```

### 3.2 Ver la configuración actual de Nginx

```bash
# Ver qué archivo de configuración está en uso
ls -la /etc/nginx/sites-enabled/

# Ver el contenido del archivo de configuración
cat /etc/nginx/sites-available/vanguardschools.com
# o si usa default:
cat /etc/nginx/sites-available/default
```

### 3.3 Editar la configuración de Nginx

```bash
sudo nano /etc/nginx/sites-available/vanguardschools.com
# o si usa default:
sudo nano /etc/nginx/sites-available/default
```

### 3.4 Actualizar el server_name

**Busca la línea que dice:**
```nginx
server_name vanguardschools.com www.vanguardschools.com;
```

**Cámbiala por:**
```nginx
server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
```

**Si tienes configuración SSL (HTTPS), también actualiza el bloque SSL:**

Busca:
```nginx
server {
    listen 443 ssl http2;
    server_name vanguardschools.com www.vanguardschools.com;
    ...
}
```

Cámbialo por:
```nginx
server {
    listen 443 ssl http2;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    ...
}
```

**Ejemplo de configuración completa (HTTP y HTTPS):**

```nginx
# Bloque para HTTPS (si ya tienes SSL)
server {
    listen 443 ssl http2;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;

    ssl_certificate /etc/letsencrypt/live/vanguardschools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vanguardschools.com/privkey.pem;

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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Bloque para redirigir HTTP a HTTPS
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    return 301 https://$server_name$request_uri;
}
```

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

### 3.5 Verificar y aplicar cambios

```bash
# Verificar que la sintaxis es correcta
sudo nginx -t

# Si todo está OK, recargar Nginx
sudo systemctl reload nginx
```

---

## 🔒 Paso 4: Configurar SSL para el dominio .edu.pe

Para que el dominio `.edu.pe` tenga HTTPS, necesitas agregarlo al certificado SSL existente.

### 4.1 Verificar Certbot instalado

```bash
which certbot
# Si no está instalado:
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y
```

### 4.2 Agregar el dominio al certificado SSL

```bash
# Agregar el dominio .edu.pe al certificado existente
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com -d vanguardschools.edu.pe -d www.vanguardschools.edu.pe
```

**Nota:** Si ya tienes un certificado para `.com`, Certbot lo expandirá automáticamente para incluir también `.edu.pe`.

### 4.3 Verificar renovación automática

```bash
# Verificar que el certificado se renovará automáticamente
sudo certbot renew --dry-run
```

---

## ✅ Paso 5: Verificar que todo funciona

### 5.1 Verificar DNS (desde tu computadora)

```bash
# En Windows PowerShell o CMD:
nslookup vanguardschools.edu.pe

# Debería mostrar la IP de tu VPS
```

O usa herramientas online:
- https://www.whatsmydns.net/#A/vanguardschools.edu.pe
- https://dnschecker.org/#A/vanguardschools.edu.pe

### 5.2 Verificar desde el servidor

```bash
# Probar que Nginx responde correctamente
curl -H "Host: vanguardschools.edu.pe" http://localhost

# Verificar logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 5.3 Probar en el navegador

1. Abre una ventana de incógnito
2. Visita: `http://vanguardschools.edu.pe` (debería redirigir a HTTPS)
3. Visita: `https://vanguardschools.edu.pe`
4. Verifica que carga el mismo sitio que `vanguardschools.com`

---

## 🔄 Paso 6: Actualizar Next.js (Opcional)

Si quieres que Next.js sepa que también debe responder a este dominio, puedes actualizar el `metadataBase` en `app/layout.tsx`:

```typescript
metadataBase: new URL('https://www.vanguardschools.com'),
```

Esto es opcional, ya que Nginx maneja ambos dominios y Next.js no necesita saberlo.

---

## 🐛 Solución de Problemas

### Problema: El dominio no resuelve a la IP correcta

**Solución:**
- Verifica que los DNS se hayan propagado: https://dnschecker.org
- Espera 24-48 horas si cambiaste nameservers
- Verifica que los registros A estén correctos en punto.pe

### Problema: Nginx da error 502 Bad Gateway

**Solución:**
```bash
# Verificar que la app Next.js está corriendo
pm2 status

# Si no está corriendo:
cd /var/www/web
pm2 restart vanguard-web

# Ver logs
pm2 logs vanguard-web
```

### Problema: SSL no funciona para .edu.pe

**Solución:**
```bash
# Verificar que el certificado incluye el dominio
sudo certbot certificates

# Si no está incluido, ejecutar:
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com -d vanguardschools.edu.pe -d www.vanguardschools.edu.pe --expand
```

### Problema: El sitio carga pero muestra contenido de Wix

**Solución:**
- Limpia la caché del navegador (Ctrl+Shift+Delete)
- Espera a que los DNS se propaguen completamente
- Verifica que los DNS en punto.pe apuntan a la IP del VPS, no a Wix

---

## 📝 Resumen de Pasos

1. ✅ Obtener IP del VPS de Hostinger
2. ✅ Configurar DNS en punto.pe (registros A o nameservers)
3. ✅ Actualizar Nginx para aceptar `.edu.pe`
4. ✅ Configurar SSL para `.edu.pe`
5. ✅ Verificar que todo funciona

---

## ⏱️ Tiempos Estimados

- **Configuración DNS:** 5-10 minutos
- **Propagación DNS:** 1-48 horas (depende del método)
- **Configuración Nginx:** 5 minutos
- **Configuración SSL:** 5 minutos
- **Total:** ~15 minutos de trabajo + tiempo de propagación

---

## 📞 Notas Importantes

- ⚠️ **No elimines la configuración de Wix hasta verificar que el nuevo dominio funciona**
- ⚠️ **Los cambios de DNS pueden tardar hasta 48 horas en propagarse globalmente**
- ✅ **Ambos dominios (.com y .edu.pe) mostrarán el mismo contenido**
- ✅ **El certificado SSL cubrirá ambos dominios**

---

**Última actualización:** 2024-12-16






