'use client'

import { useState } from 'react'
import { FiMail, FiPhone, FiUser, FiBriefcase, FiFileText, FiSend } from 'react-icons/fi'

export default function WorkWithUsForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    puesto: '',
    mensaje: '',
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && file.type !== 'application/pdf') {
      setErrorMessage('Por favor, adjunta tu CV en formato PDF.')
      setCvFile(null)
      return
    }
    setErrorMessage(null)
    setCvFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage(null)

    if (!cvFile) {
      setErrorMessage('Por favor, adjunta tu CV en formato PDF.')
      setIsSubmitting(false)
      return
    }

    try {
      const data = new FormData()
      data.append('nombre', formData.nombre)
      data.append('email', formData.email)
      data.append('telefono', formData.telefono)
      data.append('puesto', formData.puesto)
      data.append('mensaje', formData.mensaje)
      data.append('cv', cvFile)

      const response = await fetch('/api/trabaja-con-nosotros', {
        method: 'POST',
        body: data,
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          puesto: '',
          mensaje: '',
        })
        setCvFile(null)
      } else {
        const json = await response.json().catch(() => null)
        setErrorMessage(json?.error || 'Ocurrió un error al enviar tu postulación.')
        setSubmitStatus('error')
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error al enviar tu postulación.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-start">
          {/* Columna izquierda: texto motivacional */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-primary-100 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-primary-800 mb-4">
                Únete a nuestro equipo
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-4" />
              <p className="text-gray-700 mb-4">
                En Vanguard Schools buscamos profesionales comprometidos con la educación,
                la innovación y la formación integral de nuestros estudiantes.
              </p>
              <p className="text-gray-700 mb-4">
                Completa el formulario y adjunta tu curriculum vitae en formato PDF. Nuestro
                equipo de Recursos Humanos revisará tu perfil y se comunicará contigo en caso
                de existir una vacante acorde a tu experiencia.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm mt-4">
                <li>• Docentes para Inicial, Primaria y Secundaria.</li>
                <li>• Especialistas en inglés, tecnología y robótica.</li>
                <li>• Personal administrativo y de soporte educativo.</li>
              </ul>
            </div>

            {/* Badges decorativos inferiores para llenar espacio */}
            <div className="hidden md:flex mt-10 flex-wrap gap-3 items-center justify-center">
              <div className="inline-flex items-center space-x-2 bg-white/80 border border-primary-100 rounded-full px-4 py-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-sm font-semibold text-primary-800">Talento con propósito</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-white/80 border border-emerald-100 rounded-full px-4 py-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-emerald-800">Crecimiento profesional</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-white/80 border border-sky-100 rounded-full px-4 py-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-sm font-semibold text-sky-800">Ambiente innovador</span>
              </div>
            </div>
          </div>

          {/* Columna derecha: formulario */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-primary-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Enviar postulación
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2">
                    Nombre completo *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3">
                    <FiUser className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full py-2.5 outline-none text-gray-900"
                      placeholder="Ingresa tu nombre completo"
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
                  <label htmlFor="puesto" className="block text-gray-700 font-semibold mb-2">
                    Puesto o área de interés *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3">
                    <FiBriefcase className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="puesto"
                      name="puesto"
                      required
                      value={formData.puesto}
                      onChange={handleChange}
                      className="w-full py-2.5 outline-none text-gray-900"
                      placeholder="Ej. Docente de Primaria, Inglés, Administración..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="cv" className="block text-gray-700 font-semibold mb-2">
                  Curriculum vitae (PDF) *
                </label>
                <label
                  htmlFor="cv"
                  className="flex items-center justify-between border-2 border-dashed border-primary-200 rounded-xl px-4 py-3 cursor-pointer hover:border-primary-400 hover:bg-primary-50/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <FiFileText className="text-primary-600" size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {cvFile ? cvFile.name : 'Haz clic para adjuntar tu CV (PDF)'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Tamaño máximo recomendado: 5 MB
                      </span>
                    </div>
                  </div>
                </label>
                <input
                  id="cv"
                  name="cv"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-gray-700 font-semibold mb-2">
                  Mensaje o resumen de experiencia
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 resize-none"
                  placeholder="Cuéntanos brevemente sobre tu experiencia, formación y por qué deseas trabajar en Vanguard Schools."
                />
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  ¡Gracias por tu interés! Hemos recibido tu postulación y nuestro equipo de Recursos
                  Humanos la revisará a la brevedad.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-60"
              >
                <FiSend className={isSubmitting ? 'animate-spin' : ''} />
                <span>{isSubmitting ? 'Enviando postulación...' : 'Enviar postulación'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}


