# Diagnóstico de Problemas SSL en Subdominios

## 🔍 Problema Identificado

Los errores `NET::ERR_CERT_COMMON_NAME_INVALID` indican que:
- Los certificados SSL no coinciden con los nombres de los subdominios
- Algunos subdominios pueden estar usando certificados incorrectos o expirados
- La configuración de Nginx puede estar apuntando a certificados incorrectos

## 📋 Subdominios Afectados (según las imágenes)

- ❌ estadisticas.vanguardschools.com
- ❌ calendar.vanguardschools.com
- ✅ canchas.vanguardschools.com (funciona)
- ✅ secretaria.vanguardschools.com (funciona)

## 🔧 Soluciones Paso a Paso

### 1. Verificar Certificados SSL Actuales

Conectarse por SSH y ejecutar:

```bash
# Ver certificados instalados
sudo certbot certificates

# Verificar certificados específicos
sudo ls -la /etc/letsencrypt/live/
```

### 2. Verificar Configuración de Nginx

```bash
# Ver todas las configuraciones
sudo ls -la /etc/nginx/sites-available/
sudo ls -la /etc/nginx/sites-enabled/

# Verificar configuración de un subdominio específico
sudo nano /etc/nginx/sites-available/estadisticas.vanguardschools.com
sudo nano /etc/nginx/sites-available/calendar.vanguardschools.com
```

### 3. Problema Común: Certificado para Dominio Principal

Si solo tienes un certificado para `vanguardschools.com` o `www.vanguardschools.com`, necesitas:

**Opción A: Certificado Wildcard (Recomendado)**
```bash
sudo certbot certonly --manual --preferred-challenges dns -d *.vanguardschools.com -d vanguardschools.com
```

**Opción B: Certificados Individuales por Subdominio**
```bash
# Para cada subdominio que falle
sudo certbot --nginx -d estadisticas.vanguardschools.com
sudo certbot --nginx -d calendar.vanguardschools.com
```

### 4. Verificar Configuración Nginx Correcta

Cada subdominio debe tener su propia configuración:

```nginx
server {
    listen 80;
    server_name estadisticas.vanguardschools.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name estadisticas.vanguardschools.com;

    ssl_certificate /etc/letsencrypt/live/estadisticas.vanguardschools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/estadisticas.vanguardschools.com/privkey.pem;

    # ... resto de la configuración
}
```

### 5. Si Usas Certificado Wildcard

```nginx
server {
    listen 443 ssl http2;
    server_name estadisticas.vanguardschools.com;

    ssl_certificate /etc/letsencrypt/live/vanguardschools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vanguardschools.com/privkey.pem;

    # ... resto de la configuración
}
```

## 🚨 Qué Verificar Si Ayer Subiste el Sistema de Canchas

1. **¿Modificaste alguna configuración de Nginx global?**
   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```

2. **¿Agregaste nuevos subdominios que puedan haber afectado otros?**
   ```bash
   sudo grep -r "server_name" /etc/nginx/sites-available/
   ```

3. **¿Renovaste certificados SSL?**
   ```bash
   sudo certbot renew --dry-run
   ```

## 🔄 Solución Rápida Temporal

Si necesitas que funcionen YA mientras solucionas:

1. **Renovar todos los certificados:**
   ```bash
   sudo certbot renew
   ```

2. **Reiniciar Nginx:**
   ```bash
   sudo nginx -t  # Verificar configuración
   sudo systemctl reload nginx
   ```

3. **Verificar que los certificados estén activos:**
   ```bash
   sudo certbot certificates
   ```

## 📝 Comandos de Diagnóstico Completos

```bash
# 1. Ver estado de Nginx
sudo systemctl status nginx

# 2. Ver errores de Nginx
sudo tail -f /var/log/nginx/error.log

# 3. Verificar configuración
sudo nginx -t

# 4. Listar todos los certificados
sudo certbot certificates

# 5. Ver configuraciones activas
sudo ls -la /etc/nginx/sites-enabled/

# 6. Verificar DNS (desde el servidor)
dig estadisticas.vanguardschools.com
dig calendar.vanguardschools.com
```

## ⚠️ Importante

Los mensajes de "vulnerado o hackeado" que ves son **advertencias de seguridad de Chrome** porque los certificados SSL no son válidos. NO significa que tu servidor haya sido hackeado, solo que los certificados no están configurados correctamente.

