# 🎓 Actualizar Formulario de Admisión 2026

## ✅ Cambios Realizados

1. ✅ Formulario de Admisión 2026 creado con diseño bonito
2. ✅ Botón "Admisión 2026" agregado en el banner principal (color naranja/dorado)
3. ✅ Todos los campos requeridos implementados
4. ✅ Dropdown con todos los grados en el orden correcto
5. ✅ Icono 📝 en el asunto del correo (ya estaba en formularios.json)

## 📥 Comandos para Actualizar en el Servidor

Ejecuta estos comandos en PuTTY:

```bash
cd /var/www/web
git pull origin main
npm run build
pm2 restart vanguard-web
```

## 🎨 Características del Formulario

- **Diseño moderno** con gradiente naranja/dorado
- **Campos organizados** en secciones (Estudiante / Apoderado)
- **Validación completa** de todos los campos
- **Iconos** en cada campo para mejor UX
- **Mensajes de éxito/error** claros
- **Responsive** para móvil, tablet y desktop

## 📋 Campos del Formulario

### Datos del Estudiante:
- Nombres del Estudiante *
- Apellidos del Estudiante *

### Datos del Apoderado:
- Nombres Apoderado *
- DNI Apoderado *
- Teléfono Apoderado *
- Email Apoderado *
- Dirección Apoderado *

### Grado:
- Elige un Grado * (dropdown con todos los niveles)

## 🔗 URLs

- **Página del formulario**: `https://vanguardschools.com/admision-2026`
- **Botón en banner**: Aparece en la página principal

## ✉️ Correos

El formulario usa la configuración de `formularios.json`:
- **Tipo**: `admisión`
- **Asunto**: `📝 Nueva solicitud de admisión - Vanguard Schools`
- **Destinatarios**: Configurados en `formularios.json`

---

**¡Listo para desplegar!** Ejecuta los comandos de arriba y el formulario estará funcionando.

