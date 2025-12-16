# Configuración de Formularios

Este archivo `formularios.json` contiene la configuración de todos los formularios del sitio web.

## Estructura

```json
{
  "formularios": {
    "nombre-del-formulario": {
      "nombre": "Nombre descriptivo",
      "destinatarios": ["email1@ejemplo.com", "email2@ejemplo.com"],
      "asunto": "Asunto del email",
      "activo": true
    }
  },
  "configuracion": {
    "email_from": "email que envía",
    "nombre_remitente": "Nombre que aparece",
    "reply_to": "email para responder"
  }
}
```

## Cómo agregar un nuevo formulario

1. Agrega una nueva entrada en `formularios` con un nombre único (sin espacios, usar guiones)
2. Especifica los destinatarios (puede ser uno o varios)
3. Define el asunto del email
4. Establece `activo: true` para habilitarlo

## Ejemplo

```json
{
  "formularios": {
    "nuevo-formulario": {
      "nombre": "Formulario Nuevo",
      "destinatarios": ["admin@vanguardschools.edu.pe", "secretaria@vanguardschools.edu.pe"],
      "asunto": "Nuevo formulario recibido - Vanguard Schools",
      "activo": true
    }
  }
}
```

## Uso en el código

Para usar un formulario, envía un POST a:
```
/api/formulario?tipo=nombre-del-formulario
```

Con el body JSON conteniendo los campos del formulario (email y nombre son requeridos).

## Notas

- Los cambios en este archivo se reflejan inmediatamente (sin reiniciar el servidor)
- Puedes desactivar un formulario cambiando `activo: false`
- Los emails se envían a todos los destinatarios especificados

