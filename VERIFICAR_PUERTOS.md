# 🔍 Verificación Completa de Puertos

## Comandos para Verificar Puertos en Uso

Ejecuta estos comandos en PuTTY para ver TODOS los puertos que están en uso:

### 1️⃣ Ver puertos en rango 3000-3010 (Next.js típico)

```bash
sudo netstat -tulpn | grep -E ':(300[0-9]|3010)' | grep LISTEN
```

### 2️⃣ Ver TODOS los puertos en uso (más completo)

```bash
sudo ss -tulpn | grep LISTEN
```

### 3️⃣ Ver SOLO procesos Node.js y sus puertos

```bash
ps aux | grep node | grep -v grep
```

### 4️⃣ Ver procesos PM2 (si usas PM2)

```bash
pm2 list
```

### 5️⃣ Ver puertos específicos comunes (3000-3010, 5000-5010)

```bash
sudo netstat -tulpn | grep -E ':(300[0-9]|3010|500[0-9]|5010)' | grep LISTEN
```

---

## 📋 Después de Ejecutar

**Copia y pega aquí el resultado completo** de estos comandos, especialmente:
- El comando #1 (puertos 3000-3010)
- El comando #3 (procesos Node.js)
- El comando #4 (si usas PM2)

Con esa información podremos confirmar qué puerto está realmente libre para usar.

