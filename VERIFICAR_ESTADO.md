# ✅ Verificar Estado Final

Ejecuta este comando en PuTTY para ver el estado actual:

```bash
cat /var/www/web/config/formularios.json
```

Verifica que:
- ✅ Todos los asuntos tengan iconos (📧, 📝, 💡, 💼, 🗓️, 💬)
- ✅ El correo del chat sea el que quieres (solo `walter.lozano@vanguardschools.edu.pe` o con ambos)

Si el correo del chat no es el que quieres, puedes editarlo directamente:

```bash
nano /var/www/web/config/formularios.json
```

Y luego solo reiniciar PM2:

```bash
pm2 restart vanguard-web
```

