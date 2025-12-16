import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { getFormularioConfig, getEmailConfig } from '@/lib/formularios'

/**
 * API genérica para manejar cualquier tipo de formulario
 * Uso: POST /api/formulario?tipo=contacto|admisión|sugerencias|trabaja-con-nosotros
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener el tipo de formulario desde los query params
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get('tipo')

    if (!tipo) {
      return NextResponse.json(
        { error: 'Tipo de formulario no especificado' },
        { status: 400 }
      )
    }

    // Obtener configuración del formulario
    const formularioConfig = getFormularioConfig(tipo)
    if (!formularioConfig) {
      return NextResponse.json(
        { error: `Formulario "${tipo}" no encontrado o inactivo` },
        { status: 404 }
      )
    }

    // Obtener datos del body
    const body = await request.json()
    const { email, nombre, ...otrosDatos } = body

    // Validaciones básicas
    if (!email || !nombre) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Registrar envío en archivos (JSONL) para TODOS los formularios
    logFormulario(tipo, {
      fecha: new Date().toISOString(),
      nombre,
      email,
      ...otrosDatos,
    })

    // Configuración de email
    const emailConfig = getEmailConfig()
    const logoUrl =
      process.env.NEXT_PUBLIC_EMAIL_LOGO_URL ||
      `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vanguardschools.com').replace(/\/+$/, '')}/LOGO1.png`
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Generar HTML del email
    const emailHTML = generateEmailHTML(formularioConfig.nombre, nombre, email, otrosDatos, logoUrl)

    // Enviar email a todos los destinatarios
    const emailPromises = formularioConfig.destinatarios.map((destinatario) =>
      transporter.sendMail({
        from: `"${emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: destinatario,
        replyTo: emailConfig.reply_to,
        subject: formularioConfig.asunto,
        html: emailHTML,
      })
    )

    // Enviar email de confirmación al usuario
    const confirmacionHTML = generateConfirmacionHTML(nombre, formularioConfig.nombre, logoUrl)
    emailPromises.push(
      transporter.sendMail({
        from: `"${emailConfig.nombre_remitente}" <${emailConfig.email_from}>`,
        to: email,
        subject: `Gracias por contactarnos - ${emailConfig.nombre_remitente}`,
        html: confirmacionHTML,
      })
    )

    // Disparamos el envío en segundo plano para no hacer esperar al usuario
    Promise.all(emailPromises).catch((error) => {
      console.error('Error al enviar emails de formulario:', error)
    })

    return NextResponse.json(
      { message: 'Formulario enviado exitosamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al enviar formulario:', error)
    return NextResponse.json(
      { error: 'Error al enviar el formulario. Por favor, intenta nuevamente.' },
      { status: 500 }
    )
  }
}

/**
 * Guarda cada envío de formulario en un archivo JSONL por tipo.
 * Ej: /data/formularios/contacto.log
 */
function logFormulario(tipo: string, data: Record<string, any>) {
  try {
    const logDir = path.join(process.cwd(), 'data', 'formularios')
    const logFile = path.join(logDir, `${tipo}.log`)

    // Crear directorio si no existe
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const entry = {
      ...data,
    }

    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n', 'utf8')
  } catch (error) {
    console.error('Error al registrar formulario en archivo:', error)
  }
}

/**
 * Genera el HTML del email para el colegio
 */
function generateEmailHTML(
  tipoFormulario: string,
  nombre: string,
  email: string,
  datos: Record<string, any>,
  logoUrl: string
): string {
  const camposHTML = Object.entries(datos)
    .filter(([key]) => key !== 'email' && key !== 'nombre')
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
              <!-- Header -->
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
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Nuevo formulario recibido</h2>
                  
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
              
              <!-- Footer -->
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

/**
 * Genera el HTML del email de confirmación para el usuario
 */
function generateConfirmacionHTML(nombre: string, tipoFormulario: string, logoUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gracias por contactarnos</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
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
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">¡Gracias por contactarnos, ${nombre}!</h2>
                  
                  <p style="color: #6b7280; line-height: 1.6; margin: 20px 0;">
                    Hemos recibido tu ${tipoFormulario.toLowerCase()} y nos pondremos en contacto contigo a la brevedad posible.
                  </p>
                  
                  <p style="color: #6b7280; line-height: 1.6; margin: 20px 0;">
                    Mientras tanto, te invitamos a conocer más sobre nuestra institución visitando nuestro sitio web.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.vanguardschools.com" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visitar nuestro sitio web</a>
                  </div>
                  
                  <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                    <p style="color: #1e40af; margin: 0; font-size: 14px;">
                      <strong>¿Necesitas información inmediata?</strong><br>
                      Teléfonos: 946 592 100 / 922 084 833<br>
                      Email: admin@vanguardschools.edu.pe
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
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

