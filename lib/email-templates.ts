/**
 * Plantillas HTML de correo institucionales (logo + formato)
 */

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vanguardschools.com').replace(/\/+$/, '')
}

export function getLogoUrl(): string {
  return (
    process.env.NEXT_PUBLIC_EMAIL_LOGO_URL ||
    `${siteBase()}/LOGO1.png`
  )
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value: string) {
  if (!value || value === '—') {
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">
          <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#64748b;margin-bottom:3px;">${escapeHtml(label)}</span>
          <span style="font-size:14px;color:#94a3b8;">—</span>
        </td>
      </tr>`
  }
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">
        <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#64748b;margin-bottom:3px;">${escapeHtml(label)}</span>
        <span style="font-size:14px;color:#0f172a;line-height:1.5;">${escapeHtml(value).replace(/\n/g, '<br/>')}</span>
      </td>
    </tr>`
}

function shell(opts: {
  logoUrl: string
  eyebrow: string
  title: string
  subtitle?: string
  body: string
  footerExtra?: string
}) {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:28px 12px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#2563eb 100%);padding:28px 24px;text-align:center;">
              <img src="${opts.logoUrl}" alt="Vanguard Schools" width="88" style="width:88px;height:auto;display:block;margin:0 auto 12px auto;border:0;" />
              <p style="margin:0 0 6px 0;color:rgba(255,255,255,.85);font-size:12px;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(opts.eyebrow)}</p>
              <h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.3;font-weight:700;">${escapeHtml(opts.title)}</h1>
              ${
                opts.subtitle
                  ? `<p style="margin:10px 0 0 0;color:rgba(255,255,255,.9);font-size:14px;">${escapeHtml(opts.subtitle)}</p>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="padding:28px 26px 10px 26px;">
              ${opts.body}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 26px 28px 26px;">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;color:#64748b;font-size:12px;line-height:1.55;">
                <strong style="color:#1e3a8a;">Vanguard Schools</strong><br/>
                Jr. Toribio de Luzuriaga Mz F lote 18 y 19 - SMP<br/>
                Tel: 946 592 100 / 922 084 833 · admin@vanguardschools.edu.pe<br/>
                ${opts.footerExtra || ''}
                <span style="display:block;margin-top:8px;">© ${year} Vanguard Schools — Mensaje automático del sitio web</span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Correo al colegio: visita guiada */
export function emailVisitaColegio(opts: {
  logoUrl: string
  nombre: string
  email: string
  telefono?: string
  nivelInteres?: string
  fechaPreferida?: string
  horarioPreferido?: string
  numeroEstudiantes?: string
  mensaje?: string
}) {
  const body = `
    <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
      Nueva solicitud de <strong>visita guiada</strong> desde la web institucional.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
      ${row('Nombre', opts.nombre)}
      ${row('Email', opts.email)}
      ${row('Teléfono', opts.telefono || '—')}
      ${row('Nivel de interés', opts.nivelInteres || '—')}
      ${row('Fecha preferida', opts.fechaPreferida || '—')}
      ${row('Horario preferido', opts.horarioPreferido || '—')}
      ${row('N° de estudiantes (aprox.)', opts.numeroEstudiantes || '—')}
      ${row('Comentarios', opts.mensaje || '—')}
    </table>
    <p style="margin:14px 0 0 0;font-size:12px;color:#94a3b8;">Puede responder directamente a este correo (Reply-To del interesado).</p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Formulario web',
    title: 'Nueva visita guiada',
    subtitle: opts.nombre,
    body,
  })
}

/** Correo al usuario: acuse visita */
export function emailVisitaUsuario(opts: {
  logoUrl: string
  nombre: string
  fechaPreferida?: string
  horarioPreferido?: string
}) {
  const body = `
    <p style="margin:0 0 14px 0;color:#334155;font-size:15px;line-height:1.65;">
      Estimado/a <strong>${escapeHtml(opts.nombre)}</strong>,
    </p>
    <p style="margin:0 0 14px 0;color:#475569;font-size:15px;line-height:1.65;">
      Gracias por su interés en Vanguard Schools. Hemos recibido su solicitud de
      <strong>visita guiada</strong> y nos pondremos en contacto para confirmar la fecha y hora.
    </p>
    <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:0 10px 10px 0;padding:14px 16px;margin:18px 0;">
      <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.55;">
        <strong>Preferencia indicada</strong><br/>
        Fecha: ${escapeHtml(opts.fechaPreferida || '—')}<br/>
        Horario: ${escapeHtml(opts.horarioPreferido || '—')}
      </p>
    </div>
    <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">
      Atentamente,<br/>
      <strong style="color:#1e3a8a;">Equipo de Admisión · Vanguard Schools</strong>
    </p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Vanguard Schools',
    title: 'Solicitud recibida',
    subtitle: 'Visita guiada',
    body,
  })
}

/** Correo al colegio: postulación Trabaja con Nosotros */
export function emailTrabajaColegio(opts: {
  logoUrl: string
  nombre: string
  email: string
  telefono?: string
  puesto: string
  mensaje?: string
  cvNombre?: string
}) {
  const body = `
    <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
      Nueva <strong>postulación</strong> desde el formulario Trabaja con Nosotros.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
      ${row('Nombre', opts.nombre)}
      ${row('Email', opts.email)}
      ${row('Teléfono', opts.telefono || '—')}
      ${row('Puesto de interés', opts.puesto)}
      ${row('Mensaje', opts.mensaje || '—')}
      ${row('CV adjunto', opts.cvNombre || '—')}
    </table>
    <p style="margin:14px 0 0 0;font-size:12px;color:#94a3b8;">El PDF del curriculum va adjunto a este correo. Puede responder (Reply-To) al postulante.</p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Formulario web',
    title: 'Nueva postulación',
    subtitle: opts.puesto,
    body,
  })
}

/** Correo al usuario: acuse postulación */
export function emailTrabajaUsuario(opts: {
  logoUrl: string
  nombre: string
  puesto?: string
}) {
  const body = `
    <p style="margin:0 0 14px 0;color:#334155;font-size:15px;line-height:1.65;">
      Estimado/a <strong>${escapeHtml(opts.nombre)}</strong>,
    </p>
    <p style="margin:0 0 14px 0;color:#475569;font-size:15px;line-height:1.65;">
      Gracias por su interés en formar parte de Vanguard Schools. Hemos recibido su postulación
      ${opts.puesto ? `para <strong>${escapeHtml(opts.puesto)}</strong>` : ''}
      y nuestro equipo de Recursos Humanos la revisará a la brevedad.
    </p>
    <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:0 10px 10px 0;padding:14px 16px;margin:18px 0;">
      <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.55;">
        Si su perfil se ajusta a una vacante, nos pondremos en contacto con usted
        a través de los datos proporcionados.
      </p>
    </div>
    <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">
      Atentamente,<br/>
      <strong style="color:#1e3a8a;">Recursos Humanos · Vanguard Schools</strong>
    </p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Vanguard Schools',
    title: 'Postulación recibida',
    subtitle: 'Trabaja con Nosotros',
    body,
  })
}

/** Correo al colegio: nuevo contacto */
export function emailContactoColegio(opts: {
  logoUrl: string
  nombre: string
  email: string
  telefono?: string
  asunto?: string
  mensaje: string
}) {
  const body = `
    <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
      Se recibió un nuevo mensaje desde el formulario <strong>Contáctenos</strong> de la web.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
      ${row('Nombre', opts.nombre)}
      ${row('Email del remitente', opts.email)}
      ${row('Teléfono', opts.telefono || '—')}
      ${row('Asunto', opts.asunto || '—')}
      ${row('Mensaje', opts.mensaje)}
    </table>
    <p style="margin:14px 0 0 0;font-size:12px;color:#94a3b8;">Puede responder directamente a este correo (Reply-To del usuario).</p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Formulario web',
    title: 'Nuevo mensaje de contacto',
    subtitle: opts.nombre,
    body,
  })
}

/** Correo al usuario: acuse de contacto */
export function emailContactoUsuario(opts: {
  logoUrl: string
  nombre: string
}) {
  const body = `
    <p style="margin:0 0 14px 0;color:#334155;font-size:15px;line-height:1.65;">
      Estimado/a <strong>${escapeHtml(opts.nombre)}</strong>,
    </p>
    <p style="margin:0 0 14px 0;color:#475569;font-size:15px;line-height:1.65;">
      Gracias por contactarnos. Hemos recibido su mensaje y nuestro equipo le responderá
      a la brevedad posible.
    </p>
    <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:0 10px 10px 0;padding:14px 16px;margin:18px 0;">
      <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.55;">
        Si necesita ayuda inmediata, llámenos a
        <strong>946 592 100 / 922 084 833</strong>
        o escriba a <strong>admin@vanguardschools.edu.pe</strong>.
      </p>
    </div>
    <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">
      Atentamente,<br/>
      <strong style="color:#1e3a8a;">Equipo Vanguard Schools</strong>
    </p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Vanguard Schools',
    title: 'Recibimos su mensaje',
    subtitle: 'Contáctenos',
    body,
  })
}

/** Correo al colegio: nueva sugerencia */
export function emailSugerenciaColegio(opts: {
  logoUrl: string
  nombre: string
  email: string
  telefono?: string
  relacion?: string
  tipo?: string
  mensaje: string
}) {
  const body = `
    <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
      Se recibió una nueva <strong>sugerencia / comentario</strong> desde la web institucional.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
      ${row('Nombre', opts.nombre)}
      ${row('Email del remitente', opts.email)}
      ${row('Teléfono', opts.telefono || '—')}
      ${row('Relación con el colegio', opts.relacion || '—')}
      ${row('Tipo de mensaje', opts.tipo || '—')}
      ${row('Mensaje', opts.mensaje)}
    </table>
    <p style="margin:14px 0 0 0;font-size:12px;color:#94a3b8;">Puede responder directamente a este correo (Reply-To del usuario).</p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Formulario web',
    title: 'Nueva sugerencia recibida',
    subtitle: opts.nombre,
    body,
  })
}

/** Correo al usuario: acuse de sugerencia */
export function emailSugerenciaUsuario(opts: {
  logoUrl: string
  nombre: string
}) {
  const body = `
    <p style="margin:0 0 14px 0;color:#334155;font-size:15px;line-height:1.65;">
      Estimado/a <strong>${escapeHtml(opts.nombre)}</strong>,
    </p>
    <p style="margin:0 0 14px 0;color:#475569;font-size:15px;line-height:1.65;">
      Gracias por escribirnos. Hemos recibido su mensaje de <strong>sugerencias y comentarios</strong>
      y nuestro equipo lo revisará con atención.
    </p>
    <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:0 10px 10px 0;padding:14px 16px;margin:18px 0;">
      <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.55;">
        No es necesario responder a este correo. Si necesita ayuda inmediata, llámenos a
        <strong>946 592 100 / 922 084 833</strong>.
      </p>
    </div>
    <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">
      Atentamente,<br/>
      <strong style="color:#1e3a8a;">Equipo Vanguard Schools</strong>
    </p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Vanguard Schools',
    title: 'Recibimos su mensaje',
    subtitle: 'Sugerencias y comentarios',
    body,
  })
}

/** Correo al colegio: nuevo reclamo/queja */
export function emailReclamoColegio(opts: {
  logoUrl: string
  numero: string
  tipoLabel: string
  razonSocial: string
  ruc: string
  nombre: string
  email: string
  telefono?: string
  tipoDocumento: string
  numeroDocumento: string
  domicilio?: string
  relacion?: string
  alumnoNombre?: string
  alumnoDni?: string
  bienContratado?: string
  fechaHecho?: string
  monto?: string
  detalle: string
  pedido: string
  adjunto?: string
  fechaRegistro: string
}) {
  const body = `
    <div style="text-align:center;margin:0 0 18px 0;">
      <span style="display:inline-block;background:#1e3a8a;color:#fff;font-weight:700;font-size:15px;padding:10px 18px;border-radius:999px;letter-spacing:.02em;">
        N° ${escapeHtml(opts.numero)}
      </span>
    </div>
    <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
      Nuevo registro en el <strong>Libro de Reclamaciones</strong> (${escapeHtml(opts.tipoLabel)}).
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row('Tipo', opts.tipoLabel)}
      ${row('Proveedor', `${opts.razonSocial} — RUC: ${opts.ruc}`)}
      ${row('Reclamante', opts.nombre)}
      ${row('Documento', `${opts.tipoDocumento} ${opts.numeroDocumento}`)}
      ${row('Email', opts.email)}
      ${row('Teléfono', opts.telefono || '—')}
      ${row('Domicilio', opts.domicilio || '—')}
      ${row('Relación', opts.relacion || '—')}
      ${row('Alumno', opts.alumnoNombre ? `${opts.alumnoNombre} (DNI: ${opts.alumnoDni || '—'})` : '—')}
      ${row('Bien / servicio', opts.bienContratado || '—')}
      ${row('Fecha del hecho', opts.fechaHecho || '—')}
      ${row('Monto reclamado', opts.monto || '—')}
      ${row('Detalle', opts.detalle)}
      ${row('Pedido del consumidor', opts.pedido)}
      ${row('Adjunto', opts.adjunto || 'Ninguno')}
      ${row('Fecha de registro', opts.fechaRegistro)}
    </table>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Libro de Reclamaciones',
    title: `${opts.tipoLabel} registrado`,
    subtitle: opts.numero,
    body,
  })
}

/** Correo al usuario: acuse de reclamo */
export function emailReclamoUsuario(opts: {
  logoUrl: string
  nombre: string
  numero: string
  tipoLabel: string
  telefonos: string
  emailContacto: string
}) {
  const body = `
    <p style="margin:0 0 14px 0;color:#334155;font-size:15px;line-height:1.65;">
      Estimado/a <strong>${escapeHtml(opts.nombre)}</strong>,
    </p>
    <p style="margin:0 0 14px 0;color:#475569;font-size:15px;line-height:1.65;">
      Hemos registrado su <strong>${escapeHtml(opts.tipoLabel.toLowerCase())}</strong> en el
      Libro de Reclamaciones de Vanguard Schools.
    </p>
    <div style="text-align:center;margin:20px 0;">
      <div style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 22px;">
        <p style="margin:0 0 4px 0;font-size:12px;color:#1d4ed8;text-transform:uppercase;letter-spacing:.06em;">Número de registro</p>
        <p style="margin:0;font-size:22px;font-weight:700;color:#1e3a8a;">${escapeHtml(opts.numero)}</p>
      </div>
    </div>
    <p style="margin:0 0 14px 0;color:#475569;font-size:15px;line-height:1.65;">
      Conserve este número para el seguimiento. Nuestro equipo revisará su caso y se comunicará
      con usted a la brevedad.
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;margin:16px 0;color:#475569;font-size:14px;line-height:1.55;">
      <strong style="color:#1e3a8a;">Contacto institucional</strong><br/>
      Teléfonos: ${escapeHtml(opts.telefonos)}<br/>
      Email: ${escapeHtml(opts.emailContacto)}
    </div>
    <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">
      Atentamente,<br/>
      <strong style="color:#1e3a8a;">Vanguard Schools</strong>
    </p>
  `
  return shell({
    logoUrl: opts.logoUrl,
    eyebrow: 'Acuse de recibo',
    title: 'Registro confirmado',
    subtitle: 'Libro de Reclamaciones',
    body,
  })
}
