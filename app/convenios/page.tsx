import { Metadata } from 'next'
import Link from 'next/link'
import { FiFileText, FiMail } from 'react-icons/fi'
import { getConvenios } from '@/lib/convenios'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Convenios - Vanguard Schools',
  description:
    'Conoce nuestros convenios con instituciones reconocidas: Cambridge (Inglés), AquaXtreme (Natación) y Valley (Robótica).',
}

export default async function ConveniosPage() {
  const data = await getConvenios()

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{data.titulo}</h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              {data.subtitulo}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {data.intro && (
              <div className="text-center mb-12">
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">{data.intro}</p>
              </div>
            )}

            <div className="space-y-8">
              {data.items.map((convenio) => (
                <div
                  key={convenio.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className={`bg-gradient-to-br ${convenio.color} p-8 text-white`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1.5 shrink-0">
                          {convenio.logo ? (
                            <img
                              src={convenio.logo}
                              alt={`Logo ${convenio.nombre}`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-primary-700 font-extrabold text-lg">
                              {convenio.nombre.slice(0, 1)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold mb-2">{convenio.nombre}</h2>
                          <p className="text-white/90">{convenio.descripcion}</p>
                        </div>
                      </div>

                      {convenio.pdf ? (
                        <a
                          href={convenio.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-2 bg-white text-primary-700 px-3 py-2 md:px-4 rounded-full font-semibold text-sm shadow-md hover:bg-primary-50 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                          aria-label="Ver convenio en PDF"
                        >
                          <FiFileText className="text-primary-700" size={18} />
                          <span className="hidden md:inline">Ver convenio (PDF)</span>
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {(convenio.imagen || convenio.beneficios.length > 0) && (
                    <div className="p-8">
                      {convenio.imagen ? (
                        <div className="mb-6 rounded-xl overflow-hidden bg-slate-100">
                          <img
                            src={convenio.imagen}
                            alt={convenio.nombre}
                            className="w-full max-h-72 object-cover"
                          />
                        </div>
                      ) : null}
                      {convenio.beneficios.length > 0 && (
                        <>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Beneficios</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {convenio.beneficios.map((beneficio, idx) => (
                              <div key={`${convenio.id}-${idx}`} className="flex items-center space-x-3">
                                <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                                <span className="text-gray-700">{beneficio}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <p className="text-gray-800 md:mr-4">{data.ctaTexto}</p>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-md hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <FiMail size={18} />
                <span>Ir a Contáctanos</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
