/**
 * Avisa a la intranet (campanita + push a ADMINISTRADORES) cuando
 * se registra un reclamo/sugerencia en MySQL.
 *
 * Env (web-vanguard/.env):
 *   INTRANET_API_URL=http://127.0.0.1:5000
 *   WEB_FORMULARIO_WEBHOOK_SECRET=mismo_valor_que_en_intranet
 */

export type WebFormularioNotifyPayload = {
  canal: 'reclamo' | 'sugerencia' | 'queja' | 'contacto'
  tipo?: string
  id?: number
  nombre: string
  email?: string
  telefono?: string
  resumen?: string
  numero?: string
}

export async function notificarIntranetWebFormulario(
  payload: WebFormularioNotifyPayload
): Promise<void> {
  const base = String(process.env.INTRANET_API_URL || 'http://127.0.0.1:5000').replace(
    /\/+$/,
    ''
  )
  const secret = String(process.env.WEB_FORMULARIO_WEBHOOK_SECRET || '').trim()
  if (!secret) {
    console.warn(
      '[intranet-notify] WEB_FORMULARIO_WEBHOOK_SECRET no configurado: se omite aviso a admins'
    )
    return
  }

  const url = `${base}/api/webhooks/web-formulario`
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Web-Formulario-Token': secret,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.warn('[intranet-notify] respuesta', res.status, text.slice(0, 200))
      return
    }
    console.log('[intranet-notify] ok', payload.canal, payload.nombre)
  } catch (err) {
    console.warn(
      '[intranet-notify] no se pudo avisar a la intranet:',
      err instanceof Error ? err.message : err
    )
  }
}
