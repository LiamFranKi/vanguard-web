import { Metadata } from 'next'
import Suggestions from '@/components/sections/Suggestions'

export const metadata: Metadata = {
  title: 'Sugerencias - Vanguard Schools',
  description:
    'Comparte tus sugerencias, comentarios y felicitaciones para seguir mejorando juntos en Vanguard Schools.',
}

export default function SugerenciasPage() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Sugerencias y Comentarios</h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              Tu voz es importante para construir juntos un mejor colegio
            </p>
          </div>
        </div>
      </section>

      <Suggestions />
    </div>
  )
}


