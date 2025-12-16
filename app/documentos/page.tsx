import { Metadata } from 'next'
import { FiFileText, FiDownload } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Documentos de Interés - Vanguard Schools',
  description: 'Documentos importantes y recursos de interés para padres y estudiantes de Vanguard Schools.',
}

export default function DocumentosPage() {
  const documentos = [
    {
      categoria: 'Admisión',
      items: [
        { nombre: 'Proceso de Admisión 2026', tipo: 'PDF' },
        { nombre: 'Propuesta Académica 2026', tipo: 'PDF' },
        { nombre: 'Formulario de Postulación 2026', tipo: 'PDF' },
      ]
    },
    {
      categoria: 'Contratos y Reglamentos',
      items: [
        { nombre: 'Contratos de Servicios 2026', tipo: 'PDF' },
        { nombre: 'Reglamento Interno - Norma de Convivencia 2026', tipo: 'PDF' },
      ]
    },
    {
      categoria: 'Información General',
      items: [
        { nombre: 'Plan Curricular Institucional 2026', tipo: 'PDF' },
        { nombre: 'Calendarización 2026', tipo: 'PDF' },
        { nombre: 'Evaluaciones y Asistencias 2026', tipo: 'PDF' },
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
              Documentos de Interés
            </h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              Recursos e información importante para padres y estudiantes
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {documentos.map((categoria, idx) => (
              <div key={idx} className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {categoria.categoria}
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {categoria.items.map((doc, docIdx) => (
                    <div
                      key={docIdx}
                      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiFileText className="text-primary-600" size={24} />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-900 mb-1">{doc.nombre}</h3>
                          <p className="text-sm text-gray-500">{doc.tipo}</p>
                        </div>
                        <button className="text-primary-600 hover:text-primary-700">
                          <FiDownload size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg mt-8">
              <p className="text-gray-800">
                <strong>Nota:</strong> Algunos documentos pueden requerir credenciales de acceso. 
                Si necesitas ayuda para acceder a algún documento, por favor contáctanos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

