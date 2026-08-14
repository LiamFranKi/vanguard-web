# MySQL en la web Vanguard — .env y tablas

## 1) Crear tablas (phpMyAdmin)

1. Base **vanguard_intranet** → pestaña **SQL**.
2. Ejecuta `sql/web_sugerencias_reclamos.sql` (tablas de datos).
3. Ejecuta `sql/web_correos_envio.sql` (correos destino + filas iniciales).
4. Ejecuta `sql/web_contactenos.sql` (contactos + flag `recibe_contacto`).
5. Ejecuta `sql/web_visitas_guiadas.sql` (días/horarios configurables + registros + `recibe_visitas`).
6. Ejecuta `sql/web_trabaja_con_nosotros.sql` (postulaciones + CV + `recibe_trabaja`).
7. Ejecuta `sql/web_admision.sql` (admisión/ratificación + `recibe_admision`).

### Tabla `web_correos_envio` (quién recibe los mails)

| Columna | Uso |
|---------|-----|
| `email` | Correo destino |
| `etiqueta` | Nombre interno (Dirección, etc.) |
| `activo` | 1 = recibe, 0 = no |
| `recibe_sugerencias` | 1 = recibe sugerencias |
| `recibe_reclamos` | 1 = recibe reclamos |
| `recibe_contacto` | 1 = recibe Contáctenos |
| `recibe_visitas` | 1 = recibe Visitas Guiadas |
| `recibe_trabaja` | 1 = recibe Trabaja con Nosotros |
| `recibe_admision` | 1 = recibe Admisión / Ratificación |

**Ejemplos en phpMyAdmin:**

```sql
-- Agregar un correo nuevo
INSERT INTO web_correos_envio
  (email, etiqueta, activo, recibe_sugerencias, recibe_reclamos, recibe_contacto, recibe_visitas, recibe_trabaja, recibe_admision)
VALUES ('nuevo@correo.com', 'Secretaría', 1, 1, 1, 1, 1, 1, 1);

-- Solo Admisión
UPDATE web_correos_envio
SET recibe_admision=1, recibe_sugerencias=0, recibe_reclamos=0, recibe_contacto=0, recibe_visitas=0, recibe_trabaja=0
WHERE email='admision@correo.com';

-- Desactivar un correo sin borrarlo
UPDATE web_correos_envio SET activo=0 WHERE email='ya-no@correo.com';
```

### Visitas Guiadas (días y horarios)

- `web_visita_dias`: activar/desactivar días (`activo=1`). Seed: martes y jueves.
- `web_visita_horarios`: franjas (etiquetas).
- `web_visita_secuencias` + `web_visita_secuencia_slots` (opcional): si hay secuencias activas, solo esas combinaciones día+horario.
- `web_visitas_guiadas`: solicitudes del formulario.

### Trabaja con Nosotros (CV)

- Tabla: `web_trabaja_con_nosotros`
- Archivos PDF en disco (**ruta nueva Zarkiel**, no Hostinger):
  - `/home/vanguard/web-vanguard/data/curriculums/<archivo>`
- En BD: `cv_nombre` (original) + `cv_ruta` (absoluta en el VPS nuevo)
- Máx. 5 MB, solo PDF. El correo al colegio lleva el CV adjunto.

### Admisión / Ratificación

- Tabla: `web_admision`
- Un solo formulario en `/admision-2026` (Admisión y Ratificación).
- Campos: estudiante, apoderado (DNI, teléfono, email, dirección), grado.

Si MySQL falla, el formulario usa martes/jueves y los dos horarios por defecto; los correos caen a `config/formularios.json`.

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
