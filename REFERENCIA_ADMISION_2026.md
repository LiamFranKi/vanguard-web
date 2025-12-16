# Referencia: Formulario de Admisión 2026

## 📋 Información General

Este documento contiene toda la información relevante sobre el formulario de **Admisión y Ratificación 2026** para futuras modificaciones y mantenimiento.

---

## 🗂️ Archivos Involucrados

### 1. Página Principal
- **Archivo**: `app/admision-2026/page.tsx`
- **Ruta URL**: `/admision-2026`
- **Descripción**: Página Next.js que renderiza el banner y el formulario

### 2. Componente del Formulario
- **Archivo**: `components/sections/AdmissionForm.tsx`
- **Descripción**: Componente React con toda la lógica del formulario

### 3. Configuración de Correos
- **Archivo**: `config/formularios.json`
- **Sección**: `"admisión"` (líneas 9-14)
- **Descripción**: Configuración de destinatarios y asunto del correo

### 4. API de Envío
- **Archivo**: `app/api/formulario/route.ts`
- **Endpoint**: `POST /api/formulario?tipo=admisión`
- **Descripción**: Maneja el envío del formulario y correos

### 5. Botón en Banner Principal
- **Archivo**: `components/sections/Hero.tsx`
- **Descripción**: Botón "Admisión 2026" con color distintivo (purple-600)

---

## 📝 Estructura del Formulario

### Campos del Formulario

#### Datos del Estudiante
- `nombresEstudiante` (text, requerido)
- `apellidosEstudiante` (text, requerido)

#### Datos del Apoderado
- `nombresApoderado` (text, requerido)
- `dniApoderado` (text, requerido, maxLength: 8, pattern: [0-9]{8})
- `telefonoApoderado` (tel, requerido)
- `emailApoderado` (email, requerido)
- `direccionApoderado` (text, requerido)

#### Grado de Interés
- `grado` (select, requerido)
  - Opciones (en orden):
    - Inicial 03 Años
    - Inicial 04 Años
    - Inicial 05 Años
    - 1° Grado Primaria
    - 2° Grado Primaria
    - 3° Grado Primaria
    - 4° Grado Primaria
    - 5° Grado Primaria
    - 6° Grado Primaria
    - 1° Año Secundaria
    - 2° Año Secundaria
    - 3° Año Secundaria
    - 4° Año Secundaria
    - 5° Año Secundaria

---

## 🎨 Diseño y Estilos

### Banner Principal
- **Ubicación**: `app/admision-2026/page.tsx` (líneas 12-24)
- **Gradiente**: `bg-gradient-to-br from-amber-500 via-orange-500 via-amber-600 via-orange-600 to-amber-700`
- **Título**: "Admisión y Ratificación 2026" (una sola línea)
- **Espaciado**: `<br />` antes del título (como en otras páginas)
- **Texto descriptivo**: "Forma parte de la familia Vanguard Schools"

### Formulario
- **Sin cabecera duplicada**: Se eliminó la cabecera naranja dentro del card del formulario
- **Colores de acento**: `amber-700` (en lugar de `amber-500/600`)
- **Botón de envío**: 
  - Estilo: `bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800`
  - Hover: `hover:from-primary-700 hover:via-primary-800 hover:to-primary-900`
  - Texto: "Registrarme" / "Enviando solicitud..." (cuando está procesando)

### Botón en Hero Banner
- **Ubicación**: `components/sections/Hero.tsx`
- **Color**: `bg-purple-600` (distintivo)
- **Hover**: `hover:bg-purple-700`
- **Ruta**: `/admision-2026`

---

## 📧 Sistema de Correos

### Configuración en `config/formularios.json`

```json
{
  "admisión": {
    "nombre": "Formulario de Admisión",
    "destinatarios": ["walter.lozano@vanguardschools.edu.pe"],
    "asunto": "📝 Nueva solicitud de admisión - Vanguard Schools",
    "activo": true
  }
}
```

### Flujo de Envío

1. **Usuario completa el formulario** → Se envía a `/api/formulario?tipo=admisión`
2. **API procesa los datos**:
   - Valida `email` y `nombre` (requeridos)
   - Envía correo a destinatarios configurados
   - Envía correo de confirmación al usuario
   - Guarda registro en log JSONL

3. **Datos enviados al API**:
   ```json
   {
     "nombre": "Nombres Apoderado (Apoderado)",
     "email": "email@ejemplo.com",
     "nombresEstudiante": "...",
     "apellidosEstudiante": "...",
     "nombresApoderado": "...",
     "dniApoderado": "...",
     "telefonoApoderado": "...",
     "emailApoderado": "...",
     "direccionApoderado": "...",
     "grado": "..."
   }
   ```

### Correos Enviados

1. **Correo al colegio**:
   - **Asunto**: `📝 Nueva solicitud de admisión - Vanguard Schools`
   - **Destinatarios**: Configurados en `formularios.json`
   - **Contenido**: HTML con todos los datos del formulario

2. **Correo de confirmación al usuario**:
   - **Asunto**: `✅ Gracias por contactarnos - Vanguard Schools`
   - **Destinatario**: Email del apoderado
   - **Contenido**: Mensaje de confirmación

---

## 🔧 Cómo Modificar el Formulario

### Agregar un Nuevo Campo

1. **Actualizar el estado en `AdmissionForm.tsx`**:
   ```tsx
   const [formData, setFormData] = useState({
     // ... campos existentes
     nuevoCampo: '',
   })
   ```

2. **Agregar el input en el JSX**:
   ```tsx
   <input
     type="text"
     name="nuevoCampo"
     value={formData.nuevoCampo}
     onChange={handleChange}
     // ... otras props
   />
   ```

3. **Limpiar el campo en el reset** (línea ~58-67):
   ```tsx
   setFormData({
     // ... otros campos
     nuevoCampo: '',
   })
   ```

### Modificar los Grados Disponibles

Editar el array `grados` en `components/sections/AdmissionForm.tsx` (líneas 21-36):

```tsx
const grados = [
  'Inicial 03 Años',
  // ... agregar o modificar opciones
]
```

### Cambiar Destinatarios de Correo

Editar `config/formularios.json`:

```json
{
  "admisión": {
    "destinatarios": ["nuevo@email.com", "otro@email.com"],
    // ...
  }
}
```

**Importante**: Si solo cambias `formularios.json`, solo necesitas:
```bash
pm2 restart vanguard-web
```

No necesitas hacer `npm run build` si solo cambias el JSON.

---

## 🚀 Actualización en el Servidor

### Comandos para Actualizar

```bash
cd /var/www/web
git pull origin main
npm run build
pm2 restart vanguard-web
```

### Si Solo Cambias `formularios.json`

```bash
cd /var/www/web
# Subir el archivo por WinSCP o editar directamente
pm2 restart vanguard-web
```

### Si Cambias Código (TypeScript/TSX)

```bash
cd /var/www/web
git pull origin main
npm run build
pm2 restart vanguard-web
```

---

## 📍 Ubicación del Servidor

- **Ruta**: `/var/www/web`
- **Puerto**: `3000`
- **Proceso PM2**: `vanguard-web`
- **Dominio**: `https://vanguardschools.com`
- **URL del formulario**: `https://vanguardschools.com/admision-2026`

---

## 🔍 Verificación

### Verificar que el Formulario Funciona

1. Visitar: `https://vanguardschools.com/admision-2026`
2. Completar el formulario
3. Verificar que llegue el correo al destinatario configurado
4. Verificar que llegue el correo de confirmación al usuario

### Ver Logs del Servidor

```bash
pm2 logs vanguard-web --lines 50
```

### Verificar Estado de PM2

```bash
pm2 status
pm2 info vanguard-web
```

---

## 📝 Notas Importantes

1. **El formulario usa el tipo "admisión"** en la API, no "admision-2026"
2. **El botón en el Hero** tiene color distintivo (purple) para diferenciarlo
3. **Los colores del banner** son naranjas/ámbar más suaves (700 en lugar de 500)
4. **No hay cabecera duplicada** dentro del formulario (solo el banner)
5. **El botón de envío** usa el mismo estilo que todos los demás formularios (azul primario)

---

## 🔗 Referencias Relacionadas

- **Sistema de formularios genérico**: `app/api/formulario/route.ts`
- **Configuración de formularios**: `config/formularios.json`
- **Biblioteca de formularios**: `lib/formularios.ts`
- **Otros formularios similares**:
  - `components/sections/Contact.tsx`
  - `components/sections/VisitForm.tsx`
  - `components/sections/Suggestions.tsx`

---

## 📅 Historial de Cambios

- **2024-12-16**: Creación del formulario de Admisión 2026
  - Banner con degradado suave naranja/ámbar
  - Formulario completo con datos de estudiante y apoderado
  - Integración con sistema de correos
  - Botón distintivo en Hero banner
  - Eliminación de cabecera duplicada
  - Botón de envío con estilo consistente

---

**Última actualización**: 2024-12-16

