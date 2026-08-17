import { Metadata } from 'next'
import LibroReclamaciones from '@/components/sections/LibroReclamaciones'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones - Vanguard Schools',
  description:
    'Libro de reclamaciones virtual de Vanguard Schools. Registre su reclamo o queja de forma formal.',
}

export default function LibroDeReclamacionesPage() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Libro de Reclamaciones
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Canal formal para registrar reclamos y quejas
            </p>
          </div>
        </div>
      </section>

      <LibroReclamaciones />
    </div>
  )
}
