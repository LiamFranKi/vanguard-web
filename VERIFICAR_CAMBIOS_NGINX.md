# ✅ Verificar que los Cambios Funcionaron

## 🔧 PASO 1: Recargar Nginx

```bash
sudo systemctl reload nginx
```

## 🔧 PASO 2: Verificar que Nginx está corriendo

```bash
sudo systemctl status nginx
```

**Debería mostrar `active (running)`**

## 🔧 PASO 3: Verificar si el archivo `default` está habilitado

```bash
ls -la /etc/nginx/sites-enabled/ | grep default
```

**Si aparece un enlace, deshabilitarlo:**

```bash
sudo rm /etc/nginx/sites-enabled/default
```

**Si no aparece nada, está bien, no hacer nada.**

## 🔧 PASO 4: Probar que la IP ahora apunta a tu app

```bash
# Probar desde el servidor
curl -I http://72.60.172.101
```

**Debería mostrar headers de tu aplicación Next.js (puerto 3000), no de la página default.**

## 🔧 PASO 5: Verificar que los subdominios siguen funcionando

```bash
# Probar calendar
curl -I -H "Host: calendar.vanguardschools.com" http://localhost

# Probar otro subdominio (ejemplo: intranet)
curl -I -H "Host: intranet.vanguardschools.com" http://localhost
```

**Todos deberían seguir funcionando normalmente.**

## 🔧 PASO 6: Ver logs por si hay errores

```bash
# Ver últimos logs de error
sudo tail -20 /var/log/nginx/error.log
```

**Si hay errores, revisarlos. Si no hay errores, está todo bien.**

## ✅ Resultado Esperado

Después de estos pasos:
- ✅ La IP `72.60.172.101` debería apuntar a `vanguardschools.com` (tu app Next.js)
- ✅ `vanguardschools.com` debería funcionar normalmente
- ✅ Los subdominios deberían seguir funcionando normalmente




