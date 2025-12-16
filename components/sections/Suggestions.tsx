'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiSmile, FiAlertCircle, FiThumbsUp, FiMessageSquare, FiSend } from 'react-icons/fi'

export default function Suggestions() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    relacion: '',
    tipo: '',
    mensaje: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/formulario?tipo=sugerencias', {
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
          relacion: '',
          tipo: '',
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          {/* Lado izquierdo: información y tarjetas */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-extrabold text-primary-800 mb-3">
                Tu opinión nos ayuda a mejorar
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Valoramos cada sugerencia, comentario o felicitación. Tus ideas nos permiten
                construir una experiencia educativa más cercana, segura y de mayor calidad para
                todos nuestros estudiantes y familias.
              </p>
            </div>

          <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiSmile className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sugerencias de mejora</h3>
                  <p className="text-sm text-gray-600">
                    Comparte ideas para mejorar nuestros servicios, procesos y espacios.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <FiAlertCircle className="text-amber-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Comentarios y alertas</h3>
                  <p className="text-sm text-gray-600">
                    Infórmanos sobre situaciones que requieren atención o acompañamiento.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <FiThumbsUp className="text-emerald-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Reconocimientos</h3>
                  <p className="text-sm text-gray-600">
                    Cuéntanos sobre experiencias positivas o personas que quieras reconocer.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <FiMessageSquare className="text-sky-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Comunicación cercana</h3>
                  <p className="text-sm text-gray-600">
                    Toda la información será tratada con respeto y confidencialidad.
                  </p>
                </div>
              </div>
            </div>

            {/* Fila de badges decorativos en escritorio para completar el espacio y centrar verticalmente */}
            <div className="hidden md:flex mt-10 flex-wrap gap-3 items-center justify-center">
              <div className="inline-flex items-center space-x-2 bg-white/80 border border-primary-100 rounded-full px-4 py-2 shadow-sm">
                <FiSmile className="text-primary-600" size={18} />
                <span className="text-sm font-semibold text-primary-800">Escuchamos tus ideas</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-white/80 border border-emerald-100 rounded-full px-4 py-2 shadow-sm">
                <FiThumbsUp className="text-emerald-600" size={18} />
                <span className="text-sm font-semibold text-emerald-800">Mejoramos cada año</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-white/80 border border-sky-100 rounded-full px-4 py-2 shadow-sm">
                <FiMessageSquare className="text-sky-600" size={18} />
                <span className="text-sm font-semibold text-sky-800">Tu voz cuenta</span>
              </div>
            </div>
          </div>

          {/* Lado derecho: formulario */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Envíanos tu sugerencia</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Los campos marcados con <span className="text-primary-600 font-semibold">*</span> son
              obligatorios.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="grid md:grid-cols-2 gap-4">
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
                    Teléfono (opcional)
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
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="relacion" className="block text-gray-700 font-semibold mb-2">
                    ¿Cuál es tu relación con el colegio? *
                  </label>
                  <select
                    id="relacion"
                    name="relacion"
                    required
                    value={formData.relacion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="padre-madre-apoderado">Padre, madre o apoderado</option>
                    <option value="estudiante">Estudiante</option>
                    <option value="docente-colaborador">Docente o colaborador</option>
                    <option value="visitante">Visitante / Interesado</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tipo" className="block text-gray-700 font-semibold mb-2">
                    Tipo de mensaje *
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    required
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="sugerencia">Sugerencia de mejora</option>
                    <option value="felicitacion">Felicitación / agradecimiento</option>
                    <option value="comentario">Comentario</option>
                    <option value="consulta">Consulta</option>
                    <option value="reclamo">Reclamo / queja</option>
                  </select>
                </div>
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
                  placeholder="Cuéntanos tu sugerencia, comentario o felicitación..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  ¡Gracias por tu mensaje! Hemos recibido tu sugerencia y la revisaremos con
                  atención.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  Ocurrió un error al enviar tu sugerencia. Por favor, intenta nuevamente en unos
                  momentos.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>{isSubmitting ? 'Enviando sugerencia...' : 'Enviar sugerencia'}</span>
                <FiSend className={isSubmitting ? 'animate-pulse' : ''} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}


