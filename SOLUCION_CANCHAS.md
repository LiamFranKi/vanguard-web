# 🔧 Solución: canchas.vanguardschools.com - Archivos Faltantes

## 🔍 Problema Identificado

El error en los logs muestra:
```
open() "/var/www/canchas/client/build/static/js/main.18e21892.js" failed (2: No such file or directory)
```

**Esto significa que:**
- ✅ Nginx está configurado correctamente
- ✅ El subdominio está habilitado
- ❌ Faltan archivos en `/var/www/canchas/client/build/`

---

## 🔧 PASO 1: Ver la Configuración de canchas

```bash
cat /etc/nginx/sites-available/canchas.vanguardschools.com
```

**Necesito ver esto para entender qué ruta está configurada.**

---

## 🔧 PASO 2: Verificar si los Archivos Existen

```bash
# Ver qué hay en la carpeta canchas
ls -la /var/www/canchas/

# Ver si existe la carpeta client/build
ls -la /var/www/canchas/client/build/ 2>/dev/null || echo "La carpeta no existe"

# Ver estructura completa
find /var/www/canchas -type f -name "*.js" | head -10
```

---

## 🔧 PASO 3: Verificar si la Aplicación Necesita Build

Si es una aplicación React/Node.js, puede necesitar construirse:

```bash
# Ver si hay package.json
cat /var/www/canchas/package.json 2>/dev/null || echo "No hay package.json"

# Ver si hay carpeta client
ls -la /var/www/canchas/client/ 2>/dev/null || echo "No hay carpeta client"
```

---

## 🔧 PASO 4: Soluciones Posibles

### Solución A: Reconstruir la Aplicación

Si es una aplicación que necesita build:

```bash
cd /var/www/canchas
# Si tiene client/
cd client
npm install
npm run build
```

### Solución B: Verificar Ruta en Nginx

Si los archivos están en otra ubicación, actualizar la configuración de Nginx:

```bash
sudo nano /etc/nginx/sites-available/canchas.vanguardschools.com
```

**Ajustar la ruta `root` o `proxy_pass` según donde estén los archivos.**

### Solución C: Restaurar Archivos

Si los archivos se eliminaron por error, restaurarlos desde:
- Backup
- Git (si está versionado)
- Reconstruir la aplicación

---

## ✅ Verificar Otros Subdominios

Los otros subdominios parecen funcionar bien según los tests:
- ✅ `calendar.vanguardschools.com` → Redirige a HTTPS
- ✅ `intranet.vanguardschools.com` → Redirige a HTTPS (pero redirige a vanguardschools.com, puede ser normal)
- ✅ `secretaria.vanguardschools.com` → Redirige a HTTPS

**No se rompieron durante la configuración.**

---

**Ejecuta los comandos del Paso 1 y Paso 2 y comparte los resultados para darte la solución exacta.**




