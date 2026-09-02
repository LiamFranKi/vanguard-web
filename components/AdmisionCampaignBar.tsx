'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiArrowRight, FiX } from 'react-icons/fi'
import type { AdmisionConfigPublica } from '@/lib/admision-config'

function storageKey(anio: number) {
  return `vanguard-admision-bar-${anio}`
}

export default function AdmisionCampaignBar() {
  const pathname = usePathname()
  const [config, setConfig] = useState<AdmisionConfigPublica | null>(null)
  const [cerrado, setCerrado] = useState(true)

  useEffect(() => {
    let cancel = false
    fetch(`/api/admision-config?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancel || !data) return
        setConfig(data)
        const key = storageKey(Number(data.anio) || 2027)
        setCerrado(typeof window !== 'undefined' && window.localStorage.getItem(key) === '1')
      })
      .catch(() => {
        if (!cancel) setConfig(null)
      })
    return () => {
      cancel = true
    }
  }, [])

  const esHome = pathname === '/'
  if (esHome) return null
  if (!config || !config.bannerFlotante || cerrado) return null
  if (pathname === '/admision' || (pathname && pathname.indexOf('/admision-') === 0)) return null

  const cerrar = () => {
    try {
      window.localStorage.setItem(storageKey(config.anio), '1')
    } catch {
      /* ignore */
    }
    setCerrado(true)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg">
      <div className="relative container mx-auto px-4 py-2.5 pr-12 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span className="font-bold text-sm sm:text-base text-center">{config.textoBanner}</span>
        <Link
          href={config.rutaFormulario || '/admision'}
          className="inline-flex items-center gap-1.5 bg-white text-orange-600 font-bold text-sm px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors"
        >
          Postula ahora
          <FiArrowRight size={16} />
        </Link>
        <button
          type="button"
          onClick={cerrar}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/20"
          aria-label="Cerrar aviso de admisión"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  )
}
