import { Metadata } from 'next'
import AdmissionForm from '@/components/sections/AdmissionForm'

export const metadata: Metadata = {
  title: 'Admisión 2026 - Vanguard Schools',
  description: 'Formulario de admisión y ratificación para el año 2026 en Vanguard Schools. Regístrate y nos comunicaremos contigo.',
}

export default function Admision2026Page() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 via-amber-600 via-orange-600 to-amber-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Admisión y Ratificación 2026
            </h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              Forma parte de la familia Vanguard Schools
            </p>
          </div>
        </div>
      </section>

      <AdmissionForm />
    </div>
  )
}

