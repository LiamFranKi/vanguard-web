import fs from 'fs'
import path from 'path'

export interface FormularioConfig {
  nombre: string
  destinatarios: string[]
  asunto: string
  activo: boolean
}

export interface ConfiguracionEmail {
  email_from: string
  nombre_remitente: string
  reply_to: string
}

export interface FormulariosConfig {
  formularios: {
    [key: string]: FormularioConfig
  }
  configuracion: ConfiguracionEmail
}

let cachedConfig: FormulariosConfig | null = null

/**
 * Lee la configuración de formularios desde el archivo JSON
 */
export function getFormulariosConfig(): FormulariosConfig {
  // En desarrollo recargamos siempre desde el archivo para reflejar cambios sin reiniciar
  if (process.env.NODE_ENV !== 'production') {
    cachedConfig = null
  }

  // Cache para evitar leer el archivo múltiples veces en producción
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    const configPath = path.join(process.cwd(), 'config', 'formularios.json')
    const fileContents = fs.readFileSync(configPath, 'utf8')
    cachedConfig = JSON.parse(fileContents) as FormulariosConfig
    return cachedConfig
  } catch (error) {
    console.error('Error al leer configuración de formularios:', error)
    // Configuración por defecto en caso de error
    return {
      formularios: {
        contacto: {
          nombre: 'Formulario de Contacto',
          destinatarios: ['admin@vanguardschools.edu.pe'],
          asunto: 'Nuevo contacto desde la web - Vanguard Schools',
          activo: true,
        },
      },
      configuracion: {
        email_from: process.env.SMTP_USER || 'noreply@vanguardschools.edu.pe',
        nombre_remitente: 'Vanguard Schools',
        reply_to: 'admin@vanguardschools.edu.pe',
      },
    }
  }
}

/**
 * Obtiene la configuración de un formulario específico
 */
export function getFormularioConfig(tipo: string): FormularioConfig | null {
  const config = getFormulariosConfig()
  const formulario = config.formularios[tipo]
  
  if (!formulario || !formulario.activo) {
    return null
  }
  
  return formulario
}

/**
 * Obtiene la configuración de email general
 */
export function getEmailConfig(): ConfiguracionEmail {
  const config = getFormulariosConfig()
  return config.configuracion
}

/**
 * Limpia el cache (útil para desarrollo o cuando se actualiza el JSON)
 */
export function clearConfigCache() {
  cachedConfig = null
}

