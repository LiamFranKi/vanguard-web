# 🔧 Solución: Build Desactualizado en canchas

## 🔍 Problema Identificado

- ✅ El archivo JS existe: `main.4e09178c.js`
- ❌ El navegador busca: `main.18e21892.js`
- ❌ El `index.html` tiene referencias al archivo antiguo

**Esto significa que el build está desactualizado o se hizo parcialmente.**

## 🔧 Solución: Reconstruir la Aplicación

### Paso 1: Reconstruir el Frontend

```bash
cd /var/www/canchas/client

# Limpiar build anterior (opcional pero recomendado)
rm -rf build

# Instalar dependencias (por si falta algo)
npm install

# Reconstruir la aplicación
npm run build

# Verificar que se creó correctamente
ls -la /var/www/canchas/client/build/static/js/
```

### Paso 2: Verificar que index.html tiene las Referencias Correctas

```bash
# Ver qué archivos JS referencia el index.html
grep -o 'main\.[^"]*\.js' /var/www/canchas/client/build/index.html
```

**Debería mostrar el nombre del archivo JS actual (ej: `main.4e09178c.js` o el nuevo que se generó).**

### Paso 3: Verificar Permisos

```bash
# Asegurar que Nginx puede leer los archivos
sudo chown -R www-data:www-data /var/www/canchas/client/build
sudo chmod -R 755 /var/www/canchas/client/build
```

### Paso 4: Verificar que el Backend está Corriendo

```bash
# Ver procesos PM2
pm2 status

# Ver si el puerto 5006 está en uso
sudo netstat -tulpn | grep 5006

# Si no está corriendo, iniciarlo
cd /var/www/canchas/server
pm2 start index.js --name canchas-backend
# o según cómo esté configurado
```

### Paso 5: Recargar Nginx (por si acaso)

```bash
sudo systemctl reload nginx
```

### Paso 6: Probar

```bash
# Probar desde el servidor
curl -I -H "Host: canchas.vanguardschools.com" https://localhost/
```

## ✅ Verificar que Funciona

1. **Abrir en navegador:** `https://canchas.vanguardschools.com`
2. **Abrir consola del navegador (F12)** y verificar que no hay errores 404
3. **Limpiar caché del navegador** si es necesario (Ctrl+Shift+Delete)

## 🐛 Si Sigue Fallando

### Verificar logs de Nginx

```bash
sudo tail -f /var/log/nginx/error.log
```

### Verificar que el archivo existe con el nombre correcto

```bash
# Ver qué archivo JS referencia el index.html
grep 'main\.[^"]*\.js' /var/www/canchas/client/build/index.html

# Verificar que ese archivo existe
ls -la /var/www/canchas/client/build/static/js/main.*.js
```

**El nombre en index.html debe coincidir con el archivo que existe.**




