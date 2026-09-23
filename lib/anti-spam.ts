import { NextRequest } from 'next/server'

const MIN_MS = 1800
const MAX_MS = 12 * 60 * 60 * 1000
const VENTANA_MS = 60 * 60 * 1000
const MAX_POR_HORA = 5
const MAX_LIBRO_POR_HORA = 3

const envios = new Map<string, number[]>()

export type AntiSpamModo = 'normal' | 'libro'

export type AntiSpamCampos = {
  honeypot?: unknown
  startedAt?: unknown
  nombre?: unknown
  nombresExtra?: unknown[]
  telefono?: unknown
  telefonoOpcional?: boolean
  dni?: unknown
  modo?: AntiSpamModo
}

function texto(v: unknown) {
  return String(v ?? '').trim()
}

export function ipCliente(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')
  return (
    forwarded?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'desconocida'
  )
}

function rateOk(clave: string, max: number) {
  const ahora = Date.now()
  const prev = (envios.get(clave) || []).filter((t) => ahora - t < VENTANA_MS)
  if (prev.length >= max) return false
  prev.push(ahora)
  envios.set(clave, prev)
  return true
}

const LETRA = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ'
const NOMBRE_COMPLETO = new RegExp('^[' + LETRA + ']+(?:[ \'\\-][' + LETRA + ']+)+$')
const NOMBRE_PARTE = new RegExp('^[' + LETRA + ']{2,}(?:[ \'\\-][' + LETRA + ']+)*$')
const CONSONANTES_SEGUIDAS = /[bcdfghjklmnpqrstvwxyzñ]{5,}/i

/** Nombre y apellido reales: letras, espacios, guion o apóstrofe. */
export function nombreParecePersona(raw: unknown) {
  const limpio = texto(raw)
    .normalize('NFC')
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (limpio.length < 5 || limpio.length > 80) return false
  if (!NOMBRE_COMPLETO.test(limpio)) return false
  const palabras = limpio.split(/[ '\-]+/).filter(Boolean)
  if (palabras.length < 2 || palabras.some((p) => p.length < 2)) return false
  if (CONSONANTES_SEGUIDAS.test(limpio)) return false
  return true
}

export function nombreOParteOk(raw: unknown) {
  if (nombreParecePersona(raw)) return true
  const limpio = texto(raw).normalize('NFC').replace(/\s+/g, ' ').trim()
  if (limpio.length < 2 || limpio.length > 80) return false
  if (!NOMBRE_PARTE.test(limpio)) return false
  if (CONSONANTES_SEGUIDAS.test(limpio)) return false
  return true
}

export function telefonoPeruOk(raw: unknown) {
  let d = texto(raw).replace(/\D/g, '')
  if (!d) return false
  if (d.startsWith('51') && d.length >= 11) d = d.slice(2)
  if (d.length === 9 && d.startsWith('9')) return true
  if (d.length === 9 && d.startsWith('01')) return true
  return false
}

export function dniPeruOk(raw: unknown) {
  return /^\d{8}$/.test(texto(raw))
}

/**
 * Honeypot + tiempo mínimo + nombre/teléfono Perú + tope por IP.
 * El Libro de reclamaciones no exige celular ni DNI.
 */
export function evaluarAntiSpam(
  campos: AntiSpamCampos,
  opts: { ip: string; formulario: string }
): { ok: true } | { ok: false; error: string; status: 400 | 429 } {
  const modo = campos.modo || 'normal'
  const generico = 'No pudimos enviar el formulario. Revise los datos e intente de nuevo.'

  if (texto(campos.honeypot)) {
    return { ok: false, error: generico, status: 400 }
  }

  const started = Number(campos.startedAt)
  if (!Number.isFinite(started) || started <= 0) {
    return { ok: false, error: generico, status: 400 }
  }
  const transcurrido = Date.now() - started
  if (transcurrido < MIN_MS || transcurrido > MAX_MS) {
    return { ok: false, error: generico, status: 400 }
  }

  if (!nombreParecePersona(campos.nombre)) {
    return {
      ok: false,
      error: 'Escriba su nombre y apellido (solo letras).',
      status: 400,
    }
  }

  for (const extra of campos.nombresExtra || []) {
    if (texto(extra) && !nombreOParteOk(extra)) {
      return {
        ok: false,
        error: 'Revise los nombres: use letras y, si corresponde, nombre y apellido.',
        status: 400,
      }
    }
  }

  const tel = texto(campos.telefono)
  if (tel) {
    if (!telefonoPeruOk(tel)) {
      return {
        ok: false,
        error: 'Ingrese un celular peruano de 9 dígitos (empiezan con 9).',
        status: 400,
      }
    }
  } else if (!campos.telefonoOpcional && modo !== 'libro') {
    return {
      ok: false,
      error: 'Ingrese un celular peruano de 9 dígitos (empiezan con 9).',
      status: 400,
    }
  }

  if (modo !== 'libro' && campos.dni != null && texto(campos.dni) && !dniPeruOk(campos.dni)) {
    return { ok: false, error: 'El DNI debe tener 8 dígitos.', status: 400 }
  }

  const max = modo === 'libro' ? MAX_LIBRO_POR_HORA : MAX_POR_HORA
  if (!rateOk(`${opts.formulario}:${opts.ip}`, max)) {
    return {
      ok: false,
      error: 'Hay varios envíos seguidos. Espere un momento e intente de nuevo.',
      status: 429,
    }
  }

  return { ok: true }
}

export function camposAntiSpamDesdeObjeto(body: Record<string, unknown>): Pick<
  AntiSpamCampos,
  'honeypot' | 'startedAt'
> {
  return {
    honeypot: body.sitio_web_extra,
    startedAt: body.form_started_at,
  }
}

export function camposAntiSpamDesdeFormData(form: FormData): Pick<AntiSpamCampos, 'honeypot' | 'startedAt'> {
  return {
    honeypot: form.get('sitio_web_extra'),
    startedAt: form.get('form_started_at'),
  }
}
