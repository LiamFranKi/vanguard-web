# 🌐 Configuración Completa de DNS - vanguardschools.com y vanguardschools.edu.pe

## 📋 Situación Actual

En Hostinger tienes configurados varios subdominios apuntando a `72.60.172.101`:
- ✅ `www` → 72.60.172.101
- ✅ `calendar` → 72.60.172.101
- ✅ `intranet` → 72.60.172.101
- ✅ `secretaria` → 72.60.172.101
- ✅ Y otros subdominios...

**❌ FALTA:** El registro A para el dominio raíz (`@` o `vanguardschools.com`)

---

## 🔧 Paso 1: Agregar Registro A para Dominio Raíz en Hostinger

### En el Panel de Hostinger:

1. **En la tabla de DNS que estás viendo, haz clic en "Add Record" o "Agregar Registro"**

2. **Configura el registro así:**
   - **Type:** `A`
   - **Name:** `@` (o déjalo vacío, o escribe `vanguardschools.com`)
   - **IP Address/Target:** `72.60.172.101`
   - **TTL:** `3600` (o el valor por defecto)

3. **Guarda el registro**

**Esto hará que `vanguardschools.com` (sin www) también apunte a tu VPS.**

---

## 🔧 Paso 2: Configurar DNS en punto.pe para vanguardschools.edu.pe

Ahora necesitas configurar el dominio `.edu.pe` en punto.pe para que apunte al mismo VPS.

### Opción A: Usar DNS de la RCP (Recomendado)

1. **En punto.pe, haz clic en "Usar DNS de la RCP"** (el enlace rojo que viste)

2. **Después de cambiar a DNS de la RCP, crea estos registros A:**

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

### Opción B: Mantener DNS de zarkiel.com

Si prefieres mantener los DNS actuales (`ns1.zarkiel.com`, etc.):

1. **No cambies nada en punto.pe**
2. **Accede al panel de zarkiel.com** (donde están los DNS actuales)
3. **Crea los mismos registros A allí:**
   - `@` → `72.60.172.101`
   - `www` → `72.60.172.101`

---

## 🖥️ Paso 3: Actualizar Nginx en el VPS

Ya tienes la guía en `SOLUCION_IP_DEFAULT_SERVER.md`, pero aquí está el resumen:

### 3.1 Conectarte al VPS

```bash
ssh root@72.60.172.101
```

### 3.2 Editar configuración de Nginx

```bash
sudo nano /etc/nginx/sites-available/vanguardschools.com
```

### 3.3 Agregar `default_server` y el dominio `.edu.pe`

**Busca el bloque HTTP (puerto 80) y actualízalo:**

```nginx
server {
    listen 80 default_server;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    return 301 https://$server_name$request_uri;
}
```

**Busca el bloque HTTPS (puerto 443) y actualízalo:**

```nginx
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
```

**Puntos importantes:**
- ✅ `default_server` en ambos bloques (80 y 443)
- ✅ Agregar `vanguardschools.edu.pe` y `www.vanguardschools.edu.pe` al `server_name`

### 3.4 Verificar y aplicar

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 3.5 Verificar que calendar NO tiene default_server

```bash
# Buscar otros bloques con default_server
grep -r "default_server" /etc/nginx/sites-available/

# Si calendar.vanguardschools.com tiene default_server, removerlo
sudo nano /etc/nginx/sites-available/calendar.vanguardschools.com
# Cambiar: listen 80 default_server; → listen 80;
```

---

## 🔒 Paso 4: Configurar SSL para .edu.pe

```bash
# Agregar el dominio .edu.pe al certificado SSL existente
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com -d vanguardschools.edu.pe -d www.vanguardschools.edu.pe
```

---

## ✅ Paso 5: Verificar Todo

### 5.1 Verificar DNS

**Desde tu computadora (Windows PowerShell):**
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

### 5.2 Verificar que funciona

1. **Acceder por IP:** `http://72.60.172.101` → Debe mostrar `vanguardschools.com` (no calendar)
2. **Acceder por .com:** `https://vanguardschools.com` → Debe funcionar
3. **Acceder por .edu.pe:** `https://vanguardschools.edu.pe` → Debe funcionar
4. **Acceder por calendar:** `https://calendar.vanguardschools.com` → Debe funcionar normalmente

---

## 📊 Resumen de Cambios

### En Hostinger:
- ✅ Agregar registro A: `@` → `72.60.172.101`

### En punto.pe:
- ✅ Cambiar a "Usar DNS de la RCP"
- ✅ Crear registro A: `@` → `72.60.172.101`
- ✅ Crear registro A: `www` → `72.60.172.101`

### En el VPS (Nginx):
- ✅ Agregar `default_server` a los bloques de `vanguardschools.com`
- ✅ Agregar `vanguardschools.edu.pe` y `www.vanguardschools.edu.pe` al `server_name`
- ✅ Remover `default_server` de otros bloques (como calendar)

### En el VPS (SSL):
- ✅ Agregar `.edu.pe` al certificado SSL

---

## ⏱️ Tiempos de Propagación

- **Hostinger:** Inmediato o pocos minutos
- **punto.pe (DNS de RCP):** 1-4 horas
- **punto.pe (si cambias nameservers):** 24-48 horas

---

## 🐛 Solución de Problemas

### El dominio .com no funciona sin www

**Causa:** Falta el registro A para `@` en Hostinger.

**Solución:** Agregar el registro A para `@` como se indica en el Paso 1.

### El dominio .edu.pe no resuelve

**Causa:** Los DNS no se han propagado o están mal configurados.

**Solución:**
- Verificar que los registros A estén correctos en punto.pe
- Esperar 1-4 horas para propagación
- Verificar con: https://dnschecker.org/#A/vanguardschools.edu.pe

### La IP sigue redirigiendo a calendar

**Causa:** Nginx no tiene `default_server` configurado correctamente.

**Solución:**
- Verificar que `vanguardschools.com` tiene `default_server`
- Verificar que `calendar.vanguardschools.com` NO tiene `default_server`
- Reiniciar Nginx: `sudo systemctl restart nginx`

---

**Última actualización:** 2024-12-16




