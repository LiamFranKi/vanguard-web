/**
 * Teléfonos públicos del colegio (web).
 * No hay panel de admin: para cambiarlos, edita TELEFONOS_COLEGIO y vuelve a desplegar.
 */
export const TELEFONOS_COLEGIO = ['922084833', '947345887', '947346735'] as const

function formatearMovilPe(n: string): string {
  const d = String(n).replace(/\D/g, '')
  if (d.length === 9) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
  return n
}

/** Texto visible: 922 084 833 - 947 345 887 - 947 346 735 */
export const TELEFONOS_DISPLAY = TELEFONOS_COLEGIO.map(formatearMovilPe).join(' - ')

/** WhatsApp del primer número (enlace de “Contáctanos” / hero). */
export const TELEFONO_WHATSAPP = `51${TELEFONOS_COLEGIO[0]}`
export const TELEFONO_WHATSAPP_URL = `https://wa.me/${TELEFONO_WHATSAPP}`

export const TELEFONOS_SCHEMA = TELEFONOS_COLEGIO.map((n) => {
  const d = String(n).replace(/\D/g, '')
  return `+51-${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
})

/** Lo que la web muestra hoy si General todavía no tiene teléfono, correo o dirección. */
export const CONTACTO_WEB_RESPALDO = {
  telefonos: TELEFONOS_DISPLAY,
  correo: 'admin@vanguardschools.edu.pe',
  direccion: 'Jr. Toribio de Luzuriaga Mz F lote 18 y 19 - SMP',
  whatsappUrl: TELEFONO_WHATSAPP_URL,
  telefonosSchema: [...TELEFONOS_SCHEMA],
}
