# 🔧 Solución: IP devuelve 404 en vez de redirigir

## 🔍 Problema

Cuando accedes por IP (`http://72.60.172.101`), obtienes un 404 porque el bloque HTTP tiene `return 404;` al final y las condiciones `if ($host = ...)` no se cumplen cuando no hay header Host.

## 🔧 Solución: Ajustar el bloque HTTP

Necesitamos modificar el bloque HTTP para que cuando se acceda por IP (sin header Host), redirija a HTTPS del dominio principal.

### Ver la configuración actual

```bash
cat /etc/nginx/sites-available/vanguardschools.com
```

### Editar el archivo

```bash
sudo nano /etc/nginx/sites-available/vanguardschools.com
```

### Cambiar el bloque HTTP

**Busca el bloque HTTP completo (debería verse así):**

```nginx
server {
    if ($host = www.vanguardschools.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = vanguardschools.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80 default_server;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    return 404; # managed by Certbot
}
```

**Reemplázalo por:**

```nginx
server {
    listen 80 default_server;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    
    # Redirigir a HTTPS del dominio principal cuando se accede por IP
    if ($host = www.vanguardschools.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = vanguardschools.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = www.vanguardschools.edu.pe) {
        return 301 https://$host$request_uri;
    }

    if ($host = vanguardschools.edu.pe) {
        return 301 https://$host$request_uri;
    }

    # Si se accede por IP (sin header Host), redirigir a HTTPS del dominio principal
    return 301 https://vanguardschools.com$request_uri;
}
```

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

### Verificar y aplicar

```bash
# Verificar sintaxis
sudo nginx -t

# Si está OK, recargar
sudo systemctl reload nginx
```

### Probar

```bash
curl -I http://72.60.172.101
```

**Ahora debería redirigir a `https://vanguardschools.com`**




