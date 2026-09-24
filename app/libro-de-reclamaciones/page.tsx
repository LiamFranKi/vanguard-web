import { Metadata } from 'next'
import LibroReclamaciones from '@/components/sections/LibroReclamaciones'
import { obtenerInstitucionPublica } from '@/lib/institucion-publica'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const inst = await obtenerInstitucionPublica()
  const marca = inst.nombreComercial || inst.razonSocial || 'Colegio'
  return {
    title: `Libro de Reclamaciones - ${marca}`,
    description: `Libro de reclamaciones virtual de ${marca}. Registre su reclamo o queja de forma formal.`,
  }
}

export default async function LibroDeReclamacionesPage() {
  const inst = await obtenerInstitucionPublica()
  const marca = inst.nombreComercial || inst.razonSocial

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-primary-900 text-white py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">
              Código de Protección y Defensa del Consumidor
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Libro de Reclamaciones
            </h1>
            <p className="text-lg md:text-xl text-white/90">{marca}</p>
            <p className="mt-2 text-sm text-white/65">
              {inst.razonSocial}
              {inst.ruc ? ` · RUC ${inst.ruc}` : ''}
            </p>
          </div>
        </div>
      </section>

      <LibroReclamaciones />
    </div>
  )
}
