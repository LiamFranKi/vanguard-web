import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { getFormularioConfig, getEmailConfig } from '@/lib/formularios'

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

    if (!cv || typeof cv === 'string') {
      return NextResponse.json(
        { error: 'Debes adjuntar tu curriculum en formato PDF.' },
        { status: 400 }
      )
    }

    const file = cv as File
    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'El archivo debe estar en formato PDF.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'data', 'curriculums')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.\-]/g, '_')
    const fileName = `${Date.now()}-${safeName || 'cv.pdf'}`
    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, buffer)

    const relativePath = path.relative(process.cwd(), filePath)

    // Registrar en log
    logFormulario(tipo, {
      fecha: new Date().toISOString(),
      nombre,
      email,
      telefono,
      puesto,
      mensaje,
      cv: relativePath,
    })

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

    const otrosDatos = {
      telefono,
      puesto,
      mensaje,
      cv: relativePath,
    }

    const emailHTML = generateEmailHTML(formularioConfig.nombre, nombre, email, otrosDatos, logoUrl)

    // Email al colegio con CV adjunto
    const emailPromises = formularioConfig.destinatarios.map(destinatario =>
      transporter.sendMail({
        from: `"${emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: destinatario,
        replyTo: emailConfig.reply_to,
        subject: formularioConfig.asunto,
        html: emailHTML,
        attachments: [
          {
            filename: file.name || 'cv.pdf',
            path: filePath,
            contentType: file.type || 'application/pdf',
          },
        ],
      })
    )

    // Email de confirmación al postulante (sin adjunto)
    const confirmacionHTML = generateConfirmacionHTML(nombre, formularioConfig.nombre, logoUrl)
    emailPromises.push(
      transporter.sendMail({
        from: `"${emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: email,
        subject: `Gracias por tu postulación - ${emailConfig.nombre_remitente}`,
        html: confirmacionHTML,
      })
    )

    Promise.all(emailPromises).catch(error => {
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

// --- Utilidades locales (similar a /api/formulario) ---

function logFormulario(tipo: string, data: Record<string, any>) {
  try {
    const logDir = path.join(process.cwd(), 'data', 'formularios')
    const logFile = path.join(logDir, `${tipo}.log`)

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const entry = {
      ...data,
    }

    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n', 'utf8')
  } catch (error) {
    console.error('Error al registrar formulario trabaja-con-nosotros en archivo:', error)
  }
}

function generateEmailHTML(
  tipoFormulario: string,
  nombre: string,
  email: string,
  datos: Record<string, any>,
  logoUrl: string
): string {
  const camposHTML = Object.entries(datos)
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151;">${label}:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${String(value || 'N/A')}</span>
          </td>
        </tr>
      `
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${tipoFormulario}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
                  <img 
                    src="${logoUrl}" 
                    alt="Vanguard Schools" 
                    style="width: 80px; height: auto; display: block; margin: 0 auto 10px auto;"
                  />
                  <h1 style="color: white; margin: 0; font-size: 24px;">Vanguard Schools</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">${tipoFormulario}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Nueva postulación recibida</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                        <strong style="color: #374151;">Nombre:</strong>
                        <span style="color: #6b7280; margin-left: 10px;">${nombre}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                        <strong style="color: #374151;">Email:</strong>
                        <span style="color: #6b7280; margin-left: 10px;">${email}</span>
                      </td>
                    </tr>
                    ${camposHTML}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                  <p style="margin: 0;">Este es un mensaje automático del sistema de formularios de Vanguard Schools</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function generateConfirmacionHTML(nombre: string, tipoFormulario: string, logoUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gracias por tu postulación</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
                  <img 
                    src="${logoUrl}" 
                    alt="Vanguard Schools" 
                    style="width: 80px; height: auto; display: block; margin: 0 auto 10px auto;"
                  />
                  <h1 style="color: white; margin: 0; font-size: 24px;">Vanguard Schools</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">¡Gracias por tu postulación, ${nombre}!</h2>
                  <p style="color: #6b7280; line-height: 1.6; margin: 20px 0;">
                    Hemos recibido tu ${tipoFormulario.toLowerCase()} y nuestro equipo de Recursos Humanos la revisará a la brevedad.
                  </p>
                  <p style="color: #6b7280; line-height: 1.6; margin: 20px 0;">
                    De encontrar una vacante acorde a tu perfil, nos pondremos en contacto contigo a través de los datos proporcionados.
                  </p>
                  <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                    <p style="color: #1e40af; margin: 0; font-size: 14px;">
                      <strong>¿Deseas conocer más sobre Vanguard Schools?</strong><br>
                      Visita nuestro sitio web o nuestras redes sociales oficiales.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                  <p style="margin: 0 0 10px 0;"><strong>Vanguard Schools</strong></p>
                  <p style="margin: 0;">Jr. Toribio de Luzuriaga Mz F lote 18 y 19 - SMP</p>
                  <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Vanguard Schools - Todos los derechos reservados</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}


