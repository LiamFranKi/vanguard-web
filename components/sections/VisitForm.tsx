'use client'

import { useState } from 'react'
import { FiCalendar, FiClock, FiUsers, FiMail, FiPhone, FiSend } from 'react-icons/fi'

export default function VisitForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    nivelInteres: '',
    fechaPreferida: '',
    horarioPreferido: '',
    numeroEstudiantes: '',
    mensaje: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/formulario?tipo=visita-guiada', {
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
          nivelInteres: '',
          fechaPreferida: '',
          horarioPreferido: '',
          numeroEstudiantes: '',
          mensaje: '',
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
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Info lateral con resumen de pasos */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-sky-100 mb-8 md:mb-0 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary-800 mb-4">Reserva tu visita</h2>
                <p className="text-gray-700 mb-4">
                Completa este formulario y nuestro equipo de admisión se pondrá en contacto contigo
                para confirmar la fecha y hora de tu visita.
                </p>
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="text-primary-600" size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Elige la fecha y horario</p>
                      <p>Indícanos el día y la franja horaria que prefieres para tu visita.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiUsers className="text-primary-600" size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Número de asistentes</p>
                      <p>Cuéntanos cuántas personas asistirán para preparar todo con anticipación.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiClock className="text-primary-600" size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Confirmación rápida</p>
                      <p>Te contactaremos por correo o teléfono para validar tu visita.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges decorativos inferiores para llenar espacio */}
              <div className="hidden md:flex mt-10 flex-wrap gap-3 items-center justify-center">
                <div className="inline-flex items-center space-x-2 bg-white/80 border border-primary-100 rounded-full px-4 py-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-sm font-semibold text-primary-800">Visitas personalizadas</span>
                </div>
                <div className="inline-flex items-center space-x-2 bg-white/80 border border-emerald-100 rounded-full px-4 py-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-800">Conoce nuestra infraestructura</span>
                </div>
                <div className="inline-flex items-center space-x-2 bg-white/80 border border-sky-100 rounded-full px-4 py-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-sm font-semibold text-sky-800">Agenda en pocos pasos</span>
                </div>
              </div>
            </div>

            {/* Formulario principal */}
            <div className="md:col-span-3 bg-white rounded-2xl shadow-lg p-8 border border-sky-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Datos de contacto</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2">
                      Nombre completo *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3">
                      <FiUsers className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full py-2.5 outline-none text-gray-900"
                        placeholder="Ingresa tu nombre"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                      Email *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3">
                      <FiMail className="text-gray-400 mr-2" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full py-2.5 outline-none text-gray-900"
                        placeholder="tucorreo@ejemplo.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="telefono" className="block text-gray-700 font-semibold mb-2">
                      Teléfono de contacto *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3">
                      <FiPhone className="text-gray-400 mr-2" />
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full py-2.5 outline-none text-gray-900"
                        placeholder="946 000 000"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="nivelInteres" className="block text-gray-700 font-semibold mb-2">
                      Nivel de interés *
                    </label>
                    <select
                      id="nivelInteres"
                      name="nivelInteres"
                      required
                      value={formData.nivelInteres}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Selecciona un nivel</option>
                      <option value="Inicial">Inicial</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Todos los niveles">Todos los niveles</option>
                    </select>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-4">Detalles de la visita</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fechaPreferida" className="block text-gray-700 font-semibold mb-2">
                      Fecha preferida *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3">
                      <FiCalendar className="text-gray-400 mr-2" />
                      <input
                        type="date"
                        id="fechaPreferida"
                        name="fechaPreferida"
                        required
                        value={formData.fechaPreferida}
                        onChange={handleChange}
                        className="w-full py-2.5 outline-none text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="horarioPreferido" className="block text-gray-700 font-semibold mb-2">
                      Horario preferido *
                    </label>
                    <select
                      id="horarioPreferido"
                      name="horarioPreferido"
                      required
                      value={formData.horarioPreferido}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Selecciona una franja horaria</option>
                      <option value="Mañana (9:00 am - 11:00 am)">Mañana (9:00 am - 11:00 am)</option>
                      <option value="Mediodía (11:00 am - 1:00 pm)">Mediodía (11:00 am - 1:00 pm)</option>
                      <option value="Tarde (2:00 pm - 5:00 pm)">Tarde (2:00 pm - 5:00 pm)</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="numeroEstudiantes" className="block text-gray-700 font-semibold mb-2">
                      Número de estudiantes (aprox.) *
                    </label>
                    <input
                      type="number"
                      id="numeroEstudiantes"
                      name="numeroEstudiantes"
                      required
                      min={1}
                      value={formData.numeroEstudiantes}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Ej. 25"
                    />
                  </div>
                  <div>
                    <label htmlFor="mensaje" className="block text-gray-700 font-semibold mb-2">
                      Comentarios adicionales
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={3}
                      value={formData.mensaje}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 resize-none"
                      placeholder="Cuéntanos si tienes alguna necesidad especial o consulta específica."
                    />
                  </div>
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                    ¡Gracias por tu interés! Hemos recibido tu solicitud y nos pondremos en contacto para
                    confirmar la fecha y hora de tu visita.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente en unos minutos.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  <FiSend className={isSubmitting ? 'animate-spin' : ''} />
                  <span>{isSubmitting ? 'Enviando solicitud...' : 'Reservar visita guiada'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


