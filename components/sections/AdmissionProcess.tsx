'use client'

import Link from 'next/link'
import { FiFileText, FiUsers, FiClipboard, FiCheckCircle, FiCalendar } from 'react-icons/fi'

const steps = [
  {
    number: 1,
    title: 'Inscripción',
    description: 'Completa tu registro en línea o presencial con apoyo de nuestro equipo de admisión.',
    icon: FiFileText,
    color: 'from-blue-500 to-blue-600'
  },
  {
    number: 2,
    title: 'Entrevista',
    description: 'Realizamos una entrevista personalizada para conocer mejor a tu familia y a tu hijo/a.',
    icon: FiUsers,
    color: 'from-green-500 to-green-600'
  },
  {
    number: 3,
    title: 'Evaluación',
    description: 'Los postulantes participan en una evaluación formativa según su nivel escolar.',
    icon: FiClipboard,
    color: 'from-purple-500 to-purple-600'
  },
  {
    number: 4,
    title: 'Confirmación',
    description: 'Recibirás la respuesta oficial y los pasos a seguir para la matrícula.',
    icon: FiCheckCircle,
    color: 'from-orange-500 to-orange-600'
  }
]

export default function AdmissionProcess() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-800 mb-4">
              Proceso de Admisión
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Un proceso claro y sencillo para formar parte de nuestra comunidad educativa
            </p>
          </div>

          {/* Pasos del proceso */}
          <div className="relative">
            {/* Línea conectora (solo en desktop) */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-green-300 via-purple-300 to-orange-300 opacity-30"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.number}
                    className="relative flex flex-col items-center text-center group"
                  >
                    {/* Círculo con número e icono */}
                    <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl mb-6 transform group-hover:scale-110 transition-all duration-300 z-10`}>
                      <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <Icon className="text-white mb-1" size={28} />
                        <span className="text-white font-bold text-sm bg-white/30 rounded-full px-2 py-0.5">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Card con información */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-100 flex-1 w-full">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>

                    {/* Flecha conectora (solo en desktop, excepto el último) */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-full w-full -translate-x-1/2 z-0">
                        <div className="flex justify-center">
                          <svg
                            className="w-16 h-8 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Botón CTA */}
          <div className="text-center mt-16">
            <Link
              href="/visita-guiada"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-gold-500/50"
            >
              <FiCalendar size={24} />
              <span>Agendar Cita</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

