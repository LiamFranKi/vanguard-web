import { Metadata } from 'next'
import VisitForm from '@/components/sections/VisitForm'

export const metadata: Metadata = {
  title: 'Visita Guiada - Vanguard Schools',
  description: 'Agenda una visita guiada a Vanguard Schools y conoce nuestras instalaciones, metodología educativa y más.',
}

export default function VisitaGuiadaPage() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Visita Guiada
            </h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              Conoce nuestras instalaciones y metodología educativa
            </p>
          </div>
        </div>
      </section>

      {/* Sección única interactiva de reserva de visita guiada */}
      <VisitForm />
    </div>
  )
}

