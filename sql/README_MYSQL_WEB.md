# MySQL en la web Vanguard — .env y tablas

## 1) Crear tablas (phpMyAdmin)

1. Base **vanguard_intranet** → pestaña **SQL**.
2. Ejecuta `sql/web_sugerencias_reclamos.sql` (tablas de datos).
3. Ejecuta `sql/web_correos_envio.sql` (correos destino + filas iniciales).

### Tabla `web_correos_envio` (quién recibe los mails)

| Columna | Uso |
|---------|-----|
| `email` | Correo destino |
| `etiqueta` | Nombre interno (Dirección, etc.) |
| `activo` | 1 = recibe, 0 = no |
| `recibe_sugerencias` | 1 = recibe sugerencias |
| `recibe_reclamos` | 1 = recibe reclamos |

**Ejemplos en phpMyAdmin:**

```sql
-- Agregar un correo nuevo (recibe ambos)
INSERT INTO web_correos_envio (email, etiqueta, activo, recibe_sugerencias, recibe_reclamos)
VALUES ('nuevo@correo.com', 'Secretaría', 1, 1, 1);

-- Solo sugerencias
UPDATE web_correos_envio SET recibe_sugerencias=1, recibe_reclamos=0 WHERE email='solo@sugerencias.com';

-- Desactivar un correo sin borrarlo
UPDATE web_correos_envio SET activo=0 WHERE email='ya-no@correo.com';
```

Si la tabla está vacía o MySQL falla, se usan los correos de `config/formularios.json` como respaldo.

## 2) Correos: qué ve cada uno

### Al colegio (sugerencia o reclamo)
- Cabecera azul con **logo** del colegio
- Título del tipo de mensaje
- Todos los campos del formulario
- En reclamos: número `REC-AAAA-#####`
- Reply-To = email de la persona (pueden contestar directo)

### Al usuario (acuse)
- Mismo diseño con logo
- Mensaje de confirmación
- En reclamos: número de registro destacado
- Datos de contacto del colegio

## 3) Configurar `.env` en el VPS

Ruta: `/home/vanguard/web-vanguard/.env`

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=vanguard
MYSQL_PASSWORD="tu_password"
MYSQL_DATABASE=vanguard_intranet
```

## 4) Despliegue

```bash
cd /home/vanguard/web-vanguard && git pull origin main && npm install && npm run build && pm2 restart vanguard-web-test
```
