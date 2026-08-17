'use client'

import { useState, useMemo, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiX, FiCalendar } from 'react-icons/fi'

interface Evento {
  tipo: string
  color: string
  colorTexto: string
  dia?: number
  rango?: {
    inicio: number
    fin: number
  }
  texto: string
}

interface MesData {
  nombre: string
  eventos: Evento[]
}

type MesNumero = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

const MESES: MesNumero[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const NOMBRES_MESES = [
  '',
  '',
  '',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export default function CalendarizationCalendar() {
  const [año, setAño] = useState(2026)
  const [mesesData, setMesesData] = useState<Record<string, MesData>>({})
  const [loaded, setLoaded] = useState(false)
  const [mesActual, setMesActual] = useState<MesNumero>(3)
  const [selectedDay, setSelectedDay] = useState<{
    dia: number
    eventos: Evento[]
    nombreMes: string
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/calendarizacion', { cache: 'no-store', headers: { Pragma: 'no-cache' } })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data) return
        if (data.año) setAño(Number(data.año))
        if (data.meses && typeof data.meses === 'object') {
          setMesesData(data.meses as Record<string, MesData>)
          const keys = Object.keys(data.meses)
            .map(Number)
            .filter((m) => m >= 3 && m <= 12)
            .sort((a, b) => a - b)
          if (keys.length > 0) {
            setMesActual(keys[0] as MesNumero)
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const mesData = mesesData[mesActual.toString()] as MesData | undefined

  const obtenerInfoMes = (añoNum: number, mes: number) => {
    const primerDia = new Date(añoNum, mes - 1, 1)
    const ultimoDia = new Date(añoNum, mes, 0)
    const diaSemanaInicio = primerDia.getDay()
    const diasEnMes = ultimoDia.getDate()
    return { diaSemanaInicio, diasEnMes }
  }

  const { diaSemanaInicio, diasEnMes } = obtenerInfoMes(año, mesActual)

  const obtenerEventosDia = (dia: number): Evento[] => {
    if (!mesData) return []

    return mesData.eventos.filter((evento) => {
      if (evento.dia === dia) return true
      if (evento.rango) {
        return dia >= evento.rango.inicio && dia <= evento.rango.fin
      }
      return false
    })
  }

  const diasCalendario = useMemo(() => {
    const dias: (number | null)[] = []
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null)
    }
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(i)
    }
    return dias
  }, [diaSemanaInicio, diasEnMes])

  const navegarMes = (direccion: 'anterior' | 'siguiente') => {
    const indiceActual = MESES.indexOf(mesActual)
    if (direccion === 'anterior' && indiceActual > 0) {
      setMesActual(MESES[indiceActual - 1])
    } else if (direccion === 'siguiente' && indiceActual < MESES.length - 1) {
      setMesActual(MESES[indiceActual + 1])
    }
  }

  const abrirModalEventos = (dia: number, eventos: Evento[]) => {
    setSelectedDay({ dia, eventos, nombreMes: NOMBRES_MESES[mesActual] })
  }

  const cerrarModal = () => setSelectedDay(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDay) cerrarModal()
    }
    if (selectedDay) {
      window.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedDay])

  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ]

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {!loaded && (
        <p className="text-center text-gray-500 mb-4 text-sm">Cargando calendarización…</p>
      )}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navegarMes('anterior')}
          disabled={mesActual === 3}
          className={`p-2 rounded-lg transition-all ${
            mesActual === 3
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          <FiChevronLeft size={24} />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {NOMBRES_MESES[mesActual]} {año}
        </h2>

        <button
          onClick={() => navegarMes('siguiente')}
          disabled={mesActual === 12}
          className={`p-2 rounded-lg transition-all ${
            mesActual === 12
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {MESES.map((mes) => (
          <button
            key={mes}
            onClick={() => setMesActual(mes)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              mesActual === mes
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {NOMBRES_MESES[mes].substring(0, 3)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="text-center font-semibold text-gray-700 py-2 bg-gray-50 rounded-lg text-sm md:text-base"
              >
                {dia.substring(0, 3)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {diasCalendario.map((dia, index) => {
              if (dia === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[120px] bg-gray-50 rounded-lg"
                  />
                )
              }

              const eventos = obtenerEventosDia(dia)

              const esDiaActual =
                new Date().getDate() === dia &&
                new Date().getMonth() + 1 === mesActual &&
                new Date().getFullYear() === año

              return (
                <div
                  key={`dia-${dia}`}
                  onClick={
                    eventos.length > 0
                      ? () => abrirModalEventos(dia, eventos)
                      : undefined
                  }
                  role={eventos.length > 0 ? 'button' : undefined}
                  tabIndex={eventos.length > 0 ? 0 : undefined}
                  onKeyDown={
                    eventos.length > 0
                      ? (e) => e.key === 'Enter' && abrirModalEventos(dia, eventos)
                      : undefined
                  }
                  className={`min-h-[120px] md:min-h-[140px] border-2 rounded-lg p-2 bg-white transition-all ${
                    esDiaActual
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-primary-300'
                  } ${
                    eventos.length > 0
                      ? 'cursor-pointer lg:cursor-default md:active:scale-[0.98] lg:active:scale-100 hover:ring-2 hover:ring-primary-400/50 lg:hover:ring-0'
                      : ''
                  }`}
                >
                  <div
                    className={`text-sm font-bold mb-1 flex items-center justify-between ${
                      esDiaActual ? 'text-primary-700' : 'text-gray-700'
                    }`}
                  >
                    <span>
                      {dia}
                      {esDiaActual && (
                        <span className="ml-1 text-xs text-primary-600">●</span>
                      )}
                    </span>
                    {eventos.length > 0 && (
                      <span className="text-[10px] text-primary-600 font-medium lg:hidden">
                        Toca
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 flex flex-col overflow-hidden">
                    {eventos.slice(0, 3).map((evento, eventoIndex) => (
                      <div
                        key={`evento-${dia}-${eventoIndex}`}
                        className="text-[9px] md:text-[10px] font-semibold p-1 rounded text-center leading-tight break-words"
                        style={{
                          backgroundColor: evento.color,
                          color: evento.colorTexto,
                        }}
                        title={evento.texto}
                      >
                        {evento.texto.split('\n').map((linea, i) => (
                          <div key={i} className="truncate">
                            {linea}
                          </div>
                        ))}
                      </div>
                    ))}
                    {eventos.length > 3 && (
                      <div className="text-[9px] font-semibold text-gray-600 text-center p-1">
                        +{eventos.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selectedDay && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
          onClick={cerrarModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
        >
          <div
            className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-2 border-primary-200 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <FiCalendar size={24} />
                </div>
                <div>
                  <h2 id="modal-titulo" className="text-xl font-bold">
                    {selectedDay.dia} de {selectedDay.nombreMes} {año}
                  </h2>
                  <p className="text-sm text-white/90">
                    {selectedDay.eventos.length}{' '}
                    {selectedDay.eventos.length === 1 ? 'evento' : 'eventos'}
                  </p>
                </div>
              </div>
              <button
                onClick={cerrarModal}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {selectedDay.eventos.map((evento, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl shadow-lg border-l-4 transition-transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: `${evento.color}15`,
                    borderLeftColor: evento.color,
                  }}
                >
                  <p
                    className="font-semibold text-base leading-relaxed whitespace-pre-line"
                    style={{ color: evento.color }}
                  >
                    {evento.texto}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={cerrarModal}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
