# 🛡️ Guía de Desarrollo Seguro - Evitar Errores Comunes

## 📋 Tabla de Contenidos

1. [Proceso de Desarrollo Recomendado](#proceso-de-desarrollo-recomendado)
2. [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)
3. [Checklist Antes de Subir Cambios](#checklist-antes-de-subir-cambios)
4. [Troubleshooting Rápido](#troubleshooting-rápido)
5. [Mejores Prácticas](#mejores-prácticas)

---

## 🚀 Proceso de Desarrollo Recomendado

### Paso 1: Desarrollo Local

**SIEMPRE prueba localmente antes de subir al servidor:**

```bash
# 1. Hacer cambios en el código
# 2. Validar JSON (si modificaste archivos JSON)
node -e "JSON.parse(require('fs').readFileSync('ruta/al/archivo.json', 'utf8')); console.log('JSON válido!')"

# 3. Probar build localmente
npm run build

# 4. Si el build funciona, probar en desarrollo
npm run dev
# Abrir http://localhost:3000 y verificar que todo funciona
```

### Paso 2: Commit y Push a GitHub

```bash
# 1. Verificar qué archivos cambiaron
git status

# 2. Agregar solo los archivos relevantes
git add archivo1.tsx archivo2.json

# 3. Commit con mensaje descriptivo
git commit -m "Descripción clara del cambio"

# 4. Push a GitHub
git push origin main
```

### Paso 3: Actualizar Servidor

```bash
# 1. Conectar por PuTTY al servidor
# 2. Ir a la carpeta del proyecto
cd /var/www/web

# 3. Guardar cambios locales (si hay conflictos)
git stash

# 4. Actualizar desde GitHub
git pull origin main

# 5. Detener proceso
pm2 stop vanguard-web

# 6. Limpiar build anterior
rm -rf .next

# 7. Reconstruir
npm run build

# 8. Reiniciar proceso
pm2 delete vanguard-web
pm2 start npm --name "vanguard-web" -- start

# 9. Verificar logs
pm2 logs vanguard-web --lines 30
```

---

## ⚠️ Errores Comunes y Soluciones

### 1. Error: "Cannot parse JSON: Expected ',' or ']'"

**Síntoma:**
```
Module parse failed: Cannot parse JSON: Expected ',' or ']' after array element
```

**Causa:** Faltan comas o hay comas extras en el JSON.

**Solución:**
```bash
# Validar JSON localmente antes de commitear
node -e "JSON.parse(require('fs').readFileSync('config/archivo.json', 'utf8')); console.log('JSON válido!')"
```

**Prevención:**
- Usar un editor con validación JSON (VS Code)
- Validar siempre antes de commitear
- Revisar comas al final de objetos/arrays

---

### 2. Error: "Cannot read properties of undefined (reading 'gradient')"

**Síntoma:**
```
TypeError: Cannot read properties of undefined (reading 'gradient')
```

**Causa:** Intentar acceder a una propiedad de un objeto que es `undefined`.

**Solución:**
```typescript
// ❌ MAL - Retornar null en map causa errores en prerender
{items.map((item) => {
  const config = configs[item.id]
  if (!config) return null  // ❌ Esto causa error en build
  return <div>{config.gradient}</div>
})}

// ✅ BIEN - Filtrar antes de map
{items
  .filter((item) => item.id in configs)
  .map((item) => {
    const config = configs[item.id]!
    return <div>{config.gradient}</div>
  })}
```

**Prevención:**
- Nunca retornar `null` directamente en `.map()`
- Filtrar antes de mapear
- Usar validación con TypeScript

---

### 3. Error: "ENOENT: no such file or directory, open '.next/prerender-manifest.json'"

**Síntoma:**
```
Error: ENOENT: no such file or directory, open '/var/www/web/.next/prerender-manifest.json'
```

**Causa:** El build falló o está incompleto, pero PM2 intenta iniciar la app.

**Solución:**
```bash
# 1. Detener proceso
pm2 stop vanguard-web

# 2. Limpiar .next
rm -rf .next

# 3. Reconstruir
npm run build

# 4. Verificar que el build fue exitoso (debe decir "✓ Generating static pages")
# 5. Reiniciar proceso
pm2 start vanguard-web
```

**Prevención:**
- Siempre verificar que `npm run build` termine sin errores
- No iniciar PM2 si el build falló

---

### 4. Error: "The following untracked working tree files would be overwritten by merge"

**Síntoma:**
```
error: The following untracked working tree files would be overwritten by merge:
        app/archivo.tsx
Please move or remove them before you merge.
```

**Causa:** Hay archivos en el servidor que no están en GitHub y entrarían en conflicto.

**Solución:**
```bash
# Opción 1: Mover a backup (recomendado)
mv app/archivo.tsx app/archivo.tsx.backup
git pull origin main

# Opción 2: Guardar en stash
git stash
git pull origin main
# Si necesitas los cambios: git stash pop

# Opción 3: Eliminar (solo si no necesitas los cambios)
rm app/archivo.tsx
git pull origin main
```

**Prevención:**
- Mantener el servidor sincronizado con GitHub
- No hacer cambios directamente en el servidor
- Usar `git status` antes de `git pull`

---

### 5. Error: Estilos CSS no se cargan (página sin diseño)

**Síntoma:** La página carga pero sin estilos, se ve como HTML plano.

**Causa:** Modo `standalone` de Next.js no sirve archivos estáticos correctamente sin configuración adicional.

**Solución:**
```javascript
// En next.config.js - Desactivar standalone
// ❌ MAL
...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),

// ✅ BIEN (comentado)
// ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
```

**Prevención:**
- No usar `standalone` a menos que sepas cómo configurarlo
- Usar `next start` normal en producción
- Verificar que los estilos se cargan después del build

---

## ✅ Checklist Antes de Subir Cambios

### Antes de Commitear

- [ ] **Validar JSON** (si modificaste archivos JSON)
  ```bash
  node -e "JSON.parse(require('fs').readFileSync('config/archivo.json', 'utf8')); console.log('OK')"
  ```

- [ ] **Build local exitoso**
  ```bash
  npm run build
  # Debe completar sin errores
  ```

- [ ] **Probar en desarrollo**
  ```bash
  npm run dev
  # Verificar que la página funciona correctamente
  ```

- [ ] **Revisar cambios**
  ```bash
  git status
  git diff
  # Asegurarse de que solo subes lo necesario
  ```

### Antes de Actualizar Servidor

- [ ] **Verificar estado de Git en servidor**
  ```bash
  cd /var/www/web
  git status
  # Si hay cambios, usar git stash primero
  ```

- [ ] **Backup de archivos importantes** (si hay conflictos)
  ```bash
  mv archivo.tsx archivo.tsx.backup
  ```

- [ ] **Build exitoso en servidor**
  ```bash
  npm run build
  # Esperar a que termine completamente
  ```

- [ ] **Verificar logs después de reiniciar**
  ```bash
  pm2 logs vanguard-web --lines 30
  # No debe haber errores
  ```

---

## 🔧 Troubleshooting Rápido

### El build falla

```bash
# 1. Ver el error completo
npm run build

# 2. Si es error de JSON, validar:
node -e "JSON.parse(require('fs').readFileSync('ruta/archivo.json', 'utf8'))"

# 3. Si es error de TypeScript, verificar tipos:
npm run lint

# 4. Limpiar y reconstruir:
rm -rf .next node_modules
npm install
npm run build
```

### El servidor no inicia

```bash
# 1. Ver logs de errores
pm2 logs vanguard-web --err --lines 50

# 2. Verificar que .next existe
ls -la .next

# 3. Si no existe, reconstruir:
rm -rf .next
npm run build

# 4. Reiniciar proceso:
pm2 delete vanguard-web
pm2 start npm --name "vanguard-web" -- start
```

### Los estilos no se cargan

```bash
# 1. Verificar que el build incluye CSS
ls -la .next/static/css

# 2. Verificar configuración de next.config.js
# No debe tener output: 'standalone' activado

# 3. Limpiar y reconstruir:
rm -rf .next
npm run build
pm2 restart vanguard-web
```

### Git pull falla por conflictos

```bash
# 1. Ver qué archivos causan conflicto
git status

# 2. Guardar cambios locales:
git stash

# 3. Mover archivos sin trackear:
mv archivo.tsx archivo.tsx.backup

# 4. Intentar pull de nuevo:
git pull origin main

# 5. Si necesitas los cambios guardados:
git stash pop
```

---

## 📚 Mejores Prácticas

### 1. Desarrollo Local Primero

**SIEMPRE:**
- Probar cambios localmente antes de subir
- Hacer build local para detectar errores temprano
- Validar JSON antes de commitear

**NUNCA:**
- Subir código sin probar
- Hacer cambios directamente en el servidor
- Commitear sin validar

### 2. Manejo de JSON

**SIEMPRE:**
- Validar JSON antes de commitear
- Usar editor con validación (VS Code)
- Revisar comas al final de objetos/arrays

**NUNCA:**
- Dejar JSON inválido
- Confiar en que "se ve bien"

### 3. Renderizado en React/Next.js

**SIEMPRE:**
- Filtrar antes de mapear si hay condiciones
- Validar que objetos existen antes de acceder a propiedades
- Usar TypeScript para detectar errores

**NUNCA:**
- Retornar `null` directamente en `.map()`
- Acceder a propiedades sin validar que el objeto existe

### 4. Sincronización Git

**SIEMPRE:**
- Mantener servidor sincronizado con GitHub
- Usar `git status` antes de `git pull`
- Hacer commit de cambios importantes

**NUNCA:**
- Hacer cambios directamente en el servidor sin commitear
- Hacer `git pull` sin verificar estado primero

### 5. Build y Deployment

**SIEMPRE:**
- Verificar que el build termina sin errores
- Limpiar `.next` antes de reconstruir si hay problemas
- Verificar logs después de reiniciar

**NUNCA:**
- Iniciar proceso si el build falló
- Saltarse la limpieza de `.next` si hay errores

---

## 🎯 Comandos de Referencia Rápida

### Desarrollo Local

```bash
# Validar JSON
node -e "JSON.parse(require('fs').readFileSync('config/archivo.json', 'utf8')); console.log('OK')"

# Build local
npm run build

# Desarrollo
npm run dev
```

### Servidor

```bash
# Actualizar y reconstruir
cd /var/www/web && git pull origin main && pm2 stop vanguard-web && rm -rf .next && npm run build && pm2 delete vanguard-web && pm2 start npm --name "vanguard-web" -- start

# Ver logs
pm2 logs vanguard-web --lines 30

# Estado
pm2 status
```

### Git

```bash
# Ver cambios
git status
git diff

# Commit y push
git add archivos
git commit -m "Mensaje"
git push origin main

# Resolver conflictos
git stash
git pull origin main
```

---

## 📝 Notas Finales

- **Paciencia:** Los errores son parte del desarrollo, tómate tu tiempo
- **Validación:** Siempre valida antes de subir
- **Logs:** Los logs son tu mejor amigo para diagnosticar problemas
- **Backup:** Cuando dudes, haz backup antes de cambiar

---

**Última actualización:** Enero 2026  
**Basado en:** Experiencias reales del proyecto Vanguard Schools Web

