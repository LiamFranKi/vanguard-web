import { Metadata } from 'next'
import Link from 'next/link'
import { FiGlobe, FiDroplet, FiCpu, FiFileText, FiMail } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Convenios - Vanguard Schools',
  description: 'Conoce nuestros convenios con instituciones reconocidas: Cambridge (Inglés), AquaXtreme (Natación) y Valley (Robótica).',
}

export default function ConveniosPage() {
  const convenios = [
    {
      id: 'cambridge',
      nombre: 'Cambridge (Inglés)',
      descripcion: 'Programa de inglés certificado por Cambridge Assessment English',
      icon: FiGlobe,
      color: 'from-green-500 to-emerald-500',
      pdf: '/documentos/ConvenioCambridge.pdf',
      beneficios: [
        'Certificación internacional reconocida',
        'Metodología comunicativa',
        'Preparación para exámenes Cambridge',
        'Docentes certificados',
      ]
    },
    {
      id: 'aquaxtreme',
      nombre: 'AquaXtreme (Natación)',
      descripcion: 'Programa de natación y desarrollo acuático',
      icon: FiDroplet,
      color: 'from-cyan-500 to-blue-500',
      pdf: '/documentos/ConvenioAquaxtreme.pdf',
      beneficios: [
        'Instalaciones modernas',
        'Instructores certificados',
        'Desarrollo físico integral',
        'Seguridad y supervisión constante',
      ]
    },
    {
      id: 'valley',
      nombre: 'Valley (Robótica)',
      descripcion: 'Programa de robótica y tecnología educativa',
      icon: FiCpu,
      color: 'from-purple-500 to-pink-500',
      pdf: '/documentos/ConvenioValley.pdf',
      beneficios: [
        'Pensamiento computacional',
        'Proyectos prácticos',
        'Competencias y concursos',
        'Preparación para el futuro tecnológico',
      ]
    },
  ]

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Convenios
            </h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              Alianzas estratégicas para una educación integral
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Trabajamos con instituciones reconocidas para ofrecer programas de excelencia 
                que complementan nuestra formación académica.
              </p>
            </div>

            <div className="space-y-8">
              {convenios.map((convenio) => {
                const Icon = convenio.icon
                return (
                  <div
                    key={convenio.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className={`bg-gradient-to-br ${convenio.color} p-8 text-white`}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                            <Icon size={32} />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold mb-2">{convenio.nombre}</h2>
                            <p className="text-white/90">{convenio.descripcion}</p>
                          </div>
                        </div>

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
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Beneficios</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {convenio.beneficios.map((beneficio, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                            <span className="text-gray-700">{beneficio}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <p className="text-gray-800 md:mr-4">
                <strong>¿Interesado en nuestros convenios?</strong> Contáctanos para más información 
                sobre cómo participar en estos programas.
              </p>
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

