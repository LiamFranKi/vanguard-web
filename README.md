# Vanguard Schools - Sitio Web

Sitio web institucional para Vanguard Schools, desarrollado con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Características

- ✅ Diseño moderno y responsive (móvil, tablet, desktop)
- ✅ SEO optimizado (metadata, sitemap, robots.txt)
- ✅ Sistema de contacto con emails HTML
- ✅ Páginas diferenciadas para cada nivel educativo
- ✅ Navegación intuitiva y moderna
- ✅ Optimizado para rendimiento

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de email para SMTP (Gmail, SendGrid, etc.)

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd web-vanguard
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
SMTP_FROM=noreply@vanguardschools.edu.pe
CONTACT_EMAIL=admin@vanguardschools.edu.pe
NEXT_PUBLIC_SITE_URL=https://www.colegiovanguardschools.com
```

4. Ejecutar en desarrollo:
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## 📦 Construcción para Producción

```bash
npm run build
npm start
```

## 🌐 Despliegue en VPS

### Configuración del Dominio Principal

Si este es el sitio principal del dominio (colegiovanguardschools.com), necesitarás configurar el servidor web (Nginx) para que apunte a esta aplicación.

### Opción 1: Instalación en carpeta (como otros sistemas)

1. **Construir la aplicación:**
```bash
npm run build
```

2. **Crear carpeta en el VPS:**
```bash
mkdir -p /var/www/vanguard-web
```

3. **Copiar archivos necesarios:**
```bash
# Copiar .next, public, package.json, node_modules, etc.
```

4. **Configurar Nginx para subdirectorio:**
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### Opción 2: Dominio Principal (Recomendado)

Si este sitio debe ser el principal del dominio, configura Nginx así:

```nginx
server {
    listen 80;
    server_name colegiovanguardschools.com www.colegiovanguardschools.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Usar PM2 para mantener el proceso activo

```bash
npm install -g pm2
pm2 start npm --name "vanguard-web" -- start
pm2 save
pm2 startup
```

### Configurar SSL con Let's Encrypt

```bash
sudo certbot --nginx -d colegiovanguardschools.com -d www.colegiovanguardschools.com
```

## 📁 Estructura del Proyecto

```
web-vanguard/
├── app/                    # App Router de Next.js
│   ├── api/               # API routes
│   ├── niveles/           # Páginas de niveles educativos
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── sections/          # Secciones de la página
│   ├── Header.tsx         # Header/Navegación
│   └── Footer.tsx         # Footer
├── public/                # Archivos estáticos
└── package.json
```

## 🎨 Personalización

### Colores

Los colores principales se pueden modificar en `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },
  secondary: { ... }
}
```

### Contenido

El contenido de las páginas se puede editar directamente en los archivos de `app/` y `components/`.

## 📧 Configuración de Email

El sistema de contacto requiere configuración SMTP. Para Gmail:

1. Habilitar "Acceso de aplicaciones menos seguras" o crear una "Contraseña de aplicación"
2. Usar esa contraseña en `SMTP_PASS`

Para otros proveedores (SendGrid, Mailgun, etc.), ajusta `SMTP_HOST` y `SMTP_PORT` según corresponda.

## 🔍 SEO

- Metadata optimizada en cada página
- Sitemap automático en `/sitemap.xml`
- Robots.txt configurado
- URLs amigables
- Estructura semántica HTML

## 📱 Responsive Design

El sitio está optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework React con SSR/SSG
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **React Icons** - Iconos
- **Nodemailer** - Envío de emails
- **Zod** - Validación de datos

## 📝 Notas

- Las imágenes de ejemplo deben ser reemplazadas con las reales del colegio
- Los PDFs de lista de útiles deben ser subidos a `/public`
- El video de YouTube debe actualizarse con el link real
- El mapa de Google Maps debe actualizarse con las coordenadas reales

## 📞 Soporte

Para dudas o problemas, contactar al equipo de desarrollo.

---

© 2024 Vanguard Schools - Todos los derechos reservados

