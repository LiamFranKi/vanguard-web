# 🔍 Verificar y Diagnosticar Subdominios

## 🔧 PASO 1: Verificar Configuración de canchas.vanguardschools.com

### 1.1 Ver el archivo de configuración

```bash
ssh root@72.60.172.101
cat /etc/nginx/sites-available/canchas.vanguardschools.com
```

### 1.2 Verificar que está habilitado

```bash
ls -la /etc/nginx/sites-enabled/ | grep canchas
```

**Debería mostrar un enlace simbólico.** Si no aparece, está deshabilitado.

### 1.3 Verificar sintaxis de Nginx

```bash
sudo nginx -t
```

**Si hay errores, corregirlos antes de continuar.**

---

## 🔧 PASO 2: Verificar Estado de Nginx

```bash
# Ver estado de Nginx
sudo systemctl status nginx

# Ver logs de error recientes
sudo tail -50 /var/log/nginx/error.log | grep -i canchas
```

---

## 🔧 PASO 3: Probar el Subdominio desde el Servidor

```bash
# Probar canchas
curl -I -H "Host: canchas.vanguardschools.com" http://localhost

# Probar otros subdominios para verificar que funcionan
curl -I -H "Host: calendar.vanguardschools.com" http://localhost
curl -I -H "Host: intranet.vanguardschools.com" http://localhost
curl -I -H "Host: secretaria.vanguardschools.com" http://localhost
```

**Anota qué respuestas obtienes** (200 OK, 404, 502, etc.)

---

## 🔧 PASO 4: Verificar DNS

```bash
# Verificar que el DNS resuelve correctamente
nslookup canchas.vanguardschools.com
```

**Debería mostrar:** `72.60.172.101`

---

## 🔧 PASO 5: Verificar que la Aplicación está Corriendo

Si `canchas` es una aplicación que corre en un puerto específico:

```bash
# Ver qué puertos están en uso
sudo netstat -tulpn | grep LISTEN

# Ver procesos PM2 (si usa PM2)
pm2 status
pm2 logs canchas --lines 20
```

---

## 🔧 PASO 6: Verificar Todos los Subdominios Habilitados

```bash
# Ver todos los subdominios habilitados
ls -la /etc/nginx/sites-enabled/

# Verificar que no hay conflictos
grep -r "canchas.vanguardschools.com" /etc/nginx/sites-available/
```

---

## 🐛 Soluciones Comunes

### Problema: Archivo no está habilitado

**Solución:**
```bash
sudo ln -s /etc/nginx/sites-available/canchas.vanguardschools.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Problema: Error de sintaxis en Nginx

**Solución:**
```bash
# Ver el error específico
sudo nginx -t

# Editar el archivo y corregir
sudo nano /etc/nginx/sites-available/canchas.vanguardschools.com
```

### Problema: La aplicación no está corriendo

**Solución:**
```bash
# Si usa PM2
pm2 start canchas
# o
pm2 restart canchas

# Si es otro tipo de aplicación, iniciarla según corresponda
```

### Problema: Puerto no está en uso

**Solución:**
- Verificar qué puerto usa `canchas` en su configuración
- Verificar que la aplicación esté corriendo en ese puerto
- Iniciar la aplicación si no está corriendo

---

## ✅ Checklist de Verificación

- [ ] Archivo de configuración existe
- [ ] Archivo está habilitado (enlace en sites-enabled)
- [ ] Sintaxis de Nginx es correcta
- [ ] Nginx está corriendo
- [ ] DNS resuelve correctamente
- [ ] La aplicación está corriendo (si aplica)
- [ ] No hay errores en logs

---

**Ejecuta estos comandos y comparte los resultados para diagnosticar el problema.**






