# 🔧 Resolver Conflicto de Git

## Problema
Tienes cambios locales en `config/formularios.json` que entran en conflicto con los cambios de GitHub.

## Solución: Guardar tus cambios y combinar

Ejecuta estos comandos en PuTTY:

```bash
cd /var/www/web

# 1. Ver qué cambios tienes localmente
git diff config/formularios.json

# 2. Guardar tus cambios locales temporalmente
git stash

# 3. Hacer pull de los cambios de GitHub
git pull origin main

# 4. Aplicar tus cambios locales de nuevo
git stash pop
```

Si hay conflictos al hacer `git stash pop`, Git te mostrará dónde están. Puedes:
- Editar el archivo manualmente para combinar ambos cambios
- O decidir qué versión mantener

## Alternativa: Si quieres descartar tus cambios locales

```bash
cd /var/www/web
git checkout -- config/formularios.json
git pull origin main
```

**⚠️ CUIDADO**: Esto descartará tus cambios locales en formularios.json

