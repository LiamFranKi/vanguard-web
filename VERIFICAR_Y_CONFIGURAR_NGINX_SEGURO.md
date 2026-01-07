# 🔍 Verificar y Configurar Nginx de Forma Segura (Sin Romper Subdominios)

## ⚠️ IMPORTANTE: Vamos a ser muy cuidadosos

Tienes varios subdominios (calendar, intranet, secretaria, etc.) y cada uno tiene su configuración de Nginx. 
**NO vamos a tocar las configuraciones de los subdominios**, solo vamos a:
1. Ver qué existe
2. Identificar cuál tiene `default_server`
3. Mover `default_server` a `vanguardschools.com`
4. Agregar `vanguardschools.edu.pe` al dominio principal

---

## 📋 PASO 1: Ver Todas las Configuraciones de Nginx

### 1.1 Conectarte al VPS

```bash
ssh root@72.60.172.101
```

### 1.2 Ver qué archivos de configuración existen

```bash
# Ver todos los archivos disponibles
ls -la /etc/nginx/sites-available/

# Ver cuáles están habilitados
ls -la /etc/nginx/sites-enabled/
```

**Anota los nombres de los archivos que veas** (ejemplo: `vanguardschools.com`, `calendar.vanguardschools.com`, `intranet.vanguardschools.com`, etc.)

### 1.3 Buscar cuál tiene `default_server`

```bash
# Buscar todos los bloques con default_server
grep -r "default_server" /etc/nginx/sites-available/
```

**Esto te mostrará:**
- Qué archivos tienen `default_server`
- En qué líneas están

**Ejemplo de salida:**
```
/etc/nginx/sites-available/calendar.vanguardschools.com:    listen 80 default_server;
/etc/nginx/sites-available/calendar.vanguardschools.com:    listen 443 ssl http2 default_server;
```

**Anota qué archivo(s) tienen `default_server`**

---

## 📋 PASO 2: Ver la Configuración de vanguardschools.com

### 2.1 Ver el contenido del archivo principal

```bash
# Ver la configuración actual de vanguardschools.com
cat /etc/nginx/sites-available/vanguardschools.com
```

**O si usa otro nombre:**
```bash
# Ver el archivo default si existe
cat /etc/nginx/sites-available/default
```

**Copia y pega el contenido aquí** (o anótalo) para que veamos qué tiene actualmente.

### 2.2 Verificar si está habilitado

```bash
# Ver si está enlazado en sites-enabled
ls -la /etc/nginx/sites-enabled/ | grep vanguardschools
```

---

## 📋 PASO 3: Ver la Configuración del Subdominio que tiene default_server

### 3.1 Ver el archivo que tiene default_server

**Reemplaza `NOMBRE_ARCHIVO` con el que encontraste en el Paso 1.3:**

```bash
# Ejemplo si es calendar.vanguardschools.com:
cat /etc/nginx/sites-available/calendar.vanguardschools.com
```

**Anota o copia esta configuración** para referencia (por si necesitamos restaurarla).

---

## 📋 PASO 4: Hacer Backup de las Configuraciones

### 4.1 Crear carpeta de backup

```bash
# Crear carpeta de backup
sudo mkdir -p /root/nginx-backup-$(date +%Y%m%d)

# Copiar todas las configuraciones
sudo cp -r /etc/nginx/sites-available/* /root/nginx-backup-$(date +%Y%m%d)/
sudo cp -r /etc/nginx/sites-enabled/* /root/nginx-backup-$(date +%Y%m%d)/

# Verificar que se copiaron
ls -la /root/nginx-backup-$(date +%Y%m%d)/
```

**Ahora tienes un backup por si algo sale mal.**

---

## 📋 PASO 5: Editar la Configuración de vanguardschools.com

### 5.1 Abrir el archivo para editar

```bash
sudo nano /etc/nginx/sites-available/vanguardschools.com
```

**O si usa otro nombre:**
```bash
sudo nano /etc/nginx/sites-available/default
```

### 5.2 Agregar default_server y el dominio .edu.pe

**Busca el bloque HTTP (puerto 80). Debería verse algo así:**

```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;
    ...
}
```

**Cámbialo a:**

```nginx
server {
    listen 80 default_server;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    ...
}
```

**Busca el bloque HTTPS (puerto 443). Debería verse algo así:**

```nginx
server {
    listen 443 ssl http2;
    server_name vanguardschools.com www.vanguardschools.com;
    ...
}
```

**Cámbialo a:**

```nginx
server {
    listen 443 ssl http2 default_server;
    server_name vanguardschools.com www.vanguardschools.com vanguardschools.edu.pe www.vanguardschools.edu.pe;
    ...
}
```

**Puntos importantes:**
- ✅ Agregar `default_server` después de `listen 80` y `listen 443 ssl http2`
- ✅ Agregar `vanguardschools.edu.pe www.vanguardschools.edu.pe` al `server_name`
- ✅ **NO modificar nada más** (especialmente el `proxy_pass` que debe apuntar a `http://localhost:3000`)

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

---

## 📋 PASO 6: Remover default_server del Subdominio

### 6.1 Editar el archivo del subdominio que tiene default_server

**Reemplaza `NOMBRE_ARCHIVO` con el que encontraste en el Paso 1.3:**

```bash
# Ejemplo si es calendar.vanguardschools.com:
sudo nano /etc/nginx/sites-available/calendar.vanguardschools.com
```

### 6.2 Remover default_server

**Busca las líneas que tienen `default_server`:**

```nginx
listen 80 default_server;
```

**Cámbiala a:**

```nginx
listen 80;
```

**Y si tiene HTTPS:**

```nginx
listen 443 ssl http2 default_server;
```

**Cámbiala a:**

```nginx
listen 443 ssl http2;
```

**IMPORTANTE:** 
- ✅ **Solo remover `default_server`**
- ✅ **NO modificar nada más** (ni `server_name`, ni `proxy_pass`, ni nada)

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

---

## 📋 PASO 7: Verificar Sintaxis ANTES de Aplicar

### 7.1 Verificar que no hay errores

```bash
# Verificar sintaxis de Nginx
sudo nginx -t
```

**Deberías ver algo como:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Si hay errores:**
- Lee el mensaje de error
- Corrige el problema
- Vuelve a ejecutar `sudo nginx -t`

**NO continúes si hay errores.**

---

## 📋 PASO 8: Aplicar los Cambios

### 8.1 Recargar Nginx (sin reiniciar)

```bash
# Recargar configuración (más seguro que restart)
sudo systemctl reload nginx
```

**Si `reload` no funciona o hay problemas:**

```bash
# Reiniciar Nginx (esto detendrá brevemente el servicio)
sudo systemctl restart nginx
```

### 8.2 Verificar que Nginx está corriendo

```bash
# Ver estado de Nginx
sudo systemctl status nginx
```

**Debería mostrar `active (running)`**

---

## 📋 PASO 9: Verificar que Todo Funciona

### 9.1 Verificar que la IP ahora apunta a vanguardschools.com

```bash
# Probar desde el servidor
curl -I http://72.60.172.101
```

**Debería mostrar headers de tu aplicación Next.js, no de calendar.**

### 9.2 Verificar que los subdominios siguen funcionando

```bash
# Probar calendar (reemplaza con tus subdominios)
curl -I -H "Host: calendar.vanguardschools.com" http://localhost

# Probar intranet (si existe)
curl -I -H "Host: intranet.vanguardschools.com" http://localhost
```

**Todos deberían seguir funcionando normalmente.**

### 9.3 Verificar logs por si hay errores

```bash
# Ver últimos logs de error
sudo tail -20 /var/log/nginx/error.log

# Ver logs de acceso
sudo tail -20 /var/log/nginx/access.log
```

**Si ves errores, revisa qué pasó.**

---

## 📋 PASO 10: Probar en el Navegador

### 10.1 Probar acceso por IP

1. Abre una ventana de incógnito
2. Visita: `http://72.60.172.101`
3. ✅ **Debería mostrar `vanguardschools.com`** (no calendar)
4. ✅ **Debería redirigir a HTTPS**

### 10.2 Probar dominio principal

1. Visita: `https://vanguardschools.com`
2. ✅ **Debería funcionar normalmente**

### 10.3 Probar subdominios

1. Visita: `https://calendar.vanguardschools.com`
2. ✅ **Debería seguir funcionando normalmente** (no debería verse afectado)

---

## 🐛 Si Algo Sale Mal: Restaurar Backup

### Restaurar desde backup

```bash
# Ver backups disponibles
ls -la /root/nginx-backup-*/

# Restaurar (reemplaza FECHA con la fecha del backup)
sudo cp /root/nginx-backup-FECHA/* /etc/nginx/sites-available/
sudo cp /root/nginx-backup-FECHA/* /etc/nginx/sites-enabled/

# Verificar sintaxis
sudo nginx -t

# Recargar
sudo systemctl reload nginx
```

---

## ✅ Checklist Final

- [ ] Ver todas las configuraciones de Nginx
- [ ] Identificar cuál tiene `default_server`
- [ ] Hacer backup de todas las configuraciones
- [ ] Agregar `default_server` a `vanguardschools.com`
- [ ] Agregar `vanguardschools.edu.pe` al `server_name`
- [ ] Remover `default_server` del subdominio que lo tenía
- [ ] Verificar sintaxis con `nginx -t`
- [ ] Recargar Nginx
- [ ] Verificar que la IP apunta a vanguardschools.com
- [ ] Verificar que los subdominios siguen funcionando

---

## 📝 Resumen de Cambios

**Lo que SÍ cambiamos:**
- ✅ `vanguardschools.com`: Agregamos `default_server` y `vanguardschools.edu.pe`
- ✅ Subdominio con `default_server`: Removimos `default_server`

**Lo que NO tocamos:**
- ✅ Configuraciones de otros subdominios
- ✅ `proxy_pass` de ningún subdominio
- ✅ `server_name` de ningún subdominio (excepto agregar .edu.pe al principal)

---

**Última actualización:** 2024-12-16




