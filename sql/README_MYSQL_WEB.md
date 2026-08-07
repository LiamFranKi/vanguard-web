# MySQL en la web Vanguard — .env y tablas

## 1) Crear tablas (phpMyAdmin)

1. Abre phpMyAdmin.
2. Selecciona la base **vanguard_intranet**.
3. Pestaña **SQL**.
4. Pega el contenido de `sql/web_sugerencias_reclamos.sql` y ejecuta.

Se crean:

- `web_sugerencias`
- `web_reclamos`

## 2) Configurar `.env` en el VPS (tú lo creas o editas)

**Ruta del archivo:**

```text
/home/vanguard/web-vanguard/.env
```

- Si **ya existe** `.env` (SMTP, etc.): abre con `nano` y **añade** al final las variables `MYSQL_*`.
- Si **no existe**: créalo y pega SMTP + MYSQL.

**PuTTY (editar/crear):**

```bash
nano /home/vanguard/web-vanguard/.env
```

**Líneas MySQL a agregar** (usa tu contraseña real; si tiene caracteres especiales, ponla entre comillas):

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=vanguard
MYSQL_PASSWORD="tu_password_aqui"
MYSQL_DATABASE=vanguard_intranet
```

Guardar: `Ctrl+X`, luego `Y`, luego `Enter`.

**Nunca subas el `.env` a GitHub.**

## 3) Tras editar `.env` y crear tablas

```bash
cd /home/vanguard/web-vanguard && npm install && npm run build && pm2 restart vanguard-web-test
```

## 4) Comportamiento

- Sugerencias y reclamos intentan **INSERT** en MySQL.
- Si la BD falla, **igual se envía el email** (respaldo).
- Los registros también siguen en archivos en `data/` (JSONL / JSON local).

## 5) Comprobar en phpMyAdmin

Después de un envío de prueba en la web:

- `web_sugerencias` → una fila nueva
- `web_reclamos` → una fila con número `REC-AAAA-0000X`
