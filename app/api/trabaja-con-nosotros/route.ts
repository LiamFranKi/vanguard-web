import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { getFormularioConfig, getEmailConfig } from '@/lib/formularios'
import { insertTrabaja, getDestinatariosWeb } from '@/lib/db'
import {
  getLogoUrl,
  emailTrabajaColegio,
  emailTrabajaUsuario,
} from '@/lib/email-templates'

/**
 * CVs en la web nueva (Zarkiel):
 *   {cwd}/data/curriculums  →  /home/vanguard/web-vanguard/data/curriculums
 * No usar /var/www/web (sistema anterior).
 */
const CV_DIR = path.join(process.cwd(), 'data', 'curriculums')
const CV_MAX_MB = 5

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
}

function ensureCvDir() {
  if (!fs.existsSync(CV_DIR)) {
    fs.mkdirSync(CV_DIR, { recursive: true })
  }
}

function logFormulario(tipo: string, data: Record<string, unknown>) {
  try {
    const logDir = path.join(process.cwd(), 'data', 'formularios')
    const logFile = path.join(logDir, `${tipo}.log`)
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })
    fs.appendFileSync(logFile, JSON.stringify(data) + '\n', 'utf8')
  } catch (error) {
    console.error('Error al registrar trabaja-con-nosotros en archivo:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const tipo = 'trabaja-con-nosotros'
    const formularioConfig = getFormularioConfig(tipo)
    if (!formularioConfig) {
      return NextResponse.json(
        { error: `Formulario "${tipo}" no encontrado o inactivo` },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const nombre = String(formData.get('nombre') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const telefono = String(formData.get('telefono') || '').trim()
    const puesto = String(formData.get('puesto') || '').trim()
    const mensaje = String(formData.get('mensaje') || '').trim()
    const cv = formData.get('cv')

    if (!nombre || !email || !telefono || !puesto) {
      return NextResponse.json(
        { error: 'Nombre, email, teléfono y puesto son requeridos.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    if (!cv || typeof cv === 'string' || !('arrayBuffer' in cv) || cv.size <= 0) {
      return NextResponse.json(
        { error: 'Debes adjuntar tu curriculum en formato PDF.' },
        { status: 400 }
      )
    }

    const file = cv as File
    const mime = file.type || 'application/octet-stream'
    if (mime !== 'application/pdf') {
      return NextResponse.json(
        { error: 'El archivo debe estar en formato PDF.' },
        { status: 400 }
      )
    }

    const maxBytes = CV_MAX_MB * 1024 * 1024
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `El CV no puede superar ${CV_MAX_MB} MB.` },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    ensureCvDir()

    const originalName = sanitizeFilename(file.name || 'cv.pdf')
    const ext = path.extname(originalName).toLowerCase() === '.pdf' ? '.pdf' : '.pdf'
    const baseName = path.basename(originalName, path.extname(originalName)) || 'cv'
    const guardadoComo = `${Date.now()}-${baseName}${ext}`
    const filePath = path.join(CV_DIR, guardadoComo)
    fs.writeFileSync(filePath, buffer)

    // Ruta absoluta del sistema nuevo (Zarkiel): /home/vanguard/web-vanguard/data/curriculums/...
    const cvRutaAbsoluta = filePath
    const cvRutaRelativa = path.join('data', 'curriculums', guardadoComo).replace(/\\/g, '/')

    const forwarded = request.headers.get('x-forwarded-for')
    const ip =
      forwarded?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null

    logFormulario(tipo, {
      fecha: new Date().toISOString(),
      nombre,
      email,
      telefono,
      puesto,
      mensaje,
      cv: cvRutaRelativa,
      cvAbsoluta: cvRutaAbsoluta,
    })

    const saved = await insertTrabaja({
      nombre,
      email,
      telefono,
      puesto,
      mensaje,
      cvNombre: originalName,
      cvRuta: cvRutaAbsoluta,
      cvMime: mime,
      cvSize: file.size,
      ip,
    })

    if (saved.ok) {
      const { notificarIntranetWebFormulario } = await import('@/lib/intranet-notify')
      notificarIntranetWebFormulario({
        canal: 'trabaja',
        tipo: puesto,
        id: saved.id,
        nombre,
        email,
        telefono,
        resumen: `CV: ${originalName}`,
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

    const destinatarios = await getDestinatariosWeb('trabaja')
    const emailHTML = emailTrabajaColegio({
      logoUrl,
      nombre,
      email,
      telefono,
      puesto,
      mensaje,
      cvNombre: originalName,
    })
    const confirmacionHTML = emailTrabajaUsuario({ logoUrl, nombre, puesto })

    const emailPromises = destinatarios.map((destinatario) =>
      transporter.sendMail({
        from: `"${emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: destinatario,
        replyTo: email,
        subject: `Nueva postulación — ${puesto}`,
        html: emailHTML,
        attachments: [
          {
            filename: originalName.endsWith('.pdf') ? originalName : `${originalName}.pdf`,
            content: buffer,
            contentType: 'application/pdf',
          },
        ],
      })
    )

    emailPromises.push(
      transporter.sendMail({
        from: `"${emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: email,
        subject: `Postulación recibida — Vanguard Schools`,
        html: confirmacionHTML,
      })
    )

    Promise.all(emailPromises).catch((error) => {
      console.error('Error al enviar emails de trabaja con nosotros:', error)
    })

    return NextResponse.json(
      { message: 'Postulación enviada exitosamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en trabaja-con-nosotros:', error)
    return NextResponse.json(
      { error: 'Error al enviar la postulación. Por favor, intenta nuevamente.' },
      { status: 500 }
    )
  }
}
