# 🔧 Rebuild para Aplicar Cambios del Chat

## El archivo tiene los cambios, pero Next.js necesita recompilar

Ejecuta estos comandos en PuTTY:

```bash
cd /var/www/web
npm run build
pm2 restart vanguard-web
```

Esto recompilará la aplicación con los cambios nuevos.


