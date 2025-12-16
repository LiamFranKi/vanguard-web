'use client'

import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Usamos la API genérica de formularios que lee config/formularios.json
      const response = await fetch('/api/formulario?tipo=contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          asunto: '',
          mensaje: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Información de Contacto */}
            <div className="bg-gradient-to-br from-cyan-300 via-sky-300 to-blue-300 rounded-2xl p-8 shadow-xl border border-cyan-400 relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
              </div>
              <div className="relative z-10">
              <h2 className="text-3xl font-bold text-primary-800 mb-6">
                Información de contacto
              </h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Teléfonos</h3>
                      <p className="text-gray-700">946 592 100 / 922 084 833</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                      <a href="mailto:admin@vanguardschools.edu.pe" className="text-cyan-600 hover:text-cyan-700 transition-colors break-words">
                        admin@vanguardschools.<wbr />edu.pe
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Dirección</h3>
                      <p className="text-gray-700">
                        Jr. Toribio de Luzuriaga Mz F<br />
                        lote 18 y 19 - SMP
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mapa */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 mt-4">
                  <div className="w-full" style={{ height: '300px' }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.234567890123!2d-77.0851712!3d-12.0140762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ce93e7332faf%3A0x5419c3e0a840d1a1!2sColegio%20Vanguard%20School!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                      title="Ubicación Vanguard Schools"
                    ></iframe>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    placeholder="Ingresa tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-gray-700 font-semibold mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    placeholder="999 999 999"
                  />
                </div>

                <div>
                  <label htmlFor="asunto" className="block text-gray-700 font-semibold mb-2">
                    Asunto *
                  </label>
                  <select
                    id="asunto"
                    name="asunto"
                    required
                    value={formData.asunto}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="admision">Admisión</option>
                    <option value="informacion">Información general</option>
                    <option value="niveles">Información sobre niveles</option>
                    <option value="convenios">Convenios</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-gray-700 font-semibold mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    required
                    rows={5}
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    ¡Mensaje enviado exitosamente! Te responderemos pronto.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white px-6 py-4 rounded-xl font-bold hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar mensaje'}</span>
                  <FiSend className={isSubmitting ? 'animate-pulse' : ''} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

