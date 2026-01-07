import { Metadata } from 'next'
import CalendarizationCalendar from '@/components/CalendarizationCalendar'

export const metadata: Metadata = {
  title: 'Calendarización General 2026 - Vanguard Schools',
  description: 'Consulta el calendario académico y eventos del año 2026 de Vanguard Schools.',
}

export default function CalendarizacionPage() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Calendarización General 2026
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Consulta todos los eventos, exámenes y actividades del año académico
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <CalendarizationCalendar />
        </div>
      </section>
    </div>
  )
}

