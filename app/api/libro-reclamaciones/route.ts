import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { getFormularioConfig, getEmailConfig } from '@/lib/formularios'
import { insertReclamo, getDestinatariosWeb } from '@/lib/db'
import {
  getLogoUrl,
  emailReclamoColegio,
  emailReclamoUsuario,
} from '@/lib/email-templates'
import { nowPeruMysql } from '@/lib/datetime-peru'
import { camposAntiSpamDesdeFormData, evaluarAntiSpam, ipCliente } from '@/lib/anti-spam'
import { obtenerInstitucionPublica } from '@/lib/institucion-publica'
import { htmlHojaReclamacion, type HojaReclamacionDatos } from '@/lib/hoja-reclamacion'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const DATA_DIR = path.join(process.cwd(), 'data', 'libro-reclamaciones')
const JSON_FILE = path.join(DATA_DIR, 'registros.json')
const ADJUNTOS_DIR = path.join(DATA_DIR, 'adjuntos')

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(ADJUNTOS_DIR)) fs.mkdirSync(ADJUNTOS_DIR, { recursive: true })
  if (!fs.existsSync(JSON_FILE)) {
    fs.writeFileSync(JSON_FILE, JSON.stringify({ contador: 0, registros: [] }, null, 2), 'utf8')
  }
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
}

export async function POST(request: NextRequest) {
  try {
    const formConfig = getFormularioConfig('libro-reclamaciones')
    if (!formConfig) {
      return NextResponse.json(
        { error: 'Libro de reclamaciones no disponible' },
        { status: 404 }
      )
    }

    const institucion = await obtenerInstitucionPublica()
    const formData = await request.formData()
    const get = (key: string) => String(formData.get(key) || '').trim()

    const nombre = get('nombre')
    const email = get('email')
    const telefono = get('telefono')
    const tipoDocumento = get('tipoDocumento')
    const numeroDocumento = get('numeroDocumento')
    const domicilio = get('domicilio')
    const relacion = get('relacion')
    const alumnoNombre = get('alumnoNombre')
    const alumnoDni = get('alumnoDni')
    const tipo = get('tipo')
    const bienContratado = get('bienContratado')
    const fechaHecho = get('fechaHecho')
    const detalle = get('detalle')
    const pedido = get('pedido')
    const monto = get('monto')
    const acepta = get('acepta')

    const anti = evaluarAntiSpam(
      {
        ...camposAntiSpamDesdeFormData(formData),
        nombre,
        telefono,
        telefonoOpcional: true,
        modo: 'libro',
      },
      { ip: ipCliente(request), formulario: 'libro-reclamaciones' }
    )
    if (!anti.ok) {
      return NextResponse.json({ error: anti.error }, { status: anti.status })
    }

    if (!nombre || !email || !tipoDocumento || !numeroDocumento || !tipo || !detalle || !pedido) {
      return NextResponse.json(
        { error: 'Complete los campos obligatorios' },
        { status: 400 }
      )
    }

    if (tipo !== 'reclamo' && tipo !== 'queja') {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }

    if (acepta !== 'true' && acepta !== 'on' && acepta !== '1') {
      return NextResponse.json(
        { error: 'Debe aceptar la declaración de veracidad' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    let adjuntoMeta: {
      nombreOriginal: string
      guardadoComo: string
      mime: string
      size: number
    } | null = null
    let adjuntoBuffer: Buffer | null = null

    const file = formData.get('adjunto')
    if (file && typeof file !== 'string' && 'arrayBuffer' in file && file.size > 0) {
      const maxBytes = (institucion.adjuntoMaxMb || 5) * 1024 * 1024
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `El adjunto no puede superar ${institucion.adjuntoMaxMb} MB` },
          { status: 400 }
        )
      }

      const mime = file.type || 'application/octet-stream'
      if (!institucion.adjuntoTipos.includes(mime)) {
        return NextResponse.json(
          { error: 'Formato de adjunto no permitido. Use PDF, JPG o PNG.' },
          { status: 400 }
        )
      }

      adjuntoBuffer = Buffer.from(await file.arrayBuffer())
      adjuntoMeta = {
        nombreOriginal: sanitizeFilename(file.name || 'adjunto'),
        guardadoComo: '',
        mime,
        size: file.size,
      }
    }

    ensureDirs()
    const store = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')) as {
      contador: number
      registros: Record<string, unknown>[]
    }
    const year = new Date().getFullYear()
    const contador = (store.contador || 0) + 1
    const numero = `REC-${year}-${String(contador).padStart(5, '0')}`
    // Hora de Perú (UTC-5), no UTC de toISOString()
    const fechaRegistro = nowPeruMysql()

    if (adjuntoBuffer && adjuntoMeta) {
      const ext = path.extname(adjuntoMeta.nombreOriginal) || ''
      const guardadoComo = `${numero}${ext}`
      fs.writeFileSync(path.join(ADJUNTOS_DIR, guardadoComo), adjuntoBuffer)
      adjuntoMeta.guardadoComo = guardadoComo
    }

    const registro = {
      numero,
      fechaRegistro,
      nombre,
      email,
      telefono,
      tipoDocumento,
      numeroDocumento,
      domicilio,
      relacion,
      alumnoNombre,
      alumnoDni,
      tipo,
      bienContratado,
      fechaHecho,
      detalle,
      pedido,
      monto,
      adjunto: adjuntoMeta,
      institucion: {
        razonSocial: institucion.razonSocial,
        nombreComercial: institucion.nombreComercial,
        ruc: institucion.ruc,
      },
    }

    store.contador = contador
    store.registros.unshift(registro)
    fs.writeFileSync(JSON_FILE, JSON.stringify(store, null, 2), 'utf8')

    // MySQL: si falla, se continúa con email de respaldo
    const savedReclamo = await insertReclamo({
      numero,
      fechaRegistro,
      nombre,
      email,
      telefono,
      tipoDocumento,
      numeroDocumento,
      domicilio,
      relacion,
      alumnoNombre,
      alumnoDni,
      tipo: tipo as 'reclamo' | 'queja',
      bienContratado,
      fechaHecho,
      detalle,
      pedido,
      monto,
      adjuntoNombre: adjuntoMeta?.nombreOriginal || null,
      adjuntoRuta: adjuntoMeta?.guardadoComo
        ? path.join(ADJUNTOS_DIR, adjuntoMeta.guardadoComo)
        : null,
      rucRegistrado: institucion.ruc,
      razonSocial: institucion.razonSocial,
    })

    // Campanita + push a ADMINISTRADORES en la intranet (no bloquea el registro)
    if (savedReclamo.ok) {
      const { notificarIntranetWebFormulario } = await import(
        '@/lib/intranet-notify'
      )
      notificarIntranetWebFormulario({
        canal: tipo === 'queja' ? 'queja' : 'reclamo',
        tipo: String(tipo),
        id: savedReclamo.id,
        nombre,
        email,
        telefono,
        resumen: detalle,
        numero,
      }).catch(() => {})
    }

    const emailConfig = getEmailConfig()
    const logoUrl = getLogoUrl()

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const tipoLabel = tipo === 'reclamo' ? 'Reclamo' : 'Queja'
    const marca = institucion.nombreComercial || institucion.razonSocial
    const hoja: HojaReclamacionDatos = {
      numero,
      fechaRegistro,
      tipoLabel,
      razonSocial: institucion.razonSocial,
      nombreComercial: institucion.nombreComercial,
      ruc: institucion.ruc,
      direccion: institucion.direccion,
      nombre,
      email,
      telefono,
      tipoDocumento,
      numeroDocumento,
      domicilio,
      relacion,
      alumnoNombre,
      alumnoDni,
      bienContratado,
      fechaHecho,
      monto,
      detalle,
      pedido,
    }
    const attachments =
      adjuntoBuffer && adjuntoMeta
        ? [
            {
              filename: adjuntoMeta.nombreOriginal,
              content: adjuntoBuffer,
              contentType: adjuntoMeta.mime,
            },
          ]
        : []

    const contactoMail = {
      telefonos: institucion.telefonos,
      correo: institucion.email,
      direccion: institucion.direccion,
      whatsappUrl: '',
      telefonosSchema: [] as string[],
    }

    const emailHTML = emailReclamoColegio({
      logoUrl,
      contacto: contactoMail,
      marca,
      numero,
      tipoLabel,
      razonSocial: institucion.razonSocial,
      ruc: institucion.ruc,
      nombre,
      email,
      telefono,
      tipoDocumento,
      numeroDocumento,
      domicilio,
      relacion,
      alumnoNombre,
      alumnoDni,
      bienContratado,
      fechaHecho,
      monto,
      detalle,
      pedido,
      adjunto: adjuntoMeta?.nombreOriginal,
      fechaRegistro,
    })

    const confirmHTML = emailReclamoUsuario({
      logoUrl,
      contacto: contactoMail,
      marca,
      nombre,
      numero,
      tipoLabel,
      telefonos: institucion.telefonos,
      emailContacto: institucion.email,
      hojaHtml: htmlHojaReclamacion(hoja),
    })

    // Destinatarios desde BD (web_correos_envio); respaldo formularios.json
    const destinatarios = await getDestinatariosWeb('reclamos')
    const lista =
      destinatarios.length > 0 ? destinatarios : formConfig.destinatarios

    const emailPromises = lista.map((destinatario) =>
      transporter.sendMail({
        from: `"${marca || emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: destinatario,
        replyTo: email,
        subject: `Libro de Reclamaciones ${numero} — ${tipoLabel} · ${marca}`,
        html: emailHTML,
        attachments,
      })
    )

    emailPromises.push(
      transporter.sendMail({
        from: `"${marca || emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: email,
        subject: `Registro confirmado ${numero} — Libro de Reclamaciones · ${marca}`,
        html: confirmHTML,
      })
    )

    Promise.all(emailPromises).catch((err) => {
      console.error('Error enviando emails libro reclamaciones:', err)
    })

    return NextResponse.json({
      message: 'Reclamo registrado correctamente',
      numero,
      fechaRegistro,
      hoja,
    })
  } catch (error) {
    console.error('Error libro de reclamaciones:', error)
    return NextResponse.json(
      { error: 'No se pudo registrar el reclamo. Intente nuevamente.' },
      { status: 500 }
    )
  }
}
