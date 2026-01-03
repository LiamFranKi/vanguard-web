import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// Configuración de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, mensaje } = body

    // Validación
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Crear directorio de logs si no existe
    const logsDir = path.join(process.cwd(), 'logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    // Guardar en log JSONL
    const logEntry = {
      timestamp: new Date().toISOString(),
      tipo: 'chat',
      datos: {
        nombre,
        email,
        telefono: telefono || 'No proporcionado',
        mensaje,
      },
    }

    const logFile = path.join(logsDir, 'chat.jsonl')
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n')

    // Leer configuración de formularios para obtener email de destino
    const formulariosPath = path.join(process.cwd(), 'config', 'formularios.json')
    let emailDestino: string | string[] = process.env.SMTP_USER || 'admin@vanguardschools.edu.pe'

    try {
      if (fs.existsSync(formulariosPath)) {
        const formulariosData = JSON.parse(fs.readFileSync(formulariosPath, 'utf-8'))
        const chatConfig = formulariosData.formularios?.chat
        if (chatConfig && chatConfig.destinatarios && chatConfig.destinatarios.length > 0) {
          emailDestino = chatConfig.destinatarios
        }
      }
    } catch (e) {
      console.error('Error leyendo formularios.json:', e)
    }

    // Función para formatear el teléfono para WhatsApp
    const formatPhoneForWhatsApp = (phone: string | undefined): string | null => {
      if (!phone) return null
      
      // Eliminar espacios, guiones, paréntesis y otros caracteres
      let cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
      
      // Si no empieza con código de país, agregar código de Perú (51)
      if (!cleaned.startsWith('51')) {
        // Si empieza con 0, quitarlo y agregar 51
        if (cleaned.startsWith('0')) {
          cleaned = '51' + cleaned.substring(1)
        } else {
          cleaned = '51' + cleaned
        }
      }
      
      return cleaned
    }

    const phoneFormatted = formatPhoneForWhatsApp(telefono)
    const whatsappLink = phoneFormatted 
      ? `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(`Hola ${nombre}, gracias por contactarnos. En relación a tu consulta: ${mensaje.substring(0, 100)}...`)}`
      : null

    // Enviar email de notificación (en segundo plano, no bloquea la respuesta)
    const emailPromise = transporter.sendMail({
      from: `"Vanguard Schools Chat" <${process.env.SMTP_USER}>`,
      to: emailDestino,
      subject: `💬 Nuevo mensaje de chat - ${nombre}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
            .info-item { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
            .info-label { font-weight: bold; color: #16a34a; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            img { max-width: 150px; height: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vanguardschools.com'}/LOGO1.png" alt="Vanguard Schools" />
              <h2 style="margin: 10px 0 0 0;">Nuevo Mensaje de Chat</h2>
            </div>
            <div class="content">
              <div class="info-item">
                <span class="info-label">Nombre:</span> ${nombre}
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span> <a href="mailto:${email}">${email}</a>
              </div>
              ${telefono ? `
              <div class="info-item">
                <span class="info-label">Teléfono:</span> <a href="tel:${telefono}">${telefono}</a>
              </div>
              ` : ''}
              <div class="message-box">
                <strong>Mensaje:</strong>
                <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${mensaje}</p>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 4px; border-left: 4px solid #f59e0b;">
                <strong>💡 Respuesta rápida:</strong>
                <p style="margin: 5px 0 0 0;">
                  <a href="mailto:${email}" style="color: #16a34a; text-decoration: none; font-weight: bold;">Responder por email</a>
                  ${whatsappLink ? ` | <a href="${whatsappLink}" style="color: #16a34a; text-decoration: none; font-weight: bold;">Responder por WhatsApp</a>` : ''}
                </p>
              </div>
            </div>
            <div class="footer">
              <p>Este es un mensaje automático del sistema de chat de Vanguard Schools.</p>
              <p>Fecha: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }).catch((error) => {
      console.error('Error enviando email de chat:', error)
    })

    // No esperamos el email, respondemos inmediatamente
    return NextResponse.json(
      { success: true, message: 'Mensaje enviado correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en API de chat:', error)
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    )
  }
}

