'use client'

import { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiSend, FiCheckCircle } from 'react-icons/fi'

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    nombresEstudiante: '',
    apellidosEstudiante: '',
    nombresApoderado: '',
    dniApoderado: '',
    telefonoApoderado: '',
    emailApoderado: '',
    direccionApoderado: '',
    grado: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const grados = [
    'Inicial 03 Años',
    'Inicial 04 Años',
    'Inicial 05 Años',
    '1° Grado Primaria',
    '2° Grado Primaria',
    '3° Grado Primaria',
    '4° Grado Primaria',
    '5° Grado Primaria',
    '6° Grado Primaria',
    '1° Año Secundaria',
    '2° Año Secundaria',
    '3° Año Secundaria',
    '4° Año Secundaria',
    '5° Año Secundaria',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/formulario?tipo=admisión', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: `${formData.nombresApoderado} (Apoderado)`,
          email: formData.emailApoderado,
          ...formData,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          nombresEstudiante: '',
          apellidosEstudiante: '',
          nombresApoderado: '',
          dniApoderado: '',
          telefonoApoderado: '',
          emailApoderado: '',
          direccionApoderado: '',
          grado: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Card principal del formulario */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Formulario */}
            <div className="p-6 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos del Estudiante */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiUser className="text-amber-700" size={24} />
                    <span>Datos del Estudiante</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombresEstudiante" className="block text-gray-700 font-semibold mb-2">
                        Nombres del Estudiante *
                      </label>
                      <input
                        type="text"
                        id="nombresEstudiante"
                        name="nombresEstudiante"
                        required
                        value={formData.nombresEstudiante}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-amber-700 transition-all text-gray-900"
                        placeholder="Ingresa los nombres"
                      />
                    </div>
                    <div>
                      <label htmlFor="apellidosEstudiante" className="block text-gray-700 font-semibold mb-2">
                        Apellidos del Estudiante *
                      </label>
                      <input
                        type="text"
                        id="apellidosEstudiante"
                        name="apellidosEstudiante"
                        required
                        value={formData.apellidosEstudiante}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-amber-700 transition-all text-gray-900"
                        placeholder="Ingresa los apellidos"
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del Apoderado */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiUser className="text-amber-700" size={24} />
                    <span>Datos del Apoderado</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombresApoderado" className="block text-gray-700 font-semibold mb-2">
                        Nombres Apoderado *
                      </label>
                      <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-amber-700 focus-within:border-amber-700 transition-all">
                        <FiUser className="text-gray-400 mr-2" size={20} />
                        <input
                          type="text"
                          id="nombresApoderado"
                          name="nombresApoderado"
                          required
                          value={formData.nombresApoderado}
                          onChange={handleChange}
                          className="w-full py-3 outline-none text-gray-900"
                          placeholder="Nombres completos"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="dniApoderado" className="block text-gray-700 font-semibold mb-2">
                        DNI Apoderado *
                      </label>
                      <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-amber-700 focus-within:border-amber-700 transition-all">
                        <FiFileText className="text-gray-400 mr-2" size={20} />
                        <input
                          type="text"
                          id="dniApoderado"
                          name="dniApoderado"
                          required
                          maxLength={8}
                          pattern="[0-9]{8}"
                          value={formData.dniApoderado}
                          onChange={handleChange}
                          className="w-full py-3 outline-none text-gray-900"
                          placeholder="12345678"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="telefonoApoderado" className="block text-gray-700 font-semibold mb-2">
                        Teléfono Apoderado *
                      </label>
                      <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-amber-700 focus-within:border-amber-700 transition-all">
                        <FiPhone className="text-gray-400 mr-2" size={20} />
                        <input
                          type="tel"
                          id="telefonoApoderado"
                          name="telefonoApoderado"
                          required
                          value={formData.telefonoApoderado}
                          onChange={handleChange}
                          className="w-full py-3 outline-none text-gray-900"
                          placeholder="946 592 100"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="emailApoderado" className="block text-gray-700 font-semibold mb-2">
                        Email Apoderado *
                      </label>
                      <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-amber-700 focus-within:border-amber-700 transition-all">
                        <FiMail className="text-gray-400 mr-2" size={20} />
                        <input
                          type="email"
                          id="emailApoderado"
                          name="emailApoderado"
                          required
                          value={formData.emailApoderado}
                          onChange={handleChange}
                          className="w-full py-3 outline-none text-gray-900"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="direccionApoderado" className="block text-gray-700 font-semibold mb-2">
                        Dirección Apoderado *
                      </label>
                      <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-amber-700 focus-within:border-amber-700 transition-all">
                        <FiMapPin className="text-gray-400 mr-2" size={20} />
                        <input
                          type="text"
                          id="direccionApoderado"
                          name="direccionApoderado"
                          required
                          value={formData.direccionApoderado}
                          onChange={handleChange}
                          className="w-full py-3 outline-none text-gray-900"
                          placeholder="Dirección completa"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grado */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiCheckCircle className="text-amber-700" size={24} />
                    <span>Grado de Interés</span>
                  </h3>
                  <div>
                    <label htmlFor="grado" className="block text-gray-700 font-semibold mb-2">
                      Elige un Grado *
                    </label>
                    <select
                      id="grado"
                      name="grado"
                      required
                      value={formData.grado}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-amber-700 transition-all text-gray-900 bg-white"
                    >
                      <option value="">Selecciona un grado</option>
                      {grados.map((grado) => (
                        <option key={grado} value={grado}>
                          {grado}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mensajes de estado */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl text-sm font-medium flex items-center space-x-2">
                    <FiCheckCircle size={20} />
                    <span>
                      ¡Gracias por tu interés! Hemos recibido tu solicitud de admisión y nos pondremos en contacto contigo a la brevedad.
                    </span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl text-sm font-medium">
                    Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente en unos minutos.
                  </div>
                )}

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <FiSend className={isSubmitting ? 'animate-spin' : ''} size={22} />
                  <span>{isSubmitting ? 'Enviando solicitud...' : 'Registrarme'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

