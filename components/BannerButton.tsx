'use client'

import { useEffect, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import BannerModal from './BannerModal'

interface BannerData {
  activo: boolean
  tiempoCambio: number
  imagenes: Array<{
    id: string
    ruta: string
    activo: boolean
    url?: string
  }>
}

export default function BannerButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bannerData, setBannerData] = useState<BannerData | null>(null)

  // Cargar datos del banner
  useEffect(() => {
    const loadBannerData = async () => {
      try {
        const response = await fetch('/api/banner')
        if (response.ok) {
          const data = await response.json()
          setBannerData(data)
        }
      } catch (error) {
        console.error('Error cargando banner:', error)
      }
    }
    loadBannerData()
  }, [])

  // Solo mostrar el botón si el banner está activo y hay imágenes activas
  if (!bannerData || !bannerData.activo) {
    return null
  }

  const imagenesActivas = bannerData.imagenes.filter(img => img.activo)
  if (imagenesActivas.length === 0) {
    return null
  }

  return (
    <>
      {/* Botón flotante del banner - Posicionado arriba del chat */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-110 flex items-center justify-center group"
        aria-label="Ver banners"
        title="Ver promociones y ofertas"
      >
        <FiImage size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Modal del banner */}
      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

