import { Metadata } from 'next'
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi'
import { getFaqs, FaqItem as FaqItemType } from '@/lib/faqs'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes - Vanguard Schools',
  description:
    'Resuelve tus dudas sobre admisiones, horarios, pensiones, uniformes, servicios y más en Vanguard Schools.',
}

function FaqItem({
  index,
  pregunta,
  respuesta,
}: {
  index: number
  pregunta: string
  respuesta: string
}) {
  const id = `faq-${index}`
  const colorVariants = [
    { bg: 'bg-blue-50', border: 'border-blue-100' },
    { bg: 'bg-green-50', border: 'border-green-100' },
    { bg: 'bg-amber-50', border: 'border-amber-100' },
    { bg: 'bg-purple-50', border: 'border-purple-100' },
    { bg: 'bg-pink-50', border: 'border-pink-100' },
  ]
  const color = colorVariants[index % colorVariants.length]

  return (
    <details
      className={`group ${color.bg} ${color.border} border rounded-2xl shadow-md hover:shadow-lg transition-all`}
    >
      <summary
        className="list-none flex items-center justify-between px-5 py-4 cursor-pointer select-none"
      >
        <div className="flex items-start space-x-3">
          <div className="mt-1 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
            <FiHelpCircle className="text-primary-600" size={18} />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            {pregunta}
          </h3>
        </div>
        <div className="ml-3 flex-shrink-0 rounded-full border border-gray-200 bg-gray-50 p-1 transition-transform group-open:rotate-180">
          <FiChevronDown className="text-gray-500" size={18} aria-hidden="true" />
        </div>
      </summary>
      <div
        id={id}
        className="px-5 pb-4 pt-0 text-sm md:text-base text-gray-700 leading-relaxed border-t border-gray-100"
      >
        {respuesta}
      </div>
    </details>
  )
}

export default function PreguntasFrecuentesPage() {
  const faqs: FaqItemType[] = getFaqs()

  // Agrupar FAQs por categoría
  const grupos = faqs.reduce<{ categoria: string; preguntas: FaqItemType[] }[]>(
    (acc, faq) => {
      const categoria = faq.categoria || 'Otras consultas'
      const existente = acc.find(g => g.categoria === categoria)
      if (existente) {
        existente.preguntas.push(faq)
      } else {
        acc.push({ categoria, preguntas: [faq] })
      }
      return acc
    },
    []
  )

  // Para asignar colores distintos de forma global
  let globalIndex = 0

  return (
    <div className="pt-20">
      {/* Banner superior */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              Resolvemos las dudas más comunes sobre nuestra propuesta educativa
            </p>
          </div>
        </div>
      </section>

      {/* Contenido FAQs */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-800 mb-3">
                Encuentra respuestas rápidas
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
                Antes de contactarnos, revisa estas preguntas frecuentes. Si aún tienes dudas,
                estaremos encantados de ayudarte por nuestros canales de atención.
              </p>
            </div>

            {/* Categorías una debajo de otra, preguntas en dos columnas */}
            <div className="space-y-10">
              {grupos.map((grupo, grupoIndex) => (
                <div key={`${grupo.categoria}-${grupoIndex}`}>
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-extrabold text-primary-800 mb-2">
                      {grupo.categoria}
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {grupo.preguntas.map(p => {
                      const idx = globalIndex++
                      return (
                        <FaqItem
                          key={`${grupo.categoria}-${idx}`}
                          index={idx}
                          pregunta={p.pregunta}
                          respuesta={p.respuesta}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


