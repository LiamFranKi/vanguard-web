# 🔧 Pasos Exactos para Configurar Nginx

## 📋 Situación Actual

- ✅ `vanguardschools.com` está bien configurado para `localhost:3000`
- ❌ El archivo `default` tiene `default_server` (por eso la IP va ahí)
- ❌ `vanguardschools.com` NO tiene `default_server`
- ❌ `vanguardschools.com` NO tiene `vanguardschools.edu.pe` en el `server_name`

## 🔧 PASO 1: Verificar si el archivo `default` está habilitado

```bash
ls -la /etc/nginx/sites-enabled/ | grep default
```

**Si aparece un enlace simbólico**, el archivo `default` está habilitado y necesitamos deshabilitarlo.

## 🔧 PASO 2: Hacer Backup (Por Seguridad)

```bash
# Crear backup
sudo cp /etc/nginx/sites-available/vanguardschools.com /etc/nginx/sites-available/vanguardschools.com.backup-$(date +%Y%m%d)
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup-$(date +%Y%m%d)

# Verificar que se crearon
ls -la /etc/nginx/sites-available/*.backup*
```

## 🔧 PASO 3: Deshabilitar el archivo `default` (si está habilitado)

**Solo si el Paso 1 mostró que está habilitado:**

```bash
# Deshabilitar el archivo default
sudo rm /etc/nginx/sites-enabled/default

# Verificar que se removió
ls -la /etc/nginx/sites-enabled/ | grep default
```

**Si no está habilitado, omite este paso.**

## 🔧 PASO 4: Editar vanguardschools.com

```bash
sudo nano /etc/nginx/sites-available/vanguardschools.com
```

### Cambios a hacer:

**1. En el bloque HTTPS (443) - Busca esta línea:**
```nginx
    listen 443 ssl; # managed by Certbot
```

**Cámbiala por:**
```nginx
    listen 443 ssl default_server; # managed by Certbot
```

**2. En el bloque HTTPS (443) - Busca esta línea:**
```nginx
    server_name vanguardschools.com www.vanguardschools.com;
```

**Cámbiala por:**
```nginx
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
```

**3. En el bloque HTTP (80) - Busca esta línea:**
```nginx
    listen 80;
```

**Cámbiala por:**
```nginx
    listen 80 default_server;
```

**4. En el bloque HTTP (80) - Busca esta línea:**
```nginx
    server_name vanguardschools.com www.vanguardschools.com;
```

**Cámbiala por:**
```nginx
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
```

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

## 🔧 PASO 5: Verificar Sintaxis

```bash
sudo nginx -t
```

**Deberías ver:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Si hay errores, corrígelos antes de continuar.**

## 🔧 PASO 6: Aplicar Cambios

```bash
sudo systemctl reload nginx
```

**O si reload no funciona:**
```bash
sudo systemctl restart nginx
```

## 🔧 PASO 7: Verificar que Funciona

```bash
# Verificar que Nginx está corriendo
sudo systemctl status nginx

# Probar que la IP ahora apunta a tu app
curl -I http://72.60.172.101
```

**Debería mostrar headers de tu aplicación Next.js, no de la página default.**

## ✅ Resultado Final

Después de estos pasos:
- ✅ La IP `72.60.172.101` apuntará a `vanguardschools.com` (tu app Next.js)
- ✅ `vanguardschools.com` funcionará normalmente
- ✅ `vanguardschools.edu.pe` funcionará (después de configurar DNS)
- ✅ Los subdominios seguirán funcionando normalmente (no los tocamos)






