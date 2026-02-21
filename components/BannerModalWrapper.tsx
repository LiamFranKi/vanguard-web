'use client'

import { useEffect, useState } from 'react'
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

export default function BannerModalWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [bannerData, setBannerData] = useState<BannerData | null>(null)

  // Cargar datos del banner
  useEffect(() => {
    const loadBannerData = async () => {
      try {
        const response = await fetch('/api/banner?t=' + Date.now(), { cache: 'no-store' })
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

  // Verificar si ya se mostró en esta sesión
  useEffect(() => {
    const shown = sessionStorage.getItem('banner-shown')
    if (shown === 'true') {
      setHasShown(true)
    }
  }, [])

  useEffect(() => {
    if (!bannerData) return

    // Solo mostrar si el banner está activo y hay imágenes
    const imagenesActivas = bannerData.imagenes.filter(img => img.activo)
    
    // Si no hay imágenes activas, no mostrar el modal
    if (imagenesActivas.length === 0) {
      return
    }
    
    if (bannerData.activo && imagenesActivas.length > 0 && !hasShown) {
      // Pequeño delay para que la página cargue primero
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
        // Guardar en sessionStorage que ya se mostró (solo en esta sesión del navegador)
        sessionStorage.setItem('banner-shown', 'true')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [bannerData, hasShown])

  if (!bannerData || !bannerData.activo) return null

  return (
    <BannerModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  )
}

