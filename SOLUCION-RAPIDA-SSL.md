# 🔧 Solución Rápida SSL - Subdominios Vanguard Schools

## 🚨 Problema

Los errores `NET::ERR_CERT_COMMON_NAME_INVALID` indican que los certificados SSL no coinciden con los nombres de los subdominios. **NO es un hack**, solo un problema de configuración SSL.

## ⚡ Solución Rápida (5 minutos)

### Paso 1: Conectarte por SSH al VPS

```bash
ssh tu-usuario@tu-vps-ip
```

### Paso 2: Verificar qué certificados tienes

```bash
sudo certbot certificates
```

Esto te mostrará todos los certificados instalados y sus fechas de expiración.

### Paso 3: Renovar certificados existentes

```bash
# Renovar todos los certificados
sudo certbot renew

# Verificar configuración de Nginx
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### Paso 4: Si algunos subdominios siguen fallando

Necesitas crear certificados específicos para esos subdominios:

```bash
# Para estadisticas
sudo certbot --nginx -d estadisticas.vanguardschools.com

# Para calendar
sudo certbot --nginx -d calendar.vanguardschools.com

# Recargar Nginx después de cada uno
sudo systemctl reload nginx
```

## 🎯 Solución Definitiva: Certificado Wildcard

Si tienes muchos subdominios, es mejor usar un certificado **wildcard** que cubra todos:

### Opción A: Certificado Wildcard con DNS Challenge

```bash
sudo certbot certonly --manual --preferred-challenges dns \
  -d *.vanguardschools.com -d vanguardschools.com
```

**Importante:** Certbot te pedirá que agregues un registro TXT en tu DNS. Debes:
1. Ir a Hostinger DNS
2. Agregar el registro TXT que te indique
3. Esperar unos minutos
4. Presionar Enter en la terminal

### Opción B: Certificado Wildcard Automático (si tu proveedor DNS lo soporta)

```bash
# Instalar plugin de DNS (ejemplo para Cloudflare)
sudo apt-get install python3-certbot-dns-cloudflare

# Configurar con tus credenciales DNS
sudo certbot certonly --dns-cloudflare \
  -d *.vanguardschools.com -d vanguardschools.com
```

## 🔍 Verificar Configuración de Nginx

Cada subdominio debe tener su configuración apuntando al certificado correcto:

```bash
# Ver configuración de un subdominio específico
sudo nano /etc/nginx/sites-available/estadisticas.vanguardschools.com
```

Debe verse algo así:

```nginx
server {
    listen 443 ssl http2;
    server_name estadisticas.vanguardschools.com;

    # Si usas certificado wildcard:
    ssl_certificate /etc/letsencrypt/live/vanguardschools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vanguardschools.com/privkey.pem;

    # O si usas certificado individual:
    # ssl_certificate /etc/letsencrypt/live/estadisticas.vanguardschools.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/estadisticas.vanguardschools.com/privkey.pem;

    # ... resto de tu configuración
}
```

## 📋 Checklist de Verificación

Después de aplicar la solución, verifica:

- [ ] `sudo certbot certificates` muestra todos los certificados activos
- [ ] `sudo nginx -t` no muestra errores
- [ ] Los subdominios cargan sin errores SSL en el navegador
- [ ] Los certificados no están próximos a expirar (más de 30 días)

## 🐛 Si Aún Falla

### Verificar logs de Nginx:

```bash
sudo tail -f /var/log/nginx/error.log
```

### Verificar que los certificados existan:

```bash
# Para certificado wildcard
sudo ls -la /etc/letsencrypt/live/vanguardschools.com/

# Para certificado individual
sudo ls -la /etc/letsencrypt/live/estadisticas.vanguardschools.com/
```

### Verificar DNS:

```bash
# Desde el servidor
dig estadisticas.vanguardschools.com
dig calendar.vanguardschools.com

# Deben apuntar a tu IP del VPS (72.60.172.101 según las imágenes)
```

## ⚠️ Importante

1. **Los mensajes de "vulnerado" son advertencias de Chrome**, no significa que tu servidor esté hackeado
2. **Hostinger NO limita subdominios**, el problema es solo de certificados SSL
3. **Si ayer subiste el sistema de canchas**, es posible que:
   - Hayas modificado alguna configuración de Nginx global
   - Hayas renovado certificados y algunos no se aplicaron correctamente
   - Algún certificado haya expirado

## 🔄 Renovación Automática

Para evitar que esto pase de nuevo, configura renovación automática:

```bash
# Verificar que el timer esté activo
sudo systemctl status certbot.timer

# Si no está activo, activarlo
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

Los certificados de Let's Encrypt se renuevan automáticamente cada 90 días.

## 📞 Comandos Útiles de Diagnóstico

```bash
# Ver todos los certificados
sudo certbot certificates

# Ver configuración de Nginx
sudo nginx -t

# Ver errores recientes
sudo tail -50 /var/log/nginx/error.log | grep -i ssl

# Ver qué subdominios están configurados
sudo grep -r "server_name" /etc/nginx/sites-enabled/

# Verificar estado de servicios
sudo systemctl status nginx
sudo systemctl status certbot.timer
```

