import { Metadata } from 'next'
import { FiDownload, FiBook, FiUsers, FiAward, FiFileText } from 'react-icons/fi'
import listaUtilesData from '@/config/lista-utiles.json'

export const metadata: Metadata = {
  title: 'Lista de Útiles - Vanguard Schools',
  description: 'Lista de útiles escolares por nivel educativo en Vanguard Schools. Descarga las listas de materiales necesarios para cada grado.',
}

const colorConfig = {
  inicial: {
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    hover: 'hover:bg-pink-100',
    border: 'border-pink-200',
    icon: 'bg-pink-500',
  },
  primaria: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-200',
    icon: 'bg-blue-500',
  },
  secundaria: {
    gradient: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-100',
    border: 'border-purple-200',
    icon: 'bg-purple-500',
  },
}

const nivelIcons = {
  inicial: FiBook,
  primaria: FiUsers,
  secundaria: FiAward,
}

export default function ListaUtilesPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <FiFileText size={40} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Lista de Útiles
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Materiales necesarios para el año escolar 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary-800 mb-4">
                Listas por Nivel Educativo
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Descarga la lista de útiles correspondiente al grado de tu hijo. 
                Cada lista incluye todos los materiales necesarios para el año escolar.
              </p>
            </div>

            {/* Levels Grid */}
            <div className="space-y-16">
              {listaUtilesData.niveles.map((nivel) => {
                const colors = colorConfig[nivel.id as keyof typeof colorConfig]
                const Icon = nivelIcons[nivel.id as keyof typeof nivelIcons]
                
                // Validación de seguridad
                if (!colors) {
                  console.error(`Color config no encontrado para nivel: ${nivel.id}`)
                  return null
                }
                
                return (
                  <div key={nivel.id} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Level Header */}
                    <div className={`bg-gradient-to-r ${colors.gradient} text-white p-8`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 ${colors.icon} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon size={28} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold mb-2">{nivel.nombre}</h3>
                          <p className="text-white/90">
                            {nivel.grados.length} {nivel.grados.length === 1 ? 'grado disponible' : 'grados disponibles'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Grades Grid */}
                    <div className="p-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nivel.grados.map((grado) => (
                          <div
                            key={grado.id}
                            className={`${colors.bg} rounded-xl p-6 border-2 ${colors.border} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className={`text-xl font-bold ${colors.text} mb-2`}>
                                  {grado.nombre}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Lista completa de materiales
                                </p>
                              </div>
                              <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <FiFileText size={20} className="text-white" />
                              </div>
                            </div>
                            
                            <a
                              href={grado.ruta}
                              download={grado.archivo}
                              className={`w-full ${colors.bg} ${colors.text} ${colors.hover} px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 border-2 ${colors.border} hover:shadow-md transform hover:scale-105`}
                            >
                              <FiDownload size={18} />
                              <span>Descargar PDF</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Info Box */}
            <div className="mt-16 bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg shadow-md">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiFileText size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Información Importante
                  </h4>
                  <p className="text-gray-800 leading-relaxed">
                    Las listas de útiles se actualizan anualmente. Para obtener la lista más reciente 
                    o resolver cualquier duda sobre los materiales, te recomendamos contactarnos directamente 
                    o visitar nuestras instalaciones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
