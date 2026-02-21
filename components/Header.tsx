'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMenu, FiX, FiChevronDown, FiHome, FiMap, FiShoppingBag, FiFileText, FiLayers, FiShield, FiLock, FiHelpCircle, FiBriefcase, FiMessageSquare, FiCamera } from 'react-icons/fi'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [inicioOpen, setInicioOpen] = useState(false)
  const [levelsOpen, setLevelsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    // Throttle para mejor rendimiento
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200 transition-all duration-300"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/LOGO6.png"
                alt="Vanguard Schools Logo"
                width={96}
                height={96}
                className="object-contain transition-transform group-hover:scale-105"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Vanguard Schools
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold leading-tight mt-0.5">
                <span className="text-gray-900">A la vanguardia</span> <span className="text-secondary-800">de la tecnología</span>
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Inicio Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setInicioOpen(true)}
              onMouseLeave={() => setInicioOpen(false)}
            >
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold transition-all rounded-md px-3 py-2 hover:bg-blue-100"
              >
                <FiHome className="text-primary-700" size={18} />
                <span>Inicio</span>
              </Link>
              {inicioOpen && (
                <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl py-2 border-t-2 border-primary-600">
                  <Link
                    href="/calendarizacion"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-primary-600 transition-all rounded-md mx-2"
                  >
                    <FiMap className="text-primary-700" size={16} />
                    <span>Calendarización</span>
                  </Link>
                  <Link
                    href="/preguntas-frecuentes"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-primary-600 transition-all rounded-md mx-2"
                  >
                    <FiHelpCircle className="text-primary-700" size={16} />
                    <span>Preguntas Frecuentes</span>
                  </Link>
                  <Link
                    href="/lista-utiles"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-primary-600 transition-all rounded-md mx-2"
                  >
                    <FiShoppingBag className="text-primary-700" size={16} />
                    <span>Lista de Útiles</span>
                  </Link>
                  <Link
                    href="/documentos"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-primary-600 transition-all rounded-md mx-2"
                  >
                    <FiFileText className="text-primary-700" size={16} />
                    <span>Documentos de Interés</span>
                  </Link>
                  <Link
                    href="/trabaja-con-nosotros"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-primary-600 transition-all rounded-md mx-2"
                  >
                    <FiBriefcase className="text-primary-700" size={16} />
                    <span>Trabaja con Nosotros</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Niveles Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setLevelsOpen(true)}
              onMouseLeave={() => setLevelsOpen(false)}
            >
              <button className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold transition-all rounded-md px-3 py-2 hover:bg-blue-100">
                <FiLayers className="text-primary-700" size={18} />
                <span>Niveles</span>
              </button>
              {levelsOpen && (
                <div className="absolute top-full left-0 mt-0 w-72 bg-white rounded-lg shadow-xl py-2 border-t-2 border-primary-600">
                  <Link
                    href="/niveles/inicial"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-primary-600 transition-all rounded-md mx-2"
                  >
                    <FiLayers className="text-primary-700" size={16} />
                    <span>Educación Inicial</span>
                  </Link>
                  <Link
                    href="/niveles/primaria"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-primary-600 transition-all rounded-md mx-2"
                  >
                    <FiLayers className="text-primary-700" size={16} />
                    <span>Educación Primaria</span>
                  </Link>
                  <Link
                    href="/niveles/secundaria"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-primary-600 transition-all rounded-md mx-2"
                  >
                    <FiLayers className="text-primary-700" size={16} />
                    <span>Educación Secundaria</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/convenios"
              className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold transition-all rounded-md px-3 py-2 hover:bg-blue-100"
            >
              <FiShield className="text-primary-700" size={18} />
              <span>Convenios</span>
            </Link>
            <a
              href="https://tour.vanguardschools.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold transition-all rounded-md px-3 py-2 hover:bg-blue-100"
            >
              <FiCamera className="text-primary-700" size={18} />
              <span>Tour Virtual</span>
            </a>
            <Link
              href="/sugerencias"
              className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold transition-all rounded-md px-3 py-2 hover:bg-blue-100"
            >
              <FiMessageSquare className="text-primary-700" size={18} />
              <span>Sugerencias</span>
            </Link>
            <a
              href="https://sistema.vanguardschools.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <FiLock size={18} />
              <span>Intranet</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-800 hover:text-primary-600"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              {/* Inicio con submenú */}
              <div>
                <div className="flex items-center w-full">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold hover:bg-blue-100 rounded-md px-3 py-2 transition-all flex-1"
                  >
                    <FiHome className="text-primary-700" size={18} />
                    <span>Inicio</span>
                  </Link>
                  <button
                    onClick={() => setInicioOpen(!inicioOpen)}
                    className="text-gray-800 hover:text-primary-600 hover:bg-blue-100 rounded-md px-2 py-2 transition-all"
                  >
                    <FiChevronDown className={`transition-transform ${inicioOpen ? 'rotate-180' : ''}`} size={16} />
                  </button>
                </div>
                {inicioOpen && (
                  <div className="pl-8 flex flex-col space-y-1 mt-1">
                    <Link
                      href="/calendarizacion"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-blue-100 font-medium rounded-md px-3 py-2 transition-all"
                    >
                      <FiMap className="text-primary-700" size={16} />
                      <span>Calendarización</span>
                    </Link>
                    <Link
                      href="/preguntas-frecuentes"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-blue-100 font-medium rounded-md px-3 py-2 transition-all"
                    >
                      <FiHelpCircle className="text-primary-700" size={16} />
                      <span>Preguntas Frecuentes</span>
                    </Link>
                    <Link
                      href="/lista-utiles"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-blue-100 font-medium rounded-md px-3 py-2 transition-all"
                    >
                      <FiShoppingBag className="text-primary-700" size={16} />
                      <span>Lista de Útiles</span>
                    </Link>
                    <Link
                      href="/documentos"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-blue-100 font-medium rounded-md px-3 py-2 transition-all"
                    >
                      <FiFileText className="text-primary-700" size={16} />
                      <span>Documentos de Interés</span>
                    </Link>
                    <Link
                      href="/trabaja-con-nosotros"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-blue-100 font-medium rounded-md px-3 py-2 transition-all"
                    >
                      <FiBriefcase className="text-primary-700" size={16} />
                      <span>Trabaja con Nosotros</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Niveles con submenú */}
              <div>
                <button
                  onClick={() => setLevelsOpen(!levelsOpen)}
                  className="flex items-center justify-between w-full text-gray-800 hover:text-primary-600 font-semibold hover:bg-blue-100 rounded-md px-3 py-2 transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <FiLayers className="text-primary-700" size={18} />
                    <span>Niveles</span>
                  </div>
                  <FiChevronDown className={`transition-transform ${levelsOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                {levelsOpen && (
                  <div className="pl-8 flex flex-col space-y-1 mt-1">
                    <Link
                      href="/niveles/inicial"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-blue-100 font-medium rounded-md px-3 py-2 transition-all"
                    >
                      <FiLayers className="text-primary-700" size={16} />
                      <span>Educación Inicial</span>
                    </Link>
                    <Link
                      href="/niveles/primaria"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-blue-100 font-medium rounded-md px-3 py-2 transition-all"
                    >
                      <FiLayers className="text-primary-700" size={16} />
                      <span>Educación Primaria</span>
                    </Link>
                    <Link
                      href="/niveles/secundaria"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-blue-100 font-medium rounded-md px-3 py-2 transition-all"
                    >
                      <FiLayers className="text-primary-700" size={16} />
                      <span>Educación Secundaria</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/convenios"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold hover:bg-blue-100 rounded-md px-3 py-2 transition-all"
              >
                <FiShield className="text-primary-700" size={18} />
                <span>Convenios</span>
              </Link>
              <a
                href="https://tour.vanguardschools.edu.pe/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold hover:bg-blue-100 rounded-md px-3 py-2 transition-all"
              >
                <FiCamera className="text-primary-700" size={18} />
                <span>Tour Virtual</span>
              </a>
              <Link
                href="/sugerencias"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 font-semibold hover:bg-blue-100 rounded-md px-3 py-2 transition-all"
              >
                <FiMessageSquare className="text-primary-700" size={18} />
                <span>Sugerencias</span>
              </Link>
              <a
                href="https://sistema.vanguardschools.edu.pe/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-semibold text-center flex items-center justify-center space-x-2 mt-2"
              >
                <FiLock size={18} />
                <span>Intranet</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

