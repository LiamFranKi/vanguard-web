#!/bin/bash

# Script de Diagnóstico y Solución SSL para Subdominios
# Ejecutar en el VPS con: bash SOLUCION-SSL.sh

echo "=========================================="
echo "DIAGNÓSTICO SSL - VANGUARD SCHOOLS"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar certificados actuales
echo -e "${YELLOW}[1/7] Verificando certificados SSL actuales...${NC}"
echo ""
sudo certbot certificates
echo ""

# 2. Verificar estado de Nginx
echo -e "${YELLOW}[2/7] Verificando estado de Nginx...${NC}"
sudo systemctl status nginx --no-pager | head -10
echo ""

# 3. Verificar configuración de Nginx
echo -e "${YELLOW}[3/7] Verificando configuración de Nginx...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✓ Configuración de Nginx válida${NC}"
else
    echo -e "${RED}✗ Error en configuración de Nginx${NC}"
fi
echo ""

# 4. Listar subdominios configurados
echo -e "${YELLOW}[4/7] Subdominios configurados en Nginx:${NC}"
sudo grep -r "server_name" /etc/nginx/sites-enabled/ | grep -v "#" | awk '{print $2}' | sed 's/;//' | sort -u
echo ""

# 5. Verificar certificados expirados o próximos a expirar
echo -e "${YELLOW}[5/7] Verificando certificados próximos a expirar...${NC}"
for cert in $(sudo certbot certificates 2>/dev/null | grep "Certificate Name" | awk '{print $3}'); do
    expiry=$(sudo certbot certificates 2>/dev/null | grep -A 5 "$cert" | grep "Expiry Date" | awk '{print $3, $4, $5}')
    echo "  - $cert: $expiry"
done
echo ""

# 6. Verificar logs de errores recientes
echo -e "${YELLOW}[6/7] Últimos errores de Nginx (últimas 20 líneas):${NC}"
sudo tail -20 /var/log/nginx/error.log | grep -i "ssl\|certificate" || echo "  No se encontraron errores SSL recientes"
echo ""

# 7. Recomendaciones
echo -e "${YELLOW}[7/7] RECOMENDACIONES:${NC}"
echo ""
echo "Si algunos subdominios fallan con ERR_CERT_COMMON_NAME_INVALID:"
echo ""
echo "OPCIÓN 1: Renovar certificados existentes"
echo "  sudo certbot renew"
echo "  sudo systemctl reload nginx"
echo ""
echo "OPCIÓN 2: Crear certificado wildcard (recomendado para múltiples subdominios)"
echo "  sudo certbot certonly --manual --preferred-challenges dns \\"
echo "    -d *.vanguardschools.com -d vanguardschools.com"
echo ""
echo "OPCIÓN 3: Crear certificados individuales para subdominios que fallan"
echo "  sudo certbot --nginx -d estadisticas.vanguardschools.com"
echo "  sudo certbot --nginx -d calendar.vanguardschools.com"
echo ""
echo "=========================================="
echo "FIN DEL DIAGNÓSTICO"
echo "=========================================="

