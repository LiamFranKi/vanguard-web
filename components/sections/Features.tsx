import { FiWifi, FiBookOpen, FiUsers, FiAward, FiShield, FiGlobe } from 'react-icons/fi'

const features = [
  {
    icon: FiWifi,
    title: 'Tecnología de Vanguardia',
    description: 'Infraestructura tecnológica moderna para el aprendizaje digital'
  },
  {
    icon: FiBookOpen,
    title: 'Metodología Innovadora',
    description: 'Enfoques pedagógicos actualizados y centrados en el estudiante'
  },
  {
    icon: FiUsers,
    title: 'Docentes Calificados',
    description: 'Equipo docente comprometido con la excelencia educativa'
  },
  {
    icon: FiAward,
    title: 'Excelencia Académica',
    description: 'Resultados destacados en evaluaciones y competencias'
  },
  {
    icon: FiShield,
    title: 'Ambiente Seguro',
    description: 'Espacios seguros y protegidos para el desarrollo integral'
  },
  {
    icon: FiGlobe,
    title: 'Convenios Internacionales',
    description: 'Programas de inglés, robótica y natación con instituciones reconocidas'
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-800 mb-6">
            ¿Por qué elegir Vanguard Schools?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Características que nos distinguen y nos hacen únicos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

