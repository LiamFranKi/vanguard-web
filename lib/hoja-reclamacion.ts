export type HojaReclamacionDatos = {
  numero: string
  fechaRegistro: string
  tipoLabel: string
  razonSocial: string
  nombreComercial: string
  ruc: string
  direccion: string
  nombre: string
  email: string
  telefono: string
  tipoDocumento: string
  numeroDocumento: string
  domicilio: string
  relacion: string
  alumnoNombre: string
  alumnoDni: string
  bienContratado: string
  fechaHecho: string
  monto: string
  detalle: string
  pedido: string
}

function esc(text: string) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function cel(label: string, value: string, span = false) {
  return `<td colspan="${span ? 2 : 1}" style="border:1px solid #94a3b8;padding:7px 8px;vertical-align:top;">
    <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.03em;">${esc(label)}</div>
    <div style="font-size:13px;color:#0f172a;margin-top:2px;white-space:pre-wrap;">${esc(value || '—')}</div>
  </td>`
}

/** HTML de la hoja (correo y misma estructura que la vista imprimible). */
export function htmlHojaReclamacion(d: HojaReclamacionDatos): string {
  const marca = d.nombreComercial || d.razonSocial
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td colspan="2" style="background:#0f172a;color:#fff;padding:12px 14px;text-align:center;">
        <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.8;">Hoja de reclamación</div>
        <div style="font-size:18px;font-weight:700;margin-top:2px;">${esc(marca)}</div>
        <div style="font-size:12px;margin-top:4px;">N.° ${esc(d.numero)} · ${esc(d.tipoLabel)}</div>
      </td>
    </tr>
    <tr>${cel('Razón social / RUC', `${d.razonSocial} · ${d.ruc}`)}${cel('Dirección del establecimiento', d.direccion)}</tr>
    <tr>${cel('Fecha de registro', d.fechaRegistro)}${cel('Fecha del hecho', d.fechaHecho)}</tr>
    <tr>${cel('Consumidor', d.nombre)}${cel('Documento', `${d.tipoDocumento} ${d.numeroDocumento}`)}</tr>
    <tr>${cel('Domicilio', d.domicilio)}${cel('Correo / teléfono', [d.email, d.telefono].filter(Boolean).join(' · '))}</tr>
    <tr>${cel('Relación / alumno', [d.relacion, d.alumnoNombre && `Alumno: ${d.alumnoNombre}${d.alumnoDni ? ` (DNI ${d.alumnoDni})` : ''}`].filter(Boolean).join(' · '))}${cel('Bien o servicio / monto', [d.bienContratado, d.monto && `S/ ${d.monto}`].filter(Boolean).join(' · '))}</tr>
    <tr>${cel('Detalle del reclamo o queja', d.detalle, true)}</tr>
    <tr>${cel('Pedido del consumidor', d.pedido, true)}</tr>
    <tr>
      <td colspan="2" style="border:1px solid #94a3b8;padding:7px 8px;min-height:64px;">
        <div style="font-size:10px;color:#64748b;text-transform:uppercase;">Observaciones y acciones del proveedor</div>
        <div style="height:52px;"></div>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #94a3b8;padding:8px;font-size:11px;color:#475569;">
        Destinatario: consumidor. Conserve esta hoja. El proveedor debe responder por escrito en el plazo legal.
      </td>
    </tr>
  </table>`
}
