'use client'

import { useState } from 'react'
import { FiChevronDown, FiTarget, FiEye, FiHeart, FiCpu, FiRefreshCw, FiGlobe, FiHome, FiMonitor, FiDroplet, FiGrid, FiCode, FiBook, FiWifi, FiDatabase, FiSmartphone } from 'react-icons/fi'

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="pt-16 pb-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-800 mb-4 whitespace-nowrap">
              ¿Por qué estudiar en Vanguard?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              En Vanguard Schools ofrecemos una educación moderna, segura e integral, desde inicial hasta secundaria. Contamos con infraestructura antisísmica, aulas amplias e interactivas, piscinas temperadas y libros digitales gratuitos. Nuestro programa incluye inglés intensivo, talleres artísticos y deportivos, sin costo adicional, acompañamiento psicopedagógico y una sólida formación en valores. Formamos líderes creativos y responsables, preparados para un futuro global.
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center space-x-2 text-primary-800 hover:text-primary-900 font-bold text-lg transition-colors group"
            >
              <span>{isExpanded ? 'Saber menos' : 'Saber más'}</span>
              <FiChevronDown 
                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                size={22}
              />
            </button>
          </div>

          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? 'max-h-[3000px] opacity-100 pb-8 mt-8' : 'max-h-0 opacity-0 mt-0 pb-0'
            }`}
          >
            <div className="grid md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 p-8 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiTarget className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-primary-800 mb-2">
                  Misión
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
              </div>
              <p className="text-gray-700 leading-relaxed text-base text-center">
                Formar estudiantes con una educación integral, sólida en valores y competencias académicas.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 p-8 rounded-2xl shadow-lg border border-green-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiEye className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-secondary-800 mb-2">
                  Visión
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
              </div>
              <p className="text-gray-700 leading-relaxed text-base text-center">
                Ser un colegio referente en innovación educativa en Perú, reconocido por la calidad de sus egresados.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-gradient-to-br from-pink-50 via-pink-100/50 to-pink-50 p-8 rounded-2xl shadow-lg border border-pink-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiHeart className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-pink-800 mb-2">
                  Valores
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-2"></div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-gray-700 leading-relaxed text-sm">Valoramos la diversidad y la dignidad de cada persona.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-gray-700 leading-relaxed text-sm">Asumimos con compromiso nuestras acciones y decisiones.</span>
                </li>
              </ul>
            </div>
            </div>

            {/* Segunda fila de cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* STEAM */}
            <div className="bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-50 p-8 rounded-2xl shadow-lg border border-amber-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiCpu className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-amber-800 mb-2">
                  STEAM
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
              </div>
              <p className="text-gray-700 leading-relaxed text-base text-center">
                Basada en el enfoque STEAM (Science, Technology, Engineering, Arts and Mathematics), con proyectos, resolución de problemas, aprendizaje activo y colaborativo.
              </p>
            </div>

            {/* Aula Invertida */}
            <div className="bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-50 p-8 rounded-2xl shadow-lg border border-purple-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiRefreshCw className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-purple-800 mb-2">
                  Aula Invertida
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
              </div>
              <p className="text-gray-700 leading-relaxed text-base text-center">
                Clases enfocadas en práctica, debates y proyectos; la teoría se revisa en casa con plataformas digitales.
              </p>
            </div>

            {/* Formación Bilingüe */}
            <div className="bg-gradient-to-br from-cyan-50 via-cyan-100/50 to-cyan-50 p-8 rounded-2xl shadow-lg border border-cyan-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiGlobe className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-cyan-800 mb-2">
                  Formación Bilingüe
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
              </div>
              <p className="text-gray-700 leading-relaxed text-base text-center">
                Dominio del inglés con inmersión completa desde el nivel inicial. Preparamos a los alumnos para acreditaciones internacionales de inglés.
              </p>
            </div>
            </div>

            {/* Sección Nuestros Beneficios */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-800 mb-4">
                  Nuestros Beneficios
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Características que nos distinguen y nos hacen únicos
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 7500+ m² de Infraestructura */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiHome className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-primary-800 mb-2">
                      7500+ m² de Infraestructura
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    Instalaciones antisísmicas modernas y seguras
                  </p>
                </div>

                {/* Pizarras Interactivas */}
                <div className="bg-gradient-to-br from-indigo-50 via-indigo-100/50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-indigo-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiMonitor className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-indigo-800 mb-2">
                      Pizarras Interactivas
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    En todas nuestras aulas para un aprendizaje dinámico
                  </p>
                </div>

                {/* Piscinas Temperadas */}
                <div className="bg-gradient-to-br from-cyan-50 via-cyan-100/50 to-cyan-50 p-6 rounded-2xl shadow-lg border border-cyan-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiDroplet className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-cyan-800 mb-2">
                      Piscinas Temperadas
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    Semiolímpica y patera para todas las edades
                  </p>
                </div>

                {/* Canchas de Grass Sintético */}
                <div className="bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 p-6 rounded-2xl shadow-lg border border-green-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiGrid className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-green-800 mb-2">
                      Canchas de Grass Sintético
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    2 canchas profesionales para deportes (techada)
                  </p>
                </div>

                {/* Laboratorio de Cómputo y Robótica */}
                <div className="bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-50 p-6 rounded-2xl shadow-lg border border-purple-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiCode className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-purple-800 mb-2">
                      Laboratorio de Cómputo y Robótica
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    Equipado con tecnología de última generación
                  </p>
                </div>

                {/* Libros Digitales Gratuitos */}
                <div className="bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-50 p-6 rounded-2xl shadow-lg border border-amber-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiBook className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-amber-800 mb-2">
                      Libros Digitales Gratuitos
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    Sistema interactivo de libros digitales incluido
                  </p>
                </div>

                {/* Internet Fibra Óptica */}
                <div className="bg-gradient-to-br from-teal-50 via-teal-100/50 to-teal-50 p-6 rounded-2xl shadow-lg border border-teal-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiWifi className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-teal-800 mb-2">
                      Internet Fibra Óptica
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    1000 Mbps para todas las áreas de la institución
                  </p>
                </div>

                {/* Intranet Escolar */}
                <div className="bg-gradient-to-br from-violet-50 via-violet-100/50 to-violet-50 p-6 rounded-2xl shadow-lg border border-violet-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiDatabase className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-violet-800 mb-2">
                      Intranet Escolar
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    Sistema personalizado para seguimiento académico
                  </p>
                </div>

                {/* APP Móvil */}
                <div className="bg-gradient-to-br from-rose-50 via-rose-100/50 to-rose-50 p-6 rounded-2xl shadow-lg border border-rose-200/50 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <FiSmartphone className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-rose-800 mb-2">
                      APP Móvil
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm text-center">
                    Acceso desde cualquier dispositivo para estudiantes y padres
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

