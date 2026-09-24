'use client'

import type { HojaReclamacionDatos } from '@/lib/hoja-reclamacion'

function Dato({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border border-slate-300 px-2.5 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap text-[13px] text-slate-900">{value || '—'}</p>
    </div>
  )
}

export default function HojaReclamacion({
  data,
  onNueva,
}: {
  data: HojaReclamacionDatos
  onNueva?: () => void
}) {
  const marca = data.nombreComercial || data.razonSocial

  return (
    <div className="hoja-reclamacion-print mx-auto max-w-3xl">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registro exitoso</h2>
          <p className="text-sm text-slate-600">
            N.° {data.numero}. Conserve esta hoja. También se envió una copia a {data.email}.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Imprimir hoja
          </button>
          {onNueva && (
            <button
              type="button"
              onClick={onNueva}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Registrar otro
            </button>
          )}
        </div>
      </div>

      <article className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
        <header className="bg-slate-900 px-5 py-4 text-center text-white">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Hoja de reclamación</p>
          <h3 className="mt-1 text-lg font-bold">{marca}</h3>
          <p className="mt-1 text-sm text-white/90">
            N.° {data.numero} · {data.tipoLabel}
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <Dato label="Razón social / RUC" value={`${data.razonSocial} · ${data.ruc}`} />
          <Dato label="Dirección del establecimiento" value={data.direccion} />
          <Dato label="Fecha de registro" value={data.fechaRegistro} />
          <Dato label="Fecha del hecho" value={data.fechaHecho} />
          <Dato label="Consumidor" value={data.nombre} />
          <Dato label="Documento" value={`${data.tipoDocumento} ${data.numeroDocumento}`} />
          <Dato label="Domicilio" value={data.domicilio} />
          <Dato label="Correo / teléfono" value={[data.email, data.telefono].filter(Boolean).join(' · ')} />
          <Dato
            label="Relación / alumno"
            value={[
              data.relacion,
              data.alumnoNombre
                ? `Alumno: ${data.alumnoNombre}${data.alumnoDni ? ` (DNI ${data.alumnoDni})` : ''}`
                : '',
            ]
              .filter(Boolean)
              .join(' · ')}
          />
          <Dato
            label="Bien o servicio / monto"
            value={[data.bienContratado, data.monto ? `S/ ${data.monto}` : ''].filter(Boolean).join(' · ')}
          />
        </div>
        <Dato label="Detalle del reclamo o queja" value={data.detalle} />
        <Dato label="Pedido del consumidor" value={data.pedido} />
        <div className="min-h-[72px] border border-slate-300 px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Observaciones y acciones del proveedor
          </p>
        </div>
        <p className="border border-slate-300 px-2.5 py-2 text-[11px] text-slate-500">
          Destinatario: consumidor. El proveedor debe responder por escrito en el plazo legal.
        </p>
      </article>
    </div>
  )
}
