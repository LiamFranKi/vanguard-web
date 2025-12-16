import Link from 'next/link'
import Image from 'next/image'
import { FiFacebook, FiInstagram, FiYoutube, FiHome, FiLayers, FiShield, FiCamera, FiMessageSquare, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: '#0a1628' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/LOGO7.png"
                  alt="Vanguard Schools Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xl font-bold text-white">
                Vanguard Schools
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              A la vanguardia de la tecnología educativa. Formando líderes del mañana con excelencia académica.
            </p>
            <div className="flex space-x-4 justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <FiFacebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-all transform hover:scale-110"
                aria-label="TikTok"
              >
                <FaTiktok size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-all transform hover:scale-110"
                aria-label="YouTube"
              >
                <FiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Menú */}
          <div>
            <h3 className="font-semibold mb-4">Menú</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FiHome className="text-white" size={14} />
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link href="/convenios" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FiShield className="text-white" size={14} />
                  <span>Convenios</span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://tour.vanguardschools.edu.pe/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2"
                >
                  <FiCamera className="text-white" size={14} />
                  <span>Tour Virtual</span>
                </a>
              </li>
              <li>
                <Link href="/sugerencias" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FiMessageSquare className="text-white" size={14} />
                  <span>Sugerencias</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Niveles */}
          <div>
            <h3 className="font-semibold mb-4">Niveles</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/niveles/inicial" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FiLayers className="text-white" size={14} />
                  <span>Educación Inicial</span>
                </Link>
              </li>
              <li>
                <Link href="/niveles/primaria" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FiLayers className="text-white" size={14} />
                  <span>Educación Primaria</span>
                </Link>
              </li>
              <li>
                <Link href="/niveles/secundaria" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FiLayers className="text-white" size={14} />
                  <span>Educación Secundaria</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <div className="flex items-start space-x-2">
                  <FiPhone className="text-white mt-1 flex-shrink-0" size={14} />
                  <div>
                    <strong className="text-white">Teléfonos:</strong><br />
                    <span>946 592 100 / 922 084 833</span>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <div className="flex items-start space-x-2">
                  <FiMapPin className="text-white mt-1 flex-shrink-0" size={14} />
                  <div>
                    <strong className="text-white">Dirección:</strong><br />
                    Jr. Toribio de Luzuriaga Mz F<br />
                    lote 18 y 19 - SMP
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <div className="flex items-start space-x-2">
                  <FiMail className="text-white mt-1 flex-shrink-0" size={14} />
                  <div>
                    <strong className="text-white">Email:</strong><br />
                    <a href="mailto:admin@vanguardschools.edu.pe" className="hover:text-white transition-colors">
                      admin@vanguardschools.edu.pe
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 text-center text-sm text-gray-300" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}>
          <p>© 2026 Vanguard Schools - Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  )
}

