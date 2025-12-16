import { Metadata } from 'next'
import Image from 'next/image'
import { FiBook, FiUsers, FiCpu, FiAward, FiHome, FiMonitor, FiDroplet, FiGrid, FiBookOpen, FiUsers as FiUsersIcon, FiSmartphone, FiDatabase, FiMusic, FiCoffee, FiFilm, FiTablet, FiGlobe } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Educación Primaria - Vanguard Schools',
  description: 'Educación Primaria en Vanguard Schools. Formación académica sólida con enfoque en competencias y valores para niños de 6 a 11 años.',
}

export default function PrimariaPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Educación Primaria
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Edades: 6 a 11 años
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
                Nuestra etapa de Educación Primaria brinda a los estudiantes las bases necesarias para un desarrollo integral y un paso exitoso hacia la secundaria.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                <p className="text-gray-800 mb-3">
                  <span className="text-2xl mr-2">📚</span>
                  <strong>Objetivos principales:</strong>
                </p>
                <ul className="text-gray-800 space-y-2 ml-8">
                  <li>• Fomentar la lectura, la escritura y la comprensión oral.</li>
                  <li>• Desarrollar hábitos, valores, creatividad y pensamiento crítico.</li>
                  <li>• Potenciar la expresión artística y socioemocional.</li>
                </ul>
              </div>
            </div>

            {/* 3 Cards principales */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiBook className="text-blue-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Base Académica Sólida</h3>
                <p className="text-gray-600 text-sm">Fundamentos sólidos en todas las áreas del conocimiento</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiGlobe className="text-blue-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Inglés Intensivo</h3>
                <p className="text-gray-600 text-sm">Dominio del inglés con metodología vivencial</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <FiAward className="text-blue-600 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-gray-900 mb-2">Valores y Principios</h3>
                <p className="text-gray-600 text-sm">Formación integral en principios y valores</p>
              </div>
            </div>

            {/* Beneficios del Nivel Primaria */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-extrabold text-primary-800 mb-6 text-center">
                Beneficios del Nivel Primaria en Vanguard Schools
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <FiHome className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Más de 7500 metros cuadrados de la mejor infraestructura antisísmica.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCpu className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Trabajamos mediante PROYECTOS - AULA INVERTIDA.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMonitor className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Pizarras interactivas en todas nuestras aulas.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiTablet className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Uso de Tablets en el aula desde 4° de primaria.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiUsersIcon className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Maestros especializados en cada nivel y asignatura.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiGlobe className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Inglés vivencial.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDroplet className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Piscinas temperadas semiolímpica y patera.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiGrid className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">02 canchas de grass sintético.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCpu className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Laboratorio de cómputo de alta tecnología.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiBookOpen className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema de libros digitales e interactivos (gratuitos).</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDatabase className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema de exámenes y tareas virtuales (en línea).</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDatabase className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema intranet escolar personalizado.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiSmartphone className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sistema APP móvil personalizado.</span>
                </div>
              </div>
            </div>

            {/* Talleres */}
            <div className="bg-white rounded-2xl p-8 mb-16 border-2 border-gray-200">
              <h2 className="text-3xl font-extrabold text-primary-800 mb-6 text-center">
                Talleres del Nivel Primaria
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                  <FiDroplet className="text-blue-600 mx-auto mb-2" size={32} />
                  <span className="text-gray-800 font-semibold">Natación</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                  <FiMusic className="text-blue-600 mx-auto mb-2" size={32} />
                  <span className="text-gray-800 font-semibold">Danza</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                  <FiCoffee className="text-blue-600 mx-auto mb-2" size={32} />
                  <span className="text-gray-800 font-semibold">Minichef</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                  <FiFilm className="text-blue-600 mx-auto mb-2" size={32} />
                  <span className="text-gray-800 font-semibold">Escenificación</span>
                </div>
              </div>
            </div>

            {/* Inversión/Precios */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 border-2 border-primary-200">
              <h2 className="text-3xl font-extrabold text-primary-800 mb-6 text-center">
                Inversión del Nivel Primaria en Vanguard Schools
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8"></div>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 text-center shadow-md">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">1° de Primaria</h3>
                  <div className="text-3xl font-extrabold text-primary-600 mb-2">S/.510.00</div>
                  <p className="text-sm text-gray-600">Matrícula y Pensión</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-md">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">2° y 3° de Primaria</h3>
                  <div className="text-3xl font-extrabold text-primary-600 mb-2">S/.510.00</div>
                  <p className="text-sm text-gray-600">Matrícula y Pensión</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-md">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">4°, 5° y 6° de Primaria</h3>
                  <div className="text-3xl font-extrabold text-primary-600 mb-2">S/.510.00</div>
                  <p className="text-sm text-gray-600">Matrícula y Pensión</p>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-center">
                <p className="text-gray-800 font-semibold">
                  Descuento de S/.20.00 soles por cada hermano matriculado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
