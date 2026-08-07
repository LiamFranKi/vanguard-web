'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FiAlertTriangle,
  FiBookOpen,
  FiCheckCircle,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiUpload,
} from 'react-icons/fi'
import institucionData from '@/config/libro-reclamaciones.json'

const emptyForm = {
  nombre: '',
  email: '',
  telefono: '',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  domicilio: '',
  relacion: '',
  alumnoNombre: '',
  alumnoDni: '',
  tipo: '',
  bienContratado: 'Servicio educativo',
  fechaHecho: '',
  detalle: '',
  pedido: '',
  monto: '',
  acepta: false,
}

export default function LibroReclamaciones() {
  const [formData, setFormData] = useState(emptyForm)
  const [adjunto, setAdjunto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successNumero, setSuccessNumero] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target
    const { name, value } = target
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: target.checked }))
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessNumero('')

    try {
      const body = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          body.append(key, value ? 'true' : 'false')
        } else {
          body.append(key, value)
        }
      })
      if (adjunto) body.append('adjunto', adjunto)

      const response = await fetch('/api/libro-reclamaciones', {
        method: 'POST',
        body,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setErrorMsg(data.error || 'No se pudo enviar el registro')
        return
      }

      setSuccessNumero(data.numero || '')
      setFormData(emptyForm)
      setAdjunto(null)
    } catch {
      setErrorMsg('Error de conexión. Intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-start">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 border border-primary-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center">
                  <FiBookOpen size={22} />
                </div>
                <h2 className="text-2xl font-extrabold text-primary-800">Identificación del proveedor</h2>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li>
                  <strong className="text-gray-900">Razón social:</strong>{' '}
                  {institucionData.razonSocial}
                </li>
                <li>
                  <strong className="text-gray-900">Nombre comercial:</strong>{' '}
                  {institucionData.nombreComercial}
                </li>
                <li>
                  <strong className="text-gray-900">RUC:</strong> {institucionData.ruc}
                </li>
                <li className="flex gap-2">
                  <FiMapPin className="text-primary-600 mt-0.5 shrink-0" />
                  <span>{institucionData.direccion}</span>
                </li>
                <li className="flex gap-2">
                  <FiPhone className="text-primary-600 mt-0.5 shrink-0" />
                  <span>{institucionData.telefonos}</span>
                </li>
                <li className="flex gap-2">
                  <FiMail className="text-primary-600 mt-0.5 shrink-0" />
                  <span>{institucionData.email}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <FiAlertTriangle className="text-amber-600" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Reclamo</h3>
                  <p className="text-sm text-gray-600">
                    Disconformidad relacionada con el servicio educativo contratado, cuando se
                    solicita una solución concreta.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                  <FiFileText className="text-sky-600" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Queja</h3>
                  <p className="text-sm text-gray-600">
                    Malestar o descontento con la atención recibida, sin solicitar necesariamente
                    un resarcimiento contractual.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border-l-4 border-primary-600 rounded-r-xl p-4 text-sm text-gray-700">
              <p className="mb-2">
                Este es el canal formal de reclamos y quejas. Si solo desea compartir una mejora o
                felicitación, use{' '}
                <Link href="/sugerencias" className="text-primary-700 font-semibold underline">
                  Sugerencias
                </Link>
                .
              </p>
              <p className="text-xs text-gray-500">
                Tras enviar el formulario recibirá un número de registro y un correo de confirmación.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200">
            {successNumero ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <FiCheckCircle className="text-emerald-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registro exitoso</h2>
                <p className="text-gray-600 mb-4">
                  Su caso ha sido registrado en el Libro de Reclamaciones.
                </p>
                <p className="inline-block bg-primary-50 border border-primary-200 text-primary-800 font-bold px-6 py-3 rounded-xl text-lg mb-6">
                  N° {successNumero}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Conserve este número. También se envió un acuse a su correo electrónico.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccessNumero('')}
                  className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-900 transition-all"
                >
                  Registrar otro
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Formulario de registro</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Campos con <span className="text-primary-600 font-semibold">*</span> son
                  obligatorios.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Reclamante */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-primary-700 mb-3 border-b border-primary-100 pb-2">
                      1. Datos del reclamante
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="nombre">
                          Nombres y apellidos *
                        </label>
                        <input
                          id="nombre"
                          name="nombre"
                          required
                          value={formData.nombre}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                          placeholder="Como figura en su documento"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="tipoDocumento">
                            Tipo de documento *
                          </label>
                          <select
                            id="tipoDocumento"
                            name="tipoDocumento"
                            required
                            value={formData.tipoDocumento}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                          >
                            <option value="DNI">DNI</option>
                            <option value="CE">Carné de extranjería</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="numeroDocumento">
                            N° de documento *
                          </label>
                          <input
                            id="numeroDocumento"
                            name="numeroDocumento"
                            required
                            value={formData.numeroDocumento}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="Ej. 12345678"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                            Correo electrónico *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="tu@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="telefono">
                            Teléfono
                          </label>
                          <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="999 999 999"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="domicilio">
                          Domicilio
                        </label>
                        <input
                          id="domicilio"
                          name="domicilio"
                          value={formData.domicilio}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                          placeholder="Dirección de contacto"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="relacion">
                          Relación con el colegio
                        </label>
                        <select
                          id="relacion"
                          name="relacion"
                          value={formData.relacion}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                        >
                          <option value="">Seleccione</option>
                          <option value="Padre, madre o apoderado">Padre, madre o apoderado</option>
                          <option value="Estudiante">Estudiante</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Alumno */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-primary-700 mb-3 border-b border-primary-100 pb-2">
                      2. Datos del alumno (si aplica)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="alumnoNombre">
                          Nombre del alumno
                        </label>
                        <input
                          id="alumnoNombre"
                          name="alumnoNombre"
                          value={formData.alumnoNombre}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                          placeholder="Nombres y apellidos"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="alumnoDni">
                          DNI del alumno
                        </label>
                        <input
                          id="alumnoDni"
                          name="alumnoDni"
                          value={formData.alumnoDni}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                          placeholder="DNI"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detalle */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-primary-700 mb-3 border-b border-primary-100 pb-2">
                      3. Detalle del reclamo / queja
                    </h3>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="tipo">
                            Tipo *
                          </label>
                          <select
                            id="tipo"
                            name="tipo"
                            required
                            value={formData.tipo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                          >
                            <option value="">Seleccione</option>
                            <option value="reclamo">Reclamo</option>
                            <option value="queja">Queja</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="fechaHecho">
                            Fecha del hecho
                          </label>
                          <input
                            id="fechaHecho"
                            name="fechaHecho"
                            type="date"
                            value={formData.fechaHecho}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="bienContratado">
                            Bien o servicio
                          </label>
                          <input
                            id="bienContratado"
                            name="bienContratado"
                            value={formData.bienContratado}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="monto">
                            Monto reclamado (S/)
                          </label>
                          <input
                            id="monto"
                            name="monto"
                            value={formData.monto}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="Opcional"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="detalle">
                          Detalle *
                        </label>
                        <textarea
                          id="detalle"
                          name="detalle"
                          required
                          rows={4}
                          value={formData.detalle}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 resize-none"
                          placeholder="Describa los hechos de forma clara y ordenada"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="pedido">
                          Pedido del consumidor *
                        </label>
                        <textarea
                          id="pedido"
                          name="pedido"
                          required
                          rows={3}
                          value={formData.pedido}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 resize-none"
                          placeholder="¿Qué solicita? (respuesta, reunión, reembolso, aclaración, etc.)"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="adjunto">
                          Adjunto (PDF o imagen, máx. {institucionData.adjuntoMaxMb} MB)
                        </label>
                        <label className="flex items-center gap-3 w-full px-4 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50/40 transition-colors">
                          <FiUpload className="text-primary-600" size={20} />
                          <span className="text-sm text-gray-600 truncate">
                            {adjunto ? adjunto.name : 'Seleccionar archivo (opcional)'}
                          </span>
                          <input
                            id="adjunto"
                            name="adjunto"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                            className="hidden"
                            onChange={(e) => setAdjunto(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>

                      <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="acepta"
                          checked={formData.acepta}
                          onChange={handleChange}
                          required
                          className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span>
                          Declaro que la información consignada es verdadera y acepto el tratamiento
                          de mis datos personales para la atención de este registro. *
                        </span>
                      </label>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white px-6 py-3.5 rounded-xl font-bold hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <span>{isSubmitting ? 'Registrando...' : 'Registrar en el libro'}</span>
                    <FiSend className={isSubmitting ? 'animate-pulse' : ''} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
