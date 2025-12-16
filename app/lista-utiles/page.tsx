import { Metadata } from 'next'
import { FiDownload } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Lista de Útiles - Vanguard Schools',
  description: 'Lista de útiles escolares por nivel educativo en Vanguard Schools.',
}

export default function ListaUtilesPage() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Lista de Útiles
            </h1>
            <p className="text-xl md:text-2xl text-white/90 md:whitespace-nowrap">
              Materiales necesarios para el año escolar
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Listas por nivel educativo
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                A continuación encontrarás las listas de útiles escolares organizadas por nivel. 
                Puedes descargar cada lista en formato PDF.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-lg">Educación Inicial</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Materiales para niños de 3 a 5 años
                  </p>
                  <button className="w-full bg-pink-50 text-pink-600 px-4 py-2 rounded-lg font-semibold hover:bg-pink-100 transition-colors flex items-center justify-center space-x-2">
                    <FiDownload />
                    <span>Descargar PDF</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-lg">Educación Primaria</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Materiales para niños de 6 a 11 años
                  </p>
                  <button className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2">
                    <FiDownload />
                    <span>Descargar PDF</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-base whitespace-nowrap">Educación Secundaria</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Materiales para jóvenes de 12 a 16 años
                  </p>
                  <button className="w-full bg-purple-50 text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center space-x-2">
                    <FiDownload />
                    <span>Descargar PDF</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg">
              <p className="text-gray-800">
                <strong>Nota:</strong> Las listas de útiles se actualizan anualmente. 
                Para obtener la lista más reciente, te recomendamos contactarnos directamente 
                o visitar nuestras instalaciones.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

