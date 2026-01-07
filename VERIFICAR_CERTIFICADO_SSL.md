# 🔍 Verificar Certificado SSL para vanguardschools.edu.pe

## 🔍 Problema

El error `NET::ERR_CERT_COMMON_NAME_INVALID` significa que el certificado SSL no incluye el dominio `.edu.pe`.

## 🔧 PASO 1: Verificar la Configuración de vanguardschools.com

```bash
ssh root@72.60.172.101
cat /etc/nginx/sites-available/vanguardschools.com
```

**Verificar que tiene `vanguardschools.edu.pe` en el `server_name`.**

## 🔧 PASO 2: Verificar Certificados SSL Instalados

```bash
sudo certbot certificates
```

**Ver qué dominios están incluidos en el certificado.**

## 🔧 PASO 3: Verificar que los DNS se Propagaron

```bash
nslookup vanguardschools.edu.pe
nslookup www.vanguardschools.edu.pe
```

**Deberían mostrar `72.60.172.101`.**

## 🔧 PASO 4: Agregar .edu.pe al Certificado SSL

Si los DNS ya se propagaron, ejecutar Certbot:

```bash
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com -d vanguardschools.edu.pe -d www.vanguardschools.edu.pe
```

**Esto expandirá el certificado para incluir `.edu.pe`.**

## 🔧 PASO 5: Verificar que Nginx se Actualizó Correctamente

```bash
# Verificar sintaxis
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx

# Ver la configuración actualizada
cat /etc/nginx/sites-available/vanguardschools.com | grep -A 5 "ssl_certificate"
```




