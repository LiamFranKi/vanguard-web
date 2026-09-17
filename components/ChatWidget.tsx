'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { TELEFONO_WHATSAPP_URL } from '@/lib/contacto'

const MENSAJE = encodeURIComponent('Hola, tengo una consulta sobre Vanguard Schools.')

export default function ChatWidget() {
  return (
    <a
      href={`${TELEFONO_WHATSAPP_URL}?text=${MENSAJE}`}
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
