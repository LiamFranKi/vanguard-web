import { Metadata } from 'next'
import { FiBook, FiUsers, FiCpu, FiAward, FiHome, FiDroplet, FiGrid, FiBookOpen, FiUsers as FiUsersIcon, FiSmartphone, FiDatabase, FiMusic, FiCoffee, FiFilm, FiActivity } from 'react-icons/fi'
import NivelInversion from '@/components/niveles/NivelInversion'
import NivelClasicoAviso from '@/components/niveles/NivelClasicoAviso'
import { getNivelesInversion } from '@/lib/niveles-inversion'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Educación Inicial (diseño anterior) - Vanguard Schools',
  description: 'Versión anterior de Educación Inicial en Vanguard Schools.',
  robots: { index: false, follow: true },
}

export default async function InicialPage() {
  const inversion = await getNivelesInversion()
  return (
    <div className="pt-20">
      <NivelClasicoAviso hrefNuevo="/niveles/inicial" />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-500 to-rose-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Educación Inicial
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Edades: 3 a 5 años
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Introducción */}
            <div className="mb-16">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                En Vanguard Schools acompañamos la primera infancia con un enfoque integral y respetuoso de los derechos de cada niña y niño. Más que preparar para primaria, buscamos un desarrollo pleno, donde los niños exploren, se expresen y construyan conocimiento con alegría.
              </p>
              
              <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-lg mb-6">
                <p className="text-gray-800 mb-3">
                  <span className="text-2xl mr-2">✨</span>
                  <strong>Metodología:</strong> Aplicamos el modelo STEAM (ciencia, tecnología, ingeniería, arte y matemáticas) a través del juego y la investigación.
                </p>
                <p className="text-gray-800">
                  <span className="text-2xl mr-2">🌱</span>
                  <strong>Objetivo:</strong> Estimular curiosidad, creatividad, pensamiento crítico, autonomía y trabajo en equipo.
                </p>
              </div>
            </div>

            {/* 4 Cards principales */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiBook className="text-pink-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Desarrollo Psicomotor</h3>
                <p className="text-gray-600 text-sm">Actividades que fortalecen la coordinación y motricidad</p>
              </div>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiCpu className="text-pink-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Metodología STEAM</h3>
                <p className="text-gray-600 text-sm">Aprendizaje integrado de ciencia, tecnología, ingeniería, arte y matemáticas</p>
              </div>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiUsers className="text-pink-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Socialización</h3>
                <p className="text-gray-600 text-sm">Espacios para desarrollar habilidades sociales</p>
              </div>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiAward className="text-pink-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Creatividad</h3>
                <p className="text-gray-600 text-sm">Fomento de la expresión artística y creativa</p>
              </div>
            </div>

            {/* Beneficios del Nivel Inicial */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-extrabold text-primary-800 mb-6 text-center">
                Beneficios del Nivel Inicial en Vanguard Schools
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <FiHome className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Amplios espacios con la mejor infraestructura antisísmica.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCpu className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Trabajamos con el método STEAM.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiBook className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Aula de SECTORES.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDroplet className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Piscinas temperadas - semiolímpica y patera.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiGrid className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">02 canchas de grass sintético.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiBookOpen className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Libros COREFO incluidos.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiUsersIcon className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Trabajamos con 1 maestra por 10 estudiantes.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiUsersIcon className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Maestras especializadas en cada nivel.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDatabase className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema intranet escolar personalizado.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiSmartphone className="text-pink-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema APP Móvil personalizado.</span>
                </div>
              </div>
            </div>

            {/* Talleres */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 mb-16 border-2 border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-800 mb-4 sm:mb-6 text-center">
                Talleres del Nivel Inicial
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-4 sm:mb-6"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-pink-50 rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition-all">
                  <FiDroplet className="text-pink-600 mx-auto mb-2 w-7 h-7 sm:w-8 sm:h-8" size={28} />
                  <span className="text-gray-800 font-semibold text-sm sm:text-base">Natación</span>
                </div>
                <div className="bg-pink-50 rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition-all">
                  <FiMusic className="text-pink-600 mx-auto mb-2 w-7 h-7 sm:w-8 sm:h-8" size={28} />
                  <span className="text-gray-800 font-semibold text-sm sm:text-base">Danza</span>
                </div>
                <div className="bg-pink-50 rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition-all">
                  <FiCoffee className="text-pink-600 mx-auto mb-2 w-7 h-7 sm:w-8 sm:h-8" size={28} />
                  <span className="text-gray-800 font-semibold text-sm sm:text-base">Minichef</span>
                </div>
                <div className="bg-pink-50 rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition-all">
                  <FiFilm className="text-pink-600 mx-auto mb-2 w-7 h-7 sm:w-8 sm:h-8" size={28} />
                  <span className="text-gray-800 font-semibold text-sm sm:text-base">Escenificación</span>
                </div>
                <div className="bg-pink-50 rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition-all col-span-2 sm:col-span-1">
                  <FiActivity className="text-pink-600 mx-auto mb-2 w-7 h-7 sm:w-8 sm:h-8" size={28} />
                  <span className="text-gray-800 font-semibold text-sm sm:text-base">Psicomotricidad</span>
                </div>
              </div>
            </div>

            <NivelInversion
              titulo="Inversión del Nivel Inicial en Vanguard Schools"
              grupos={[
                { etiqueta: 'Inicial 03 años' },
                { etiqueta: 'Inicial 04 años' },
                { etiqueta: 'Inicial 05 años' },
              ]}
              monto={inversion.inicial}
              textoLinea={inversion.textoLinea}
              descuentoHermano={inversion.descuentoHermano}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

