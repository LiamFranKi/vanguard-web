# 📱 Configuración del Chat Widget

## 🔢 Cambiar Número de WhatsApp

El número de WhatsApp aparece en **2 lugares** que debes actualizar:

### 1. Botón de WhatsApp en el Chat Widget
**Archivo:** `components/ChatWidget.tsx`  
**Línea:** 114

```typescript
const phone = '51946592100' // Cambia este número
```

**Formato:** El número debe estar sin espacios, sin guiones, y con el código de país.
- Ejemplo: Si tu número es `946 592 100` (Perú), el formato sería: `51946592100`
- Código de país de Perú: `51`
- Formato: `51` + número sin espacios = `51946592100`

### 2. Enlace de WhatsApp en el Email de Notificación
**Archivo:** `app/api/chat/route.ts`  
**Línea:** 115

```typescript
<a href="https://wa.me/51946592100?text=...">Responder por WhatsApp</a>
```

Cambia `51946592100` por tu número en el mismo formato.

---

## 📧 Cambiar Destinatarios de Email

**Archivo:** `config/formularios.json`  
**Sección:** `formularios.chat.destinatarios`

```json
{
  "chat": {
    "nombre": "Chat en Línea",
    "destinatarios": [
      "walter.lozano@vanguardschools.edu.pe",
      "walterlozanoalcalde@gmail.com"
    ],
    "asunto": "💬 Nuevo mensaje de chat - Vanguard Schools",
    "activo": true
  }
}
```

**Para cambiar:**
1. Abre el archivo `config/formularios.json`
2. Busca la sección `"chat"`
3. Modifica el array `"destinatarios"` con los emails que quieras
4. Puedes agregar o quitar emails según necesites

**Ejemplo:**
```json
"destinatarios": [
  "nuevo-email@vanguardschools.edu.pe",
  "otro-email@gmail.com"
]
```

---

## 📝 Resumen de Ubicaciones

| Qué cambiar | Archivo | Línea | Descripción |
|------------|---------|-------|-------------|
| Número WhatsApp (botón) | `components/ChatWidget.tsx` | 114 | Número que se abre al hacer clic en "WhatsApp" |
| Número WhatsApp (email) | `app/api/chat/route.ts` | 115 | Número en el enlace del email de notificación |
| Emails destinatarios | `config/formularios.json` | 35 | Emails que reciben las notificaciones |

---

## ⚠️ Importante

- **Formato del número:** Siempre sin espacios, sin guiones, con código de país
- **Código de país Perú:** `51`
- **Ejemplo:** `946 592 100` → `51946592100`
- **Múltiples emails:** Puedes agregar varios emails separados por comas en el array

---

## 🔄 Después de Cambiar

1. Guarda los archivos
2. Si estás en desarrollo, el servidor se recargará automáticamente
3. Si estás en producción, reinicia el servidor o haz un nuevo deploy


