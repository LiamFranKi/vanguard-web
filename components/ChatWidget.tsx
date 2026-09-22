'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { CONTACTO_WEB_RESPALDO } from '@/lib/contacto'

const MENSAJE = encodeURIComponent('Hola, tengo una consulta sobre Vanguard Schools.')

export default function ChatWidget() {
  const [whatsappUrl, setWhatsappUrl] = useState(CONTACTO_WEB_RESPALDO.whatsappUrl)

  useEffect(() => {
    let vivo = true
    fetch('/api/contacto-publico')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!vivo || !data?.whatsappUrl) return
        setWhatsappUrl(String(data.whatsappUrl))
      })
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [])

  return (
    <a
      href={`${whatsappUrl}?text=${MENSAJE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1ebe5d] transition-all transform hover:scale-110 flex items-center justify-center"
      aria-label="Escribir por WhatsApp"
      title="Escribir por WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  )
}
