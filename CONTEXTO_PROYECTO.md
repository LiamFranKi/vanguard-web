# Contexto Completo del Proyecto - Vanguard Schools Web

## 📌 Información General del Proyecto

- **Nombre**: Vanguard Schools - Sitio Web Institucional
- **Tecnología**: Next.js 14.2.35 (React + TypeScript)
- **Estilos**: Tailwind CSS
- **Deployment**: VPS Hostinger
- **Repositorio**: https://github.com/LiamFranKi/vanguard-web

---

## 🏗️ Estructura del Proyecto

### Directorios Principales

```
web-vanguard/
├── app/                    # Páginas y rutas Next.js (App Router)
│   ├── api/               # API Routes
│   ├── niveles/           # Páginas de niveles educativos
│   └── [páginas].tsx      # Otras páginas
├── components/             # Componentes React reutilizables
│   └── sections/          # Secciones de páginas
├── config/                 # Archivos de configuración JSON
├── lib/                    # Utilidades y helpers
├── public/                 # Archivos estáticos
└── data/                   # Datos generados (logs, uploads)
```

---

## 📧 Sistema de Formularios

### Configuración Centralizada

**Archivo**: `config/formularios.json`

Todos los formularios están configurados aquí con:
- Destinatarios de correo
- Asuntos con iconos emoji
- Estado activo/inactivo

### Formularios Disponibles

1. **Contacto** (`tipo=contacto`)
   - Asunto: `📧 Nuevo contacto desde la web - Vanguard Schools`
   - API: `/api/formulario?tipo=contacto`

2. **Admisión** (`tipo=admisión`)
   - Asunto: `📝 Nueva solicitud de admisión - Vanguard Schools`
   - API: `/api/formulario?tipo=admisión`
   - **Ver**: `REFERENCIA_ADMISION_2026.md` para detalles completos

3. **Sugerencias** (`tipo=sugerencias`)
   - Asunto: `💡 Nueva sugerencia - Vanguard Schools`
   - API: `/api/formulario?tipo=sugerencias`

4. **Trabaja con Nosotros** (`tipo=trabaja-con-nosotros`)
   - Asunto: `💼 Nueva postulación - Vanguard Schools`
   - API: `/api/trabaja-con-nosotros` (ruta especial con adjuntos)

5. **Visita Guiada** (`tipo=visita-guiada`)
   - Asunto: `🗓️ Nueva reserva de visita guiada - Vanguard Schools`
   - API: `/api/formulario?tipo=visita-guiada`

6. **Chat** (`tipo=chat`)
   - Asunto: `💬 Nuevo mensaje de chat - Vanguard Schools`
   - API: `/api/chat`

### API Genérica de Formularios

**Archivo**: `app/api/formulario/route.ts`

- **Endpoint**: `POST /api/formulario?tipo=[tipo]`
- **Funcionalidad**:
  - Lee configuración de `config/formularios.json`
  - Valida email y nombre
  - Envía correos a destinatarios
  - Envía correo de confirmación al usuario
  - Guarda logs en `data/formularios/[tipo].log`

---

## 🎨 Sistema de Diseño

### Colores Principales

- **Primary (Azul)**: `primary-600`, `primary-700`, `primary-800`
  - Usado en: Botones, enlaces, acentos
- **Amber/Naranja**: `amber-500` a `amber-800`
  - Usado en: Banner de Admisión 2026
- **Cyan/Sky**: `cyan-300`, `sky-300`, `blue-300`
  - Usado en: Secciones de contacto

### Componentes Reutilizables

- `components/Header.tsx` - Navegación principal
- `components/Footer.tsx` - Pie de página
- `components/ChatWidget.tsx` - Widget de chat en línea
- `components/VideoModal.tsx` - Modal para videos
- `components/StructuredData.tsx` - JSON-LD para SEO

---

## 📄 Páginas Principales

### Páginas de Niveles Educativos

- `/niveles/inicial` - Educación Inicial
- `/niveles/primaria` - Educación Primaria
- `/niveles/secundaria` - Educación Secundaria

### Páginas de Servicios

- `/contacto` - Formulario de contacto
- `/admision-2026` - Formulario de admisión 2026
- `/visita-guiada` - Reserva de visita guiada
- `/sugerencias` - Formulario de sugerencias
- `/trabaja-con-nosotros` - Postulaciones laborales

### Páginas Informativas

- `/preguntas-frecuentes` - FAQs
- `/convenios` - Convenios institucionales
- `/documentos` - Documentos descargables
- `/lista-utiles` - Lista de útiles escolares

---

## 🔐 Configuración de Correos

### Variables de Entorno (`.env`)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=walterlozanoalcalde@gmail.com
SMTP_PASS=[app password de Gmail]
NEXT_PUBLIC_SITE_URL=https://www.vanguardschools.com
NODE_ENV=production
```

### Configuración de Remitente

**Archivo**: `config/formularios.json`

```json
{
  "configuracion": {
    "email_from": "noreply@vanguardschools.edu.pe",
    "nombre_remitente": "Vanguard Schools",
    "reply_to": "walter.lozano@vanguardschools.edu.pe"
  }
}
```

---

## 🚀 Deployment en VPS

### Información del Servidor

- **Host**: 72.60.172.101
- **Puerto SSH**: 22
- **Usuario**: root
- **Ruta del Proyecto**: `/var/www/web`
- **Puerto de la App**: 3000
- **Proceso PM2**: `vanguard-web`
- **Dominio**: `vanguardschools.com`

### Comandos de Deployment

#### Actualización Completa (cambios de código)

```bash
cd /var/www/web
git pull origin main
npm run build
pm2 restart vanguard-web
```

#### Actualización Solo de Configuración (JSON)

```bash
cd /var/www/web
# Editar archivo o subir por WinSCP
pm2 restart vanguard-web
```

#### Verificar Estado

```bash
pm2 status
pm2 logs vanguard-web --lines 50
curl http://localhost:3000
```

### Nginx Configuration

**Archivo**: `/etc/nginx/sites-available/vanguardschools.com`

Proxy reverso que redirige `vanguardschools.com` → `localhost:3000`

### SSL/HTTPS

Configurado con Certbot/Let's Encrypt
- Certificado renovado automáticamente
- Dominios: `vanguardschools.com` y `www.vanguardschools.com`

---

## 📁 Archivos Importantes

### Archivos de Configuración

- `config/formularios.json` - Configuración de formularios
- `config/faqs.json` - Preguntas frecuentes
- `.env` - Variables de entorno (no en Git)
- `tailwind.config.ts` - Configuración de Tailwind
- `next.config.js` - Configuración de Next.js

### Archivos de Documentación

- `REFERENCIA_ADMISION_2026.md` - Referencia del formulario de admisión
- `DEPLOY_VPS.md` - Guía de deployment
- `SEO_MEJORAS.md` - Recomendaciones SEO
- `CHANGELOG.md` - Historial de cambios

### Archivos Excluidos de Git

- `.env` - Variables de entorno
- `public/video-vanguard.mp4` - Video grande (subir por WinSCP)
- `public/mapa-vanguard.mp4` - Video grande (subir por WinSCP)
- `data/` - Logs y archivos generados
- `node_modules/` - Dependencias

---

## 🔧 Comandos Útiles

### Desarrollo Local

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter
```

### Git

```bash
git status           # Ver cambios
git add .            # Agregar cambios
git commit -m "..."   # Hacer commit
git push origin main # Subir a GitHub
git pull origin main # Descargar de GitHub
```

### PM2 (en servidor)

```bash
pm2 start npm --name "vanguard-web" -- start
pm2 restart vanguard-web
pm2 stop vanguard-web
pm2 logs vanguard-web
pm2 status
pm2 save
```

---

## 📊 SEO Implementado

### Metadata

- Configurado en `app/layout.tsx` (global)
- Configurado en cada página individual
- Incluye: title, description, keywords, Open Graph, Twitter Cards

### Structured Data (JSON-LD)

- Componente: `components/StructuredData.tsx`
- Schema: EducationalOrganization, School
- Ubicado en el `<body>` del layout principal

### Sitemap y Robots

- `app/sitemap.ts` - Genera sitemap.xml dinámicamente
- `app/robots.ts` - Configura robots.txt

---

## 🐛 Troubleshooting Común

### Error: "Formulario no encontrado"

- Verificar que el tipo existe en `config/formularios.json`
- Verificar que `activo: true`

### Error: "Email no se envía"

- Verificar variables de entorno SMTP
- Verificar logs: `pm2 logs vanguard-web`
- Verificar que el email de Gmail tenga "App Password" habilitado

### Error: "Puerto 3000 en uso"

```bash
sudo netstat -tulpn | grep 3000
# Matar proceso si es necesario
kill -9 [PID]
```

### Error: "Build falla"

- Verificar que todas las dependencias estén instaladas: `npm install`
- Verificar errores de TypeScript/ESLint
- Verificar que `.env` esté configurado

---

## 📝 Notas de Desarrollo

### Convenciones

- **Componentes**: PascalCase (`AdmissionForm.tsx`)
- **Archivos de página**: kebab-case (`admision-2026/page.tsx`)
- **API Routes**: kebab-case (`trabaja-con-nosotros/route.ts`)
- **Hooks**: `use` prefix (`useState`, `useEffect`)

### Estilos

- Usar Tailwind CSS utility classes
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Colores: usar variables de Tailwind config

### Formularios

- Validación en cliente (HTML5) y servidor
- Estado de envío: `idle`, `success`, `error`
- Mensajes de feedback al usuario

---

## 🔗 Enlaces Importantes

- **Sitio Web**: https://vanguardschools.com
- **Intranet**: https://nuevo.vanguardschools.edu.pe/login
- **GitHub**: https://github.com/LiamFranKi/vanguard-web
- **VPS**: 72.60.172.101:22

---

## 📅 Historial de Cambios Importantes

- **2024-12-16**: Implementación de formulario Admisión 2026
- **2024-12-16**: Actualización de iconos en asuntos de correos
- **2024-12-16**: Configuración de botón Intranet en header
- **2024-12-16**: Implementación de SEO (sitemap, robots, structured data)
- **2024-12-16**: Deployment inicial en VPS Hostinger

---

**Última actualización**: 2024-12-16

