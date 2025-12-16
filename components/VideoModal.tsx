'use client'

import { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
  title?: string
}

export default function VideoModal({ isOpen, onClose, videoSrc, title = 'Conoce Vanguard Schools' }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Pausar el video cuando se cierra el modal
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay con backdrop blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" />
      
      {/* Contenedor del modal */}
      <div
        className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all transform hover:scale-110 hover:rotate-90"
            aria-label="Cerrar"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Contenedor del video */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            className="w-full h-auto max-h-[80vh]"
            preload="metadata"
          >
            Tu navegador no soporta la reproducción de videos.
          </video>
        </div>

        {/* Footer opcional */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Descubre más sobre nuestra institución educativa
          </p>
        </div>
      </div>
    </div>
  )
}

