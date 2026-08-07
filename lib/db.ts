import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { getFormularioConfig } from '@/lib/formularios'

let pool: Pool | null = null

export function isMysqlConfigured(): boolean {
  return Boolean(
    process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_DATABASE
  )
}

export function getPool(): Pool | null {
  if (!isMysqlConfigured()) return null

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      charset: 'utf8mb4',
    })
  }

  return pool
}

export type SugerenciaRow = {
  nombre: string
  email: string
  telefono?: string
  relacion?: string
  tipo?: string
  mensaje: string
  ip?: string | null
}

export type ReclamoRow = {
  numero: string
  fechaRegistro: string
  nombre: string
  email: string
  telefono?: string
  tipoDocumento: string
  numeroDocumento: string
  domicilio?: string
  relacion?: string
  alumnoNombre?: string
  alumnoDni?: string
  tipo: 'reclamo' | 'queja'
  bienContratado?: string
  fechaHecho?: string
  detalle: string
  pedido: string
  monto?: string
  adjuntoNombre?: string | null
  adjuntoRuta?: string | null
  rucRegistrado?: string
  razonSocial?: string
}

/**
 * Destinatarios de correo para sugerencias o reclamos.
 * Prioridad: tabla web_correos_envio (activos).
 * Respaldo: config/formularios.json si la BD falla o no hay filas.
 */
export async function getDestinatariosWeb(
  canal: 'sugerencias' | 'reclamos'
): Promise<string[]> {
  const db = getPool()
  if (db) {
    try {
      const flagCol = canal === 'sugerencias' ? 'recibe_sugerencias' : 'recibe_reclamos'
      const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT email FROM web_correos_envio
         WHERE activo = 1 AND ${flagCol} = 1
         ORDER BY id ASC`
      )
      const emails = (rows || [])
        .map((r) => String(r.email || '').trim())
        .filter((e) => e.includes('@'))
      if (emails.length > 0) {
        return Array.from(new Set(emails))
      }
    } catch (error) {
      console.error('[MySQL] Error leyendo web_correos_envio, se usa formularios.json:', error)
    }
  }

  const tipoForm =
    canal === 'sugerencias' ? 'sugerencias' : 'libro-reclamaciones'
  const cfg = getFormularioConfig(tipoForm)
  return cfg?.destinatarios?.length ? cfg.destinatarios : []
}

export async function insertSugerencia(row: SugerenciaRow): Promise<boolean> {
  const db = getPool()
  if (!db) {
    console.warn('[MySQL] No configurado: se omite guardado de sugerencia')
    return false
  }

  try {
    await db.execute<ResultSetHeader>(
      `INSERT INTO web_sugerencias
        (nombre, email, telefono, relacion, tipo, mensaje, estado, ip)
       VALUES (?, ?, ?, ?, ?, ?, 'nuevo', ?)`,
      [
        row.nombre,
        row.email,
        row.telefono || null,
        row.relacion || null,
        row.tipo || null,
        row.mensaje,
        row.ip || null,
      ]
    )
    return true
  } catch (error) {
    console.error('[MySQL] Error al guardar web_sugerencias (email de respaldo sigue):', error)
    return false
  }
}

export async function insertReclamo(row: ReclamoRow): Promise<boolean> {
  const db = getPool()
  if (!db) {
    console.warn('[MySQL] No configurado: se omite guardado de reclamo')
    return false
  }

  try {
    let fechaHecho: string | null = null
    if (row.fechaHecho) {
      fechaHecho = row.fechaHecho.includes('T')
        ? row.fechaHecho.slice(0, 10)
        : row.fechaHecho
    }

    const fechaRegistro = row.fechaRegistro.includes('T')
      ? row.fechaRegistro.replace('T', ' ').replace('Z', '').slice(0, 19)
      : row.fechaRegistro

    await db.execute<ResultSetHeader>(
      `INSERT INTO web_reclamos
        (numero, fecha_registro, nombre, email, telefono, tipo_documento, numero_documento,
         domicilio, relacion, alumno_nombre, alumno_dni, tipo, bien_contratado, fecha_hecho,
         detalle, pedido, monto, adjunto_nombre, adjunto_ruta, estado, ruc_registrado, razon_social)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nuevo', ?, ?)`,
      [
        row.numero,
        fechaRegistro,
        row.nombre,
        row.email,
        row.telefono || null,
        row.tipoDocumento,
        row.numeroDocumento,
        row.domicilio || null,
        row.relacion || null,
        row.alumnoNombre || null,
        row.alumnoDni || null,
        row.tipo,
        row.bienContratado || null,
        fechaHecho,
        row.detalle,
        row.pedido,
        row.monto || null,
        row.adjuntoNombre || null,
        row.adjuntoRuta || null,
        row.rucRegistrado || null,
        row.razonSocial || null,
      ]
    )
    return true
  } catch (error) {
    console.error('[MySQL] Error al guardar web_reclamos (email de respaldo sigue):', error)
    return false
  }
}
