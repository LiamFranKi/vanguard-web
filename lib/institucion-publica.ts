/**
 * Datos públicos del colegio para el libro de reclamaciones.
 * Prioridad: intranet (colegios + config) → archivo local.
 * Así otro colegio cambia RUC, nombre y contacto sin tocar código.
 */
import fs from 'fs'
import path from 'path'
import { getPool } from '@/lib/db'
import { obtenerContactoInstitucional } from '@/lib/contacto-institucional'

export type InstitucionPublica = {
  razonSocial: string
  nombreComercial: string
  ruc: string
  direccion: string
  telefonos: string
  email: string
  adjuntoMaxMb: number
  adjuntoTipos: string[]
}

const JSON_RESPALDO: InstitucionPublica = {
  razonSocial: '',
  nombreComercial: '',
  ruc: '',
  direccion: '',
  telefonos: '',
  email: '',
  adjuntoMaxMb: 5,
  adjuntoTipos: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
}

function leerJsonLocal(): InstitucionPublica {
  try {
    const p = path.join(process.cwd(), 'config', 'libro-reclamaciones.json')
    const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as Partial<InstitucionPublica>
    return {
      ...JSON_RESPALDO,
      razonSocial: String(raw.razonSocial || ''),
      nombreComercial: String(raw.nombreComercial || ''),
      ruc: String(raw.ruc || ''),
      direccion: String(raw.direccion || ''),
      telefonos: String(raw.telefonos || ''),
      email: String(raw.email || ''),
      adjuntoMaxMb: Number(raw.adjuntoMaxMb) > 0 ? Number(raw.adjuntoMaxMb) : 5,
      adjuntoTipos: Array.isArray(raw.adjuntoTipos) ? raw.adjuntoTipos : JSON_RESPALDO.adjuntoTipos,
    }
  } catch {
    return { ...JSON_RESPALDO }
  }
}

export async function obtenerInstitucionPublica(): Promise<InstitucionPublica> {
  const base = leerJsonLocal()
  const contacto = await obtenerContactoInstitucional()
  if (contacto.direccion) base.direccion = contacto.direccion
  if (contacto.telefonos) base.telefonos = contacto.telefonos
  if (contacto.correo) base.email = contacto.correo

  try {
    const pool = getPool()
    if (!pool) return base
    const colegioId = parseInt(process.env.WEB_COLEGIO_ID || '1', 10) || 1
    const [rows] = await pool.query(
      `SELECT nombre, ruc, razon_social, direccion FROM colegios WHERE id = ? LIMIT 1`,
      [colegioId]
    )
    const row = (rows as { nombre?: string; ruc?: string; razon_social?: string; direccion?: string }[])[0]
    if (row) {
      if (row.razon_social) base.razonSocial = String(row.razon_social).trim()
      if (row.nombre) base.nombreComercial = String(row.nombre).trim()
      if (row.ruc) base.ruc = String(row.ruc).trim()
      if (row.direccion && !contacto.direccion) base.direccion = String(row.direccion).trim()
    }
  } catch {
    /* columnas o BD ausentes: se queda el JSON */
  }

  if (!base.razonSocial) base.razonSocial = base.nombreComercial || 'Colegio'
  if (!base.nombreComercial) base.nombreComercial = base.razonSocial
  return base
}
