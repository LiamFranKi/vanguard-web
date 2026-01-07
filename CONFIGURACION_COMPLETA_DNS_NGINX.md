# 🌐 Configuración Completa: DNS y Nginx para vanguardschools.com y vanguardschools.edu.pe

## 📋 Estructura Actual del VPS

- **Aplicación Principal (Next.js):** `/var/www/web/` → Puerto `3000` → `vanguardschools.com`
- **Subdominios:** Otras carpetas/aplicaciones (calendar, intranet, secretaria, etc.)
- **IP del VPS:** `72.60.172.101`

**Objetivo:** Configurar `vanguardschools.edu.pe` para que apunte a la misma aplicación que `vanguardschools.com`

---

## 🔧 PARTE 1: Configurar DNS en Hostinger

### ✅ Paso 1.1: Verificar Registro A para Dominio Raíz

**¡Ya está configurado!** ✅

En el panel de Hostinger ya tienes:
- ✅ Registro A: `@` → `72.60.172.101` (dominio raíz)
- ✅ Registro A: `www` → `72.60.172.101` (subdominio www)

**No necesitas hacer nada más en Hostinger para el dominio `.com`.**

**Los registros CAA que ves también están bien** (son para autorizar certificados SSL).

---

## 🔧 PARTE 2: Configurar DNS en punto.pe para vanguardschools.edu.pe

### Paso 2.1: Cambiar a DNS de la RCP

1. **Inicia sesión en** https://punto.pe
2. **Ve a Dominios** → Selecciona `vanguardschools.edu.pe`
3. **En la sección DNS, haz clic en "Usar DNS de la RCP"** (el enlace rojo)

### Paso 2.2: Crear Registros A

Después de cambiar a DNS de la RCP, crea estos registros:

**Registro 1:**
- **Tipo:** `A`
- **Nombre:** `@` (o `vanguardschools.edu.pe`)
- **Valor/IP:** `72.60.172.101`
- **TTL:** `3600`

**Registro 2:**
- **Tipo:** `A`
- **Nombre:** `www`
- **Valor/IP:** `72.60.172.101`
- **TTL:** `3600`

3. **Guarda los cambios**

⏱️ **Tiempo de propagación:** 1-4 horas

---

## 🖥️ PARTE 3: Configurar Nginx en el VPS

### Paso 3.1: Conectarte al VPS

```bash
ssh root@72.60.172.101
```

### Paso 3.2: Ver la configuración actual

```bash
# Ver qué archivos de configuración existen
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Ver la configuración de vanguardschools.com
cat /etc/nginx/sites-available/vanguardschools.com

# O si usa default:
cat /etc/nginx/sites-available/default
```

### Paso 3.3: Editar la configuración de vanguardschools.com

```bash
sudo nano /etc/nginx/sites-available/vanguardschools.com
```

### Paso 3.4: Configuración Completa para HTTP y HTTPS

**Reemplaza o actualiza la configuración con esto:**

```nginx
# ============================================
# BLOQUE HTTPS (Puerto 443) - PRINCIPAL
# ============================================
server {
    listen 443 ssl http2 default_server;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;

    # Certificados SSL (ajustar rutas si son diferentes)
    ssl_certificate /etc/letsencrypt/live/vanguardschools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vanguardschools.com/privkey.pem;

    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;

    # Proxy a la aplicación Next.js en /var/www/web
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

# ============================================
# BLOQUE HTTP (Puerto 80) - Redirige a HTTPS
# ============================================
server {
    listen 80 default_server;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    
    # Redirigir todo el tráfico HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}
```

**Puntos importantes:**
- ✅ `default_server` en ambos bloques (80 y 443) → Esto hace que la IP `72.60.172.101` apunte a esta aplicación
- ✅ Agregar `vanguardschools.edu.pe` y `www.vanguardschools.edu.pe` al `server_name`
- ✅ `proxy_pass http://localhost:3000` → Apunta a la aplicación Next.js en `/var/www/web`

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

### Paso 3.5: Verificar que otros subdominios NO tienen default_server

```bash
# Buscar otros bloques con default_server
grep -r "default_server" /etc/nginx/sites-available/
```

**Si encuentras que `calendar.vanguardschools.com` u otro subdominio tiene `default_server`, remuévelo:**

```bash
# Editar el archivo del subdominio
sudo nano /etc/nginx/sites-available/calendar.vanguardschools.com
```

**Cambiar:**
```nginx
listen 80 default_server;
```
**Por:**
```nginx
listen 80;
```

**Y si tiene HTTPS:**
```nginx
listen 443 ssl http2 default_server;
```
**Por:**
```nginx
listen 443 ssl http2;
```

### Paso 3.6: Verificar sintaxis y aplicar

```bash
# Verificar que la sintaxis es correcta
sudo nginx -t

# Si hay errores, corregirlos antes de continuar
# Si está OK, recargar Nginx
sudo systemctl reload nginx

# O si reload no funciona:
sudo systemctl restart nginx
```

---

## 🔒 PARTE 4: Configurar SSL para vanguardschools.edu.pe

### Paso 4.1: Agregar el dominio al certificado SSL

```bash
# Agregar vanguardschools.edu.pe al certificado SSL existente
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com -d vanguardschools.edu.pe -d www.vanguardschools.edu.pe
```

**Certbot:**
- Expandirá el certificado existente para incluir `.edu.pe`
- Actualizará automáticamente la configuración de Nginx

### Paso 4.2: Verificar el certificado

```bash
# Ver certificados instalados
sudo certbot certificates

# Verificar que incluye ambos dominios
```

---

## ✅ PARTE 5: Verificar que Todo Funciona

### Paso 5.1: Verificar DNS (desde tu computadora)

**Windows PowerShell:**
```powershell
nslookup vanguardschools.com
nslookup www.vanguardschools.com
nslookup vanguardschools.edu.pe
nslookup www.vanguardschools.edu.pe
```

**Todos deberían mostrar:** `72.60.172.101`

**O usa herramientas online:**
- https://www.whatsmydns.net/#A/vanguardschools.com
- https://dnschecker.org/#A/vanguardschools.edu.pe

### Paso 5.2: Verificar desde el servidor

```bash
# Verificar que la app Next.js está corriendo
pm2 status

# Ver logs
pm2 logs vanguard-web --lines 20

# Probar localmente
curl http://localhost:3000

# Probar con diferentes hosts
curl -H "Host: vanguardschools.com" http://localhost
curl -H "Host: vanguardschools.edu.pe" http://localhost
```

### Paso 5.3: Probar en el navegador

1. **Acceder por IP:** `http://72.60.172.101` 
   - ✅ Debe mostrar `vanguardschools.com` (no calendar)
   - ✅ Debe redirigir a HTTPS

2. **Acceder por .com:** `https://vanguardschools.com`
   - ✅ Debe funcionar normalmente

3. **Acceder por .edu.pe:** `https://vanguardschools.edu.pe`
   - ✅ Debe mostrar el mismo contenido que `.com`

4. **Acceder por www:** `https://www.vanguardschools.com` y `https://www.vanguardschools.edu.pe`
   - ✅ Deben funcionar

5. **Verificar subdominios:** `https://calendar.vanguardschools.com`
   - ✅ Debe seguir funcionando normalmente (no debe verse afectado)

---

## 📊 Resumen de Cambios

### ✅ En Hostinger:
- [x] ~~Agregar registro A: `@` → `72.60.172.101`~~ **✅ YA ESTÁ CONFIGURADO**

### ✅ En punto.pe:
- [ ] Cambiar a "Usar DNS de la RCP"
- [ ] Crear registro A: `@` → `72.60.172.101`
- [ ] Crear registro A: `www` → `72.60.172.101`

### ✅ En el VPS (Nginx):
- [ ] Agregar `default_server` a los bloques de `vanguardschools.com`
- [ ] Agregar `vanguardschools.edu.pe` y `www.vanguardschools.edu.pe` al `server_name`
- [ ] Remover `default_server` de otros bloques (calendar, etc.)
- [ ] Verificar que `proxy_pass` apunta a `http://localhost:3000`

### ✅ En el VPS (SSL):
- [ ] Agregar `.edu.pe` al certificado SSL con Certbot

---

## 🐛 Solución de Problemas

### Problema: El dominio .com no funciona sin www

**Causa:** Falta el registro A para `@` en Hostinger.

**Solución:** Agregar el registro A para `@` como se indica en la Parte 1.

### Problema: La IP sigue redirigiendo a calendar

**Causa:** 
- Nginx no tiene `default_server` configurado correctamente
- O `calendar.vanguardschools.com` todavía tiene `default_server`

**Solución:**
```bash
# Verificar qué bloques tienen default_server
grep -r "default_server" /etc/nginx/sites-enabled/

# Asegurarse de que solo vanguardschools.com tiene default_server
# Remover default_server de otros bloques
sudo systemctl restart nginx
```

### Problema: El dominio .edu.pe no resuelve

**Causa:** Los DNS no se han propagado o están mal configurados.

**Solución:**
- Verificar que los registros A estén correctos en punto.pe
- Esperar 1-4 horas para propagación
- Verificar con: https://dnschecker.org/#A/vanguardschools.edu.pe

### Problema: Error 502 Bad Gateway

**Causa:** La aplicación Next.js no está corriendo.

**Solución:**
```bash
# Verificar PM2
pm2 status

# Si no está corriendo:
cd /var/www/web
pm2 restart vanguard-web

# Ver logs
pm2 logs vanguard-web
```

### Problema: SSL no funciona para .edu.pe

**Causa:** El certificado no incluye el dominio.

**Solución:**
```bash
# Verificar certificados
sudo certbot certificates

# Si no está incluido, ejecutar:
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com -d vanguardschools.edu.pe -d www.vanguardschools.edu.pe --expand
```

---

## ⏱️ Tiempos de Propagación

- **Hostinger:** Inmediato o pocos minutos
- **punto.pe (DNS de RCP):** 1-4 horas
- **punto.pe (si cambias nameservers):** 24-48 horas

**Recomendación:** Esperar 2-4 horas después de configurar DNS antes de verificar.

---

## 📝 Notas Importantes

- ⚠️ **NO eliminar configuraciones de otros subdominios** (calendar, intranet, etc.)
- ⚠️ **Solo agregar `default_server` a `vanguardschools.com`**
- ✅ **Ambos dominios (.com y .edu.pe) mostrarán el mismo contenido** (la app en `/var/www/web`)
- ✅ **Los subdominios seguirán funcionando normalmente**

---

**Última actualización:** 2024-12-16

