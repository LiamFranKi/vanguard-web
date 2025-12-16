import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiBook, FiUsers, FiAward } from 'react-icons/fi'

const levels = [
  {
    id: 'inicial',
    title: 'Educación Inicial',
    description: 'Primeros pasos en el aprendizaje con metodología lúdica e integral',
    age: '3 a 5 años',
    icon: FiBook,
    image: '/inicial.jpeg',
    href: '/niveles/inicial',
    features: ['Desarrollo psicomotor', 'Metodología STEAM', 'Socialización']
  },
  {
    id: 'primaria',
    title: 'Educación Primaria',
    description: 'Formación académica sólida con enfoque en competencias y valores',
    age: '6 a 11 años',
    icon: FiUsers,
    image: '/primaria.jpeg',
    href: '/niveles/primaria',
    features: ['Base académica sólida', 'Inglés Intensivo', 'Valores y principios']
  },
  {
    id: 'secundaria',
    title: 'Educación Secundaria',
    description: 'Preparación integral para la vida universitaria y profesional',
    age: '12 a 16 años',
    icon: FiAward,
    image: '/secundaria.jpeg',
    href: '/niveles/secundaria',
    features: ['Robótica y Programación', 'Inglés Intensivo - Certificación', 'Proyecto de vida']
  },
]

export default function Levels() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-800 mb-4">
            Niveles Educativos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tres niveles diseñados para acompañar el crecimiento integral de nuestros estudiantes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {levels.map((level) => {
            const Icon = level.icon
            return (
              <div
                key={level.id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
              >
                <div className="bg-gray-800 p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={level.image}
                      alt={level.title}
                      fill
                      className="object-cover opacity-70"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gray-900/40"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                        level.id === 'inicial' ? 'bg-pink-500' :
                        level.id === 'primaria' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}>
                        <Icon size={28} className="text-white drop-shadow-lg" />
                      </div>
                      <span className={`text-sm font-bold px-4 py-1.5 rounded-full shadow-lg text-white ${
                        level.id === 'inicial' ? 'bg-pink-500' :
                        level.id === 'primaria' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}>
                        {level.age}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">{level.title}</h3>
                    <p className="text-white leading-relaxed drop-shadow-md font-medium">{level.description}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <ul className="space-y-3 mb-8">
                    {level.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-gray-700">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={level.href}
                    className="inline-flex items-center space-x-2 text-primary-600 font-bold hover:text-primary-700 group-hover:translate-x-2 transition-all"
                  >
                    <span>Conocer más</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

