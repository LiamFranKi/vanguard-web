# Guia: subir otra web al VPS Zarkiel (GoDaddy + Apache + PM2)

**IP del VPS:** 89.117.52.9  
**Usuario SSH habitual:** vanguard  
**Herramientas:** PuTTY (comandos) y WinSCP (archivos)

En este servidor **Apache** usa los puertos **80** y **443**. Hay varios sistemas activos; no los mezcles ni los apagues.

---

## Reglas de oro (no romper intranet ni otros sitios)

**NO hacer:**

- systemctl stop apache2 ni disable apache2
- pm2 restart all ni pm2 delete all
- Editar VirtualHosts de otros sitios (intranet.*, yaprofe.*, vanguardschools.*, sistema.*, etc.)
- Reutilizar un puerto que ya este en uso

**SI hacer:**

- Carpeta nueva, PM2 con **nombre nuevo**, puerto **nuevo**
- VirtualHost Apache **solo** para tu dominio nuevo
- sudo apache2ctl configtest antes de sudo systemctl reload apache2
- Usar reload, no reiniciar Apache de forma brusca si no es necesario

---

## Mapa de sistemas ya instalados

| Sistema | Carpeta / nota | Puerto | Metodo |
|--------|----------------|--------|--------|
| Intranet 2026 | intranet.vanguardschools.edu.pe | (varios) | Apache -> app (PM2 intranet2026-backend) |
| YaProfe | /home/vanguard/yaprofe/dist | 4000 (API) | Apache sirve dist + proxy /api -> 4000 |
| Vanguard Schools | /home/vanguard/web-vanguard | 3010 | Apache proxy -> PM2 vanguard-web-test (Next.js) |
| Otros .edu.pe | api, sistema, tour, mysql... | (varios) | VirtualHosts Apache aparte |

**Nginx** puede existir en el servidor, pero **no** atiende el trafico publico en 80/443; eso lo hace **Apache**.

Antes de elegir puerto para tu web nueva, en PuTTY:

```bash
sudo ss -tulpn | grep LISTEN
pm2 list
```

Elige un puerto libre (ejemplos si estan libres: 3011, 3012, 3020, 4001).

---

## Paso 1 - DNS en GoDaddy

1. Entra a godaddy.com -> Mis productos -> tu dominio -> DNS.
2. Crea o edita registros **A**:

| Tipo | Nombre/Host | Valor/IP | TTL |
|------|-------------|----------|-----|
| A | @ | 89.117.52.9 | 600 o default |
| A | www | 89.117.52.9 | 600 o default |

3. **No borres** registros MX, TXT ni CNAME de correo si el dominio usa email.
4. Espera propagacion: 15 min - 4 h (a veces mas).
5. Verifica en tu PC (CMD o PowerShell):

```text
nslookup tudominio.com
nslookup www.tudominio.com
```

Debe mostrar: 89.117.52.9

---

## Paso 2 - Carpeta y codigo en el VPS (PuTTY)

Reemplaza NOMBRE_CARPETA y URL_GIT por los tuyos.

```bash
mkdir -p /home/vanguard/NOMBRE_CARPETA
cd /home/vanguard/NOMBRE_CARPETA
git clone URL_GIT .
```

**Si es Node / Next.js:**

```bash
npm install
nano .env
npm run build
```

**Si es React/Vite estatico (como YaProfe):**

```bash
npm install
npm run build
```

La carpeta dist sera el DocumentRoot en Apache.

---

## Paso 3 - PM2 (solo si la app es Node / Next / API)

Usa **nombre** y **puerto** unicos. Ejemplo puerto 3012:

```bash
cd /home/vanguard/NOMBRE_CARPETA
PORT=3012 pm2 start npm --name "mi-web-nueva" -- start
pm2 save
pm2 list
```

Probar **antes** de configurar Apache:

```bash
curl -I http://127.0.0.1:3012
```

Si no responde 200, no sigas hasta arreglar la app.

**Actualizar despues:**

```bash
cd /home/vanguard/NOMBRE_CARPETA
git pull
npm install
npm run build
pm2 restart mi-web-nueva
```

---

## Paso 4 - Apache VirtualHost (obligatorio en este VPS)

Crea un archivo **nuevo** (no edites los de otros dominios):

```bash
sudo nano /etc/apache2/sites-available/tudominio.com.conf
```

### Opcion A - App Node/Next (proxy a PM2, como vanguardschools.com)

```apache
<VirtualHost *:80>
    ServerName tudominio.com
    ServerAlias www.tudominio.com

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:PUERTO/
    ProxyPassReverse / http://127.0.0.1:PUERTO/

    ErrorLog ${APACHE_LOG_DIR}/tudominio.com-error.log
    CustomLog ${APACHE_LOG_DIR}/tudominio.com-access.log combined
</VirtualHost>
```

Cambia PUERTO por el de PM2 (ej. 3012).

### Opcion B - Sitio estatico (build, como yaprofe.com)

```apache
<VirtualHost *:80>
    ServerName tudominio.com
    ServerAlias www.tudominio.com

    DocumentRoot /home/vanguard/NOMBRE_CARPETA/dist

    <Directory /home/vanguard/NOMBRE_CARPETA/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    FallbackResource /index.html
</VirtualHost>
```

Activar:

```bash
sudo a2enmod proxy proxy_http headers
sudo a2ensite tudominio.com.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Probar:

```bash
curl -I http://tudominio.com
```

---

## Paso 5 - HTTPS (Certbot + Apache)

Cuando el DNS ya apunte a 89.117.52.9:

```bash
sudo certbot --apache -d tudominio.com -d www.tudominio.com
```

Verificar:

```bash
curl -I https://tudominio.com
```

En .env de la app (si aplica):

```env
NEXT_PUBLIC_SITE_URL=https://www.tudominio.com
```

Luego npm run build y pm2 restart mi-web-nueva.

---

## Checklist final

- [ ] DNS @ y www -> 89.117.52.9
- [ ] Codigo en /home/vanguard/NOMBRE_CARPETA
- [ ] PM2 online con nombre unico (si aplica)
- [ ] curl http://127.0.0.1:PUERTO -> 200
- [ ] VirtualHost Apache nuevo habilitado
- [ ] apache2ctl configtest -> Syntax OK
- [ ] systemctl reload apache2
- [ ] Certbot HTTPS
- [ ] Intranet y YaProfe siguen funcionando
- [ ] Probar el dominio nuevo en ventana de incognito

---

## Comandos utiles de diagnostico

```bash
pm2 list
sudo ss -tulpn | grep -E ':80|:443'
sudo apache2ctl -S
curl -I http://127.0.0.1:PUERTO
curl -I https://tudominio.com
curl -I https://intranet.vanguardschools.edu.pe
curl -I https://yaprofe.com
```

---

## Una linea para actualizar una web Node ya desplegada

```bash
cd /home/vanguard/CARPETA && git pull && npm install && npm run build && pm2 restart NOMBRE_PM2
```

---

## Resumen rapido

1. GoDaddy: A @ y www -> 89.117.52.9
2. Clonar en /home/vanguard/NOMBRE_CARPETA
3. PM2 en puerto nuevo (si es Node)
4. Apache VirtualHost nuevo -> ese puerto o dist
5. certbot --apache
6. No tocar intranet, YaProfe ni Vanguard
