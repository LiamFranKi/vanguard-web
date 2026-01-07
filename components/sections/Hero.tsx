'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiMapPin, FiPhone, FiMail, FiMap, FiInfo } from 'react-icons/fi'
import VideoModal from '@/components/VideoModal'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/FONDOBANNER.jpg"
          alt="Fondo Vanguard Schools"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>
      
      <div className="container mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className={`max-w-4xl mx-auto text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
            <Link
              href="/contacto"
              className="group bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-blue-600/50 text-sm sm:text-base w-full sm:w-auto"
            >
              <FiMail size={18} className="sm:w-5 sm:h-5" />
              <span>Contáctanos</span>
            </Link>
            <Link
              href="/visita-guiada"
              className="group bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-green-600/50 text-sm sm:text-base w-full sm:w-auto"
            >
              <FiMap size={18} className="sm:w-5 sm:h-5" />
              <span>Visita Guiada</span>
            </Link>
            <Link
              href="/admision-2026"
              className="group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-amber-600/50 text-sm sm:text-base w-full sm:w-auto"
            >
              <FiArrowRight size={18} className="sm:w-5 sm:h-5" />
              <span>Admisión 2026</span>
            </Link>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="group bg-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-pink-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-pink-600/50 text-sm sm:text-base w-full sm:w-auto"
            >
              <FiInfo size={18} className="sm:w-5 sm:h-5" />
              <span>Conócenos</span>
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto mt-8 sm:mt-12">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Jr.+Toribio+de+Luzuriaga+Mz+F+Lote+18+y+19,+San+Martín+de+Porres,+Lima"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 border border-white/30 hover:bg-white/25 transition-all transform hover:scale-105 shadow-xl cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-gold-400/30">
                <FiMapPin className="text-gold-300" size={20} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-100 mb-1 font-medium">Ubicación</p>
                <p className="font-bold text-white text-sm sm:text-base leading-relaxed">Jr. Toribio de Luzuriaga Mz &quot;F&quot; Lote 18 y 19 - SMP</p>
              </div>
            </a>
            <a
              href="https://wa.me/51946592100"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 border border-white/30 hover:bg-white/25 transition-all transform hover:scale-105 shadow-xl cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-gold-400/30">
                <FiPhone className="text-gold-300" size={20} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-100 mb-1 font-medium">Teléfonos</p>
                <p className="font-bold text-white text-sm sm:text-base leading-relaxed">946 592 100 / 922 084 833</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Modal de Video */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/video-vanguard.mp4"
        title="Conoce Vanguard Schools"
      />
    </section>
  )
}


