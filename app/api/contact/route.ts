import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  asunto: z.string().min(1, 'Debe seleccionar un asunto'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { nombre, email, telefono, asunto, mensaje } = validation.data

    // Configuración de email (usar variables de entorno)
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

    // Email para el colegio (notificación)
    const emailToSchool = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'admin@vanguardschools.edu.pe',
      subject: `📧 Nuevo mensaje de contacto: ${asunto}`,
      html: generateEmailToSchool(nombre, email, telefono, asunto, mensaje, logoUrl),
    }

    // Email de confirmación para el usuario
    const emailToUser = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: '✅ Gracias por contactarnos - Vanguard Schools',
      html: generateEmailToUser(nombre, logoUrl),
    }

    // Enviar emails en segundo plano para no hacer esperar al usuario
    Promise.all([
      transporter.sendMail(emailToSchool),
      transporter.sendMail(emailToUser),
    ]).catch((error) => {
      console.error('Error al enviar emails de contacto:', error)
    })

    return NextResponse.json(
      { message: 'Mensaje enviado exitosamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al enviar email:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Por favor, intenta nuevamente.' },
      { status: 500 }
    )
  }
}

function generateEmailToSchool(
  nombre: string,
  email: string,
  telefono: string | undefined,
  asunto: string,
  mensaje: string,
  logoUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo mensaje de contacto</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%); padding: 30px; text-align: center;">
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
                  <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Nuevo mensaje de contacto</h2>
                  
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
                    ${telefono ? `
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                        <strong style="color: #374151;">Teléfono:</strong>
                        <span style="color: #6b7280; margin-left: 10px;">${telefono}</span>
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                        <strong style="color: #374151;">Asunto:</strong>
                        <span style="color: #6b7280; margin-left: 10px;">${asunto}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;">
                        <strong style="color: #374151;">Mensaje:</strong>
                        <p style="color: #6b7280; margin: 10px 0 0 0; line-height: 1.6;">${mensaje.replace(/\n/g, '<br>')}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                  <p style="margin: 0;">Este es un mensaje automático del sistema de contacto de Vanguard Schools</p>
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

function generateEmailToUser(nombre: string, logoUrl: string): string {
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
                <td style="background: linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%); padding: 30px; text-align: center;">
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
                    Hemos recibido tu mensaje y nos pondremos en contacto contigo a la brevedad posible.
                  </p>
                  
                  <p style="color: #6b7280; line-height: 1.6; margin: 20px 0;">
                    Mientras tanto, te invitamos a conocer más sobre nuestra institución visitando nuestro sitio web.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.vanguardschools.com" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visitar nuestro sitio web</a>
                  </div>
                  
                  <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0;">
                    <p style="color: #0369a1; margin: 0; font-size: 14px;">
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

