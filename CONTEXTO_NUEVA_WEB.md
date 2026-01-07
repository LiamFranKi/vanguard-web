# 🌐 Contexto para Nueva Web - VPS Hostinger

## 📋 Información General

Este es un **nuevo proyecto web** que se creará en una **carpeta separada** dentro del mismo VPS donde ya existe el proyecto de Vanguard Schools.

**IMPORTANTE:** Este proyecto NO debe interferir con los sistemas existentes. Debe revisar cuidadosamente la configuración antes de hacer cambios.

---

## 🏗️ Estructura del VPS Actual

### Sistema Principal Existente
- **Carpeta:** `/var/www/web/`
- **Dominio:** `vanguardschools.com` y `vanguardschools.edu.pe`
- **Puerto:** `3000`
- **Proceso PM2:** `vanguard-web`
- **Tecnología:** Next.js 14, TypeScript, Tailwind CSS

### Subdominios Existentes (NO TOCAR)
- `calendar.vanguardschools.com` → Puerto específico
- `canchas.vanguardschools.com` → Puerto `5006`
- `intranet.vanguardschools.com` → Puerto específico
- `secretaria.vanguardschools.edu.pe` → Puerto específico
- `encuestas.vanguardschools.com` → Puerto específico
- `estadisticas.vanguardschools.com` → Puerto específico
- `rendiciones.vanguardschools.com` → Puerto específico

**⚠️ NO modificar ninguna configuración de estos subdominios.**

---

## 🆕 Nueva Web - Información

### Características
- **Carpeta:** `/var/www/nueva-web/` (o el nombre que se defina)
- **Dominio:** [DOMINIO DE GODADDY - El usuario proporcionará]
- **Puerto:** [VERIFICAR PUERTO LIBRE - Ver sección de verificación]
- **Proceso PM2:** [nombre-del-proyecto] (definir según el proyecto)

### Tecnologías a Usar
- **Next.js 14+** (React Framework)
- **TypeScript**
- **Tailwind CSS**
- **React Icons**
- **Nodemailer** (para formularios si es necesario)
- **Zod** (para validación)

### Herramientas del Usuario
- **GitHub:** Para versionado de código
- **WinSCP:** Para subir archivos al servidor
- **PuTTY:** Para ejecutar comandos en el servidor

---

## 📝 Comandos NPM Requeridos

### package.json debe incluir:

```json
{
  "scripts": {
    "dev": "next dev",
    "kill": "npx kill-port [PUERTO]",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Notas:**
- `npm run kill` → Cierra el puerto específico que use la aplicación
- `npm run dev` → Levanta el servidor de desarrollo en un solo comando
- Reemplazar `[PUERTO]` con el puerto que se asigne a esta aplicación

---

## 🔍 Verificación de Puertos ANTES de Configurar

### Paso 1: Verificar Puertos Libres

**Conectarse por PuTTY y ejecutar:**

```bash
ssh root@72.60.172.101

# Ver todos los puertos en uso
sudo netstat -tulpn | grep LISTEN

# O más específico para puertos comunes de Node.js
sudo netstat -tulpn | grep LISTEN | grep -E ':(300[0-9]|301[0-9]|400[0-9]|500[0-9])'
```

**Puertos ya en uso (NO usar):**
- `3000` → vanguard-web (sistema principal)
- `5006` → canchas-backend
- Otros puertos según los subdominios

**Elegir un puerto libre** (ejemplos: `3001`, `3002`, `4000`, `4001`, etc.)

### Paso 2: Verificar Configuración de Nginx Actual

```bash
# Ver todas las configuraciones existentes
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Ver configuración del dominio principal (para referencia)
cat /etc/nginx/sites-available/vanguardschools.com

# Verificar sintaxis de Nginx
sudo nginx -t
```

**⚠️ NO modificar archivos existentes de Nginx sin revisar primero.**

---

## 🌐 Configuración de DNS en GoDaddy

### Paso 1: Obtener IP del VPS
- **IP:** `72.60.172.101`

### Paso 2: Configurar Registros A en GoDaddy
1. Iniciar sesión en https://www.godaddy.com
2. Ir a "Mis Productos" → Seleccionar el dominio
3. Ir a "DNS" o "Administrar DNS"
4. Agregar registros A:
   - **Tipo:** `A`
   - **Nombre:** `@` (dominio raíz)
   - **Valor:** `72.60.172.101`
   - **TTL:** `600`
   
   - **Tipo:** `A`
   - **Nombre:** `www`
   - **Valor:** `72.60.172.101`
   - **TTL:** `600`

⏱️ **Tiempo de propagación:** 1-4 horas

---

## 🖥️ Configuración de Nginx para Nueva Web

### Crear Archivo de Configuración

```bash
sudo nano /etc/nginx/sites-available/nuevo-dominio.com
```

**Reemplazar `nuevo-dominio.com` con el dominio real de GoDaddy.**

### Configuración Base (Ajustar según necesidades)

```nginx
# Bloque HTTPS
server {
    listen 443 ssl http2;
    server_name nuevo-dominio.com www.nuevo-dominio.com;

    # Certificados SSL (se configurarán con Certbot después)
    # ssl_certificate /etc/letsencrypt/live/nuevo-dominio.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/nuevo-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:[PUERTO];  # ← CAMBIAR AL PUERTO LIBRE
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Bloque HTTP - Redirige a HTTPS
server {
    listen 80;
    server_name nuevo-dominio.com www.nuevo-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

**Puntos importantes:**
- ✅ Usar el puerto libre que se verificó anteriormente
- ✅ NO agregar `default_server` (ese es solo para vanguardschools.com)
- ✅ NO modificar configuraciones existentes

### Habilitar el Sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/nuevo-dominio.com /etc/nginx/sites-enabled/

# Verificar sintaxis
sudo nginx -t

# Si está OK, recargar Nginx (NO reiniciar)
sudo systemctl reload nginx
```

---

## 🔒 Configurar SSL con Let's Encrypt

**Esperar a que los DNS se propaguen** (1-4 horas), luego:

```bash
sudo certbot --nginx -d nuevo-dominio.com -d www.nuevo-dominio.com
```

**Reemplazar `nuevo-dominio.com` con el dominio real.**

---

## 📦 Estructura del Proyecto

### Crear Carpeta en el VPS

```bash
# Crear carpeta para la nueva web
sudo mkdir -p /var/www/nueva-web

# Dar permisos
sudo chown -R $USER:$USER /var/www/nueva-web
# O si usa www-data:
# sudo chown -R www-data:www-data /var/www/nueva-web
```

### Estructura Recomendada

```
nueva-web/
├── app/                    # App Router de Next.js
│   ├── api/               # API routes (si es necesario)
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   └── sections/          # Secciones de la página
├── config/                # Archivos de configuración JSON (si es necesario)
├── lib/                   # Utilidades y helpers
├── public/                # Archivos estáticos
├── package.json
└── .env                   # Variables de entorno (NO subir a GitHub)
```

---

## 🚀 Proceso de Desarrollo

### 1. Desarrollo Local
```bash
# Clonar desde GitHub
git clone [URL_DEL_REPOSITORIO] nueva-web
cd nueva-web

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
# Editar .env con las credenciales necesarias

# Iniciar desarrollo
npm run dev
```

### 2. Subir al VPS con WinSCP
- Conectar a `72.60.172.101` (usuario `root`)
- Subir archivos a `/var/www/nueva-web/`
- O usar Git en el servidor: `git clone [URL] /var/www/nueva-web`

### 3. Configurar en el VPS
```bash
cd /var/www/nueva-web

# Instalar dependencias
npm install

# Construir para producción
npm run build

# Iniciar con PM2
pm2 start npm --name "nombre-proyecto" -- start -- --port [PUERTO_LIBRE]

# Guardar configuración PM2
pm2 save
pm2 startup
```

---

## 📋 Guía de Contenido

### El usuario proporcionará URLs de referencia

**IMPORTANTE:** El usuario proporcionará URLs o referencias para entender:
- De qué trata la web
- Qué contenido debe tener
- Qué funcionalidades necesita
- Diseño y estilo deseado

**Tareas:**
1. ✅ Revisar las URLs proporcionadas
2. ✅ Analizar el contenido y propósito
3. ✅ Crear una web espectacular basada en esas referencias
4. ✅ Implementar todas las funcionalidades necesarias
5. ✅ Asegurar diseño moderno y responsive

---

## ⚠️ Reglas de Oro - NO HACER

1. ❌ **NO modificar** configuraciones de Nginx existentes sin revisar primero
2. ❌ **NO usar** puertos ya ocupados (verificar siempre antes)
3. ❌ **NO agregar** `default_server` a la nueva configuración
4. ❌ **NO modificar** archivos de otros sistemas/subdominios
5. ❌ **NO reiniciar** Nginx sin verificar sintaxis primero (`sudo nginx -t`)
6. ❌ **NO tocar** `/var/www/web/` (sistema principal de Vanguard Schools)
7. ❌ **NO modificar** procesos PM2 de otros sistemas

---

## ✅ Checklist de Verificación

Antes de hacer cualquier cambio en el servidor:

- [ ] Verificar puerto libre con `netstat`
- [ ] Verificar configuración actual de Nginx
- [ ] Verificar procesos PM2 existentes (`pm2 status`)
- [ ] Crear carpeta nueva (no usar carpetas existentes)
- [ ] Configurar Nginx con puerto correcto
- [ ] Verificar sintaxis de Nginx (`sudo nginx -t`)
- [ ] Recargar Nginx (no reiniciar)
- [ ] Configurar SSL después de propagación DNS
- [ ] Verificar que otros sistemas siguen funcionando

---

## 📞 Información del VPS

- **Host:** `72.60.172.101`
- **Puerto SSH:** `22`
- **Usuario:** `root`
- **Sistema Operativo:** Ubuntu 22.04.5 LTS
- **Nginx:** Instalado y configurado
- **PM2:** Instalado y en uso
- **Node.js:** Versión 18+ (verificar con `node --version`)

---

## 🔗 Referencias Útiles

### Comandos PM2
```bash
pm2 status              # Ver todos los procesos
pm2 logs [nombre]       # Ver logs de un proceso
pm2 restart [nombre]    # Reiniciar un proceso
pm2 stop [nombre]       # Detener un proceso
pm2 start [nombre]      # Iniciar un proceso
```

### Comandos Nginx
```bash
sudo nginx -t           # Verificar sintaxis
sudo systemctl reload nginx  # Recargar configuración
sudo systemctl status nginx  # Ver estado
sudo tail -f /var/log/nginx/error.log  # Ver errores
```

### Comandos Git
```bash
git status              # Ver cambios
git add .               # Agregar cambios
git commit -m "mensaje" # Hacer commit
git push origin main    # Subir a GitHub
git pull origin main    # Descargar de GitHub
```

---

## 📝 Notas Finales

- **Siempre verificar antes de modificar**
- **Hacer backups si es necesario**
- **Probar en desarrollo antes de producción**
- **Documentar cambios importantes**
- **Comunicar al usuario cualquier problema o duda**

---

**Última actualización:** 2025-01-XX

**Cuando el usuario abra esta carpeta, debe leer este archivo primero para entender el contexto completo antes de comenzar a trabajar.**



