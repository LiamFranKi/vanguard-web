import { Metadata } from 'next'
import WorkWithUsForm from '@/components/sections/WorkWithUsForm'

export const metadata: Metadata = {
  title: 'Trabaja con Nosotros - Vanguard Schools',
  description:
    'Envía tu curriculum vitae y postula para ser parte del equipo de Vanguard Schools.',
}

export default function TrabajaConNosotrosPage() {
  return (
    <div className="pt-20">
      {/* Banner superior */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Trabaja con Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              Comparte tu experiencia y forma parte de la familia Vanguard
            </p>
          </div>
        </div>
      </section>

      <WorkWithUsForm />
    </div>
  )
}



