'use client'

import { useEffect, useState } from 'react'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { CONTACTO_WEB_RESPALDO } from '@/lib/contacto'

export default function ContactoFooter() {
  const [contacto, setContacto] = useState(CONTACTO_WEB_RESPALDO)

  useEffect(() => {
    let vivo = true
    fetch('/api/contacto-publico')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!vivo || !data?.telefonos) return
        setContacto({
          telefonos: String(data.telefonos),
          correo: String(data.correo || CONTACTO_WEB_RESPALDO.correo),
          direccion: String(data.direccion || CONTACTO_WEB_RESPALDO.direccion),
          whatsappUrl: String(data.whatsappUrl || CONTACTO_WEB_RESPALDO.whatsappUrl),
          telefonosSchema: Array.isArray(data.telefonosSchema)
            ? data.telefonosSchema
            : CONTACTO_WEB_RESPALDO.telefonosSchema,
        })
      })
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [])

  return (
    <>
      <li>
        <div className="flex items-start space-x-2">
          <FiPhone className="text-white mt-1 flex-shrink-0" size={14} />
          <div>
            <strong className="text-white">Teléfonos:</strong>
            <br />
            <span>{contacto.telefonos}</span>
          </div>
        </div>
      </li>
      <li className="pt-2">
        <div className="flex items-start space-x-2">
          <FiMapPin className="text-white mt-1 flex-shrink-0" size={14} />
          <div>
            <strong className="text-white">Dirección:</strong>
            <br />
            <span>{contacto.direccion}</span>
          </div>
        </div>
      </li>
      <li className="pt-2">
        <div className="flex items-start space-x-2">
          <FiMail className="text-white mt-1 flex-shrink-0" size={14} />
          <div>
            <strong className="text-white">Email:</strong>
            <br />
            <a href={`mailto:${contacto.correo}`} className="hover:text-white transition-colors">
              {contacto.correo}
            </a>
          </div>
        </div>
      </li>
    </>
  )
}
