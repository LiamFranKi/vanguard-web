import { Metadata } from 'next'
import { FiBook, FiUsers, FiCpu, FiAward, FiHome, FiMonitor, FiDroplet, FiGrid, FiBookOpen, FiUsers as FiUsersIcon, FiSmartphone, FiDatabase, FiMusic, FiCoffee, FiFilm, FiTablet, FiGlobe, FiCode, FiTarget, FiHeart, FiMic } from 'react-icons/fi'
import NivelInversion from '@/components/niveles/NivelInversion'
import { getNivelesInversion } from '@/lib/niveles-inversion'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Educación Secundaria - Vanguard Schools',
  description: 'Educación Secundaria en Vanguard Schools. Preparación integral para la vida universitaria y profesional para jóvenes de 12 a 16 años.',
}

export default async function SecundariaPage() {
  const inversion = await getNivelesInversion()
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Educación Secundaria
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Edades: 12 a 16 años
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
                La Educación Secundaria es la etapa final de la Educación Básica, donde los estudiantes consolidan competencias para la vida, fortaleciendo su desarrollo académico y personal.
              </p>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                <p className="text-gray-800 mb-3">
                  <span className="text-2xl mr-2">🎯</span>
                  <strong>Objetivos:</strong>
                </p>
                <ul className="text-gray-800 space-y-2 ml-8">
                  <li>• Fomentar disciplina, estudio y trabajo en equipo.</li>
                  <li>• Desarrollar habilidades intelectuales, emocionales, sociales y comunicacionales.</li>
                  <li>• Promover el respeto, la igualdad de derechos y la ciudadanía activa.</li>
                </ul>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg">
                <p className="text-gray-800">
                  <span className="text-2xl mr-2">🌎</span>
                  <strong>Finalidad:</strong> Preparar a los adolescentes para continuar estudios superiores, integrarse al mundo laboral y ejercer plenamente su ciudadanía, con autonomía y sentido de responsabilidad.
                </p>
              </div>
            </div>

            {/* 3 Cards principales */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiCode className="text-green-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Robótica y Programación</h3>
                <p className="text-gray-600 text-sm">Desarrollo de habilidades tecnológicas y pensamiento computacional</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiGlobe className="text-green-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Inglés Intensivo - Certificación</h3>
                <p className="text-gray-600 text-sm">Dominio del inglés con certificación internacional</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiTarget className="text-green-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Proyecto de Vida</h3>
                <p className="text-gray-600 text-sm">Orientación vocacional y planificación del futuro</p>
              </div>
            </div>

            {/* Beneficios del Nivel Secundaria */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-extrabold text-primary-800 mb-6 text-center">
                Beneficios del Nivel Secundaria en Vanguard Schools
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <FiHome className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Más de 7500 metros cuadrados de la mejor infraestructura antisísmica.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCpu className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Trabajamos con la metodología &quot;Aula Invertida&quot;.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMonitor className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Pizarras interactivas en todas nuestras aulas.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiTablet className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Uso de Tablets en el aula.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiUsersIcon className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Maestros especializados en cada nivel y asignatura.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiGlobe className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Inglés intensivo.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiHeart className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Departamento de psicología.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiTarget className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Charlas vocacionales.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDroplet className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Piscinas temperadas semiolímpica y patera.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiGrid className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">02 canchas de grass sintético.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCpu className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Laboratorio de cómputo de alta tecnología.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiBookOpen className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema de libros digitales e interactivos (gratuitos).</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDatabase className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema de exámenes y tareas virtuales (en línea).</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDatabase className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema intranet escolar personalizado.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiSmartphone className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema APP móvil personalizado.</span>
                </div>
              </div>
            </div>

            {/* Talleres */}
            <div className="bg-white rounded-2xl p-8 mb-16 border-2 border-gray-200">
              <h2 className="text-3xl font-extrabold text-primary-800 mb-6 text-center">
                Talleres del Nivel Secundaria
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                  <FiDroplet className="text-green-600 mx-auto mb-2" size={32} />
                  <span className="text-gray-800 font-semibold">Natación</span>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                  <FiMusic className="text-green-600 mx-auto mb-2" size={32} />
                  <span className="text-gray-800 font-semibold">Danza</span>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                  <FiMic className="text-green-600 mx-auto mb-2" size={32} />
                  <span className="text-gray-800 font-semibold">Oratoria</span>
                </div>
              </div>
            </div>

            <NivelInversion
              titulo="Inversión del Nivel Secundaria en Vanguard Schools"
              grupos={[
                { etiqueta: '1° de Secundaria' },
                { etiqueta: '2° a 5° de Secundaria' },
              ]}
              monto={inversion.secundaria}
              textoLinea={inversion.textoLinea}
              descuentoHermano={inversion.descuentoHermano}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
