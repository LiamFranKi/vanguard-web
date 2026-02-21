'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface BannerImage {
  id: string
  ruta: string
  activo: boolean
  url?: string
}

interface BannerData {
  activo: boolean
  tiempoCambio: number
  imagenes: BannerImage[]
}

interface BannerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BannerModal({ isOpen, onClose }: BannerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [bannerData, setBannerData] = useState<BannerData | null>(null)
  const [imagenesActivas, setImagenesActivas] = useState<BannerImage[]>([])

  // Cargar datos del banner dinámicamente
  useEffect(() => {
    const loadBannerData = async () => {
      try {
        const response = await fetch('/api/banner?t=' + Date.now(), { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setBannerData(data)
          setImagenesActivas(data.imagenes.filter((img: BannerImage) => img.activo))
        }
      } catch (error) {
        console.error('Error cargando banner:', error)
      }
    }
    loadBannerData()
  }, [])

  // Cambiar a siguiente imagen
  const nextImage = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % imagenesActivas.length)
      setIsTransitioning(false)
    }, 300)
  }, [imagenesActivas.length])

  // Cambiar a imagen anterior
  const prevImage = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + imagenesActivas.length) % imagenesActivas.length)
      setIsTransitioning(false)
    }, 300)
  }, [imagenesActivas.length])

  // Auto-avanzar cada X segundos
  useEffect(() => {
    if (!isOpen || !bannerData || imagenesActivas.length === 0) return

    const interval = setInterval(() => {
      nextImage()
    }, bannerData.tiempoCambio)

    return () => clearInterval(interval)
  }, [isOpen, bannerData, imagenesActivas.length, nextImage])

  // Cerrar con tecla ESC
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Si no hay datos cargados, no mostrar nada
  if (!bannerData) {
    return null
  }

  // Si no hay imágenes activas o el banner está desactivado, no mostrar nada
  if (!isOpen || !bannerData.activo || imagenesActivas.length === 0) {
    return null
  }

  const currentImage = imagenesActivas[currentIndex]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20"
        aria-label="Cerrar"
      >
        <FiX size={24} className="text-white" />
      </button>

      {/* Contenedor de imagen */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        {/* Imagen - Clickable si tiene URL */}
        {currentImage.url && currentImage.url.trim() !== '' ? (
          <a
            href={currentImage.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative w-full max-w-6xl h-full max-h-[90vh] transition-opacity duration-300 block cursor-pointer ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            onClick={(e) => {
              // Permitir que el click funcione normalmente para abrir la URL
              e.stopPropagation()
            }}
          >
            <Image
              src={currentImage.ruta}
              alt={`Banner ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
              quality={90}
              unoptimized
            />
          </a>
        ) : (
          <div className={`relative w-full max-w-6xl h-full max-h-[90vh] transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <Image
              src={currentImage.ruta}
              alt={`Banner ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
              quality={90}
              unoptimized
            />
          </div>
        )}

        {/* Botón anterior */}
        {imagenesActivas.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20 z-40"
            aria-label="Imagen anterior"
          >
            <FiChevronLeft size={28} className="text-white" />
          </button>
        )}

        {/* Botón siguiente */}
        {imagenesActivas.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20 z-40"
            aria-label="Imagen siguiente"
          >
            <FiChevronRight size={28} className="text-white" />
          </button>
        )}

        {/* Indicadores de posición (puntos) */}
        {imagenesActivas.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
            {imagenesActivas.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true)
                  setTimeout(() => {
                    setCurrentIndex(index)
                    setIsTransitioning(false)
                  }, 300)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

