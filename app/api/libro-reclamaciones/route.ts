import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { getFormularioConfig, getEmailConfig } from '@/lib/formularios'

const DATA_DIR = path.join(process.cwd(), 'data', 'libro-reclamaciones')
const JSON_FILE = path.join(DATA_DIR, 'registros.json')
const ADJUNTOS_DIR = path.join(DATA_DIR, 'adjuntos')

type InstitucionConfig = {
  razonSocial: string
  nombreComercial: string
  ruc: string
  direccion: string
  telefonos: string
  email: string
  adjuntoMaxMb: number
  adjuntoTipos: string[]
}

function getInstitucionConfig(): InstitucionConfig {
  try {
    const configPath = path.join(process.cwd(), 'config', 'libro-reclamaciones.json')
    return JSON.parse(fs.readFileSync(configPath, 'utf8')) as InstitucionConfig
  } catch {
    return {
      razonSocial: 'Vanguard Schools',
      nombreComercial: 'Vanguard Schools',
      ruc: 'PENDIENTE-ACTUALIZAR',
      direccion: 'Jr. Toribio de Luzuriaga Mz F lote 18 y 19 - SMP',
      telefonos: '946 592 100 / 922 084 833',
      email: 'admin@vanguardschools.edu.pe',
      adjuntoMaxMb: 5,
      adjuntoTipos: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    }
  }
}

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

    const institucion = getInstitucionConfig()
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
    const fechaRegistro = new Date().toISOString()

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
        ruc: institucion.ruc,
      },
    }

    store.contador = contador
    store.registros.unshift(registro)
    fs.writeFileSync(JSON_FILE, JSON.stringify(store, null, 2), 'utf8')

    const emailConfig = getEmailConfig()
    const logoUrl =
      process.env.NEXT_PUBLIC_EMAIL_LOGO_URL ||
      `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vanguardschools.com').replace(
        /\/+$/,
        ''
      )}/LOGO1.png`

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

    const emailHTML = `
      <!DOCTYPE html>
      <html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
        <table width="600" style="margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
          <tr><td style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);padding:24px;text-align:center;color:#fff;">
            <img src="${logoUrl}" alt="Logo" style="width:70px;margin:0 auto 8px;display:block;" />
            <h1 style="margin:0;font-size:22px;">Libro de Reclamaciones</h1>
            <p style="margin:8px 0 0;opacity:.9;">N° ${numero}</p>
          </td></tr>
          <tr><td style="padding:24px;color:#374151;font-size:14px;line-height:1.6;">
            <p><strong>Tipo:</strong> ${tipoLabel}</p>
            <p><strong>Proveedor:</strong> ${institucion.razonSocial} — RUC: ${institucion.ruc}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
            <p><strong>Reclamante:</strong> ${nombre}</p>
            <p><strong>Documento:</strong> ${tipoDocumento} ${numeroDocumento}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${telefono || '—'}</p>
            <p><strong>Domicilio:</strong> ${domicilio || '—'}</p>
            <p><strong>Relación:</strong> ${relacion || '—'}</p>
            <p><strong>Alumno:</strong> ${alumnoNombre || '—'} (DNI: ${alumnoDni || '—'})</p>
            <p><strong>Bien/servicio:</strong> ${bienContratado || '—'}</p>
            <p><strong>Fecha del hecho:</strong> ${fechaHecho || '—'}</p>
            <p><strong>Monto reclamado:</strong> ${monto || '—'}</p>
            <p><strong>Detalle:</strong><br/>${detalle.replace(/\n/g, '<br/>')}</p>
            <p><strong>Pedido:</strong><br/>${pedido.replace(/\n/g, '<br/>')}</p>
            <p><strong>Adjunto:</strong> ${adjuntoMeta ? adjuntoMeta.nombreOriginal : 'Ninguno'}</p>
            <p style="color:#6b7280;font-size:12px;margin-top:20px;">Registrado: ${fechaRegistro}</p>
          </td></tr>
        </table>
      </body></html>
    `

    const confirmHTML = `
      <!DOCTYPE html>
      <html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
        <table width="600" style="margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
          <tr><td style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);padding:24px;text-align:center;color:#fff;">
            <h1 style="margin:0;font-size:22px;">Vanguard Schools</h1>
            <p style="margin:8px 0 0;opacity:.9;">Acuse de recibo</p>
          </td></tr>
          <tr><td style="padding:24px;color:#374151;font-size:14px;line-height:1.6;">
            <p>Estimado/a <strong>${nombre}</strong>,</p>
            <p>Hemos registrado su <strong>${tipoLabel.toLowerCase()}</strong> en nuestro Libro de Reclamaciones.</p>
            <p style="background:#eff6ff;border-left:4px solid #2563eb;padding:12px;"><strong>Número de registro:</strong> ${numero}</p>
            <p>Conserve este número para el seguimiento. Nuestro equipo revisará su caso y se comunicará a la brevedad.</p>
            <p><strong>Teléfonos:</strong> ${institucion.telefonos}<br/>
            <strong>Email:</strong> ${institucion.email}</p>
          </td></tr>
        </table>
      </body></html>
    `

    const emailPromises = formConfig.destinatarios.map((destinatario) =>
      transporter.sendMail({
        from: `"${emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: destinatario,
        replyTo: email,
        subject: `${formConfig.asunto} — ${numero} (${tipoLabel})`,
        html: emailHTML,
        attachments,
      })
    )

    emailPromises.push(
      transporter.sendMail({
        from: `"${emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: email,
        subject: `Registro Libro de Reclamaciones ${numero} — Vanguard Schools`,
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
    })
  } catch (error) {
    console.error('Error libro de reclamaciones:', error)
    return NextResponse.json(
      { error: 'No se pudo registrar el reclamo. Intente nuevamente.' },
      { status: 500 }
    )
  }
}
