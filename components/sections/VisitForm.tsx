'use client'

import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiUsers, FiMail, FiPhone, FiSend } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { es } from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('es', es)
setDefaultLocale('es')

type VisitaConfig = {
  diasSemana: number[]
  diasEtiquetas: { dia_semana: number; etiqueta: string }[]
  horarios: { id: number; etiqueta: string }[]
  fechas: string[]
  modoFechas: 'semana' | 'lista'
  mensajeDias: string
  disponible: boolean
}

/** Estado inicial vacío hasta cargar API (no asumir Martes/Jueves) */
const EMPTY_CONFIG: VisitaConfig = {
  diasSemana: [],
  diasEtiquetas: [],
  horarios: [],
  fechas: [],
  modoFechas: 'semana',
  mensajeDias: '',
  disponible: false,
}

export default function VisitForm() {
  const [config, setConfig] = useState<VisitaConfig>(EMPTY_CONFIG)
  const [configLoaded, setConfigLoaded] = useState(false)

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
  const [errorMsg, setErrorMsg] = useState('')

  const visitasDisponibles =
    configLoaded &&
    config.disponible !== false &&
    config.horarios.length > 0 &&
    ((config.modoFechas === 'lista' && config.fechas.length > 0) ||
      (config.modoFechas !== 'lista' && config.diasSemana.length > 0))

  useEffect(() => {
    let cancelled = false
    const url = `/api/visitas-disponibilidad?t=${Date.now()}`
    fetch(url, { cache: 'no-store', headers: { Pragma: 'no-cache' } })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data || typeof data !== 'object') return
        const diasSemana = Array.isArray(data.diasSemana) ? data.diasSemana : []
        const horarios = Array.isArray(data.horarios) ? data.horarios : []
        const fechas = Array.isArray(data.fechas) ? data.fechas.map(String) : []
        const modoFechas = data.modoFechas === 'lista' ? 'lista' : 'semana'
        const disponible =
          data.disponible !== false &&
          horarios.length > 0 &&
          (modoFechas === 'lista' ? fechas.length > 0 : diasSemana.length > 0)
        setConfig({
          diasSemana,
          diasEtiquetas: Array.isArray(data.diasEtiquetas) ? data.diasEtiquetas : [],
          horarios,
          fechas,
          modoFechas,
          mensajeDias:
            data.mensajeDias ||
            (disponible ? 'días configurados' : 'No hay días disponibles'),
          disponible,
        })
      })
      .catch(() => {
        // Sin API: dejar cerrado (no inventar Martes/Jueves en el cliente)
        if (!cancelled) {
          setConfig({
            ...EMPTY_CONFIG,
            mensajeDias: 'No hay días disponibles',
            disponible: false,
          })
        }
      })
      .finally(() => {
        if (!cancelled) setConfigLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const preventAutofill = () => {
      const input = document.getElementById('fechaPreferida') as HTMLInputElement
      if (input) {
        input.setAttribute('autocomplete', 'off')
        input.setAttribute('data-form-type', 'other')
        input.setAttribute('data-lpignore', 'true')
        input.setAttribute('data-1p-ignore', 'true')
      }
    }
    preventAutofill()
    const timer = setTimeout(preventAutofill, 100)
    return () => clearTimeout(timer)
  }, [formData.fechaPreferida])

  const horariosDisponibles = config.horarios

  useEffect(() => {
    if (
      formData.horarioPreferido &&
      !horariosDisponibles.some((h) => h.etiqueta === formData.horarioPreferido)
    ) {
      setFormData((prev) => ({ ...prev, horarioPreferido: '' }))
    }
  }, [horariosDisponibles, formData.horarioPreferido])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitasDisponibles) {
      setErrorMsg('Por el momento no hay visitas disponibles')
      setSubmitStatus('error')
      return
    }
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMsg('')

    try {
      const response = await fetch('/api/formulario?tipo=visita-guiada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const data = await response.json().catch(() => ({}))
        setErrorMsg(String(data?.error || ''))
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      setFormData((prev) => ({
        ...prev,
        fechaPreferida: `${year}-${month}-${day}`,
      }))
    } else {
      setFormData((prev) => ({ ...prev, fechaPreferida: '' }))
    }
  }

  const toYmd = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const usaFechasConcretas = config.modoFechas === 'lista' || config.fechas.length > 0

  const filterDate = (date: Date) => {
    if (usaFechasConcretas) return config.fechas.includes(toYmd(date))
    return config.diasSemana.includes(date.getDay())
  }

  const getMinDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (usaFechasConcretas && config.fechas.length) {
      const [y, m, d] = config.fechas[0].split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    const candidate = new Date(today)
    candidate.setDate(today.getDate() + 1)
    for (let i = 0; i < 21; i++) {
      if (config.diasSemana.includes(candidate.getDay())) {
        return candidate
      }
      candidate.setDate(candidate.getDate() + 1)
    }
    return candidate
  }

  const getMaxDate = () => {
    if (usaFechasConcretas && config.fechas.length) {
      const last = config.fechas[config.fechas.length - 1]
      const [y, m, d] = last.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    return undefined
  }

  const getSelectedDate = () => {
    if (!formData.fechaPreferida) return null
    const [year, month, day] = formData.fechaPreferida.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const isValidDay = (dateString: string) => {
    if (!dateString) return false
    if (usaFechasConcretas) return config.fechas.includes(dateString)
    const [year, month, day] = dateString.split('-').map(Number)
    return config.diasSemana.includes(new Date(year, month - 1, day).getDay())
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-start">
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

                {configLoaded && !visitasDisponibles && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg text-sm">
                    Por el momento no hay visitas disponibles. Vuelve a intentarlo más adelante o
                    contáctanos por teléfono.
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fechaPreferida" className="block text-gray-700 font-semibold mb-2">
                      Fecha preferida *
                    </label>
                    <div
                      className={`flex items-center border rounded-lg px-3 transition-colors ${
                        !visitasDisponibles
                          ? 'border-gray-200 bg-gray-50 opacity-70'
                          : formData.fechaPreferida && isValidDay(formData.fechaPreferida)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300'
                      }`}
                    >
                      <FiCalendar
                        className={`mr-2 flex-shrink-0 ${
                          formData.fechaPreferida && isValidDay(formData.fechaPreferida)
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <DatePicker
                        selected={getSelectedDate()}
                        onChange={handleDateChange}
                        filterDate={filterDate}
                        minDate={visitasDisponibles ? getMinDate() : new Date()}
                        maxDate={visitasDisponibles ? getMaxDate() : undefined}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={
                          !configLoaded
                            ? 'Cargando…'
                            : visitasDisponibles
                              ? 'Selecciona una fecha'
                              : 'Sin fechas disponibles'
                        }
                        disabled={!visitasDisponibles}
                        className={`w-full py-2.5 outline-none text-gray-900 date-picker-no-autofill ${
                          formData.fechaPreferida && isValidDay(formData.fechaPreferida)
                            ? 'bg-green-50 text-green-900 font-semibold'
                            : ''
                        }`}
                        locale="es"
                        showPopperArrow={false}
                        name="fechaPreferida"
                        id="fechaPreferida"
                        autoComplete="off"
                        autoFocus={false}
                      />
                      <input
                        type="hidden"
                        name="fechaPreferida"
                        value={formData.fechaPreferida}
                        required={visitasDisponibles}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center flex-wrap">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          visitasDisponibles ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                      />
                      {visitasDisponibles ? (
                        <>
                          Días disponibles:
                          <strong className="text-green-600 ml-1">
                            {config.mensajeDias}
                          </strong>
                        </>
                      ) : (
                        <strong className="text-amber-700 ml-1">
                          {configLoaded
                            ? config.mensajeDias || 'No hay días disponibles'
                            : 'Cargando disponibilidad…'}
                        </strong>
                      )}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="horarioPreferido" className="block text-gray-700 font-semibold mb-2">
                      Horario preferido *
                    </label>
                    <select
                      id="horarioPreferido"
                      name="horarioPreferido"
                      required={visitasDisponibles}
                      disabled={!visitasDisponibles}
                      value={formData.horarioPreferido}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 disabled:bg-gray-50 disabled:opacity-70"
                    >
                      <option value="">
                        {visitasDisponibles
                          ? 'Selecciona una franja horaria'
                          : 'Sin horarios disponibles'}
                      </option>
                      {horariosDisponibles.map((h) => (
                        <option key={`${h.id}-${h.etiqueta}`} value={h.etiqueta}>
                          {h.etiqueta}
                        </option>
                      ))}
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
                    {errorMsg ||
                      'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente en unos minutos.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !visitasDisponibles}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  <FiSend className={isSubmitting ? 'animate-spin' : ''} />
                  <span>
                    {!configLoaded
                      ? 'Cargando…'
                      : !visitasDisponibles
                        ? 'Visitas no disponibles'
                        : isSubmitting
                          ? 'Enviando solicitud...'
                          : 'Reservar visita guiada'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
