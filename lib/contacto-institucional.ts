/**
 * Teléfono, correo y dirección públicos.
 * Salen de Configuración → General de la intranet (tabla config).
 * Si el campo está vacío, la web sigue mostrando lo que muestra hoy.
 */
import { getPool } from '@/lib/db'
import { CONTACTO_WEB_RESPALDO } from '@/lib/contacto'

export type ContactoInstitucional = {
  telefonos: string
  correo: string
  direccion: string
  whatsappUrl: string
  telefonosSchema: string[]
}

function primerMovil(texto: string): string | null {
  const trozos = String(texto || '').match(/\d[\d\s-]{6,}\d/g) || []
  for (const trozo of trozos) {
    let d = trozo.replace(/\D/g, '')
    if (d.startsWith('51') && d.length === 11) d = d.slice(2)
    if (d.length === 9 && d.startsWith('9')) return d
  }
  return null
}

function schemaDeMovil(d: string): string {
  return `+51-${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
}

export async function obtenerContactoInstitucional(): Promise<ContactoInstitucional> {
  const contacto: ContactoInstitucional = {
    ...CONTACTO_WEB_RESPALDO,
    telefonosSchema: [...CONTACTO_WEB_RESPALDO.telefonosSchema],
  }
  try {
    const pool = getPool()
    if (!pool) return contacto
    const [rows] = await pool.query(
      `SELECT clave, valor FROM config
       WHERE clave IN ('telefono_colegio', 'correo_contacto', 'direccion_contacto')`
    )
    const map: Record<string, string> = {}
    for (const row of rows as { clave?: string; valor?: string }[]) {
      if (row?.clave) map[row.clave] = String(row.valor || '').trim()
    }
    if (map.telefono_colegio) {
      contacto.telefonos = map.telefono_colegio
      const movil = primerMovil(map.telefono_colegio)
      if (movil) {
        contacto.whatsappUrl = `https://wa.me/51${movil}`
        contacto.telefonosSchema = [schemaDeMovil(movil)]
      }
    }
    if (map.correo_contacto) contacto.correo = map.correo_contacto
    if (map.direccion_contacto) contacto.direccion = map.direccion_contacto
  } catch {
    /* sin MySQL o sin tabla: se quedan los datos actuales de la web */
  }
  return contacto
}
