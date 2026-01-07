# 🌐 Configuración de Nginx para vanguardschools.com

## Paso 1: Ver configuración actual

```bash
cat /etc/nginx/sites-available/default
```

## Paso 2: Ver si el archivo vanguardschools.com está habilitado

```bash
ls -la /etc/nginx/sites-enabled/ | grep vanguardschools
```

## Paso 3: Editar el archivo vanguardschools.com

```bash
sudo nano /etc/nginx/sites-available/vanguardschools.com
```

**Pegar esta configuración:**

```nginx
server {
    listen 80;
    server_name vanguardschools.com www.vanguardschools.com;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Guardar:** Ctrl+X, Y, Enter

## Paso 4: Habilitar el sitio (si no está habilitado)

```bash
sudo ln -s /etc/nginx/sites-available/vanguardschools.com /etc/nginx/sites-enabled/
```

## Paso 5: Verificar sintaxis

```bash
sudo nginx -t
```

## Paso 6: Recargar Nginx

```bash
sudo systemctl reload nginx
```

## Paso 7: Verificar que funciona

```bash
curl -H "Host: vanguardschools.com" http://localhost
```

O abrir en navegador: `http://vanguardschools.com`

