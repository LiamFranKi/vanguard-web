# Partes Administrables del Sitio Web

## 📝 Resumen

Este sitio web tiene **algunas partes administrables** y otras que son estáticas. A continuación se detalla qué se puede administrar y qué requiere edición de código.

## ✅ Partes Administrables (Futuro CMS)

Las siguientes secciones están preparadas para ser administrables, pero actualmente requieren edición de código:

### 1. Contenido de la Página Principal

**Ubicación:** `components/sections/`

- **Hero Section** (`Hero.tsx`): Título principal, subtítulo, botones
- **About Section** (`About.tsx`): Misión, visión, valores
- **Features Section** (`Features.tsx`): Características del colegio
- **Video Section** (`VideoSection.tsx`): Link del video de YouTube

### 2. Páginas de Niveles Educativos

**Ubicación:** `app/niveles/`

- **Educación Inicial** (`inicial/page.tsx`)
- **Educación Primaria** (`primaria/page.tsx`)
- **Educación Secundaria** (`secundaria/page.tsx`)

Cada página tiene:
- Descripción del nivel
- Características
- Programa educativo
- Edades

### 3. Página de Convenios

**Ubicación:** `app/convenios/page.tsx`

- Información de cada convenio
- Beneficios
- Descripciones

### 4. Lista de Útiles

**Ubicación:** `app/lista-utiles/page.tsx`

- Actualmente muestra botones de descarga
- Los PDFs deben subirse a `/public/utiles/`

### 5. Documentos

**Ubicación:** `app/documentos/page.tsx`

- Lista de documentos disponibles
- Links de descarga

## 🔧 Partes que Requieren Edición de Código

### 1. Estructura del Menú

**Ubicación:** `components/Header.tsx`

Para agregar/quitar páginas del menú, editar el componente Header.

### 2. Información de Contacto

**Ubicación:** Múltiples archivos

- Teléfonos, dirección, email aparecen en:
  - `components/Header.tsx`
  - `components/Footer.tsx`
  - `components/sections/Contact.tsx`
  - `app/visita-guiada/page.tsx`

### 3. Redes Sociales

**Ubicación:** `components/Footer.tsx`

Los links de redes sociales están hardcodeados.

### 4. Logo

**Ubicación:** `components/Header.tsx` y `components/Footer.tsx`

Actualmente muestra un placeholder con "VS". Debe reemplazarse con el logo real.

## 🚀 Implementación Futura de CMS

Para hacer estas partes completamente administrables, se puede implementar:

### Opción 1: Base de Datos Simple

- Crear tablas en PostgreSQL para:
  - `pages` (contenido de páginas)
  - `sections` (secciones de la página principal)
  - `documents` (documentos descargables)
  - `settings` (configuración general)

### Opción 2: Archivos JSON

- Almacenar contenido en archivos JSON
- Panel de administración simple para editar JSON
- Más fácil de implementar, menos escalable

### Opción 3: Headless CMS

- Integrar con Strapi, Contentful, o Sanity
- Panel de administración completo
- Más profesional pero requiere más configuración

## 📋 Checklist de Contenido a Actualizar

Antes de lanzar, actualizar:

- [ ] Logo del colegio (reemplazar placeholder "VS")
- [ ] Imágenes reales del colegio
- [ ] Video de YouTube (link real)
- [ ] Coordenadas del mapa de Google Maps
- [ ] Información de contacto (verificar teléfonos, dirección, email)
- [ ] Links de redes sociales
- [ ] PDFs de lista de útiles
- [ ] Documentos descargables
- [ ] Contenido de misión, visión, valores
- [ ] Descripciones de niveles educativos
- [ ] Información de convenios

## 🔐 Panel de Administración (Futuro)

Si se implementa un CMS, el panel de administración debería permitir:

1. **Gestión de Contenido:**
   - Editar texto de secciones
   - Subir imágenes
   - Gestionar documentos

2. **Gestión de Páginas:**
   - Editar contenido de páginas de niveles
   - Activar/desactivar páginas

3. **Configuración:**
   - Información de contacto
   - Redes sociales
   - Logo

4. **Mensajes de Contacto:**
   - Ver mensajes recibidos
   - Responder desde el panel

## 📝 Notas

- El formulario de contacto **ya funciona** y envía emails
- Los emails se envían automáticamente cuando alguien completa el formulario
- No se almacenan los mensajes en base de datos (solo se envían por email)

