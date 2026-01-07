# 🔧 Solución: Archivo JS Faltante en canchas

## 🔍 Problema

El error dice que falta:
```
/var/www/canchas/client/build/static/js/main.18e21892.js
```

Pero la carpeta `client/build` existe y tiene archivos. El problema es que el archivo JS específico no está o tiene un nombre diferente.

## 🔧 Verificar Contenido de la Carpeta static

```bash
# Ver qué hay dentro de static
ls -la /var/www/canchas/client/build/static/

# Ver qué hay en static/js
ls -la /var/www/canchas/client/build/static/js/ 2>/dev/null || echo "No hay carpeta js"

# Ver todos los archivos JS
find /var/www/canchas/client/build/static -name "*.js" -type f
```

## 🔧 Solución: Reconstruir la Aplicación

El archivo `main.18e21892.js` tiene un hash en el nombre que cambia cada vez que se hace build. Si el build está desactualizado, necesitas reconstruirlo:

```bash
cd /var/www/canchas

# Verificar que el backend esté corriendo (puerto 5006)
pm2 status

# Reconstruir el frontend
cd client
npm install
npm run build

# Verificar que se creó el build
ls -la /var/www/canchas/client/build/static/js/
```

## 🔧 Verificar que el Backend está Corriendo

El backend debe estar corriendo en el puerto 5006:

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

## ✅ Verificar Después de Reconstruir

```bash
# Verificar que el archivo existe ahora
ls -la /var/www/canchas/client/build/static/js/main.*.js

# Probar desde el servidor
curl -I -H "Host: canchas.vanguardschools.com" https://localhost/static/js/main.*.js
```




