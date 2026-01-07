# 🌐 Configurar DNS en zarkiel.com para vanguardschools.edu.pe

## 📋 Situación

- ✅ Los nameservers de `zarkiel.com` deben mantenerse (usan sistemas secundarios)
- ✅ No podemos cambiar a DNS de la RCP en punto.pe
- ✅ Necesitamos agregar registros A en el panel de **zarkiel.com**

## 🔧 Solución: Configurar Registros A en zarkiel.com

### Paso 1: Acceder al Panel de zarkiel.com

1. **Inicia sesión en el panel de zarkiel.com** (donde gestionas los DNS)
2. **Busca la sección de DNS o "Zona DNS"** para el dominio `vanguardschools.edu.pe`

### Paso 2: Agregar Registros A

Necesitas crear estos registros A:

**Registro 1: Dominio Raíz**
- **Tipo:** `A`
- **Nombre/Host:** `@` (o `vanguardschools.edu.pe`, o déjalo vacío)
- **Valor/IP:** `72.60.172.101`
- **TTL:** `3600` (o el valor por defecto)

**Registro 2: Subdominio www**
- **Tipo:** `A`
- **Nombre/Host:** `www`
- **Valor/IP:** `72.60.172.101`
- **TTL:** `3600` (o el valor por defecto)

### Paso 3: Verificar que no hay conflictos

**IMPORTANTE:** Verifica que estos registros A no entren en conflicto con:
- Otros sistemas que ya estén usando `vanguardschools.edu.pe`
- Si hay algún registro A existente para `@` o `www`, necesitarás decidir:
  - **Opción A:** Reemplazarlo si ya no se usa
  - **Opción B:** Usar un subdominio diferente (ej: `web.vanguardschools.edu.pe`)

### Paso 4: Guardar los cambios

Después de agregar los registros, guarda los cambios en el panel de zarkiel.com.

---

## ⏱️ Tiempo de Propagación

- **zarkiel.com:** Generalmente 1-2 horas
- **Propagación global:** 2-4 horas

---

## ✅ Verificar DNS

Después de configurar, verifica con:

**Desde tu computadora (Windows PowerShell):**
```powershell
nslookup vanguardschools.edu.pe
nslookup www.vanguardschools.edu.pe
```

**O usa herramientas online:**
- https://dnschecker.org/#A/vanguardschools.edu.pe
- https://www.whatsmydns.net/#A/vanguardschools.edu.pe

**Todos deberían mostrar:** `72.60.172.101`

---

## 🔒 Paso 5: Configurar SSL (Después de que se propaguen los DNS)

Una vez que los DNS se hayan propagado (2-4 horas), ejecuta en el VPS:

```bash
ssh root@72.60.172.101
sudo certbot --nginx -d vanguardschools.com -d www.vanguardschools.com -d vanguardschools.edu.pe -d www.vanguardschools.edu.pe
```

Esto agregará el dominio `.edu.pe` al certificado SSL existente.

---

## 🐛 Si no puedes acceder al panel de zarkiel.com

Si no tienes acceso al panel de zarkiel.com, tendrías que:

1. **Contactar al administrador de zarkiel.com** para que agregue los registros A
2. **O usar DNS subordinados en punto.pe** (si está disponible)

---

## 📝 Notas Importantes

- ⚠️ **NO eliminar los nameservers de zarkiel.com** (usan sistemas secundarios)
- ✅ **Agregar registros A en zarkiel.com** para `@` y `www`
- ✅ **Los sistemas secundarios seguirán funcionando** (solo agregamos registros nuevos)
- ✅ **Nginx ya está configurado** para aceptar `vanguardschools.edu.pe`

---

**Última actualización:** 2024-12-16




