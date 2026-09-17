'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiMail, FiMap, FiInfo, FiX } from 'react-icons/fi'
import VideoModal from '@/components/VideoModal'
import type { AdmisionConfigPublica } from '@/lib/admision-config'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [admision, setAdmision] = useState<AdmisionConfigPublica | null>(null)
  const [bannerCerrado, setBannerCerrado] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetch(`/api/admision-config?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return
        setAdmision(data)
        try {
          setBannerCerrado(window.localStorage.getItem(`vanguard-admision-bar-${data.anio}`) === '1')
        } catch {
          setBannerCerrado(false)
        }
      })
      .catch(() => {})
  }, [])

  const showBanner = Boolean(admision?.bannerFlotante && !bannerCerrado)

  const cerrarBanner = () => {
    try {
      window.localStorage.setItem(`vanguard-admision-bar-${admision?.anio || 2027}`, '1')
    } catch {
      /* ignore */
    }
    setBannerCerrado(true)
  }

  return (
    <section className="relative flex min-h-[100svh] md:min-h-screen flex-col text-white">
      {/* Se sirve por API: Next no publica fotos subidas a public/ después del build. */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <img
          src="/api/banner-inicio"
          alt="Campus Vanguard Schools"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-8 pt-28 md:pb-12">
        <div className={`container mx-auto max-w-5xl text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {admision?.chipHero && (
            <div className="mb-4 flex flex-col items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs sm:text-sm font-bold px-4 py-1.5 shadow-lg">
                {admision.textoChip}
              </span>
              <p className="text-white/90 text-xs sm:text-sm font-medium">
                {admision.textoChipSub}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
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
              href={admision?.rutaFormulario || '/admision'}
              className="group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-amber-600/50 text-sm sm:text-base w-full sm:w-auto"
            >
              <FiArrowRight size={18} className="sm:w-5 sm:h-5" />
              <span>{admision?.etiquetaBoton || 'Admisión 2027'}</span>
            </Link>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="group bg-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-pink-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-pink-600/50 text-sm sm:text-base w-full sm:w-auto"
            >
              <FiInfo size={18} className="sm:w-5 sm:h-5" />
              <span>Conócenos</span>
            </button>
          </div>
        </div>
      </div>

      {showBanner && (
        <div className="relative z-20 w-full shrink-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          <div className="relative container mx-auto px-4 py-2.5 pr-16 sm:pr-12 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="font-bold text-sm sm:text-base text-center">{admision?.textoBanner}</span>
            <Link
              href={admision?.rutaFormulario || '/admision'}
              className="inline-flex items-center gap-1.5 bg-white text-orange-600 font-bold text-sm px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors"
            >
              Postula ahora
              <FiArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={cerrarBanner}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/20"
              aria-label="Cerrar aviso de admisión"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/video-vanguard.mp4"
        title="Conoce Vanguard Schools"
      />
    </section>
  )
}
