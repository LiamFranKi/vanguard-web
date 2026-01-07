# 🔍 Verificar Cambios en el Servidor

## Verificar que el archivo tiene los cambios

Ejecuta estos comandos en PuTTY:

```bash
# Ver el contenido del archivo en el servidor
cat /var/www/web/app/api/chat/route.ts | grep -A 20 "formatPhoneForWhatsApp"
```

**Deberías ver la función `formatPhoneForWhatsApp`.** Si no aparece, el archivo no se subió correctamente.

## Verificar la línea del botón de WhatsApp

```bash
# Ver la línea donde está el botón de WhatsApp
cat /var/www/web/app/api/chat/route.ts | grep -A 2 "Responder por WhatsApp"
```

**Debería mostrar algo como:**
```html
<a href="${whatsappLink}" ...>Responder por WhatsApp</a>
```

**NO debería mostrar:**
```html
<a href="https://wa.me/51970877642?text=...
```

## Si el archivo NO tiene los cambios

1. **Verificar que subiste el archivo correcto**
2. **Verificar la ruta:** `/var/www/web/app/api/chat/route.ts`
3. **Subir nuevamente el archivo con WinSCP**

## Si el archivo SÍ tiene los cambios pero no funciona

Puede ser caché. Necesitamos hacer un rebuild:

```bash
cd /var/www/web
npm run build
pm2 restart vanguard-web
```


