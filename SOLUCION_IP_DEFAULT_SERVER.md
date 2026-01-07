# 🔧 Solución: IP redirige a calendar.vanguardschools.com en vez de vanguardschools.com

## 🔍 Problema

Cuando accedes directamente a la IP `72.60.172.101`, te redirige a `https://calendar.vanguardschools.com/` en vez de `vanguardschools.com`.

**Causa:** Nginx está usando el bloque de servidor por defecto (que es `calendar.vanguardschools.com`) cuando no hay un header `Host` específico (como cuando accedes por IP).

---

## ✅ Solución: Configurar vanguardschools.com como servidor por defecto

### Paso 1: Conectarte al VPS

```bash
ssh root@72.60.172.101
```

### Paso 2: Ver la configuración actual

```bash
# Ver todos los archivos de configuración
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Ver el archivo de vanguardschools.com
cat /etc/nginx/sites-available/vanguardschools.com

# Ver el archivo default (si existe)
cat /etc/nginx/sites-available/default
```

### Paso 3: Editar la configuración de vanguardschools.com

```bash
sudo nano /etc/nginx/sites-available/vanguardschools.com
```

### Paso 4: Agregar `default_server` al bloque principal

**Busca el bloque que tiene `listen 80;` y agrega `default_server`:**

**ANTES:**
```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;
    ...
}
```

**DESPUÉS:**
```nginx
server {
    listen 80 default_server;
    server_name vanguardschools.com www.vanguardschools.com;
    ...
}
```

**Si también tienes HTTPS (puerto 443), agrega `default_server` ahí también:**

**ANTES:**
```nginx
server {
    listen 443 ssl http2;
    server_name vanguardschools.com www.vanguardschools.com;
    ...
}
```

**DESPUÉS:**
```nginx
server {
    listen 443 ssl http2 default_server;
    server_name vanguardschools.com www.vanguardschools.com;
    ...
}
```

### Paso 5: Remover `default_server` de otros bloques

Si `calendar.vanguardschools.com` o cualquier otro bloque tiene `default_server`, remuévelo:

```bash
# Buscar otros bloques con default_server
grep -r "default_server" /etc/nginx/sites-available/
```

Si encuentras que `calendar.vanguardschools.com` tiene `default_server`, edítalo:

```bash
sudo nano /etc/nginx/sites-available/calendar.vanguardschools.com
```

Y cambia:
```nginx
listen 80 default_server;
```
Por:
```nginx
listen 80;
```

### Paso 6: Verificar y aplicar

```bash
# Verificar sintaxis
sudo nginx -t

# Si hay errores, corregirlos
# Si está OK, recargar Nginx
sudo systemctl reload nginx
```

### Paso 7: Verificar que funciona

```bash
# Probar desde el servidor
curl http://72.60.172.101

# O desde tu computadora, abrir en navegador:
# http://72.60.172.101
```

Ahora debería mostrar el contenido de `vanguardschools.com` en vez de redirigir a `calendar.vanguardschools.com`.

---

## 📋 Ejemplo de Configuración Completa

Aquí tienes un ejemplo de cómo debería verse tu configuración:

```nginx
# Bloque HTTPS (principal) - CON default_server
server {
    listen 443 ssl http2 default_server;
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

# Bloque HTTP - Redirige a HTTPS - CON default_server
server {
    listen 80 default_server;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    return 301 https://$server_name$request_uri;
}
```

**Nota:** Los otros bloques (como `calendar.vanguardschools.com`) NO deben tener `default_server`.

---

## 🐛 Solución de Problemas

### Error: "nginx: [emerg] a duplicate default server"

**Causa:** Hay múltiples bloques con `default_server`.

**Solución:**
```bash
# Buscar todos los bloques con default_server
grep -r "default_server" /etc/nginx/sites-enabled/

# Remover default_server de todos excepto vanguardschools.com
```

### El problema persiste después de los cambios

**Solución:**
```bash
# Reiniciar Nginx completamente
sudo systemctl restart nginx

# Verificar logs
sudo tail -f /var/log/nginx/error.log
```

### Verificar qué bloque está respondiendo

```bash
# Ver la configuración activa
sudo nginx -T | grep -A 5 "default_server"
```

---

## ✅ Verificación Final

1. **Acceder por IP:** `http://72.60.172.101` → Debe mostrar `vanguardschools.com`
2. **Acceder por dominio:** `https://vanguardschools.com` → Debe funcionar normalmente
3. **Acceder por calendar:** `https://calendar.vanguardschools.com` → Debe funcionar normalmente

---

**Última actualización:** 2024-12-16




