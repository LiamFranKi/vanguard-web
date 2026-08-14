import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { getFormularioConfig } from '@/lib/formularios'
import { nowPeruMysql, toPeruMysqlDatetime } from '@/lib/datetime-peru'

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

export type ContactoRow = {
  nombre: string
  email: string
  telefono?: string
  asunto?: string
  mensaje: string
  ip?: string | null
}

export type VisitaRow = {
  nombre: string
  email: string
  telefono?: string
  nivelInteres?: string
  fechaPreferida: string
  horarioPreferido: string
  numeroEstudiantes?: string
  mensaje?: string
  ip?: string | null
}

export type TrabajaRow = {
  nombre: string
  email: string
  telefono?: string
  puesto: string
  mensaje?: string
  cvNombre?: string | null
  cvRuta?: string | null
  cvMime?: string | null
  cvSize?: number | null
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
 * Destinatarios de correo (prioridad: tabla web_correos_envio).
 * Respaldo: config/formularios.json.
 * La intranet puede administrar quién recibe cada canal.
 */
export async function getDestinatariosWeb(
  canal: 'sugerencias' | 'reclamos' | 'contacto' | 'visitas' | 'trabaja'
): Promise<string[]> {
  const db = getPool()
  if (db) {
    try {
      const flagCol =
        canal === 'sugerencias'
          ? 'recibe_sugerencias'
          : canal === 'reclamos'
            ? 'recibe_reclamos'
            : canal === 'contacto'
              ? 'recibe_contacto'
              : canal === 'visitas'
                ? 'recibe_visitas'
                : 'recibe_trabaja'
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
    canal === 'sugerencias'
      ? 'sugerencias'
      : canal === 'reclamos'
        ? 'libro-reclamaciones'
        : canal === 'contacto'
          ? 'contacto'
          : canal === 'visitas'
            ? 'visita-guiada'
            : 'trabaja-con-nosotros'
  const cfg = getFormularioConfig(tipoForm)
  return cfg?.destinatarios?.length ? cfg.destinatarios : []
}

export type InsertResult = { ok: boolean; id?: number }

export async function insertSugerencia(row: SugerenciaRow): Promise<InsertResult> {
  const db = getPool()
  if (!db) {
    console.warn('[MySQL] No configurado: se omite guardado de sugerencia')
    return { ok: false }
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO web_sugerencias
        (nombre, email, telefono, relacion, tipo, mensaje, estado, ip, fecha_registro)
       VALUES (?, ?, ?, ?, ?, ?, 'nuevo', ?, ?)`,
      [
        row.nombre,
        row.email,
        row.telefono || null,
        row.relacion || null,
        row.tipo || null,
        row.mensaje,
        row.ip || null,
        nowPeruMysql(),
      ]
    )
    return { ok: true, id: Number(result.insertId) || undefined }
  } catch (error) {
    console.error('[MySQL] Error al guardar web_sugerencias (email de respaldo sigue):', error)
    return { ok: false }
  }
}

export async function insertContacto(row: ContactoRow): Promise<InsertResult> {
  const db = getPool()
  if (!db) {
    console.warn('[MySQL] No configurado: se omite guardado de contacto')
    return { ok: false }
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO web_contactenos
        (fecha_registro, nombre, email, telefono, asunto, mensaje, estado, ip)
       VALUES (?, ?, ?, ?, ?, ?, 'nuevo', ?)`,
      [
        nowPeruMysql(),
        row.nombre,
        row.email,
        row.telefono || null,
        row.asunto || null,
        row.mensaje,
        row.ip || null,
      ]
    )
    return { ok: true, id: Number(result.insertId) || undefined }
  } catch (error) {
    console.error('[MySQL] Error al guardar web_contactenos (email de respaldo sigue):', error)
    return { ok: false }
  }
}

export async function insertVisita(row: VisitaRow): Promise<InsertResult> {
  const db = getPool()
  if (!db) {
    console.warn('[MySQL] No configurado: se omite guardado de visita')
    return { ok: false }
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO web_visitas_guiadas
        (fecha_registro, nombre, email, telefono, nivel_interes, fecha_preferida,
         horario_preferido, numero_estudiantes, mensaje, estado, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'nuevo', ?)`,
      [
        nowPeruMysql(),
        row.nombre,
        row.email,
        row.telefono || null,
        row.nivelInteres || null,
        row.fechaPreferida,
        row.horarioPreferido,
        row.numeroEstudiantes || null,
        row.mensaje || null,
        row.ip || null,
      ]
    )
    return { ok: true, id: Number(result.insertId) || undefined }
  } catch (error) {
    console.error('[MySQL] Error al guardar web_visitas_guiadas (email de respaldo sigue):', error)
    return { ok: false }
  }
}

export async function insertTrabaja(row: TrabajaRow): Promise<InsertResult> {
  const db = getPool()
  if (!db) {
    console.warn('[MySQL] No configurado: se omite guardado de postulación')
    return { ok: false }
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO web_trabaja_con_nosotros
        (fecha_registro, nombre, email, telefono, puesto, mensaje,
         cv_nombre, cv_ruta, cv_mime, cv_size, estado, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nuevo', ?)`,
      [
        nowPeruMysql(),
        row.nombre,
        row.email,
        row.telefono || null,
        row.puesto,
        row.mensaje || null,
        row.cvNombre || null,
        row.cvRuta || null,
        row.cvMime || null,
        row.cvSize ?? null,
        row.ip || null,
      ]
    )
    return { ok: true, id: Number(result.insertId) || undefined }
  } catch (error) {
    console.error(
      '[MySQL] Error al guardar web_trabaja_con_nosotros (email de respaldo sigue):',
      error
    )
    return { ok: false }
  }
}

export async function insertReclamo(row: ReclamoRow): Promise<InsertResult> {
  const db = getPool()
  if (!db) {
    console.warn('[MySQL] No configurado: se omite guardado de reclamo')
    return { ok: false }
  }

  try {
    let fechaHecho: string | null = null
    if (row.fechaHecho) {
      fechaHecho = row.fechaHecho.includes('T')
        ? row.fechaHecho.slice(0, 10)
        : row.fechaHecho
    }

    // Siempre DATETIME en hora Perú (nunca UTC “crudo”)
    const fechaRegistro = toPeruMysqlDatetime(row.fechaRegistro)

    const [result] = await db.execute<ResultSetHeader>(
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
    return { ok: true, id: Number(result.insertId) || undefined }
  } catch (error) {
    console.error('[MySQL] Error al guardar web_reclamos (email de respaldo sigue):', error)
    return { ok: false }
  }
}
